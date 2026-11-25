import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
        author: user.author,
      },
    });
  } catch (err: any) {
    console.error('Error in profile GET:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, avatar, roleTitle, bio } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // Check email uniqueness if email changed
    if (email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== user.id) {
        return NextResponse.json({ error: 'Email address already in use by another user.' }, { status: 400 });
      }
    }

    // Update user record
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        avatar: avatar || null,
      },
    });

    // If an author record exists, also sync author name and avatar
    if (user.author) {
      await prisma.author.update({
        where: { id: user.author.id },
        data: {
          name,
          avatar: avatar || user.author.avatar,
          roleTitle: roleTitle || user.author.roleTitle,
          bio: bio || user.author.bio,
        },
      });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PROFILE_UPDATE',
        entityType: 'USER',
        entityId: user.id,
        details: JSON.stringify({ name, email, hasAvatar: !!avatar }),
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Profile details and avatar updated successfully.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (err: any) {
    console.error('Error in profile PUT:', err);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
