const STAGES = [
  {
    number: "01",
    phase: "Foundation",
    title: "UI & Frontend",
    copy: "Hands-on interface work remains the technical base: responsive UI, reusable patterns, accessibility, and maintainable frontend quality.",
    skills: ["Responsive UI", "Accessibility", "Frontend quality"],
  },
  {
    number: "02",
    phase: "Scale",
    title: "Enterprise Delivery",
    copy: "The work expanded into larger organizations where stakeholder alignment, QA discipline, mentoring, and launch readiness matter as much as implementation.",
    skills: ["Stakeholders", "QA & release", "Team collaboration"],
  },
  {
    number: "03",
    phase: "Experience",
    title: "CMS & Web Experience",
    copy: "Frontend depth now connects directly to content systems, page builders, reusable sections, governance, and production web delivery.",
    skills: ["CMS / page builders", "Reusable sections", "Web operations"],
  },
  {
    number: "04",
    phase: "Extend",
    title: "AI-assisted Delivery",
    copy: "Practical AI extends the workflow through structured prompting, constrained outputs, human validation, and faster exploration without replacing judgment.",
    skills: ["Structured prompting", "Constrained output", "Human validation"],
  },
];

export default function CareerCapabilityMap() {
  return (
    <figure className="career-capability-map" aria-label="Career capability evolution infographic">
      <div className="career-capability-summary">
        <span className="micro-label">Capability evolution</span>
        <div className="career-capability-range" aria-label="2007 to now">
          <strong>2007</strong>
          <span aria-hidden="true">→</span>
          <b>NOW</b>
        </div>
        <p>
          The progression is additive, not a replacement: each stage builds on the technical and delivery foundation that came before it.
        </p>
      </div>

      <div className="career-capability-track">
        {STAGES.map((stage, index) => (
          <article
            className="career-capability-stage"
            data-testid="career-capability-stage"
            key={stage.title}
            style={{ "--capability-index": index }}
          >
            <div className="career-capability-node" aria-hidden="true">
              <span>{stage.number}</span>
            </div>

            <div className="career-capability-content">
              <span className="micro-label">{stage.phase}</span>
              <h3>{stage.title}</h3>
              <p>{stage.copy}</p>
              <div className="career-capability-skills" aria-label={`${stage.title} focus areas`}>
                {stage.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>

      <figcaption>
        The detailed roles below provide the career timeline; this map shows how the capability mix has broadened across that experience.
      </figcaption>
    </figure>
  );
}
