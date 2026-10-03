(() => {
  const examples = [];
  const ids = new Set();

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      const label = button.textContent;
      button.textContent = "Copied ✓";
      setTimeout(() => { button.textContent = label; }, 1200);
    } catch {
      button.textContent = "Select and copy";
    }
  }

  function renderExample(example) {
    const section = document.createElement("section");
    section.className = "component-example";
    section.id = example.id;
    section.setAttribute("aria-labelledby", `${example.id}-title`);
    section.innerHTML = `
      <div class="component-example__inner">
        <header class="component-example__heading">
          <div><p class="component-example__number">Example ${String(example.number).padStart(2, "0")}</p><p class="component-example__tech">${escapeHtml(example.tech)}</p></div>
          <div><h2 id="${example.id}-title">${escapeHtml(example.title)}</h2><p>${escapeHtml(example.description || "Explore the live interaction, copy the real code, or reuse the prompt in your coding assistant.")}</p></div>
        </header>
        <div class="component-example__grid">
          <div class="component-example__demo" data-example-demo>${example.demo}</div>
          <aside class="component-example__prompt" data-example-prompt>
            <div class="component-example__panel-title"><span>Vibe-code prompt</span><button type="button" data-copy-prompt>Copy prompt</button></div>
            <p>${escapeHtml(example.prompt)}</p>
          </aside>
        </div>
        <div class="component-code">
          <div class="component-code__header">
            <div role="tablist" aria-label="${escapeHtml(example.title)} code">
              <button type="button" role="tab" aria-selected="true" data-code-tab="html">HTML</button>
              <button type="button" role="tab" aria-selected="false" data-code-tab="css">CSS</button>
              <button type="button" role="tab" aria-selected="false" data-code-tab="js">JS</button>
            </div>
            <button type="button" data-copy-code>Copy code</button>
          </div>
          <pre tabindex="0"><code data-code-output></code></pre>
        </div>
        <div class="component-example__accessibility"><strong>Accessibility</strong>${example.accessibility.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      </div>`;

    let active = "html";
    const output = section.querySelector("[data-code-output]");
    const renderCode = () => { output.textContent = example.source[active] || "// No JavaScript required."; };
    renderCode();

    section.querySelectorAll("[data-code-tab]").forEach((button) => button.addEventListener("click", () => {
      active = button.dataset.codeTab;
      section.querySelectorAll("[data-code-tab]").forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
      renderCode();
    }));
    section.querySelector("[data-copy-prompt]").addEventListener("click", (event) => copyText(example.prompt, event.currentTarget));
    section.querySelector("[data-copy-code]").addEventListener("click", (event) => copyText(example.source[active] || "// No JavaScript required.", event.currentTarget));
    return section;
  }

  window.InteractiveComponentLab = {
    register(example) {
      if (!example?.id || ids.has(example.id)) throw new Error(`Duplicate or invalid example id: ${example?.id || "unknown"}`);
      ids.add(example.id);
      examples.push(example);
    },
    mountAll(target) {
      if (!target) return;
      examples.sort((a, b) => a.number - b.number).forEach((example) => {
        const section = renderExample(example);
        target.append(section);
        try { example.init?.(section); } catch (error) { console.warn(`[InteractiveComponentLab] ${example.id} fallback`, error); }
      });
    },
    getExamples() { return [...examples]; }
  };
})();
