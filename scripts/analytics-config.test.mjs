import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { applyExperimentShell } from "./experiment-shell.mjs";

const html = '<!doctype html><html><head><title>Portfolio</title></head><body><div id="root"></div></body></html>';

function tempIndexes() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mc-analytics-shell-"));
  const classic = path.join(dir, "classic.html");
  const adaptive = path.join(dir, "adaptive.html");
  fs.writeFileSync(classic, html);
  fs.writeFileSync(adaptive, html);
  return { dir, classic, adaptive };
}

test("classic and adaptive outputs receive the shared analytics client", () => {
  const { dir, classic, adaptive } = tempIndexes();
  try {
    applyExperimentShell(classic, adaptive, "https://api.example", "publictoken12345678901234567890");
    for (const file of [classic, adaptive]) {
      const result = fs.readFileSync(file, "utf8");
      assert.match(result, /id="portfolio-analytics-client"/);
      assert.match(result, /src="\/portfolio-analytics\.js"/);
      assert.match(result, /data-api-base="https:\/\/api\.example"/);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("Cloudflare Web Analytics beacon is injected in head only when token is present", () => {
  const withToken = tempIndexes();
  const withoutToken = tempIndexes();
  try {
    applyExperimentShell(withToken.classic, withToken.adaptive, "https://api.example", "publictoken12345678901234567890");
    applyExperimentShell(withoutToken.classic, withoutToken.adaptive, "https://api.example", "");

    const included = fs.readFileSync(withToken.adaptive, "utf8");
    const omitted = fs.readFileSync(withoutToken.adaptive, "utf8");

    assert.match(included, /static\.cloudflareinsights\.com\/beacon\.min\.js/);
    assert.match(included, /data-cf-beacon=/);
    assert.doesNotMatch(omitted, /cloudflare-web-analytics/);

    const body = included.match(/<body>([\s\S]*)<\/body>/)?.[1] || "";
    assert.doesNotMatch(body, /portfolio-analytics-client/);
    assert.doesNotMatch(body, /cloudflare-web-analytics/);
  } finally {
    fs.rmSync(withToken.dir, { recursive: true, force: true });
    fs.rmSync(withoutToken.dir, { recursive: true, force: true });
  }
});

test("analytics injection is idempotent", () => {
  const { dir, classic, adaptive } = tempIndexes();
  try {
    applyExperimentShell(classic, adaptive, "https://api.example", "publictoken12345678901234567890");
    const once = fs.readFileSync(classic, "utf8");
    applyExperimentShell(classic, adaptive, "https://api.example", "publictoken12345678901234567890");
    const twice = fs.readFileSync(classic, "utf8");
    assert.equal(twice, once);
    assert.equal((twice.match(/portfolio-analytics-client/g) || []).length, 1);
    assert.equal((twice.match(/cloudflare-web-analytics/g) || []).length, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
