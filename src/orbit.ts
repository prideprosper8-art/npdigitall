/**
 * 3D orbit engine for the Technology stage.
 *
 * Positions the capability chips on a tilted circular orbit around the NP
 * core using true 3D transforms (the stage provides the perspective). The
 * plane rotates continuously; chips keep an upright billboard orientation,
 * scale and fade with depth, and the DOM order is depth-sorted every frame
 * so chips pass correctly behind/in front of the core.
 *
 * Interaction: hovering or focusing any chip pauses the orbit so labels are
 * easy to read and click. `prefers-reduced-motion` freezes the orbit at a
 * readable static spread.
 */

type OrbitHandle = {
  setActive: (i: number) => void;
  destroy: () => void;
};

export function mountOrbit(
  container: HTMLElement,
  stage: HTMLElement,
  onSelect: (index: number) => void
): OrbitHandle {
  const chips = Array.from(
    container.querySelectorAll<HTMLElement>(".tech-module")
  );
  const n = chips.length;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!n) {
    return { setActive: () => {}, destroy: () => {} };
  }

  // ---- geometry -----------------------------------------------------------
  let radius = 0;
  let height = 0; // vertical squash of the tilted orbit plane
  const measure = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    radius = Math.max(132, Math.min(w * 0.34, 235));
    height = Math.max(100, Math.min(h * 0.29, 165));
  };
  measure();
  const ro = new ResizeObserver(() => {
    measure();
    if (paused || reduce) place(performance.now());
  });
  ro.observe(stage);

  // ---- motion state -------------------------------------------------------
  const base = chips.map((_, i) => (i / n) * Math.PI * 2);
  let angle = 0;
  let paused = false;
  let raf = 0;

  for (const chip of chips) {
    chip.addEventListener("pointerenter", () => (paused = true));
    chip.addEventListener("pointerleave", () => (paused = false));
    chip.addEventListener("focus", () => (paused = true));
    chip.addEventListener("blur", () => (paused = false));
  }

  const place = (t: number) => {
    if (!paused && !reduce) {
      angle = t / 1000 * 0.22; // rad/s → one revolution ≈ 28.5 s
    }
    const order = chips.map((chip, i) => {
      const a = (base[i] ?? 0) + angle;
      return {
        chip,
        x: Math.cos(a) * radius,
        y: -Math.sin(a) * height,
        z: Math.sin(a) * radius,
      };
    });
    // Paint back-to-front so chips interleave correctly with the core.
    order.sort((p, q) => p.z - q.z);
    for (const { chip, x, y, z } of order) {
      const depth = (z + radius) / (2 * radius); // 0 = far, 1 = near
      const scale = 0.76 + depth * 0.32;
      chip.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      chip.style.opacity = (0.6 + depth * 0.4).toFixed(2);
    }
  };

  // Lay out synchronously first: the orbit is correct even in hidden tabs
  // (where rAF may not fire) and animates as soon as frames flow.
  place(performance.now());
  if (!reduce) {
    const frame = (t: number) => {
      place(t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  // ---- selection ----------------------------------------------------------
  const setActiveIndex = (i: number) => {
    chips.forEach((chip, j) => {
      chip.classList.toggle("active", j === i);
      chip.setAttribute("aria-pressed", String(j === i));
    });
  };
  container.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>(".tech-module");
    if (btn) {
      const i = Number(btn.dataset.index);
      setActiveIndex(i);
      onSelect(i);
    }
  });

  return {
    setActive: setActiveIndex,
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
    },
  };
}
