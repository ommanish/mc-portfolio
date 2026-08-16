export const AUDIENCE_PROFILES = {
  general: {
    key: "general",
    label: "General view",
    eyebrow: "18+ years · Enterprise Web · Frontend · CMS · AI",
    headlineLines: ["I make complex web delivery", "clearer, stronger, and easier to ship."],
    description:
      "I’m Manish Chawla, a Web Experience Manager and frontend professional with 18+ years across enterprise websites, CMS and page-builder platforms, accessibility, design systems, QA, and launch workflows. I work where design, content, engineering, and business teams need to move together.",
    primaryAction: { label: "See how I work →", href: "#work" },
    sectionOrder: ["work", "services", "web-experience", "cases", "skills", "ai", "timeline", "contact"],
  },
  recruiter: {
    key: "recruiter",
    label: "Recruiter / talent",
    eyebrow: "18+ years · Web Experience · Frontend · Enterprise delivery",
    headlineLines: ["A senior web professional", "who can move between delivery and code."],
    description:
      "My background combines hands-on frontend depth with the ownership needed to move enterprise web work from requirements through CMS implementation, QA, stakeholder review, and launch.",
    primaryAction: { label: "Review my experience →", href: "#timeline" },
    sectionOrder: ["timeline", "skills", "web-experience", "cases", "work", "services", "ai", "contact"],
  },
  engineering: {
    key: "engineering",
    label: "Engineering leader",
    eyebrow: "Frontend architecture · React · Accessibility · Performance",
    headlineLines: ["Frontend depth with", "enterprise delivery discipline."],
    description:
      "My technical work is grounded in real delivery: component-based UI, responsive implementation, accessibility, maintainability, QA, and the practical tradeoffs that come with large web platforms.",
    primaryAction: { label: "See technical work →", href: "#cases" },
    sectionOrder: ["cases", "skills", "work", "web-experience", "services", "ai", "timeline", "contact"],
  },
  marketing: {
    key: "marketing",
    label: "Marketing / web leader",
    eyebrow: "Web Experience · CMS · WebOps · Launch readiness",
    headlineLines: ["From brief to launch,", "I make enterprise web delivery easier to run."],
    description:
      "I connect content, design, CMS, frontend implementation, accessibility, QA, and stakeholder review so enterprise web teams can move quickly without losing control of quality.",
    primaryAction: { label: "Explore web delivery →", href: "#web-experience" },
    sectionOrder: ["web-experience", "work", "services", "cases", "timeline", "skills", "ai", "contact"],
  },
  client: {
    key: "client",
    label: "Client / consulting",
    eyebrow: "Web delivery · UI modernization · CMS · Accessibility",
    headlineLines: ["Bring me the web problem.", "I’ll help make the path to launch clear."],
    description:
      "I help turn unclear or fragmented web work into a practical delivery path across UI implementation, CMS and page builders, accessibility, QA, launch readiness, and AI-assisted workflows.",
    primaryAction: { label: "How I can help →", href: "#services" },
    sectionOrder: ["services", "work", "cases", "web-experience", "skills", "ai", "timeline", "contact"],
  },
  ai: {
    key: "ai",
    label: "AI / automation",
    eyebrow: "AI-assisted web workflows · UI systems · Automation",
    headlineLines: ["Practical AI for web teams,", "grounded in real delivery."],
    description:
      "My AI focus is practical: use it to reduce repetitive work, improve content and UI workflows, strengthen developer handoff, and personalize experiences while keeping human review in control of facts, quality, accessibility, and security.",
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
