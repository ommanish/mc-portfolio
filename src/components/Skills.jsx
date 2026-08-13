import { portfolioContent } from "../content/portfolioContent";
import SectionHeader from "./SectionHeader";

export default function Skills() {
  const content = portfolioContent.skills;
  return (
    <section id="skills" className="editorial-section">
      <SectionHeader kicker={content.kicker} title={content.title} copy={content.copy} />
      <div className="skill-clusters">
        {content.groups.map((group, index) => (
          <article className="skill-cluster" key={group.title}>
            <div><span className="micro-label">{String(index + 1).padStart(2,"0")}</span><h3>{group.title}</h3></div>
            <div className="tag-row">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
          </article>
        ))}
        <article className="skill-cluster skill-cluster-wide">
          <div><span className="micro-label">05</span><h3>AI & delivery leadership</h3></div>
          <div className="tag-row"><span>AI-assisted workflows</span><span>Human validation</span><span>Developer-ready handoff</span><span>Team collaboration</span><span>Mentoring</span></div>
        </article>
      </div>
    </section>
  );
}
