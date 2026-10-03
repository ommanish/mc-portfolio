(() => {
  const demo='<div class="color-story" data-color-story><button type="button" data-color-step="0">Strategy</button><button type="button" data-color-step="1">Design</button><button type="button" data-color-step="2">Launch</button><div class="color-story__panel" data-color-panel><span>01</span><h3>Strategy sets the tone.</h3><p>Section backgrounds can transition with content without overpowering the page.</p></div></div>';
  const states=[["01","Strategy sets the tone.","#172554","#bfdbfe"],["02","Design builds rhythm.","#3b0764","#e9d5ff"],["03","Launch creates energy.","#7c2d12","#fed7aa"]];
  window.AdvancedComponentLab.register({
    id:"section-color-transition",number:12,title:"Section Color Transition",tech:"CSS variables · Content state",
    description:"A reusable section pattern where background, accent, and content transition together.",
    notes:["Useful for storytelling sections and feature groups","Color changes support content grouping","Buttons make the demo deterministic"],
    prompt:"Create a content section where background and accent colors transition smoothly as the active story step changes. Use CSS variables, semantic buttons, responsive layout, and reduced-motion fallback.",
    demo,source:{html:'<section style="--bg:#172554">...</section>',css:'.section{background:var(--bg);transition:background .5s ease}',js:'setState(index)'},
    accessibility:["State controls are native buttons","Text contrast stays readable","Reduced motion removes transitional interpolation"],
    init(section){const root=section.querySelector("[data-color-story]"),panel=root.querySelector("[data-color-panel]"),buttons=[...root.querySelectorAll("[data-color-step]")];const set=i=>{const s=states[i];root.style.setProperty("--story-bg",s[3]);root.style.setProperty("--story-deep",s[2]);panel.innerHTML="<span>"+s[0]+"</span><h3>"+s[1]+"</h3><p>Section backgrounds can transition with content without overpowering the page.</p>";buttons.forEach((b,j)=>b.classList.toggle("is-active",i===j));};buttons.forEach((b,i)=>b.addEventListener("click",()=>set(i)));set(0);}
  });
})();