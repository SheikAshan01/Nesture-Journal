import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const deletedArticles = await prisma.article.findMany({
      where: { isDeleted: true },
      include: {
        category: true,
        author: true,
      },
      orderBy: { updatedDate: 'desc' },
    });

    return NextResponse.json({ articles: deletedArticles });
  } catch (error: any) {
    console.error('Error fetching trashed articles:', error);
    return NextResponse.json({ error: 'Failed to fetch trashed articles.' }, { status: 500 });
  }
}

// Restore article
export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { articleId, action } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID required.' }, { status: 400 });
    }

    if (action === 'restore') {
      const restored = await prisma.article.update({
        where: { id: articleId },
        data: { isDeleted: false },
      });
      return NextResponse.json({ success: true, article: restored });
    }

    if (action === 'soft_delete') {
      const trashed = await prisma.article.update({
        where: { id: articleId },
        data: { isDeleted: true },
      });
      return NextResponse.json({ success: true, article: trashed });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in article trash action:', error);
    return NextResponse.json({ error: 'Operation failed.' }, { status: 500 });
  }
}

// Permanent delete
export async function DELETE(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('id');
    const emptyAll = searchParams.get('emptyAll');

    if (emptyAll === 'true') {
      await prisma.article.deleteMany({
        where: { isDeleted: true },
      });
      return NextResponse.json({ success: true, message: 'All deleted articles permanently purged.' });
    }

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID required.' }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({ success: true, message: 'Article permanently deleted.' });
  } catch (error: any) {
    console.error('Error permanently deleting article:', error);
    return NextResponse.json({ error: 'Permanent deletion failed.' }, { status: 500 });
  }
}
