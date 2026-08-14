import SectionHeader from "./SectionHeader";
import CareerCapabilityMap from "./CareerCapabilityMap";

const EXPERIENCE = [
  ["Jul 2026 — Present","Salesforce — Web Experience Manager, Data 360","Focused on Data 360 web experience delivery across enterprise pages, CMS/page-builder workflows, frontend implementation, responsive design, accessibility, QA, and launch readiness."],
  ["Mar 2025 — Jul 2026","TechDemocracy / Quantious — UI/UX Lead, Salesforce Data Cloud Page Builder","Led hands-on UI/UX and web delivery for Salesforce Data Cloud page-builder experiences, translating design and content requirements into responsive, production-ready pages."],
  ["Feb 2024 — Jul 2026","TechDemocracy — Senior UI Frontend Developer & Designer","Built and designed enterprise application experiences with a focus on frontend usability, maintainability, responsive UI, and collaboration across product teams."],
  ["Sep 2023 — Dec 2023","Pride Global — Senior Manager, Tech & UI","Supported technology and UI delivery with senior-level frontend, design, and team collaboration responsibilities."],
  ["Aug 2017 — Sep 2023","Genpact — Principal Consultant / Senior Developer","Delivered enterprise digital experiences and frontend solutions, combining technical implementation, stakeholder collaboration, mentoring, and delivery discipline."],
  ["Aug 2008 — Aug 2017","GE Corporate — UI & Frontend Development","Built a long-term foundation in enterprise UI, frontend development, digital experience, reusable interfaces, and large-organization delivery practices."],
  ["Feb 2007 — Aug 2008","Classic Informatics — Web & UI Development","Early-career web and interface development work that established the frontend and digital design foundation for later enterprise roles."],
];

export default function Timeline({ embedded = false }) {
  return (
    <section id={embedded ? undefined : "timeline"} className="editorial-section timeline-executive">
      <SectionHeader
        kicker="Experience"
        title="17+ years of building, improving, and shipping digital experiences."
        copy="My career has moved from hands-on UI development to broader ownership of enterprise web delivery — without losing the technical foundation."
        accentType="circle"
        accentLabel="built over time"
      />

      <CareerCapabilityMap />

      <div className="timeline-layout">
        <aside className="timeline-anchor">
          <strong>17+</strong>
          <span>years connecting technology, design, content, and delivery.</span>
        </aside>

        <div className="executive-timeline-list">
          {EXPERIENCE.map(([time, title, description]) => (
            <article className="executive-timeline-item" key={`${time}-${title}`}>
              <div className="executive-timeline-time">{time}</div>
              <div className="executive-timeline-content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
