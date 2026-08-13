# Hybrid AI Personalization and Secure Contact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add privacy-first hybrid AI personalization, a services section, and a secure bot-resistant contact form to the React portfolio.

**Architecture:** Keep the current deterministic audience profiles as a fast fallback. Add a client signal sanitizer and Cloudflare Worker that asks OpenAI for schema-constrained ordering; add a separate Worker contact endpoint protected by Turnstile and rate limits that sends through Resend.

**Tech Stack:** React 19, Vite 8, Node 22, Cloudflare Workers, Turnstile, OpenAI Responses API Structured Outputs, Resend.

## Global Constraints
- Never expose OpenAI, Resend, Turnstile secret, or destination email in the browser bundle.
- Never collect private browser history, cross-site identity, fingerprinting data, or sensitive traits.
- Explicit visitor audience selection must beat automatic AI inference.
- Company is mandatory for `job` submissions on both client and server.
- AI can reorder/select verified content only; it cannot invent portfolio facts.
- All existing git branches remain intact.

---

### Task 1: Hybrid decision sanitizer
**Files:**
- Create: `src/lib/hybridPersonalization.js`
- Test: `src/lib/hybridPersonalization.test.js`

**Interfaces:**
- Produces `collectSafeSignals(options)`, `sanitizeAiDecision(value)`, `requestAiDecision(apiBase, signals, fetchImpl)`, `localDecision(input)`.

- [ ] Write tests that reject unknown audience/section keys, retain every known portfolio section, and preserve the local technical-intent fallback.
- [ ] Run `node --test src/lib/hybridPersonalization.test.js` and verify RED before implementation.
- [ ] Implement strict section/audience allow-lists, query truncation, safe referrer hostname parsing, UTM-only campaign extraction, and AI response normalization.
- [ ] Run the test again and verify GREEN.

### Task 2: Services section and audience ordering
**Files:**
- Create: `src/components/HowICanHelp.jsx`
- Modify: `src/content/audienceProfiles.js`
- Modify: `src/App.jsx`
- Modify: `src/styles/contact.css`

**Interfaces:**
- Produces section key `services`, consumed by both local profiles and AI ordering.

- [ ] Add `services` to every profile section order and update the default headline to “Web + AI leader helping teams / build better digital experiences.”
- [ ] Add four public-safe service cards: web modernization, CMS/page-builder delivery, frontend quality, AI-assisted workflows.
- [ ] Register `services` in the App section map and responsive styling.
- [ ] Run `npm run build` after patch application.

### Task 3: AI-aware personalization hook
**Files:**
- Modify: `src/hooks/usePersonalization.js`
- Modify: `src/components/PersonalizationBar.jsx`

**Interfaces:**
- Consumes `requestAiDecision` and `collectSafeSignals`.
- Produces `{ profile, source, selectAudience, searchIntent, resetAudience }`.

- [ ] Keep initial local inference instantaneous.
- [ ] Call the AI backend only when configured; refine once after useful section activity.
- [ ] Ensure persisted/manual selection blocks automatic AI override; explicit search can opt back into AI.
- [ ] Show a concise AI-personalized status and privacy disclosure.

### Task 4: Secure contact UI
**Files:**
- Replace: `src/components/Contact.jsx`
- Create/Modify: `src/styles/contact.css`
- Modify: `index.html`
- Create: `.env.example`

**Interfaces:**
- POSTs JSON to `${VITE_PORTFOLIO_API_BASE}/api/contact`.
- Requires `VITE_TURNSTILE_SITE_KEY` for production submission.

- [ ] Build native-labeled form fields with Company conditionally required for Job.
- [ ] Include honeypot, completion start timestamp, Turnstile response, and `aria-live` submission state.
- [ ] Remove the public destination-email path from the primary UI.
- [ ] Load Turnstile and disable submission when verification is unconfigured.

### Task 5: Worker validation and bot controls
**Files:**
- Create: `worker/src/index.js`
- Test: `worker/src/index.test.js`
- Create: `worker/wrangler.toml.example`

**Interfaces:**
- `POST /api/contact`
- `POST /api/personalize`

- [ ] Write failing tests for job-company enforcement, honeypot rejection, too-fast submission, and unknown personalization sections.
- [ ] Run `node --test worker/src/index.test.js` and verify RED.
- [ ] Implement JSON/content-length checks, CORS allow-list, normalization, Turnstile Siteverify, action/hostname checks, optional Worker rate-limit bindings, and generic public errors.
- [ ] Implement Resend delivery using Worker secrets and reply-to.
- [ ] Run tests and verify GREEN.

### Task 6: Structured OpenAI personalization
**Files:**
- Modify: `worker/src/index.js`

**Interfaces:**
- Uses OpenAI Responses API and returns only schema-validated intent/confidence/topics/section order.

- [ ] Send only sanitized signal summaries.
- [ ] Use a strict JSON schema whose enums contain the six known audiences and eight known sections.
- [ ] Prompt against identity/sensitive-trait/employer inference and fabricated portfolio facts.
- [ ] Treat parse/provider errors as a fallback-worthy server error; frontend must remain usable.

### Task 7: Verification and deployment documentation
**Files:**
- Create: `APPLY.md`
- Keep: `docs/superpowers/specs/2026-08-12-hybrid-ai-contact-security-design.md`
- Keep: `docs/superpowers/plans/2026-08-12-hybrid-ai-contact-security.md`

- [ ] Run all Node tests.
- [ ] Run `npm run build` in the real repository after applying.
- [ ] Configure Worker secrets and rate-limit bindings without committing secret values.
- [ ] Configure the public Vite API URL and Turnstile site key.
- [ ] Test valid job, missing-company job, bot/honeypot, rate-limit, AI-offline fallback, keyboard navigation, and mobile layout.
- [ ] Deploy Worker first, then static frontend through the normal protected PR workflow.
