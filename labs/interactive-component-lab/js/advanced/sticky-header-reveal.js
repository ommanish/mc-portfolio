(() => {
  const demo='<div class="header-demo" data-header-demo><div class="header-demo__page"><header class="header-demo__bar" data-header-bar><strong>Northstar</strong><nav><a href="#sticky-header-reveal">Work</a><a href="#sticky-header-reveal">About</a><button type="button">Contact</button></nav></header><div class="header-demo__content"><h3>Scroll this preview</h3><p>Header hides on downward scroll and returns when the user scrolls up.</p><div></div><div></div><div></div></div></div></div>';
  window.AdvancedComponentLab.register({
    id:"sticky-header-reveal",number:6,title:"Smart Sticky Header",tech:"Scroll direction · CSS transitions",
    description:"A practical header that becomes compact, hides while scrolling down, and returns when scrolling up.",
    notes:["Common pattern for long landing pages","Header stays visible while keyboard focus is inside it","Works inside normal scrolling"],
    prompt:"Build a sticky website header that becomes compact after scrolling, hides when the user scrolls down, and returns on upward scroll. Never hide it while keyboard focus is inside the header. Keep navigation accessible and disable animated movement for reduced motion.",
    demo,source:{html:'<header class="site-header">...</header>',css:'.site-header.is-hidden{transform:translateY(-110%)}',js:'scroller.addEventListener("scroll",...)'},
    accessibility:["Header does not hide while focus is inside it","Navigation remains keyboard reachable","No scroll-jacking"],
    init(section){
      const scroller=section.querySelector(".header-demo__page"),bar=section.querySelector("[data-header-bar]");let last=0;
      const update=()=>{const y=scroller.scrollTop,focused=bar.contains(document.activeElement);bar.classList.toggle("is-compact",y>30);bar.classList.toggle("is-hidden",!focused&&y>last&&y>60);last=y;};
      scroller.addEventListener("scroll",update,{passive:true});
      bar.addEventListener("focusin",()=>bar.classList.remove("is-hidden"));
      bar.addEventListener("focusout",()=>requestAnimationFrame(update));
    }
  });
})();