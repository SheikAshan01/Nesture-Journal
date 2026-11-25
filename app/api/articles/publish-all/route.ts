import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'article:publish')) {
      return NextResponse.json({ error: 'Unauthorized to publish articles' }, { status: 401 });
    }

    let categorySlug = '';
    try {
      const body = await req.json();
      categorySlug = body?.categorySlug || '';
    } catch {}

    const where: any = {
      isDeleted: false,
      status: { not: 'PUBLISHED' },
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const now = new Date();
    const result = await prisma.article.updateMany({
      where,
      data: {
        status: 'PUBLISHED',
        publicationDate: now,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'ARTICLE_PUBLISH_ALL',
      entityType: 'Article',
      entityId: 'BULK',
      details: { count: result.count, categorySlug: categorySlug || 'ALL' },
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/articles');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} unpublished article(s) published live.`,
    });
  } catch (error: any) {
    console.error('Publish all error:', error);
    return NextResponse.json({ error: 'Failed to publish all articles' }, { status: 500 });
  }
}
