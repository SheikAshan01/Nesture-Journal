import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'settings:manage')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      const csvHeader = 'Email,Status,ConsentGiven,CreatedAt\n';
      const csvRows = subscribers
        .map(
          (s) =>
            `"${s.email}","${s.status}","${s.consentGiven}","${s.createdAt.toISOString()}"`
        )
        .join('\n');

      return new NextResponse(csvHeader + csvRows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="subscribers.csv"',
        },
      });
    }

    return NextResponse.json({ subscribers, total: subscribers.length });
  } catch (error: any) {
    console.error('Newsletter get error:', error);
    return NextResponse.json({ error: 'Failed to retrieve subscribers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status === 'UNSUBSCRIBED') {
        await prisma.newsletterSubscriber.update({
          where: { email: cleanEmail },
          data: { status: 'ACTIVE' },
        });
        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
        });
      }
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to Nesture Journal updates.',
      });
    }

    const token = crypto.randomBytes(24).toString('hex');
    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        token,
        status: 'ACTIVE',
        consentGiven: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to Nesture Journal market insights!',
    });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
