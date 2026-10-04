(() => {
  const root = document.querySelector("[data-mx-index]");
  if (!root) return;

  const list = root.querySelector(".mx-index__list");
  const rows = [...root.querySelectorAll("[data-project]")];
  const preview = root.querySelector("[data-preview]");
  const images = [...root.querySelectorAll("[data-image]")];

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = matchMedia("(pointer: coarse)");
  const mobile = matchMedia("(max-width: 860px)");

  let active = -1;
  let targetX = innerWidth * .7;
  let targetY = innerHeight * .5;
  let currentX = targetX;
  let currentY = targetY;
  let lastX = targetX;
  let velocityX = 0;
  let raf = 0;

  function setActive(index) {
    active = index;
    list.classList.add("has-active");

    rows.forEach((row, i) => {
      const selected = i === index;
      row.classList.toggle("is-active", selected);
      row.querySelector("button").setAttribute("aria-expanded", String(selected));
    });

    images.forEach((image, i) => {
      image.classList.toggle("is-active", i === index);
    });
  }

  function clearActive() {
    if (mobile.matches || coarse.matches) return;
    active = -1;
    list.classList.remove("has-active");
    rows.forEach(row => row.classList.remove("is-active"));
    preview.classList.remove("is-visible");
  }

  function positionLoop() {
    const previousX = currentX;
    currentX += (targetX - currentX) * .16;
    currentY += (targetY - currentY) * .16;
    velocityX = currentX - previousX;

    const halfW = preview.offsetWidth / 2;
    const halfH = preview.offsetHeight / 2;
    const x = Math.max(halfW + 18, Math.min(innerWidth - halfW - 18, currentX));
    const y = Math.max(halfH + 18, Math.min(innerHeight - halfH - 18, currentY));
    const tilt = Math.max(-4, Math.min(4, velocityX * .5));

    preview.style.transform =
      `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${tilt}deg) scale(${preview.classList.contains("is-visible") ? 1 : .9})`;

    lastX = currentX;
    raf = requestAnimationFrame(positionLoop);
  }

  root.addEventListener("pointermove", event => {
    if (coarse.matches || mobile.matches) return;
    targetX = event.clientX + 42;
    targetY = event.clientY + 28;
  }, { passive:true });

  rows.forEach((row, index) => {
    const button = row.querySelector("button");

    row.addEventListener("pointerenter", () => {
      if (coarse.matches || mobile.matches) return;
      setActive(index);
      preview.classList.add("is-visible");
    });

    row.addEventListener("pointerleave", clearActive);

    button.addEventListener("focus", () => {
      setActive(index);

      if (!coarse.matches && !mobile.matches) {
        const rect = button.getBoundingClientRect();
        targetX = Math.min(innerWidth - preview.offsetWidth / 2 - 20, rect.right - 80);
        targetY = rect.top + rect.height / 2;
        preview.classList.add("is-visible");
      }
    });

    button.addEventListener("blur", () => {
      if (!coarse.matches && !mobile.matches) clearActive();
    });

    button.addEventListener("click", () => {
      if (!mobile.matches && !coarse.matches) return;

      const next = row.classList.contains("is-active") ? -1 : index;
      rows.forEach((item, i) => {
        const selected = i === next;
        item.classList.toggle("is-active", selected);
        item.querySelector("button").setAttribute("aria-expanded", String(selected));
      });
      list.classList.toggle("has-active", next >= 0);
      active = next;
    });
  });

  if (!reduce.matches && !coarse.matches) {
    raf = requestAnimationFrame(positionLoop);
  }

  addEventListener("resize", () => {
    if (mobile.matches) {
      preview.classList.remove("is-visible");
      list.classList.remove("has-active");
    }
  });

  addEventListener("pagehide", () => cancelAnimationFrame(raf));
})();