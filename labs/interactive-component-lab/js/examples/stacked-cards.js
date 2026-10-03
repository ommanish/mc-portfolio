(() => {
  const prompt = "Create an accessible stacked-card scroll component with three content cards. Each card should stick slightly below the previous card as the user scrolls so the stack builds progressively. Use semantic HTML and CSS first, keep JavaScript optional, make the layout responsive, and disable sticky behavior for prefers-reduced-motion users. Do not use scroll-jacking.";
  const html = `<section class="stacked-cards" aria-label="Progressive steps">\n  <article class="stacked-card stacked-card--1"><h3>Understand</h3><p>Turn raw context into a clear brief.</p></article>\n  <article class="stacked-card stacked-card--2"><h3>Decide</h3><p>Bring the important choice forward.</p></article>\n  <article class="stacked-card stacked-card--3"><h3>Act</h3><p>Keep the next action visible.</p></article>\n</section>`;
  const css = `.stacked-cards{display:grid;gap:1rem;max-height:32rem;overflow:auto;padding:1rem}.stacked-card{position:sticky;min-height:13rem;padding:2rem;border-radius:1.5rem;background:#fff;border:1px solid #dbe3ef}.stacked-card--1{top:1rem}.stacked-card--2{top:2.5rem}.stacked-card--3{top:4rem}@media(prefers-reduced-motion:reduce){.stacked-card{position:relative;top:auto}}`;
  window.InteractiveComponentLab.register({
    id: "stacked-card-scroll", number: 1, title: "Stacked Card Scroll", tech: "CSS", prompt,
    description: "Sticky cards build a progressive visual stack without taking over page scrolling.",
    demo: `<div class="stack-demo" tabindex="0" aria-label="Scrollable stacked card demo"><article class="stack-demo__card stack-demo__card--1"><span>01</span><h3>Understand</h3><p>Turn raw context into a clear brief.</p></article><article class="stack-demo__card stack-demo__card--2"><span>02</span><h3>Decide</h3><p>Keep the decision visible while context remains nearby.</p></article><article class="stack-demo__card stack-demo__card--3"><span>03</span><h3>Act</h3><p>End with a focused next action.</p></article><div class="stack-demo__spacer" aria-hidden="true"></div></div>`,
    source: { html, css, js: "// No JavaScript is required for the core interaction." },
    accessibility: ["Keyboard-scrollable demo", "Semantic article elements", "Reduced motion becomes a normal vertical list"]
  });
})();
