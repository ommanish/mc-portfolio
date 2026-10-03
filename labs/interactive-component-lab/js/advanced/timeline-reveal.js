(() => {
  const demo='<div class="motion-timeline" data-motion-timeline><div class="motion-timeline__line"><i data-timeline-progress></i></div><article><span>01</span><h3>Research</h3><p>Understand the problem before designing the answer.</p></article><article><span>02</span><h3>Prototype</h3><p>Make the interaction visible early.</p></article><article><span>03</span><h3>Ship</h3><p>Refine motion, accessibility, and responsive behavior.</p></article></div>';
  window.AdvancedComponentLab.register({
    id:"timeline-reveal",number:8,title:"Scroll Timeline Reveal",tech:"IntersectionObserver · Progress line",
    description:"A vertical process timeline whose line grows as steps become visible.",
    notes:["Useful for process, history, roadmap, and storytelling","Each step activates independently","No custom scrolling"],
    prompt:"Create a vertical timeline for a web page where a progress line grows and each step fades/slides in as it enters the viewport. Use IntersectionObserver and preserve normal page scrolling.",
    demo,source:{html:'<div class="timeline"><article>...</article></div>',css:'.timeline article.is-visible{opacity:1;transform:none}',js:'new IntersectionObserver(...)'},
    accessibility:["Content order matches visual order","Observer only decorates visibility","Reduced motion removes transitions"],
    init(section){const root=section.querySelector("[data-motion-timeline]"),items=[...root.querySelectorAll("article")],progress=root.querySelector("[data-timeline-progress]");const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");const n=items.indexOf(entry.target)+1;progress.style.height=(n/items.length*100)+"%";}}),{threshold:.5});items.forEach(i=>obs.observe(i));}
  });
})();