import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const DEFAULT_SOURCES = [
  {
    name: 'PropNewsTime',
    url: 'https://propnewstime.com',
    category: 'Residential, Commercial, RERA Policy',
    description: 'Premier Indian real estate and property intelligence media covering RERA rulings, luxury housing, and corporate leasing.',
    isEnabled: true,
  },
  {
    name: 'Realty & More',
    url: 'https://realtynmore.com',
    category: 'Policy, Infrastructure, R&M Podium',
    description: 'Specialized real estate publication hosting national developer summits, UP-RERA analysis, and Grade-A warehousing reports.',
    isEnabled: true,
  },
  {
    name: 'Economic Times Realty',
    url: 'https://economictimes.indiatimes.com/industry/services/property-/-cstruction',
    category: 'Finance, REITs, Institutional PE',
    description: 'Institutional financial coverage of listed Indian developers, SEBI REIT framework, and township infrastructure capital.',
    isEnabled: true,
  },
  {
    name: 'Financial Express Real Estate',
    url: 'https://www.financialexpress.com/business/industry/real-estate',
    category: 'Macro Economy, Home Loans, Urban Infra',
    description: 'National real estate reports covering lending rates, urban transit corridors, and municipal master plans.',
    isEnabled: true,
  },
  {
    name: 'Reuters Global Real Estate',
    url: 'https://www.reuters.com/business/real-estate/',
    category: 'International, Cross-Border Capital, Commercial',
    description: 'Global commercial real estate market benchmarks, sovereign wealth fund allocations, and international real estate trends.',
    isEnabled: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    let sources = await prisma.contentSource.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (sources.length === 0) {
      for (const src of DEFAULT_SOURCES) {
        await prisma.contentSource.create({
          data: src,
        });
      }
      sources = await prisma.contentSource.findMany({ orderBy: { createdAt: 'asc' } });
    }

    // Also get article counts per source
    const articlesWithSources = await prisma.article.findMany({
      where: {
        sourceName: { not: null },
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        sourceName: true,
        sourceUrl: true,
        publicationDate: true,
        category: {
          select: { name: true },
        },
      },
      orderBy: { publicationDate: 'desc' },
      take: 50,
    });

    // Update articleCount for each source
    const sourcesWithLiveCounts = await Promise.all(
      sources.map(async (src) => {
        const count = await prisma.article.count({
          where: {
            sourceName: src.name,
            isDeleted: false,
          },
        });
        return {
          ...src,
          articleCount: count,
        };
      })
    );

    return NextResponse.json({
      sources: sourcesWithLiveCounts,
      articles: articlesWithSources,
    });
  } catch (error: any) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ error: 'Failed to fetch content sources.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, category, description } = body;

    if (!name || !url) {
      return NextResponse.json({ error: 'Source name and URL required.' }, { status: 400 });
    }

    const source = await prisma.contentSource.create({
      data: {
        name: String(name).trim(),
        url: String(url).trim(),
        category: category || 'General Real Estate',
        description: description || null,
        isEnabled: true,
      },
    });

    return NextResponse.json({ success: true, source });
  } catch (error: any) {
    console.error('Error adding content source:', error);
    return NextResponse.json({ error: 'Failed to create content source.' }, { status: 500 });
  }
}
