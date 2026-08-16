import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { JSDOM } from "jsdom";

const clientPath = new URL("../public/portfolio-analytics.js", import.meta.url);

function loadClient({
  url = "https://manishchawla.com/new/",
  html = '<!doctype html><html><head><script id="portfolio-analytics-client" data-api-base="https://api.example"></script></head><body></body></html>',
  fetchImpl,
} = {}) {
  assert.equal(fs.existsSync(clientPath), true, "analytics client should exist");
  const source = fs.readFileSync(clientPath, "utf8");
  const dom = new JSDOM(html, { url, runScripts: "outside-only" });
  const calls = [];
  dom.window.fetch = fetchImpl || (async (endpoint, options = {}) => {
    calls.push({ endpoint: String(endpoint), options });
    return { ok: true };
  });
  dom.window.navigator.sendBeacon = undefined;
  dom.window.matchMedia = () => ({ matches: false });
  dom.window.document.addEventListener("click", (event) => event.preventDefault(), true);
  dom.window.eval(source);
  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  return { dom, calls };
}

const payloads = (calls) =>
  calls.map((call) => JSON.parse(call.options.body)).filter(Boolean);

test("creates one session-scoped anonymous id", async () => {
  const { dom } = loadClient();
  const first = dom.window.mcPortfolioAnalytics.getContext().sessionId;
  const second = dom.window.mcPortfolioAnalytics.getContext().sessionId;
  assert.equal(first, second);
  assert.match(first, /^[A-Za-z0-9._:-]{8,96}$/);
});

test("page_visit payload contains no PII keys", async () => {
  const { calls } = loadClient();
  await new Promise((resolve) => setTimeout(resolve, 0));
  const [payload] = payloads(calls);
  assert.equal(payload.event, "page_visit");
  assert.deepEqual(
    Object.keys(payload).sort(),
    ["campaign","device","event","lens","path","referrerHostname","section","sessionId","value"].sort()
  );
  for (const forbidden of ["name","email","company","message","jobUrl","turnstileToken","ip","rawIp"]) {
    assert.equal(forbidden in payload, false);
  }
});

test("unknown data analytics events are ignored", async () => {
  const { dom, calls } = loadClient({
    html: '<!doctype html><html><head><script id="portfolio-analytics-client" data-api-base="https://api.example"></script></head><body><button id="x" data-analytics-event="steal_email">X</button></body></html>',
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  const before = calls.length;
  dom.window.document.getElementById("x").click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(calls.length, before);
});

test("linkedin and resume clicks map to allowlisted events", async () => {
  const { dom, calls } = loadClient({
    html: '<!doctype html><html><head><script id="portfolio-analytics-client" data-api-base="https://api.example"></script></head><body><a id="linkedin" href="https://www.linkedin.com/in/test/">LinkedIn</a><a id="resume" href="/resume.pdf">Resume</a></body></html>',
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  dom.window.document.getElementById("linkedin").click();
  dom.window.document.getElementById("resume").click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  const events = payloads(calls).map((x) => x.event);
  assert.ok(events.includes("linkedin_click"));
  assert.ok(events.includes("resume_click"));
});

test("adaptive arrival from classic records adaptive_open once", async () => {
  const { calls } = loadClient({ url: "https://manishchawla.com/new/?from=classic" });
  await new Promise((resolve) => setTimeout(resolve, 0));
  const events = payloads(calls).map((x) => x.event);
  assert.equal(events.filter((x) => x === "adaptive_open").length, 1);
});

test("contact_reason automatically records contact_start before the reason", async () => {
  const { dom, calls } = loadClient();
  await new Promise((resolve) => setTimeout(resolve, 0));
  dom.window.mcPortfolioAnalytics.track("contact_reason", { section: "contact", value: "job" });
  await new Promise((resolve) => setTimeout(resolve, 0));
  const events = payloads(calls).map((x) => x.event);
  const startIndex = events.lastIndexOf("contact_start");
  const reasonIndex = events.lastIndexOf("contact_reason");
  assert.ok(startIndex >= 0);
  assert.ok(reasonIndex > startIndex);
});

test("getContext records only bounded anonymous journey summary", async () => {
  const { dom } = loadClient();
  dom.window.mcPortfolioAnalytics.track("resume_click", { section: "hero" });
  dom.window.mcPortfolioAnalytics.track("lens_selected", { value: "recruiter" });
  const context = dom.window.mcPortfolioAnalytics.getContext();
  assert.equal(context.resumeClicked, true);
  assert.equal(context.lens, "recruiter");
  assert.ok(Array.isArray(context.journey));
  assert.ok(context.journey.includes("resume_click"));
  assert.equal("email" in context, false);
  assert.equal("message" in context, false);
});

test("network failure is swallowed and does not alter the page", async () => {
  const { dom } = loadClient({
    html: '<!doctype html><html><head><script id="portfolio-analytics-client" data-api-base="https://api.example"></script></head><body><p id="stable">Stable</p></body></html>',
    fetchImpl: async () => { throw new Error("offline"); },
  });
  dom.window.mcPortfolioAnalytics.track("resume_click");
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(dom.window.document.getElementById("stable").textContent, "Stable");
});


test("contact fetch bridge adds anonymous context to legacy classic submissions", async () => {
  const { dom, calls } = loadClient();
  await new Promise((resolve) => setTimeout(resolve, 0));

  await dom.window.fetch("https://api.example/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Recruiter",
      email: "r@example.com",
      message: "A legitimate contact message.",
      startedAt: 1234567890,
    }),
  });

  const contactCall = calls.find((call) => String(call.endpoint).includes("/api/contact"));
  assert.ok(contactCall);
  const body = JSON.parse(contactCall.options.body);
  assert.match(body.submissionId, /^[A-Za-z0-9._:-]{8,100}$/);
  assert.ok(body.analytics.sessionId);
  assert.equal(body.analytics.email, undefined);
  assert.equal(body.analytics.message, undefined);
});
