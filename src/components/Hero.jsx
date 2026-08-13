import { portfolioContent } from "../content/portfolioContent";
import IntelligenceGraphic from "./IntelligenceGraphic";
import PortfolioViewControl from "./PortfolioViewControl";

export default function Hero({ audienceProfile, source, onAdjust }) {
  const { site } = portfolioContent;
  return (
    <section className="hero executive-hero" aria-label="Hero">
      <div className="hero-content">
        <PortfolioViewControl profile={audienceProfile} source={source} onAdjust={onAdjust} />
        <div className="eyebrow"><span className="pulse" />{audienceProfile.eyebrow}</div>
        <h1
          className="hero-title"
          aria-label={audienceProfile.headlineLines.join(" ")}
        >
          {audienceProfile.headlineLines.map((line, index) => (
            <span className={index === audienceProfile.headlineLines.length - 1 ? "headline-line gradient-text" : "headline-line"} key={line}>{line}</span>
          ))}
        </h1>
        <p className="hero-copy">{audienceProfile.description}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={audienceProfile.primaryAction.href}>{audienceProfile.primaryAction.label}</a>
          <a className="btn btn-ghost" href={site.resumeUrl}>View resume</a>
        </div>
        <div className="hero-proof" aria-label="Career highlights">
          <span><strong>17+</strong> years web & digital experience</span>
          <span><strong>WCAG</strong> accessibility-first implementation</span>
          <span><strong>WebOps</strong> CMS, QA & launch workflows</span>
        </div>
      </div>

      <aside className="hero-intelligence" aria-label="Experience intelligence map">
        <div className="micro-label">Experience graph · {audienceProfile.label}</div>
        <IntelligenceGraphic audienceKey={audienceProfile.key} />
        <p>One career connecting implementation, web operations, quality, and practical AI.</p>
      </aside>
    </section>
  );
}
