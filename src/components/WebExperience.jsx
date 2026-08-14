import SectionHeader from "./SectionHeader";

const STEPS = [
  ["Strategy", "Turn the request into a clear scope: what is changing, why it matters, who needs to review it, and what launch-ready means."],
  ["Design", "Review design intent and platform constraints early so implementation decisions do not become late-stage surprises."],
  ["Build", "Implement reusable, responsive sections and content with the CMS, page-builder, and frontend patterns that the platform can support well."],
  ["QA", "Catch content, responsive, accessibility, browser, and visual issues while there is still time to fix them cleanly."],
  ["Launch", "Keep previews, stakeholder approvals, final checks, and publishing readiness moving toward a controlled release."],
  ["Optimize", "Use post-launch feedback and real delivery lessons to improve the next update, component, or workflow."],
];

export default function WebExperience({ embedded = false }) {
  return (
    <section id={embedded ? undefined : "web-experience"} className="editorial-section">
      <SectionHeader kicker="Web Experience / Web Producer"
        title="A clear path from request to production."
        copy="Good web delivery is a chain of decisions, not a handoff. I help connect requirements, design, CMS constraints, frontend quality, review, and launch." />
      <div className="experience-flow">
        {STEPS.map(([title, copy], index) => (
          <article className="experience-step" key={title}>
            <span className="experience-node">{index + 1}</span>
            <div><h3>{title}</h3><p>{copy}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
