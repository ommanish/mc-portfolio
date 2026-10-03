(() => {
  function boot() {
    window.MotionLabMotion?.init?.();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
