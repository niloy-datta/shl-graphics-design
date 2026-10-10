const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to match poster dimensions
  await page.setViewportSize({ width: 1200, height: 1450 });

  // Navigate to the poster HTML file
  const filePath = path.resolve(__dirname, 'poster.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Extra wait for everything to render
  await page.waitForTimeout(2000);

  // Capture just the poster element
  const poster = await page.$('#poster');
  if (!poster) {
    console.error('Poster element not found!');
    await browser.close();
    process.exit(1);
  }

  // Get bounding box to verify dimensions
  const box = await poster.boundingBox();
  console.log(`Poster dimensions: ${box.width} x ${box.height}`);

  // Screenshot the poster element
  await poster.screenshot({
    path: path.resolve(__dirname, 'shl-sara-huang-linkedin.png'),
    type: 'png',
  });

  console.log('Export complete: shl-sara-huang-linkedin.png');
  await browser.close();
})();
