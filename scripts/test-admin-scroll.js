const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/admin/login');
  await page.click('button:has-text("Auto-fill Super Admin")');
  await page.click('button:has-text("Authenticate Session")');
  await page.waitForURL('**/admin');
  
  const aside = page.locator('aside').first();
  const boxBefore = await aside.boundingBox();
  
  // Scroll main
  await page.locator('main').evaluate((el) => {
    el.scrollTop = 500;
  });
  await page.waitForTimeout(300);
  
  const boxAfter = await aside.boundingBox();
  console.log('Sidebar Box Before Scroll:', boxBefore);
  console.log('Sidebar Box After Scroll:', boxAfter);
  
  if (boxBefore.y === boxAfter.y) {
    console.log('SUCCESS: Sidebar is 100% stationary and pinned while main content scrolls!');
  } else {
    console.log('FAILED: Sidebar moved!');
    process.exit(1);
  }
  
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
