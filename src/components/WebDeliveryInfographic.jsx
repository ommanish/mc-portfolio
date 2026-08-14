import HandwrittenAccent from "./HandwrittenAccent";

const STEPS = [
  {
    number: "01",
    title: "Strategy",
    copy: "Turn the request into a clear scope: what is changing, why it matters, who needs to review it, and what launch-ready means.",
  },
  {
    number: "02",
    title: "Design",
    copy: "Review design intent and platform constraints early so implementation decisions do not become late-stage surprises.",
  },
  {
    number: "03",
    title: "Build",
    copy: "Implement reusable, responsive sections and content with CMS, page-builder, and frontend patterns the platform can support well.",
  },
  {
    number: "04",
    title: "QA",
    copy: "Catch content, responsive, accessibility, browser, and visual issues while there is still time to fix them cleanly.",
  },
  {
    number: "05",
    title: "Launch",
    copy: "Keep previews, stakeholder approvals, final checks, and publishing readiness moving toward a controlled release.",
  },
  {
    number: "06",
    title: "Optimize",
    copy: "Use post-launch feedback and real delivery lessons to improve the next update, component, or workflow.",
  },
];

export default function WebDeliveryInfographic() {
  return (
    <figure className="delivery-infographic" aria-label="Web delivery process infographic">
      <div className="delivery-infographic-track">
        {STEPS.map((step, index) => (
          <article
            className="delivery-infographic-step"
            data-testid="delivery-infographic-step"
            key={step.title}
            style={{ "--infographic-index": index }}
          >
            <div className="delivery-infographic-node" aria-hidden="true">
              <span>{step.number}</span>
            </div>
            <div className="delivery-infographic-copy">
              <span className="micro-label">Stage {step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
            {step.title === "QA" ? (
              <HandwrittenAccent
                type="circle"
                label="validate here"
                className="infographic-handwritten-accent delivery-qa-sketch"
              />
            ) : null}
            {step.title === "Launch" ? (
              <HandwrittenAccent
                type="arrow"
                label="ship"
                className="infographic-handwritten-accent delivery-launch-sketch"
              />
            ) : null}
          </article>
        ))}
      </div>
      <figcaption>
        A continuous delivery loop: clarify the request, build with platform constraints in mind, validate carefully, launch with control, and carry the learning forward.
      </figcaption>
    </figure>
  );
}
