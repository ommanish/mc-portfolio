import { AUDIENCE_PROFILES } from "../content/audienceProfiles.js";

const QUERY_RULES = [
  ["ai", ["ai", "artificial intelligence", "automation", "agent", "llm", "prompt"]],
  ["engineering", ["react", "frontend", "engineer", "architecture", "javascript", "typescript", "accessibility", "performance"]],
  ["marketing", ["marketing", "web experience", "webops", "cms", "campaign", "content", "page builder", "launch"]],
  ["recruiter", ["recruiter", "hiring", "resume", "résumé", "candidate", "experience", "skills", "role"]],
  ["client", ["consulting", "consultant", "freelance", "client", "project", "services", "help"]],
];

const SAFE_REFERRER_RULES = [
  ["engineering", ["github.com"]],
  ["recruiter", ["linkedin.com", "indeed.com", "glassdoor.com"]],
];

export function normalizeAudience(value) {
  const key = String(value || "").trim().toLowerCase();
  return AUDIENCE_PROFILES[key] ? key : "general";
}

export function inferAudience({ search = "", referrer = "", query = "" } = {}) {
  const params = new URLSearchParams(search);
  const explicit = normalizeAudience(params.get("audience"));
  if (explicit !== "general") return explicit;

  const normalizedQuery = String(query).toLowerCase().slice(0, 240);
  for (const [profile, keywords] of QUERY_RULES) {
    if (keywords.some((keyword) => normalizedQuery.includes(keyword))) return profile;
  }

  let hostname = "";
  try {
    hostname = referrer ? new URL(referrer).hostname.toLowerCase() : "";
  } catch {
    hostname = "";
  }

  for (const [profile, domains] of SAFE_REFERRER_RULES) {
    if (domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
      return profile;
    }
  }

  return "general";
}

export function getAudienceProfile(key) {
  return AUDIENCE_PROFILES[normalizeAudience(key)];
}

export function getDevicePreferences(win = globalThis.window) {
  if (!win) return { reducedMotion: false, saveData: false, compact: false };

  const reducedMotion = Boolean(win.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  const saveData = Boolean(win.navigator?.connection?.saveData);
  const compact = Boolean(win.matchMedia?.("(max-width: 720px)")?.matches);

  return { reducedMotion, saveData, compact };
}
