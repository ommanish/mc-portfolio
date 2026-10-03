(() => {
  const demo = '<div class="magnetic-cta-demo" data-magnetic-zone><button class="magnetic-cta" data-magnetic-cta><span>Start a project</span><b aria-hidden="true">↗</b></button><p>Move your pointer near the button.</p></div>';
  window.AdvancedComponentLab.register({
    id:"magnetic-cta",number:5,title:"Magnetic CTA Button",tech:"Pointer Events · Proximity micro-interaction",
    description:"A restrained magnetic CTA with text/arrow motion for hero sections and conversion moments.",
    notes:["Best for primary CTAs","Movement reacts within the surrounding zone","Touch and reduced-motion users keep a normal button"],
    prompt:"Create a premium magnetic CTA button for a marketing page using a surrounding pointer-tracking zone rather than requiring the pointer to be directly over the button. Keep movement subtle, reset cleanly on pointer leave, and completely disable transforms for reduced-motion users.",
    demo,source:{html:'<div data-magnetic-zone><button class="magnetic-cta">Start a project</button></div>',css:'.magnetic-cta{transition:transform .2s ease}',js:'zone.addEventListener("pointermove",...)'},
    accessibility:["Native button remains fully usable","Motion is decorative only","Reduced motion disables magnetic transforms"],
    init(section){
      const zone=section.querySelector("[data-magnetic-zone]"),b=section.querySelector("[data-magnetic-cta]");
      const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||document.querySelector(".lab-shell")?.dataset.motion==="reduced";
      if(reduced)return;
      zone.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,dist=Math.hypot(dx,dy),radius=150;if(dist>radius){b.style.transform="";return;}const strength=(1-dist/radius)*.18;b.style.transform="translate("+(dx*strength)+"px,"+(dy*strength)+"px)";});
      zone.addEventListener("pointerleave",()=>b.style.transform="");
    }
  });
})();