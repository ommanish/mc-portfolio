(() => {
  const demo = '<div class="magnetic-cta-demo"><button class="magnetic-cta" data-magnetic-cta><span>Start a project</span><b aria-hidden="true">↗</b></button><p>Move your pointer near the button.</p></div>';
  window.AdvancedComponentLab.register({
    id:"magnetic-cta",number:5,title:"Magnetic CTA Button",tech:"Pointer Events · Micro-interaction",
    description:"A restrained magnetic CTA with text/arrow motion for hero sections and conversion moments.",
    notes:["Best for primary CTAs","Movement is subtle and optional","Touch users keep a normal button"],
    prompt:"Create a premium magnetic CTA button for a marketing page using Pointer Events and CSS transforms. Keep movement subtle, animate the arrow independently, reset on pointer leave, and disable motion for reduced-motion users.",
    demo,source:{html:'<button class="magnetic-cta"><span>Start a project</span><b>↗</b></button>',css:'.magnetic-cta{transition:transform .2s ease}',js:'button.addEventListener("pointermove",...)'},
    accessibility:["Native button remains fully usable","Motion is decorative only","Reduced motion disables magnetic transforms"],
    init(section){const b=section.querySelector("[data-magnetic-cta]");b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.16,y=(e.clientY-r.top-r.height/2)*.16;b.style.transform="translate("+x+"px,"+y+"px)";});b.addEventListener("pointerleave",()=>b.style.transform="");}
  });
})();