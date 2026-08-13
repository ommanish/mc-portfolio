import { portfolioContent } from "../content/portfolioContent";

const LENS_META = {
  general: { number: "00", label: "Full Portfolio" },
  recruiter: { number: "01", label: "Hiring / Recruiting" },
  engineering: { number: "02", label: "Engineering / Technical" },
  marketing: { number: "03", label: "Web / Marketing" },
  client: { number: "04", label: "Consulting / Project" },
  ai: { number: "05", label: "AI / Automation" },
};

function LensStatus({ profile, source, onChangeLens }) {
  const meta = LENS_META[profile.key] || LENS_META.general;
  let mode = `LENS ${meta.number}`;
  if (source === "ai") mode = "AI-CURATED LENS";
  if (source === "search") mode = "INTENT LENS";

  return (
    <div className="hero-lens-status" aria-label={`${mode}: ${meta.label}`}>
      <div className="hero-lens-rule" aria-hidden="true" />
      <div className="hero-lens-meta">
        <span>{mode}</span>
        <strong>{meta.label}</strong>
      </div>
      <div className="hero-lens-topics" aria-hidden="true">
        <span>{profile.eyebrow}</span>
      </div>
      <button className="hero-change-lens" type="button" onClick={onChangeLens}>
        Change lens <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

export default function Hero({ audienceProfile, source, onChangeLens }) {
  const { site } = portfolioContent;

  return (
    <section className="hero executive-hero portfolio-answer" aria-label="Hero">
      <div className="hero-content">
        <LensStatus profile={audienceProfile} source={source} onChangeLens={onChangeLens} />

        <div className="hero-coordinate-label">
          <span>MC</span>
          <span>{audienceProfile.eyebrow}</span>
        </div>

        <h1 className="hero-title" aria-label={audienceProfile.headlineLines.join(" ")}>
          {audienceProfile.headlineLines.map((line, index) => (
            <span
              className={
                index === audienceProfile.headlineLines.length - 1
                  ? "headline-line gradient-text"
                  : "headline-line"
              }
              key={line}
            >
              {line}
            </span>
          ))}
        </h1>

        <p className="hero-copy">{audienceProfile.description}</p>

        <div className="hero-actions">
          <a className="btn btn-primary" href={audienceProfile.primaryAction.href}>
            {audienceProfile.primaryAction.label}
          </a>
          <a className="btn btn-ghost" href={site.resumeUrl}>View resume</a>
        </div>
      </div>

      <aside className="career-coordinate" aria-label="Career coordinates">
        <div className="coordinate-cross" aria-hidden="true" />
        <div className="coordinate-center"><strong>17+</strong><span>YEARS</span></div>
        <div className="coordinate-point point-web"><span>WEB</span><small>Enterprise experience</small></div>
        <div className="coordinate-point point-ui"><span>UI</span><small>Frontend systems</small></div>
        <div className="coordinate-point point-cms"><span>CMS</span><small>Delivery & WebOps</small></div>
        <div className="coordinate-point point-ai"><span>AI</span><small>Practical workflows</small></div>
      </aside>
    </section>
  );
}
