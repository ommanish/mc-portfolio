import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const SERVICES = [
  {
    title: "Web experience modernization",
    copy: "Improve enterprise pages and journeys with responsive implementation, reusable UI patterns, accessibility, and practical design-to-production delivery.",
  },
  {
    title: "CMS & page-builder delivery",
    copy: "Turn approved content and design into launch-ready experiences across CMS and page-builder workflows, with structured QA and stakeholder review.",
  },
  {
    title: "Frontend UI & quality",
    copy: "Strengthen component-based interfaces with HTML, CSS, JavaScript, React, responsive behavior, accessibility, maintainability, and cross-browser QA.",
  },
  {
    title: "AI-assisted web workflows",
    copy: "Explore practical ways AI can improve content, UI, handoff, and delivery workflows while keeping human review, security, and factual accuracy in control.",
  },
];

export default function HowICanHelp() {
  return (
    <section id="services">
      <SectionHeader
        kicker="How I can help"
        title="Practical support for modern web teams."
        copy="For consulting, collaboration, or focused project support, these are the areas where I can contribute most directly."
      />

      <div className="service-grid">
        {SERVICES.map((service) => (
          <Reveal as="article" className="service-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
