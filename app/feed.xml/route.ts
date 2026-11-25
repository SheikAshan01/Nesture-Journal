import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true, author: true },
      orderBy: { publicationDate: 'desc' },
      take: 30,
    });

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Nesture Journal | Real Estate News &amp; Market Intelligence</title>
  <link>${baseUrl}</link>
  <description>In-depth real estate journalism, policy updates, and property market analysis.</description>
  <language>en-in</language>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  ${articles
    .map(
      (a) => `
  <item>
    <title><![CDATA[${a.title}]]></title>
    <link>${baseUrl}/articles/${a.slug}</link>
    <guid>${baseUrl}/articles/${a.slug}</guid>
    <pubDate>${a.publicationDate ? a.publicationDate.toUTCString() : new Date().toUTCString()}</pubDate>
    <description><![CDATA[${a.shortDescription}]]></description>
    <category><![CDATA[${a.category.name}]]></category>
    <author><![CDATA[${a.author.name}]]></author>
  </item>`
    )
    .join('')}
</channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=59',
      },
    });
  } catch (error: any) {
    console.error('RSS feed error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
