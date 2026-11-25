import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const DEFAULT_NAV = [
  { label: 'Residential', href: '/category/residential', categorySlug: 'residential', order: 1, isVisible: true },
  { label: 'Commercial', href: '/category/commercial', categorySlug: 'commercial', order: 2, isVisible: true },
  { label: 'International', href: '/category/international', categorySlug: 'international', order: 3, isVisible: true },
  { label: 'Finance', href: '/category/finance', categorySlug: 'finance', order: 4, isVisible: true },
  { label: 'Legal', href: '/category/legal', categorySlug: 'legal', order: 5, isVisible: true },
  { label: 'Realty Tech', href: '/category/realty-tech', categorySlug: 'realty-tech', order: 6, isVisible: true },
  { label: 'Development', href: '/category/development', categorySlug: 'development', order: 7, isVisible: true },
  { label: 'General', href: '/category/general', categorySlug: 'general', order: 8, isVisible: true },
];

export async function GET(request: NextRequest) {
  try {
    let items = await prisma.navbarItem.findMany({
      orderBy: { order: 'asc' },
    });

    if (items.length === 0) {
      // Seed default navbar items
      for (const def of DEFAULT_NAV) {
        await prisma.navbarItem.create({ data: def });
      }
      items = await prisma.navbarItem.findMany({ orderBy: { order: 'asc' } });
    }

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Navbar settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch navbar items.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { label, href, categorySlug, isVisible = true, isExternal = false } = body;

    if (!label || !href) {
      return NextResponse.json({ error: 'Label and Link href are required.' }, { status: 400 });
    }

    const count = await prisma.navbarItem.count();
    const newItem = await prisma.navbarItem.create({
      data: {
        label: String(label).trim(),
        href: String(href).trim(),
        categorySlug: categorySlug || null,
        order: count + 1,
        isVisible,
        isExternal,
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Navbar settings POST error:', error);
    return NextResponse.json({ error: 'Failed to create navbar item.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isVisible, label, href, order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item ID required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isVisible === 'boolean') updateData.isVisible = isVisible;
    if (label) updateData.label = label;
    if (href) updateData.href = href;
    if (typeof order === 'number') updateData.order = order;

    const updated = await prisma.navbarItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error('Navbar settings PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update navbar item.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID required.' }, { status: 400 });
    }

    await prisma.navbarItem.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Navbar item deleted.' });
  } catch (error: any) {
    console.error('Navbar settings DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete navbar item.' }, { status: 500 });
  }
}
