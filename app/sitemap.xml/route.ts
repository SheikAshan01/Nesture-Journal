import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [articles, categories] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedDate: true, publicationDate: true },
        orderBy: { publicationDate: 'desc' },
      }),
      prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    const staticUrls = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/articles`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/market-intelligence`, priority: '0.8', changefreq: 'daily' },
      { loc: `${baseUrl}/realty-stocks`, priority: '0.8', changefreq: 'daily' },
      { loc: `${baseUrl}/trending`, priority: '0.8', changefreq: 'daily' },
      { loc: `${baseUrl}/about`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/editorial-policy`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/privacy-policy`, priority: '0.3', changefreq: 'monthly' },
      { loc: `${baseUrl}/terms`, priority: '0.3', changefreq: 'monthly' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls
    .map(
      (u) => `
    <url>
      <loc>${u.loc}</loc>
      <changefreq>${u.changefreq}</changefreq>
      <priority>${u.priority}</priority>
    </url>`
    )
    .join('')}
  ${categories
    .map(
      (c) => `
    <url>
      <loc>${baseUrl}/category/${c.slug}</loc>
      <lastmod>${c.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join('')}
  ${articles
    .map(
      (a) => `
    <url>
      <loc>${baseUrl}/articles/${a.slug}</loc>
      <lastmod>${(a.updatedDate || a.publicationDate || new Date()).toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (err: any) {
    console.error('Sitemap generation error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
