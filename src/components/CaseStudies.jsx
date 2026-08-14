import { portfolioContent } from "../content/portfolioContent";
import SectionHeader from "./SectionHeader";

const outcome = (labels) => (labels.find((x) => x.startsWith("Outcome:")) || "Outcome: Quality-focused delivery").replace("Outcome:", "").trim();

export default function CaseStudies({ embedded = false }) {
  const content = portfolioContent.caseStudies;
  return (
    <section id={embedded ? undefined : "cases"} className="editorial-section">
      <SectionHeader kicker={content.kicker} title="How I think through real web delivery." copy={content.copy} />
      <div className="case-narratives">
        {content.items.map((item, index) => (
          <article className="case-narrative" key={item.title}>
            <header><span className="case-index">{String(index + 1).padStart(2,"0")}</span><h3>{item.title}</h3></header>
            <div className="case-logic">
              <div><span className="micro-label">Challenge</span><p>{item.description}</p></div>
              <div><span className="micro-label">Context</span><p>{item.labels.join(" · ")}</p></div>
              <div><span className="micro-label">Execution</span><ul>{item.impact.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div className="case-outcome"><span className="micro-label">Result / lesson</span><strong>{outcome(item.labels)}</strong>
                <p>Keep implementation, QA, accessibility, and stakeholder review connected through launch.</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
