import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
    >
      <div className="container mx-auto px-4 py-14 dark:text-zinc-900">
        <h2 id="projects-title" className="text-2xl md:text-3xl font-bold ">
          Case Studies
        </h2>
        <p className="text-zinc-700 dark:text-zinc-700 mt-2 max-w-2xl">
          Selected work across enterprise UI, SSR, mobile, and marketing
          systems.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
