import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';

const SESSION_COOKIE_NAME = 'nj_session_token';
const SESSION_EXPIRY_DAYS = 7;

// In-memory rate limiting map for login attempts: ip -> { count, firstAttempt }
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    const retryAfterSec = Math.ceil((entry.firstAttempt + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - entry.count };
}

export function recordFailedLogin(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

export function clearLoginRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: string, reqHeaders?: { ip?: string; userAgent?: string }) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress: reqHeaders?.ip || null,
      userAgent: reqHeaders?.userAgent || null,
    },
    include: {
      user: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  // Set HTTP-only cookie (only mark secure on HTTPS / Vercel so local http://localhost:3000 works)
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.VERCEL === '1' || process.env.HTTPS === 'true',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return session;
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
            author: true,
          },
        },
      },
    });

    if (!session) return null;

    if (new Date() > session.expiresAt) {
      // Session expired
      await prisma.session.delete({ where: { token } }).catch(() => {});
      return null;
    }

    if (!session.user.isActive) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function destroySession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await prisma.session.deleteMany({ where: { token } }).catch(() => {});
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch (error) {
    console.error('Error destroying session:', error);
  }
}

export function hasPermission(user: any, permissionName: string): boolean {
  if (!user || !user.role) return false;
  if (user.role.name === 'SUPER_ADMIN') return true;

  const permissions = user.role.permissions || [];
  return permissions.some(
    (rp: any) => rp.permission?.name === permissionName || rp.name === permissionName
  );
}

export function hasAnyRole(user: any, roleNames: string[]): boolean {
  if (!user || !user.role) return false;
  if (user.role.name === 'SUPER_ADMIN') return true;
  return roleNames.includes(user.role.name);
}
