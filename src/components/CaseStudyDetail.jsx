import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { caseStudyProjects, getCaseStudy } from "../content/caseStudyProjects";

function DetailSection({ label, title, children }) {
  return (
    <section className="case-study-detail-section">
      <div className="case-study-detail-heading">
        <span>{label}</span>
        <h2>{title}</h2>
      </div>
      <div className="case-study-detail-content">{children}</div>
    </section>
  );
}

export default function CaseStudyDetail({ slug }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const project = getCaseStudy(slug);

  useEffect(() => {
    if (!demoOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setDemoOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("case-study-demo-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("case-study-demo-open");
    };
  }, [demoOpen]);

  if (!project) {
    return (
      <div className="case-study-not-found">
        <p className="case-study-eyebrow">CASE STUDY</p>
        <h1>Case study not found.</h1>
        <a href="/#cases">← Back to Case Studies</a>
      </div>
    );
  }

  const index = caseStudyProjects.findIndex((item) => item.slug === slug);
  const previous = caseStudyProjects[index - 1] || caseStudyProjects[caseStudyProjects.length - 1];
  const next = caseStudyProjects[index + 1] || caseStudyProjects[0];

  return (
    <article className="case-study-detail">
      <a className="case-study-back-link" href="/#cases">← Back to Case Studies</a>

      <header className="case-study-detail-hero">
        <div className="case-study-detail-intro">
          <p className="case-study-eyebrow">PROJECT {project.number} / {String(caseStudyProjects.length).padStart(2, "0")} · {project.status}</p>
          <h1>{project.title}</h1>
          <p className="case-study-detail-lead">{project.goal}</p>

          <div className="case-study-tag-row">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <dl className="case-study-facts">
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Project type</dt><dd>{project.status}</dd></div>
          </dl>

          {project.pdf && (
            <div className="case-study-hero-actions">
              <a className="case-study-primary-link" href={project.pdf} target="_blank" rel="noreferrer">
                Open Case Study PDF ↗
              </a>
            </div>
          )}
          {project.demoUrl && (
            <div className="case-study-hero-actions">
              {project.demoMode === "drawer" ? (
                <button className="case-study-primary-link case-study-demo-trigger" type="button" onClick={() => setDemoOpen(true)}>
                  Open {project.title.includes("Wenamah") ? "Stage Demo" : "Interactive Demo"} <span aria-hidden="true">↗</span>
                </button>
              ) : (
                <a className="case-study-primary-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  View Live Demo <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </div>

        <figure className="case-study-detail-visual">
          <img src={project.image} alt={`Annotated concept board for ${project.title}`} />
          <figcaption>Annotated project concept · portfolio case study</figcaption>
        </figure>
      </header>

      <DetailSection label="01 · UNDERSTAND" title="The challenge">
        <p>{project.challenge}</p>
        <div className="case-study-note">Start with the problem, not the feature.</div>
      </DetailSection>

      <DetailSection label="02 · RESEARCH" title="What I looked at">
        <p>{project.research}</p>
        <h3>Key decisions</h3>
        <ul className="case-study-decision-list">
          {project.decisions.map((decision) => <li key={decision}>{decision}</li>)}
        </ul>
      </DetailSection>

      <DetailSection label="03 · DESIGN" title="The solution">
        <p>{project.solution}</p>
        <div className="case-study-callout">
          <span>Accessibility & responsible design</span>
          <p>{project.accessibility}</p>
        </div>
      </DetailSection>

      <DetailSection label="04 · VALIDATE" title="How I would measure success">
        <p>{project.measurement}</p>
        <div className="case-study-two-column">
          <div>
            <h3>What I learned</h3>
            <p>{project.learning}</p>
          </div>
          <div>
            <h3>Next iteration</h3>
            <p>{project.next}</p>
          </div>
        </div>
      </DetailSection>

      <section className="case-study-approach" aria-labelledby="case-study-approach-title">
        <span className="case-study-approach-kicker">Project Perspective</span>
        <h2 id="case-study-approach-title">How I Approach the Work</h2>
        <p>{project.approach}</p>
      </section>

      <nav className="case-study-project-nav" aria-label="Case study navigation">
        <a href={`/case-studies/${previous.slug}`}>← {previous.title}</a>
        <span>{project.number} / {String(caseStudyProjects.length).padStart(2, "0")}</span>
        <a href={`/case-studies/${next.slug}`}>{next.title} →</a>
      </nav>
      {demoOpen && (
        createPortal(
          <div className="case-study-demo-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDemoOpen(false); }}>
            <section className="case-study-demo-modal case-study-demo-modal--windowed" role="dialog" aria-modal="true" aria-labelledby="case-study-demo-title">
              <header className="case-study-demo-header">
                <div><span>INTERACTIVE CONCEPT</span><h2 id="case-study-demo-title">{project.title}</h2></div>
                <button type="button" className="case-study-demo-close" onClick={() => setDemoOpen(false)} aria-label="Close demo">×</button>
              </header>
              <iframe
                title={`${project.title} demo`}
                src={project.slug === "vellum-vector-studio" ? `${project.demoUrl}#top` : project.demoUrl}
              />
            </section>
          </div>,
          document.body
        )
      )}
    </article>
  );
}
