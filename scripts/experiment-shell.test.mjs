import test from "node:test";
import assert from "node:assert/strict";
import {injectAdaptiveCanonical,injectClassicFallback} from "./experiment-shell.mjs";
const html='<!doctype html><html><head><title>Portfolio</title></head><body><div id="root"></div></body></html>';
test("adaptive root is canonical and indexable",()=>{const r=injectAdaptiveCanonical(html);assert.match(r,/rel="canonical" href="https:\/\/manishchawla\.com\/"/);assert.doesNotMatch(r,/noindex/);});
test("classic fallback points to adaptive root and is noindex",()=>{const r=injectClassicFallback(html);assert.match(r,/id="current-portfolio-return"/);assert.match(r,/href="\/\?from=classic"/);assert.match(r,/View the current portfolio/);assert.match(r,/noindex,follow/);});
test("shell injection is idempotent",()=>{const a=injectAdaptiveCanonical(html);assert.equal(injectAdaptiveCanonical(a),a);const c=injectClassicFallback(html);assert.equal(injectClassicFallback(c),c);});
