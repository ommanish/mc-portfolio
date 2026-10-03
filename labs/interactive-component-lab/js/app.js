(() => {
  const exampleFiles = [
    "registry.js",
    "stacked-cards.js",
    "text-reveal.js",
    "word-reveal.js",
    "horizontal-carousel.js",
    "marquee.js",
    "scroll-progress.js",
    "sticky-content-swap.js",
    "image-mask-reveal.js",
    "hover-cards.js",
    "metric-counter.js",
    "accordion.js",
    "parallax-hero.js"
  ];

  function ensureExamplesCss() {
    if (document.querySelector('link[data-component-examples]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/labs/interactive-component-lab/css/examples.css";
    link.dataset.componentExamples = "true";
    document.head.append(link);
  }

  function loadScript(file) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `/labs/interactive-component-lab/js/examples/${file}`;
      script.dataset.componentExample = file;
      script.onload = resolve;
      script.onerror = reject;
      document.body.append(script);
    });
  }

  function setupLabTabs() {
    const tabs = [...document.querySelectorAll("[data-lab-tab]")];
    const panels = [...document.querySelectorAll("[data-lab-panel]")];
    if (!tabs.length || !panels.length) return;

    const activate = (name, moveFocus = false) => {
      tabs.forEach((tab) => {
        const selected = tab.dataset.labTab === name;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && moveFocus) tab.focus();
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.labPanel !== name;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab.dataset.labTab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        activate(tabs[nextIndex].dataset.labTab, true);
      });
    });
  }

  async function boot() {
    const root = document.querySelector('[data-lab="ai-command-center"]');
    const target = document.querySelector("[data-component-examples-root]");
    if (!root || !target) return;

    setupLabTabs();
    ensureExamplesCss();

    for (const file of exampleFiles) {
      try {
        await loadScript(file);
      } catch (error) {
        console.warn(`[InteractiveComponentLab] Failed to load ${file}`, error);
      }
    }

    window.InteractiveComponentLab?.mountAll?.(target);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
