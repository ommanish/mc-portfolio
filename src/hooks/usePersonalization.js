import { useMemo, useState } from "react";
import { getAudienceProfile, inferAudience } from "../lib/personalization";

const STORAGE_KEY = "mc-portfolio-audience";

function readInitialAudience() {
  if (typeof window === "undefined") return "general";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return getAudienceProfile(stored).key;
  } catch {
    // Storage can be disabled; personalization still works for the session.
  }

  return inferAudience({
    search: window.location.search,
    referrer: document.referrer,
  });
}

export default function usePersonalization() {
  const [audienceKey, setAudienceKey] = useState(readInitialAudience);
  const [source, setSource] = useState("inferred");

  const profile = useMemo(() => getAudienceProfile(audienceKey), [audienceKey]);

  const selectAudience = (nextKey) => {
    const normalized = getAudienceProfile(nextKey).key;
    setAudienceKey(normalized);
    setSource("selected");

    try {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // Preference persistence is optional.
    }
  };

  const searchIntent = (query) => {
    const inferred = inferAudience({ query });
    setAudienceKey(inferred);
    setSource("search");
  };

  const resetAudience = () => {
    setAudienceKey("general");
    setSource("reset");

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Preference persistence is optional.
    }
  };

  return { profile, source, selectAudience, searchIntent, resetAudience };
}
