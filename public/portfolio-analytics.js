(() => {
  "use strict";

  const CLIENT_EVENTS = new Set([
    "page_visit",
    "adaptive_open",
    "lens_selected",
    "change_lens",
    "resume_click",
    "linkedin_click",
    "github_click",
    "case_study_click",
    "portfolio_cta_click",
    "contact_start",
    "contact_reason",
  ]);

  const SESSION_KEY = "mc-portfolio-session-id";
  const FIRST_TOUCH_KEY = "mc-portfolio-analytics-first-touch";
  const SUMMARY_KEY = "mc-portfolio-analytics-summary";
  const AUDIENCE_KEY = "mc-portfolio-adaptive-audience";

  const script =
    document.currentScript ||
    document.getElementById("portfolio-analytics-client") ||
    document.querySelector('script[src="/portfolio-analytics.js"][data-api-base]');
  const apiBase = String(script?.dataset?.apiBase || "").replace(/\/$/, "");

  const safeGet = (storage, key) => {
    try {
      return storage?.getItem?.(key) || "";
    } catch {
      return "";
    }
  };

  const safeSet = (storage, key, value) => {
    try {
      storage?.setItem?.(key, value);
    } catch {}
  };

  const secureId = () => {
    try {
      if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
      if (globalThis.crypto?.getRandomValues) {
        const bytes = new Uint8Array(16);
        globalThis.crypto.getRandomValues(bytes);
        return `session-${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
      }
    } catch {}
    return `analytics-legacy-${Date.now()}-${Math.round(globalThis.performance?.now?.() || 0)}`;
  };

  const getSessionId = () => {
    const existing = safeGet(globalThis.sessionStorage, SESSION_KEY);
    if (existing) return existing.slice(0, 96);
    const created = secureId().slice(0, 96);
    safeSet(globalThis.sessionStorage, SESSION_KEY, created);
    return created;
  };

  const cleanPath = () => {
    const path = globalThis.location?.pathname || "/";
    return path.startsWith("/new/") || path === "/new" ? "/new/" : "/";
  };

  const referrerHostname = () => {
    try {
      return document.referrer ? new URL(document.referrer).hostname.toLowerCase().slice(0, 120) : "";
    } catch {
      return "";
    }
  };

  const campaignFromUrl = () => {
    try {
      const params = new URL(globalThis.location.href).searchParams;
      return {
        source: String(params.get("utm_source") || "").slice(0, 80),
        medium: String(params.get("utm_medium") || "").slice(0, 80),
        campaign: String(params.get("utm_campaign") || "").slice(0, 120),
      };
    } catch {
      return { source: "", medium: "", campaign: "" };
    }
  };

  const loadFirstTouch = () => {
    const existing = safeGet(globalThis.sessionStorage, FIRST_TOUCH_KEY);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        return {
          landingPath: parsed.landingPath === "/new/" ? "/new/" : "/",
          referrerHostname: String(parsed.referrerHostname || "").slice(0, 120),
          campaign: {
            source: String(parsed.campaign?.source || "").slice(0, 80),
            medium: String(parsed.campaign?.medium || "").slice(0, 80),
            campaign: String(parsed.campaign?.campaign || "").slice(0, 120),
          },
        };
      } catch {}
    }

    const first = {
      landingPath: cleanPath(),
      referrerHostname: referrerHostname(),
      campaign: campaignFromUrl(),
    };
    safeSet(globalThis.sessionStorage, FIRST_TOUCH_KEY, JSON.stringify(first));
    return first;
  };

  const loadSummary = () => {
    try {
      const parsed = JSON.parse(safeGet(globalThis.sessionStorage, SUMMARY_KEY) || "{}");
      return {
        resumeClicked: Boolean(parsed.resumeClicked),
        caseStudyClicks: Math.max(0, Math.min(20, Number(parsed.caseStudyClicks) || 0)),
        contactStarted: Boolean(parsed.contactStarted),
        lens: String(parsed.lens || "").slice(0, 32),
        journey: Array.isArray(parsed.journey)
          ? parsed.journey.map(String).filter((x) => CLIENT_EVENTS.has(x)).slice(-12)
          : [],
      };
    } catch {
      return { resumeClicked: false, caseStudyClicks: 0, contactStarted: false, lens: "", journey: [] };
    }
  };

  const saveSummary = (summary) => {
    safeSet(globalThis.sessionStorage, SUMMARY_KEY, JSON.stringify(summary));
  };

  const currentLens = (summary) => {
    const stored = safeGet(globalThis.localStorage, AUDIENCE_KEY);
    return String(summary.lens || stored || "general").slice(0, 32);
  };

  const deviceClass = () => {
    try {
      return globalThis.matchMedia?.("(max-width: 720px)")?.matches ? "compact" : "desktop";
    } catch {
      return "desktop";
    }
  };

  const getContext = () => {
    const first = loadFirstTouch();
    const summary = loadSummary();
    return {
      sessionId: getSessionId(),
      path: cleanPath(),
      landingPath: first.landingPath,
      referrerHostname: first.referrerHostname,
      campaign: first.campaign,
      device: deviceClass(),
      lens: currentLens(summary),
      resumeClicked: summary.resumeClicked,
      caseStudyClicks: summary.caseStudyClicks,
      journey: [...summary.journey],
    };
  };

  const updateSummary = (event, meta) => {
    const summary = loadSummary();
    if (event === "resume_click") summary.resumeClicked = true;
    if (event === "case_study_click") summary.caseStudyClicks = Math.min(20, summary.caseStudyClicks + 1);
    if (event === "contact_start") summary.contactStarted = true;
    if (event === "lens_selected" && meta?.value) summary.lens = String(meta.value).slice(0, 32);
    if (event === "change_lens") summary.lens = "";
    summary.journey = [...summary.journey, event].slice(-12);
    saveSummary(summary);
    return summary;
  };

  const payloadFor = (event, meta = {}) => {
    const first = loadFirstTouch();
    const summary = updateSummary(event, meta);
    return {
      sessionId: getSessionId(),
      event,
      path: cleanPath(),
      section: String(meta.section || "").slice(0, 40),
      lens: currentLens(summary),
      referrerHostname: first.referrerHostname,
      campaign: first.campaign,
      device: deviceClass(),
      value: String(meta.value || "").slice(0, 80),
    };
  };

  const send = (payload) => {
    if (!apiBase) return;
    const endpoint = `${apiBase}/api/analytics`;
    const body = JSON.stringify(payload);

    try {
      if (typeof navigator.sendBeacon === "function") {
        const accepted = navigator.sendBeacon(
          endpoint,
          new Blob([body], { type: "application/json" })
        );
        if (accepted) return;
      }
    } catch {}

    try {
      globalThis.fetch?.(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };

  const track = (event, meta = {}) => {
    if (!CLIENT_EVENTS.has(event)) return;

    if (event === "contact_reason") {
      const summary = loadSummary();
      if (!summary.contactStarted) {
        const startPayload = payloadFor("contact_start", { section: "contact" });
        send(startPayload);
      }
    }

    send(payloadFor(event, meta));
  };

  const inferLinkEvent = (node) => {
    if (!(node instanceof Element)) return null;
    const anchor = node.closest("a[href]");
    if (!anchor) return null;

    const href = String(anchor.getAttribute("href") || "");
    if (href === "/resume.pdf" || /resume\.pdf(?:$|[?#])/i.test(href)) return "resume_click";

    try {
      const url = new URL(anchor.href, globalThis.location.href);
      if (url.hostname === "www.linkedin.com" || url.hostname === "linkedin.com") return "linkedin_click";
      if (url.hostname === "github.com" || url.hostname.endsWith(".github.com")) return "github_click";
    } catch {}

    return null;
  };

  const installContactFetchBridge = () => {
    const nativeFetch = globalThis.fetch?.bind(globalThis);
    if (!nativeFetch || globalThis.__mcPortfolioAnalyticsFetchBridge) return;
    globalThis.__mcPortfolioAnalyticsFetchBridge = true;

    globalThis.fetch = async (input, init = {}) => {
      try {
        const target = typeof input === "string" ? input : input?.url || "";
        const method = String(init?.method || "GET").toUpperCase();
        const contentType = new Headers(init?.headers || {}).get("content-type") || "";
        if (
          method === "POST" &&
          /\/api\/contact(?:$|[?#])/.test(String(target)) &&
          contentType.toLowerCase().startsWith("application/json") &&
          typeof init?.body === "string"
        ) {
          const body = JSON.parse(init.body);
          if (body && typeof body === "object" && !Array.isArray(body)) {
            if (!body.analytics) body.analytics = getContext();
            if (!body.submissionId) {
              const session = getSessionId().replace(/[^A-Za-z0-9._:-]/g, "").slice(0, 64);
              const startedAt = String(Number(body.startedAt || 0)).replace(/\D/g, "").slice(0, 20);
              body.submissionId = `legacy-${session}-${startedAt || Date.now()}`.slice(0, 100);
            }
            return nativeFetch(input, { ...init, body: JSON.stringify(body) });
          }
        }
      } catch {}
      return nativeFetch(input, init);
    };
  };

  const clickHandler = (event) => {
    const node = event.target instanceof Element
      ? event.target.closest("[data-analytics-event],a[href],button")
      : null;
    if (!node) return;

    const explicit = String(node.dataset?.analyticsEvent || "");
    if (explicit) {
      track(explicit, {
        section: String(node.dataset?.analyticsSection || ""),
        value: String(node.dataset?.analyticsValue || ""),
      });
      return;
    }

    const inferred = inferLinkEvent(node);
    if (inferred) {
      track(inferred, {
        section: String(node.closest("[data-analytics-section]")?.dataset?.analyticsSection || ""),
      });
    }
  };

  let booted = false;
  const boot = () => {
    if (booted) return;
    booted = true;
    document.addEventListener("click", clickHandler, { passive: true });
    track("page_visit");

    try {
      const url = new URL(globalThis.location.href);
      if (cleanPath() === "/new/" && url.searchParams.get("from") === "classic") {
        track("adaptive_open");
      }
    } catch {}
  };

  installContactFetchBridge();
  globalThis.mcPortfolioAnalytics = Object.freeze({ track, getContext });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
