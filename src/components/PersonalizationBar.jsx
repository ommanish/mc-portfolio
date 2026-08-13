import { useState } from "react";
import { AUDIENCE_OPTIONS } from "../content/audienceProfiles";

export default function PersonalizationBar({ profile, source, onSelectAudience, onSearchIntent, onReset }) {
  const [query, setQuery] = useState("");
  const handleSubmit = async (event) => { event.preventDefault(); const trimmed = query.trim(); if (trimmed) await onSearchIntent(trimmed); };
  return <section className="personalization" aria-labelledby="personalization-title">
    <div className="personalization-copy">
      <div className="section-kicker">AI-adaptive portfolio</div>
      <h2 id="personalization-title">What would you like to explore?</h2>
      <p>This portfolio uses basic browser context and your on-site activity to prioritize relevant content. It does not read your browsing history or identify you.</p>
      {source === 'ai' && <p className="personalization-status" role="status">Personalized with AI based on this session. You can change or reset the view anytime.</p>}
    </div>
    <div className="personalization-controls">
      <div className="audience-options" aria-label="Choose a portfolio view">{AUDIENCE_OPTIONS.map((option) => <button className="audience-chip" type="button" key={option.key} aria-pressed={profile.key === option.key} onClick={() => onSelectAudience(option.key)}>{option.label}</button>)}</div>
      <form className="intent-search" onSubmit={handleSubmit}><label htmlFor="portfolio-intent">What are you looking for?</label><div className="intent-search-row"><input id="portfolio-intent" value={query} maxLength={240} autoComplete="off" onChange={(e) => setQuery(e.target.value)} placeholder="e.g. React leadership, CMS, AI automation" /><button className="btn btn-primary" type="submit">Personalize</button></div></form>
      <button className="reset-personalization" type="button" onClick={onReset}>Reset personalized view</button>
    </div>
  </section>;
}
