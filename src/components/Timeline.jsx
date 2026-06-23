import { portfolioContent } from "../content/portfolioContent";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function Timeline() {
  const { timeline } = portfolioContent;

  return (
    <section id="timeline">
      <SectionHeader kicker={timeline.kicker} title={timeline.title} />

      <div className="timeline">
        {timeline.items.map((item, index) => (
          <Reveal
            as="article"
            className="timeline-item"
            key={item.title}
            delay={index * 140}
          >
            <div className="time">{item.time}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
