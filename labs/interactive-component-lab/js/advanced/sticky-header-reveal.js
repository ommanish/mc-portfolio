(() => {
  const demo='<div class="header-demo" data-header-demo><div class="header-demo__page"><header class="header-demo__bar" data-header-bar><strong>Northstar</strong><nav><a href="#sticky-header-reveal">Work</a><a href="#sticky-header-reveal">About</a><button>Contact</button></nav></header><div class="header-demo__content"><h3>Scroll this preview</h3><p>Header hides on downward scroll and returns when the user scrolls up.</p><div></div><div></div><div></div></div></div></div>';
  window.AdvancedComponentLab.register({
    id:"sticky-header-reveal",number:6,title:"Smart Sticky Header",tech:"Scroll direction · CSS transitions",
    description:"A practical header that becomes compact, hides while scrolling down, and returns when scrolling up.",
    notes:["Common pattern for long landing pages","Preserves content space","Works inside normal scrolling"],
    prompt:"Build a sticky website header that becomes compact after scrolling, hides when the user scrolls down, and returns on upward scroll. Keep focusable navigation accessible and disable animated movement for reduced motion.",
    demo,source:{html:'<header class="site-header">...</header>',css:'.site-header.is-hidden{transform:translateY(-110%)}',js:'scroller.addEventListener("scroll",...)'},
    accessibility:["Navigation remains keyboard reachable","No scroll-jacking","Reduced motion keeps state changes immediate"],
    init(section){const scroller=section.querySelector(".header-demo__page"),bar=section.querySelector("[data-header-bar]");let last=0;scroller.addEventListener("scroll",()=>{const y=scroller.scrollTop;bar.classList.toggle("is-compact",y>30);bar.classList.toggle("is-hidden",y>last&&y>60);last=y;},{passive:true});}
  });
})();