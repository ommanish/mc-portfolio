import { useEffect, useMemo, useRef, useState } from 'react';
import { getAudienceProfile, inferAudience } from '../lib/personalization';
import { collectSafeSignals, localDecision, requestAiDecision, shouldRequestAi } from '../lib/hybridPersonalization';

const STORAGE_KEY = 'mc-portfolio-audience';
const API_BASE = import.meta.env.VITE_PORTFOLIO_API_BASE || '';

function readInitialAudience() {
  if (typeof window === 'undefined') return 'general';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return getAudienceProfile(stored).key;
  } catch {}
  return inferAudience({ search: window.location.search, referrer: document.referrer });
}

export default function usePersonalization() {
  const [audienceKey, setAudienceKey] = useState(readInitialAudience);
  const [source, setSource] = useState('inferred');
  const [aiDecision, setAiDecision] = useState(null);
  const viewedSections = useRef(new Set());
  const behaviorRefined = useRef(false);
  const manualSelection = useRef(false);

  useEffect(() => {
    try {
      manualSelection.current = Boolean(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      manualSelection.current = false;
    }
  }, []);

  const baseProfile = useMemo(() => getAudienceProfile(audienceKey), [audienceKey]);
  const profile = useMemo(() => {
    if (!aiDecision || aiDecision.confidence < 0.55) return baseProfile;
    const aiBase = getAudienceProfile(aiDecision.intent);
    return { ...aiBase, sectionOrder: aiDecision.sectionOrder };
  }, [baseProfile, aiDecision]);

  const runAi = async (query = '', { force = false } = {}) => {
    if (!API_BASE || !shouldRequestAi({ manualSelection: manualSelection.current, force })) return null;
    const signals = collectSafeSignals({ query, viewedSections: [...viewedSections.current] });
    try {
      const result = await requestAiDecision(API_BASE, signals);
      if (result && result.confidence >= 0.55) {
        setAiDecision(result);
        setAudienceKey(result.intent);
        setSource('ai');
      }
      return result;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!API_BASE) return undefined;
    const timer = window.setTimeout(() => runAi(), 400);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) viewedSections.current.add(entry.target.id);
      });
      if (!behaviorRefined.current && viewedSections.current.size >= 2) {
        behaviorRefined.current = true;
        runAi();
      }
    }, { threshold: 0.35 });
    document.querySelectorAll('main section[id]').forEach((node) => observer.observe(node));
    return () => { window.clearTimeout(timer); observer.disconnect(); };
  }, []);

  const selectAudience = (nextKey) => {
    const normalized = getAudienceProfile(nextKey).key;
    manualSelection.current = true;
    setAudienceKey(normalized);
    setAiDecision(null);
    setSource('selected');
    try { window.localStorage.setItem(STORAGE_KEY, normalized); } catch {}
  };

  const searchIntent = async (query) => {
    manualSelection.current = false;
    const fallback = localDecision({ query });
    setAudienceKey(fallback.intent);
    setAiDecision(fallback);
    setSource('search');
    await runAi(query, { force: true });
  };

  const resetAudience = () => {
    manualSelection.current = false;
    setAudienceKey('general');
    setAiDecision(null);
    setSource('reset');
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return { profile, source, selectAudience, searchIntent, resetAudience };
}
