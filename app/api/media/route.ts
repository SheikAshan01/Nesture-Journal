import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { processAndSaveImage } from '@/lib/media/storage';
import { logAuditEvent } from '@/lib/auth/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q');

    const where: any = {};
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ];
    }

    const images = await prisma.articleImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Fetch media error:', error);
    return NextResponse.json({ error: 'Failed to retrieve media' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'media:manage')) {
      return NextResponse.json({ error: 'Unauthorized to upload media' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const processed = await processAndSaveImage(
      buffer,
      file.name,
      file.type,
      altText
    );

    await logAuditEvent({
      userId: user.id,
      action: 'MEDIA_UPLOAD',
      entityType: 'ArticleImage',
      entityId: processed.id,
      details: { filename: processed.filename, size: processed.fileSize },
    });

    return NextResponse.json({ success: true, media: processed }, { status: 201 });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload media' }, { status: 500 });
  }
}
