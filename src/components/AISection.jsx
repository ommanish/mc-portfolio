import { portfolioContent } from "../content/portfolioContent";
import SectionHeader from "./SectionHeader";

const PIPELINE = [
  ["Human intent", "Start with a real user, content, or delivery need."],
  ["AI assistance", "Use AI to accelerate exploration, organization, or generation."],
  ["Structured output", "Turn the result into reusable content, UI, components, or handoff."],
  ["Human validation", "Review facts, UX, accessibility, security, and brand alignment."],
  ["Production", "Ship only validated output that is useful and maintainable."],
];

export default function AISection({ embedded = false }) {
  const content = portfolioContent.ai;
  return (
    <section id={embedded ? undefined : "ai"} className="editorial-section ai-executive-section">
      <SectionHeader kicker="AI in practice" title="I use AI where it improves the workflow — not where it weakens judgment." copy={content.copy}
        accentType="marker"
        accentLabel="human in the loop"
        accentClassName="ai-owner-accent"
      />
      <div className="ai-pipeline">
        {PIPELINE.map(([title, copy], index) => (
          <article key={title}><span className="micro-label">{String(index + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p></article>
        ))}
      </div>
      <div className="ai-evidence">
        <div><div className="micro-label">Working direction</div><h3>Practical AI for web, content, UI, and delivery workflows.</h3>
          <p>This portfolio demonstrates the model: user intent influences prioritization, AI returns a constrained structured decision, and React renders only verified content already present in the portfolio.</p>
        </div>
        <div className="ai-prompt-lines">{content.promptLines.map((line) => <code key={line}>{line}</code>)}</div>
      </div>
    </section>
  );
}
