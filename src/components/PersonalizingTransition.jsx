import IntelligenceGraphic from "./IntelligenceGraphic";

export default function PersonalizingTransition() {
  return (
    <section className="personalizing-transition" aria-live="polite" aria-busy="true">
      <div className="personalizing-card">
        <div className="section-kicker">Personalizing your view</div>
        <h1>Finding the most relevant path through my experience.</h1>
        <p>
          Your request is used only to prioritize verified portfolio content. If AI is slow or unavailable, the local portfolio logic takes over automatically.
        </p>
        <IntelligenceGraphic audienceKey="ai" />
      </div>
    </section>
  );
}
