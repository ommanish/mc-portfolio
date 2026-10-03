(() => {
  function boot() {
    const root = document.querySelector('[data-lab="ai-command-center"]');
    if (!root) return;

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
