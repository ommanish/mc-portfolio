import SectionHeader from "./SectionHeader";
import { caseStudyProjects } from "../content/caseStudyProjects";

export default function CaseStudies({ embedded = false }) {
  return (
    <section
      id={embedded ? undefined : "cases"}
      className="editorial-section case-study-index"
    >
      <SectionHeader
        kicker="Selected Projects & Case Studies"
        title="How I think. How I build."
        copy="Five public-safe projects exploring web experience, usability, accessibility, responsible AI, CMS workflows, and launch quality."
      />

      <div className="case-study-preview-grid">
        {caseStudyProjects.map((project) => (
          <article className="case-study-preview-card" key={project.slug}>
            <a
              className="case-study-preview-image"
              href={`/case-studies/${project.slug}`}
              aria-label={`View ${project.title} case study`}
            >
              <img src={project.image} alt="" loading="lazy" />
              <span className="case-study-project-number">
                {project.number}
              </span>
            </a>
            <div className="case-study-preview-body">
              <div className="case-study-preview-meta">
                <span>{project.status}</span>
                <span>{project.tags.slice(0, 2).join(" · ")}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.preview}</p>
              <div className="case-study-preview-actions">
                <a
                  className="case-study-primary-link"
                  href={`/case-studies/${project.slug}`}
                >
                  View Case Study <span aria-hidden="true">→</span>
                </a>
                <a
                  className="case-study-secondary-link"
                  href={project.pdf}
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
