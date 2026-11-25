import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { calculateReadingTime } from '@/lib/content-engine/rule-engine';
import { logAuditEvent } from '@/lib/auth/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        subcategory: true,
        author: true,
        tags: { include: { tag: true } },
        images: true,
        scheduledPost: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error: any) {
    console.error('Fetch article by id error:', error);
    return NextResponse.json({ error: 'Failed to retrieve article' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user, 'article:edit')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const readingTime = body.content ? calculateReadingTime(body.content) : existing.readingTime;

    let publicationDate = existing.publicationDate;
    if (body.status === 'PUBLISHED' && !existing.publicationDate) {
      publicationDate = new Date();
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        shortDescription: body.shortDescription !== undefined ? body.shortDescription : existing.shortDescription,
        content: body.content !== undefined ? body.content : existing.content,
        featuredImage: body.featuredImage !== undefined ? body.featuredImage : existing.featuredImage,
        imageAlt: body.imageAlt !== undefined ? body.imageAlt : existing.imageAlt,
        categoryId: body.categoryId || existing.categoryId,
        subcategoryId: body.subcategoryId !== undefined ? body.subcategoryId : existing.subcategoryId,
        status: body.status || existing.status,
        readingTime,
        publicationDate,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
        isTrending: body.isTrending !== undefined ? Boolean(body.isTrending) : existing.isTrending,
        isBreaking: body.isBreaking !== undefined ? Boolean(body.isBreaking) : existing.isBreaking,
        seoTitle: body.seoTitle !== undefined ? body.seoTitle : existing.seoTitle,
        seoDescription: body.seoDescription !== undefined ? body.seoDescription : existing.seoDescription,
        canonicalUrl: body.canonicalUrl !== undefined ? body.canonicalUrl : existing.canonicalUrl,
        sourceAttribution: body.sourceAttribution !== undefined ? body.sourceAttribution : existing.sourceAttribution,
        sourceName: body.sourceName !== undefined ? body.sourceName : existing.sourceName,
        sourceUrl: body.sourceUrl !== undefined ? body.sourceUrl : existing.sourceUrl,
      },
    });

    if (Array.isArray(body.tagIds)) {
      // Refresh tags
      await prisma.articleTag.deleteMany({ where: { articleId: id } });
      for (const tagId of body.tagIds) {
        await prisma.articleTag.create({
          data: { articleId: id, tagId },
        }).catch(() => {});
      }
    }

    await logAuditEvent({
      userId: user.id,
      action: 'ARTICLE_UPDATE',
      entityType: 'Article',
      entityId: id,
      details: { title: updated.title, status: updated.status },
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/articles');
      if (updated.slug) {
        revalidatePath(`/articles/${updated.slug}`);
      }
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    console.error('Update article error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user, 'article:delete')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await prisma.article.delete({ where: { id } });

    await logAuditEvent({
      userId: user.id,
      action: 'ARTICLE_DELETE',
      entityType: 'Article',
      entityId: id,
      details: { title: existing.title, slug: existing.slug },
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/articles');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error: any) {
    console.error('Delete article error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
