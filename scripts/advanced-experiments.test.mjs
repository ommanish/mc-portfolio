import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const root = "labs/interactive-component-lab";
const advancedRoot = `${root}/js/advanced`;
const experiments = [
  ["animated-hero-headline.js", "animated-hero-headline"],
  ["premium-hover-cards.js", "premium-hover-cards"],
  ["image-reveal-section.js", "image-reveal-section"],
];

test("Advanced tab keeps Current Examples and mounts three page-ready motion components", () => {
  const html = readFileSync(`${root}/index.html`, "utf8");
  assert.match(html, /data-component-examples-root/);
  assert.match(html, /data-advanced-experiments-root/);
  assert.match(html, /UI\/UX motion patterns for real web pages/i);
});

test("app loads exactly the three page-ready advanced components", () => {
  const app = readFileSync(`${root}/js/app.js`, "utf8");
  for (const [file] of experiments) assert.match(app, new RegExp(file.replace(".", "\\.")));
  assert.doesNotMatch(app, /spatial-command-center|ai-command-palette|elastic-depth-carousel/);
});

test("each motion component exposes live demo, prompt, source and accessibility guidance", () => {
  for (const [file, id] of experiments) {
    const path = `${advancedRoot}/${file}`;
    assert.ok(existsSync(path), `missing ${file}`);
    const source = readFileSync(path, "utf8");
    assert.match(source, new RegExp(`id:\\s*["'\\\`]${id}["'\\\`]`));
    assert.match(source, /prompt/);
    assert.match(source, /source:/);
    assert.match(source, /accessibility:/);
    assert.match(source, /reduced motion/i);
  }
});

test("animated hero supports replay and split text reveal", () => {
  const source = readFileSync(`${advancedRoot}/animated-hero-headline.js`, "utf8");
  assert.match(source, /data-hero-replay/);
  assert.match(source, /hero-word/);
  assert.match(source, /animation-delay/);
});

test("hover cards use pointer position without making hover essential", () => {
  const source = readFileSync(`${advancedRoot}/premium-hover-cards.js`, "utf8");
  assert.match(source, /pointermove/);
  assert.match(source, /--x/);
  assert.match(source, /focus-visible|focus/);
});

test("image reveal section uses observer-triggered clip reveal with replay fallback", () => {
  const source = readFileSync(`${advancedRoot}/image-reveal-section.js`, "utf8");
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /clip-path|clipPath/);
  assert.match(source, /data-reveal-replay/);
});

test("advanced visual system is responsive and reduced-motion safe", () => {
  const css = readFileSync(`${root}/css/advanced.css`, "utf8");
  for (const selector of ["advanced-experiment", "motion-hero", "hover-showcase", "image-reveal"]) assert.match(css, new RegExp(selector));
  assert.match(css, /@media\s*\(max-width:/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});


test("all three advanced component files execute and register without load-time errors", () => {
  const registered = [];
  const context = vm.createContext({
    window: {
      AdvancedComponentLab: {
        register(component) { registered.push(component.id); },
      },
    },
  });

  for (const [file] of experiments) {
    const source = readFileSync(`${advancedRoot}/${file}`, "utf8");
    assert.doesNotThrow(() => vm.runInContext(source, context, { filename: file }));
  }

  assert.deepEqual(registered, experiments.map(([, id]) => id));
});
