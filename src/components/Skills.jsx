import { portfolioContent } from "../content/portfolioContent";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function Skills() {
  const { skills } = portfolioContent;

  return (
    <section id="skills">
      <SectionHeader
        kicker={skills.kicker}
        title={skills.title}
        copy={skills.copy}
      />

      <div className="skills-wrap">
        <Reveal as="article" className="skill-card" delay={140}>
          <h3>{skills.intro.title}</h3>
          <p>{skills.intro.description}</p>
        </Reveal>

        <div className="grid grid-2">
          {skills.groups.map((skill, index) => (
            <Reveal
              as="article"
              className="skill-card"
              key={skill.title}
              delay={index * 140}
            >
              <h3>{skill.title}</h3>
              <div className="skill-pills">
                {skill.items.map((item) => (
                  <span className="pill" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
