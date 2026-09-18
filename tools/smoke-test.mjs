import assert from "node:assert/strict";

const playwrightModule = process.env.OHMY_PLAYWRIGHT_MODULE || "playwright";
const { chromium } = await import(playwrightModule);

const baseUrl = process.env.OHMY_TEST_URL || "http://127.0.0.1:4190";
const launchOptions = { headless: true };
if (process.env.OHMY_BROWSER_PATH) launchOptions.executablePath = process.env.OHMY_BROWSER_PATH;
const browser = await chromium.launch(launchOptions);
const context = await browser.newContext({ viewport: { width: 1365, height: 1000 } });
await context.route("**/counterapi.com/**", async (route) => {
  await route.fulfill({ status: 200, contentType: "application/json", body: '{"value":123}' });
});

const pageNames = [
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
const results = [];

for (const pageName of pageNames) {
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const response = await page.goto(`${baseUrl}/${pageName}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  assert.equal(response?.status(), 200, `${pageName} should load successfully`);
  await page.waitForTimeout(250);

  const duplicateIds = await page.evaluate(() => [...document.querySelectorAll("[id]")]
    .map((element) => element.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index));
  assert.deepEqual(duplicateIds, [], `${pageName} should not contain duplicate IDs`);

  const searchToggle = page.locator(".desktop-site-titlebar .shared-search-toggle");
  if (await searchToggle.count()) {
    await searchToggle.click();
    assert.equal(await page.locator("#shared-search-panel").isVisible(), true, `${pageName} search should open`);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#shared-search-panel").isVisible(), false, `${pageName} search should close`);
  }

  if (await page.locator("body.subpage").count()) {
    const minimize = page.locator('.desktop-site-titlebar [data-window-action="minimize"], .desktop-site-titlebar #window-minimize');
    const maximize = page.locator('.desktop-site-titlebar [data-window-action="maximize"], .desktop-site-titlebar #window-maximize');
    if (await minimize.count()) {
      await minimize.click();
      assert.equal(await page.locator("body").evaluate((body) => body.classList.contains("is-subpage-minimized")), true);
      await minimize.click();
    }
    if (await maximize.count()) {
      await maximize.click();
      assert.equal(await page.locator("body").evaluate((body) => body.classList.contains("is-subpage-maximized")), true);
      await maximize.click();
    }
  }

  const close = page.locator('.desktop-site-titlebar [data-window-action="close"], .desktop-site-titlebar #window-close');
  if (await close.count()) {
    await close.click();
    assert.equal(await page.locator(".shared-app-window").isVisible(), false, `${pageName} window should close`);
    assert.equal(await page.locator("#closed-screen").isVisible(), true, `${pageName} closed screen should appear`);
    await page.locator("#window-reopen").click();
    assert.equal(await page.locator(".shared-app-window").isVisible(), true, `${pageName} window should reopen`);
  }

  if (await page.locator("[data-reading-progress]").count()) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(50);
    const transform = await page.locator("[data-reading-progress]").evaluate((element) => element.style.transform);
    assert.notEqual(transform, "scaleX(0)", `${pageName} reading progress should update`);
  }

  if (pageName === "fashion.html") {
    await page.locator("[data-fashion-category-toggle]").click();
    assert.equal(await page.locator("#fashion-category-menu").isVisible(), true, "FASHION category menu should open");
    await page.locator('[data-fashion-channel="archive"]').click();
    assert.equal(await page.locator("#fashion-category-menu").isVisible(), false, "FASHION category menu should close after selection");
    assert.ok(await page.locator('.fashion-stream-card:not([hidden])').count() > 0, "FASHION archive should show articles");
  }

  if (pageName === "about.html") {
    const video = page.locator(".profile-motion video");
    await video.waitFor({ state: "attached" });
    await page.waitForFunction(() => {
      const element = document.querySelector(".profile-motion video");
      return element && element.readyState >= 2 && !element.paused;
    }, null, { timeout: 15000 });
  }

  assert.deepEqual(pageErrors, [], `${pageName} should not throw page errors`);
  results.push({ page: pageName, passed: true });
  await page.close();
}

await context.close();

const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
for (const pageName of pageNames) {
  const page = await mobileContext.newPage();
  const response = await page.goto(`${baseUrl}/${pageName}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  assert.equal(response?.status(), 200);
  await page.locator("#ohmy-os-stage-frame").waitFor({ state: "attached", timeout: 10000 });
  assert.equal(await page.locator("#ohmy-os-stage-frame").count(), 1, `${pageName} should mount one phone stage`);
  await page.close();
}
await mobileContext.close();
await browser.close();

console.log(JSON.stringify({ passed: results.length, mobileStages: pageNames.length }, null, 2));
