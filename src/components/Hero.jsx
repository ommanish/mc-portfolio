import { portfolioContent } from "../content/portfolioContent";

export default function Hero({ audienceProfile }) {
  const { hero, site } = portfolioContent;
  const adaptive = audienceProfile || {};
  const headlineLines = adaptive.headlineLines
    ? adaptive.headlineLines.map((text, index) => ({ text, gradient: index === 1 }))
    : hero.headlineLines;
  const actions = adaptive.primaryAction
    ? [
        { ...adaptive.primaryAction, variant: "primary" },
        ...hero.actions.filter((action) => action.variant !== "primary"),
      ]
    : hero.actions;

  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-content">
        <div className="eyebrow">
          <span className="pulse" />
          {adaptive.eyebrow || hero.eyebrow}
        </div>

        <h1 className="hero-title">
          {headlineLines.map((line) => (
            <span
              className={line.gradient ? "headline-line gradient-text" : "headline-line"}
              key={line.text}
            >
              {line.text}
            </span>
          ))}
        </h1>

        <p className="hero-copy">{adaptive.description || hero.description}</p>

        <div className="hero-actions">
          {actions.map((action) => (
            <a
              className={`btn ${action.variant === "primary" ? "btn-primary" : "btn-ghost"}`}
              href={action.href}
              key={action.label}
            >
              {action.label}
            </a>
          ))}
        </div>

        <div className="hero-meta" aria-label="Career highlights">
          {hero.stats.map((stat) => (
            <div className="stat" key={stat.value}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="orb" />
        <article className="profile-card">
          <div className="avatar">
            <span className="avatar-initials">{site.initials}</span>
            {hero.profileCard.chips.map((chip, index) => (
              <span className={`floating-chip chip-${index + 1}`} key={chip}>
                {chip}
              </span>
            ))}
          </div>

          <div className="card-title">
            <div>
              <h2>{hero.profileCard.title}</h2>
              <p>{hero.profileCard.description}</p>
            </div>
            <span className="location">{site.timezone}</span>
          </div>

          <div className="stack">
            {hero.profileCard.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
