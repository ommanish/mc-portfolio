import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const app = readFileSync("labs/ai-command-center/js/app.js", "utf8");

test("app loads the stacked-card example without changing the page shell", () => {
  assert.match(app, /examples\/stacked-cards\.js/);
});

test("stacked-card example contains prompt, live demo, code tabs, copy actions, and accessibility guidance", () => {
  assert.ok(existsSync("labs/ai-command-center/js/examples/stacked-cards.js"));
  const source = readFileSync("labs/ai-command-center/js/examples/stacked-cards.js", "utf8");
  assert.match(source, /Stacked Card Scroll Animation/);
  assert.match(source, /data-example-prompt/);
  assert.match(source, /data-example-demo/);
  assert.match(source, /data-code-tab="html"/);
  assert.match(source, /data-code-tab="css"/);
  assert.match(source, /data-code-tab="js"/);
  assert.match(source, /data-copy-code/);
  assert.match(source, /data-copy-prompt/);
  assert.match(source, /Reduced motion/);
});

test("stacked-card example renders immediately after the hero", () => {
  const source = readFileSync("labs/ai-command-center/js/examples/stacked-cards.js", "utf8");
  assert.match(source, /document\.querySelector\("#welcome"\)/);
  assert.match(source, /target\.after\(section\)/);
  assert.doesNotMatch(source, /document\.querySelector\("#accessibility"\)/);
});

test("stacked-card styles include sticky stacking and a reduced-motion fallback", () => {
  assert.ok(existsSync("labs/ai-command-center/css/examples.css"));
  const css = readFileSync("labs/ai-command-center/css/examples.css", "utf8");
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
