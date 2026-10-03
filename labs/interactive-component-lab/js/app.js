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

  const advancedFiles = [
    "/labs/interactive-component-lab/js/advanced/registry.js",
    "/labs/interactive-component-lab/js/advanced/animated-hero-headline.js",
    "/labs/interactive-component-lab/js/advanced/premium-hover-cards.js",
    "/labs/interactive-component-lab/js/advanced/image-reveal-section.js",
    "/labs/interactive-component-lab/js/advanced/animated-tabs.js",
    "/labs/interactive-component-lab/js/advanced/magnetic-cta.js",
    "/labs/interactive-component-lab/js/advanced/sticky-header-reveal.js",
    "/labs/interactive-component-lab/js/advanced/before-after-slider.js",
    "/labs/interactive-component-lab/js/advanced/timeline-reveal.js",
    "/labs/interactive-component-lab/js/advanced/logo-marquee.js",
    "/labs/interactive-component-lab/js/advanced/gallery-hover-preview.js",
    "/labs/interactive-component-lab/js/advanced/scroll-progress-indicator.js",
    "/labs/interactive-component-lab/js/advanced/section-color-transition.js"
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

  function loadAdvancedScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.dataset.advancedExperiment = src.split("/").pop();
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
      window.dispatchEvent(new CustomEvent("componentlab:collectionchange", { detail: { name } }));
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
    const advancedTarget = document.querySelector("[data-advanced-experiments-root]");
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

    let advancedMounted = false;
    let advancedLoading = false;

    const mountAdvanced = async () => {
      if (!advancedTarget || advancedMounted || advancedLoading) return;
      advancedLoading = true;

      for (const src of advancedFiles) {
        try {
          await loadAdvancedScript(src);
        } catch (error) {
          console.warn(`[AdvancedComponentLab] Failed to load ${src}`, error);
        }
      }

      window.AdvancedComponentLab?.mountAll?.(advancedTarget);
      advancedMounted = true;
      advancedLoading = false;
    };

    window.addEventListener("componentlab:collectionchange", (event) => {
      if (event.detail?.name === "advanced") mountAdvanced();
    });

    const advancedPanel = document.querySelector('[data-lab-panel="advanced"]');
    if (advancedPanel && !advancedPanel.hidden) mountAdvanced();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
