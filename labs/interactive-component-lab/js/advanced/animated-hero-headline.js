(() => {
  const demo = `
    <section class="motion-hero" data-motion-hero>
      <span class="motion-hero__eyebrow">Design systems · Motion · Frontend</span>
      <h3 aria-label="Design experiences people remember">
        <span class="hero-word">Design</span>
        <span class="hero-word">experiences</span>
        <span class="hero-word hero-word--accent">people</span>
        <span class="hero-word">remember.</span>
      </h3>
      <p>Use this pattern for landing-page heroes, product launches, portfolios, and campaign pages.</p>
      <div class="motion-hero__actions">
        <a href="#animated-hero-headline">Explore pattern <span aria-hidden="true">↗</span></a>
        <button type="button" data-hero-replay>Replay animation</button>
      </div>
      <div class="motion-hero__line" aria-hidden="true"></div>
    </section>`;

  const prompt = "Create a premium animated website hero using semantic HTML, CSS, and minimal vanilla JavaScript. Split the headline into words or lines and reveal them with an upward masked motion, staggered timing, subtle blur-to-sharp transition, and one highlighted accent word. Add a small eyebrow, supporting copy, CTA, replay control, and a decorative line that grows after the headline. Keep the layout useful for real landing pages. Respect prefers-reduced-motion by showing all text immediately with no transform or blur.";

  window.AdvancedComponentLab.register({
    id: "animated-hero-headline", number: 1, title: "Animated Hero Headline", tech: "CSS masks · Staggered motion · Minimal JS",
    description: "A reusable landing-page hero with masked word reveals, accent treatment, CTA choreography, and a replay control.",
    notes: ["Ideal for landing pages and product launches", "Animation supports hierarchy instead of delaying reading", "Replay makes the motion easy to review during design handoff"],
    prompt, demo,
    source: {
      html: `<section class="motion-hero"><h1><span class="hero-word">Design</span> <span class="hero-word">experiences</span></h1><button data-hero-replay>Replay</button></section>`,
      css: `.hero-word{display:inline-block;opacity:0;transform:translateY(1.1em);filter:blur(8px);animation:heroReveal .7s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:var(--delay)}@keyframes heroReveal{to{opacity:1;transform:none;filter:none}}@media(prefers-reduced-motion:reduce){.hero-word{opacity:1;transform:none;filter:none;animation:none}}`,
      js: `const words=[...root.querySelectorAll('.hero-word')];words.forEach((word,i)=>word.style.setProperty('--delay',\`\${i*90}ms\`));replay.addEventListener('click',()=>{root.classList.remove('is-playing');requestAnimationFrame(()=>root.classList.add('is-playing'))});`,
    },
    accessibility: ["Headline remains real text in logical reading order", "Replay is optional and keyboard accessible", "Reduced motion shows the final state immediately"],
    init(section) {
      const root=section.querySelector("[data-motion-hero]");
      const words=[...root.querySelectorAll(".hero-word")];
      const replay=root.querySelector("[data-hero-replay]");
      words.forEach((word,index)=>word.style.setProperty("--delay",`${index*95}ms`));
      const play=()=>{ root.classList.remove("is-playing"); void root.offsetWidth; root.classList.add("is-playing"); };
      replay.addEventListener("click",play);
      play();
    }
  });
})();