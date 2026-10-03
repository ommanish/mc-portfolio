(() => {
  const demo='<div class="compare" data-compare><div class="compare__base"><span>Before</span></div><div class="compare__after" data-compare-after><span>After</span></div><input data-compare-range type="range" min="0" max="100" value="54" aria-label="Compare before and after"><i data-compare-handle aria-hidden="true"></i></div>';
  window.AdvancedComponentLab.register({
    id:"before-after-slider",number:7,title:"Before / After Slider",tech:"Range input · CSS clipping",
    description:"A reusable visual comparison component for redesigns, photography, transformations, and case studies.",
    notes:["Native range input drives the interaction","Works with mouse, touch, and keyboard","Labels remain visible"],
    prompt:"Create an accessible before/after image comparison slider using a native range input, CSS clipping, visible labels, draggable handle, keyboard support, and responsive sizing.",
    demo,source:{html:'<input type="range" min="0" max="100" value="50">',css:'.after{clip-path:inset(0 calc(100% - var(--split)) 0 0)}',js:'range.addEventListener("input",update)'},
    accessibility:["Native range input supports keyboard control with a visible focus ring","Before/after labels remain visible","No essential information depends on animation"],
    init(section){const root=section.querySelector("[data-compare]"),range=root.querySelector("[data-compare-range]"),after=root.querySelector("[data-compare-after]"),handle=root.querySelector("[data-compare-handle]");const update=()=>{after.style.setProperty("--split",range.value+"%");handle.style.left=range.value+"%";};range.addEventListener("input",update);update();}
  });
})();