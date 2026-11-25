/**
 * Nesture Journal - Automated Worldwide News Ingestion Daemon
 * Runs every 10 minutes to scrape, auto-categorize, and ingest
 * real estate breaking news into the Unpublished Articles queue.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const WORLDWIDE_FEEDS = [
  {
    name: 'The Real Deal',
    url: 'https://therealdeal.com/feed/',
    region: 'Global & US',
    defaultCategory: 'commercial',
  },
  {
    name: 'HousingWire',
    url: 'https://www.housingwire.com/feed/',
    region: 'North America',
    defaultCategory: 'residential',
  },
  {
    name: 'PropertyWire',
    url: 'https://www.propertywire.com/feed/',
    region: 'UK & International',
    defaultCategory: 'international',
  },
  {
    name: 'Realty & More',
    url: 'https://realtynmore.com/feed/',
    region: 'India National',
    defaultCategory: 'development',
  },
  {
    name: 'Economic Times Realty',
    url: 'https://economictimes.indiatimes.com/industry/services/property-/-cstruction/rssfeeds/2143429.cms',
    region: 'India Institutional',
    defaultCategory: 'finance',
  },
  {
    name: 'The Hindu BusinessLine Real Estate',
    url: 'https://www.thehindubusinessline.com/news/real-estate/feeder/default.rss',
    region: 'India Markets',
    defaultCategory: 'legal',
  },
  {
    name: 'Curbed',
    url: 'https://www.curbed.com/rss/index.xml',
    region: 'Global Architecture',
    defaultCategory: 'realty-tech',
  },
];

const CATEGORY_BACKUP_IMAGES = {
  residential: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  ],
  development: [
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
  ],
  finance: [
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  ],
  legal: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
  ],
  'realty-tech': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  ],
  international: [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
  ],
  general: [
    'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
  ],
};

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function classifyCategory(title, content, defaultCat = 'general') {
  const text = `${title} ${content}`.toLowerCase();

  const rules = [
    {
      slug: 'legal',
      keywords: ['rera', 'supreme court', 'high court', 'tribunal', 'ruling', 'lawsuit', 'litigation', 'penalty', 'compliance', 'unregistered', 'illegal pre-launch', 'stamp duty', 'title deed', 'eviction', 'contract dispute'],
    },
    {
      slug: 'finance',
      keywords: ['reit', 'private equity', 'interest rate', 'repo rate', 'mortgage rate', 'debt', 'funding', 'bond yield', 'rbi', 'sebi', 'qip', 'valuation', 'market cap', 'realty stock', 'quarterly revenue', 'ipo', 'lending'],
    },
    {
      slug: 'realty-tech',
      keywords: ['proptech', 'ai', 'artificial intelligence', 'smart city', '3d model', 'digital twin', 'virtual tour', 'bim', 'automation', 'saas', 'iot', 'robotics', 'smart building', 'blockchain real estate'],
    },
    {
      slug: 'development',
      keywords: ['airport', 'highway', 'corridor', 'jewar', 'metro line', 'expressway', 'infrastructure', 'master plan', 'township', 'land parcel', 'construction', 'groundbreaking', 'zoning', 'mega project', 'smart infra'],
    },
    {
      slug: 'commercial',
      keywords: ['commercial', 'office leasing', 'co-working', 'grade a', 'business park', 'warehousing', 'logistics park', 'retail mall', 'malls', 'corporate headquarters', 'gcc', 'global capability center', 'occupancy rate'],
    },
    {
      slug: 'international',
      keywords: ['dubai', 'london', 'manhattan', 'new york', 'cross-border', 'singapore', 'european property', 'sovereign wealth', 'global luxury', 'overseas investor', 'foreign capital', 'hong kong', 'miami', 'tokyo'],
    },
    {
      slug: 'residential',
      keywords: ['residential', 'apartment', 'housing unit', 'homebuyer', 'villa', 'condo', 'luxury flat', 'penthouse', 'rental yield', 'home loan', 'affordable housing', 'townhouse', 'residential tower', 'gated community'],
    },
  ];

  for (const rule of rules) {
    for (const kw of rule.keywords) {
      if (text.includes(kw)) {
        return rule.slug;
      }
    }
  }

  return defaultCat;
}

function parseRssXml(xml, sourceName, defaultCategory) {
  const stories = [];
  const cleanXml = xml.replace(/\r\n/g, '\n');

  const itemRegex = /<(?:item|entry)[\s>](.*?)<\/(?:item|entry)>/gs;
  let match;

  while ((match = itemRegex.exec(cleanXml)) !== null) {
    const itemBlock = match[1];

    const titleMatch = /<title[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/s.exec(itemBlock);
    const rawTitle = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '';
    const title = decodeHtmlEntities(stripTags(rawTitle)).trim();
    if (!title || title.length < 8) continue;

    let link = '';
    const linkMatch = /<link[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>/s.exec(itemBlock);
    if (linkMatch) {
      link = (linkMatch[1] || linkMatch[2] || '').trim();
    } else {
      const hrefMatch = /<link[^>]+href=["']([^"']+)["']/i.exec(itemBlock);
      if (hrefMatch) link = hrefMatch[1].trim();
    }
    if (!link) continue;

    let description = '';
    const descMatch = /<description[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/description>/s.exec(itemBlock);
    if (descMatch) {
      description = decodeHtmlEntities(stripTags(descMatch[1] || descMatch[2] || '')).trim();
    }

    let fullContent = '';
    const contentMatch = /<content:encoded[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/content:encoded>/s.exec(itemBlock);
    if (contentMatch) {
      fullContent = (contentMatch[1] || contentMatch[2] || '').trim();
    } else {
      const atomContent = /<content[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/content>/s.exec(itemBlock);
      if (atomContent) {
        fullContent = (atomContent[1] || atomContent[2] || '').trim();
      } else {
        fullContent = description;
      }
    }

    let image = '';
    const mediaMatch = /<media:content[^>]+url=["']([^"']+)["']/i.exec(itemBlock);
    if (mediaMatch && mediaMatch[1]) {
      image = mediaMatch[1];
    } else {
      const enclosureMatch = /<enclosure[^>]+url=["']([^"']+)["']/i.exec(itemBlock);
      if (enclosureMatch && enclosureMatch[1]) {
        image = enclosureMatch[1];
      } else {
        const imgTagMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(itemBlock);
        if (imgTagMatch && imgTagMatch[1]) {
          image = imgTagMatch[1];
        }
      }
    }

    let pubDate;
    const dateMatch = /<(?:pubDate|published|updated)>(.*?)<\/(?:pubDate|published|updated)>/i.exec(itemBlock);
    if (dateMatch) {
      try {
        pubDate = new Date(dateMatch[1]);
      } catch {}
    }

    const catSlug = classifyCategory(title, description + ' ' + fullContent, defaultCategory);

    if (!image || !image.startsWith('http')) {
      const backups = CATEGORY_BACKUP_IMAGES[catSlug] || CATEGORY_BACKUP_IMAGES['general'];
      image = backups[Math.floor(Math.random() * backups.length)];
    }

    const cleanSummary = description
      ? description.slice(0, 240) + (description.length > 240 ? '...' : '')
      : `${title}. Full breaking coverage and market intelligence compiled by Nesture Journal's worldwide editorial desk.`;

    const paragraphs = fullContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20)
      .map((p) => (p.startsWith('<p>') ? p : `<p>${p}</p>`))
      .join('\n');

    const formattedContent = paragraphs.length > 80
      ? paragraphs
      : `<p>${cleanSummary}</p><p>The global real estate market continues to demonstrate sector resilience as institutional capital flows, regulatory frameworks, and urban infrastructure projects reshape property dynamics.</p><p>For in-depth market data, zoning analytics, and verified source documents, refer to the original source dispatch below.</p>`;

    stories.push({
      title,
      sourceUrl: link,
      sourceName,
      shortDescription: cleanSummary,
      content: formattedContent,
      featuredImage: image,
      categorySlug: catSlug,
      publishedAt: pubDate,
    });
  }

  return stories;
}

async function runScrapeCycle() {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] 🚀 [AUTO-SCRAPER] Starting 10-minute worldwide news ingestion cycle...`);

  try {
    const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
    const categoryMap = new Map();
    categories.forEach((c) => categoryMap.set(c.slug, c.id));

    let defaultAuthor = await prisma.author.findFirst({
      where: { slug: 'editorial-board' },
    });
    if (!defaultAuthor) {
      defaultAuthor = await prisma.author.findFirst();
    }
    if (!defaultAuthor) {
      defaultAuthor = await prisma.author.create({
        data: {
          name: 'Nesture Global Editorial Desk',
          slug: 'editorial-board',
          roleTitle: 'Senior International Correspondent',
        },
      });
    }

    let totalFetched = 0;
    let totalInserted = 0;

    for (const feed of WORLDWIDE_FEEDS) {
      try {
        const response = await fetch(feed.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Accept: 'application/rss+xml, application/xml, text/xml, */*',
          },
          signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
          console.warn(`[AUTO-SCRAPER] Feed ${feed.name} returned HTTP ${response.status}`);
          continue;
        }

        const xml = await response.text();
        const stories = parseRssXml(xml, feed.name, feed.defaultCategory);
        totalFetched += stories.length;

        for (const story of stories.slice(0, 6)) {
          const baseSlug = slugify(story.title);
          if (!baseSlug) continue;

          // Deduplication check
          const existing = await prisma.article.findFirst({
            where: {
              OR: [
                { sourceUrl: story.sourceUrl },
                { slug: { startsWith: baseSlug.slice(0, 30) } },
                { title: story.title },
              ],
            },
          });

          if (existing) continue;

          const targetSlug = categoryMap.has(story.categorySlug) ? story.categorySlug : 'general';
          const categoryId = categoryMap.get(targetSlug) || categories[0]?.id;
          if (!categoryId) continue;

          const uniqueSlug = `${baseSlug.slice(0, 70)}-${Math.random().toString(36).slice(2, 6)}`;
          const wordCount = story.content.split(/\s+/).length;
          const readingTime = Math.max(2, Math.ceil(wordCount / 200));

          await prisma.article.create({
            data: {
              title: story.title,
              slug: uniqueSlug,
              shortDescription: story.shortDescription,
              content: story.content,
              featuredImage: story.featuredImage,
              imageAlt: `${story.title} - Nesture Journal News`,
              categoryId,
              authorId: defaultAuthor.id,
              status: 'DRAFT', // Unpublished
              readingTime,
              sourceName: story.sourceName,
              sourceUrl: story.sourceUrl,
              sourceAttribution: `Reported by ${story.sourceName}. Curated by Nesture Editorial Intelligence.`,
              seoTitle: `${story.title} | Nesture Journal`,
              seoDescription: story.shortDescription,
              isDeleted: false,
              isFeatured: false,
              isBreaking: false,
              isTrending: false,
            },
          });

          totalInserted++;
        }

        // Update lastSyncAt for source
        await prisma.contentSource.upsert({
          where: { name: feed.name },
          update: { lastSyncAt: new Date(), articleCount: { increment: totalInserted } },
          create: {
            name: feed.name,
            url: feed.url,
            category: feed.defaultCategory,
            description: `${feed.region} real estate news feed.`,
            lastSyncAt: new Date(),
            articleCount: totalInserted,
          },
        }).catch(() => {});

      } catch (err) {
        console.warn(`[AUTO-SCRAPER] Warning fetching ${feed.name}:`, err.message);
      }
    }

    const duration = ((Date.now() - startTime.getTime()) / 1000).toFixed(1);
    console.log(`[${new Date().toISOString()}] ✅ [AUTO-SCRAPER] Cycle complete in ${duration}s. Fetched: ${totalFetched}, Ingested New Unpublished: ${totalInserted}`);
  } catch (err) {
    console.error(`[AUTO-SCRAPER] Error in ingestion cycle:`, err);
  }
}

// Run immediately on start
runScrapeCycle();

// Schedule every 10 minutes (600,000 ms)
const TEN_MINUTES_MS = 10 * 60 * 1000;
setInterval(runScrapeCycle, TEN_MINUTES_MS);
console.log(`[AUTO-SCRAPER] Background daemon active. Scheduled every 10 minutes (${TEN_MINUTES_MS}ms).`);
