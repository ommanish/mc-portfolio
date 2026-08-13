import { useState } from "react";
import { AUDIENCE_OPTIONS } from "../content/audienceProfiles";
import IntelligenceGraphic from "./IntelligenceGraphic";

const LABELS = {
  recruiter: "Hiring / Recruiting",
  engineering: "Engineering / Technical",
  marketing: "Web / Marketing",
  client: "Consulting / Project",
  ai: "AI / Automation",
};

export default function WelcomeExperience({ onSelectAudience, onSearchIntent, onExploreNormally }) {
  const [mode, setMode] = useState("choices");
  const [query, setQuery] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (query.trim()) onSearchIntent(query.trim());
  };

  return (
    <section className="welcome-experience" aria-labelledby="welcome-title">
      <div className="welcome-grid">
        <div className="welcome-copy">
          <div className="section-kicker">Manish Chawla · Web Experience · Frontend · AI</div>
          <h1 id="welcome-title">What brings you here?</h1>
          <p className="welcome-lead">
            Tell me what you came to evaluate. I’ll bring the most relevant experience forward while keeping the full portfolio available.
          </p>

          {mode === "choices" ? (
            <>
              <div className="welcome-options" aria-label="Choose your portfolio view">
                {AUDIENCE_OPTIONS.map((option) => (
                  <button className="welcome-option" key={option.key} type="button" onClick={() => onSelectAudience(option.key)}>
                    <span>{LABELS[option.key]}</span><span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <div className="welcome-secondary-actions">
                <button className="text-action" type="button" onClick={() => setMode("ai")}>
                  Tell AI what you’re looking for
                </button>
                <button className="text-action is-muted" type="button" onClick={onExploreNormally}>
                  Explore without personalizing
                </button>
              </div>
            </>
          ) : (
            <form className="welcome-ai-form" onSubmit={submit}>
              <button className="text-action is-muted" type="button" onClick={() => { setMode("choices"); setQuery(""); }}>
                ← Back to choices
              </button>
              <label htmlFor="welcome-ai-intent">What are you looking for?</label>
              <textarea
                id="welcome-ai-intent"
                value={query}
                maxLength="240"
                rows="4"
                placeholder="e.g. React leadership, CMS delivery, accessibility, or AI automation"
                onChange={(event) => setQuery(event.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={!query.trim()}>Personalize my view</button>
            </form>
          )}

          <p className="welcome-privacy">
            This portfolio uses basic browser context and your on-site activity to prioritize relevant content. It does not read your browsing history or identify you.
          </p>
        </div>

        <aside className="welcome-visual">
          <div className="micro-label">Portfolio intelligence map</div>
          <IntelligenceGraphic />
          <p>A career spanning web experience, frontend engineering, CMS delivery, accessibility, AI, and team leadership — connected around shipping better digital experiences.</p>
        </aside>
      </div>
    </section>
  );
}
