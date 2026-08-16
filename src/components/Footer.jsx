import { portfolioContent } from "../content/portfolioContent";

export default function Footer({ onRestart }) {
  const { site } = portfolioContent;

  return (
    <footer className="executive-footer">
      <div className="footer-identity">
        <a className="footer-brand" href="#top">
          <span className="brand-mark">{site.initials}</span>
          <span>
            <strong>{site.name}</strong>
            <small>Web Experience · Frontend · AI</small>
          </span>
        </a>
        <p>Enterprise web should feel clear to users and manageable for the teams behind it.</p>
      </div>

      <div className="footer-actions">
        <div className="footer-social-block">
          <span className="footer-social-label">Follow me</span>
          <nav aria-label="Footer links" data-analytics-section="footer">
            <a href={site.linkedinUrl} target="_blank" rel="noreferrer" data-analytics-event="linkedin_click" data-analytics-section="footer">LinkedIn</a>
            <a href="https://github.com/ommanish/mc-portfolio" target="_blank" rel="noreferrer" data-analytics-event="github_click" data-analytics-section="footer">GitHub</a>
            <a href={site.resumeUrl} data-analytics-event="resume_click" data-analytics-section="footer">Resume</a>
          </nav>
        </div>
        <button className="footer-restart" type="button" onClick={onRestart}>
          Restart portfolio experience ↺
        </button>
      </div>
    </footer>
  );
}
