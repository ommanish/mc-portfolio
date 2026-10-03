(() => {
  const components = [
    { slug:"kinetic-hero", number:"01", title:"Kinetic Editorial Hero", tech:"HTML + CSS + Vanilla JS", description:"Masked typography, ambient light, cursor depth, CTA motion, and replayable entrance choreography.", features:["Masked headline entrance","Pointer-responsive depth","Ambient gradient movement","CTA micro-interaction","Replay control","Reduced-motion fallback"] },
    { slug:"directional-cards", number:"02", title:"Directional Media Cards", tech:"HTML + CSS + Vanilla JS", description:"Editorial cards with pointer light, subtle 3D tilt, media depth, and keyboard-equivalent emphasis.", features:["Pointer spotlight","3D tilt","Media scale","Focus-within parity","CTA arrow motion","Touch-safe fallback"] },
    { slug:"layered-reveal", number:"03", title:"Layered Image Reveal", tech:"HTML + CSS + Vanilla JS", description:"A narrative image-and-copy section with curtain masking, scale, staged content, and replay.", features:["Curtain reveal","Image scale","Content stagger","Floating detail card","IntersectionObserver","Replay control"] },
    { slug:"morph-tabs", number:"04", title:"Morphing Feature Tabs", tech:"HTML + CSS + Vanilla JS", description:"Accessible tabs where indicator, typography, and abstract media morph together as one state change.", features:["ARIA tabs","Roving tabindex","Sliding indicator","Directional copy motion","Media morph","Keyboard navigation"] },
    { slug:"magnetic-cta", number:"05", title:"Magnetic CTA Field", tech:"HTML + CSS + Vanilla JS", description:"A conversion moment with proximity-based magnetic motion, ambient pointer light, and restrained arrow behavior.", features:["Pointer proximity","Magnetic pull","Ambient halo","Arrow morph","Touch-safe behavior","Reduced motion"] },
    { slug:"smart-header", number:"06", title:"Smart Motion Header", tech:"HTML + CSS + Vanilla JS", description:"A sticky header that compacts, hides on downward scroll, returns upward, and stays visible during keyboard focus.", features:["Scroll direction","Compact state","Hide / reveal","Focus protection","Backdrop blur","Mobile nav behavior"] },
    { slug:"before-after", number:"07", title:"Cinematic Before / After", tech:"HTML + CSS + Vanilla JS", description:"A fully keyboard-accessible comparison slider with clipped transformation visuals and a visible draggable handle.", features:["Native range input","Keyboard control","Touch drag","Clip-path reveal","Visible focus","Responsive stage"] },
    { slug:"sticky-process", number:"08", title:"Sticky Process Story", tech:"HTML + CSS + Vanilla JS", description:"Long-form process storytelling with a sticky visual, changing geometry, active steps, and progress state.", features:["Sticky visual","Step activation","Morphing artwork","Progress rail","Native page scroll","Responsive fallback"] },
    { slug:"dual-marquee", number:"09", title:"Dual-Track Brand Marquee", tech:"HTML + CSS + Vanilla JS", description:"Two opposing seamless brand tracks with exact duplicated groups, hover pause, and an explicit motion control.", features:["Seamless groups","Opposing directions","Pause / play","Hover pause","Edge masking","Reduced-motion stop"] },
    { slug:"cursor-project-index", number:"10", title:"Cursor Project Index", tech:"HTML + CSS + Vanilla JS", description:"A portfolio project list with pointer-follow preview, focus parity, visual transitions, and a mobile inline fallback.", features:["Cursor preview","Focus parity","Visual transition","Project metadata","Mobile inline preview","Reduced motion"] },
    { slug:"chapter-progress", number:"11", title:"Chapter Scroll Progress", tech:"HTML + CSS + Vanilla JS", description:"A long-form chapter navigator combining continuous reading progress with active section labels.", features:["Reading percentage","Active chapters","Clickable navigation","Continuous progress","IntersectionObserver","Reduced motion"] },
    { slug:"theme-morph", number:"12", title:"Theme Morph Story", tech:"HTML + CSS + Vanilla JS", description:"State-driven storytelling where color, typography, content, and abstract media morph as one coordinated system.", features:["Theme state","Media morph","Semantic toggles","Live content region","Color choreography","Reduced motion"] }
  ];

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