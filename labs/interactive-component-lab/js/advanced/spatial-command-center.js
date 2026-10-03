(() => {
  const views = {
    Overview: { metric: "84%", label: "Launch readiness", tone: "Stable", detail: "12 workstreams aligned", activity: ["Executive brief updated", "3 dependencies cleared", "Risk review complete"] },
    Signals: { metric: "27", label: "Live signals", tone: "Watching", detail: "5 require attention", activity: ["Adoption trend accelerated", "Support volume normalized", "Partner signal changed"] },
    Decisions: { metric: "06", label: "Open decisions", tone: "Review", detail: "2 need approval today", activity: ["Pricing recommendation ready", "Launch market narrowed", "Content exception pending"] },
    Actions: { metric: "18", label: "Active actions", tone: "Moving", detail: "76% progressing", activity: ["Enablement package assigned", "Launch page queued", "Analytics validation running"] },
  };

  const demo = `
    <div class="spatial-command" data-spatial-root>
      <aside class="spatial-command__rail" aria-label="Workspace views">
        <span class="spatial-command__brand">SC</span>
        <div role="tablist" aria-label="Command Center views">
          ${Object.keys(views).map((view, index) => `<button type="button" role="tab" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-spatial-view="${view}"><span>${view.slice(0, 2)}</span><small>${view}</small></button>`).join("")}
        </div>
      </aside>
      <div class="spatial-command__scene">
        <div class="spatial-command__backdrop spatial-command__backdrop--one" aria-hidden="true"></div>
        <div class="spatial-command__backdrop spatial-command__backdrop--two" aria-hidden="true"></div>
        <section class="spatial-command__workspace" aria-live="polite">
          <header><div><span class="spatial-command__eyebrow">Command Center</span><h3 data-spatial-title>Overview</h3></div><span class="spatial-command__status" data-spatial-status>Stable</span></header>
          <div class="spatial-command__metric"><strong data-spatial-metric>84%</strong><span data-spatial-label>Launch readiness</span><small data-spatial-detail>12 workstreams aligned</small></div>
          <div class="spatial-command__activity" data-spatial-activity></div>
          <div class="spatial-command__command">
            <label for="spatial-command-input">Ask the workspace</label>
            <div><input id="spatial-command-input" data-spatial-command placeholder="Summarize what needs attention" autocomplete="off"><button type="button" data-spatial-run>Run</button></div>
            <p data-spatial-response>Try “show next decision” or switch views.</p>
          </div>
        </section>
        <aside class="spatial-command__context" aria-label="Context panel">
          <span>Context</span><strong data-spatial-context>Launch orchestration</strong><div class="spatial-command__signal"><i></i><b>Live</b></div>
        </aside>
      </div>
    </div>`;

  const prompt = "Build a premium spatial command center in semantic HTML, modern CSS, and vanilla JavaScript. Use a narrow navigation rail, a layered perspective workspace, contextual side panel, and four keyboard-accessible states: Overview, Signals, Decisions, and Actions. State changes should reorganize content with subtle translateZ, scale, blur, and opacity—not dramatic 3D rotation. Include a contextual command input, live status feedback, logical DOM order, visible focus styles, responsive collapse below tablet width, and a reduced motion mode that removes depth transforms while preserving all content and state changes.";

  window.AdvancedComponentLab.register({
    id: "spatial-command-center", number: 1, title: "Spatial Command Center", tech: "CSS perspective · Vanilla JS · State orchestration",
    description: "A layered product workspace where navigation, context, metrics, and commands reorganize around the active decision state.",
    notes: ["Four connected workspace states", "Depth communicates hierarchy rather than decoration", "Keyboard and reduced motion remain first-class"],
    prompt,
    demo,
    source: {
      html: `<div class="spatial-command">\n  <aside aria-label="Workspace views">…</aside>\n  <section aria-live="polite">\n    <h3>Overview</h3>\n    <div class="metric">84%</div>\n    <input aria-label="Ask the workspace">\n  </section>\n</div>`,
      css: `.spatial-command__scene{perspective:1200px}.spatial-command__workspace{transform:translateZ(36px);transition:transform .65s cubic-bezier(.2,.8,.2,1),filter .65s ease}.spatial-command[data-view="Signals"] .spatial-command__workspace{transform:translate3d(-18px,-4px,52px)}@media(prefers-reduced-motion:reduce){.spatial-command__workspace{transform:none!important;transition:none}}`,
      js: `const tabs=[...root.querySelectorAll('[data-spatial-view]')];\nfunction activate(view){root.dataset.view=view;render(view)}\ntabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab.dataset.spatialView));tab.addEventListener('keydown',e=>{/* Arrow key roving focus */})});`,
    },
    accessibility: ["Roving tab focus for workspace states", "aria-live announces active content changes", "Reduced motion removes depth transforms without hiding information"],
    init(section) {
      const root = section.querySelector("[data-spatial-root]");
      const tabs = [...root.querySelectorAll("[data-spatial-view]")];
      const activity = root.querySelector("[data-spatial-activity]");
      const fields = {
        title: root.querySelector("[data-spatial-title]"), metric: root.querySelector("[data-spatial-metric]"), label: root.querySelector("[data-spatial-label]"), detail: root.querySelector("[data-spatial-detail]"), status: root.querySelector("[data-spatial-status]"),
      };
      const render = (name) => {
        const view = views[name];
        root.dataset.view = name;
        fields.title.textContent = name; fields.metric.textContent = view.metric; fields.label.textContent = view.label; fields.detail.textContent = view.detail; fields.status.textContent = view.tone;
        activity.innerHTML = view.activity.map((item, index) => `<article><span>0${index + 1}</span><p>${item}</p></article>`).join("");
        root.querySelector("[data-spatial-context]").textContent = `${name} intelligence`;
        tabs.forEach((tab) => { const selected = tab.dataset.spatialView === name; tab.setAttribute("aria-selected", String(selected)); tab.tabIndex = selected ? 0 : -1; });
      };
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => render(tab.dataset.spatialView));
        tab.addEventListener("keydown", (event) => {
          if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          let next = index;
          if (event.key === "ArrowDown") next = (index + 1) % tabs.length;
          if (event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = tabs.length - 1;
          tabs[next].focus(); render(tabs[next].dataset.spatialView);
        });
      });
      root.querySelector("[data-spatial-run]").addEventListener("click", () => {
        const input = root.querySelector("[data-spatial-command]");
        root.querySelector("[data-spatial-response]").textContent = input.value.trim() ? `Working from ${root.dataset.view}: “${input.value.trim()}”` : "Add a command to orchestrate this workspace.";
      });
      render("Overview");
    },
  });
})();
