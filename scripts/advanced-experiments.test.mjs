import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = "labs/interactive-component-lab";
const advancedRoot = `${root}/js/advanced`;
const experiments = [
  ["spatial-command-center.js", "spatial-command-center"],
  ["ai-command-palette.js", "ai-command-palette"],
  ["elastic-depth-carousel.js", "elastic-depth-carousel"],
];

test("Advanced Experiments mounts a dedicated advanced registry without replacing Current Examples", () => {
  const html = readFileSync(`${root}/index.html`, "utf8");
  assert.match(html, /data-component-examples-root/);
  assert.match(html, /data-advanced-experiments-root/);
  assert.doesNotMatch(html, /Advanced Experiments gives us a clean place to add richer premium components later/);
  assert.ok(existsSync(`${advancedRoot}/registry.js`));
  const registry = readFileSync(`${advancedRoot}/registry.js`, "utf8");
  for (const token of ["AdvancedComponentLab", "register", "mountAll", "data-advanced-demo", "data-advanced-prompt", "data-advanced-code-tab", "Accessibility"]) {
    assert.match(registry, new RegExp(token));
  }
});

test("app loads the advanced registry and exactly the first three approved advanced experiments", () => {
  const app = readFileSync(`${root}/js/app.js`, "utf8");
  assert.match(app, /js\/advanced\/registry\.js/);
  for (const [file] of experiments) assert.match(app, new RegExp(file.replace(".", "\\.")));
  assert.match(app, /AdvancedComponentLab\?\.mountAll/);
});

test("the three advanced experiments expose prompts, real source and accessibility guidance", () => {
  for (const [file, id] of experiments) {
    const path = `${advancedRoot}/${file}`;
    assert.ok(existsSync(path), `missing ${file}`);
    const source = readFileSync(path, "utf8");
    assert.match(source, new RegExp(`id:\\s*[\"'\\\`]${id}[\"'\\\`]`));
    assert.match(source, /\bprompt\b/);
    assert.match(source, /source:/);
    assert.match(source, /\bhtml\b/);
    assert.match(source, /\bcss\b/);
    assert.match(source, /\bjs\b/);
    assert.match(source, /accessibility:/);
    assert.match(source, /reduced motion/i);
  }
});

test("Spatial Command Center includes four workspace states and contextual command interaction", () => {
  const source = readFileSync(`${advancedRoot}/spatial-command-center.js`, "utf8");
  for (const state of ["Overview", "Signals", "Decisions", "Actions"]) assert.match(source, new RegExp(state));
  assert.match(source, /data-spatial-view/);
  assert.match(source, /data-spatial-command/);
  assert.match(source, /keydown/);
});

test("AI Command Palette models intent through approval and execution with keyboard navigation", () => {
  const source = readFileSync(`${advancedRoot}/ai-command-palette.js`, "utf8");
  for (const state of ["Intent", "Context", "Suggested Actions", "Review", "Execute"]) assert.match(source, new RegExp(state));
  assert.match(source, /aria-activedescendant/);
  assert.match(source, /ArrowDown/);
  assert.match(source, /Approve/);
  assert.match(source, /Cancel/);
});

test("Elastic Depth Carousel supports pointer, wheel, buttons, keyboard and continuous progress", () => {
  const source = readFileSync(`${advancedRoot}/elastic-depth-carousel.js`, "utf8");
  for (const event of ["pointerdown", "pointermove", "pointerup", "wheel", "keydown"]) assert.match(source, new RegExp(event));
  assert.match(source, /data-depth-progress/);
  assert.match(source, /data-depth-prev/);
  assert.match(source, /data-depth-next/);
});

test("advanced visual system has responsive and reduced-motion fallbacks", () => {
  assert.ok(existsSync(`${root}/css/advanced.css`));
  const css = readFileSync(`${root}/css/advanced.css`, "utf8");
  for (const selector of ["advanced-experiment", "spatial-command", "command-palette", "depth-carousel"]) assert.match(css, new RegExp(selector));
  assert.match(css, /@media\s*\(max-width:/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /scroll-snap/);
});
