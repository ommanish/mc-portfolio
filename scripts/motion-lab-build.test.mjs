import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

const lab = resolve("labs/interactive-component-lab");
const htmlPath = join(lab, "index.html");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

test("standalone Interactive Component Lab shell and references are isolated", () => {
  assert.equal(existsSync(htmlPath), true, "Lab index.html must exist");
  const html = readFileSync(htmlPath, "utf8");
  assert.match(html, /Interactive Component Lab/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /cdn\.jsdelivr\.net\/npm\/gsap@3\.12\.5\/dist\/gsap\.min\.js/);
  assert.match(html, /cdn\.jsdelivr\.net\/npm\/gsap@3\.12\.5\/dist\/ScrollTrigger\.min\.js/);

  const localRefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("/"));
  for (const ref of localRefs) {
    assert.ok(
      ref === "/" || ref.startsWith("/labs/interactive-component-lab/"),
      `Unexpected root-local Lab reference: ${ref}`,
    );
  }
});

test("Lab source never imports portfolio src", () => {
  for (const file of walk(lab)) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /(?:\/src\/|\.\.\/\.\.\/src)/, `${file} references portfolio src`);
  }
});

test("build script produces renamed route and legacy redirect", () => {
  const result = spawnSync(process.execPath, ["scripts/build-interactive-component-lab.mjs"], {
    cwd: resolve("."),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(existsSync(resolve("dist/labs/interactive-component-lab/index.html")), true);
  const legacy = readFileSync(resolve("dist/labs/ai-command-center/index.html"), "utf8");
  assert.match(legacy, /\/labs\/interactive-component-lab\//);
});
