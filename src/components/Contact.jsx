import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

const API_BASE = import.meta.env.VITE_PORTFOLIO_API_BASE || '';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export default function Contact() {
  const startedAt = useRef(Date.now());
  const turnstileContainer = useRef(null);
  const turnstileWidgetId = useRef(null);
  const [reason, setReason] = useState('job');
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (window.turnstile?.render && turnstileContainer.current && turnstileWidgetId.current === null) {
        turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: 'portfolio_contact',
        });
        window.clearInterval(timer);
      } else if (attempts >= 50) {
        window.clearInterval(timer);
      }
    }, 100);
    return () => {
      window.clearInterval(timer);
      if (turnstileWidgetId.current !== null) window.turnstile?.remove?.(turnstileWidgetId.current);
      turnstileWidgetId.current = null;
    };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!API_BASE) {
      setStatus({ type: 'error', message: 'Contact service is not configured yet.' });
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get('name'), email: data.get('email'), company: data.get('company'), reason,
      role: data.get('role'), jobUrl: data.get('jobUrl'), message: data.get('message'),
      website: data.get('website'), turnstileToken: turnstileWidgetId.current !== null ? window.turnstile?.getResponse?.(turnstileWidgetId.current) || '' : '', startedAt: startedAt.current,
    };
    setStatus({ type: 'loading', message: 'Sending…' });
    try {
      const response = await fetch(`${API_BASE.replace(/\/$/, '')}/api/contact`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to send your message.');
      form.reset();
      setReason('job');
      startedAt.current = Date.now();
      if (turnstileWidgetId.current !== null) window.turnstile?.reset?.(turnstileWidgetId.current);
      setStatus({ type: 'success', message: 'Thanks — your message has been sent.' });
    } catch (error) {
      if (turnstileWidgetId.current !== null) window.turnstile?.reset?.(turnstileWidgetId.current);
      setStatus({ type: 'error', message: error.message || 'Unable to send your message. Please try again.' });
    }
  };

  return (
    <section id="contact">
      <Reveal as="article" className="contact-card secure-contact-card">
        <div className="contact-intro">
          <div className="section-kicker">Contact</div>
          <h2>Let’s build better web experiences.</h2>
          <p>For job opportunities, consulting, or AI collaboration, send me a message here. My destination email is not exposed publicly.</p>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <div className="contact-grid">
            <label>Name <span aria-hidden="true">*</span><input name="name" required maxLength="100" autoComplete="name" /></label>
            <label>Work email <span aria-hidden="true">*</span><input name="email" type="email" required maxLength="160" autoComplete="email" /></label>
            <label>Reason <span aria-hidden="true">*</span>
              <select name="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="job">Job opportunity</option><option value="consulting">Consulting project</option>
                <option value="ai">AI collaboration</option><option value="other">Something else</option>
              </select>
            </label>
            <label>Company {reason === 'job' && <span aria-hidden="true">*</span>}<input name="company" required={reason === 'job'} maxLength="120" autoComplete="organization" /></label>
            {reason === 'job' && <>
              <label>Job title / role<input name="role" maxLength="140" /></label>
              <label>Job posting URL<input name="jobUrl" type="url" maxLength="500" placeholder="https://" /></label>
            </>}
          </div>
          <label>Message <span aria-hidden="true">*</span><textarea name="message" required minLength="10" maxLength="4000" rows="7" /></label>
          <label className="contact-honeypot" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label>
          {TURNSTILE_SITE_KEY ? <div ref={turnstileContainer} className="contact-turnstile" /> : <p className="form-config-warning">Verification is not configured.</p>}
          <div className="contact-submit-row">
            <button className="btn btn-primary" type="submit" disabled={status.type === 'loading' || !TURNSTILE_SITE_KEY}>Send message</button>
            <p className={`contact-status ${status.type}`} role="status" aria-live="polite">{status.message}</p>
          </div>
          <p className="contact-privacy">Protected against automated abuse. Your form details are used only to respond to your inquiry.</p>
        </form>
      </Reveal>
    </section>
  );
}
