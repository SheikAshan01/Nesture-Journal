import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
        _count: { select: { articles: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'category:manage')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, color = '#008F5A', description, seoTitle, seoDescription } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        color,
        description,
        seoTitle: seoTitle || `${name} Real Estate News & Insights | Nesture Journal`,
        seoDescription: seoDescription || description,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CATEGORY_CREATE',
      entityType: 'Category',
      entityId: category.id,
      details: { name, slug },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
