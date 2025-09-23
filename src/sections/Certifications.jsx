import CertificationCard from "../components/CertificationCard";
import { certifications } from "../data/certifications";

export default function Certifications() {
  // Group by type (Certification / Badge / Training)
  const groups = certifications.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {});

  const order = ["Certification", "Badge", "Training"]; // display order

  return (
    <section
      id="certifications"
      aria-labelledby="certs-title"
      className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div className="container mx-auto px-4 py-14">
        <h2 id="certs-title" className="text-2xl md:text-3xl font-bold">
          Certifications & Badges
        </h2>
        <p className="mt-2 text-zinc-700 dark:text-zinc-300 max-w-2xl">
          Selected professional certifications, badges, and formal training.
        </p>

        {order.map((key) => {
          const items = groups[key] || [];
          if (!items.length) return null;
          return (
            <div key={key} className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {key}
              </h3>
              <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <CertificationCard key={c.title + c.issuer} {...c} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
