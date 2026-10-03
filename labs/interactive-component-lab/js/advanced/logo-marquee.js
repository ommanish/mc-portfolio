(() => {
  const logos = ["ACME", "NOVA", "ORBIT", "FRAME", "SHIFT"];
  const group = (hidden = false) => `<div class="brand-marquee__group"${hidden ? ' aria-hidden="true"' : ""}>${logos.map((logo) => `<span>${logo}</span>`).join("")}</div>`;
  const demo = `<div class="brand-marquee" data-brand-marquee><div class="brand-marquee__viewport"><div class="brand-marquee__track" data-marquee-track>${group()}${group(true)}</div></div><button type="button" data-marquee-toggle aria-pressed="false">Pause</button></div>`;

  window.AdvancedComponentLab.register({
    id:"logo-marquee",number:9,title:"Logo / Client Marquee",tech:"CSS keyframes · Seamless groups · Pause control",
    description:"A seamless infinite marquee for logos, partners, technologies, or social proof.",
    notes:["Two identical groups create an exact repeat point","Hover and the control can pause movement","Edge fades soften the loop"],
    prompt:"Create a seamless infinite logo marquee using two identical flex groups inside one animated track. Each group must have the same width and spacing so translating the track by exactly one group width loops without a jump. Add edge fades, pause on hover, a keyboard-accessible Pause/Play control, responsive spacing, and reduced-motion fallback.",
    demo,
    source:{html:'<div class="brand-marquee__track"><div class="group">...</div><div class="group" aria-hidden="true">...</div></div>',css:'@keyframes brand-marquee{to{transform:translateX(-50%)}}',js:'toggle.addEventListener("click",...)'},
    accessibility:["Repeated second group is hidden from assistive technology","Pause/Play is keyboard accessible","Reduced motion stops autoplay"],
    init(section){
      const root=section.querySelector("[data-brand-marquee]");
      const btn=root.querySelector("[data-marquee-toggle]");
      btn.addEventListener("click",()=>{const paused=root.classList.toggle("is-paused");btn.textContent=paused?"Play":"Pause";btn.setAttribute("aria-pressed",String(paused));});
    }
  });
})();