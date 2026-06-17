import { portfolioContent } from "../content/portfolioContent";
import CaseCard from "./CaseCard";
import SectionHeader from "./SectionHeader";

export default function CaseStudies() {
  const { caseStudies } = portfolioContent;

  return (
    <section id="cases">
      <SectionHeader kicker={caseStudies.kicker} title={caseStudies.title} copy={caseStudies.copy} />
      <div className="grid grid-3">
        {caseStudies.items.map((item, index) => (
          <CaseCard key={item.title} {...item} delay={index * 110} />
        ))}
      </div>
    </section>
  );
}
