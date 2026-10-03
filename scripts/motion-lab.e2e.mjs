import { spawn } from "node:child_process";
import { chromium } from "playwright";
import assert from "node:assert/strict";

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

function waitForServer(url, timeoutMs = 20000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) return resolve();
      } catch {}
      if (Date.now() - started > timeoutMs) return reject(new Error(`Timed out waiting for ${url}`));
      setTimeout(check, 250);
    };
    check();
  });
}

const preview = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port)], {
  stdio: ["ignore", "pipe", "pipe"],
  env: process.env,
});

let browser;
try {
  await waitForServer(`${baseURL}/labs/ai-command-center/`);
  browser = await chromium.launch();

  async function pageFor({ reducedMotion = "no-preference", width = 1280, height = 900, blockGsap = false } = {}) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
    const page = await context.newPage();
    if (blockGsap) await page.route("**/gsap@3.12.5/**", (route) => route.abort());
    await page.goto(`${baseURL}/labs/ai-command-center/`, { waitUntil: "domcontentloaded" });
    return { context, page };
  }

  {
    const { context, page } = await pageFor();
    await page.getByRole("button", { name: /experience settings/i }).first().focus();
    assert.equal(await page.evaluate(() => document.activeElement?.matches("[data-settings-toggle]")), true);
    await page.getByRole("button", { name: /experience settings/i }).first().click();
    assert.equal(await page.getByRole("button", { name: "Light" }).isVisible(), true);
    await context.close();
  }

  {
    const { context, page } = await pageFor({ reducedMotion: "reduce" });
    assert.equal(await page.locator('[data-lab="ai-command-center"]').getAttribute("data-motion"), "reduced");
    assert.equal(await page.locator(".pin-spacer").count(), 0);
    await context.close();
  }

  {
    const { context, page } = await pageFor();
    await page.getByRole("button", { name: /experience settings/i }).first().click();
    await page.getByRole("button", { name: "Light" }).click();
    await page.locator("#processing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    assert.equal(await page.locator('[data-lab="ai-command-center"]').getAttribute("data-theme"), "light");
    await context.close();
  }

  {
    const { context, page } = await pageFor();
    await page.getByRole("button", { name: /experience settings/i }).first().click();
    await page.getByRole("button", { name: /pause animation/i }).click();
    assert.equal(await page.locator('[data-lab="ai-command-center"]').getAttribute("data-paused"), "true");
    await page.locator("#intelligence").scrollIntoViewIfNeeded();
    assert.equal(await page.locator('[data-lab="ai-command-center"]').getAttribute("data-paused"), "true");
    await page.getByRole("button", { name: /resume animation/i }).click();
    assert.equal(await page.locator('[data-lab="ai-command-center"]').getAttribute("data-paused"), "false");
    await context.close();
  }

  {
    const { context, page } = await pageFor({ width: 390, height: 844 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    assert.equal(overflow, false);
    await context.close();
  }

  {
    const { context, page } = await pageFor({ width: 640, height: 700 });
    await page.evaluate(() => { document.documentElement.style.zoom = "2"; });
    assert.equal(await page.getByRole("heading", { name: /make complex work feel/i }).isVisible(), true);
    assert.equal(await page.getByRole("button", { name: /experience settings/i }).first().isVisible(), true);
    await context.close();
  }

  {
    const { context, page } = await pageFor({ blockGsap: true });
    const headings = await page.locator("[data-chapter] h2, [data-chapter] h1").count();
    assert.ok(headings >= 8);
    assert.equal(await page.getByText(/One request becomes a structured plan/i).isVisible(), true);
    await context.close();
  }

  console.log("Motion Lab browser checks passed.");
} finally {
  await browser?.close();
  preview.kill("SIGTERM");
}
