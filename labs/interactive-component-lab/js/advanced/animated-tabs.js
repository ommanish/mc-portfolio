(() => {
  const items=[{label:"Discover",title:"Find the signal.",copy:"Combine user need, content, and business context before designing.",tone:"01",media:"a"},{label:"Design",title:"Shape the experience.",copy:"Use hierarchy, motion, and interaction to make the path obvious.",tone:"02",media:"b"},{label:"Deliver",title:"Ship the system.",copy:"Translate the design into responsive, accessible frontend behavior.",tone:"03",media:"c"}];
  const demo=`<div class="rich-tabs" data-rich-tabs><div class="rich-tabs__nav" role="tablist">${items.map((x,i)=>`<button role="tab" aria-selected="${i===0}" data-rich-tab="${i}">${x.label}</button>`).join("")}<i data-rich-indicator></i></div><div class="rich-tabs__body"><div class="rich-tabs__copy" data-rich-copy></div><div class="rich-tabs__media" data-rich-media aria-hidden="true"><span></span><i></i><b></b></div></div></div>`;
  window.AdvancedComponentLab.register({
    id:"animated-tabs",number:4,title:"Animated Tabs & Content Switcher",tech:"ARIA tabs · Directional transitions · Media morph",
    description:"A richer tabs pattern with sliding indicator, directional copy transition, media morph, and responsive layout.",
    notes:["Useful for features and product storytelling","Media and copy transition together","Keyboard arrows supported"],
    prompt:"Create premium animated tabs with sliding indicator, directional content transition, synchronized media morph, dynamic height, keyboard arrow support, and reduced-motion fallback.",
    demo,source:{html:'<div role="tablist">...</div>',css:'.rich-tabs__media[data-tone="b"]{...}',js:'activate(index,direction)'},
    accessibility:["Uses tab semantics","Arrow keys change tabs","Reduced motion preserves instant state updates"],
    init(section){
      const root=section.querySelector("[data-rich-tabs]"),tabs=[...root.querySelectorAll("[data-rich-tab]")],copy=root.querySelector("[data-rich-copy]"),media=root.querySelector("[data-rich-media]"),indicator=root.querySelector("[data-rich-indicator]");let active=0;
      const activate=(i,focus=false)=>{const prev=active;active=i;const item=items[i],btn=tabs[i],r=btn.getBoundingClientRect(),pr=btn.parentElement.getBoundingClientRect();tabs.forEach((t,j)=>{t.setAttribute("aria-selected",String(j===i));t.tabIndex=j===i?0:-1;});indicator.style.width=r.width+"px";indicator.style.transform="translateX("+(r.left-pr.left)+"px)";copy.innerHTML=`<span>${item.tone}</span><h3>${item.title}</h3><p>${item.copy}</p>`;copy.animate?.([{opacity:0,transform:`translateX(${i>=prev?18:-18}px)`},{opacity:1,transform:"none"}],{duration:320,easing:"ease-out"});media.dataset.tone=item.media;media.animate?.([{opacity:.35,transform:"scale(.96) rotate(-2deg)"},{opacity:1,transform:"scale(1) rotate(0)"}],{duration:420,easing:"cubic-bezier(.2,.8,.2,1)"});if(focus)btn.focus();};
      tabs.forEach((t,i)=>{t.addEventListener("click",()=>activate(i));t.addEventListener("keydown",e=>{if(!["ArrowLeft","ArrowRight"].includes(e.key))return;e.preventDefault();activate((i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length,true);});});requestAnimationFrame(()=>activate(0));
    }
  });
})();