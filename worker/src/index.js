const SECTION_KEYS = ['work','services','web-experience','cases','skills','ai','timeline','contact'];
const INTENTS = ['general','recruiter','engineering','marketing','client','ai'];
const REASONS = ['job','consulting','ai','other'];

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });
}

function allowedOrigins(env) {
  return new Set(String(env.ALLOWED_ORIGINS || 'https://manishchawla.com,https://www.manishchawla.com,http://localhost:5173').split(',').map((v) => v.trim()).filter(Boolean));
}

function corsHeaders(request, env) {
  const origin = request.headers.get('origin') || '';
  if (!allowedOrigins(env).has(origin)) return null;
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

export function validatePersonalizationPayload(body) {
  if (!body || typeof body !== 'object') return { ok: false, message: 'Invalid request.' };
  const sessionId = String(body.sessionId || '').slice(0, 100);
  if (!/^[A-Za-z0-9._:-]{8,100}$/.test(sessionId)) return { ok: false, message: 'Invalid request.' };
  const safe = {
    sessionId,
    referrerHostname: String(body.referrerHostname || '').toLowerCase().slice(0, 120),
    campaign: {
      source: String(body.campaign?.source || '').slice(0, 80), medium: String(body.campaign?.medium || '').slice(0, 80),
      campaign: String(body.campaign?.campaign || '').slice(0, 120),
    },
    language: String(body.language || '').slice(0, 32), timezone: String(body.timezone || '').slice(0, 80),
    device: body.device === 'compact' ? 'compact' : 'desktop', reducedMotion: Boolean(body.reducedMotion), saveData: Boolean(body.saveData),
    viewedSections: Array.isArray(body.viewedSections) ? [...new Set(body.viewedSections.filter((s) => SECTION_KEYS.includes(s)))].slice(0, 8) : [],
    explicitQuery: String(body.explicitQuery || '').trim().slice(0, 240),
  };
  return { ok: true, value: safe };
}

export function validateContactPayload(body, now = Date.now()) {
  if (!body || typeof body !== 'object') return { ok: false, message: 'Please check the form and try again.' };
  const value = {
    name: String(body.name || '').trim().slice(0, 100), email: String(body.email || '').trim().toLowerCase().slice(0, 160),
    company: String(body.company || '').trim().slice(0, 120), reason: String(body.reason || ''), role: String(body.role || '').trim().slice(0, 140),
    jobUrl: String(body.jobUrl || '').trim().slice(0, 500), message: String(body.message || '').trim().slice(0, 4000),
    website: String(body.website || '').trim().slice(0, 200), turnstileToken: String(body.turnstileToken || '').slice(0, 2048),
    startedAt: Number(body.startedAt || 0),
  };
  if (!value.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) || !REASONS.includes(value.reason) || value.message.length < 10) return { ok: false, message: 'Please complete the required fields.' };
  if (value.reason === 'job' && !value.company) return { ok: false, message: 'Company is required for job opportunities.' };
  if (value.website) return { ok: false, message: 'Unable to submit this form.' };
  if (!value.turnstileToken) return { ok: false, message: 'Please complete verification.' };
  const elapsed = now - value.startedAt;
  if (!Number.isFinite(elapsed) || elapsed < 2500 || elapsed > 86_400_000) return { ok: false, message: 'Please refresh the page and try again.' };
  if (value.jobUrl) { try { const u = new URL(value.jobUrl); if (!['http:','https:'].includes(u.protocol)) throw new Error(); } catch { return { ok: false, message: 'Please enter a valid job posting URL.' }; } }
  return { ok: true, value };
}

async function parseJsonRequest(request, maxBytes = 12_000) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new Error('bad_content_type');
  const length = Number(request.headers.get('content-length') || 0);
  if (length && length > maxBytes) throw new Error('payload_too_large');
  const text = await request.text();
  if (text.length > maxBytes) throw new Error('payload_too_large');
  return JSON.parse(text);
}

async function verifyTurnstile(token, request, env) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('CF-Connecting-IP') || undefined }),
  });
  const result = await response.json();
  const expectedHostname = env.TURNSTILE_HOSTNAME || 'manishchawla.com';
  return Boolean(result.success && result.action === 'portfolio_contact' && result.hostname === expectedHostname);
}

function extractResponseText(payload) {
  if (typeof payload.output_text === 'string') return payload.output_text;
  for (const item of payload.output || []) for (const content of item.content || []) if (content.type === 'output_text' && content.text) return content.text;
  return '';
}

