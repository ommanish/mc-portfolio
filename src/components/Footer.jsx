import { portfolioContent } from "../content/portfolioContent";

export default function Footer() {
  const { site } = portfolioContent;
  return (
    <footer className="executive-footer">
      <div>
        <a className="footer-brand" href="#top"><span className="brand-mark">{site.initials}</span>
          <span><strong>{site.name}</strong><small>Web Experience · Frontend · AI</small></span></a>
        <p>Enterprise web should feel clear to users and manageable for the teams behind it.</p>
      </div>
      <nav aria-label="Footer links">
        <a href={site.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/ommanish/mc-portfolio" target="_blank" rel="noreferrer">GitHub</a>
        <a href={site.resumeUrl}>Resume</a>
      </nav>
    </footer>
  );
}
