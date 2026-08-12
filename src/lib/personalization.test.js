import test from "node:test";
import assert from "node:assert/strict";
import { getAudienceProfile, inferAudience, normalizeAudience } from "./personalization.js";

test("explicit audience parameter wins", () => {
  assert.equal(inferAudience({ search: "?audience=marketing", referrer: "https://github.com" }), "marketing");
});

test("unknown audience falls back safely", () => {
  assert.equal(normalizeAudience("admin"), "general");
});

test("query intent maps to engineering", () => {
  assert.equal(inferAudience({ query: "React accessibility architecture" }), "engineering");
});

test("query intent maps to AI", () => {
  assert.equal(inferAudience({ query: "AI automation and LLM workflows" }), "ai");
});

test("referrer uses hostname only", () => {
  assert.equal(inferAudience({ referrer: "https://github.com/search?q=private-query" }), "engineering");
});

test("malformed referrer is ignored", () => {
  assert.equal(inferAudience({ referrer: "not-a-url" }), "general");
});

test("profile always resolves to known content", () => {
  assert.equal(getAudienceProfile("not-real").key, "general");
});