function applyIntentGuardrails(payload, decision) {
  const query = String(payload.explicitQuery || '').toLowerCase();
  const referrer = String(payload.referrerHostname || '').toLowerCase();

  const technicalTerms = [
    'react',
    'frontend',
    'accessibility',
    'a11y',
    'architecture',
    'javascript',
    'typescript',
    'performance',
    'components',
    'hooks',
  ];

  const technicalMatches = technicalTerms.filter((term) => query.includes(term)).length;
  const fromGitHub = referrer === 'github.com' || referrer.endsWith('.github.com');
  const strongTechnicalSignal =
    technicalMatches >= 2 || (fromGitHub && technicalMatches >= 1);

  if (
    strongTechnicalSignal &&
    ['general', 'recruiter'].includes(decision.intent)
  ) {
    return {
      ...decision,
      intent: 'engineering',
      confidence: Math.max(Number(decision.confidence) || 0, 0.85),
    };
  }

  return decision;
}

async function personalize(payload, env) {
  const schema = {
    type: 'object', additionalProperties: false,
    properties: {
      intent: { type: 'string', enum: INTENTS }, confidence: { type: 'number', minimum: 0, maximum: 1 },
      priorityTopics: { type: 'array', maxItems: 5, items: { type: 'string', maxLength: 80 } },
      sectionOrder: { type: 'array', minItems: 8, maxItems: 8, items: { type: 'string', enum: SECTION_KEYS } },
    }, required: ['intent','confidence','priorityTopics','sectionOrder'],
  };
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-5-mini',
      store: false,
      instructions: 'Classify portfolio visitor intent using only the supplied privacy-safe session summary. Do not infer identity, employer, sensitive traits, private browsing history, or facts not present. Rank all eight allowed portfolio sections for usefulness.',
      input: JSON.stringify(payload),
      text: { format: { type: 'json_schema', name: 'portfolio_personalization', strict: true, schema } },
    }),
  });
  if (!response.ok) {
    throw new Error('ai_provider_failed');
  }
  const text = extractResponseText(await response.json());
  const decision = JSON.parse(text);
  return applyIntentGuardrails(payload, decision);
}

async function sendEmail(contact, env) {
  const subject = `[Portfolio] ${contact.reason === 'job' ? 'Job opportunity' : contact.reason === 'consulting' ? 'Consulting inquiry' : contact.reason === 'ai' ? 'AI collaboration' : 'Contact inquiry'}${contact.company ? ` — ${contact.company}` : ''}`;
  const text = [`Name: ${contact.name}`, `Email: ${contact.email}`, `Reason: ${contact.reason}`, `Company: ${contact.company || '—'}`, `Role: ${contact.role || '—'}`, `Job URL: ${contact.jobUrl || '—'}`, '', contact.message].join('\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json', 'user-agent': 'manishchawla-portfolio-worker/1.0', 'idempotency-key': crypto.randomUUID() },
    body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL], reply_to: contact.email, subject, text }),
  });
  if (!response.ok) throw new Error('email_provider_failed');
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (!cors) return json({ message: 'Not allowed.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ message: 'Method not allowed.' }, 405, cors);
    const path = new URL(request.url).pathname;
    try {
      if (path === '/api/personalize') {
        const parsed = validatePersonalizationPayload(await parseJsonRequest(request));
        if (!parsed.ok) return json({ message: parsed.message }, 400, cors);
        if (env.AI_RATE_LIMITER) {
          const limited = await env.AI_RATE_LIMITER.limit({ key: parsed.value.sessionId });
          if (!limited.success) return json({ message: 'Please try again later.' }, 429, cors);
        }
        const decision = await personalize(parsed.value, env);
        return json(decision, 200, cors);
      }
      if (path === '/api/contact') {
        const parsed = validateContactPayload(await parseJsonRequest(request));
        if (!parsed.ok) return json({ message: parsed.message }, 400, cors);
        if (env.CONTACT_RATE_LIMITER) {
          const client = request.headers.get('CF-Connecting-IP') || 'anonymous';
          const limited = await env.CONTACT_RATE_LIMITER.limit({ key: client });
          if (!limited.success) return json({ message: 'Too many attempts. Please try again later.' }, 429, cors);
        }
        if (!(await verifyTurnstile(parsed.value.turnstileToken, request, env))) return json({ message: 'Verification failed. Please try again.' }, 400, cors);
        await sendEmail(parsed.value, env);
        return json({ ok: true }, 200, cors);
      }
      return json({ message: 'Not found.' }, 404, cors);
    } catch (error) {
      console.error('Worker request failed', error?.message || 'unknown_error');
      return json({ message: 'Something went wrong. Please try again.' }, 500, cors);
    }
  },
};
