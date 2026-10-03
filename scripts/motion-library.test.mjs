import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = "public/motion-library";
const component = `${root}/components/kinetic-hero`;

test("motion library uses real standalone component files", () => {
  const shell = readFileSync(`${root}/index.html`, "utf8");
  const app = readFileSync(`${root}/library.js`, "utf8");
  assert.match(shell, /components\/kinetic-hero\/index\.html/);
  assert.match(app, /components\/kinetic-hero\/style\.css/);
  assert.match(app, /components\/kinetic-hero\/script\.js/);
  assert.doesNotMatch(app, /AdvancedComponentLab|InteractiveComponentLab/);
});

test("kinetic hero is standalone and reduced-motion aware", () => {
  const html = readFileSync(`${component}/index.html`, "utf8");
  const css = readFileSync(`${component}/style.css`, "utf8");
  const js = readFileSync(`${component}/script.js`, "utf8");
  assert.match(html, /\.\/style\.css/);
  assert.match(html, /\.\/script\.js/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(js, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(js, /data-mx-replay/);
  assert.doesNotMatch(js, /motion-library|library-shell|AdvancedComponentLab/);
});

test("library copy UI reads the same files that power the iframe demo", () => {
  const app = readFileSync(`${root}/library.js`, "utf8");
  assert.match(app, /fetch\(url\)/);
  assert.match(app, /source\[active\]/);
  assert.match(app, /data-copy-all/);
});
