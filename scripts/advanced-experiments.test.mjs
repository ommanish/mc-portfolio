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
  ["animated-tabs.js", "animated-tabs"],
  ["magnetic-cta.js", "magnetic-cta"],
  ["sticky-header-reveal.js", "sticky-header-reveal"],
  ["before-after-slider.js", "before-after-slider"],
  ["timeline-reveal.js", "timeline-reveal"],
  ["logo-marquee.js", "logo-marquee"],
  ["gallery-hover-preview.js", "gallery-hover-preview"],
  ["scroll-progress-indicator.js", "scroll-progress-indicator"],
  ["section-color-transition.js", "section-color-transition"],
];

test("Advanced tab keeps Current Examples and mounts twelve page-ready motion components", () => {
  const html = readFileSync(`${root}/index.html`, "utf8");
  assert.match(html, /data-component-examples-root/);
  assert.match(html, /data-advanced-experiments-root/);
  assert.match(html, /12 page-ready motion components/i);
});

test("app loads all twelve advanced page motion components", () => {
  const app = readFileSync(`${root}/js/app.js`, "utf8");
  for (const [file] of experiments) assert.match(app, new RegExp(file.replace(".", "\\.")));
  assert.doesNotMatch(app, /spatial-command-center|ai-command-palette|elastic-depth-carousel/);
});

test("each motion component exposes live demo, prompt, source and accessibility guidance", () => {
  for (const [file, id] of experiments) {
    const source = readFileSync(`${advancedRoot}/${file}`, "utf8");
    assert.match(source, new RegExp(`id:\\s*["'\\\`]${id}["'\\\`]`));
    assert.match(source, /prompt/);
    assert.match(source, /source:/);
    assert.match(source, /accessibility:/);
  }
});

test("hero replay uses direct Web Animations API sequence", () => {
  const source = readFileSync(`${advancedRoot}/animated-hero-headline.js`, "utf8");
  assert.match(source, /data-rich-hero-replay/);
  assert.match(source, /animate\\(/);
  assert.match(source, /getAnimations/);
});

test("all twelve advanced component files execute and register without load-time errors", () => {
  const registered = [];
  const context = vm.createContext({
    window: { AdvancedComponentLab: { register(component) { registered.push(component.id); } } },
  });
  for (const [file] of experiments) {
    const source = readFileSync(`${advancedRoot}/${file}`, "utf8");
    assert.doesNotThrow(() => vm.runInContext(source, context, { filename: file }));
  }
  assert.deepEqual(registered, experiments.map(([, id]) => id));
});

test("Advanced components mount only when the Advanced collection becomes visible", () => {
  const app = readFileSync(`${root}/js/app.js`, "utf8");
  assert.match(app, /componentlab:collectionchange/);
  assert.match(app, /detail\?\.name === "advanced"/);
  assert.match(app, /advancedMounted/);
});

test("advanced visual system is responsive and reduced-motion safe", () => {
  const css = readFileSync(`${root}/css/advanced.css`, "utf8");
  for (const selector of ["rich-hero", "rich-card", "rich-reveal", "rich-tabs", "magnetic-cta", "compare", "motion-timeline", "brand-marquee", "hover-gallery", "reading-demo", "color-story"]) assert.match(css, new RegExp(selector));
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});


test("first four advanced components use richer coordinated interaction patterns", () => {
  const hero = readFileSync(`${advancedRoot}/animated-hero-headline.js`, "utf8");
  const cards = readFileSync(`${advancedRoot}/premium-hover-cards.js`, "utf8");
  const reveal = readFileSync(`${advancedRoot}/image-reveal-section.js`, "utf8");
  const tabs = readFileSync(`${advancedRoot}/animated-tabs.js`, "utf8");
  assert.match(hero, /rich-hero__media/);
  assert.match(hero, /pointermove/);
  assert.match(cards, /--rx/);
  assert.match(cards, /perspective|tilt/i);
  assert.match(reveal, /rich-reveal__float/);
  assert.match(reveal, /IntersectionObserver/);
  assert.match(tabs, /rich-tabs__media/);
  assert.match(tabs, /data-tone/);
});
