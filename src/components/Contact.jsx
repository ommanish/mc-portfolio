import { useEffect, useRef, useState } from "react";

const DEFAULT_API_BASE = import.meta.env.VITE_PORTFOLIO_API_BASE || "";
const DEFAULT_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const REASONS = [["job","Job opportunity"],["consulting","Consulting project"],["ai","AI collaboration"],["other","Something else"]];
const COPY = {
  job: "Tell me what you’re hiring for.",
  consulting: "Tell me what needs to change, ship, or improve.",
  ai: "Tell me what workflow you want to make smarter.",
  other: "Tell me what you have in mind.",
};

export default function Contact({ embedded = false, apiBase = DEFAULT_API_BASE, turnstileSiteKey = DEFAULT_SITE_KEY, fetchImpl = globalThis.fetch }) {
  const startedAt = useRef(Date.now());
  const container = useRef(null);
  const widget = useRef(null);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!turnstileSiteKey || !reason) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (window.turnstile?.render && container.current && widget.current === null) {
        widget.current = window.turnstile.render(container.current, {
          sitekey: turnstileSiteKey,
          action: "portfolio_contact",
          "expired-callback": () => {
            setStatus({ type: "error", message: "Verification expired. Please verify again." });
            if (widget.current !== null) window.turnstile?.reset?.(widget.current);
          },
          "error-callback": () => setStatus({ type: "error", message: "Verification could not complete. Please try again." }),
        });
        window.clearInterval(timer);
      } else if (tries >= 50) window.clearInterval(timer);
    }, 100);

    return () => {
      window.clearInterval(timer);
      if (widget.current !== null) window.turnstile?.remove?.(widget.current);
      widget.current = null;
    };
  }, [turnstileSiteKey, reason]);

  const choose = (value) => {
    setReason(value);
    setStatus({ type: "idle", message: "" });
    startedAt.current = Date.now();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!apiBase || !fetchImpl) {
      setStatus({ type: "error", message: "Contact service is not configured yet." });
      return;
    }
    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"), email: data.get("email"), company: data.get("company"), reason,
      role: data.get("role"), jobUrl: data.get("jobUrl"), message: data.get("message"),
      website: data.get("website"),
      turnstileToken: widget.current !== null ? window.turnstile?.getResponse?.(widget.current) || "" : "",
      startedAt: startedAt.current,
    };
    setStatus({ type: "loading", message: "Sending…" });
    try {
      const response = await fetchImpl(`${String(apiBase).replace(/\/$/, "")}/api/contact`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to send your message.");
      setSuccess(true);
      setStatus({ type: "success", message: "Message received." });
    } catch (error) {
      if (widget.current !== null) window.turnstile?.reset?.(widget.current);
      setStatus({ type: "error", message: error.message || "Unable to send your message. Please try again." });
    }
  };

  return (
    <section id={embedded ? undefined : "contact"} className="editorial-section contact-executive">
      <div className="premium-contact-card">
        <div className="contact-intro">
          <div className="section-kicker">Contact</div>
          <h2>Let’s talk about the work.</h2>
          <p>Hiring for a senior web role, planning a CMS or frontend initiative, or exploring practical AI for digital delivery? Choose the reason that fits and send the context that matters.</p>
        </div>

        {success ? (
          <div className="contact-success" role="status">
            <span className="success-mark" aria-hidden="true">✓</span>
            <h3>Message received</h3>
            <p>Thanks — I’ve got the context. I’ll review it and get back to you as soon as I can.</p>
            <a className="btn btn-primary" href="#top">Back to portfolio</a>
          </div>
        ) : !reason ? (
          <div className="contact-reasons" aria-label="Reason for contacting Manish">
            {REASONS.map(([value,label]) => (
              <button key={value} type="button" onClick={() => choose(value)}><span>{label}</span><span aria-hidden="true">→</span></button>
            ))}
          </div>
        ) : (
          <form className="contact-form adaptive-contact-form" onSubmit={submit}>
            <div className="contact-form-heading">
              <div><span className="micro-label">{REASONS.find(([v]) => v === reason)?.[1]}</span><h3>{COPY[reason]}</h3></div>
              <button className="contact-change-reason" type="button" onClick={() => choose("")}>
                <span className="contact-change-reason-icon" aria-hidden="true">↶</span>
                <span>Change reason</span>
              </button>
            </div>

            <div className="contact-grid">
              <label>Name <span aria-hidden="true">*</span><input name="name" required maxLength="100" autoComplete="name" /></label>
              <label>Work email <span aria-hidden="true">*</span><input name="email" type="email" required maxLength="160" autoComplete="email" /></label>
              <label>Company {reason === "job" && <span aria-hidden="true">*</span>}<input name="company" required={reason === "job"} maxLength="120" autoComplete="organization" /></label>
              {reason === "job" && <>
                <label>Job title / role<input name="role" maxLength="140" /></label>
                <label className="contact-grid-wide">Job posting URL<input name="jobUrl" type="url" maxLength="500" placeholder="https://" /></label>
              </>}
            </div>

            <label>Message <span aria-hidden="true">*</span><textarea name="message" required minLength="10" maxLength="4000" rows="7" /></label>
            <label className="contact-honeypot" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label>
            {turnstileSiteKey ? <div ref={container} className="contact-turnstile" /> : <p className="form-config-warning">Verification is not configured.</p>}
            <div className="contact-submit-row">
              <button className="btn btn-primary" type="submit" disabled={status.type === "loading" || !turnstileSiteKey}>
                {status.type === "loading" ? "Sending…" : "Send message"}
              </button>
              <p className={`contact-status ${status.type}`} role={status.type === "error" ? "alert" : "status"} aria-live="polite">{status.message}</p>
            </div>
            <p className="contact-privacy">Protected against automated abuse. Your form details are used only to respond to your inquiry.</p>
          </form>
        )}
      </div>
    </section>
  );
}
