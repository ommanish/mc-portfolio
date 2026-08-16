import { portfolioContent } from "../content/portfolioContent";
import { SECTION_LABELS } from "../content/lensConfig";
import HandwrittenAccent from "./HandwrittenAccent";

const LENS_META = {
  general: { number: "00", label: "Full Portfolio" },
  recruiter: { number: "01", label: "Hiring / Recruiting" },
  engineering: { number: "02", label: "Engineering / Technical" },
  marketing: { number: "03", label: "Web / Marketing" },
  client: { number: "04", label: "Consulting / Project" },
  ai: { number: "05", label: "AI / Automation" },
};

function LensStatus({ profile, source, recommendedSections, onChangeLens }) {
  const meta = LENS_META[profile.key] || LENS_META.general;

  let mode = `LENS ${meta.number}`;
  let trust = "Preset relevance rules highlight useful stops. Portfolio content and order stay unchanged.";

  if (source === "ai") {
    mode = "AI-CURATED LENS";
    trust = "AI recommended these stops from verified portfolio content. Nothing on this page was rewritten.";
  } else if (source === "search") {
    mode = "INTENT LENS";
    trust = "Cloud AI was not used for the final view. Local relevance rules matched your intent to existing content.";
  } else if (source === "explore") {
    mode = "FULL PORTFOLIO";
    trust = "You are viewing the canonical portfolio without personalization.";
  }

  return (
    <div className="hero-lens-status" aria-label={`${mode}: ${meta.label}`}>
      <div className="hero-lens-rule" aria-hidden="true" />

      <div className="hero-lens-meta">
        <span>{mode}</span>
        <strong>{meta.label}</strong>
        <small>{trust}</small>
      </div>

      <button
        className="hero-change-lens"
        type="button"
        onClick={onChangeLens}
        data-analytics-event="change_lens"
        data-analytics-section="hero"
      >
        Change lens <span aria-hidden="true">↗</span>
      </button>

      <nav className="hero-recommended-path" aria-label="Recommended portfolio path">
        <span>Recommended path</span>
        <div>
          {recommendedSections.map((key, index) => (
            <a href={`#${key}`} key={key}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              {SECTION_LABELS[key]}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function Hero({ audienceProfile, source, recommendedSections, onChangeLens }) {
  const { site, hero } = portfolioContent;

  return (
    <section className="hero executive-hero portfolio-answer" aria-label="Hero">
      <div className="hero-content">
        <LensStatus
          profile={audienceProfile}
          source={source}
          recommendedSections={recommendedSections}
          onChangeLens={onChangeLens}
        />

        <div className="hero-coordinate-label">
          <span>MC</span>
          <span>{hero.eyebrow}</span>
        </div>

        <h1
          className="hero-title"
          aria-label={hero.headlineLines.map((line) => line.text).join(" ")}
        >
          {hero.headlineLines.map((line) => (
            <span
              className={line.gradient ? "headline-line gradient-text" : "headline-line"}
              key={line.text}
            >
              {line.text}
            </span>
          ))}
        </h1>

        <div className="hero-handwritten-layer" aria-hidden="true">
          <HandwrittenAccent
            type="underline"
            label="built to ship"
            className="hero-handwritten-accent hero-sketch-underline"
            notePosition="below"
            mobileType="underline"
            mobileNotePosition="inline"
          />
        </div>

        <p className="hero-copy">{hero.description}</p>

        <div className="hero-actions">
          <a
            className="btn btn-primary"
            href={hero.actions[0].href}
            data-analytics-event="portfolio_cta_click"
            data-analytics-section="hero"
            data-analytics-value="hero-primary"
          >
            {hero.actions[0].label}
          </a>
          <a
            className="btn btn-ghost"
            href={site.resumeUrl}
            data-analytics-event="resume_click"
            data-analytics-section="hero"
          >
            View resume
          </a>
        </div>
      </div>

      <aside className="career-coordinate" aria-label="Career coordinates">
        <div className="coordinate-cross" aria-hidden="true" />
        <div className="coordinate-center">
          <strong>18+</strong>
          <span>YEARS</span>
        </div>
        <div className="coordinate-point point-web"><span>WEB</span><small>Enterprise experience</small></div>
        <div className="coordinate-point point-ui"><span>UI</span><small>Frontend systems</small></div>
        <div className="coordinate-point point-cms"><span>CMS</span><small>Delivery & WebOps</small></div>
        <div className="coordinate-point point-ai"><span>AI</span><small>Practical workflows</small></div>
      </aside>
    </section>
  );
}
