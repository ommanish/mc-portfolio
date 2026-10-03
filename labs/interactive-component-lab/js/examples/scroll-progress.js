(() => {
  const prompt = "Create a scroll-progress storytelling section using semantic HTML, CSS, and vanilla JavaScript. Show reading progress based on the section's actual scroll position without intercepting scroll, keep all content readable without JavaScript, make the indicator decorative or clearly labeled, and disable animated smoothing for prefers-reduced-motion users.";
  const html = `<section class="progress-story"><div class="progress-story__bar" aria-hidden="true"><span></span></div><article><h3>Discover</h3></article><article><h3>Decide</h3></article><article><h3>Deliver</h3></article></section>`;
  const css = `.progress-story__bar{position:sticky;top:1rem;height:4px;background:#dbe3ef}.progress-story__bar span{display:block;height:100%;width:var(--progress,0%);background:currentColor}.progress-story article{min-height:18rem}`;
  const js = `const story=document.querySelector('.progress-story');\nconst bar=story.querySelector('.progress-story__bar span');\nconst update=()=>{const rect=story.getBoundingClientRect();const total=story.offsetHeight-innerHeight;const passed=Math.min(Math.max(-rect.top,0),Math.max(total,1));bar.style.setProperty('width',passed/Math.max(total,1)*100+'%')};\naddEventListener('scroll',update,{passive:true});update();`;
  window.InteractiveComponentLab.register({
    id: "scroll-progress-story", number: 6, title: "Scroll Progress Story", tech: "CSS + Vanilla JS", prompt,
    description: "A native-scroll narrative with a progress indicator tied to real reading position.",
    demo: `<div class="progress-demo"><div class="progress-demo__bar" aria-hidden="true"><span></span></div><div class="progress-demo__viewport" tabindex="0"><article><span>01</span><h3>Discover</h3><p>Start with the context.</p></article><article><span>02</span><h3>Decide</h3><p>Bring the important choice forward.</p></article><article><span>03</span><h3>Deliver</h3><p>End with a clear outcome.</p></article></div></div>`,
    source: { html, css, js },
    accessibility: ["Native scrolling only", "Story content remains readable without JavaScript", "Progress indicator is supplementary"],
    init(section) {
      const viewport = section.querySelector(".progress-demo__viewport");
      const bar = section.querySelector(".progress-demo__bar span");
      const update = () => { const max = Math.max(1, viewport.scrollHeight - viewport.clientHeight); bar.style.width = `${Math.min(100, viewport.scrollTop / max * 100)}%`; };
      viewport.addEventListener("scroll", update, { passive: true }); update();
    }
  });
})();
