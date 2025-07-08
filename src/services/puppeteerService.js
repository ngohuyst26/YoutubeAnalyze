const puppeteer = require("puppeteer");

async function captureThumbnail(url, outputPath) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector("video");
  await page.screenshot({ path: outputPath });
  await browser.close();
}

module.exports = { captureThumbnail };
