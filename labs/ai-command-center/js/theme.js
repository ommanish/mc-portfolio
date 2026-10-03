(() => {
  const root = document.querySelector('[data-lab="ai-command-center"]');
  if (!root) return;

  const STORAGE_KEY = "motionLabPreferences";
  const valid = {
    theme: new Set(["auto", "light", "dark"]),
    motion: new Set(["full", "reduced"]),
    contrast: new Set(["standard", "high"]),
  };
  const subscribers = new Set();
  const media = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  function loadStored() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  }

  const stored = loadStored();
  const state = {
    theme: valid.theme.has(stored.theme) ? stored.theme : "auto",
    motion: valid.motion.has(stored.motion) ? stored.motion : (media.matches ? "reduced" : "full"),
    contrast: valid.contrast.has(stored.contrast) ? stored.contrast : "standard",
    paused: Boolean(stored.paused),
    storyTheme: "light",
  };

  function persist() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: state.theme, motion: state.motion, contrast: state.contrast, paused: state.paused }));
    } catch {}
  }
  function effectiveTheme() { return state.theme === "auto" ? state.storyTheme : state.theme; }
  function apply() {
    root.dataset.theme = effectiveTheme();
    root.dataset.motion = state.motion;
    root.dataset.contrast = state.contrast;
    root.dataset.paused = String(state.paused);
    subscribers.forEach((callback) => callback({ ...state, effectiveTheme: effectiveTheme() }));
  }
  function setTheme(value) { if (!valid.theme.has(value)) return; state.theme = value; persist(); apply(); }
  function setStoryTheme(value) { if (!valid.theme.has(value) || value === "auto") return; state.storyTheme = value; if (state.theme === "auto") apply(); }
  function setMotion(value) { if (!valid.motion.has(value)) return; state.motion = value; persist(); apply(); }
  function setContrast(value) { if (!valid.contrast.has(value)) return; state.contrast = value; persist(); apply(); }
  function setPaused(value) { state.paused = Boolean(value); persist(); apply(); }

  window.MotionLabPreferences = {
    get: () => ({ ...state, effectiveTheme: effectiveTheme() }),
    setTheme, setStoryTheme, setMotion, setContrast, setPaused,
    subscribe(callback) { subscribers.add(callback); return () => subscribers.delete(callback); },
  };
  apply();
})();
