import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, destroySession } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

    if (user) {
      await logAuditEvent({
        userId: user.id,
        action: 'LOGOUT',
        entityType: 'User',
        ipAddress: ip,
      });
    }

    await destroySession();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout.' }, { status: 500 });
  }
}
