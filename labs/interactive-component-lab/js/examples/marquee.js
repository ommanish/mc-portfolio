(() => {
  const prompt = "Create an accessible infinite content marquee using CSS animation. Duplicate only decorative content, hide the duplicate from assistive technology, pause motion for prefers-reduced-motion users, provide a stable non-moving fallback, and avoid making any essential information depend on the animation.";
  const html = `<div class="marquee" aria-label="Capabilities"><div class="marquee__track"><span>Design systems</span><span>Accessible motion</span><span>Frontend craft</span><div aria-hidden="true"><span>Design systems</span><span>Accessible motion</span><span>Frontend craft</span></div></div></div>`;
  const css = `.marquee{overflow:hidden}.marquee__track{display:flex;width:max-content;gap:1rem;animation:marquee 18s linear infinite}@keyframes marquee{to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.marquee__track{animation:none;flex-wrap:wrap;width:auto}}`;
  window.InteractiveComponentLab.register({
    id: "infinite-marquee", number: 5, title: "Infinite Marquee", tech: "CSS", prompt,
    description: "A seamless content loop with a non-moving accessible fallback.",
    demo: `<div class="marquee-demo" aria-label="Frontend capabilities"><div class="marquee-demo__track"><div class="marquee-demo__group"><span>CSS Motion</span><span>Accessibility</span><span>Design Systems</span><span>Performance</span></div><div class="marquee-demo__group" aria-hidden="true"><span>CSS Motion</span><span>Accessibility</span><span>Design Systems</span><span>Performance</span></div></div></div>`,
    source: { html, css, js: "// No JavaScript required." },
    accessibility: ["Duplicated loop content is aria-hidden", "Essential content is present once semantically", "Reduced motion stops the animation"]
  });
})();
