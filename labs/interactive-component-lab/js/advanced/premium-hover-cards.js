(() => {
  const cards=[
    ["Strategy","Clarify the story before decorating the interface.","01"],
    ["Experience","Shape hierarchy, rhythm, motion, and responsive behavior.","02"],
    ["Build","Translate the interaction into maintainable frontend code.","03"]
  ];
  const demo=`
    <div class="hover-showcase" data-hover-showcase>
      ${cards.map(([title,copy,num])=>`<article class="hover-showcase__card" tabindex="0"><span>${num}</span><div class="hover-showcase__glow" aria-hidden="true"></div><div class="hover-showcase__visual" aria-hidden="true"><i></i><i></i><i></i></div><h3>${title}</h3><p>${copy}</p><a href="#premium-hover-cards">View pattern <b aria-hidden="true">↗</b></a></article>`).join("")}
    </div>`;

  const prompt="Build a premium three-card website section for services, features, or case studies. Each card should have a cursor-follow spotlight using CSS custom properties, a subtle image/shape zoom, border highlight, arrow movement, and a small lift on hover. Keep hover decorative only: the same content and clear focus treatment must remain available to keyboard and touch users. Use Pointer Events with requestAnimationFrame-friendly updates and disable transforms in reduced motion.";

  window.AdvancedComponentLab.register({
    id:"premium-hover-cards",number:2,title:"Premium Hover Cards",tech:"Pointer Events · CSS variables · Focus parity",
    description:"A practical card pattern with cursor-follow spotlight, lift, visual depth, and a matching keyboard focus state.",
    notes:["Works for services, features, resources, and case-study grids","Pointer position drives only decorative lighting","Keyboard users get the same emphasis without needing a cursor"],
    prompt,demo,
    source:{
      html:`<article class="hover-card" tabindex="0"><div class="hover-card__glow"></div><h3>Strategy</h3><p>...</p><a href="#">View pattern</a></article>`,
      css:`.hover-card{--x:50%;--y:50%;position:relative;transition:transform .25s ease}.hover-card__glow{background:radial-gradient(260px circle at var(--x) var(--y),rgba(255,255,255,.22),transparent 65%)}.hover-card:hover,.hover-card:focus-visible{transform:translateY(-8px)}`,
      js:`card.addEventListener('pointermove',event=>{const r=card.getBoundingClientRect();card.style.setProperty('--x',\`\${event.clientX-r.left}px\`);card.style.setProperty('--y',\`\${event.clientY-r.top}px\`)});`
    },
    accessibility:["Cards are focusable without hiding their links","Hover effects are decorative; content never depends on pointer position","Reduced motion removes lift and transform effects"],
    init(section){
      section.querySelectorAll(".hover-showcase__card").forEach(card=>{
        card.addEventListener("pointermove",event=>{
          const rect=card.getBoundingClientRect();
          card.style.setProperty("--x",`${event.clientX-rect.left}px`);
          card.style.setProperty("--y",`${event.clientY-rect.top}px`);
        });
        card.addEventListener("pointerleave",()=>{card.style.setProperty("--x","50%");card.style.setProperty("--y","50%");});
        card.addEventListener("focus",()=>card.classList.add("is-focused"));
        card.addEventListener("blur",()=>card.classList.remove("is-focused"));
      });
    }
  });
})();