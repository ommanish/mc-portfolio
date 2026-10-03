(() => {
  const prompt = "Create an accessible text-reveal-on-scroll component using semantic HTML, CSS transitions, and IntersectionObserver. Text must remain readable without JavaScript, reveal only once when it enters the viewport, be responsive, and show instantly for prefers-reduced-motion users.";
  const html = `<section class="reveal-copy"><p class="eyebrow">Design systems</p><h2>Reveal the idea when it becomes relevant.</h2><p>Use motion to support reading order, not distract from it.</p></section>`;
  const css = `.reveal-copy{opacity:1;transform:none}.js .reveal-copy{opacity:0;transform:translateY(24px);transition:.7s ease}.js .reveal-copy.is-visible{opacity:1;transform:none}@media(prefers-reduced-motion:reduce){.js .reveal-copy{opacity:1;transform:none;transition:none}}`;
  const js = `document.documentElement.classList.add('js');\nconst observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.3});\ndocument.querySelectorAll('.reveal-copy').forEach(el=>observer.observe(el));`;
  window.InteractiveComponentLab.register({
    id: "text-reveal", number: 2, title: "Text Reveal on Scroll", tech: "CSS + IntersectionObserver", prompt,
    description: "A restrained entrance animation that keeps content visible when JavaScript is unavailable.",
    demo: `<div class="text-reveal-demo"><p class="eyebrow">Scroll-triggered content</p><h3>Motion should clarify when an idea enters focus.</h3><p>IntersectionObserver adds the enhancement while the content remains present in the DOM.</p></div>`,
    source: { html, css, js },
    accessibility: ["Content is readable without JavaScript", "One-time reveal avoids repetitive motion", "Reduced motion removes the transition"],
    init(section) {
      const target = section.querySelector(".text-reveal-demo");
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
      target.classList.add("is-pending");
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { target.classList.add("is-visible"); observer.disconnect(); } }), { threshold: .35 });
      observer.observe(target);
    }
  });
})();
