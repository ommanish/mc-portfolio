(() => {
  const stages = ["Intent", "Context", "Suggested Actions", "Review", "Execute"];
  const suggestions = [
    { title: "Prepare executive launch review", meta: "Uses launch plan, readiness signals, and open approvals", risk: "Review required" },
    { title: "Summarize unresolved dependencies", meta: "Highlights blockers, owners, and timing", risk: "Ready" },
    { title: "Draft stakeholder update", meta: "Builds a concise status narrative", risk: "Ready" },
  ];

  const demo = `
    <div class="command-palette" data-command-root>
      <div class="command-palette__ambient" aria-hidden="true"></div>
      <div class="command-palette__shell">
        <button class="command-palette__trigger" type="button" data-command-open aria-expanded="false"><span>⌘K</span><strong>Ask the workspace anything</strong><small>Command palette</small></button>
        <div class="command-palette__panel" data-command-panel hidden>
          <div class="command-palette__input-wrap">
            <span aria-hidden="true">✦</span>
            <input data-command-input role="combobox" aria-expanded="false" aria-controls="command-results" aria-activedescendant="command-option-0" autocomplete="off" value="Prepare this launch for executive review">
            <kbd>esc</kbd>
          </div>
          <div class="command-palette__stages" aria-label="Command progress">${stages.map((stage, index) => `<span class="${index === 0 ? "is-active" : ""}" data-command-stage="${index}">${stage}</span>`).join("")}</div>
          <div class="command-palette__body">
            <div id="command-results" class="command-palette__results" role="listbox" aria-label="Suggested actions">
              ${suggestions.map((item, index) => `<button id="command-option-${index}" type="button" role="option" aria-selected="${index === 0}" data-command-option="${index}"><span><strong>${item.title}</strong><small>${item.meta}</small></span><em>${item.risk}</em></button>`).join("")}
            </div>
            <aside class="command-palette__preview" data-command-preview aria-live="polite">
              <span>Intent</span><h3>Executive review</h3><p>Three context sources matched. Two actions are ready; one needs human approval.</p>
              <div class="command-palette__chips"><span>Launch plan</span><span>Readiness</span><span>Approvals</span></div>
              <div class="command-palette__approval" data-command-approval hidden><strong>Review before execution</strong><p>This action changes the launch review package.</p><div><button type="button" data-command-approve>Approve</button><button type="button" data-command-cancel>Cancel</button></div></div>
            </aside>
          </div>
        </div>
      </div>
    </div>`;

  const prompt = "Create an advanced AI command palette in semantic HTML, CSS, and vanilla JavaScript. Start as a compact command trigger and expand into a premium layered workspace. Model the visible flow as Intent → Context → Suggested Actions → Review → Execute. Provide keyboard navigation with ArrowUp/ArrowDown, Enter, Escape, aria-activedescendant, listbox/option semantics, contextual preview content, and a human approval boundary with Approve and Cancel actions. Use restrained geometry morphing, staggered reveals, and a single accent color. Reduced motion must remove stagger/transform animation while preserving every state and all keyboard functionality.";

  window.AdvancedComponentLab.register({
    id: "ai-command-palette", number: 2, title: "AI Command Palette", tech: "Vanilla JS · Combobox pattern · Stateful orchestration",
    description: "A command surface that turns natural-language intent into contextual actions, review states, and human-approved execution.",
    notes: ["Intent becomes structured product state", "Keyboard interaction mirrors pointer behavior", "Higher-impact actions pause at a human approval boundary"],
    prompt,
    demo,
    source: {
      html: `<div class="command-palette">\n  <button data-command-open aria-expanded="false">Open command palette</button>\n  <div data-command-panel hidden>\n    <input role="combobox" aria-controls="results" aria-activedescendant="command-option-0">\n    <div id="results" role="listbox">…</div>\n    <aside aria-live="polite">Review → Approve / Cancel</aside>\n  </div>\n</div>`,
      css: `.command-palette__panel{transform-origin:50% 0;animation:palette-in .45s cubic-bezier(.2,.8,.2,1)}.command-palette__results [aria-selected="true"]{transform:translateX(6px);border-color:var(--advanced-accent)}@media(prefers-reduced-motion:reduce){.command-palette *{animation:none!important;transition:none!important;transform:none!important}}`,
      js: `const trigger=root.querySelector('[data-command-open]');\nconst panel=root.querySelector('[data-command-panel]');\nfunction setOpen(open){panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(open)input.focus()}\ntrigger.addEventListener('click',()=>setOpen(panel.hidden));\ninput.addEventListener('keydown',event=>{if(event.key==='ArrowDown')setActive(active+1);if(event.key==='ArrowUp')setActive(active-1);if(event.key==='Enter')select(active);if(event.key==='Escape')setOpen(false)});`,
    },
    accessibility: ["Combobox exposes aria-activedescendant and listbox state", "Arrow keys, Enter and Escape work without a pointer", "Reduced motion keeps state changes immediate and fully functional"],
    init(section) {
      const root = section.querySelector("[data-command-root]");
      const trigger = root.querySelector("[data-command-open]");
      const panel = root.querySelector("[data-command-panel]");
      const input = root.querySelector("[data-command-input]");
      const options = [...root.querySelectorAll("[data-command-option]")];
      const stagesEls = [...root.querySelectorAll("[data-command-stage]")];
      const preview = root.querySelector("[data-command-preview]");
      const approval = root.querySelector("[data-command-approval]");
      let active = 0;

      const setStage = (index) => stagesEls.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex <= index));
      const setOpen = (open) => {
        panel.hidden = !open;
        trigger.setAttribute("aria-expanded", String(open));
        input.setAttribute("aria-expanded", String(open));
        if (open) window.requestAnimationFrame(() => input.focus());
        else { approval.hidden = true; setStage(0); trigger.focus(); }
      };
      const setActive = (index) => {
        active = (index + options.length) % options.length;
        options.forEach((option, optionIndex) => option.setAttribute("aria-selected", String(optionIndex === active)));
        input.setAttribute("aria-activedescendant", options[active].id);
        const item = suggestions[active];
        preview.querySelector("h3").textContent = item.title;
        preview.querySelector("p").textContent = item.meta;
        setStage(Math.min(active + 1, 2));
      };
      const select = () => {
        setStage(3);
        approval.hidden = false;
        approval.querySelector("strong").textContent = suggestions[active].risk === "Ready" ? "Ready to execute" : "Review before execution";
      };

      trigger.addEventListener("click", () => setOpen(panel.hidden));
      options.forEach((option, index) => {
        option.addEventListener("pointerenter", () => setActive(index));
        option.addEventListener("click", () => { setActive(index); select(); });
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") { event.preventDefault(); setActive(active + 1); }
        if (event.key === "ArrowUp") { event.preventDefault(); setActive(active - 1); }
        if (event.key === "Enter") { event.preventDefault(); select(); }
        if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      });
      root.querySelector("[data-command-approve]").addEventListener("click", () => { setStage(4); approval.innerHTML = "<strong>Executed</strong><p>The approved action is now in progress.</p>"; });
      root.querySelector("[data-command-cancel]").addEventListener("click", () => { approval.hidden = true; setStage(2); input.focus(); });
      setActive(0);
      setOpen(false);
    },
  });
})();
