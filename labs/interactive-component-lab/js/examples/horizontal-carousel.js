(() => {
  const prompt = "Create an accessible horizontal card carousel using semantic HTML, CSS overflow behavior, and vanilla JavaScript for previous/next controls. Keep native scrolling available, support keyboard activation, avoid page-scroll hijacking, make it responsive, and preserve a usable layout when JavaScript or motion is unavailable.";
  const html = `<section class="carousel" aria-label="Featured ideas"><div class="carousel__track" tabindex="0"><article>Discover</article><article>Compare</article><article>Decide</article></div><div class="carousel__controls"><button type="button" data-prev>Previous</button><button type="button" data-next>Next</button></div></section>`;
  const css = `.carousel__track{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,70%);gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory}.carousel__track article{scroll-snap-align:start}.carousel__controls{display:flex;gap:.5rem}`;
  const js = `const track=document.querySelector('.carousel__track');\nconst amount=()=>track.clientWidth*.75;\ndocument.querySelector('[data-prev]').addEventListener('click',()=>track.scrollBy({left:-amount(),behavior:'smooth'}));\ndocument.querySelector('[data-next]').addEventListener('click',()=>track.scrollBy({left:amount(),behavior:'smooth'}));`;
  window.InteractiveComponentLab.register({
    id: "horizontal-carousel", number: 4, title: "Horizontal Scroll Carousel", tech: "CSS + Vanilla JS", prompt,
    description: "Native horizontal scrolling with semantic controls instead of scroll-jacking.",
    demo: `<div class="carousel-demo"><div class="carousel-demo__track" tabindex="0" aria-label="Scrollable card carousel"><article><span>01</span><h3>Discover</h3><p>Surface useful possibilities.</p></article><article><span>02</span><h3>Compare</h3><p>Keep options easy to scan.</p></article><article><span>03</span><h3>Decide</h3><p>Move toward a clear choice.</p></article><article><span>04</span><h3>Ship</h3><p>Keep the final action visible.</p></article></div><div class="carousel-demo__controls"><button type="button" data-prev aria-label="Previous cards">← Previous</button><button type="button" data-next aria-label="Next cards">Next →</button></div></div>`,
    source: { html, css, js },
    accessibility: ["Native horizontal scrolling remains available", "Semantic buttons work by keyboard", "No wheel or page-scroll interception"],
    init(section) {
      const track = section.querySelector(".carousel-demo__track");
      const move = (direction) => track.scrollBy({ left: direction * Math.max(260, track.clientWidth * .75), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      section.querySelector("[data-prev]").addEventListener("click", () => move(-1));
      section.querySelector("[data-next]").addEventListener("click", () => move(1));
    }
  });
})();
