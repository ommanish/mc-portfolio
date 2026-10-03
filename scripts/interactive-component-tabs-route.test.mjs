import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = "labs/interactive-component-lab";

test("Interactive Component Lab uses the renamed source route", () => {
  assert.equal(existsSync(`${root}/index.html`), true);
  assert.equal(existsSync("labs/ai-command-center/index.html"), false);
});

test("page exposes accessible Current Examples and Advanced Experiments tabs", () => {
  const html = readFileSync(`${root}/index.html`, "utf8");
  assert.match(html, /role="tablist"/);
  assert.match(html, />Current Examples</);
  assert.match(html, />Advanced Experiments</);
  assert.match(html, /data-lab-panel="current"/);
  assert.match(html, /data-lab-panel="advanced"/);
  assert.match(html, /Premium product UI and experimental motion components are coming next/i);
});

test("app supports keyboard-accessible lab tab switching", () => {
  const app = readFileSync(`${root}/js/app.js`, "utf8");
  assert.match(app, /data-lab-tab/);
  assert.match(app, /aria-selected/);
  assert.match(app, /ArrowLeft|ArrowRight/);
});

test("all local Lab asset references use the renamed public route", () => {
  const html = readFileSync(`${root}/index.html`, "utf8");
  assert.doesNotMatch(html, /\/labs\/ai-command-center\//);
  assert.match(html, /\/labs\/interactive-component-lab\/css\/base\.css/);
  const app = readFileSync(`${root}/js/app.js`, "utf8");
  assert.doesNotMatch(app, /\/labs\/ai-command-center\//);
  assert.match(app, /\/labs\/interactive-component-lab\/js\/examples\//);
});

test("portfolio links to the renamed Lab route", () => {
  const source = readFileSync("src/components/CaseStudies.jsx", "utf8");
  assert.match(source, /href="\/labs\/interactive-component-lab\/"/);
  assert.doesNotMatch(source, /href="\/labs\/ai-command-center\/"/);
});
