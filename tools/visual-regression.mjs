import fs from "node:fs/promises";
import path from "node:path";

const playwrightModule = process.env.OHMY_PLAYWRIGHT_MODULE || "playwright";
const { chromium } = await import(playwrightModule);

const baseUrl = process.env.OHMY_TEST_URL || "http://127.0.0.1:4190";
const outputDir = path.resolve(process.argv[2] || ".visual-regression/current");
const launchOptions = { headless: true };
if (process.env.OHMY_BROWSER_PATH) launchOptions.executablePath = process.env.OHMY_BROWSER_PATH;
const browser = await chromium.launch(launchOptions);

const pages = [
  "index.html",
  "fashion.html",
  "article.html",
  "article-vhs.html",
  "article-template.html",
  "magazine.html",
  "photo.html",
  "about.html",
  "credits.html",
  "404.html",
];

const viewports = {
  desktop: { width: 1365, height: 1000 },
  mobile: { width: 390, height: 844 },
};

await fs.mkdir(outputDir, { recursive: true });
const report = [];

for (const [mode, viewport] of Object.entries(viewports)) {
  for (const pageName of pages) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.addInitScript(() => {
      let seed = 123456789;
      Math.random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
    });
    await page.route("**/counterapi.com/**", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"value":123}' });
    });
    await page.route("**/videos/*.mp4", async (route) => route.abort());

    const response = await page.goto(`${baseUrl}/${pageName}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.addStyleTag({
      content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
    });
    await page.waitForTimeout(350);
    await page.evaluate(async () => {
      await document.fonts?.ready;
      document.querySelectorAll("img[loading='lazy']").forEach((image) => {
        image.loading = "eager";
      });
      const imageLoads = Promise.all([...document.images].map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }));
      await Promise.race([
        imageLoads,
        new Promise((resolve) => window.setTimeout(resolve, 3000)),
      ]);
    });

    const metrics = await page.evaluate(() => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          x: Math.round(box.x * 100) / 100,
          y: Math.round(box.y * 100) / 100,
          width: Math.round(box.width * 100) / 100,
          height: Math.round(box.height * 100) / 100,
          display: style.display,
          position: style.position,
          borderTopWidth: style.borderTopWidth,
          backgroundColor: style.backgroundColor,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
        };
      };

      return {
        title: document.title,
        htmlClass: document.documentElement.className,
        bodyClass: document.body.className,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
        h1: document.querySelectorAll("h1").length,
        h2: document.querySelectorAll("h2").length,
        duplicateIds: [...document.querySelectorAll("[id]")]
          .map((element) => element.id)
          .filter((id, index, ids) => ids.indexOf(id) !== index),
        frame: rect(".shared-app-window"),
        titlebar: rect(".shared-titlebar"),
        tabs: rect(".shared-tabs"),
        search: rect(".shared-search-toggle"),
        content: rect(".shared-page-base"),
      };
    });

    const screenshotName = `${mode}-${pageName.replace(/\.html$/, "")}.png`;
    await page.screenshot({ path: path.join(outputDir, screenshotName), fullPage: false });
    report.push({
      mode,
      page: pageName,
      status: response?.status() || null,
      consoleErrors,
      pageErrors,
      metrics,
    });
    await context.close();
  }
}

await fs.writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
await browser.close();

const failed = report.filter((item) => item.status !== 200 || item.consoleErrors.length || item.pageErrors.length);
console.log(JSON.stringify({ outputDir, pages: report.length, failed }, null, 2));
