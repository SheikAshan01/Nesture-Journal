import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [articles, categories, seoSettings] = await Promise.all([
      prisma.article.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          seoTitle: true,
          seoDescription: true,
          shortDescription: true,
          featuredImage: true,
          imageAlt: true,
          content: true,
          status: true,
        },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          seoTitle: true,
          seoDescription: true,
          description: true,
        },
      }),
      prisma.sEOSettings.findFirst(),
    ]);

    const issues: Array<{ type: 'ERROR' | 'WARNING'; message: string; target: string; id: string }> = [];

    // Audit articles
    for (const art of articles) {
      const titleLen = (art.seoTitle || art.title).length;
      if (titleLen < 20 || titleLen > 80) {
        issues.push({
          type: 'WARNING',
          message: `Title length (${titleLen} chars) is outside optimal 20-80 chars range`,
          target: art.title,
          id: art.id,
        });
      }

      const descLen = (art.seoDescription || art.shortDescription || '').length;
      if (!descLen || descLen < 50) {
        issues.push({
          type: 'ERROR',
          message: 'Missing or critically brief meta description (< 50 chars)',
          target: art.title,
          id: art.id,
        });
      }

      if (art.featuredImage && (!art.imageAlt || art.imageAlt.length < 5)) {
        issues.push({
          type: 'WARNING',
          message: 'Featured image is missing descriptive alt text for accessibility',
          target: art.title,
          id: art.id,
        });
      }

      const wordCount = art.content.split(/\s+/).length;
      if (wordCount < 200) {
        issues.push({
          type: 'WARNING',
          message: `Thin content detected (${wordCount} words; recommended: 300+)`,
          target: art.title,
          id: art.id,
        });
      }
    }

    // Audit categories
    for (const cat of categories) {
      if (!cat.seoDescription && !cat.description) {
        issues.push({
          type: 'WARNING',
          message: 'Category lacks dedicated SEO meta description',
          target: `Category: ${cat.name}`,
          id: cat.id,
        });
      }
    }

    const totalAudited = articles.length + categories.length;
    const penalty = issues.reduce((acc, iss) => acc + (iss.type === 'ERROR' ? 10 : 4), 0);
    const healthScore = Math.max(0, Math.min(100, Math.round(100 - (penalty / (totalAudited || 1)) * 5)));

    return NextResponse.json({
      healthScore,
      totalAudited,
      totalIssues: issues.length,
      errorsCount: issues.filter((i) => i.type === 'ERROR').length,
      warningsCount: issues.filter((i) => i.type === 'WARNING').length,
      issues,
      globalSettings: seoSettings,
    });
  } catch (error: any) {
    console.error('SEO audit error:', error);
    return NextResponse.json({ error: 'Failed to run SEO audit' }, { status: 500 });
  }
}
