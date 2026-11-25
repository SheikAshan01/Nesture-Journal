const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Screenshot hero section
  const heroSection = page.locator('section').first();
  await heroSection.screenshot({ path: 'scripts/verify-hero.png' });
  console.log('Saved verify-hero.png');

  // Screenshot latest insights & market intelligence
  const marketIntelligence = page.locator('section:has-text("Latest Insights")');
  await marketIntelligence.screenshot({ path: 'scripts/verify-market-intelligence.png' });
  console.log('Saved verify-market-intelligence.png');

  // Screenshot sector spotlight
  const sectorSpotlight = page.locator('section:has-text("Sector Spotlight")');
  if (await sectorSpotlight.count() > 0) {
    await sectorSpotlight.screenshot({ path: 'scripts/verify-sector-spotlight.png' });
    console.log('Saved verify-sector-spotlight.png');
  }

  // Navigate to articles page and screenshot
  await page.goto('http://localhost:3000/articles', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scripts/verify-articles.png', fullPage: false });
  console.log('Saved verify-articles.png');

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
