const SECTION_KEYS = ['work','services','web-experience','cases','skills','ai','timeline','contact'];
const INTENTS = ['general','recruiter','engineering','marketing','client','ai'];
const REASONS = ['job','consulting','ai','other'];
const CLIENT_ANALYTICS_EVENTS = [
  'page_visit','adaptive_open','lens_selected','change_lens',
  'resume_click','linkedin_click','github_click','case_study_click',
  'portfolio_cta_click','contact_start','contact_reason'
];
const CLIENT_ANALYTICS_EVENT_SET = new Set(CLIENT_ANALYTICS_EVENTS);
const ANALYTICS_SECTIONS = new Set(['','welcome','hero','work','services','web-experience','cases','skills','ai','timeline','contact','footer']);
const ANALYTICS_TOP_LEVEL_KEYS = new Set(['sessionId','event','path','section','lens','referrerHostname','campaign','device','value']);
const ANALYTICS_FORBIDDEN_KEYS = new Set(['name','email','company','message','jobUrl','turnstileToken','ip','rawIp']);
const SAFE_TOKEN = /^[A-Za-z0-9._~:+\/ -]*$/;
const SAFE_SLUG = /^[A-Za-z0-9._:-]*$/;

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

function cleanHostname(value) {
  const host = String(value || '').trim().toLowerCase().slice(0, 120);
  if (!host) return '';
  if (!/^(?:[a-z0-9-]+\.)*[a-z0-9-]+$/.test(host)) return '';
  return host;
}

function cleanCampaignValue(value, max) {
  const text = String(value || '').trim().slice(0, max);
  return SAFE_TOKEN.test(text) ? text : '';
}

function cleanAnalyticsValue(event, value) {
  const text = String(value || '').trim().slice(0, 80);
  if (!text) return '';
  if (event === 'lens_selected') return INTENTS.includes(text) ? text : '';
  if (event === 'contact_reason') return REASONS.includes(text) ? text : '';
  if (event === 'portfolio_cta_click') {
    return ['hero-primary','explore-full','classic-return'].includes(text) ? text : '';
  }
  if (event === 'case_study_click') return SAFE_SLUG.test(text) ? text : '';
  return '';
}

function sanitizeCampaign(body) {
  const value = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  return {
    source: cleanCampaignValue(value.source, 80),
    medium: cleanCampaignValue(value.medium, 80),
    campaign: cleanCampaignValue(value.campaign, 120),
  };
}

export function validateAnalyticsPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, message: 'Invalid analytics request.' };
  }

  const keys = Object.keys(body);
  if (keys.some((key) => ANALYTICS_FORBIDDEN_KEYS.has(key))) {
    return { ok: false, message: 'Invalid analytics request.' };
  }
  if (keys.some((key) => !ANALYTICS_TOP_LEVEL_KEYS.has(key))) {
    return { ok: false, message: 'Invalid analytics request.' };
  }

  const sessionId = String(body.sessionId || '').slice(0, 96);
  if (!/^[A-Za-z0-9._:-]{8,96}$/.test(sessionId)) {
    return { ok: false, message: 'Invalid analytics request.' };
  }

  const event = String(body.event || '');
  if (!CLIENT_ANALYTICS_EVENT_SET.has(event)) {
    return { ok: false, message: 'Invalid analytics request.' };
  }

  const path = String(body.path || '');
  if (!['/','/new/'].includes(path)) {
    return { ok: false, message: 'Invalid analytics request.' };
  }

  const section = String(body.section || '').slice(0, 40);
  if (!ANALYTICS_SECTIONS.has(section)) {
    return { ok: false, message: 'Invalid analytics request.' };
  }

  const lens = String(body.lens || '').slice(0, 32);
  if (lens && !INTENTS.includes(lens)) {
    return { ok: false, message: 'Invalid analytics request.' };
  }

  const device = body.device === 'compact' ? 'compact' : body.device === 'desktop' ? 'desktop' : '';
  if (!device) {
    return { ok: false, message: 'Invalid analytics request.' };
  }

  return {
    ok: true,
    value: {
      sessionId,
      event,
      path,
      section,
      lens,
      referrerHostname: cleanHostname(body.referrerHostname),
      campaign: sanitizeCampaign(body.campaign),
      device,
      value: cleanAnalyticsValue(event, body.value),
    },
  };
}

