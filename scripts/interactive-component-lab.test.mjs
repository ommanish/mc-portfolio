import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = "labs/interactive-component-lab";
const examples = [
  ["stacked-cards.js", "stacked-card-scroll"],
  ["text-reveal.js", "text-reveal"],
  ["word-reveal.js", "word-reveal"],
  ["horizontal-carousel.js", "horizontal-carousel"],
  ["marquee.js", "infinite-marquee"],
  ["scroll-progress.js", "scroll-progress-story"],
  ["sticky-content-swap.js", "sticky-content-swap"],
  ["image-mask-reveal.js", "image-mask-reveal"],
  ["hover-cards.js", "interactive-hover-cards"],
  ["metric-counter.js", "metric-counter"],
  ["accordion.js", "accessible-accordion"],
  ["parallax-hero.js", "parallax-motion-hero"],
];

test("page is framed as Interactive Component Lab", () => {
  const html = readFileSync(`${root}/index.html`, "utf8");
  assert.match(html, /Interactive Component Lab/);
  assert.match(html, /live components/i);
  assert.match(html, /real code/i);
  assert.match(html, /reusable prompts/i);
  assert.match(html, /data-component-examples-root/);
  assert.doesNotMatch(html, /Pulseframe/);
});

test("shared registry renders prompt, demo, real code tabs, copy actions and accessibility", () => {
  assert.ok(existsSync(`${root}/js/examples/registry.js`));
  const source = readFileSync(`${root}/js/examples/registry.js`, "utf8");
  for (const token of ["InteractiveComponentLab", "register", "mountAll", "data-example-demo", "data-copy-prompt", "data-copy-code", "data-code-tab", "textContent", "Accessibility"]) assert.match(source, new RegExp(token));
});

test("all twelve approved examples exist and register unique ids", () => {
  const ids = new Set();
  for (const [file, id] of examples) {
    const path = `${root}/js/examples/${file}`;
    assert.ok(existsSync(path), `missing ${file}`);
    const source = readFileSync(path, "utf8");
    assert.match(source, new RegExp(`id:\\s*[\"'\\\`]${id}[\"'\\\`]`));
    assert.match(source, /\bprompt\b/);
    assert.match(source, /source:/);
    assert.match(source, /\bhtml\b/);
    assert.match(source, /\bcss\b/);
    assert.match(source, /\bjs\b/);
    assert.match(source, /accessibility:/);
    ids.add(id);
  }
  assert.equal(ids.size, 12);
});

test("advanced motion examples include GSAP fallback and reduced motion CSS exists", () => {
  for (const file of ["image-mask-reveal.js", "parallax-hero.js"]) {
    const source = readFileSync(`${root}/js/examples/${file}`, "utf8");
    assert.match(source, /gsap/i);
    assert.match(source, /fallback|static/i);
  }
  const css = readFileSync(`${root}/css/examples.css`, "utf8");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("app loads registry and all twelve example modules", () => {
  const app = readFileSync(`${root}/js/app.js`, "utf8");
  assert.match(app, /["']registry\.js["']/);
  for (const [file] of examples) assert.match(app, new RegExp(file.replace(".", "\\.")));
});
