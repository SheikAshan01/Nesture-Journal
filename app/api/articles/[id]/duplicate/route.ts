import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'article:create')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const source = await prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!source) {
      return NextResponse.json({ error: 'Source article not found' }, { status: 404 });
    }

    const newTitle = `${source.title} (Copy)`;
    const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;

    const duplicate = await prisma.article.create({
      data: {
        title: newTitle,
        slug: newSlug,
        shortDescription: source.shortDescription,
        content: source.content,
        featuredImage: source.featuredImage,
        imageAlt: source.imageAlt,
        categoryId: source.categoryId,
        subcategoryId: source.subcategoryId,
        authorId: source.authorId,
        status: 'DRAFT',
        readingTime: source.readingTime,
        seoTitle: newTitle,
        seoDescription: source.seoDescription,
        isFeatured: false,
        isTrending: false,
        isBreaking: false,
      },
    });

    // Copy tags
    for (const at of source.tags) {
      await prisma.articleTag.create({
        data: {
          articleId: duplicate.id,
          tagId: at.tagId,
        },
      }).catch(() => {});
    }

    await logAuditEvent({
      userId: user.id,
      action: 'ARTICLE_DUPLICATE',
      entityType: 'Article',
      entityId: duplicate.id,
      details: { originalId: id, newSlug },
    });

    return NextResponse.json({ success: true, article: duplicate });
  } catch (error: any) {
    console.error('Duplicate article error:', error);
    return NextResponse.json({ error: 'Failed to duplicate article' }, { status: 500 });
  }
}
