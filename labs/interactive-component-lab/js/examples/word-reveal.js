(() => {
  const prompt = "Create a word-by-word text reveal with semantic source text preserved for screen readers. Use vanilla JavaScript to split only the visual copy into decorative spans, hide duplicated animated text from assistive technology, keep the original sentence available to screen readers, make it responsive, and disable staggered motion for prefers-reduced-motion users.";
  const html = `<p class="word-reveal"><span class="sr-only">Build interfaces that explain themselves.</span><span class="word-reveal__visual" aria-hidden="true">Build interfaces that explain themselves.</span></p>`;
  const css = `.word-reveal__visual span{display:inline-block;opacity:0;transform:translateY(.65em);transition:.45s ease}.word-reveal__visual.is-ready span{opacity:1;transform:none}@media(prefers-reduced-motion:reduce){.word-reveal__visual span{opacity:1;transform:none;transition:none}}`;
  const js = `const visual=document.querySelector('.word-reveal__visual');\nconst words=visual.textContent.trim().split(/\\s+/);\nvisual.textContent='';\nwords.forEach((word,index)=>{const span=document.createElement('span');span.textContent=word+' ';span.style.transitionDelay=index*70+'ms';visual.append(span)});\nrequestAnimationFrame(()=>visual.classList.add('is-ready'));`;
  window.InteractiveComponentLab.register({
    id: "word-reveal", number: 3, title: "Word-by-Word Text Reveal", tech: "CSS + Vanilla JS", prompt,
    description: "A staggered headline treatment that separates decorative motion from accessible text.",
    demo: `<p class="word-demo"><span class="sr-only">Build interfaces that explain themselves.</span><span class="word-demo__visual" aria-hidden="true">Build interfaces that explain themselves.</span></p>`,
    source: { html, css, js },
    accessibility: ["Original sentence remains available to screen readers", "Animated duplicate is aria-hidden", "Reduced motion displays all words immediately"],
    init(section) {
      const visual = section.querySelector(".word-demo__visual");
      const text = visual.textContent.trim();
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      visual.textContent = "";
      text.split(/\s+/).forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = `${word} `;
        span.style.setProperty("--delay", `${index * 70}ms`);
        visual.append(span);
      });
      requestAnimationFrame(() => visual.classList.add("is-ready"));
    }
  });
})();
