const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();

// Reliable, high-resolution Unsplash architectural and real estate images
const RELIABLE_FALLBACKS = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=1200&q=80',
];

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.request(
        parsed,
        {
          method: 'HEAD',
          timeout: 4000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
            resolve({ ok: true, status: res.statusCode });
          } else {
            resolve({ ok: false, status: res.statusCode });
          }
        }
      );
      req.on('error', (err) => resolve({ ok: false, error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'timeout' });
      });
      req.end();
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

async function main() {
  console.log('Auditing database articles...');
  const articles = await prisma.article.findMany();
  console.log(`Found ${articles.length} articles in database.`);

  let fixCount = 0;
  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    const img = art.featuredImage;
    if (!img) {
      console.log(`Article "${art.title}" has no image! Assigning fallback.`);
      const fallback = RELIABLE_FALLBACKS[i % RELIABLE_FALLBACKS.length];
      await prisma.article.update({
        where: { id: art.id },
        data: { featuredImage: fallback },
      });
      fixCount++;
      continue;
    }

    const res = await checkUrl(img);
    if (!res.ok) {
      console.log(`BROKEN [${res.status || res.error}] on "${art.title}": ${img}`);
      const fallback = RELIABLE_FALLBACKS[i % RELIABLE_FALLBACKS.length];
      console.log(`-> Updating to verified fallback: ${fallback}`);
      await prisma.article.update({
        where: { id: art.id },
        data: { featuredImage: fallback },
      });
      fixCount++;
    } else {
      console.log(`OK (${res.status}): "${art.title.slice(0, 40)}..."`);
    }
  }

  console.log(`\nImage verification complete. ${fixCount} images fixed in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
