import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { DEFAULT_THEME } from '@/lib/theme';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    let theme = DEFAULT_THEME;
    if (settings?.themeConfig) {
      try {
        const parsed = JSON.parse(settings.themeConfig);
        theme = { ...DEFAULT_THEME, ...parsed };
      } catch {
        // fallback to default if malformed
      }
    }

    return NextResponse.json(
      { theme, source: settings?.themeConfig ? 'database' : 'default' },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('Error fetching theme:', err);
    return NextResponse.json(
      { theme: DEFAULT_THEME, source: 'fallback' },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
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

    // Invalidate Next.js cache so the live site reflects updates immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Theme and layout configuration published successfully.',
        theme: updatedTheme,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('Error saving theme:', err);
    return NextResponse.json({ error: 'Failed to update theme configuration' }, { status: 500 });
  }
}
