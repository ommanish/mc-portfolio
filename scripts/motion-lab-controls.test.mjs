import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("labs/ai-command-center/index.html", "utf8");
const theme = readFileSync("labs/ai-command-center/js/theme.js", "utf8");
const accessibility = readFileSync("labs/ai-command-center/js/accessibility.js", "utf8");
const base = readFileSync("labs/ai-command-center/css/base.css", "utf8");
const motion = readFileSync("labs/ai-command-center/css/motion.css", "utf8");

test("settings expose visible keyboard-focusable theme, motion, contrast, and pause controls", () => {
  for (const value of ["auto", "light", "dark"]) assert.match(html, new RegExp(`data-theme-value="${value}"`));
  for (const value of ["full", "reduced"]) assert.match(html, new RegExp(`data-motion-value="${value}"`));
  for (const value of ["standard", "high"]) assert.match(html, new RegExp(`data-contrast-value="${value}"`));
  assert.match(html, /<button[^>]+data-pause-toggle[^>]+aria-pressed="false"/);
  assert.match(html, />\s*Pause animation\s*</);
  assert.match(base, /:focus-visible/);
});

test("preferences expose the approved API and session persistence", () => {
  for (const name of ["setTheme", "setMotion", "setContrast", "setPaused", "subscribe"]) {
    assert.match(theme, new RegExp(`\\b${name}\\b`));
  }
  assert.match(theme, /sessionStorage/);
  assert.match(theme, /prefers-reduced-motion: reduce/);
  assert.match(theme, /state\.theme === "auto" \? state\.storyTheme : state\.theme/);
  assert.match(theme, /function setStoryTheme/);
});

test("manual theme remains authoritative over story theme changes", () => {
  assert.match(theme, /if \(state\.theme === "auto"\) apply\(\)/);
  assert.match(accessibility, /prefs\.setTheme\(button\.dataset\.themeValue\)/);
});

test("reduced motion and pause have explicit CSS behavior", () => {
  assert.match(motion, /\[data-motion="reduced"\]/);
  assert.match(motion, /\[data-paused="true"\]/);
  assert.match(base, /@media \(prefers-reduced-motion: reduce\)/);
});
