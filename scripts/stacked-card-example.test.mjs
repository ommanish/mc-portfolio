import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const app = readFileSync("labs/ai-command-center/js/app.js", "utf8");

test("app loads the shared registry and stacked-card module", () => {
  assert.match(app, /examples\/registry\.js/);
  assert.match(app, /examples\/stacked-cards\.js/);
});

test("stacked-card example registers real prompt, source, demo, and accessibility guidance", () => {
  assert.ok(existsSync("labs/ai-command-center/js/examples/stacked-cards.js"));
  const source = readFileSync("labs/ai-command-center/js/examples/stacked-cards.js", "utf8");
  assert.match(source, /id:\s*["']stacked-card-scroll["']/);
  assert.match(source, /title:\s*["']Stacked Card Scroll["']/);
  assert.match(source, /prompt/);
  assert.match(source, /source:/);
  assert.match(source, /html/);
  assert.match(source, /css/);
  assert.match(source, /js/);
  assert.match(source, /accessibility/);
  assert.match(source, /Reduced motion/i);
});

test("stacked-card styles include sticky stacking and a reduced-motion fallback", () => {
  const css = readFileSync("labs/ai-command-center/css/examples.css", "utf8");
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.stack-demo__card--1/);
  assert.match(css, /\.stack-demo__card--2/);
  assert.match(css, /\.stack-demo__card--3/);
});
