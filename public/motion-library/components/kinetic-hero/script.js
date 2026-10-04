(() => {
  const root = document.querySelector("[data-mx-hero]");
  if (!root) return;

  const words = [...root.querySelectorAll("[data-mx-word]")];
  const supporting = [...root.querySelectorAll("[data-mx-animate]")];
  const visual = root.querySelector("[data-mx-visual]");
  const glows = [...root.querySelectorAll(".mx-hero__glow")];
  const replay = root.querySelector("[data-mx-replay]");
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function cancelAnimations() {
    [root, visual, ...words, ...supporting, ...glows].forEach((element) => {
      element?.getAnimations?.().forEach((animation) => animation.cancel());
    });
  }

  function play() {
    cancelAnimations();
    if (reduceQuery.matches || !Element.prototype.animate) return;

    words.forEach((word, index) => {
      word.animate(
        [
          { opacity: 0, transform: "translateY(115%)", filter: "blur(7px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }
        ],
        {
          duration: 760,
          delay: 80 + index * 115,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "both"
        }
      );
    });

    supporting.forEach((element, index) => {
      element.animate(
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 520,
          delay: 120 + index * 150,
          easing: "ease-out",
          fill: "both"
        }
      );
    });

    visual.animate(
      [
        { opacity: 0, transform: "translate3d(34px,28px,0) scale(.94) rotate(3deg)" },
        { opacity: 1, transform: "translate3d(0,0,0) scale(1) rotate(0)" }
      ],
      {
        duration: 980,
        delay: 360,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "both"
      }
    );
  }

  function handlePointer(event) {
    if (reduceQuery.matches || event.pointerType === "touch") return;
    const bounds = root.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    visual.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 6}deg) translate3d(${x * 9}px,${y * 7}px,0)`;
    glows[0].style.transform = `translate(${x * -24}px,${y * -18}px)`;
    glows[1].style.transform = `translate(${x * 18}px,${y * 14}px)`;
  }

  function resetPointer() {
    visual.style.transform = "";
    glows.forEach((glow) => { glow.style.transform = ""; });
  }

  root.addEventListener("pointermove", handlePointer, { passive: true });
  root.addEventListener("pointerleave", resetPointer);
  replay.addEventListener("click", play);
  reduceQuery.addEventListener?.("change", () => {
    cancelAnimations();
    resetPointer();
  });

  play();
})();
