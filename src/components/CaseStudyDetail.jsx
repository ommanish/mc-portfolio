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
  const project = getCaseStudy(slug);

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
          <p className="case-study-eyebrow">PROJECT {project.number} / 05 · {project.status}</p>
          <h1>{project.title}</h1>
          <p className="case-study-detail-lead">{project.goal}</p>

          <div className="case-study-tag-row">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <dl className="case-study-facts">
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Project type</dt><dd>{project.status}</dd></div>
          </dl>

          <div className="case-study-hero-actions">
            <a className="case-study-primary-link" href={project.pdf} target="_blank" rel="noreferrer">
              Open Case Study PDF ↗
            </a>
          </div>
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
        <span>{project.number} / 05</span>
        <a href={`/case-studies/${next.slug}`}>{next.title} →</a>
      </nav>
    </article>
  );
}
