(() => {
  const demo='<div class="brand-marquee" data-brand-marquee><div class="brand-marquee__track"><span>ACME</span><span>NOVA</span><span>ORBIT</span><span>FRAME</span><span>SHIFT</span><span>ACME</span><span>NOVA</span><span>ORBIT</span><span>FRAME</span><span>SHIFT</span></div><button type="button" data-marquee-toggle>Pause</button></div>';
  window.AdvancedComponentLab.register({
    id:"logo-marquee",number:9,title:"Logo / Client Marquee",tech:"CSS keyframes · Pause control",
    description:"A clean infinite marquee for logos, partners, technologies, or social proof.",
    notes:["Useful for trust sections","Edge fades soften the loop","Includes pause control"],
    prompt:"Create an infinite logo marquee for a landing page with seamless looping, edge fades, pause-on-hover, a visible pause/play control, and reduced-motion fallback.",
    demo,source:{html:'<div class="brand-marquee"><div class="track">...</div></div>',css:'@keyframes marquee{to{transform:translateX(-50%)}}',js:'toggle.addEventListener("click",...)'},
    accessibility:["Pause control is keyboard accessible","Reduced motion stops autoplay","Repeated labels are decorative visual repetition"],
    init(section){const root=section.querySelector("[data-brand-marquee]"),btn=root.querySelector("[data-marquee-toggle]");btn.addEventListener("click",()=>{const paused=root.classList.toggle("is-paused");btn.textContent=paused?"Play":"Pause";});}
  });
})();