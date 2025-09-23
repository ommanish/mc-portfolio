export default function ProjectCard({
  title,
  role,
  summary,
  impact = [],
  stack = [],
}) {
  return (
    <article
      className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6
                 shadow-sm hover:shadow-md transition"
    >
      <h3 className="text-xl font-semibold  text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {role && (
        <p className="text-sm mt-1 text-zinc-600 dark:text-zinc-400">{role}</p>
      )}
      {summary && (
        <p className="mt-3 text-zinc-700 dark:text-zinc-300">{summary}</p>
      )}

      {impact.length > 0 && (
        <ul className="mt-3 list-disc ml-5 space-y-1 text-zinc-700 dark:text-zinc-300">
          {impact.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      )}

      {stack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-1 rounded-full border border-zinc-300 dark:border-zinc-700
                         bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
