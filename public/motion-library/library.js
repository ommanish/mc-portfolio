(() => {
  const components = [
  {
    "slug": "kinetic-hero",
    "number": "01",
    "title": "Kinetic Editorial Hero",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "Masked typography, ambient light, cursor depth, CTA motion, and replayable entrance choreography.",
    "features": [
      "Masked headline entrance",
      "Pointer-responsive depth",
      "Ambient gradient movement",
      "CTA micro-interaction",
      "Replay control",
      "Reduced-motion fallback"
    ],
    "prompt": "Build a standalone editorial hero using semantic HTML, scoped CSS, and vanilla JavaScript. Create a masked multi-line headline reveal, subtle ambient gradient movement, a pointer-responsive media composition with restrained depth, CTA micro-interaction, scroll cue, and a replay button. Keep the layout premium and asymmetric rather than template-like. Make it responsive, keyboard accessible, touch safe, and provide a prefers-reduced-motion fallback where all content remains immediately visible."
  },
  {
    "slug": "directional-cards",
    "number": "02",
    "title": "Directional Media Cards",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "Editorial cards with pointer light, subtle 3D tilt, media depth, and keyboard-equivalent emphasis.",
    "features": [
      "Pointer spotlight",
      "3D tilt",
      "Media scale",
      "Focus-within parity",
      "CTA arrow motion",
      "Touch-safe fallback"
    ],
    "prompt": "Build a reusable three-card editorial feature grid using semantic HTML, scoped CSS, and vanilla JavaScript. Each card should combine a strong media area, cursor-follow light, subtle 3D tilt, independent media scale, title/meta/CTA hierarchy, and focus-within behavior matching hover. Keep the motion restrained and purposeful. On touch devices remove tilt while preserving the design, and include responsive stacking plus prefers-reduced-motion support."
  },
  {
    "slug": "layered-reveal",
    "number": "03",
    "title": "Layered Image Reveal",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "A narrative image-and-copy section with curtain masking, scale, staged content, and replay.",
    "features": [
      "Curtain reveal",
      "Image scale",
      "Content stagger",
      "Floating detail card",
      "IntersectionObserver",
      "Replay control"
    ],
    "prompt": "Build a standalone split-layout image reveal section using semantic HTML, scoped CSS, and vanilla JavaScript. The left media frame should begin covered by a dark curtain that collapses inside the image frame while the artwork scales from roughly 1.08 to 1. Stagger the eyebrow, large editorial headline, supporting copy, CTA, and floating detail badge. Trigger on viewport entry, include a Replay Reveal button, never allow the curtain to cover the content column, and include a safety fallback plus prefers-reduced-motion behavior so content can never remain hidden."
  },
  {
    "slug": "morph-tabs",
    "number": "04",
    "title": "Morphing Feature Tabs",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "Accessible tabs where indicator, typography, and abstract media morph together as one state change.",
    "features": [
      "ARIA tabs",
      "Roving tabindex",
      "Sliding indicator",
      "Directional copy motion",
      "Media morph",
      "Keyboard navigation"
    ],
    "prompt": "Build an accessible standalone feature-tabs section using semantic HTML, scoped CSS, and vanilla JavaScript. Use proper tablist, tab, and tabpanel semantics with roving tabindex and ArrowLeft, ArrowRight, Home, and End keyboard controls. Animate a sliding active indicator, directional copy transition, and a coordinated abstract visual that morphs shape and color for each state. Make the indicator math accurate, keep layout stable, support mobile, and disable nonessential motion for prefers-reduced-motion."
  },
  {
    "slug": "magnetic-cta",
    "number": "05",
    "title": "Magnetic CTA Field",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "A conversion moment with proximity-based magnetic motion, ambient pointer light, and restrained arrow behavior.",
    "features": [
      "Pointer proximity",
      "Magnetic pull",
      "Ambient halo",
      "Arrow morph",
      "Touch-safe behavior",
      "Reduced motion"
    ],
    "prompt": "Build a standalone conversion section centered around a magnetic CTA using semantic HTML, scoped CSS, and vanilla JavaScript. The CTA should react when the pointer enters a surrounding proximity field, not only when hovering the button, with restrained magnetic pull, ambient radial light, and a small arrow rotation. Keep the button fully usable by keyboard and touch, reset cleanly on pointer leave, and completely disable pointer-follow transforms and ambient motion for prefers-reduced-motion."
  },
  {
    "slug": "smart-header",
    "number": "06",
    "title": "Smart Motion Header",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "A sticky header that compacts, hides on downward scroll, returns upward, and stays visible during keyboard focus.",
    "features": [
      "Scroll direction",
      "Compact state",
      "Hide / reveal",
      "Focus protection",
      "Backdrop blur",
      "Mobile nav behavior"
    ],
    "prompt": "Build a complete standalone long-form demo page with a smart floating header using semantic HTML, scoped CSS, and vanilla JavaScript. Include meaningful hero, work, about, services, and final CTA content so the scroll behavior can be evaluated. The header should compact after scrolling, hide while scrolling downward, reappear immediately when scrolling upward, and never hide while keyboard focus is inside it. Use backdrop blur, responsive mobile navigation, native page scrolling, and prefers-reduced-motion support."
  },
  {
    "slug": "before-after",
    "number": "07",
    "title": "Cinematic Before / After",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "A fully keyboard-accessible comparison slider with clipped transformation visuals and a visible draggable handle.",
    "features": [
      "Native range input",
      "Keyboard control",
      "Touch drag",
      "Clip-path reveal",
      "Visible focus",
      "Responsive stage"
    ],
    "prompt": "Build a standalone cinematic before-and-after comparison using semantic HTML, scoped CSS, and minimal vanilla JavaScript. Use a native range input layered over the visual so mouse, touch, and keyboard all work automatically. Clip the after state according to the range value, keep a visible divider and handle synchronized to the split, show clear Before and After labels, provide a strong visible focus state, and make the composition responsive without relying on custom drag libraries."
  },
  {
    "slug": "sticky-process",
    "number": "08",
    "title": "Sticky Process Story",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "Long-form process storytelling with a sticky visual, changing geometry, active steps, and progress state.",
    "features": [
      "Sticky visual",
      "Step activation",
      "Morphing artwork",
      "Progress rail",
      "Native page scroll",
      "Responsive fallback"
    ],
    "prompt": "Build a standalone scroll-driven process story using semantic HTML, scoped CSS, and vanilla JavaScript. Keep one visual panel sticky while four narrative steps scroll naturally beside it. As each step becomes active, update a progress rail, label, background palette, and abstract artwork geometry with coordinated transitions. Do not hijack scrolling. Use IntersectionObserver for step activation, create a single-column mobile fallback, and provide prefers-reduced-motion behavior."
  },
  {
    "slug": "dual-marquee",
    "number": "09",
    "title": "Dual-Track Brand Marquee",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "Two opposing seamless brand tracks with exact duplicated groups, hover pause, and an explicit motion control.",
    "features": [
      "Seamless groups",
      "Opposing directions",
      "Pause / play",
      "Hover pause",
      "Edge masking",
      "Reduced-motion stop"
    ],
    "prompt": "Build a standalone dual-track brand marquee using semantic HTML, scoped CSS, and minimal vanilla JavaScript. Create two horizontal rows moving in opposite directions using two identical groups per track so the loop is mathematically seamless with no jump. Add soft edge masking, pause on hover, an explicit Pause/Play button with aria-pressed, responsive item sizing, and a prefers-reduced-motion fallback that stops autoplay while keeping every item visible."
  },
  {
    "slug": "cursor-project-index",
    "number": "10",
    "title": "Cursor Project Index",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "A true editorial project index where the project visual follows the cursor with inertia and changes as each row becomes active.",
    "features": [
      "Cursor-follow image",
      "Smooth inertia",
      "Velocity tilt",
      "Image reveal transition",
      "Row dim / highlight",
      "Inline mobile fallback"
    ],
    "prompt": "Build a true standalone cursor project index using semantic HTML, scoped CSS, and vanilla JavaScript. The primary UI must remain a clean full-width editorial project list. On desktop, only while a row is hovered or keyboard-focused, show that project's image attached to the cursor with smooth inertia, slight velocity-based tilt, and a reveal/crossfade when moving between projects. Subtly dim non-active rows. Do not turn the preview into a persistent card or metadata panel. On keyboard focus pin the image near the row, on mobile replace cursor behavior with an inline image reveal beneath the tapped project, and support prefers-reduced-motion."
  },
  {
    "slug": "chapter-progress",
    "number": "11",
    "title": "Chapter Scroll Progress",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "A long-form chapter navigator combining continuous reading progress with active section labels.",
    "features": [
      "Reading percentage",
      "Active chapters",
      "Clickable navigation",
      "Continuous progress",
      "IntersectionObserver",
      "Reduced motion"
    ],
    "prompt": "Build a standalone long-form chapter progress experience using semantic HTML, scoped CSS, and vanilla JavaScript. Combine a fixed vertical progress rail, live reading percentage, and clickable chapter labels. As native page scrolling moves through four full-screen content chapters, continuously update total reading progress and use IntersectionObserver to highlight the active chapter. Keep anchors keyboard accessible, provide a compact mobile layout, and respect prefers-reduced-motion."
  },
  {
    "slug": "theme-morph",
    "number": "12",
    "title": "Theme Morph Story",
    "tech": "HTML + CSS + Vanilla JS",
    "description": "State-driven storytelling where color, typography, content, and abstract media morph as one coordinated system.",
    "features": [
      "Theme state",
      "Media morph",
      "Semantic toggles",
      "Live content region",
      "Color choreography",
      "Reduced motion"
    ],
    "prompt": "Build a standalone state-driven storytelling section using semantic HTML, scoped CSS, and vanilla JavaScript. Provide three semantic controls that update a large headline, supporting copy, background theme, accent color, and abstract artwork geometry as one coordinated state change. Expose active state with aria-pressed and announce changing content politely. Keep text contrast strong, make it responsive, and remove nonessential transitions for prefers-reduced-motion."
  }
];

  const escapeHtml = (value) => value.replace(/[&<>"']/g, character => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[character]);

  const list = document.querySelector("[data-library-components]");
  const index = document.querySelector("[data-library-index]");
  if (!list || !index) return;

  index.innerHTML = components.map(item =>
    `<a href="#component-${item.slug}"><span>${item.number}</span>${item.title}</a>`
  ).join("");

  list.innerHTML = components.map(item => `
    <article class="component-card" id="component-${item.slug}" data-component="${item.slug}">
      <div class="component-title">
        <span class="component-title__number">${item.number}</span>
        <div><p class="eyebrow">Standalone component</p><h3>${item.title}</h3><p>${item.description}</p></div>
      </div>

      <div class="component-toolbar">
        <div><span class="component-toolbar__status">Live standalone demo</span><strong>${item.tech}</strong></div>
        <button type="button" data-reload-demo>Replay / Reload demo</button>
      </div>

      <div class="component-preview">
        <iframe title="${item.title} live demo" src="./components/${item.slug}/index.html" loading="lazy" data-component-frame></iframe>
      </div>

      <div class="component-details">
        <div><p class="eyebrow">Interaction system</p><h4>Built to copy and use.</h4></div>
        <ul>${item.features.map(feature=>`<li>${feature}</li>`).join("")}</ul>
      </div>

      <div class="prompt-panel">
        <div class="prompt-panel__heading">
          <div><p class="eyebrow">Reusable build prompt</p><h4>Recreate or adapt this interaction.</h4></div>
          <button type="button" data-copy-prompt>Copy prompt</button>
        </div>
        <p data-component-prompt>${escapeHtml(item.prompt)}</p>
      </div>

      <div class="source-panel">
        <div class="source-panel__bar">
          <div class="source-tabs" role="tablist" aria-label="${item.title} source">
            <button type="button" role="tab" aria-selected="true" data-source-tab="html">HTML</button>
            <button type="button" role="tab" aria-selected="false" tabindex="-1" data-source-tab="css">CSS</button>
            <button type="button" role="tab" aria-selected="false" tabindex="-1" data-source-tab="js">JS</button>
          </div>
          <div class="source-actions">
            <button type="button" data-copy-current>Copy current</button>
            <button type="button" data-copy-all>Copy all</button>
          </div>
        </div>
        <pre tabindex="0"><code data-source-output>Loading exact source…</code></pre>
      </div>
    </article>
  `).join("");

  function wireCard(card) {
    const slug = card.dataset.component;
    const frame = card.querySelector("[data-component-frame]");
    const reload = card.querySelector("[data-reload-demo]");
    const output = card.querySelector("[data-source-output]");
    const tabs = [...card.querySelectorAll("[data-source-tab]")];
    const copyCurrent = card.querySelector("[data-copy-current]");
    const copyAll = card.querySelector("[data-copy-all]");
    const copyPrompt = card.querySelector("[data-copy-prompt]");
    const component = components.find(item => item.slug === slug);
    const source = {};
    let active = "html";

    const files = {
      html: `./components/${slug}/index.html`,
      css: `./components/${slug}/style.css`,
      js: `./components/${slug}/script.js`
    };

    async function loadSource() {
      const entries = await Promise.all(Object.entries(files).map(async ([key,url]) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        return [key, await response.text()];
      }));
      Object.assign(source,Object.fromEntries(entries));
      renderSource();
    }

    function renderSource() {
      output.textContent = source[active] || "Loading exact source…";
    }

    function activate(tab, moveFocus=false) {
      active = tab.dataset.sourceTab;
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute("aria-selected",String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      renderSource();
      if (moveFocus) tab.focus();
    }

    tabs.forEach((tab,index) => {
      tab.addEventListener("click",()=>activate(tab));
      tab.addEventListener("keydown",event => {
        if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
        event.preventDefault();
        let next=index;
        if(event.key==="ArrowRight") next=(index+1)%tabs.length;
        if(event.key==="ArrowLeft") next=(index-1+tabs.length)%tabs.length;
        if(event.key==="Home") next=0;
        if(event.key==="End") next=tabs.length-1;
        activate(tabs[next],true);
      });
    });

    reload.addEventListener("click",()=>{ frame.src = frame.src; });

    async function copyText(text,button) {
      await navigator.clipboard.writeText(text);
      const original=button.textContent;
      button.textContent="Copied ✓";
      setTimeout(()=>{button.textContent=original;},1200);
    }

    copyPrompt.addEventListener("click",()=>copyText(component?.prompt||"",copyPrompt));
    copyCurrent.addEventListener("click",()=>copyText(source[active]||"",copyCurrent));
    copyAll.addEventListener("click",()=>{
      const standalone = (source.html || "")
        .replace('<link rel="stylesheet" href="./style.css">', `<style>\n${source.css || ""}\n</style>`)
        .replace('<script src="./script.js"></script>', `<script>\n${source.js || ""}\n<\/script>`);
      copyText(standalone,copyAll);
    });

    loadSource().catch(error => { output.textContent = "Could not load source. " + error.message; });
  }

  document.querySelectorAll("[data-component]").forEach(wireCard);
})();