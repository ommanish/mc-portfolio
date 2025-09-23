function Pill({ children }) {
  return (
    <span
      className="text-xs px-2 py-1 rounded-full border border-zinc-300 dark:border-zinc-700
                     bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
    >
      {children}
    </span>
  );
}

export default function Skills() {
  const groups = [
    {
      title: "Frontend",
      items: [
        "React",
        "React Native",
        "Vue",
        "Ember",
        "JavaScript",
        "TypeScript (working)",
        "HTML",
        "CSS/Tailwind",
      ],
    },
    {
      title: "UX & Tools",
      items: [
        "Figma",
        "Wireframes",
        "Prototypes",
        "Usability Testing",
        "Design Systems",
      ],
    },
    {
      title: "Cloud & DevOps",
      items: ["AWS", "Vercel/Netlify", "GitHub Actions", "CI/CD"],
    },
    {
      title: "Data & CMS",
      items: ["Salesforce", "Contentful", "WordPress", "Epsilon Harmony"],
    },
    {
      title: "PM & Process",
      items: [
        "PMP",
        "Agile/Scrum/Kanban",
        "Jira",
        "A/B Testing",
        "Accessibility Audits",
      ],
    },
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="container mx-auto px-4 py-14"
    >
      <h2
        id="skills-title"
        className="text-2xl md:text-3xl font-bold dark:text-zinc-900"
      >
        Skills
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <div
            key={g.title}
            className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {g.title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((i) => (
                <Pill key={i}>{i}</Pill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
