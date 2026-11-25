import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
        orderBy: { publicationDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    // Log search event if user entered a query
    if (q) {
      await prisma.searchLog.create({
        data: {
          query: q,
          resultCount: total,
        },
      }).catch(() => {});
    }

    // Suggestions if zero results
    let suggestions: string[] = [];
    if (total === 0 && q) {
      const topCategories = await prisma.category.findMany({
        take: 4,
        select: { name: true },
      });
      suggestions = topCategories.map((c) => c.name);
    }

    return NextResponse.json({
      query: q,
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      suggestions,
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
