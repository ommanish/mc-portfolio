import { useState } from "react";
import { AUDIENCE_OPTIONS } from "../content/audienceProfiles";

const LABELS = {
  recruiter: "Hiring / Recruiting",
  engineering: "Engineering / Technical",
  marketing: "Web / Marketing",
  client: "Consulting / Project",
  ai: "AI / Automation",
};

const SIGNALS = {
  recruiter: "Experience · leadership · fit",
  engineering: "Architecture · UI · quality",
  marketing: "CMS · WebOps · launches",
  client: "Problems · decisions · outcomes",
  ai: "Workflows · systems · practical AI",
};

export default function WelcomeExperience({ onSelectAudience, onSearchIntent, onExploreNormally }) {
  const [query, setQuery] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value) onSearchIntent(value);
  };

  return (
    <section className="portfolio-lens" aria-labelledby="portfolio-lens-title">
      <div className="lens-orbit" aria-hidden="true">
        <span /><span /><span /><i />
      </div>

      <div className="lens-masthead">
        <span>MC / PORTFOLIO LENS</span>
        <span>SAN JOSE · 18+ YEARS · 2026</span>
      </div>

      <div className="lens-intro">
        <div className="lens-index" aria-hidden="true">00</div>
        <div>
          <div className="section-kicker">Manish Chawla · Enterprise Web · Frontend · CMS · AI</div>
          <h1 id="portfolio-lens-title" aria-label="Choose the lens. I’ll show you the proof.">
            <span>Choose the lens.</span>
            <span>I’ll show you the proof.</span>
          </h1>
          <p>
            Seventeen-plus years across enterprise web, frontend engineering, CMS delivery,
            accessibility, WebOps, and practical AI. Start with what you came here to evaluate.
          </p>
        </div>
      </div>

      <div className="lens-question-row">
        <span>WHAT DO YOU WANT TO UNDERSTAND ABOUT MY WORK?</span>
        <span aria-hidden="true">SELECT ONE ↓</span>
      </div>

      <div className="lens-paths" aria-label="Choose your portfolio lens">
        {AUDIENCE_OPTIONS.map((option, index) => (
          <button
            className="lens-path"
            key={option.key}
            type="button"
            onClick={() => onSelectAudience(option.key)}
            data-analytics-event="lens_selected"
            data-analytics-section="welcome"
            data-analytics-value={option.key}
          >
            <span className="lens-path-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="lens-path-copy">
              <strong>{LABELS[option.key]}</strong>
              <small>{SIGNALS[option.key]}</small>
            </span>
            <span className="lens-path-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>

      <form className="lens-ai-band" onSubmit={submit}>
        <div className="lens-ai-label">
          <span>USE AI</span>
          <strong>Describe what you want to find</strong>
        </div>
        <label className="sr-only" htmlFor="portfolio-lens-ai">
          Describe what you want to find
        </label>
        <input
          id="portfolio-lens-ai"
          value={query}
          maxLength="240"
          placeholder="e.g. React architecture, CMS ownership, accessibility, AI workflows..."
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="lens-ai-submit" type="submit" disabled={!query.trim()}>
          Build my view with AI <span aria-hidden="true">→</span>
        </button>
      </form>

      <div className="lens-foot">
        <button
          className="lens-explore"
          type="button"
          onClick={onExploreNormally}
          data-analytics-event="portfolio_cta_click"
          data-analytics-section="welcome"
          data-analytics-value="explore-full"
        >
          Explore the full portfolio <span aria-hidden="true">→</span>
        </button>
        <p>
          The five lenses above use transparent preset relevance rules — not AI. If you use the AI prompt, AI only recommends existing verified portfolio content. It does not rewrite the portfolio or read your browsing history.
        </p>
      </div>
    </section>
  );
}
