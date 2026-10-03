(() => {
  const demo='<div class="reading-demo" data-reading-demo><div class="reading-demo__progress"><i data-reading-progress></i></div><div class="reading-demo__scroller"><h3>Progress follows the story.</h3><p>Use this on articles, guides, long-form landing pages, and case studies.</p><div></div><div></div><div></div><div></div></div></div>';
  window.AdvancedComponentLab.register({
    id:"scroll-progress-indicator",number:11,title:"Scroll Progress Indicator",tech:"Scroll position · CSS custom state",
    description:"A lightweight reading/page progress pattern that reacts to native scrolling.",
    notes:["Useful for long-form pages","No scroll-jacking","Works with any content height"],
    prompt:"Create a page reading progress indicator that updates from native scroll position, uses a slim animated bar, works responsively, and respects reduced-motion preferences.",
    demo,source:{html:'<div class="progress"><i></i></div>',css:'.progress i{width:var(--progress)}',js:'scroller.addEventListener("scroll",update)'},
    accessibility:["Does not interfere with normal scrolling","Decorative progress does not replace headings/navigation","Reduced motion can update instantly"],
    init(section){const root=section.querySelector("[data-reading-demo]"),scroller=root.querySelector(".reading-demo__scroller"),bar=root.querySelector("[data-reading-progress]");const update=()=>{const max=scroller.scrollHeight-scroller.clientHeight;bar.style.width=(max?scroller.scrollTop/max*100:0)+"%";};scroller.addEventListener("scroll",update,{passive:true});update();}
  });
})();