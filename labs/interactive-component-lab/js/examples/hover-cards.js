(() => {
  const prompt = "Create accessible interactive hover cards using semantic links or buttons and CSS only. Pointer hover and keyboard focus-visible states must provide equivalent feedback, no essential information may appear only on hover, touch users must still see all content, and prefers-reduced-motion should remove depth transforms.";
  const html = `<div class="hover-cards"><a class="hover-card" href="#"><span>01</span><h3>Explore</h3><p>All content stays visible.</p></a><a class="hover-card" href="#"><span>02</span><h3>Focus</h3><p>Keyboard focus matches hover.</p></a></div>`;
  const css = `.hover-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}.hover-card{display:block;padding:1.5rem;border:1px solid #dbe3ef;border-radius:1.25rem;transition:transform .25s ease,box-shadow .25s ease}.hover-card:hover,.hover-card:focus-visible{transform:translateY(-8px);box-shadow:0 18px 40px rgba(15,23,42,.15)}@media(prefers-reduced-motion:reduce){.hover-card{transition:none}.hover-card:hover,.hover-card:focus-visible{transform:none}}`;
  window.InteractiveComponentLab.register({
    id: "interactive-hover-cards", number: 9, title: "Interactive Hover Cards", tech: "CSS", prompt,
    description: "Depth and emphasis that work equally with pointer, keyboard, and touch.",
    demo: `<div class="hover-card-demo"><button type="button"><span>01</span><strong>Explore</strong><small>All content remains visible.</small></button><button type="button"><span>02</span><strong>Focus</strong><small>Keyboard focus mirrors hover.</small></button><button type="button"><span>03</span><strong>Act</strong><small>Touch users lose nothing.</small></button></div>`,
    source: { html, css, js: "// No JavaScript required." },
    accessibility: ["Hover and focus-visible have equivalent states", "No hidden hover-only information", "Reduced motion removes transforms"]
  });
})();
