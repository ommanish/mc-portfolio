import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("labs/ai-command-center/index.html", "utf8");
const css = [
  readFileSync("labs/ai-command-center/css/base.css", "utf8"),
  readFileSync("labs/ai-command-center/css/components.css", "utf8"),
].join("\n");

test("approved eight chapters exist in exact order", () => {
  const ids = [...html.matchAll(/data-chapter="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, [
    "welcome", "ask", "processing", "workspace",
    "collaboration", "intelligence", "command-center", "accessibility",
  ]);
});

test("story has one H1, chapter H2 hierarchy, and visible concept disclosure", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/<h2\b/g) || []).length >= 8, true);
  assert.match(html, /Concept project · Motion & accessibility lab/);
  assert.match(html, /Fictional concept/);
  assert.doesNotMatch(html, /client deployment|production client|deployed for/i);
});

test("interactive objects use semantic controls and decorative visuals are hidden", () => {
  assert.match(html, /<textarea[^>]+id="lab-prompt"/);
  assert.match(html, /<button[^>]+data-demo-send/);
  assert.match(html, /<a[^>]+href="#ask"/);
  assert.match(html, /aria-hidden="true"/);
  assert.doesNotMatch(html, /<div[^>]+onclick=/i);
});

test("responsive CSS does not impose a fixed page width or hover-only access", () => {
  assert.doesNotMatch(css, /body\s*\{[^}]*width:\s*\d{4,}px/s);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /min-width:\s*320px/);
});
