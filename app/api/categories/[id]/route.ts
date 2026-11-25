import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'category:manage')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { name, color, description, seoTitle, seoDescription } = body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        color: color !== undefined ? color : existing.color,
        description: description !== undefined ? description : existing.description,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CATEGORY_UPDATE',
      entityType: 'Category',
      entityId: id,
      details: { name: updated.name },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'category:manage')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Safe deletion: prevent deleting if articles exist
    if (existing._count.articles > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${existing.name}". It is assigned to ${existing._count.articles} articles. Please reassign or delete those articles first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    await logAuditEvent({
      userId: user.id,
      action: 'CATEGORY_DELETE',
      entityType: 'Category',
      entityId: id,
      details: { name: existing.name },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error: any) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
