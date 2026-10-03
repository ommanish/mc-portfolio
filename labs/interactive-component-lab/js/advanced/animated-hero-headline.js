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
      <div class="motion-hero__line" data-hero-line aria-hidden="true"></div>
    </section>`;

  const prompt = "Create a premium animated website hero using semantic HTML, CSS, and minimal vanilla JavaScript. Reveal the headline word-by-word with upward motion, blur-to-sharp transition, staggered timing, one accent word, supporting copy, CTA, and a replay button. Keep all text readable without animation and respect reduced motion.";

  window.AdvancedComponentLab.register({
    id: "animated-hero-headline", number: 1, title: "Animated Hero Headline", tech: "Web Animations API · Staggered typography",
    description: "A reusable landing-page hero with a dependable replayable word reveal for launches, campaigns, portfolios, and product pages.",
    notes: ["Replay always restarts the sequence", "Text remains readable without JavaScript", "Animation enhances hierarchy rather than hiding content"],
    prompt, demo,
    source: {
      html: `<section class="motion-hero"><h1><span class="hero-word">Design</span> <span class="hero-word">experiences</span></h1><button data-hero-replay>Replay</button></section>`,
      css: `.hero-word{display:inline-block}.hero-word--accent{color:#7dd3fc}@media(prefers-reduced-motion:reduce){.hero-word{transform:none!important;filter:none!important}}`,
      js: `words.forEach((word,index)=>word.animate([{opacity:0,transform:'translateY(1em)',filter:'blur(8px)'},{opacity:1,transform:'none',filter:'none'}],{duration:700,delay:index*95,fill:'both',easing:'cubic-bezier(.2,.8,.2,1)'}));`
    },
    accessibility: ["Headline is real text in logical reading order", "Replay is a native keyboard-accessible button", "Reduced motion skips the animated sequence"],
    init(section) {
      const root = section.querySelector("[data-motion-hero]");
      const words = [...root.querySelectorAll(".hero-word")];
      const replay = root.querySelector("[data-hero-replay]");
      const line = root.querySelector("[data-hero-line]");
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ||
        document.querySelector(".lab-shell")?.dataset.motion === "reduced";

      const play = () => {
        if (reduced || !Element.prototype.animate) return;
        words.forEach((word, index) => {
          word.getAnimations().forEach((animation) => animation.cancel());
          word.animate(
            [
              { opacity: 0, transform: "translateY(1em)", filter: "blur(8px)" },
              { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }
            ],
            { duration: 700, delay: index * 95, fill: "both", easing: "cubic-bezier(.2,.8,.2,1)" }
          );
        });
        line.getAnimations().forEach((animation) => animation.cancel());
        line.animate(
          [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
          { duration: 650, delay: 420, fill: "both", easing: "ease-out" }
        );
      };

      replay.addEventListener("click", play);
      play();
    }
  });
})();