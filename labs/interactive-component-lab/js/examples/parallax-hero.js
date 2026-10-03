(() => {
  const prompt = "Create an accessible layered parallax hero using semantic HTML, CSS, and GSAP for restrained pointer or scroll-linked depth. Essential text and calls to action must remain static and readable, moving layers should be decorative, the hero must have a complete static fallback if GSAP is unavailable, and prefers-reduced-motion users should see no parallax.";
  const html = `<section class="parallax-hero"><div class="parallax-hero__layer" aria-hidden="true"></div><div class="parallax-hero__content"><p>Interactive systems</p><h2>Depth without losing clarity.</h2><a href="#next">Explore</a></div></section>`;
  const css = `.parallax-hero{position:relative;overflow:hidden;min-height:24rem}.parallax-hero__layer{position:absolute;inset:0;background:radial-gradient(circle at 70% 30%,#22d3ee55,transparent 35%),linear-gradient(135deg,#0f172a,#312e81)}.parallax-hero__content{position:relative;z-index:1}@media(prefers-reduced-motion:reduce){.parallax-hero__layer{transform:none!important}}`;
  const js = `const layer=document.querySelector('.parallax-hero__layer');\nif(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.to(layer,{yPercent:12,ease:'none',scrollTrigger:{trigger:layer.parentElement,start:'top bottom',end:'bottom top',scrub:true}})}\n// Static fallback: when GSAP is unavailable the decorative layer simply stays in place.`;
  window.InteractiveComponentLab.register({
    id: "parallax-motion-hero", number: 12, title: "Parallax / Motion Hero", tech: "GSAP", prompt,
    description: "Restrained decorative depth around stable semantic content, with a complete static fallback.",
    demo: `<div class="parallax-demo"><div class="parallax-demo__layer parallax-demo__layer--one" aria-hidden="true"></div><div class="parallax-demo__layer parallax-demo__layer--two" aria-hidden="true"></div><div class="parallax-demo__content"><span>Example 12</span><h3>Depth without losing clarity.</h3><p>The message and action stay stable while decorative layers move around them.</p><button type="button">Explore pattern</button></div></div>`,
    source: { html, css, js },
    accessibility: ["Essential content never moves or disappears", "Animated layers are decorative", "Static fallback is complete when GSAP is blocked"],
    init(section) {
      const layers = section.querySelectorAll(".parallax-demo__layer");
      if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) { section.querySelector(".parallax-demo").classList.add("is-static-fallback"); return; }
      const demo = section.querySelector(".parallax-demo");
      demo.addEventListener("pointermove", (event) => {
        const rect = demo.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5;
        window.gsap.to(layers[0], { x: x * 24, y: y * 18, duration: .45 });
        window.gsap.to(layers[1], { x: x * -16, y: y * -12, duration: .55 });
      });
      demo.addEventListener("pointerleave", () => window.gsap.to(layers, { x: 0, y: 0, duration: .45 }));
    }
  });
})();
