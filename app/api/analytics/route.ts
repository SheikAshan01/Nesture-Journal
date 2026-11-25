import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType = 'PAGE_VIEW', path = '/', articleId, categoryId, referrer } = body;

    const userAgent = req.headers.get('user-agent') || undefined;

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        path,
        articleId: articleId || null,
        categoryId: categoryId || null,
        referrer: referrer || null,
        userAgent,
      },
    });

    // If it's an article view, increment article view count
    if (articleId) {
      await prisma.article.update({
        where: { id: articleId },
        data: { viewCount: { increment: 1 } },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews,
      topArticles,
      recentSearches,
      categoriesCount,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true, viewCount: true, category: { select: { name: true } } },
      }),
      prisma.searchLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.category.count(),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return NextResponse.json({
      summary: {
        totalArticles,
        publishedArticles,
        draftArticles,
        categoriesCount,
        totalViews,
      },
      topArticles,
      recentSearches,
      recentAuditLogs,
    });
  } catch (error: any) {
    console.error('Analytics get error:', error);
    return NextResponse.json({ error: 'Failed to get analytics summary' }, { status: 500 });
  }
}
