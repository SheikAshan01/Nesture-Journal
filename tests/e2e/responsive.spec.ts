import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 320, height: 568, name: '320px Mobile (iPhone SE)' },
  { width: 360, height: 640, name: '360px Mobile (Android small)' },
  { width: 390, height: 844, name: '390px Mobile (iPhone 14)' },
  { width: 430, height: 932, name: '430px Mobile (iPhone 14 Pro Max)' },
  { width: 768, height: 1024, name: '768px Tablet (iPad portrait)' },
  { width: 1024, height: 768, name: '1024px Laptop' },
  { width: 1280, height: 800, name: '1280px Desktop' },
  { width: 1440, height: 900, name: '1440px Reference Desktop' },
  { width: 1920, height: 1080, name: '1920px Full HD Large Screen' },
];

test.describe('Responsive Design Matrix (320px to 1920px)', () => {
  for (const vp of VIEWPORTS) {
    test(`Zero horizontal overflow & visual completeness at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // 1. Verify zero horizontal overflow (no layout blowout)
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalOverflow).toBe(false);

      // 2. Verify Logo & Brand
      await expect(page.locator('text=NESTURE').first()).toBeVisible();
      await expect(page.locator('text=JOURNAL').first()).toBeVisible();

      // 3. Verify Realty Stocks
      await expect(page.locator('text=Realty Stocks')).toBeVisible();

      // 4. Verify Breaking News
      await expect(page.locator('text=BREAKING NEWS')).toBeVisible();

      // 5. Verify Hero headline is visible
      await expect(page.locator('section h1').first()).toBeVisible();

      // 6. Verify Category Ribbon has visible categories
      await expect(page.locator('h4:has-text("Residential")')).toBeVisible();
      await expect(page.locator('h4:has-text("Commercial")')).toBeVisible();

      // 7. Verify Latest Insights & Market Intelligence
      await expect(page.locator('text=Latest Insights')).toBeVisible();
      await expect(page.locator('text=Market Intelligence').first()).toBeVisible();

      // 8. Verify Footer
      await expect(page.locator('text=About Nesture Journal')).toBeVisible();
      await expect(page.locator('text=© 2026 Nesture Journal. All Rights Reserved.')).toBeVisible();
    });
  }
});
