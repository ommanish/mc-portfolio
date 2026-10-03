(() => {
  const prompt = "Create an accessible sticky content-swap section using semantic HTML, CSS sticky positioning, and vanilla JavaScript or IntersectionObserver to update a companion visual as each content block becomes active. Keep the text in normal DOM order, provide a stacked mobile and reduced-motion fallback, and do not intercept scrolling.";
  const html = `<section class="sticky-swap"><div class="sticky-swap__visual" aria-hidden="true">01</div><div class="sticky-swap__steps"><article data-step="01"><h3>Discover</h3></article><article data-step="02"><h3>Decide</h3></article><article data-step="03"><h3>Deliver</h3></article></div></section>`;
  const css = `.sticky-swap{display:grid;grid-template-columns:1fr 1fr;gap:2rem}.sticky-swap__visual{position:sticky;top:2rem;height:18rem}@media(max-width:700px),(prefers-reduced-motion:reduce){.sticky-swap{grid-template-columns:1fr}.sticky-swap__visual{position:relative;top:auto}}`;
  const js = `const visual=document.querySelector('.sticky-swap__visual');\nconst observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)visual.textContent=entry.target.dataset.step}),{threshold:.55});\ndocument.querySelectorAll('[data-step]').forEach(step=>observer.observe(step));`;
  window.InteractiveComponentLab.register({
    id: "sticky-content-swap", number: 7, title: "Sticky Content Swap", tech: "CSS + Vanilla JS", prompt,
    description: "A sticky companion panel changes with the active content while reading order stays natural.",
    demo: `<div class="sticky-swap-demo"><div class="sticky-swap-demo__visual" aria-hidden="true"><span data-swap-value>01</span><strong data-swap-label>Discover</strong></div><div class="sticky-swap-demo__steps"><article data-swap-step="01" data-label="Discover"><small>01</small><h3>Discover</h3><p>Understand the problem before designing the interface.</p></article><article data-swap-step="02" data-label="Decide"><small>02</small><h3>Decide</h3><p>Use hierarchy to focus attention on the meaningful choice.</p></article><article data-swap-step="03" data-label="Deliver"><small>03</small><h3>Deliver</h3><p>Make the next action obvious and accountable.</p></article></div></div>`,
    source: { html, css, js },
    accessibility: ["Text remains in normal DOM order", "Sticky visual is supplementary", "Mobile and reduced motion use a stacked layout"],
    init(section) {
      if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const value = section.querySelector("[data-swap-value]");
      const label = section.querySelector("[data-swap-label]");
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { value.textContent = entry.target.dataset.swapStep; label.textContent = entry.target.dataset.label; } }), { threshold: .55 });
      section.querySelectorAll("[data-swap-step]").forEach((step) => observer.observe(step));
    }
  });
})();
