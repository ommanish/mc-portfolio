(() => {
  const demo=`<section class="rich-reveal" data-rich-reveal><div class="rich-reveal__visual"><div class="rich-reveal__image" aria-label="Abstract campaign composition" role="img"><span></span><i></i><b></b></div><div class="rich-reveal__mask" aria-hidden="true"></div><div class="rich-reveal__float" aria-hidden="true"><strong>03</strong><small>Motion layer</small></div></div><div class="rich-reveal__copy"><span>Editorial reveal</span><h3>Let the image arrive with the story.</h3><p>Masking, layered media, staggered copy, and background movement turn a standard image/text blade into a premium storytelling section.</p><a href="#image-reveal-section">See implementation <span>→</span></a><button type="button" data-rich-reveal-replay>Replay reveal</button></div></section>`;
  window.AdvancedComponentLab.register({
    id:"image-reveal-section",number:3,title:"Image Reveal Section",tech:"IntersectionObserver · Clip-path · Layered media",
    description:"A richer image-and-copy section with masking, floating detail card, background shift, and staggered content.",
    notes:["Useful for product features and case studies","Visual and copy animate as one system","Replay supports motion review"],
    prompt:"Create a premium image-and-copy section with clip-path reveal, overlay curtain, image scale, floating secondary card, background shift, staggered copy, IntersectionObserver trigger, replay control, and reduced-motion fallback.",
    demo,source:{html:'<section class="rich-reveal">...</section>',css:'.rich-reveal.is-visible .rich-reveal__mask{transform:translateX(101%)}',js:'IntersectionObserver + replay'},
    accessibility:["Image has an accessible label","Content order remains logical","Reduced motion removes mask and stagger transitions"],
    init(section){
      const root=section.querySelector("[data-rich-reveal]"), replay=root.querySelector("[data-rich-reveal-replay]");
      const show=()=>root.classList.add("is-visible"),reset=()=>{root.classList.remove("is-visible");void root.offsetWidth;show();};
      const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){show();obs.unobserve(root);}}),{threshold:.22});obs.observe(root);replay.addEventListener("click",reset);
    }
  });
})();