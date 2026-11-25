import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const permissions =
      user.role.name === 'SUPER_ADMIN'
        ? ['*']
        : user.role.permissions.map((rp: any) => rp.permission.name);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        permissions,
        author: user.author,
      },
    });
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false, error: 'Auth check failed' }, { status: 500 });
  }
}
