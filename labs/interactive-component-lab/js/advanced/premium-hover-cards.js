(() => {
  const cards=[["01","Strategy","Turn ambiguity into a clear digital direction."],["02","Experience","Build hierarchy, rhythm, and meaningful interaction."],["03","Delivery","Translate the design into resilient frontend code."]];
  const demo=`<div class="rich-cards" data-rich-cards>${cards.map(([n,t,c])=>`<article class="rich-card" tabindex="0"><div class="rich-card__shine" aria-hidden="true"></div><span>${n}</span><div class="rich-card__media" aria-hidden="true"><i></i><b></b></div><h3>${t}</h3><p>${c}</p><a href="#premium-hover-cards">Explore pattern <em>↗</em></a></article>`).join("")}</div>`;
  window.AdvancedComponentLab.register({
    id:"premium-hover-cards",number:2,title:"Premium Hover Cards",tech:"Pointer tracking · Tilt · Spotlight · CTA motion",
    description:"A more complete card interaction with cursor spotlight, tilt, media parallax, border emphasis, and CTA movement.",
    notes:["Multiple micro-interactions stay coordinated","Useful for services, features, and case studies","Keyboard focus mirrors hover emphasis"],
    prompt:"Create premium hover cards with cursor-follow spotlight, subtle 3D tilt, media parallax, border highlight, staggered content emphasis, and magnetic arrow movement. Keep hover decorative and provide equivalent focus states.",
    demo,source:{html:'<article class="rich-card">...</article>',css:'.rich-card{transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))}',js:'pointermove => set CSS variables'},
    accessibility:["Cards remain readable without hover","Keyboard focus gets equivalent emphasis","Reduced motion disables tilt/parallax"],
    init(section){
      const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      section.querySelectorAll(".rich-card").forEach(card=>{const media=card.querySelector(".rich-card__media");card.addEventListener("pointermove",e=>{if(reduced)return;const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;card.style.setProperty("--x",px*100+"%");card.style.setProperty("--y",py*100+"%");card.style.setProperty("--rx",((.5-py)*7)+"deg");card.style.setProperty("--ry",((px-.5)*9)+"deg");media.style.transform=`translate(${(px-.5)*10}px,${(py-.5)*10}px) scale(1.04)`;});card.addEventListener("pointerleave",()=>{card.style.removeProperty("--rx");card.style.removeProperty("--ry");media.style.transform="";});});
    }
  });
})();