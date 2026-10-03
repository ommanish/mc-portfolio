(() => {
  const words=["Design","experiences","people","remember."];
  const demo=`<section class="rich-hero" data-rich-hero><div class="rich-hero__orb" aria-hidden="true"></div><span class="rich-hero__eyebrow">Motion system · Hero pattern</span><h3>${words.map((w,i)=>`<span class="rich-hero__mask"><span class="rich-hero__word ${i===2?"is-accent":""}">${w}</span></span>`).join(" ")}</h3><p>Layered typography, floating media, CTA choreography, and replayable motion for real landing pages.</p><div class="rich-hero__actions"><a href="#animated-hero-headline">Explore the pattern <span>↗</span></a><button type="button" data-rich-hero-replay>Replay animation</button></div><div class="rich-hero__media" aria-hidden="true"><i></i><b></b><span></span></div><div class="rich-hero__scroll">Scroll to explore <i></i></div></section>`;
  window.AdvancedComponentLab.register({
    id:"animated-hero-headline",number:1,title:"Animated Hero Headline",tech:"Web Animations API · Layered hero motion",
    description:"A richer hero pattern combining masked text, floating media, CTA sequencing, accent movement, and replay.",
    notes:["Multiple coordinated motion layers","Useful for product launches, campaigns, and portfolios","Replayable without refreshing"],
    prompt:"Create a premium hero with masked multi-line headline reveals, accent word treatment, layered floating media, CTA entrance, subtle parallax, and replay. Keep the motion coordinated, responsive, and reduced-motion safe.",
    demo,source:{html:'<section class="rich-hero">...</section>',css:'.rich-hero__mask{overflow:hidden}.rich-hero__word{display:inline-block}',js:'element.animate(keyframes, options)'},
    accessibility:["Headline remains real readable text","Replay is a native button","Reduced motion shows the final state immediately"],
    init(section){
      const root=section.querySelector("[data-rich-hero]"), replay=root.querySelector("[data-rich-hero-replay]"), words=[...root.querySelectorAll(".rich-hero__word")], media=root.querySelector(".rich-hero__media"), orb=root.querySelector(".rich-hero__orb");
      const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||document.querySelector(".lab-shell")?.dataset.motion==="reduced";
      const play=()=>{if(reduced)return;[...root.querySelectorAll("*")].forEach(el=>el.getAnimations?.().forEach(a=>a.cancel()));words.forEach((w,i)=>w.animate([{transform:"translateY(115%)",opacity:0},{transform:"translateY(0)",opacity:1}],{duration:760,delay:i*110,easing:"cubic-bezier(.2,.8,.2,1)",fill:"both"}));media.animate([{opacity:0,transform:"translate(30px,30px) scale(.92) rotate(5deg)"},{opacity:1,transform:"none"}],{duration:900,delay:360,easing:"cubic-bezier(.2,.8,.2,1)",fill:"both"});orb.animate([{transform:"scale(.6)",opacity:0},{transform:"scale(1)",opacity:1}],{duration:900,delay:180,fill:"both"});};
      root.addEventListener("pointermove",e=>{if(reduced)return;const r=root.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;media.style.transform=`translate(${x*14}px,${y*14}px)`;orb.style.transform=`translate(${x*-18}px,${y*-18}px)`;});
      root.addEventListener("pointerleave",()=>{media.style.transform="";orb.style.transform="";}); replay.addEventListener("click",play); play();
    }
  });
})();