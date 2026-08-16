import assert from "node:assert/strict";
import test from "node:test";
import worker from "./index.js";

const ORIGIN = "https://manishchawla.com";

function analyticsRequest(body, headers = {}) {
  return new Request("https://api.example.com/api/analytics", {
    method: "POST",
    headers: {
      origin: ORIGIN,
      "content-type": "application/json",
      "CF-Connecting-IP": "203.0.113.10",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function validAnalytics(overrides = {}) {
  return {
    sessionId: "session-analytics-12345",
    event: "resume_click",
    path: "/new/",
    section: "hero",
    lens: "recruiter",
    referrerHostname: "linkedin.com",
    campaign: { source: "linkedin", medium: "social", campaign: "portfolio" },
    device: "desktop",
    value: "",
    ...overrides,
  };
}

function validContact(overrides = {}) {
  return {
    name: "Recruiter",
    email: "r@example.com",
    company: "Example Co",
    reason: "job",
    role: "Director",
    jobUrl: "https://example.com/job",
    message: "A legitimate message for Manish.",
    website: "",
    turnstileToken: "token",
    startedAt: Date.now() - 5_000,
    submissionId: "submission-analytics-12345",
    analytics: {
      sessionId: "session-analytics-12345",
      path: "/new/",
      landingPath: "/",
      referrerHostname: "linkedin.com",
      campaign: { source: "linkedin", medium: "social", campaign: "portfolio" },
      lens: "recruiter",
      resumeClicked: true,
      caseStudyClicks: 2,
      journey: ["page_visit", "lens_selected", "resume_click", "contact_reason"],
    },
    ...overrides,
  };
}

function baseEnv(overrides = {}) {
  return {
    ALLOWED_ORIGINS: ORIGIN,
    TURNSTILE_SECRET_KEY: "test-turnstile-secret",
    TURNSTILE_HOSTNAME: "manishchawla.com",
    RESEND_API_KEY: "test-resend-secret",
    CONTACT_FROM_EMAIL: "Portfolio <portfolio@example.com>",
    CONTACT_TO_EMAIL: "owner@example.com",
    CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
    ANALYTICS_RATE_LIMITER: { limit: async () => ({ success: true }) },
    ...overrides,
  };
}

async function withProviderFetch(turnstileSuccess, callback) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes("challenges.cloudflare.com/turnstile")) {
      return new Response(JSON.stringify({
        success: turnstileSuccess,
        action: "portfolio_contact",
        hostname: "manishchawla.com",
      }), { status: 200, headers: { "content-type": "application/json" } });
    }
    if (String(url).includes("api.resend.com/emails")) {
      return new Response(JSON.stringify({ id: "email-1" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    throw new Error(`Unexpected provider request: ${url}`);
  };
  try {
    return await callback(calls);
  } finally {
    globalThis.fetch = original;
  }
}

test("analytics endpoint rejects unknown event names", async () => {
  const response = await worker.fetch(
    analyticsRequest(validAnalytics({ event: "capture_email" })),
    baseEnv()
  );
  assert.equal(response.status, 400);
});

test("analytics endpoint rejects PII-shaped fields", async () => {
  for (const [key, value] of Object.entries({
    name: "Visitor",
    email: "visitor@example.com",
    company: "Example",
    message: "private",
    jobUrl: "https://example.com/private",
    turnstileToken: "secret",
    ip: "1.2.3.4",
    rawIp: "1.2.3.4",
  })) {
    const response = await worker.fetch(
      analyticsRequest({ ...validAnalytics(), [key]: value }),
      baseEnv()
    );
    assert.equal(response.status, 400, key);
  }
});

test("analytics endpoint rejects arbitrary metadata keys", async () => {
  const response = await worker.fetch(
    analyticsRequest({ ...validAnalytics(), arbitrary: "not allowed" }),
    baseEnv()
  );
  assert.equal(response.status, 400);
});

test("analytics endpoint writes one bounded Analytics Engine data point", async () => {
  const points = [];
  let rateKey = "";
  const env = baseEnv({
    ANALYTICS: { writeDataPoint: (point) => points.push(point) },
    ANALYTICS_RATE_LIMITER: {
      limit: async ({ key }) => {
        rateKey = key;
        return { success: true };
      },
    },
  });

  const response = await worker.fetch(analyticsRequest(validAnalytics()), env);
  assert.equal(response.status, 202);
  assert.equal(points.length, 1);
  assert.equal(points[0].blobs[0], "resume_click");
  assert.equal(points[0].blobs[1], "/new/");
  assert.deepEqual(points[0].indexes, ["session-analytics-12345"]);
  assert.equal(rateKey, "203.0.113.10");
  assert.equal(JSON.stringify(points[0]).includes("r@example.com"), false);
});

test("analytics endpoint returns 429 when the IP limiter rejects the request", async () => {
  const response = await worker.fetch(
    analyticsRequest(validAnalytics()),
    baseEnv({ ANALYTICS_RATE_LIMITER: { limit: async () => ({ success: false }) } })
  );
  assert.equal(response.status, 429);
});

test("analytics endpoint never calls OpenAI, Turnstile, or Resend", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("provider fetch should not be called");
  };
  try {
    const response = await worker.fetch(
      analyticsRequest(validAnalytics()),
      baseEnv({ ANALYTICS: { writeDataPoint() {} } })
    );
    assert.equal(response.status, 202);
  } finally {
    globalThis.fetch = original;
  }
});

test("contact does not persist a lead when Turnstile fails", async () => {
  let prepareCalls = 0;
  const env = baseEnv({
    LEADS_DB: {
      prepare() {
        prepareCalls += 1;
        throw new Error("must not persist");
      },
    },
  });

  await withProviderFetch(false, async () => {
    const response = await worker.fetch(
      new Request("https://api.example.com/api/contact", {
        method: "POST",
        headers: { origin: ORIGIN, "content-type": "application/json" },
        body: JSON.stringify(validContact()),
      }),
      env
    );
    assert.equal(response.status, 400);
    assert.equal(prepareCalls, 0);
  });
});

test("valid contact persists a bounded lead and writes server conversion analytics", async () => {
  let sql = "";
  let bound = [];
  const points = [];
  const env = baseEnv({
    LEADS_DB: {
      prepare(statement) {
        sql = statement;
        return {
          bind(...values) {
            bound = values;
            return { run: async () => ({ meta: { changes: 1 } }) };
          },
        };
      },
    },
    ANALYTICS: { writeDataPoint: (point) => points.push(point) },
  });

  await withProviderFetch(true, async (calls) => {
    const response = await worker.fetch(
      new Request("https://api.example.com/api/contact", {
        method: "POST",
        headers: { origin: ORIGIN, "content-type": "application/json" },
        body: JSON.stringify(validContact()),
      }),
      env
    );
    assert.equal(response.status, 200);
    assert.match(sql, /INSERT OR IGNORE INTO leads/);
    assert.ok(bound.includes("submission-analytics-12345"));
    assert.ok(bound.includes("session-analytics-12345"));
    assert.equal(bound.includes("token"), false);
    assert.equal(bound.includes("203.0.113.10"), false);
    assert.ok(calls.some((call) => call.url.includes("api.resend.com/emails")));
    assert.ok(points.some((point) => point.blobs[0] === "contact_submit_success"));
  });
});

test("D1 failure does not prevent the existing Resend notification", async () => {
  const env = baseEnv({
    LEADS_DB: {
      prepare() {
        throw new Error("database unavailable");
      },
    },
  });

  const originalError = console.error;
  console.error = () => {};
  try {
    await withProviderFetch(true, async (calls) => {
      const response = await worker.fetch(
        new Request("https://api.example.com/api/contact", {
          method: "POST",
          headers: { origin: ORIGIN, "content-type": "application/json" },
          body: JSON.stringify(validContact()),
        }),
        env
      );
      assert.equal(response.status, 200);
      assert.ok(calls.some((call) => call.url.includes("api.resend.com/emails")));
    });
  } finally {
    console.error = originalError;
  }
});

test("duplicate submission IDs are handled with INSERT OR IGNORE", async () => {
  const statements = [];
  const env = baseEnv({
    LEADS_DB: {
      prepare(statement) {
        statements.push(statement);
        return {
          bind() {
            return { run: async () => ({ meta: { changes: statements.length === 1 ? 1 : 0 } }) };
          },
        };
      },
    },
  });

  await withProviderFetch(true, async () => {
    for (let i = 0; i < 2; i += 1) {
      const response = await worker.fetch(
        new Request("https://api.example.com/api/contact", {
          method: "POST",
          headers: { origin: ORIGIN, "content-type": "application/json" },
          body: JSON.stringify(validContact()),
        }),
        env
      );
      assert.equal(response.status, 200);
    }
  });

  assert.equal(statements.length, 2);
  assert.ok(statements.every((statement) => /INSERT OR IGNORE/.test(statement)));
});
