import { useMemo, useState } from "react";
import { getAudienceProfile } from "../lib/personalization";
import { collectSafeSignals, localDecision, requestAiDecision } from "../lib/hybridPersonalization";

export const AUDIENCE_STORAGE_KEY = "mc-portfolio-adaptive-audience";
export const EXPLORE_SESSION_KEY = "mc-portfolio-adaptive-explore-general";
const DEFAULT_API_BASE = import.meta.env.VITE_PORTFOLIO_API_BASE || "";

const safeGet = (storage, key) => {
  try { return storage?.getItem?.(key) || ""; } catch { return ""; }
};
const safeSet = (storage, key, value) => {
  try { storage?.setItem?.(key, value); } catch {}
};
const safeRemove = (storage, key) => {
  try { storage?.removeItem?.(key); } catch {}
};

function initialState(win = globalThis.window) {
  if (!win) return { audienceKey: "general", source: "welcome", stage: "welcome", decision: null };
  const saved = safeGet(win.localStorage, AUDIENCE_STORAGE_KEY);
  if (saved) {
    const profile = getAudienceProfile(saved);
    if (profile.key !== "general" || saved === "general") {
      return { audienceKey: profile.key, source: "selected", stage: "portfolio", decision: null };
    }
  }
  if (safeGet(win.sessionStorage, EXPLORE_SESSION_KEY) === "1") {
    return { audienceKey: "general", source: "explore", stage: "portfolio", decision: null };
  }
  return { audienceKey: "general", source: "welcome", stage: "welcome", decision: null };
}

export default function usePersonalization({
  apiBase = DEFAULT_API_BASE,
  fetchImpl = globalThis.fetch,
  timeoutMs = 2000,
  win = globalThis.window,
  doc = globalThis.document,
} = {}) {
  const initial = useMemo(() => initialState(win), [win]);
  const [audienceKey, setAudienceKey] = useState(initial.audienceKey);
  const [source, setSource] = useState(initial.source);
  const [stage, setStage] = useState(initial.stage);
  const [decision, setDecision] = useState(initial.decision);

  const baseProfile = useMemo(() => getAudienceProfile(audienceKey), [audienceKey]);
  const profile = useMemo(() => {
    if (!decision || decision.confidence < 0.55) return baseProfile;
    const selected = getAudienceProfile(decision.intent);
    return { ...selected, sectionOrder: [...decision.sectionOrder] };
  }, [baseProfile, decision]);

  const selectAudience = (key) => {
    const normalized = getAudienceProfile(key).key;
    setAudienceKey(normalized);
    setDecision(null);
    setSource("selected");
    setStage("portfolio");
    safeSet(win?.localStorage, AUDIENCE_STORAGE_KEY, normalized);
    safeRemove(win?.sessionStorage, EXPLORE_SESSION_KEY);
  };

  const exploreNormally = () => {
    setAudienceKey("general");
    setDecision(null);
    setSource("explore");
    setStage("portfolio");
    safeSet(win?.sessionStorage, EXPLORE_SESSION_KEY, "1");
  };

  const searchIntent = async (query) => {
    const text = String(query || "").trim();
    if (!text) return null;

    const fallback = localDecision({
      search: win?.location?.search || "",
      referrer: doc?.referrer || "",
      query: text,
    });

    setAudienceKey(fallback.intent);
    setDecision(fallback);
    setSource("search");
    setStage("personalizing");

    if (!apiBase || !fetchImpl) {
      setStage("portfolio");
      return fallback;
    }

    const signals = collectSafeSignals({ win, doc, query: text, viewedSections: [] });
    let timer;
    const timeout = new Promise((resolve) => {
      timer = setTimeout(() => resolve(null), timeoutMs);
    });

    let result = null;
    try {
      result = await Promise.race([
        requestAiDecision(apiBase, signals, fetchImpl),
        timeout,
      ]);
    } catch {
      result = null;
    } finally {
      clearTimeout(timer);
    }

    if (result && result.confidence >= 0.55) {
      setAudienceKey(result.intent);
      setDecision(result);
      setSource("ai");
    }

    setStage("portfolio");
    return result || fallback;
  };

  const resetAudience = () => {
    safeRemove(win?.localStorage, AUDIENCE_STORAGE_KEY);
    safeRemove(win?.sessionStorage, EXPLORE_SESSION_KEY);
    setAudienceKey("general");
    setDecision(null);
    setSource("welcome");
    setStage("welcome");
  };

  return { profile, source, stage, selectAudience, exploreNormally, searchIntent, resetAudience };
}
