import { test, expect } from '@playwright/test';

test.describe('Admin Customizations Verification (Meta Ads Style, Word WYSIWYG & Clean Ordering)', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate Super Admin session
    await page.goto('/admin/login');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Auto-fill Super Admin")');
    await page.click('button:has-text("Authenticate Session")');
    await page.waitForURL('**/admin');
  });

  test('1. ADS & EDITORIAL is completely removed under logo', async ({ page }) => {
    const aside = page.locator('aside');
    await expect(aside.getByText('ADS & EDITORIAL')).toHaveCount(0);
    // When hovered, Nesture Journal text is smoothly visible
    await aside.hover();
    await page.waitForTimeout(350);
    await expect(aside.getByText('Nesture Journal').first()).toBeVisible();
    await page.screenshot({ path: 'public/images/admin-sidebar-expanded-new.png' });
  });

  test('2. Manual toggle buttons are completely removed as requested', async ({ page }) => {
    const aside = page.locator('aside');

    // Verify toggle buttons are NOT present
    await expect(aside.locator('button[title*="Collapse Side Navigation"]')).toHaveCount(0);
    await expect(aside.locator('button[title="Expand Side Navigation"]')).toHaveCount(0);
    await expect(aside.locator('svg.lucide-panel-left-close')).toHaveCount(0);
    await expect(aside.locator('svg.lucide-panel-left-open')).toHaveCount(0);
    await page.screenshot({ path: 'public/images/admin-sidebar-no-toggle.png' });
  });

  test('3. Silky smooth hover-to-expand on side rail', async ({ page }) => {
    const aside = page.locator('aside');

    // Sidebar should naturally be compact rail (md:w-16) on desktop
    await expect(aside).toHaveClass(/md:w-16/);

    // Hover over the rail
    await aside.hover();
    await page.waitForTimeout(350);

    // Should now be smoothly expanded (md:w-64)
    await expect(aside).toHaveClass(/md:w-64/);
    await expect(aside.getByText('Visual Customizer')).toBeVisible();

    // Move mouse away to the main content
    await page.locator('main').hover();
    await page.waitForTimeout(350);

    // Should smoothly collapse back to md:w-16
    await expect(aside).toHaveClass(/md:w-16/);
  });

  test('4. Search icon opens Admin Quick Search box (not public /search)', async ({ page }) => {
    const aside = page.locator('aside');

    // Find search button
    const searchBtn = aside.locator('button[title="Search Admin Modules"]').first();
    await searchBtn.click();

    // Admin Quick Search modal should open
    const searchModal = page.locator('text=Quick Admin Navigation');
    await expect(searchModal).toBeVisible();

    // URL should NOT have changed to /search
    expect(page.url()).toContain('/admin');
    expect(page.url()).not.toContain('/search?');

    // Typing 'articles' should filter admin modules inside modal
    const searchInput = page.locator('input[placeholder*="Type to search admin modules"]');
    await searchInput.fill('articles');

    await expect(page.locator('.fixed.inset-0 a[href="/admin/articles/new"]')).toBeVisible();
    await expect(page.locator('.fixed.inset-0 a[href="/admin/articles?status=PUBLISHED"]')).toBeVisible();
    await page.screenshot({ path: 'public/images/admin-quick-search-modal.png' });
  });

  test('5. Question mark (?) and duplicate Settings icon removed', async ({ page }) => {
    const aside = page.locator('aside');

    // Question mark (?) icon should not exist in aside
    await expect(aside.locator('svg.lucide-help-circle')).toHaveCount(0);

    // In bottom utility bar, only Quick Jump / search and logout should exist (no duplicate settings)
    const bottomSettingsIcon = aside.locator('div.border-t button svg.lucide-settings');
    await expect(bottomSettingsIcon).toHaveCount(0);

    // Main navigation has single Profile & Platform Settings
    await expect(aside.getByRole('link', { name: 'Profile & Platform Settings' })).toHaveCount(1);
  });

  test('6. Notifications row removed from sidebar navigation', async ({ page }) => {
    const aside = page.locator('aside');
    // In sidebar, there should NOT be any Notifications item
    await expect(aside.locator('nav').getByText('Notifications')).toHaveCount(0);

    // Header still has notifications bell
    const headerBell = page.locator('header button[title="System Notifications"]');
    await expect(headerBell).toBeVisible();
  });

  test('7. Settings page: Device/Gallery upload and live avatar sync', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');

    // Check "Upload from Device / Gallery" button is visible
    const uploadBtn = page.getByText('Upload from Device / Gallery');
    await expect(uploadBtn).toBeVisible();

    // Input new avatar URL
    const newAvatarUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80';
    const avatarInput = page.locator('input[placeholder*="images.unsplash.com"]');
    await avatarInput.fill(newAvatarUrl);

    // Click "Save Changes"
    await page.click('button:has-text("Save Profile")');
    await expect(page.getByText('Profile details and photo updated successfully!')).toBeVisible();

    // Check that header profile avatar now has the new URL immediately
    const headerAvatar = page.locator('header img[alt="admin"]');
    await expect(headerAvatar).toHaveAttribute('src', newAvatarUrl);
    await page.screenshot({ path: 'public/images/admin-settings-photo-upload.png' });
  });

  test('8. Add New Article: Word-like visual WYSIWYG editor (no raw code)', async ({ page }) => {
    await page.goto('/admin/articles/new');
    await page.waitForLoadState('networkidle');

    // Check that the Word-like visual editor canvas exists
    const editorCanvas = page.locator('div[contenteditable="true"]');
    await expect(editorCanvas).toBeVisible();

    // Verify visual Word mode badge is present
    await expect(page.getByText('MS Word Style Visual Editor')).toBeVisible();
    await expect(page.getByText('MS Word Visual Mode (No Code Displayed)')).toBeVisible();

    // Type text into the Word canvas
    await editorCanvas.click();
    await editorCanvas.fill('Premium Real Estate Market Analysis 2026');

    // Verify Gallery upload button for featured image exists
    await expect(page.getByText('Upload from Gallery')).toBeVisible();

    // Take screenshot of new Word-like editor
    await page.screenshot({ path: 'public/images/admin-word-editor.png' });
  });

  test('9. Published and Unpublished Articles: Clean cards & sequential numbers (no fake 7833 IDs)', async ({ page }) => {
    // Go to Unpublished Articles
    await page.goto('/admin/articles?status=UNPUBLISHED');
    await page.waitForLoadState('networkidle');

    // Ensure NO arbitrary fake ID #7833 exists
    await expect(page.locator('text=#7833')).toHaveCount(0);

    // Verify card layout has "Source Name :", "Ready for Publication", and "Publish" CTA button
    await expect(page.locator('text=Source Name :').first()).toBeVisible();
    await expect(page.locator('text=Ready for Publication').first()).toBeVisible();
    await expect(page.locator('button:has-text("Publish")').first()).toBeVisible();

    // Take screenshot matching user image 3
    await page.screenshot({ path: 'public/images/admin-unpublished-cards.png' });

    // Go to Published Articles
    await page.goto('/admin/articles?status=PUBLISHED');
    await page.waitForLoadState('networkidle');

    // Ensure sequential indexing (#01) is displayed, and no #7833
    await expect(page.locator('text=#7833')).toHaveCount(0);
    await expect(page.locator('text=#01').first()).toBeVisible();
    await expect(page.locator('text=Live on Website Portal').first()).toBeVisible();
    await page.screenshot({ path: 'public/images/admin-published-articles.png' });
  });

  test('10. Clean Architecture & Order for all 5 Admin Modules', async ({ page }) => {
    // 1. Taxonomy & Category Architecture
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1:has-text("Taxonomy & Category Architecture")')).toBeVisible();

    // 2. Navbar Settings & Menu Architecture
    await page.goto('/admin/settings/navbar');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1:has-text("Navbar Settings & Menu Architecture")')).toBeVisible();

    // 3. SEO Engine & Indexation Audit
    await page.goto('/admin/seo');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1:has-text("SEO Engine & Indexation Audit")')).toBeVisible();

    // 4. News Sources & Content Attribution
    await page.goto('/admin/sources');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1:has-text("News Sources & Content Attribution")')).toBeVisible();

    // 5. Profile & Platform Settings
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1:has-text("Profile & Platform Settings")')).toBeVisible();
  });

  test('11. Insert Table Picker is neat, highlighted on hover, no overflow', async ({ page }) => {
    await page.goto('/admin/articles/new');
    await page.waitForLoadState('networkidle');

    // Click Insert Formatted Table button
    const tableBtn = page.locator('button[title="Insert Formatted Table"]');
    await tableBtn.click();

    // Verify popover opens with explicit width and no overflow
    const tablePicker = page.locator('div.w-60');
    await expect(tablePicker).toBeVisible();

    // Hover over 3rd row, 3rd column cell
    const cell33 = page.locator('button[title="3 rows × 3 columns"]');
    await cell33.hover();

    // Header updates to "3 × 3"
    await expect(page.getByText('3 × 3', { exact: true })).toBeVisible();

    await page.screenshot({ path: 'public/images/admin-table-picker-neat.png' });

    // Click cell to insert 3x3 table
    await cell33.click();

    // Verify table is inserted inside contenteditable editor canvas
    const table = page.locator('div[contenteditable="true"] table');
    await expect(table).toBeVisible();
    await expect(page.locator('div[contenteditable="true"] th')).toHaveCount(3);
  });

  test('12. Submit Article triggers Confirmation Modal before live publication', async ({ page }) => {
    await page.goto('/admin/articles/new');
    await page.waitForLoadState('networkidle');

    // Fill Title
    await page.locator('input[placeholder*="83.8 Crore Worth Villas"]').fill('Prime Commercial Real Estate Surge in 2026');

    // Click Submit & Publish
    const submitBtn = page.locator('button:has-text("Submit & Publish")');
    await submitBtn.click();

    // Verify Confirmation Modal opens
    const confirmModal = page.locator('text=Confirm Article Publication');
    await expect(confirmModal).toBeVisible();
    await expect(page.locator('text=Are you sure you want to submit and publish this article live')).toBeVisible();
    await expect(page.locator('text=Prime Commercial Real Estate Surge in 2026')).toBeVisible();
    await expect(page.locator('text=Live Publication')).toBeVisible();

    await page.screenshot({ path: 'public/images/admin-submit-confirmation-modal.png' });

    // Click Cancel & Review
    await page.click('button:has-text("Cancel & Review")');
    await expect(confirmModal).not.toBeVisible();
  });

  test('13. Visual Customizer: Real Live Site Mirror, Right Dock, Categories Reorder & Presets', async ({ page }) => {
    await page.goto('/admin/customize');
    await page.waitForLoadState('networkidle');

    // 1. Image 1 green badge "Interactive Figma Canvas" is completely removed
    await expect(page.locator('text=Interactive Figma Canvas')).toHaveCount(0);
    await expect(page.locator('text=Drag handles on canvas with mouse to resize')).toHaveCount(0);

    // 2. Old left "Mouse Drag & Sizing" tab is completely removed
    await expect(page.locator('text=Mouse Drag & Sizing')).toHaveCount(0);

    // 3. Real live website mirror is embedded via iframe
    const liveFrame = page.locator('iframe[title="Live Website Mirror Preview"]');
    await expect(liveFrame).toBeVisible();

    // 4. Outer overlay drag handles & top sizing toolbar are removed as requested
    await expect(page.locator('text=Drag with mouse to resize banner height')).toHaveCount(0);
    await expect(page.locator('text=Side Drag')).toHaveCount(0);
    await expect(page.locator('button:has-text("Split (8-Col)")')).toHaveCount(0);
    await expect(page.locator('button:has-text("Full Width (12-Col)")')).toHaveCount(0);

    // 5. Embedded in-section border-hugging handles appear inside the live mirror iframe (?customize=1)
    const frame = page.frameLocator('iframe[title="Live Website Mirror Preview"]');
    await expect(frame.locator('text=Drag with mouse to resize').first()).toBeVisible({ timeout: 10000 });
    await expect(frame.locator('text=Resize Card Height').first()).toBeVisible();
    await expect(frame.locator('text=Resize Card Image').first()).toBeVisible();

    // Verify admin sidebar is NOT present in full-screen customizer studio
    await expect(page.locator('aside nav')).toHaveCount(0);

    // 6. Device viewport switchers work (Desktop, Tablet, Mobile)
    const tabletBtn = page.locator('button[title="Tablet View (768px)"]');
    await expect(tabletBtn).toBeVisible();
    await tabletBtn.click();

    const desktopBtn = page.locator('button[title="Desktop View (100%)"]');
    await expect(desktopBtn).toBeVisible();
    await desktopBtn.click();

    // 7. Right Dock Tabs: Color Packs, Palette, Categories, Presets
    const packsTab = page.locator('button:has-text("Color Packs")');
    const paletteTab = page.locator('button:has-text("Palette")');
    const categoriesTab = page.locator('button:has-text("Categories")');
    const presetsTab = page.locator('button:has-text("Presets")');

    await expect(packsTab).toBeVisible();
    await expect(paletteTab).toBeVisible();
    await expect(categoriesTab).toBeVisible();
    await expect(presetsTab).toBeVisible();

    // Select a Color Pack (e.g. Luxury Midnight)
    await page.click('text=Luxury Midnight');

    // Test Categories tab & reordering
    await categoriesTab.click();
    await expect(page.getByText('Rearrange Category Order')).toBeVisible();
    const moveDownBtn = page.locator('button[title="Move Category Down"]').first();
    await moveDownBtn.click();

    // Test Presets tab & Confirmation Modal
    await presetsTab.click();
    await expect(page.getByText('Design Presets & Templates')).toBeVisible();

    // Save a new preset
    const presetInput = page.locator('input[placeholder*="Festival 2026 Edition"]');
    await presetInput.fill('Elite Editorial Special 2026');
    // Handle dialog
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await page.click('button:has-text("Save Preset")');
    await expect(page.getByText('Elite Editorial Special 2026')).toBeVisible();

    // Click Apply Template on built-in preset -> triggers Confirmation Modal
    const applyBtn = page.locator('button:has-text("Apply Template")').first();
    await applyBtn.click();

    // Verify Confirmation Modal
    const confirmModal = page.locator('h3:has-text("Design Template?")');
    await expect(confirmModal).toBeVisible();
    await page.click('button:has-text("Confirm & Apply")');
    await expect(confirmModal).not.toBeVisible();

    // Reset button triggers Reset Confirmation Modal
    await page.locator('button[title="Reset to factory default theme"]').click();
    const resetModal = page.locator('h3:has-text("Reset to Factory Default Template?")');
    await expect(resetModal).toBeVisible();
    await page.click('button:has-text("Cancel")');
    await expect(resetModal).not.toBeVisible();

    // Capture screenshot of updated studio
    await page.screenshot({ path: 'public/images/admin-customizer-full-live-right-dock.png' });

    // Click Publish to Live Website
    const publishBtn = page.locator('button:has-text("Publish to Live Website")').first();
    await publishBtn.click();
    await expect(page.getByText('All visual and layout adjustments published live!')).toBeVisible();

    // Check Live Website Portal has matching styling and renders without errors
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify header, banner, category ribbons and category badges render
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#hero-side-stories')).toBeVisible();
    await page.screenshot({ path: 'public/images/live-site-theme-applied.png' });
  });

  test('14. Outside click automatically dismisses Notification & Profile dropdowns', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // 1. Notification Dropdown outside-click dismissal
    const bellBtn = page.locator('button[title="System Notifications"]');
    await bellBtn.click();
    const alertsPopup = page.locator('text=Recent System Alerts');
    await expect(alertsPopup).toBeVisible();

    // Click outside on the main content area
    await page.locator('main').click({ position: { x: 50, y: 150 } });
    await expect(alertsPopup).not.toBeVisible();

    // 2. Profile Avatar Dropdown outside-click dismissal
    const profileBtn = page.locator('main header').locator('button:has-text("Director")').first();
    await profileBtn.click();
    const profileDropdown = page.locator('text=Sign Out Session');
    await expect(profileDropdown).toBeVisible();

    // Click outside on the main content area
    await page.locator('main').click({ position: { x: 50, y: 150 } });
    await expect(profileDropdown).not.toBeVisible();
  });

  test('15. Unpublished Articles: Stat cards hidden, Red Delete button, 10-Min Scraper & 1-Click Publish', async ({ page }) => {
    // Navigate to Unpublished Articles
    await page.goto('/admin/articles?status=UNPUBLISHED');
    await page.waitForLoadState('networkidle');

    // Stat cards (Total Repository, Published Articles, etc.) should NOT be visible
    await expect(page.getByText('TOTAL REPOSITORY')).toHaveCount(0);
    await expect(page.getByText('LIVE ON SITE')).toHaveCount(0);

    // Dedicated Unpublished Queue header & Auto-Scraper banner should be visible
    await expect(page.getByText('Unpublished Editorial & Worldwide News Queue')).toBeVisible();
    await expect(page.getByText('10-Minute Auto-Scraper Active')).toBeVisible();

    // Red Delete button check on unpublished card
    const deleteBtn = page.locator('button[title="Move to Trash / Delete"]').first();
    await expect(deleteBtn).toBeVisible();
    await expect(deleteBtn).toHaveClass(/bg-rose-50/);
    await expect(deleteBtn).toHaveClass(/text-rose-600/);

    // Sector filter bar is present
    await expect(page.getByText('Sector Filter:')).toBeVisible();

    // Trigger Worldwide Scrape button is present and clickable
    const scrapeBtn = page.locator('button:has-text("⚡ Scrape & Ingest Latest Worldwide News Now")');
    await expect(scrapeBtn).toBeVisible();

    // Publish All button is present
    const publishAllBtn = page.locator('button:has-text("Publish All")');
    await expect(publishAllBtn).toBeVisible();

    // Capture screenshot of Unpublished Editorial Queue
    await page.screenshot({ path: 'public/images/admin-unpublished-articles-queue-new.png' });

    // Click Publish on an article -> Confirmation modal appears -> Confirm & Publish Live
    const publishBtn = page.locator('button[title*="1-Click Publish to Live Website"]').first();
    if (await publishBtn.isVisible()) {
      await publishBtn.click();
      await expect(page.getByText('Confirm Live Publication')).toBeVisible();
      const confirmBtn = page.locator('button:has-text("Confirm & Publish Live")');
      await expect(confirmBtn).toBeVisible();
      await confirmBtn.click();
      await page.waitForTimeout(1000);
    }
  });
});
