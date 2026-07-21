import puppeteer from 'puppeteer';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 900 });

// Serve the local index.html via file URL
const url = pathToFileURL(resolve('index.html')).href;
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for the 3D canvas to load and trigger explode
await page.waitForFunction(() => {
  const btn = document.getElementById('hw-toggle');
  return btn && !btn.disabled;
}, { timeout: 15000 });

// Click explode button
await page.click('#hw-toggle');

// Wait for animation to finish (~2s)
await new Promise(r => setTimeout(r, 2500));

// Screenshot just the canvas area
const canvas = await page.$('#hw-canvas');
if (canvas) {
  await canvas.screenshot({ path: 'docs/images/backpack-exploded-render.png' });
  console.log('Saved -> docs/images/backpack-exploded-render.png');
} else {
  await page.screenshot({ path: 'docs/images/backpack-exploded-render.png' });
  console.log('Saved full page -> docs/images/backpack-exploded-render.png');
}

await browser.close();
