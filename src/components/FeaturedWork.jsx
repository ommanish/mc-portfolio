import { portfolioContent } from "../content/portfolioContent";
import SectionHeader from "./SectionHeader";

const FOCUS = [
  ["Reusable sections", "CMS / page builder", "Stakeholder feedback"],
  ["Content updates", "QA fixes", "Preview & publishing"],
  ["Responsive UI", "Accessibility", "Browser testing"],
];

export default function FeaturedWork() {
  const content = portfolioContent.featuredWork;
  return (
    <section id="work" className="editorial-section">
      <SectionHeader kicker={content.kicker} title={content.title} copy={content.copy} />
      <div className="editorial-work-list">
        {content.items.map((item, index) => (
          <article className="editorial-work-item" key={item.title}>
            <div className="work-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="work-story"><h3>{item.title}</h3><p>{item.description}</p></div>
            <div className="work-focus"><span className="micro-label">Verified delivery focus</span>
              <ul>{FOCUS[index].map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
