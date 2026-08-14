import { useState } from "react";
import { SERVICE_DEFAULT_BY_LENS } from "../content/lensConfig";
import SectionHeader from "./SectionHeader";

const SERVICES = [
  ["Own complex web delivery", "Bring structure to work that crosses content, design, CMS, frontend, QA, stakeholders, and launch — especially when the request starts out unclear or fragmented.", ["Responsive UI","Reusable patterns","Accessibility"]],
  ["Modernize CMS & page-builder experiences", "Turn approved content and design into reusable, responsive, launch-ready experiences while working within the real constraints of enterprise CMS and page-builder systems.", ["CMS","Page Builder","Launch readiness"]],
  ["Raise frontend quality", "Improve component-based UI with stronger responsive behavior, accessibility, maintainability, and cross-browser quality — without losing sight of the delivery deadline.", ["React","Frontend","Cross-browser QA"]],
  ["Build practical AI workflows", "Use AI to remove repetitive friction from content, UI, handoff, personalization, and delivery workflows while keeping people responsible for judgment, accuracy, security, and quality.", ["Human review","Structured output","Automation"]],
];

export default function HowICanHelp({ embedded = false, lensKey = "general" }) {
  const [active, setActive] = useState(SERVICE_DEFAULT_BY_LENS[lensKey] ?? 0);
  const [title, copy, tags] = SERVICES[active];

  return (
    <section id={embedded ? undefined : "services"} className="editorial-section">
      <SectionHeader
        kicker="How I can help"
        title="Where I can make an immediate difference."
        copy="I’m most useful when web work crosses multiple disciplines and someone needs to connect the details without losing momentum."
      />
      <div className="capability-layout">
        <div className="capability-list" role="tablist" aria-label="Capabilities">
          {SERVICES.map(([name], index) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active === index}
              onClick={() => setActive(index)}
            >
              <span>{String(index + 1).padStart(2,"0")}</span>{name}
            </button>
          ))}
        </div>
        <article className="capability-detail">
          <div className="micro-label">Capability {String(active + 1).padStart(2,"0")}</div>
          <h3>{title}</h3>
          <p>{copy}</p>
          <div className="tag-row">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </article>
      </div>
    </section>
  );
}
