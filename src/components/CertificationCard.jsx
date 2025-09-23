export default function CertificationCard({ title, issuer, year, badge, url }) {
  const initials = (issuer || title || "MC")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <article
      className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5
                 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-4">
        {/* Badge image or fallback initials */}
        {badge ? (
          <img
            src={badge}
            alt=""
            aria-hidden="true"
            className="h-12 w-12 rounded-xl object-contain bg-zinc-50 dark:bg-zinc-800 p-2 border border-zinc-200 dark:border-zinc-700"
          />
        ) : (
          <div
            className="h-12 w-12 rounded-xl grid place-items-center text-sm font-semibold
                       bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 text-white"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
            {issuer}
          </p>
          {year && (
            <p className="text-xs text-zinc-500 dark:text-zinc-500">{year}</p>
          )}
        </div>
      </div>

      {url ? (
        <div className="mt-4">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium
                       bg-brand-600 text-white hover:bg-brand-500
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            Verify
          </a>
        </div>
      ) : null}
    </article>
  );
}
