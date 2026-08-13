import { useEffect, useRef, useState } from "react";
import { AUDIENCE_OPTIONS } from "../content/audienceProfiles";

const LABELS = {
  recruiter: "Hiring / Recruiting",
  engineering: "Engineering / Technical",
  marketing: "Web / Marketing",
  client: "Consulting / Project",
  ai: "AI / Automation",
};

export default function ViewSelector({ open, onClose, onSelectAudience, onSearchIntent, onReset }) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = [...(dialog?.querySelectorAll('button:not([disabled]), textarea:not([disabled]), [href]') || [])];
    focusable[0]?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "Tab" && focusable.length) {
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    const value = query.trim();
    setQuery("");
    onClose();
    onSearchIntent(value);
  };

  return (
    <div className="view-selector-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="view-selector" role="dialog" aria-modal="true" aria-labelledby="view-selector-title" ref={dialogRef}>
        <div className="view-selector-heading">
          <div><div className="section-kicker">Adjust portfolio</div><h2 id="view-selector-title">Choose what you want to focus on.</h2></div>
          <button className="icon-button" type="button" aria-label="Close portfolio view selector" onClick={onClose}>×</button>
        </div>

        <div className="view-selector-options">
          {AUDIENCE_OPTIONS.map((option) => (
            <button key={option.key} type="button" onClick={() => { onSelectAudience(option.key); onClose(); }}>
              {LABELS[option.key]}
            </button>
          ))}
        </div>

        <form className="view-selector-ai" onSubmit={submit}>
          <label htmlFor="adjust-ai-intent">Or tell AI what you want to find</label>
          <textarea id="adjust-ai-intent" rows="3" maxLength="240" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn btn-primary" type="submit" disabled={!query.trim()}>Personalize</button>
        </form>

        <button className="reset-view" type="button" onClick={() => { onClose(); onReset(); }}>
          Reset personalization and return to Welcome
        </button>
      </section>
    </div>
  );
}
