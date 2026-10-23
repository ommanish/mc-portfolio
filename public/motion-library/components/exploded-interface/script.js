(() => {
  const host = document.querySelector("[data-mx-exploded]");
  const canvasHost = host?.querySelector("[data-stage-canvas]");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!host || !canvasHost || reduceMotion || !window.THREE) return;

  let renderer;
  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl") || probe.getContext("experimental-webgl");
    if (!context) return;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.z = 11;
  const group = new THREE.Group();
  scene.add(group);
  const ink = "#16161A";
  const paper = "#FBF8F2";
  const accent = "#FF5A3C";
  const lilac = "#E3DDF3";
  const muted = "#8C877C";
  const width = 640;
  const height = 440;

  function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function makeTexture(draw) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d"));
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  }

  const layers = [
    (ctx) => {
      roundedRect(ctx, 6, 6, width - 12, height - 12, 28);
      ctx.fillStyle = paper; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = ink; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(6, 62); ctx.lineTo(width - 6, 62); ctx.stroke();
      [[40, accent], [68, ink], [96, muted]].forEach(([x, color]) => {
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, 34, 9, 0, Math.PI * 2); ctx.fill();
      });
    },
    (ctx) => {
      ctx.strokeStyle = "rgba(255,90,60,.75)"; ctx.lineWidth = 2;
      for (let i = 0; i < 12; i += 1) {
        const x = 40 + i * (width - 80) / 12;
        ctx.fillStyle = "rgba(255,90,60,.10)"; ctx.fillRect(x + 4, 20, (width - 80) / 12 - 8, height - 40);
      }
      ctx.setLineDash([12, 10]); ctx.strokeStyle = ink;
      roundedRect(ctx, 10, 10, width - 20, height - 20, 26); ctx.stroke();
    },
    (ctx) => {
      ctx.fillStyle = ink;
      roundedRect(ctx, 60, 100, 300, 40, 10); ctx.fill();
      roundedRect(ctx, 60, 152, 220, 40, 10); ctx.fill();
      ctx.fillStyle = muted;
      for (let i = 0; i < 4; i += 1) { roundedRect(ctx, 60, 220 + i * 24, 280 - i * 30, 12, 6); ctx.fill(); }
      roundedRect(ctx, 400, 100, 180, 180, 22); ctx.fillStyle = lilac; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = ink; ctx.stroke();
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(490, 190, 46, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    },
    (ctx) => {
      ctx.lineWidth = 5; ctx.strokeStyle = ink;
      roundedRect(ctx, 60, 340, 170, 58, 29); ctx.fillStyle = accent; ctx.fill(); ctx.stroke();
      ctx.fillStyle = ink; ctx.font = "600 26px IBM Plex Sans, sans-serif"; ctx.fillText("Get started", 82, 378);
      roundedRect(ctx, 250, 340, 150, 58, 29); ctx.stroke(); ctx.fillText("Learn more", 267, 378);
      roundedRect(ctx, 460, 350, 100, 40, 20); ctx.fillStyle = ink; ctx.fill();
      ctx.fillStyle = paper; ctx.beginPath(); ctx.arc(540, 370, 14, 0, Math.PI * 2); ctx.fill();
    },
    (ctx) => {
      ctx.strokeStyle = accent; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(60, 70); ctx.lineTo(360, 70); ctx.moveTo(60, 58); ctx.lineTo(60, 82); ctx.moveTo(360, 58); ctx.lineTo(360, 82); ctx.stroke();
      ctx.fillStyle = accent; roundedRect(ctx, 180, 36, 60, 26, 6); ctx.fill();
      ctx.fillStyle = ink; ctx.font = "500 18px IBM Plex Mono, monospace"; ctx.fillText("8 col", 187, 55);
      ctx.save(); ctx.translate(430, 300); ctx.fillStyle = ink; ctx.strokeStyle = paper; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 70); ctx.lineTo(18, 54); ctx.lineTo(32, 82); ctx.lineTo(46, 75); ctx.lineTo(32, 48); ctx.lineTo(56, 48); ctx.closePath(); ctx.stroke(); ctx.fill(); ctx.restore();
    },
  ];

  const planeWidth = 4.4;
  const geometry = new THREE.PlaneGeometry(planeWidth, planeWidth * height / width);
  const meshes = layers.map((draw, index) => {
    const material = new THREE.MeshBasicMaterial({ map: makeTexture(draw), transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = index;
    group.add(mesh);
    return mesh;
  });
  group.rotation.set(-0.5, 0.55, 0.12);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.setAttribute("aria-hidden", "true");
  canvasHost.appendChild(renderer.domElement);
  host.classList.add("is-live");

  function resize() {
    const box = canvasHost.getBoundingClientRect();
    if (!box.width || !box.height) return;
    renderer.setSize(box.width, box.height, false);
    camera.aspect = box.width / box.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
  resize();
  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(canvasHost);
  if (!resizeObserver) window.addEventListener("resize", resize, { passive: true });

  let targetX = 0; let targetY = 0; let currentX = 0; let currentY = 0;
  host.addEventListener("pointermove", (event) => {
    const box = host.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2));
    targetY = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height - 0.5) * 2));
  }, { passive: true });
  host.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; }, { passive: true });

  let isOnScreen = false;
  let isVisible = !document.hidden;
  let running = false;
  let frameId = 0;
  let startTime = performance.now();
  function frame(now) {
    frameId = 0;
    if (!running) return;
    const time = (now - startTime) / 1000;
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    group.rotation.y = 0.55 + currentX * 0.35 + Math.sin(time * 0.35) * 0.06;
    group.rotation.x = -0.5 + currentY * 0.2;
    const spread = 0.62 + Math.sin(time * 0.6) * 0.14 + Math.abs(currentX) * 0.12;
    meshes.forEach((mesh, index) => {
      mesh.position.z = (index - 2) * spread;
      mesh.position.y = Math.sin(time * 0.8 + index * 0.7) * 0.04;
    });
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(frame);
  }
  function updateAnimation() {
    const shouldRun = isOnScreen && isVisible;
    if (shouldRun && !running) {
      running = true;
      startTime = performance.now();
      if (!frameId) frameId = requestAnimationFrame(frame);
    } else if (!shouldRun && running) {
      running = false;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      isOnScreen = entry.isIntersecting;
      updateAnimation();
    }, { threshold: 0 });
    observer.observe(host);
  } else {
    isOnScreen = true;
    updateAnimation();
  }
  document.addEventListener("visibilitychange", () => {
    isVisible = !document.hidden;
    updateAnimation();
  });
})();
