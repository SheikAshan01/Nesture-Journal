import { NextRequest, NextResponse } from 'next/server';
import { scrapeWorldwideFeeds, WORLDWIDE_FEEDS } from '@/lib/scraper/worldwide-scraper';
import { getCurrentUser } from '@/lib/auth/session';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

let lastScrapeTime: Date | null = null;
let lastResultSummary: any = null;

export async function GET(req: NextRequest) {
  try {
    const isCronParam = req.nextUrl.searchParams.get('cron') === '1';
    const isVercelCron = req.headers.get('x-vercel-cron') === '1';
    if (isCronParam || isVercelCron) {
      const result = await scrapeWorldwideFeeds();
      lastScrapeTime = new Date();
      lastResultSummary = {
        timestamp: lastScrapeTime,
        totalProcessed: result.totalProcessed,
        newArticlesCount: result.newArticlesCount,
        sourcesReport: result.sourcesReport,
      };
      return NextResponse.json({ success: true, result });
    }

    const unpublishedCount = await prisma.article.count({
      where: {
        status: { not: 'PUBLISHED' },
        isDeleted: false,
      },
    });

    const sources = await prisma.contentSource.findMany({
      orderBy: { lastSyncAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      status: 'active',
      scheduleInterval: 'Every 10 minutes',
      lastScrapeTime,
      unpublishedCount,
      activeSources: WORLDWIDE_FEEDS.map((f) => ({ name: f.name, region: f.region, url: f.url })),
      dbSources: sources,
      lastSummary: lastResultSummary,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    // Allow admin session or background task token
    const authHeader = req.headers.get('authorization');
    const isCronAuthorized = authHeader === `Bearer ${process.env.CRON_SECRET || 'nesture-internal-cron'}`;

    if (!user && !isCronAuthorized) {
      return NextResponse.json({ error: 'Unauthorized to trigger scraper.' }, { status: 401 });
    }

    const result = await scrapeWorldwideFeeds();
    lastScrapeTime = new Date();
    lastResultSummary = {
      timestamp: lastScrapeTime,
      totalProcessed: result.totalProcessed,
      newArticlesCount: result.newArticlesCount,
      sourcesReport: result.sourcesReport,
    };

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${result.totalProcessed} worldwide stories. Ingested ${result.newArticlesCount} new unpublished articles.`,
      result,
    });
  } catch (error: any) {
    console.error('Scrape API execution error:', error);
    return NextResponse.json({ error: 'Failed to run worldwide scraper', details: error.message }, { status: 500 });
  }
}
