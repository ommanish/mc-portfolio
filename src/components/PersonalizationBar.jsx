import { useState } from "react";
import { AUDIENCE_OPTIONS } from "../content/audienceProfiles";

export default function PersonalizationBar({
  profile,
  onSelectAudience,
  onSearchIntent,
  onReset,
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearchIntent(trimmed);
  };

  return (
    <section className="personalization" aria-labelledby="personalization-title">
      <div className="personalization-copy">
        <div className="section-kicker">Adaptive portfolio</div>
        <h2 id="personalization-title">What would you like to explore?</h2>
        <p>
          Choose a view or describe what matters to you. Your selection stays in
          this browser; search text is used only for this page session.
        </p>
      </div>

      <div className="personalization-controls">
        <div className="audience-options" aria-label="Choose a portfolio view">
          {AUDIENCE_OPTIONS.map((option) => (
            <button
              className="audience-chip"
              type="button"
              key={option.key}
              aria-pressed={profile.key === option.key}
              onClick={() => onSelectAudience(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form className="intent-search" onSubmit={handleSubmit}>
          <label htmlFor="portfolio-intent">What are you looking for?</label>
          <div className="intent-search-row">
            <input
              id="portfolio-intent"
              value={query}
              maxLength={240}
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. React leadership, CMS, AI automation"
            />
            <button className="btn btn-primary" type="submit">
              Personalize
            </button>
          </div>
        </form>

        <button className="reset-personalization" type="button" onClick={onReset}>
          Reset personalized view
        </button>
      </div>
    </section>
  );
}
