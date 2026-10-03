import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const motion = readFileSync("labs/ai-command-center/js/motion.js", "utf8");
const css = readFileSync("labs/ai-command-center/css/motion.css", "utf8");

test("motion initialization safely exits without GSAP or ScrollTrigger", () => {
  assert.match(motion, /Boolean\(window\.gsap && window\.ScrollTrigger\)/);
  assert.match(motion, /if \(!hasMotionRuntime\(\) \|\| shouldReduce\(\)/);
  assert.match(css, /\.lab-shell:not\(\.motion-ready\)[\s\S]*opacity:\s*1/);
});

test("reduced motion cannot initialize cinematic timelines", () => {
  assert.match(motion, /function shouldReduce/);
  assert.match(motion, /if \(!hasMotionRuntime\(\) \|\| shouldReduce\(\)/);
  assert.match(motion, /if \(state\.motion === "reduced"\)/);
  assert.match(motion, /clearAll\(\)/);
});

test("reduced initial mode stays subscribed so full motion can be enabled later", () => {
  assert.match(motion, /function ensurePreferenceSubscription/);
  assert.match(motion, /ensurePreferenceSubscription\(\);[\s\S]*if \(!hasMotionRuntime\(\) \|\| shouldReduce\(\) \|\| prefs\?\.get\(\)\.paused\)/);
  assert.match(motion, /initialized = false;[\s\S]*return;/);
  assert.match(motion, /else if \(!initialized && !state\.paused\) init\(\)/);
});

test("pause and resume control non-essential timelines", () => {
  assert.match(motion, /function pause\(\)[\s\S]*timeline\.pause/);
  assert.match(motion, /function resume\(\)[\s\S]*timeline\.resume/);
  assert.match(motion, /prefs\?\.get\(\)\.paused/);
});

test("animations are scoped by chapter and can be cleaned independently", () => {
  assert.match(motion, /const contexts = new Map\(\)/);
  assert.match(motion, /window\.gsap\.context/);
  assert.match(motion, /function clearChapter\(id\)/);
  assert.match(motion, /context\.revert\(\)/);
});

test("story-driven themes only apply while theme preference is auto", () => {
  assert.match(motion, /if \(current\.theme === "auto"\) prefs\.setStoryTheme/);
});

test("approved cinematic moments use native-scroll ScrollTrigger contracts", () => {
  assert.match(motion, /cinematicProcessing/);
  assert.match(motion, /cinematicWorkspace/);
  assert.match(motion, /cinematicFinal/);
  assert.match(motion, /scrub:/);
  assert.doesNotMatch(motion, /scrollTo\(/);
});
