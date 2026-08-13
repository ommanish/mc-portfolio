const LABELS = {
  general: "General",
  recruiter: "Recruiter",
  engineering: "Engineering",
  marketing: "Web / Marketing",
  client: "Consulting",
  ai: "AI / Automation",
};

export default function PortfolioViewControl({ profile, source, onAdjust }) {
  const base = LABELS[profile.key] || profile.label;
  const label = source === "ai" ? "Personalized with AI" : `${base} view`;
  return (
    <button className="portfolio-view-control" type="button" onClick={onAdjust}>
      <span className="view-dot" aria-hidden="true" />
      <span>{label}</span>
      <span className="view-action">{source === "ai" ? "Adjust" : "Change"}</span>
    </button>
  );
}
