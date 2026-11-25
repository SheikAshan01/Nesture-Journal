import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            slug: true,
            roleTitle: true,
            _count: {
              select: { articles: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const roles = await prisma.role.findMany({
      select: { id: true, name: true, description: true },
    });

    return NextResponse.json({ users, roles });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, role = 'EDITOR' } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });
    }

    let targetRole = await prisma.role.findUnique({ where: { name: role } });
    if (!targetRole) {
      targetRole = await prisma.role.findFirst();
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: cleanEmail,
        passwordHash,
        roleId: targetRole!.id,
        isActive: true,
      },
      include: { role: true },
    });

    const slug = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    await prisma.author.create({
      data: {
        userId: user.id,
        name: user.name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        roleTitle: `${targetRole!.name} Analyst`,
        email: user.email,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, roleName, isActive } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    if (roleName) {
      const targetRole = await prisma.role.findUnique({ where: { name: roleName } });
      if (targetRole) {
        updateData.roleId = targetRole.id;
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { role: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Protect self-deletion
    if (userId === sessionUser.id) {
      return NextResponse.json({ error: 'Cannot delete your own active session account.' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true, message: 'User deleted.' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }
}
