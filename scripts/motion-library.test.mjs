import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = "public/motion-library";
const components = [
  "kinetic-hero",
  "directional-cards",
  "layered-reveal",
  "morph-tabs",
  "magnetic-cta",
  "smart-header",
  "before-after",
  "sticky-process",
  "dual-marquee",
  "cursor-project-index",
  "chapter-progress",
  "theme-morph",
];

test("motion library exposes all twelve standalone components", () => {
  const shell = readFileSync(`${root}/index.html`, "utf8");
  const app = readFileSync(`${root}/library.js`, "utf8");
  assert.match(shell, /data-library-components/);
  for (const slug of components) {
    assert.match(app, new RegExp(`"slug"\\s*:\\s*"${slug}"`));
    assert.ok(existsSync(`${root}/components/${slug}/index.html`));
    assert.ok(existsSync(`${root}/components/${slug}/style.css`));
    assert.ok(existsSync(`${root}/components/${slug}/script.js`));
  }
});

test("every component HTML points to its own exact CSS and JS", () => {
  for (const slug of components) {
    const html = readFileSync(`${root}/components/${slug}/index.html`, "utf8");
    assert.match(html, /<link rel="stylesheet" href="\.\/style\.css">/);
    assert.match(html, /<script src="\.\/script\.js"><\/script>/);
    assert.doesNotMatch(html, /AdvancedComponentLab|InteractiveComponentLab|motion-library\/library/);
  }
});

test("every standalone component is scoped and contains no placeholder source", () => {
  for (const slug of components) {
    const html = readFileSync(`${root}/components/${slug}/index.html`, "utf8");
    const css = readFileSync(`${root}/components/${slug}/style.css`, "utf8");
    const js = readFileSync(`${root}/components/${slug}/script.js`, "utf8");
    assert.match(css, /\.mx-/);
    assert.doesNotMatch(html + css + js, /TODO|PLACEHOLDER/i);
    assert.doesNotMatch(js, /AdvancedComponentLab|InteractiveComponentLab|data-library-components/);
  }
});

test("motion-heavy components include reduced-motion behavior", () => {
  const required = [
    "kinetic-hero",
    "directional-cards",
    "layered-reveal",
    "morph-tabs",
    "magnetic-cta",
    "smart-header",
    "sticky-process",
    "dual-marquee",
    "cursor-project-index",
    "chapter-progress",
    "theme-morph",
  ];
  for (const slug of required) {
    const css = readFileSync(`${root}/components/${slug}/style.css`, "utf8");
    assert.match(css, /prefers-reduced-motion:\s*reduce/);
  }
});

test("copy UI reads exact component files and builds a self-contained Copy All document", () => {
  const app = readFileSync(`${root}/library.js`, "utf8");
  assert.match(app, /fetch\(url\)/);
  assert.match(app, /source\[active\]/);
  assert.match(app, /data-copy-current/);
  assert.match(app, /data-copy-all/);
  assert.match(app, /replace\('<link rel="stylesheet" href="\.\/style\.css">/);
  assert.match(app, /<style>\\n/);
  assert.match(app, /<script>\\n/);
  assert.doesNotMatch(app, /AdvancedComponentLab|InteractiveComponentLab/);
});

test("Vite dev and preview explicitly route /motion-library/ to the standalone library", () => {
  const vite = readFileSync("vite.config.js", "utf8");
  assert.match(vite, /\/motion-library\/index\.html/);
  assert.match(vite, /configureServer/);
  assert.match(vite, /configurePreviewServer/);
});


test("every library component includes a reusable build prompt and copy control", () => {
  const app = readFileSync(`${root}/library.js`, "utf8");
  for (const slug of components) {
    const start = app.indexOf(`"slug": "${slug}"`);
    assert.notEqual(start, -1);
    const end = app.indexOf("\n  }", start);
    const block = app.slice(start, end + 4);
    assert.match(block, /"prompt":/);
  }
  assert.match(app, /data-component-prompt/);
  assert.match(app, /data-copy-prompt/);
  assert.match(app, /copyText\(component\?\.prompt/);
});
