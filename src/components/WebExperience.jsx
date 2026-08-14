import SectionHeader from "./SectionHeader";
import WebDeliveryInfographic from "./WebDeliveryInfographic";

export default function WebExperience({ embedded = false }) {
  return (
    <section id={embedded ? undefined : "web-experience"} className="editorial-section">
      <SectionHeader
        kicker="Web Experience / Web Producer"
        title="A clear path from request to production."
        copy="Good web delivery is a chain of decisions, not a handoff. I help connect requirements, design, CMS constraints, frontend quality, review, and launch."
        accentType="underline"
        accentLabel="from brief to launch"
      />
      <WebDeliveryInfographic />
    </section>
  );
}
