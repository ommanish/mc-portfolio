(() => {
  const root = document.querySelector("[data-mx-projects]");
  if (!root) return;

  const projects = [...root.querySelectorAll("[data-project]")];
  const preview = root.querySelector("[data-preview]");
  const windowEl = root.querySelector("[data-preview-window]");
  const currentScene = root.querySelector("[data-current-scene]");
  const nextScene = root.querySelector("[data-next-scene]");
  const previewTitle = root.querySelector("[data-preview-title]");
  const previewMeta = root.querySelector("[data-preview-meta]");

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = matchMedia("(pointer: coarse)");
  const mobile = matchMedia("(max-width: 860px)");

  const items = [
    { title:"Editorial launch", meta:"Brand system · 2026", bg:"linear-gradient(135deg,#253c91,#13aeba)", accent:"#ffb84a" },
    { title:"Product story", meta:"Web experience · 2026", bg:"linear-gradient(135deg,#642581,#f06d90)", accent:"#75e8ff" },
    { title:"Campaign system", meta:"Motion language · 2026", bg:"linear-gradient(135deg,#0e6b63,#59cc9d)", accent:"#f7ee8a" },
    { title:"Experience refresh", meta:"Design system · 2026", bg:"linear-gradient(135deg,#7c3518,#ec8730)", accent:"#d9c5ff" }
  ];

  let active = 0;
  let currentX = innerWidth * .72;
  let currentY = innerHeight * .5;
  let targetX = currentX;
  let targetY = currentY;
  let raf = 0;

  function paint(scene, item) {
    scene.style.background = item.bg;
    scene.querySelector("b").style.background = item.accent;
  }

  function setMobileArt(index) {
    const item = items[index];
    projects.forEach((project, i) => {
      project.classList.toggle("is-active", i === index);
      project.querySelector("button").setAttribute("aria-expanded", String(i === index));
      project.querySelector(".mx-project__mobile-media").style.background = itemFor(i).bg;
    });
  }

  function itemFor(index) {
    return items[index];
  }

  function transitionTo(index, direction = 1) {
    if (index === active && previewTitle.textContent === items[index].title) {
      setMobileArt(index);
      return;
    }

    const next = items[index];
    projects.forEach((project, i) => {
      project.classList.toggle("is-active", i === index);
      project.querySelector("button").setAttribute("aria-expanded", String(i === index));
    });

    projects.forEach((project, i) => {
      project.querySelector(".mx-project__mobile-media").style.background = itemFor(i).bg;
    });

    if (mobile.matches || reduce.matches) {
      paint(currentScene, next);
      previewTitle.textContent = next.title;
      previewMeta.textContent = next.meta;
      active = index;
      return;
    }

    paint(nextScene, next);
    nextScene.style.transform = `translateY(${direction > 0 ? "102%" : "-102%"})`;
    nextScene.style.opacity = "1";

    const currentAnimation = currentScene.animate(
      [
        { transform:"translateY(0)", opacity:1 },
        { transform:`translateY(${direction > 0 ? "-18%" : "18%"})`, opacity:.12 }
      ],
      { duration:420, easing:"cubic-bezier(.2,.8,.2,1)", fill:"forwards" }
    );

    const nextAnimation = nextScene.animate(
      [
        { transform:`translateY(${direction > 0 ? "102%" : "-102%"})` },
        { transform:"translateY(0)" }
      ],
      { duration:520, easing:"cubic-bezier(.2,.8,.2,1)", fill:"forwards" }
    );

    Promise.all([currentAnimation.finished, nextAnimation.finished]).then(() => {
      paint(currentScene, next);
      currentScene.getAnimations().forEach(a => a.cancel());
      nextScene.getAnimations().forEach(a => a.cancel());
      currentScene.style.transform = "";
      currentScene.style.opacity = "";
      nextScene.style.transform = "translateY(102%)";
    });

    previewTitle.animate(
      [{ opacity:0, transform:"translateY(7px)" }, { opacity:1, transform:"translateY(0)" }],
      { duration:260, easing:"ease-out" }
    );
    previewMeta.animate(
      [{ opacity:0, transform:"translateY(7px)" }, { opacity:1, transform:"translateY(0)" }],
      { duration:300, delay:35, easing:"ease-out" }
    );

    previewTitle.textContent = next.title;
    previewMeta.textContent = next.meta;
    active = index;
  }

  function show(index) {
    const direction = index >= active ? 1 : -1;
    transitionTo(index, direction);
    if (!coarse.matches && !mobile.matches) preview.classList.add("is-visible");
  }

  function animatePreview() {
    currentX += (targetX - currentX) * .14;
    currentY += (targetY - currentY) * .14;

    const maxX = innerWidth - preview.offsetWidth / 2 - 18;
    const minX = preview.offsetWidth / 2 + 18;
    const maxY = innerHeight - preview.offsetHeight / 2 - 18;
    const minY = preview.offsetHeight / 2 + 18;

    const x = Math.max(minX, Math.min(maxX, currentX));
    const y = Math.max(minY, Math.min(maxY, currentY));

    preview.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    raf = requestAnimationFrame(animatePreview);
  }

  root.addEventListener("pointermove", event => {
    if (coarse.matches || mobile.matches) return;
    targetX = event.clientX + 28;
    targetY = event.clientY + 22;
  }, { passive:true });

  projects.forEach((project, index) => {
    const button = project.querySelector("button");

    project.addEventListener("pointerenter", () => show(index));

    project.addEventListener("pointerleave", () => {
      if (!coarse.matches && !mobile.matches) preview.classList.remove("is-visible");
    });

    button.addEventListener("focus", () => {
      show(index);
      if (!coarse.matches && !mobile.matches) {
        const rect = button.getBoundingClientRect();
        targetX = Math.min(innerWidth - 230, rect.right - 40);
        targetY = rect.top + rect.height / 2;
      }
    });

    button.addEventListener("blur", () => {
      if (!coarse.matches && !mobile.matches) preview.classList.remove("is-visible");
    });

    button.addEventListener("click", () => {
      if (mobile.matches || coarse.matches) transitionTo(index, index >= active ? 1 : -1);
    });
  });

  paint(currentScene, items[0]);
  projects.forEach((project, i) => {
    project.querySelector(".mx-project__mobile-media").style.background = items[i].bg;
  });
  setMobileArt(0);

  if (!reduce.matches && !coarse.matches) {
    raf = requestAnimationFrame(animatePreview);
  }

  addEventListener("resize", () => {
    if (mobile.matches) preview.classList.remove("is-visible");
  });

  addEventListener("pagehide", () => cancelAnimationFrame(raf));
})();