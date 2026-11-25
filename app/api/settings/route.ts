import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [siteSettings, seoSettings] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.sEOSettings.findFirst(),
    ]);

    return NextResponse.json({ siteSettings, seoSettings });
  } catch (error: any) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user, 'settings:manage')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { siteSettings, seoSettings } = body;

    let updatedSite;
    let updatedSeo;

    if (siteSettings) {
      updatedSite = await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: siteSettings,
        create: { id: 'default', ...siteSettings },
      });
    }

    if (seoSettings) {
      updatedSeo = await prisma.sEOSettings.upsert({
        where: { id: 'default' },
        update: seoSettings,
        create: { id: 'default', ...seoSettings },
      });
    }

    await logAuditEvent({
      userId: user.id,
      action: 'SETTINGS_UPDATE',
      entityType: 'Settings',
      entityId: 'default',
    });

    return NextResponse.json({
      success: true,
      siteSettings: updatedSite,
      seoSettings: updatedSeo,
    });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
