import test from "node:test";
import assert from "node:assert/strict";
import { injectAdaptiveReturn, injectClassicInvite } from "./experiment-shell.mjs";

const html = '<!doctype html><html><head><title>Portfolio</title></head><body><div id="root"></div></body></html>';

test("classic invites visitors to try the adaptive experience", () => {
  const result = injectClassicInvite(html);
  assert.match(result, /id="adaptive-experiment-invite"/);
  assert.match(result, /href="\/new\/\?from=classic"/);
  assert.match(result, /Try the new adaptive experience/);
  assert.match(result, /See the portfolio through a Lens/);
  assert.match(result, /data-experiment="classic-to-adaptive-v1"/);
});

test("adaptive offers a classic return and stays noindex during the experiment", () => {
  const result = injectAdaptiveReturn(html);
  assert.match(result, /id="classic-experiment-return"/);
  assert.match(result, /href="\/"/);
  assert.match(result, /Classic portfolio/);
  assert.match(result, /name="robots" content="noindex,follow"/);
  assert.match(result, /rel="canonical" href="https:\/\/manishchawla\.com\/"/);
});

test("shell injection is idempotent", () => {
  const classicOnce = injectClassicInvite(html);
  assert.equal(injectClassicInvite(classicOnce), classicOnce);
  const adaptiveOnce = injectAdaptiveReturn(html);
  assert.equal(injectAdaptiveReturn(adaptiveOnce), adaptiveOnce);
});
