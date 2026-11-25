import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { calculateReadingTime, isDuplicateTitle } from '@/lib/content-engine/rule-engine';
import { logAuditEvent } from '@/lib/auth/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const status = searchParams.get('status');
    const isFeatured = searchParams.get('featured');
    const isTrending = searchParams.get('trending');
    const isBreaking = searchParams.get('breaking');
    const query = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (status) {
      if (status === 'UNPUBLISHED') {
        where.status = { not: 'PUBLISHED' };
      } else {
        where.status = status;
      }
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }

    if (isTrending !== null && isTrending !== undefined) {
      where.isTrending = isTrending === 'true';
    }

    if (isBreaking !== null && isBreaking !== undefined) {
      where.isBreaking = isBreaking === 'true';
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true, color: true } },
          subcategory: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, slug: true, avatar: true, roleTitle: true } },
          tags: { include: { tag: true } },
        },
        orderBy: [
          { isBreaking: 'desc' },
          { publicationDate: 'desc' },
          { updatedDate: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const response = NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error: any) {
    console.error('Articles fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user, 'article:create')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      slug: customSlug,
      shortDescription,
      content,
      featuredImage,
      imageAlt,
      categoryId,
      subcategoryId,
      tagIds,
      status = 'DRAFT',
      isFeatured = false,
      isTrending = false,
      isBreaking = false,
      scheduledFor,
      seoTitle,
      seoDescription,
      canonicalUrl,
      sourceAttribution,
      sourceName,
      sourceUrl,
    } = body;

    if (!title || !shortDescription || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, short description, content, and category are required.' },
        { status: 400 }
      );
    }

    // Check duplicate title against existing published/draft articles
    const existingArticles = await prisma.article.findMany({
      select: { title: true },
      take: 200,
    });
    const dupCheck = isDuplicateTitle(title, existingArticles.map((a) => a.title));
    if (dupCheck.isDuplicate && dupCheck.similarity >= 0.95) {
      return NextResponse.json(
        {
          error: `An article with an identical or near-duplicate title already exists: "${dupCheck.matchedTitle}".`,
        },
        { status: 409 }
      );
    }

    // Auto-generate clean slug if not specified
    let slug = customSlug
      ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Ensure slug uniqueness
    const slugExists = await prisma.article.findUnique({ where: { slug } });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Assign Author profile
    let authorId = user.author?.id;
    if (!authorId) {
      const defaultAuthor = await prisma.author.findFirst({
        where: { slug: 'editorial-board' },
      });
      authorId = defaultAuthor?.id || '';
    }

    const readingTime = calculateReadingTime(content);

    const publicationDate =
      status === 'PUBLISHED'
        ? new Date()
        : null;

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        shortDescription,
        content,
        featuredImage: featuredImage || null,
        imageAlt: imageAlt || null,
        categoryId,
        subcategoryId: subcategoryId || null,
        authorId,
        status,
        readingTime,
        publicationDate,
        isFeatured: Boolean(isFeatured),
        isTrending: Boolean(isTrending),
        isBreaking: Boolean(isBreaking),
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || shortDescription,
        canonicalUrl: canonicalUrl || null,
        sourceAttribution: sourceAttribution || null,
        sourceName: sourceName || null,
        sourceUrl: sourceUrl || null,
      },
    });

    // Attach tags if provided
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await prisma.articleTag.create({
          data: {
            articleId: article.id,
            tagId,
          },
        }).catch(() => {});
      }
    }

    // Handle scheduled post
    if (status === 'SCHEDULED' && scheduledFor) {
      await prisma.scheduledPost.create({
        data: {
          articleId: article.id,
          scheduledFor: new Date(scheduledFor),
          status: 'PENDING',
        },
      });
    }

    await logAuditEvent({
      userId: user.id,
      action: 'ARTICLE_CREATE',
      entityType: 'Article',
      entityId: article.id,
      details: { title, slug, status },
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/articles');
      if (article.slug) {
        revalidatePath(`/articles/${article.slug}`);
      }
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error: any) {
    console.error('Article creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create article' }, { status: 500 });
  }
}
