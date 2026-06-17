import { portfolioContent } from "../content/portfolioContent";
import FeatureCard from "./FeatureCard";
import SectionHeader from "./SectionHeader";

export default function FeaturedWork() {
  const { featuredWork } = portfolioContent;

  return (
    <section id="work">
      <SectionHeader kicker={featuredWork.kicker} title={featuredWork.title} copy={featuredWork.copy} />
      <div className="grid grid-3">
        {featuredWork.items.map((item, index) => (
          <FeatureCard key={item.title} {...item} delay={index * 110} />
        ))}
      </div>
    </section>
  );
}
