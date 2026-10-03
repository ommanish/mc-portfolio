(() => {
  const demo=`
    <section class="image-reveal" data-image-reveal>
      <div class="image-reveal__media">
        <div class="image-reveal__frame" data-reveal-frame>
          <div class="image-reveal__art" aria-label="Abstract layered product image" role="img"><span></span><i></i><b></b></div>
          <div class="image-reveal__curtain" aria-hidden="true"></div>
        </div>
        <span class="image-reveal__caption">Image reveal · editorial section</span>
      </div>
      <div class="image-reveal__copy" data-reveal-copy>
        <span>03 · Image storytelling</span>
        <h3>Reveal the visual as the story enters the page.</h3>
        <p>Use a controlled mask, image scale, and copy stagger for product features, editorial layouts, case studies, or campaign sections.</p>
        <a href="#image-reveal-section">See implementation <span aria-hidden="true">→</span></a>
        <button type="button" data-reveal-replay>Replay reveal</button>
      </div>
    </section>`;

  const prompt="Create a reusable image-and-copy website section with a scroll-triggered reveal. Use IntersectionObserver to add one visible state when the section enters the viewport. Reveal the image with clip-path or an overlay curtain, scale the image gently from 1.08 to 1, and stagger the eyebrow, headline, paragraph, and CTA. Include a replay button for design review. Do not hijack scrolling. On reduced motion, show the final image and copy instantly.";

  window.AdvancedComponentLab.register({
    id:"image-reveal-section",number:3,title:"Image Reveal Section",tech:"IntersectionObserver · Clip-path · Content stagger",
    description:"A reusable image-and-copy section with curtain masking, image scale, and staggered content entrance for real marketing pages.",
    notes:["Useful for product features, case studies, and editorial sections","Native page scroll remains untouched","Replay helps designers compare timing without refreshing"],
    prompt,demo,
    source:{
      html:`<section class="image-reveal"><div class="image-reveal__frame">...</div><div class="image-reveal__copy"><h2>Reveal the story.</h2></div></section>`,
      css:`.image-reveal__frame{clip-path:inset(0 100% 0 0)}.image-reveal.is-visible .image-reveal__frame{clip-path:inset(0);transition:clip-path .9s cubic-bezier(.2,.8,.2,1)}.image-reveal__art{transform:scale(1.08)}.image-reveal.is-visible .image-reveal__art{transform:scale(1)}`,
      js:`const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){root.classList.add('is-visible');observer.unobserve(root)}}),{threshold:.25});observer.observe(root);`
    },
    accessibility:["Image alternative is exposed through the demo role and label","Section content is readable before JavaScript styling is considered","Reduced motion disables clip-path and stagger transitions"],
    init(section){
      const root=section.querySelector("[data-image-reveal]");
      const replay=root.querySelector("[data-reveal-replay]");
      const show=()=>root.classList.add("is-visible");
      const reset=()=>{root.classList.remove("is-visible");void root.offsetWidth;show();};
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){show();observer.unobserve(root);}}),{threshold:.25});
      observer.observe(root);
      replay.addEventListener("click",reset);
    }
  });
})();