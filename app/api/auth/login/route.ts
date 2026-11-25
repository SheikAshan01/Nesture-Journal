import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginRateLimit,
  verifyPassword,
  createSession,
} from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';
import { ensureDefaultTestAccount } from '@/lib/auth/bootstrap';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const rateCheck = checkLoginRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${rateCheck.retryAfterSec} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    await ensureDefaultTestAccount(cleanEmail);

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      recordFailedLogin(ip);
      await logAuditEvent({
        action: 'FAILED_LOGIN',
        entityType: 'User',
        details: { email, reason: 'Invalid user or deactivated' },
        ipAddress: ip,
      });
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      recordFailedLogin(ip);
      await logAuditEvent({
        userId: user.id,
        action: 'FAILED_LOGIN',
        entityType: 'User',
        details: { email, reason: 'Incorrect password' },
        ipAddress: ip,
      });
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Success - reset rate limit counter
    clearLoginRateLimit(ip);

    const userAgent = req.headers.get('user-agent') || undefined;
    await createSession(user.id, { ip, userAgent });

    await logAuditEvent({
      userId: user.id,
      action: 'LOGIN',
      entityType: 'User',
      details: { email, role: user.role.name },
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
