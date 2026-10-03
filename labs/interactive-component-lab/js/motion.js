(() => {
  const root = document.querySelector('[data-lab="ai-command-center"]');
  const prefs = window.MotionLabPreferences;
  const contexts = new Map();
  const timelines = new Set();
  let initialized = false;
  let unsubscribe = null;

  function hasMotionRuntime() { return Boolean(window.gsap && window.ScrollTrigger); }
  function shouldReduce() { return !prefs || prefs.get().motion === "reduced"; }
  function addTimeline(timeline) { if (timeline) timelines.add(timeline); return timeline; }

  function clearChapter(id) {
    const context = contexts.get(id);
    if (context) { context.revert(); contexts.delete(id); }
  }

  function clearAll() {
    contexts.forEach((context) => context.revert());
    contexts.clear();
    timelines.forEach((timeline) => { try { timeline.kill?.(); } catch {} });
    timelines.clear();
    window.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.kill());
    root?.classList.remove("motion-ready");
  }

  function ensurePreferenceSubscription() {
    if (unsubscribe || !prefs) return;
    unsubscribe = prefs.subscribe((state) => {
      if (state.motion === "reduced") {
        clearAll();
        initialized = false;
        return;
      }
      if (!initialized && !state.paused) init();
      state.paused ? pause() : resume();
    });
  }

  function revealChapter(chapter) {
    const id = chapter.dataset.chapter;
    const context = window.gsap.context(() => {
      const reveal = chapter.querySelectorAll("[data-motion-reveal]");
      const panels = chapter.querySelectorAll("[data-motion-panel]");
      const nodes = chapter.querySelectorAll("[data-motion-node]");
      if (reveal.length) addTimeline(window.gsap.from(reveal, { y:46, opacity:0, duration:.9, ease:"power3.out", stagger:.08, scrollTrigger:{ trigger:chapter, start:"top 76%", once:true } }));
      if (panels.length) addTimeline(window.gsap.from(panels, { y:34, opacity:0, duration:.72, ease:"power2.out", stagger:.08, scrollTrigger:{ trigger:panels[0], start:"top 82%", once:true } }));
      if (nodes.length) addTimeline(window.gsap.from(nodes, { scale:.88, opacity:0, duration:.72, stagger:.12, ease:"back.out(1.3)", scrollTrigger:{ trigger:chapter, start:"top 66%", once:true } }));
    }, chapter);
    contexts.set(id, context);
  }

  function cinematicProcessing() {
    const chapter = document.querySelector('[data-chapter="processing"]');
    if (!chapter) return;
    const context = window.gsap.context(() => {
      const paths = chapter.querySelectorAll("[data-motion-path]");
      paths.forEach((path) => {
        const length = path.getTotalLength?.() || 600;
        window.gsap.set(path, { strokeDasharray:length, strokeDashoffset:length });
      });
      addTimeline(window.gsap.timeline({ scrollTrigger:{ trigger:chapter, start:"top top", end:"+=85%", scrub:.7, pin:window.innerWidth > 980 } })
        .to(paths, { strokeDashoffset:0, ease:"none", stagger:.05 }, 0)
        .from(".orchestration-core", { scale:.78, opacity:.45, ease:"power2.out" }, 0));
    }, chapter);
    contexts.set("processing-cinematic", context);
  }

  function cinematicWorkspace() {
    const chapter = document.querySelector('[data-chapter="workspace"]');
    if (!chapter) return;
    const context = window.gsap.context(() => {
      addTimeline(window.gsap.timeline({ scrollTrigger:{ trigger:chapter, start:"top 72%", end:"center 45%", scrub:.6 } })
        .from("[data-motion-command-grid] > *", { y:70, scale:.94, opacity:.2, stagger:.06, ease:"none" }));
    }, chapter);
    contexts.set("workspace-cinematic", context);
  }

  function cinematicFinal() {
    const chapter = document.querySelector('[data-chapter="command-center"]');
    if (!chapter) return;
    const context = window.gsap.context(() => {
      addTimeline(window.gsap.timeline({ scrollTrigger:{ trigger:chapter, start:"top 72%", end:"center 42%", scrub:.65 } })
        .from("[data-motion-final]", { scale:.93, y:72, opacity:.2, ease:"none" })
        .from(".console-rail button", { x:-20, opacity:0, stagger:.04, ease:"none" }, .15)
        .from(".console-kpis > div", { y:28, opacity:0, stagger:.05, ease:"none" }, .24));
    }, chapter);
    contexts.set("command-center-cinematic", context);
  }

  function storyThemeTriggers() {
    document.querySelectorAll("[data-story-theme]").forEach((chapter) => {
      window.ScrollTrigger.create({
        trigger:chapter, start:"top 52%", end:"bottom 48%",
        onEnter:() => { const current = prefs.get(); if (current.theme === "auto") prefs.setStoryTheme(chapter.dataset.storyTheme); },
        onEnterBack:() => { const current = prefs.get(); if (current.theme === "auto") prefs.setStoryTheme(chapter.dataset.storyTheme); },
      });
    });
  }

  function progressTrigger() {
    const bar = document.querySelector("[data-progress-bar]");
    if (!bar) return;
    window.ScrollTrigger.create({ trigger:document.body, start:"top top", end:"bottom bottom", onUpdate:(self) => { bar.style.width = `${Math.round(self.progress * 100)}%`; } });
  }

  function init() {
    if (!root || initialized) return;
    ensurePreferenceSubscription();
    if (!hasMotionRuntime() || shouldReduce() || prefs?.get().paused) {
      root?.classList.remove("motion-ready");
      initialized = false;
      return;
    }
    window.gsap.registerPlugin(window.ScrollTrigger);
    root.classList.add("motion-ready");
    document.querySelectorAll("[data-chapter]").forEach(revealChapter);
    cinematicProcessing();
    cinematicWorkspace();
    cinematicFinal();
    storyThemeTriggers();
    progressTrigger();
    initialized = true;
  }

  function refresh() { if (shouldReduce() || !hasMotionRuntime()) return; window.ScrollTrigger.refresh(); }
  function pause() { timelines.forEach((timeline) => timeline.pause?.()); }
  function resume() { if (prefs?.get().paused || shouldReduce()) return; timelines.forEach((timeline) => timeline.resume?.()); }
  function destroy() { clearAll(); unsubscribe?.(); unsubscribe = null; initialized = false; }

  window.MotionLabMotion = { init, refresh, pause, resume, destroy, clearChapter };
})();
