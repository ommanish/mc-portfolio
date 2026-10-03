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
  assert.match(source, /data-hero-replay/);
  assert.match(source, /word\.animate/);
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
  for (const selector of ["motion-hero", "hover-showcase", "image-reveal", "motion-tabs", "magnetic-cta", "compare", "motion-timeline", "brand-marquee", "hover-gallery", "reading-demo", "color-story"]) assert.match(css, new RegExp(selector));
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});


test("audited advanced interactions expose reliable accessibility and motion behavior", () => {
  const tabs = readFileSync(`${advancedRoot}/animated-tabs.js`, "utf8");
  const magnetic = readFileSync(`${advancedRoot}/magnetic-cta.js`, "utf8");
  const sticky = readFileSync(`${advancedRoot}/sticky-header-reveal.js`, "utf8");
  const compare = readFileSync(`${advancedRoot}/before-after-slider.js`, "utf8");
  const marquee = readFileSync(`${advancedRoot}/logo-marquee.js`, "utf8");
  const gallery = readFileSync(`${advancedRoot}/gallery-hover-preview.js`, "utf8");
  const color = readFileSync(`${advancedRoot}/section-color-transition.js`, "utf8");
  const cards = readFileSync(`${advancedRoot}/premium-hover-cards.js`, "utf8");

  assert.match(tabs, /tabIndex=selected\?0:-1/);
  assert.match(tabs, /aria-labelledby/);
  assert.match(magnetic, /data-magnetic-zone/);
  assert.match(magnetic, /isReduced/);
  assert.match(sticky, /contains\(document\.activeElement\)/);
  assert.match(compare, /visible focus ring/i);
  assert.match(marquee, /brand-marquee__group/);
  assert.match(marquee, /aria-pressed/);
  assert.match(gallery, /isReduced/);
  assert.match(color, /aria-pressed/);
  assert.doesNotMatch(cards, /hover-showcase__card" tabindex="0"/);
});

test("advanced CSS includes seamless marquee groups and visible compare focus", () => {
  const css = readFileSync(`${root}/css/advanced.css`, "utf8");
  assert.match(css, /brand-marquee__group/);
  assert.match(css, /compare:focus-within/);
  assert.match(css, /hover-showcase__card:focus-within/);
});
