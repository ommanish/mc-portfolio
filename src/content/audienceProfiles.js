export const AUDIENCE_PROFILES = {
  general: {
    key: "general",
    label: "General view",
    eyebrow: "Web Experience · AI · Frontend leadership",
    headlineLines: ["Web + AI leader helping teams", "build better digital experiences."],
    description:
      "I’m Manish Chawla, a web experience and frontend leader with 17+ years of experience across enterprise websites, CMS platforms, accessibility, launch workflows, modern UI systems, and practical AI-assisted delivery.",
    primaryAction: { label: "Explore my work →", href: "#work" },
    sectionOrder: ["work", "services", "web-experience", "cases", "skills", "ai", "timeline", "contact"],
  },
  recruiter: {
    key: "recruiter",
    label: "Recruiter / talent",
    eyebrow: "17+ years · Web Experience · Frontend · Enterprise delivery",
    headlineLines: ["A senior web professional", "who can bridge delivery and engineering."],
    description:
      "Explore Manish’s experience, core skills, enterprise delivery background, accessibility focus, and the roles where his web production and frontend depth are strongest.",
    primaryAction: { label: "Review experience →", href: "#timeline" },
    sectionOrder: ["timeline", "skills", "web-experience", "cases", "work", "services", "ai", "contact"],
  },
  engineering: {
    key: "engineering",
    label: "Engineering leader",
    eyebrow: "Frontend architecture · React · Accessibility · Performance",
    headlineLines: ["Frontend depth with", "enterprise delivery discipline."],
    description:
      "See the technical side of Manish’s work: component-based UI, responsive implementation, accessibility, maintainability, QA, and collaboration across complex web platforms.",
    primaryAction: { label: "See technical work →", href: "#cases" },
    sectionOrder: ["cases", "skills", "work", "web-experience", "services", "ai", "timeline", "contact"],
  },
  marketing: {
    key: "marketing",
    label: "Marketing / web leader",
    eyebrow: "Web Experience · CMS · WebOps · Launch readiness",
    headlineLines: ["Turning content and design", "into launch-ready web experiences."],
    description:
      "See how Manish connects content, design, CMS, QA, accessibility, stakeholder feedback, and frontend implementation to help enterprise web teams ship confidently.",
    primaryAction: { label: "Explore web delivery →", href: "#web-experience" },
    sectionOrder: ["web-experience", "work", "services", "cases", "timeline", "skills", "ai", "contact"],
  },
  client: {
    key: "client",
    label: "Client / consulting",
    eyebrow: "Web delivery · UI modernization · CMS · Accessibility",
    headlineLines: ["Practical web expertise", "focused on useful outcomes."],
    description:
      "Explore the problems Manish can help solve across web experience, UI implementation, CMS/page-builder delivery, accessibility, QA, and AI-assisted workflows.",
    primaryAction: { label: "How I can help →", href: "#services" },
    sectionOrder: ["services", "work", "cases", "web-experience", "skills", "ai", "timeline", "contact"],
  },
  ai: {
    key: "ai",
    label: "AI / automation",
    eyebrow: "AI-assisted web workflows · UI systems · Automation",
    headlineLines: ["Exploring practical AI", "for better digital delivery."],
    description:
      "See how Manish is applying AI thinking to web production, UI generation, content workflows, reusable components, and developer-ready handoff without losing human review and quality control.",
    primaryAction: { label: "Explore AI direction →", href: "#ai" },
    sectionOrder: ["ai", "services", "cases", "skills", "work", "web-experience", "timeline", "contact"],
  },
};

export const AUDIENCE_OPTIONS = [
  AUDIENCE_PROFILES.recruiter,
  AUDIENCE_PROFILES.engineering,
  AUDIENCE_PROFILES.marketing,
  AUDIENCE_PROFILES.client,
  AUDIENCE_PROFILES.ai,
];
