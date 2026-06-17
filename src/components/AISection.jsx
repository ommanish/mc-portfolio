import { portfolioContent } from "../content/portfolioContent";
import Reveal from "./Reveal";

export default function AISection() {
  const { ai } = portfolioContent;

  return (
    <section id="ai">
      <Reveal className="ai-panel">
        <div className="ai-layout">
          <div>
            <div className="section-kicker">{ai.kicker}</div>
            <h2 className="section-title">{ai.title}</h2>
            <p className="section-copy ai-copy">{ai.copy}</p>
            <div className="hero-actions">
              {ai.actions.map((action) => (
                <a
                  className={`btn ${action.variant === "primary" ? "btn-primary" : "btn-ghost"}`}
                  href={action.href}
                  key={action.label}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>

          <div className="prompt-box" aria-label="AI product prompt example">
            {ai.promptLines.map((line) => (
              <span className="prompt-line" key={line}>
                {line}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
