# Hybrid AI Personalization and Secure Contact Design

## Goal
Turn the portfolio from rule-only personalization into a hybrid AI experience while adding a secure, bot-resistant contact path and a clear consulting/services section.

## Positioning
The default homepage is career-first with the headline **Web + AI leader helping teams build better digital experiences.** Salesforce belongs in Experience, not the hero. A dedicated **How I Can Help** section supports consulting and collaboration. Company names may appear in Experience; case studies remain generalized and public-safe.

## Hybrid personalization
Use two decision layers:
1. Local browser intelligence for immediate, no-network intent estimation.
2. Cloud AI personalization for richer interpretation.

Safe signals are limited to referrer hostname, UTM values, browser language, timezone, viewport/device class, reduced-motion/save-data preferences, sections viewed, and explicit on-site intent text. Do not access or infer private browser history, private account data, cross-site identity, sensitive traits, or fingerprint visitors.

The AI backend receives a sanitized summary and returns structured recommendations only: intent, confidence, priority topics, and section order. AI can rank approved portfolio content but cannot invent employers, projects, achievements, certifications, or personal facts.

A visitor's explicit audience choice always overrides automatic AI personalization until they search again or reset. AI failure falls back to local personalization, and the complete portfolio remains available.

## Contact
Replace the public email/`mailto:` primary contact path with a secure form. Destination email is not shipped in the React bundle.

Fields:
- Name — required
- Work email — required
- Reason — job, consulting, AI collaboration, other
- Company — required for job inquiries; optional otherwise
- Job title/role — optional for job
- Job posting URL — optional for job
- Message — required
- Honeypot — hidden
- Turnstile token — required in production

Server-side validation must enforce Company for job inquiries even if browser validation is bypassed.

## Security boundary
Frontend calls a Cloudflare Worker. OpenAI, Resend, and Turnstile secrets stay in Worker secrets. Protect contact with server-side Turnstile Siteverify, expected action/hostname, CORS origin allow-list, payload/content-type limits, field validation, honeypot, completion-time heuristic, and rate limiting. Public errors must not expose provider or secret details.

Email is sent through Resend using a verified portfolio-domain sender and the validated visitor email as reply-to.

## Routes
- POST `/api/personalize`: sanitized session summary -> structured AI decision.
- POST `/api/contact`: bot checks + validation -> email delivery.
- OPTIONS: CORS preflight for approved portfolio origins.

## Failure behavior
- AI fails/low confidence: keep local experience.
- Contact validation fails: show actionable field-level/general message.
- Turnstile fails: ask visitor to retry verification.
- Rate limit: generic retry-later response.
- Email provider fails: do not claim success.

## Accessibility/privacy
Forms use explicit labels, native required validation, keyboard controls, visible focus, and `aria-live` status. Raw interaction data remains session-only; only an explicit audience selection may persist in localStorage. The UI states that basic browser/on-site context is used and browsing history/personal identity are not collected.
