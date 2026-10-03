(() => {
  const PROMPT = `Create an accessible stacked-card scroll component with three content cards. Each card should stick slightly below the previous card as the user scrolls so the stack builds progressively. Use semantic HTML and CSS first, keep JavaScript optional, make the layout responsive, and disable sticky transforms for prefers-reduced-motion users. Do not use scroll-jacking.`;

  const snippets = {
    html: `<section class="stacked-cards" aria-label="Product benefits">
  <article class="stacked-card"><h3>Understand</h3><p>Turn raw context into a clear brief.</p></article>
  <article class="stacked-card"><h3>Decide</h3><p>Bring the important choice forward.</p></article>
  <article class="stacked-card"><h3>Act</h3><p>Keep the next action visible and accountable.</p></article>
</section>`,
    css: `.stacked-cards { display: grid; gap: 1rem; }
.stacked-card { position: sticky; top: calc(5rem + var(--index) * 1.25rem); min-height: 14rem; }
@media (prefers-reduced-motion: reduce) { .stacked-card { position: relative; top: auto; } }`,
    js: `// No JavaScript is required for the core stacked-card interaction.\n// Add JS only for optional analytics or controls.`
  };

  const section = document.createElement("section");
  section.className = "component-example";
  section.id = "stacked-card-example";
  section.setAttribute("aria-labelledby", "stacked-card-example-title");
  section.innerHTML = `
    <div class="chapter__inner component-example__inner">
      <header class="component-example__heading">
        <div><p class="chapter-index">Component example 01</p><p class="eyebrow">CSS + motion + vibe coding</p></div>
        <div><h2 id="stacked-card-example-title">Stacked Card Scroll Animation</h2><p>Explore the component, inspect the implementation, then reuse the prompt with the AI coding tool of your choice.</p></div>
      </header>

      <div class="component-example__grid">
        <div class="component-example__demo" data-example-demo>
          <div class="component-example__toolbar"><span>Live demo</span><span>Scroll inside ↕</span></div>
          <div class="stack-demo" tabindex="0" aria-label="Scrollable stacked card animation demo">
            <div class="stack-demo__intro"><small>Scroll the demo</small><strong>One idea. Three progressive layers.</strong></div>
            <article class="stack-demo__card" style="--index:0"><span>01</span><h3>Understand</h3><p>Turn raw context into a clear brief before asking the user to act.</p></article>
            <article class="stack-demo__card" style="--index:1"><span>02</span><h3>Decide</h3><p>Keep the important decision visible while the previous context remains nearby.</p></article>
            <article class="stack-demo__card" style="--index:2"><span>03</span><h3>Act</h3><p>End with a focused next step instead of another layer of dashboard noise.</p></article>
            <div class="stack-demo__spacer" aria-hidden="true"></div>
          </div>
        </div>

        <aside class="component-example__prompt" data-example-prompt>
          <div class="component-example__panel-title"><span>Vibe-code prompt</span><button type="button" data-copy-prompt>Copy prompt</button></div>
          <p>${PROMPT}</p>
          <div class="component-example__notes"><strong>Why this prompt works</strong><ul><li>Defines the interaction, not a framework.</li><li>Calls out responsive and reduced-motion behavior.</li><li>Keeps JavaScript optional and avoids scroll-jacking.</li></ul></div>
        </aside>
      </div>

      <div class="component-code">
        <div class="component-code__header"><div role="tablist" aria-label="Component code"><button type="button" role="tab" aria-selected="true" data-code-tab="html">HTML</button><button type="button" role="tab" aria-selected="false" data-code-tab="css">CSS</button><button type="button" role="tab" aria-selected="false" data-code-tab="js">JS</button></div><button type="button" data-copy-code>Copy code</button></div>
        <pre tabindex="0"><code data-code-output></code></pre>
      </div>

      <div class="component-example__accessibility"><strong>Accessibility</strong><span>Keyboard-scrollable demo</span><span>Semantic cards</span><span>Reduced motion: sticky stacking becomes a normal vertical list</span></div>
    </div>`;

  const target = document.querySelector("#accessibility");
  if (!target || document.querySelector("#stacked-card-example")) return;
  target.before(section);

  const output = section.querySelector("[data-code-output]");
  let active = "html";
  const renderCode = () => { output.textContent = snippets[active]; };
  renderCode();

  section.querySelectorAll("[data-code-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      active = button.dataset.codeTab;
      section.querySelectorAll("[data-code-tab]").forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
      renderCode();
    });
  });

  async function copy(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Copied ✓";
      setTimeout(() => { button.textContent = original; }, 1400);
    } catch {
      button.textContent = "Select and copy";
    }
  }

  section.querySelector("[data-copy-prompt]").addEventListener("click", (event) => copy(PROMPT, event.currentTarget));
  section.querySelector("[data-copy-code]").addEventListener("click", (event) => copy(snippets[active], event.currentTarget));
})();
