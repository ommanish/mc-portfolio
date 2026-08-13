import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const EXPERIENCE = [
  {
    time: "Jul 2026 — Present",
    title: "Salesforce — Web Experience Manager, Data 360",
    description:
      "Web experience delivery across enterprise pages, CMS/page-builder workflows, frontend implementation, responsive design, accessibility, QA, and launch readiness.",
  },
  {
    time: "Nov 2024 — Jul 2026",
    title: "Quantious — UI/UX Lead, Salesforce Data Cloud Page Builder",
    description:
      "Led hands-on UI and web delivery for enterprise page-builder experiences, translating design and content requirements into responsive, production-ready pages.",
  },
  {
    time: "2024 — 2026",
    title: "TechDemocracy — Senior UI Frontend Developer & Designer",
    description:
      "Built and designed enterprise application experiences with a focus on frontend usability, maintainability, responsive UI, and collaboration across product teams.",
  },
  {
    time: "Sep 2023 — Dec 2023",
    title: "Pride Global — Senior Manager, Tech & UI",
    description:
      "Supported technology and UI delivery with senior-level frontend, design, and team collaboration responsibilities.",
  },
  {
    time: "Aug 2017 — Sep 2023",
    title: "Genpact — Principal Consultant / Senior Developer",
    description:
      "Delivered enterprise digital experiences and frontend solutions, combining technical implementation, stakeholder collaboration, mentoring, and delivery discipline.",
  },
  {
    time: "Aug 2008 — Aug 2017",
    title: "GE Corporate — UI & Frontend Development",
    description:
      "Built a long-term foundation in enterprise UI, frontend development, digital experience, reusable interfaces, and large-organization delivery practices.",
  },
  {
    time: "Feb 2007 — Aug 2008",
    title: "Classic Informatics — Web & UI Development",
    description:
      "Early-career web and interface development work that established the frontend and digital design foundation for later enterprise roles.",
  },
];

export default function Timeline() {
  return (
    <section id="timeline">
      <SectionHeader
        kicker="Experience"
        title="17+ years across web experience, frontend, and enterprise delivery."
        copy="A career spanning hands-on frontend development, UI leadership, CMS/page-builder delivery, and web experience management."
      />
      <div className="timeline-list">
        {EXPERIENCE.map((item) => (
          <Reveal as="article" className="timeline-item" key={`${item.time}-${item.title}`}>
            <div className="timeline-time">{item.time}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
