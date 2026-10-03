(() => {
  const demo = '<div class="motion-tabs" data-motion-tabs><div class="motion-tabs__buttons" role="tablist" aria-label="Feature tabs"><button id="motion-tab-0" role="tab" aria-selected="true" aria-controls="motion-panel" tabindex="0" data-tab="0">Discover</button><button id="motion-tab-1" role="tab" aria-selected="false" aria-controls="motion-panel" tabindex="-1" data-tab="1">Design</button><button id="motion-tab-2" role="tab" aria-selected="false" aria-controls="motion-panel" tabindex="-1" data-tab="2">Deliver</button><span class="motion-tabs__indicator" data-tab-indicator aria-hidden="true"></span></div><div id="motion-panel" class="motion-tabs__panel" role="tabpanel" aria-labelledby="motion-tab-0" data-tab-panel><span>01</span><h3>Discover what matters.</h3><p>Use animated tabs for feature sections, service pages, and product storytelling.</p></div></div>';
  const data=[["01","Discover what matters.","Start with the content, user need, and hierarchy."],["02","Design the interaction.","Translate intent into clear visual states and motion."],["03","Deliver with confidence.","Keep the final behavior responsive and accessible."]];
  window.AdvancedComponentLab.register({
    id:"animated-tabs",number:4,title:"Animated Tabs & Content Switcher",tech:"CSS transforms · Vanilla JS · ARIA tabs",
    description:"A polished tab component with a sliding active indicator and animated content swap.",
    notes:["Useful for features, pricing, services, and product sections","Indicator movement reinforces selection","Keyboard arrows supported"],
    prompt:"Create an accessible animated tabs component for a marketing page. Include a sliding active indicator, smooth content fade/slide, keyboard arrow navigation with roving tabindex, linked tab/tabpanel semantics, responsive behavior, and reduced-motion fallback.",
    demo,source:{html:'<div role="tablist"><button role="tab" tabindex="0">Discover</button></div><section role="tabpanel">...</section>',css:'.motion-tabs__indicator{transition:transform .35s ease,width .35s ease}',js:'activate(index);'},
    accessibility:["Uses tablist/tab/tabpanel semantics","Roving tabindex keeps only the active tab in the tab order","Arrow keys change tabs"],
    init(section){
      const root=section.querySelector("[data-motion-tabs]"),buttons=[...root.querySelectorAll("[data-tab]")],panel=root.querySelector("[data-tab-panel]"),indicator=root.querySelector("[data-tab-indicator]");
      const isReduced=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches||document.querySelector(".lab-shell")?.dataset.motion==="reduced";
      const activate=(i,focus=false)=>{
        const b=buttons[i],r=b.getBoundingClientRect(),pr=b.parentElement.getBoundingClientRect();
        buttons.forEach((x,j)=>{const selected=i===j;x.setAttribute("aria-selected",String(selected));x.tabIndex=selected?0:-1;});
        panel.setAttribute("aria-labelledby",b.id);
        indicator.style.width=r.width+"px";
        indicator.style.transform="translateX("+(r.left-pr.left-b.parentElement.clientLeft)+"px)";
        panel.innerHTML="<span>"+data[i][0]+"</span><h3>"+data[i][1]+"</h3><p>"+data[i][2]+"</p>";
        if(!isReduced()) panel.animate?.([{opacity:.25,transform:"translateY(10px)"},{opacity:1,transform:"none"}],{duration:280,easing:"ease-out"});
        if(focus)b.focus();
      };
      buttons.forEach((b,i)=>{b.addEventListener("click",()=>activate(i));b.addEventListener("keydown",e=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault();let next=i;if(e.key==="ArrowRight")next=(i+1)%buttons.length;if(e.key==="ArrowLeft")next=(i-1+buttons.length)%buttons.length;if(e.key==="Home")next=0;if(e.key==="End")next=buttons.length-1;activate(next,true);});});
      requestAnimationFrame(()=>activate(0));
    }
  });
})();