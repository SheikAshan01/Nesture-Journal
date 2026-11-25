import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ensureRoleWithPermissions } from '@/lib/auth/bootstrap';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'EDITOR' } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Find role or default to EDITOR
    let targetRole = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!targetRole) {
      targetRole = await prisma.role.findUnique({
        where: { name: 'EDITOR' },
      });
    }

    if (!targetRole) {
      targetRole = await ensureRoleWithPermissions(role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'EDITOR');
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: cleanEmail,
        passwordHash,
        roleId: targetRole.id,
        isActive: true,
      },
      include: {
        role: true,
      },
    });

    // Also create author profile for the user
    const slug = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    await prisma.author.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: user.name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        roleTitle: `${targetRole.name} Journalist`,
        email: user.email,
      },
    });

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTER',
        entityType: 'User',
        entityId: user.id,
        details: JSON.stringify({ email: user.email, role: targetRole.name }),
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: targetRole.name,
      },
    });

    // Set HTTP-only cookie matching lib/auth/session.ts (nj_session_token)
    response.cookies.set({
      name: 'nj_session_token',
      value: token,
      httpOnly: true,
      secure: process.env.VERCEL === '1' || process.env.HTTPS === 'true',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Internal server error.' },
      { status: 500 }
    );
  }
}
