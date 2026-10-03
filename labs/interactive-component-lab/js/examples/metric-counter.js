(() => {
  const prompt = "Create an accessible animated metric counter with semantic final values in the DOM. Use vanilla JavaScript to animate from zero only when the metric becomes visible, keep the final value understandable without JavaScript, support percentage and compact-number formatting, and jump directly to the final value for prefers-reduced-motion users.";
  const html = `<div class="metrics"><article><span class="metric" data-value="94" data-suffix="%">94%</span><p>Readiness</p></article><article><span class="metric" data-value="1200" data-format="compact">1.2K</span><p>Sources analyzed</p></article></div>`;
  const css = `.metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}.metric{font-size:clamp(2.5rem,7vw,5rem);font-weight:900}`;
  const js = `document.querySelectorAll('.metric').forEach(metric=>{const final=Number(metric.dataset.value);const suffix=metric.dataset.suffix||'';if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;let start;function tick(time){start??=time;const p=Math.min(1,(time-start)/900);metric.textContent=Math.round(final*p)+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)});`;
  window.InteractiveComponentLab.register({
    id: "metric-counter", number: 10, title: "Animated Metric Counter", tech: "Vanilla JS", prompt,
    description: "Metrics animate as progressive enhancement while the final semantic values stay available.",
    demo: `<div class="metric-demo"><article><strong data-counter data-value="94" data-suffix="%">94%</strong><span>Readiness</span></article><article><strong data-counter data-value="1200" data-compact="true">1.2K</strong><span>Signals processed</span></article><article><strong data-counter data-value="3">3</strong><span>Open decisions</span></article></div>`,
    source: { html, css, js },
    accessibility: ["Final values exist before JavaScript runs", "Animation is supplementary", "Reduced motion preserves the final value immediately"],
    init(section) {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const counters = [...section.querySelectorAll("[data-counter]")];
      const run = (el) => {
        const final = Number(el.dataset.value); const suffix = el.dataset.suffix || ""; const compact = el.dataset.compact === "true";
        const format = (value) => compact && value >= 1000 ? `${(value / 1000).toFixed(1)}K` : `${Math.round(value)}${suffix}`;
        let start;
        const tick = (time) => { start ??= time; const progress = Math.min(1, (time - start) / 850); el.textContent = format(final * progress); if (progress < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      };
      if (!("IntersectionObserver" in window)) return counters.forEach(run);
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { run(entry.target); observer.unobserve(entry.target); } }), { threshold: .6 });
      counters.forEach((counter) => observer.observe(counter));
    }
  });
})();
