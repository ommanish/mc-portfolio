import { portfolioContent } from "../content/portfolioContent";

export default function Hero() {
  const { hero, site } = portfolioContent;

  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-content">
        <div className="eyebrow">
          <span className="pulse" />
          {hero.eyebrow}
        </div>

        <h1 className="hero-title">
          {hero.headlineLines.map((line) => (
            <span
              className={
                line.gradient ? "headline-line gradient-text" : "headline-line"
              }
              key={line.text}
            >
              {line.text}
            </span>
          ))}
        </h1>

        <p className="hero-copy">{hero.description}</p>

        <div className="hero-actions">
          {hero.actions.map((action) => (
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
