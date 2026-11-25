import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'article:publish')) {
      return NextResponse.json({ error: 'Unauthorized to publish articles' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { action } = body; // 'PUBLISH', 'UNPUBLISH', 'ARCHIVE'

    let newStatus = 'PUBLISHED';
    let publicationDate: Date | null = new Date();

    if (action === 'UNPUBLISH') {
      newStatus = 'DRAFT';
      publicationDate = null;
    } else if (action === 'ARCHIVE') {
      newStatus = 'ARCHIVED';
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        status: newStatus,
        publicationDate: publicationDate ? publicationDate : undefined,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: `ARTICLE_${action}`,
      entityType: 'Article',
      entityId: id,
      details: { newStatus },
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

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error('Publish toggle error:', error);
    return NextResponse.json({ error: 'Failed to update publishing status' }, { status: 500 });
  }
}
