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

      <div id="lab" className="portfolio-lab-section" aria-labelledby="portfolio-lab-title">
        <div className="portfolio-lab-heading">
          <span className="portfolio-lab-kicker">Labs &amp; Open Source</span>
          <h3 id="portfolio-lab-title">Reusable interaction experiments.</h3>
          <p>
            Standalone motion systems and practical frontend patterns built
            to be explored, copied, adapted, and used in real web experiences.
          </p>
        </div>

        <div className="portfolio-lab-stack">
          <article className="portfolio-lab-feature portfolio-lab-feature--motion">
            <div className="portfolio-lab-visual portfolio-lab-visual--motion" aria-hidden="true">
              <div className="portfolio-lab-windowbar">
                <span /><span /><span /><strong>motion-web-experience-library</strong>
              </div>
              <div className="portfolio-motion-preview">
                <div className="portfolio-motion-preview__hero">
                  <span>Motion</span>
                  <strong>Web Experience</strong>
                </div>
                <div className="portfolio-motion-preview__grid">
                  <div><span>Hero</span></div>
                  <div><span>Reveal</span></div>
                  <div><span>Cursor</span></div>
                  <div><span>Scroll</span></div>
                </div>
              </div>
            </div>

            <div className="portfolio-lab-content">
              <div className="portfolio-lab-status">
                <span>New Motion Library</span>
                <span>12 Standalone Components</span>
              </div>
              <h4>Copy the experience. Not just the idea.</h4>
              <p>
                A reusable motion library with standalone HTML, CSS, and
                vanilla JavaScript components. Each example includes a live
                demo, exact source code, Copy All, accessibility guidance, and
                a reusable build prompt.
              </p>
              <div className="portfolio-lab-tags" aria-label="Motion Web Experience Library topics">
                {["Motion", "UI/UX", "HTML", "CSS", "Vanilla JS", "Accessibility"].map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="portfolio-lab-actions">
                <a className="case-study-primary-link" href="/motion-library/">
                  Explore Motion Library <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </article>

          <article className="portfolio-lab-feature">
            <div className="portfolio-lab-visual" aria-hidden="true">
              <div className="portfolio-lab-windowbar">
                <span /><span /><span /><strong>css-practical-lab</strong>
              </div>
              <div className="portfolio-lab-demo-grid">
                <div className="portfolio-lab-demo"><span>Motion</span></div>
                <div className="portfolio-lab-demo"><span>Scroll</span></div>
                <div className="portfolio-lab-demo"><span>Carousel</span></div>
                <div className="portfolio-lab-demo"><span>Layout</span></div>
              </div>
            </div>

            <div className="portfolio-lab-content">
              <div className="portfolio-lab-status">
                <span>Ongoing Lab</span>
                <span>Public GitHub Project</span>
              </div>
              <h4>Small patterns. Real frontend problems.</h4>
              <p>
                Framework-free examples for motion, scroll interactions,
                carousels, modern selectors, responsive layout, and
                product-storytelling systems — designed to be inspected,
                adapted, and reused.
              </p>
              <div className="portfolio-lab-tags" aria-label="CSS Practical Lab topics">
                {["CSS", "Motion", "Frontend", "Accessibility", "Interaction Design"].map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="portfolio-lab-actions">
                <a className="case-study-primary-link" href="https://ommanish.github.io/css-practical-lab/" target="_blank" rel="noopener noreferrer">
                  Explore Live Lab <span aria-hidden="true">↗</span>
                </a>
                <a className="case-study-secondary-link" href="https://github.com/ommanish/css-practical-lab" target="_blank" rel="noopener noreferrer">
                  View GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
