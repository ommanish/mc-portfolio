(() => {
  const slides = [
    { title: "Compose", label: "01", copy: "Shape ideas into structured product narratives.", metric: "12 drafts" },
    { title: "Analyze", label: "02", copy: "Surface patterns, anomalies, and next-best signals.", metric: "+28% signal" },
    { title: "Collaborate", label: "03", copy: "Bring people, context, and decisions into one flow.", metric: "6 reviewers" },
    { title: "Automate", label: "04", copy: "Turn repeatable intent into controlled execution.", metric: "18 actions" },
    { title: "Measure", label: "05", copy: "Connect outcomes back to the work that created them.", metric: "4.8x impact" },
  ];

  const demo = `
    <div class="depth-carousel" data-depth-root tabindex="0" aria-roledescription="carousel" aria-label="Product capability carousel">
      <header class="depth-carousel__header"><div><span>Capability system</span><h3>Move through depth, not just slides.</h3></div><div class="depth-carousel__count"><strong data-depth-current>01</strong><span>/ 05</span></div></header>
      <div class="depth-carousel__viewport">
        <div class="depth-carousel__track" data-depth-track>
          ${slides.map((slide, index) => `<article class="depth-carousel__card" data-depth-card="${index}" aria-hidden="${index !== 0}"><span>${slide.label}</span><div class="depth-carousel__visual"><i></i><i></i><i></i></div><div><h4>${slide.title}</h4><p>${slide.copy}</p><strong>${slide.metric}</strong></div></article>`).join("")}
        </div>
      </div>
      <div class="depth-carousel__controls"><button type="button" data-depth-prev aria-label="Previous capability">←</button><div class="depth-carousel__progress"><span data-depth-progress></span></div><button type="button" data-depth-next aria-label="Next capability">→</button></div>
    </div>`;

  const prompt = "Build a premium elastic depth carousel with semantic HTML, modern CSS, and vanilla JavaScript. Keep the active card large and sharp while neighboring cards scale down, soften, and rotate subtly toward the center using perspective. Support pointer drag, pointermove/pointerup, mouse wheel or trackpad, previous/next buttons, ArrowLeft/ArrowRight keyboard navigation, and click-to-focus neighboring cards. Show a continuous progress bar and current index. Use restrained elastic settling rather than exaggerated bounce. On mobile, simplify to native horizontal scroll-snap. In reduced motion, remove blur, perspective rotation, and elastic easing while preserving all navigation and readable slide order.";

  window.AdvancedComponentLab.register({
    id: "elastic-depth-carousel", number: 3, title: "Elastic Depth Carousel", tech: "Pointer Events · CSS perspective · Scroll-snap fallback",
    description: "A center-focused carousel with drag, wheel, keyboard, depth hierarchy, and a progress indicator that tracks the active position.",
    notes: ["Pointer, wheel, buttons, and keyboard share one state model", "Depth de-emphasizes neighboring cards", "Mobile and reduced motion fall back to simpler native behavior"],
    prompt,
    demo,
    source: {
      html: `<div class="depth-carousel" tabindex="0" aria-roledescription="carousel">\n  <div class="depth-carousel__track">\n    <article data-depth-card>Compose</article>\n    …\n  </div>\n  <button data-depth-prev>Previous</button>\n  <span data-depth-progress></span>\n  <button data-depth-next>Next</button>\n</div>`,
      css: `.depth-carousel__track{display:flex;transform-style:preserve-3d;transition:transform .58s cubic-bezier(.2,.85,.25,1.15)}.depth-carousel__card{transform:scale(.82) rotateY(7deg);filter:blur(1.5px)}.depth-carousel__card.is-active{transform:translateZ(44px) scale(1);filter:none}@media(max-width:700px){.depth-carousel__viewport{overflow-x:auto;scroll-snap-type:x mandatory}.depth-carousel__card{scroll-snap-align:center}}@media(prefers-reduced-motion:reduce){.depth-carousel__card{transform:none!important;filter:none!important;transition:none}}`,
      js: `let active=0,startX=0,dragX=0;\nroot.addEventListener('pointerdown',e=>{startX=e.clientX;root.setPointerCapture(e.pointerId)});\nroot.addEventListener('pointermove',e=>{if(!startX)return;dragX=e.clientX-startX;render(dragX)});\nroot.addEventListener('pointerup',e=>{if(Math.abs(dragX)>60)go(active+(dragX<0?1:-1));startX=0;dragX=0});\nroot.addEventListener('wheel',e=>go(active+(e.deltaY>0||e.deltaX>0?1:-1)));\nroot.addEventListener('keydown',e=>{/* ArrowLeft / ArrowRight */});`,
    },
    accessibility: ["Carousel container is keyboard focusable with ArrowLeft/ArrowRight support", "Only the active depth card is exposed as current visual focus", "Reduced motion removes depth/elastic effects and mobile uses native scroll-snap"],
    init(section) {
      const root = section.querySelector("[data-depth-root]");
      const track = root.querySelector("[data-depth-track]");
      const cards = [...root.querySelectorAll("[data-depth-card]")];
      const progress = root.querySelector("[data-depth-progress]");
      const current = root.querySelector("[data-depth-current]");
      let active = 0;
      let pointerId = null;
      let startX = 0;
      let dragX = 0;
      let wheelLock = false;

      const clamp = (value) => Math.max(0, Math.min(cards.length - 1, value));
      const render = (offset = 0) => {
        const cardWidth = cards[0]?.getBoundingClientRect().width || 320;
        const gap = 20;
        track.style.setProperty("--depth-offset", `${-(active * (cardWidth + gap)) + offset}px`);
        cards.forEach((card, index) => {
          const delta = index - active;
          card.style.setProperty("--depth-delta", delta);
          card.classList.toggle("is-active", delta === 0);
          card.setAttribute("aria-hidden", String(delta !== 0));
        });
        const ratio = cards.length > 1 ? active / (cards.length - 1) : 0;
        progress.style.width = `${(ratio * 100).toFixed(2)}%`;
        current.textContent = String(active + 1).padStart(2, "0");
      };
      const go = (index) => { active = clamp(index); render(); };

      root.querySelector("[data-depth-prev]").addEventListener("click", () => go(active - 1));
      root.querySelector("[data-depth-next]").addEventListener("click", () => go(active + 1));
      cards.forEach((card, index) => card.addEventListener("click", () => go(index)));
      root.addEventListener("pointerdown", (event) => { pointerId = event.pointerId; startX = event.clientX; dragX = 0; root.setPointerCapture?.(pointerId); });
      root.addEventListener("pointermove", (event) => { if (event.pointerId !== pointerId) return; dragX = event.clientX - startX; render(dragX * 0.72); });
      root.addEventListener("pointerup", (event) => { if (event.pointerId !== pointerId) return; if (Math.abs(dragX) > 58) go(active + (dragX < 0 ? 1 : -1)); else render(); pointerId = null; startX = 0; dragX = 0; });
      root.addEventListener("wheel", (event) => { if (wheelLock || Math.abs(event.deltaX) + Math.abs(event.deltaY) < 12) return; wheelLock = true; go(active + ((event.deltaX || event.deltaY) > 0 ? 1 : -1)); window.setTimeout(() => { wheelLock = false; }, 420); }, { passive: true });
      root.addEventListener("keydown", (event) => { if (event.key === "ArrowRight") { event.preventDefault(); go(active + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); go(active - 1); } if (event.key === "Home") { event.preventDefault(); go(0); } if (event.key === "End") { event.preventDefault(); go(cards.length - 1); } });
      window.addEventListener("resize", () => render(), { passive: true });
      render();
    },
  });
})();
