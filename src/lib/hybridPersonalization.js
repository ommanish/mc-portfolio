import { getAudienceProfile, inferAudience, getDevicePreferences } from './personalization.js';

const ALLOWED_SECTIONS = ['work','services','web-experience','cases','skills','ai','timeline','contact'];
const ALLOWED_AUDIENCES = ['general','recruiter','engineering','marketing','client','ai'];

function generateSecureSessionId(cryptoObj) {
  if (typeof cryptoObj?.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }

  if (typeof cryptoObj?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    cryptoObj.getRandomValues(bytes);
    const value = Array.from(
      bytes,
      (byte) => byte.toString(16).padStart(2, '0')
    ).join('');
    return `session-${value}`;
  }

  return `session-${Date.now()}`;
}

export function createSessionId(storage = globalThis.sessionStorage, cryptoObj = globalThis.crypto) {
  const key = 'mc-portfolio-session-id';
  try {
    const existing = storage?.getItem?.(key);
    if (existing) return existing;
    const next = generateSecureSessionId(cryptoObj);
    storage?.setItem?.(key, next);
    return next;
  } catch {
    return generateSecureSessionId(cryptoObj);
  }
}

export function collectSafeSignals({ win = globalThis.window, doc = globalThis.document, query = '', viewedSections = [] } = {}) {
  const url = new URL(win?.location?.href || 'https://manishchawla.com/');
  let referrerHostname = '';
  try { referrerHostname = doc?.referrer ? new URL(doc.referrer).hostname.toLowerCase() : ''; } catch { referrerHostname = ''; }
  const device = getDevicePreferences(win);
  return {
    sessionId: createSessionId(win?.sessionStorage, win?.crypto),
    referrerHostname,
    campaign: {
      source: url.searchParams.get('utm_source')?.slice(0, 80) || '',
      medium: url.searchParams.get('utm_medium')?.slice(0, 80) || '',
      campaign: url.searchParams.get('utm_campaign')?.slice(0, 120) || '',
    },
    language: String(win?.navigator?.language || '').slice(0, 32),
    timezone: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; } })(),
    device: device.compact ? 'compact' : 'desktop',
    reducedMotion: device.reducedMotion,
    saveData: device.saveData,
    viewedSections: [...new Set(viewedSections)].filter((item) => ALLOWED_SECTIONS.includes(item)).slice(0, 8),
    explicitQuery: String(query || '').trim().slice(0, 240),
  };
}

export function sanitizeAiDecision(value) {
  const fallback = { intent: 'general', confidence: 0, priorityTopics: [], sectionOrder: getAudienceProfile('general').sectionOrder };
  if (!value || typeof value !== 'object') return fallback;
  const intent = ALLOWED_AUDIENCES.includes(value.intent) ? value.intent : 'general';
  const confidence = Number.isFinite(Number(value.confidence)) ? Math.max(0, Math.min(1, Number(value.confidence))) : 0;
  const priorityTopics = Array.isArray(value.priorityTopics)
    ? value.priorityTopics.map((v) => String(v).slice(0, 80)).filter(Boolean).slice(0, 5)
    : [];
  const requested = Array.isArray(value.sectionOrder) ? value.sectionOrder.filter((s) => ALLOWED_SECTIONS.includes(s)) : [];
  const base = getAudienceProfile(intent).sectionOrder;
  const sectionOrder = [...new Set([...requested, ...base])];
  return { intent, confidence, priorityTopics, sectionOrder };
}

export function shouldRequestAi({ manualSelection = false, force = false } = {}) {
  return Boolean(force || !manualSelection);
}

export async function requestAiDecision(apiBase, signals, fetchImpl = globalThis.fetch) {
  if (!apiBase || !fetchImpl) return null;
  const response = await fetchImpl(`${String(apiBase).replace(/\/$/, '')}/api/personalize`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(signals),
  });
  if (!response.ok) return null;
  return sanitizeAiDecision(await response.json());
}

export function localDecision({ search = '', referrer = '', query = '' } = {}) {
  const intent = inferAudience({ search, referrer, query });
  const profile = getAudienceProfile(intent);
  return { intent, confidence: intent === 'general' ? 0.35 : 0.65, priorityTopics: [], sectionOrder: profile.sectionOrder };
}
