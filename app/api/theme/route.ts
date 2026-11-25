import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { DEFAULT_THEME } from '@/lib/theme';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (settings?.themeConfig) {
      try {
        const parsed = JSON.parse(settings.themeConfig);
        return NextResponse.json({
          theme: { ...DEFAULT_THEME, ...parsed },
          source: 'database',
        });
      } catch {
        // fallback to default if malformed
      }
    }

    return NextResponse.json({
      theme: DEFAULT_THEME,
      source: 'default',
    });
  } catch (err: any) {
    console.error('Error fetching theme:', err);
    return NextResponse.json({ theme: DEFAULT_THEME, source: 'fallback' });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { theme } = body;

    if (!theme) {
      return NextResponse.json({ error: 'Missing theme data' }, { status: 400 });
    }

    // Merge with defaults to ensure all required fields are present
    const updatedTheme = {
      ...DEFAULT_THEME,
      ...theme,
      updatedAt: new Date().toISOString(),
    };

    const themeString = JSON.stringify(updatedTheme);

    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        themeConfig: themeString,
      },
      update: {
        themeConfig: themeString,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Theme and layout configuration published successfully.',
      theme: updatedTheme,
    });
  } catch (err: any) {
    console.error('Error saving theme:', err);
    return NextResponse.json({ error: 'Failed to update theme configuration' }, { status: 500 });
  }
}
