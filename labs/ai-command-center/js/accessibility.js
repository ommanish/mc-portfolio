(() => {
  const root = document.querySelector('[data-lab="ai-command-center"]');
  const prefs = window.MotionLabPreferences;
  if (!root || !prefs) return;

  const panel = document.querySelector("[data-settings-panel]");
  const toggles = document.querySelectorAll("[data-settings-toggle], [data-settings-open]");
  const close = document.querySelector("[data-settings-close]");
  let returnFocus = null;

  function setPanel(open, trigger) {
    if (!panel) return;
    if (open) {
      returnFocus = trigger || document.activeElement;
      panel.hidden = false;
      document.querySelector("[data-settings-toggle]")?.setAttribute("aria-expanded", "true");
      panel.querySelector("button")?.focus();
    } else {
      panel.hidden = true;
      document.querySelector("[data-settings-toggle]")?.setAttribute("aria-expanded", "false");
      returnFocus?.focus?.();
    }
  }

  toggles.forEach((button) => button.addEventListener("click", () => setPanel(true, button)));
  close?.addEventListener("click", () => setPanel(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel && !panel.hidden) setPanel(false);
  });

  document.querySelectorAll("[data-theme-value]").forEach((button) => button.addEventListener("click", () => prefs.setTheme(button.dataset.themeValue)));
  document.querySelectorAll("[data-motion-value]").forEach((button) => button.addEventListener("click", () => prefs.setMotion(button.dataset.motionValue)));
  document.querySelectorAll("[data-contrast-value]").forEach((button) => button.addEventListener("click", () => prefs.setContrast(button.dataset.contrastValue)));

  const pause = document.querySelector("[data-pause-toggle]");
  pause?.addEventListener("click", () => {
    const current = prefs.get();
    prefs.setPaused(!current.paused);
  });

  prefs.subscribe((state) => {
    document.querySelectorAll("[data-theme-value]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.themeValue === state.theme)));
    document.querySelectorAll("[data-motion-value]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.motionValue === state.motion)));
    document.querySelectorAll("[data-contrast-value]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.contrastValue === state.contrast)));
    if (pause) {
      pause.setAttribute("aria-pressed", String(state.paused));
      pause.textContent = state.paused ? "Resume animation" : "Pause animation";
    }
  });

  const initial = prefs.get();
  prefs.setTheme(initial.theme);
})();
