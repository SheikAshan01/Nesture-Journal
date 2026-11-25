import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: { select: { articleTags: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ tags });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });

    return NextResponse.json({ success: true, tag });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save tag' }, { status: 500 });
  }
}
