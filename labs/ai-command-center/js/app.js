(() => {
  function loadExampleAssets() {
    if (!document.querySelector('link[data-component-examples]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/labs/ai-command-center/css/examples.css";
      link.dataset.componentExamples = "true";
      document.head.append(link);
    }

    if (!document.querySelector('script[data-stacked-cards-example]')) {
      const script = document.createElement("script");
      script.src = "/labs/ai-command-center/js/examples/stacked-cards.js";
      script.dataset.stackedCardsExample = "true";
      document.body.append(script);
    }
  }

  function boot() {
    const root = document.querySelector('[data-lab="ai-command-center"]');
    if (!root) return;

    loadExampleAssets();
    window.MotionLabMotion?.init?.();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => window.MotionLabMotion?.refresh?.(), 180);
    }, { passive: true });

    document.querySelector("[data-demo-send]")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const original = button.textContent;
      button.textContent = "Request analyzed ✓";
      setTimeout(() => { button.textContent = original; }, 1800);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
