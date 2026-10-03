(() => {
  const prompt = "Create an accessible animated accordion using semantic buttons, aria-expanded, aria-controls, and vanilla JavaScript. Panels must remain functional with animation disabled, keyboard activation must work naturally, content must not be hidden from assistive technology incorrectly, and prefers-reduced-motion should remove transition timing.";
  const html = `<div class="accordion"><h3><button aria-expanded="false" aria-controls="panel-1">What is this?</button></h3><div id="panel-1" hidden><p>An accessible disclosure panel.</p></div></div>`;
  const css = `.accordion [hidden]{display:none}.accordion__panel{overflow:hidden;transition:grid-template-rows .3s ease}@media(prefers-reduced-motion:reduce){.accordion__panel{transition:none}}`;
  const js = `document.querySelectorAll('.accordion button').forEach(button=>button.addEventListener('click',()=>{const panel=document.getElementById(button.getAttribute('aria-controls'));const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));panel.hidden=open}));`;
  window.InteractiveComponentLab.register({
    id: "accessible-accordion", number: 11, title: "Accessible Animated Accordion", tech: "CSS + Vanilla JS", prompt,
    description: "A keyboard-first disclosure pattern with motion layered on top of semantic behavior.",
    demo: `<div class="accordion-demo"><h3><button type="button" aria-expanded="true" aria-controls="lab-acc-1">Why use semantic buttons?</button></h3><div id="lab-acc-1"><p>They provide keyboard behavior and accessible roles without recreating them manually.</p></div><h3><button type="button" aria-expanded="false" aria-controls="lab-acc-2">What happens with reduced motion?</button></h3><div id="lab-acc-2" hidden><p>The panel opens immediately with no transition delay.</p></div></div>`,
    source: { html, css, js },
    accessibility: ["Semantic buttons and controlled panels", "aria-expanded reflects state", "Reduced motion keeps full functionality"],
    init(section) {
      section.querySelectorAll(".accordion-demo button").forEach((button) => button.addEventListener("click", () => {
        const panel = section.querySelector(`#${button.getAttribute("aria-controls")}`);
        const open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      }));
    }
  });
})();
