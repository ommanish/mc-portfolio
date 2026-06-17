import Reveal from "./Reveal";

export default function CaseCard({ title, description, labels, impact, delay = 0 }) {
  return (
    <Reveal as="article" className="case-card" delay={delay}>
      <h3>{title}</h3>
      <p>{description}</p>

      <div className="case-meta">
        {labels.map((label) => (
          <span className="mini-label" key={label}>
            {label}
          </span>
        ))}
      </div>

      <ul className="impact-list">
        {impact.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Reveal>
  );
}
