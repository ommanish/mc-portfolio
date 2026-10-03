(() => {
  const prompt = "Create an accessible image mask reveal using semantic HTML, CSS clip-path, and GSAP only for the reveal sequence. The image and caption must remain fully visible as a static fallback if GSAP is unavailable, and prefers-reduced-motion users should see the final state immediately. Do not hide essential information inside the animation.";
  const html = `<figure class="mask-reveal"><div class="mask-reveal__image" aria-hidden="true"></div><figcaption>Use motion to reveal emphasis, not meaning.</figcaption></figure>`;
  const css = `.mask-reveal__image{min-height:18rem;border-radius:1.5rem;background:linear-gradient(135deg,#7c3aed,#22d3ee);clip-path:inset(0)}.has-gsap .mask-reveal__image{clip-path:inset(0 100% 0 0)}@media(prefers-reduced-motion:reduce){.has-gsap .mask-reveal__image{clip-path:inset(0)}}`;
  const js = `const image=document.querySelector('.mask-reveal__image');\nif(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('has-gsap');gsap.to(image,{clipPath:'inset(0 0% 0 0)',duration:1.1,ease:'power3.out'})}\n// Static fallback: without GSAP, CSS leaves the full image visible.`;
  window.InteractiveComponentLab.register({
    id: "image-mask-reveal", number: 8, title: "Image Mask Reveal", tech: "CSS + GSAP", prompt,
    description: "A cinematic clip-path reveal with a complete static fallback when GSAP is unavailable.",
    demo: `<figure class="mask-demo"><div class="mask-demo__image" aria-hidden="true"><span>MASK</span></div><figcaption>Motion reveals emphasis; the caption carries the meaning.</figcaption></figure>`,
    source: { html, css, js },
    accessibility: ["Static fallback stays fully visible", "Caption contains the essential meaning", "Reduced motion skips the reveal"],
    init(section) {
      const image = section.querySelector(".mask-demo__image");
      if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) { image.classList.add("is-static-fallback"); return; }
      window.gsap.fromTo(image, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power3.out" });
    }
  });
})();
