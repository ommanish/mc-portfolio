import { portfolioContent } from "../content/portfolioContent";
import FeatureCard from "./FeatureCard";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function WebExperience() {
  const { webExperience } = portfolioContent;

  return (
    <section id="web-experience">
      <SectionHeader
        kicker={webExperience.kicker}
        title={webExperience.title}
        copy={webExperience.copy}
      />

      <div className="grid grid-3">
        {webExperience.cards.map((item, index) => (
          <FeatureCard key={item.title} {...item} delay={index * 140} />
        ))}
      </div>

      <div className="grid grid-2 spacing-top">
        <Reveal as="article" className="case-card" delay={120}>
          <h3>{webExperience.strengths.title}</h3>
          <div className="case-meta">
            {webExperience.strengths.labels.map((label) => (
              <span className="mini-label" key={label}>
                {label}
              </span>
            ))}
          </div>
          <ul className="impact-list">
            {webExperience.strengths.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="article" className="case-card" delay={220}>
          <h3>{webExperience.roles.title}</h3>
          <p>{webExperience.roles.description}</p>
          <div className="skill-pills">
            {webExperience.roles.items.map((role) => (
              <span className="pill" key={role}>
                {role}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
