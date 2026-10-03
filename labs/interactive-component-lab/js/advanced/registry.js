(() => {
  const experiments = [];
  const ids = new Set();

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      const previous = button.textContent;
      button.textContent = "Copied ✓";
      window.setTimeout(() => { button.textContent = previous; }, 1200);
    } catch {
      button.textContent = "Select and copy";
    }
  }

  function renderExperiment(experiment) {
    const section = document.createElement("section");
    section.className = "advanced-experiment";
    section.id = experiment.id;
    section.setAttribute("aria-labelledby", `${experiment.id}-title`);
    section.innerHTML = `
      <div class="advanced-experiment__inner">
        <header class="advanced-experiment__heading">
          <div class="advanced-experiment__meta"><span>Advanced ${String(experiment.number).padStart(2, "0")}</span><span>${escapeHtml(experiment.tech)}</span></div>
          <div><h2 id="${experiment.id}-title">${escapeHtml(experiment.title)}</h2><p>${escapeHtml(experiment.description)}</p></div>
        </header>
        <div class="advanced-experiment__stage" data-advanced-demo>${experiment.demo}</div>
        <div class="advanced-experiment__notes">
          <strong>Interaction notes</strong>
          ${experiment.notes.map((note) => `<span>${escapeHtml(note)}</span>`).join("")}
        </div>
        <aside class="advanced-experiment__prompt" data-advanced-prompt>
          <div class="advanced-experiment__panel-title"><span>Advanced build prompt</span><button type="button" data-advanced-copy-prompt>Copy prompt</button></div>
          <p>${escapeHtml(experiment.prompt)}</p>
        </aside>
        <div class="advanced-code">
          <div class="advanced-code__header">
            <div role="tablist" aria-label="${escapeHtml(experiment.title)} code">
              <button type="button" role="tab" aria-selected="true" tabindex="0" data-advanced-code-tab="html">HTML</button>
              <button type="button" role="tab" aria-selected="false" tabindex="-1" data-advanced-code-tab="css">CSS</button>
              <button type="button" role="tab" aria-selected="false" tabindex="-1" data-advanced-code-tab="js">JS</button>
            </div>
            <button type="button" data-advanced-copy-code>Copy code</button>
          </div>
          <pre tabindex="0"><code data-advanced-code-output></code></pre>
        </div>
        <div class="advanced-experiment__accessibility"><strong>Accessibility</strong>${experiment.accessibility.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      </div>`;

    const tabs = [...section.querySelectorAll("[data-advanced-code-tab]")];
    const output = section.querySelector("[data-advanced-code-output]");
    let active = "html";
    const renderCode = () => { output.textContent = experiment.source[active] || "// No JavaScript required."; };
    const activateTab = (tab, focus = false) => {
      active = tab.dataset.advancedCodeTab;
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      renderCode();
      if (focus) tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        activateTab(tabs[next], true);
      });
    });
    section.querySelector("[data-advanced-copy-prompt]").addEventListener("click", (event) => copyText(experiment.prompt, event.currentTarget));
    section.querySelector("[data-advanced-copy-code]").addEventListener("click", (event) => copyText(experiment.source[active] || "", event.currentTarget));
    renderCode();
    return section;
  }

  window.AdvancedComponentLab = {
    register(experiment) {
      if (!experiment?.id || ids.has(experiment.id)) throw new Error(`Duplicate or invalid advanced experiment id: ${experiment?.id || "unknown"}`);
      ids.add(experiment.id);
      experiments.push(experiment);
    },
    mountAll(target) {
      if (!target) return;
      experiments.sort((a, b) => a.number - b.number).forEach((experiment) => {
        const section = renderExperiment(experiment);
        target.append(section);
        try { experiment.init?.(section); } catch (error) { console.warn(`[AdvancedComponentLab] ${experiment.id} fallback`, error); }
      });
    },
    getExperiments() { return [...experiments]; },
  };
})();