function sanitizeConversionAnalytics(body) {
  const value = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
  const sessionId = String(value.sessionId || '').slice(0, 96);
  const safeSessionId = /^[A-Za-z0-9._:-]{8,96}$/.test(sessionId) ? sessionId : '';
  const path = ['/','/new/'].includes(String(value.path || '')) ? String(value.path) : '';
  const landingPath = ['/','/new/'].includes(String(value.landingPath || '')) ? String(value.landingPath) : '';
  const lens = INTENTS.includes(String(value.lens || '')) ? String(value.lens) : '';
  const journey = Array.isArray(value.journey)
    ? value.journey.map(String).filter((event) => CLIENT_ANALYTICS_EVENT_SET.has(event)).slice(-12)
    : [];

  return {
    sessionId: safeSessionId,
    path,
    landingPath,
    referrerHostname: cleanHostname(value.referrerHostname),
    campaign: sanitizeCampaign(value.campaign),
    lens,
    resumeClicked: Boolean(value.resumeClicked),
    caseStudyClicks: Math.max(0, Math.min(20, Number(value.caseStudyClicks) || 0)),
    journey,
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
  const submissionId = String(body.submissionId || '').trim().slice(0, 100);
  if (submissionId && !/^[A-Za-z0-9._:-]{8,100}$/.test(submissionId)) {
    return { ok: false, message: 'Please check the form and try again.' };
  }

  const value = {
    name: String(body.name || '').trim().slice(0, 100), email: String(body.email || '').trim().toLowerCase().slice(0, 160),
    company: String(body.company || '').trim().slice(0, 120), reason: String(body.reason || ''), role: String(body.role || '').trim().slice(0, 140),
    jobUrl: String(body.jobUrl || '').trim().slice(0, 500), message: String(body.message || '').trim().slice(0, 4000),
    website: String(body.website || '').trim().slice(0, 200), turnstileToken: String(body.turnstileToken || '').slice(0, 2048),
    startedAt: Number(body.startedAt || 0),
    submissionId,
    analytics: sanitizeConversionAnalytics(body.analytics),
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

function writeAnalyticsPoint(value, request, env) {
  if (!env.ANALYTICS?.writeDataPoint || !value?.sessionId) return;
  try {
    env.ANALYTICS.writeDataPoint({
      blobs: [
        String(value.event || '').slice(0, 40),
        String(value.path || '').slice(0, 80),
        String(value.section || '').slice(0, 40),
        String(value.lens || '').slice(0, 32),
        String(value.referrerHostname || '').slice(0, 120),
        String(value.campaign?.source || '').slice(0, 80),
        String(value.campaign?.medium || '').slice(0, 80),
        String(value.campaign?.campaign || '').slice(0, 120),
        String(value.device || '').slice(0, 16),
        String(value.value || '').slice(0, 80),
        String(request.cf?.country || request.headers.get('CF-IPCountry') || '').slice(0, 8),
      ],
      doubles: [1],
      indexes: [String(value.sessionId).slice(0, 96)],
    });
  } catch (error) {
    console.error('Analytics write failed', error?.message || 'unknown_error');
  }
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

function contactSourceSummary(contact) {
  const analytics = contact.analytics || {};
  const source = analytics.campaign?.source || analytics.referrerHostname || 'Direct / unknown';
  const journey = Array.isArray(analytics.journey) && analytics.journey.length ? analytics.journey.join(' → ') : '—';
  return { source, journey };
}

async function sendEmail(contact, env) {
  const subject = `[Portfolio] ${contact.reason === 'job' ? 'Job opportunity' : contact.reason === 'consulting' ? 'Consulting inquiry' : contact.reason === 'ai' ? 'AI collaboration' : 'Contact inquiry'}${contact.company ? ` — ${contact.company}` : ''}`;
  const summary = contactSourceSummary(contact);
  const text = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Reason: ${contact.reason}`,
    `Company: ${contact.company || '—'}`,
    `Role: ${contact.role || '—'}`,
    `Job URL: ${contact.jobUrl || '—'}`,
    `Source: ${summary.source}`,
    `Lens: ${contact.analytics?.lens || '—'}`,
    `Journey: ${summary.journey}`,
    '',
    contact.message
  ].join('\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json', 'user-agent': 'manishchawla-portfolio-worker/1.0', 'idempotency-key': crypto.randomUUID() },
    body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL], reply_to: contact.email, subject, text }),
  });
  if (!response.ok) throw new Error('email_provider_failed');
}

async function persistLead(contact, env) {
  if (!env.LEADS_DB?.prepare) return { inserted: false, leadId: '', submissionId: contact.submissionId || '' };

  const leadId = crypto.randomUUID();
  const submissionId = contact.submissionId || crypto.randomUUID();
  const analytics = contact.analytics || {};

  const statement = env.LEADS_DB.prepare(`
    INSERT OR IGNORE INTO leads (
      id, submission_id, created_at, name, email, company, reason, role, job_url, message,
      session_id, landing_path, referrer_hostname, utm_source, utm_medium, utm_campaign,
      lens, resume_clicked, case_study_clicks, journey
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await statement.bind(
    leadId,
    submissionId,
    new Date().toISOString(),
    contact.name,
    contact.email,
    contact.company || '',
    contact.reason,
    contact.role || '',
    contact.jobUrl || '',
    contact.message,
    analytics.sessionId || '',
    analytics.landingPath || analytics.path || '',
    analytics.referrerHostname || '',
    analytics.campaign?.source || '',
    analytics.campaign?.medium || '',
    analytics.campaign?.campaign || '',
    analytics.lens || '',
    analytics.resumeClicked ? 1 : 0,
    analytics.caseStudyClicks || 0,
    Array.isArray(analytics.journey) ? analytics.journey.join('>') : ''
  ).run();

  return {
    inserted: Boolean(result?.meta?.changes),
    leadId,
    submissionId,
  };
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (!cors) return json({ message: 'Not allowed.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ message: 'Method not allowed.' }, 405, cors);
    const path = new URL(request.url).pathname;
    try {
      if (path === '/api/analytics') {
        const parsed = validateAnalyticsPayload(await parseJsonRequest(request, 5_000));
        if (!parsed.ok) return json({ message: parsed.message }, 400, cors);
        if (env.ANALYTICS_RATE_LIMITER) {
          const client = request.headers.get('CF-Connecting-IP') || 'anonymous';
          const limited = await env.ANALYTICS_RATE_LIMITER.limit({ key: client });
          if (!limited.success) return json({ message: 'Please try again later.' }, 429, cors);
        }
        writeAnalyticsPoint(parsed.value, request, env);
        return json({ ok: true }, 202, cors);
      }

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

        try {
          await persistLead(parsed.value, env);
        } catch (error) {
          console.error('Lead persistence failed', error?.message || 'unknown_error');
        }

        await sendEmail(parsed.value, env);

        const analytics = parsed.value.analytics || {};
        writeAnalyticsPoint({
          sessionId: analytics.sessionId,
          event: 'contact_submit_success',
          path: analytics.path || '/new/',
          section: 'contact',
          lens: analytics.lens || '',
          referrerHostname: analytics.referrerHostname || '',
          campaign: analytics.campaign || { source:'', medium:'', campaign:'' },
          device: '',
          value: parsed.value.reason,
        }, request, env);

        return json({ ok: true }, 200, cors);
      }

      return json({ message: 'Not found.' }, 404, cors);
    } catch (error) {
      console.error('Worker request failed', error?.message || 'unknown_error');
      return json({ message: 'Something went wrong. Please try again.' }, 500, cors);
    }
  },
};
