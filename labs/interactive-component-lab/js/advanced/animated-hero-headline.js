(() => {
  const demo = `
    <section class="motion-hero" data-motion-hero>
      <span class="motion-hero__eyebrow" data-hero-eyebrow>Design systems · Motion · Frontend</span>
      <h3 aria-label="Design experiences people remember">
        <span class="hero-word">Design</span>
        <span class="hero-word">experiences</span>
        <span class="hero-word hero-word--accent">people</span>
        <span class="hero-word">remember.</span>
      </h3>
      <p data-hero-copy>Use this pattern for landing-page heroes, product launches, portfolios, and campaign pages.</p>
      <div class="motion-hero__actions" data-hero-actions>
        <a href="#animated-hero-headline">Explore pattern <span aria-hidden="true">↗</span></a>
        <button type="button" data-hero-replay>Replay animation</button>
      </div>
      <div class="motion-hero__line" data-hero-line aria-hidden="true"></div>
    </section>`;

  const prompt = "Create a premium animated website hero using semantic HTML, CSS, and minimal vanilla JavaScript. Choreograph the entrance in a clear sequence: subtle eyebrow reveal, headline word-by-word with upward motion and blur-to-sharp transition, supporting copy, CTA group, then a decorative accent line. Include one accent word and a replay button. Keep all content readable without animation and respect reduced motion.";

  window.AdvancedComponentLab.register({
    id: "animated-hero-headline", number: 1, title: "Animated Hero Headline", tech: "Web Animations API · Staggered typography",
    description: "A reusable landing-page hero with a coordinated replayable reveal for launches, campaigns, portfolios, and product pages.",
    notes: ["Headline leads the sequence, followed by copy and CTAs", "Replay restarts every animated layer together", "Text remains readable without JavaScript"],
    prompt, demo,
    source: {
      html: `<section class="motion-hero"><span class="eyebrow">...</span><h1><span class="hero-word">Design</span> <span class="hero-word">experiences</span></h1><p>Supporting copy</p><div class="actions">...</div><button data-hero-replay>Replay</button></section>`,
      css: `.hero-word{display:inline-block}.hero-word--accent{color:#7dd3fc}@media(prefers-reduced-motion:reduce){.hero-word{transform:none!important;filter:none!important}}`,
      js: `words.forEach((word,index)=>word.animate([{opacity:0,transform:'translateY(1em)',filter:'blur(8px)'},{opacity:1,transform:'none',filter:'none'}],{duration:700,delay:90+index*95,fill:'both',easing:'cubic-bezier(.2,.8,.2,1)'}));copy.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:520,delay:500,fill:'both'});`
    },
    accessibility: ["Headline is real text in logical reading order", "Replay is a native keyboard-accessible button", "Reduced motion skips the animated sequence and shows the final state"],
    init(section) {
      const root = section.querySelector("[data-motion-hero]");
      const eyebrow = root.querySelector("[data-hero-eyebrow]");
      const words = [...root.querySelectorAll(".hero-word")];
      const copy = root.querySelector("[data-hero-copy]");
      const actions = root.querySelector("[data-hero-actions]");
      const replay = root.querySelector("[data-hero-replay]");
      const line = root.querySelector("[data-hero-line]");
      const isReduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ||
        document.querySelector(".lab-shell")?.dataset.motion === "reduced";

      const cancelAnimations = () => {
        [eyebrow, ...words, copy, actions, line].forEach((element) => {
          element?.getAnimations?.().forEach((animation) => animation.cancel());
        });
      };

      const play = () => {
        cancelAnimations();
        if (isReduced() || !Element.prototype.animate) return;

        eyebrow.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 420, fill: "both", easing: "ease-out" }
        );

        words.forEach((word, index) => {
          word.animate(
            [
              { opacity: 0, transform: "translateY(1em)", filter: "blur(8px)" },
              { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }
            ],
            { duration: 700, delay: 90 + index * 95, fill: "both", easing: "cubic-bezier(.2,.8,.2,1)" }
          );
        });

        copy.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 520, delay: 500, fill: "both", easing: "ease-out" }
        );

        actions.animate(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 500, delay: 610, fill: "both", easing: "ease-out" }
        );

        line.animate(
          [
            { transform: "scaleX(0)", opacity: 0 },
            { transform: "scaleX(1)", opacity: 1 }
          ],
          { duration: 650, delay: 720, fill: "both", easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      };

      replay.addEventListener("click", play);
      play();
    }
  });
})();