import { test, expect } from '@playwright/test';

test.describe('Nesture Journal - Complete Platform E2E Tests', () => {
  test('Homepage loads completely matching reference layout', async ({ page }) => {
    await page.goto('/');

    // 1. Verify Header & Logo
    await expect(page.locator('text=NESTURE').first()).toBeVisible();
    await expect(page.locator('text=JOURNAL').first()).toBeVisible();
    await expect(page.getByText('REAL ESTATE').first()).toBeVisible();

    // 2. Verify Realty Stocks Ticker
    await expect(page.locator('text=Realty Stocks').first()).toBeVisible();
    await expect(page.locator('text=DLF').first()).toBeVisible();
    await expect(page.locator('text=Godrej Prop').first()).toBeVisible();
    await expect(page.locator('text=View Market').first()).toBeVisible();

    // 3. Verify Breaking News Banner
    await expect(page.locator('text=BREAKING NEWS')).toBeVisible();

    // 4. Verify Hero Section
    await expect(page.locator('text=The Future of Real Estate, Clearly Told').first()).toBeVisible();
    await expect(page.locator('text=Read Story').first()).toBeVisible();

    // 5. Verify Stacked Stories on Right
    const sideStories = page.locator('#hero-side-stories a');
    await expect(sideStories).toHaveCount(3);
    await expect(sideStories.first()).toBeVisible();

    // 6. Verify 8 Category Navigation Ribbon
    await expect(page.locator('h4:has-text("Residential")').first()).toBeVisible();
    await expect(page.locator('h4:has-text("Commercial")').first()).toBeVisible();
    await expect(page.locator('h4:has-text("International")').first()).toBeVisible();
    await expect(page.locator('h4:has-text("Finance")').first()).toBeVisible();
    await expect(page.locator('h4:has-text("Legal")').first()).toBeVisible();
    await expect(page.locator('h4:has-text("Realty Tech")').first()).toBeVisible();
    await expect(page.locator('h4:has-text("Development")').first()).toBeVisible();
    await expect(page.locator('h4:has-text("General")').first()).toBeVisible();

    // 7. Verify Latest Insights
    await expect(page.locator('text=Latest Insights')).toBeVisible();
    await expect(page.locator('text=View All Articles').first()).toBeVisible();
    const insightCards = page.locator('section:has-text("Latest Insights") a[href*="/articles/"]');
    await expect(insightCards.first()).toBeVisible();

    // 8. Verify Market Intelligence Widget
    await expect(page.locator('text=Market Intelligence').first()).toBeVisible();
    await expect(page.locator('text=Realty Market Index (Illustrative)')).toBeVisible();
    await expect(page.locator('text=+8.4%')).toBeVisible();
    await expect(page.locator('text=+6.9%')).toBeVisible();
    await expect(page.locator('text=+5.1%')).toBeVisible();
    await expect(page.locator('text=AI Market Insights')).toBeVisible();
    await expect(page.locator('text=Explore Insights')).toBeVisible();

    // 9. Verify Footer
    await expect(page.locator('text=About Nesture Journal')).toBeVisible();
    await expect(page.locator('text=Get Updates')).toBeVisible();
    await expect(page.locator('text=© 2026 Nesture Journal. All Rights Reserved.')).toBeVisible();
  });

  test('Public pages render without server errors', async ({ page }) => {
    // Category page
    await page.goto('/category/residential');
    await expect(page.locator('h1:has-text("Residential")')).toBeVisible();

    // Article page
    await page.goto('/articles/the-future-of-real-estate-clearly-told');
    await expect(page.locator('h1:has-text("The Future of Real Estate, Clearly Told")')).toBeVisible();

    // Market Intelligence page
    await page.goto('/market-intelligence');
    await expect(page.locator('text=DEMO DATA — NOT LIVE MARKET INFORMATION')).toBeVisible();

    // Realty Stocks page
    await page.goto('/realty-stocks');
    await expect(page.locator('text=Realty Equities & Listed Developers')).toBeVisible();

    // Search page
    await page.goto('/search?q=housing');
    await expect(page.locator('text=Search Results for "housing"')).toBeVisible();
  });

  test('Admin authentication flow works securely', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('h1:has-text("NESTURE JOURNAL")')).toBeVisible();
    await expect(page.locator('text=Editorial Management System')).toBeVisible();

    // Test invalid login error handling
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'WrongPass123!');
    await page.click('button:has-text("Authenticate Session")');
    await expect(page.locator('text=Invalid email or password.')).toBeVisible();

    // Click auto-fill demo super admin button
    await page.click('button:has-text("Auto-fill Super Admin")');
    await page.click('button:has-text("Authenticate Session")');

    // Should redirect to /admin dashboard
    await page.waitForURL('**/admin');
    await expect(page.locator('text=Editorial Operations')).toBeVisible();
  });

  test('New admin pages: Sources, Users List, Navbar Settings, and Trash render', async ({ page }) => {
    // 1. Login first
    await page.goto('/admin/login');
    await page.click('button:has-text("Auto-fill Super Admin")');
    await page.click('button:has-text("Authenticate Session")');
    await page.waitForURL('**/admin');

    // 2. Sources & Content Feeds (PropNewsTime, Realty & More)
    await page.goto('/admin/sources');
    await expect(page.locator('text=News Sources & Content Attribution')).toBeVisible();
    await expect(page.locator('text=PropNewsTime').first()).toBeVisible();
    await expect(page.locator('text=Realty & More').first()).toBeVisible();

    // 3. Users List
    await page.goto('/admin/users');
    await expect(page.locator('text=Users List & Access Control')).toBeVisible();
    await expect(page.locator('text=admin@nesturejournal.com')).toBeVisible();

    // 4. Articles Delete / Trash
    await page.goto('/admin/articles/deleted');
    await expect(page.locator('text=Articles Delete & Trash Management')).toBeVisible();

    // 5. Navbar Settings
    await page.goto('/admin/settings/navbar');
    await expect(page.locator('text=Navbar Settings & Menu Architecture')).toBeVisible();

    // 6. Show Published Articles (Navy Header Table matching reference)
    await page.goto('/admin/articles?status=PUBLISHED');
    await expect(page.locator('h1:has-text("Published Articles")')).toBeVisible();
    await expect(page.locator('th:has-text("seo_keywords")')).toBeVisible();

    // 7. Show Unpublished Articles (Card View matching reference)
    await page.goto('/admin/articles?status=UNPUBLISHED');
    await expect(page.locator('h1:has-text("Unpublished Articles")')).toBeVisible();
    await expect(page.locator('text=Showing 1 -').first()).toBeVisible();

    // 8. Add Article Page with Rich Text Toolbar & Full SEO
    await page.goto('/admin/articles/new');
    await expect(page.locator('h1:has-text("Add New Article")')).toBeVisible();
    await expect(page.locator('text=Body (H2/H3/H4 only)')).toBeVisible();
    await expect(page.locator('button:has-text("Submit Article")')).toBeVisible();
  });
});
