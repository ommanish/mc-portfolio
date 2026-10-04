(() => {
  const root = document.querySelector("[data-mx-reveal]");
  const replay = root?.querySelector("[data-mx-replay]");
  if (!root || !replay) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let safetyTimer;

  const reveal = () => {
    root.classList.add("is-visible");
    if (safetyTimer) {
      clearTimeout(safetyTimer);
      safetyTimer = null;
    }
  };

  const prepare = () => {
    root.classList.add("is-animated");
    root.classList.remove("is-visible");
    void root.offsetWidth;
  };

  const play = () => {
    if (reduce.matches) {
      root.classList.remove("is-animated");
      root.classList.add("is-visible");
      return;
    }
    prepare();
    requestAnimationFrame(() => requestAnimationFrame(reveal));
  };

  if (reduce.matches) {
    root.classList.add("is-visible");
  } else {
    prepare();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.unobserve(root);
      });
    }, { threshold: 0.12 });

    observer.observe(root);

    // Safety only: content is never allowed to remain hidden indefinitely.
    safetyTimer = setTimeout(reveal, 1200);
  }

  replay.addEventListener("click", play);
})();