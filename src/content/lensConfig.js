export const CANONICAL_SECTION_ORDER = [
  "work",
  "services",
  "web-experience",
  "cases",
  "skills",
  "ai",
  "timeline",
  "contact",
];

export const SECTION_LABELS = {
  work: "Work",
  services: "How I Can Help",
  "web-experience": "Web Experience",
  cases: "Case Studies",
  skills: "Skills",
  ai: "AI",
  timeline: "Experience",
  contact: "Contact",
};

export const PRESET_RECOMMENDATIONS = {
  general: ["work", "web-experience", "cases", "skills"],
  recruiter: ["timeline", "work", "skills", "web-experience"],
  engineering: ["work", "cases", "skills", "timeline"],
  marketing: ["work", "web-experience", "services", "cases"],
  client: ["services", "work", "cases", "web-experience"],
  ai: ["ai", "work", "skills", "cases"],
};

export const SERVICE_DEFAULT_BY_LENS = {
  general: 0,
  recruiter: 0,
  engineering: 2,
  marketing: 1,
  client: 0,
  ai: 3,
};

export function getRecommendedSections(profile, source) {
  if (source === "ai" || source === "search") {
    const ordered = Array.isArray(profile?.sectionOrder) ? profile.sectionOrder : [];
    const valid = ordered.filter((key) => CANONICAL_SECTION_ORDER.includes(key));
    const unique = [...new Set(valid)];
    if (unique.length) return unique.slice(0, 4);
  }

  return PRESET_RECOMMENDATIONS[profile?.key] || PRESET_RECOMMENDATIONS.general;
}
