(() => {
  const card = document.querySelector('[data-component="kinetic-hero"]');
  if (!card) return;

  const frame = card.querySelector("[data-component-frame]");
  const reload = card.querySelector("[data-reload-demo]");
  const output = card.querySelector("[data-source-output]");
  const tabs = [...card.querySelectorAll("[data-source-tab]")];
  const copyCurrent = card.querySelector("[data-copy-current]");
  const copyAll = card.querySelector("[data-copy-all]");

  const files = {
    html: "./components/kinetic-hero/index.html",
    css: "./components/kinetic-hero/style.css",
    js: "./components/kinetic-hero/script.js"
  };

  const source = {};
  let active = "html";

  async function loadSource() {
    const entries = await Promise.all(
      Object.entries(files).map(async ([key, url]) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        return [key, await response.text()];
      })
    );
    Object.assign(source, Object.fromEntries(entries));
    renderSource();
  }

  function renderSource() {
    output.textContent = source[active] || "Loading exact source…";
  }

  function activate(tab, moveFocus = false) {
    active = tab.dataset.sourceTab;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    renderSource();
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      activate(tabs[next], true);
    });
  });

  reload.addEventListener("click", () => {
    frame.src = frame.src;
  });

  async function copyText(text, button) {
    await navigator.clipboard.writeText(text);
    const original = button.textContent;
    button.textContent = "Copied ✓";
    window.setTimeout(() => { button.textContent = original; }, 1200);
  }

  copyCurrent.addEventListener("click", () => copyText(source[active] || "", copyCurrent));

  copyAll.addEventListener("click", () => {
    const standalone = `<!-- HTML -->
${source.html || ""}

/* CSS */
${source.css || ""}

// JavaScript
${source.js || ""}`;
    copyText(standalone, copyAll);
  });

  loadSource().catch((error) => {
    output.textContent = "Could not load source. " + error.message;
  });
})();
