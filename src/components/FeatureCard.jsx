import Reveal from "./Reveal";

export default function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <Reveal as="article" className="feature-card" delay={delay}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Reveal>
  );
}
