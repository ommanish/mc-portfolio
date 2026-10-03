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
    link.href = "/labs/ai-command-center/css/examples.css";
    link.dataset.componentExamples = "true";
    document.head.append(link);
  }

  function loadScript(file) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `/labs/ai-command-center/js/examples/${file}`;
      script.dataset.componentExample = file;
      script.onload = resolve;
      script.onerror = reject;
      document.body.append(script);
    });
  }

  async function boot() {
    const root = document.querySelector('[data-lab="ai-command-center"]');
    const target = document.querySelector("[data-component-examples-root]");
    if (!root || !target) return;

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
