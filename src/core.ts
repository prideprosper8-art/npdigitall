import * as THREE from "three";
import { company } from "./data";

/**
 * NP Digital — interactive 3D technology core.
 * Loaded lazily via dynamic import() so Three.js (~600KB gz) never blocks
 * first paint. The page renders a static CSS fallback until this resolves,
 * and keeps it if WebGL is unavailable or motion is reduced.
 */

export type CoreHandle = { dispose: () => void };

export function mountCore(container: HTMLElement): CoreHandle {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.2, 7.2);

  // ---- Lighting: cinematic blue/cyan key + rim -------------------------
  scene.add(new THREE.AmbientLight(0x0a1a33, 1.6));
  const key = new THREE.DirectionalLight(0x2f9bff, 2.4);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0x1fd7e8, 14, 30);
  rim.position.set(-5, -2, -4);
  scene.add(rim);
  const fill = new THREE.PointLight(0x0d66d6, 8, 25);
  fill.position.set(3, -4, 3);
  scene.add(fill);

  // ---- Inner geometric core -------------------------------------------
  const core = new THREE.Group();
  scene.add(core);

  const icosahedron = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, 1),
    new THREE.MeshStandardMaterial({
      color: 0x0c2036,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x06304f,
      emissiveIntensity: 0.45,
      flatShading: true,
    })
  );
  core.add(icosahedron);

  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.38, 1)),
    new THREE.LineBasicMaterial({ color: 0x3fd8f5, transparent: true, opacity: 0.55 })
  );
  core.add(wire);

  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.62, 2),
    new THREE.MeshBasicMaterial({ color: 0x36e0f8, transparent: true, opacity: 0.85 })
  );
  core.add(inner);

  // ---- Orbital rings ---------------------------------------------------
  const rings: THREE.Mesh[] = [];
  const ringSpecs = [
    { r: 2.15, tilt: 1.18, speed: 0.12, opacity: 0.5 },
    { r: 2.5, tilt: -0.9, speed: -0.08, opacity: 0.35 },
    { r: 2.85, tilt: 0.45, speed: 0.05, opacity: 0.22 },
  ];
  for (const spec of ringSpecs) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(spec.r, 0.008, 8, 160),
      new THREE.MeshBasicMaterial({
        color: 0x49c9f2,
        transparent: true,
        opacity: spec.opacity,
      })
    );
    ring.rotation.x = spec.tilt;
    ring.userData.speed = spec.speed;
    rings.push(ring);
    scene.add(ring);
  }

  // ---- Technology nodes on outer ring ----------------------------------
  const nodeGeometry = new THREE.SphereGeometry(0.055, 12, 12);
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x8ef0ff });
  const nodes: { mesh: THREE.Mesh; ring: number; angle: number }[] = [];
  ringSpecs.forEach((spec, ri) => {
    const count = [5, 4, 3][ri] ?? 3;
    for (let i = 0; i < count; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.userData = { ring: ri, angle: (i / count) * Math.PI * 2 };
      nodes.push({ mesh: node, ring: ri, angle: node.userData.angle });
      scene.add(node);
    }
  });

  // ---- Ambient particle field ------------------------------------------
  const PARTICLES = prefersReduced ? 0 : 420;
  let particlePoints: THREE.Points | null = null;
  if (PARTICLES > 0) {
    const positions = new Float32Array(PARTICLES * 3);
    for (let i = 0; i < PARTICLES; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlePoints = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x63b6e8,
        size: 0.028,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      })
    );
    scene.add(particlePoints);
  }

  // ---- Interaction ------------------------------------------------------
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  const onPointer = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  if (!prefersReduced) {
    window.addEventListener("pointermove", onPointer, { passive: true });
  }

  // Pause rendering when offscreen (hero not visible) to save GPU/battery.
  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? true;
    },
    { threshold: 0.02 }
  );
  io.observe(container);

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  const start = performance.now();
  let raf = 0;
  let running = true;
  const tmpV = new THREE.Vector3();
  const tmpE = new THREE.Euler();

  function tick() {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (!visible) return;

    const t = (performance.now() - start) / 1000;
    pointerX += (targetX - pointerX) * 0.045;
    pointerY += (targetY - pointerY) * 0.045;

    core.rotation.y = t * 0.14 + pointerX * 0.28;
    core.rotation.x = Math.sin(t * 0.22) * 0.08 + pointerY * 0.18;
    inner.scale.setScalar(1 + Math.sin(t * 1.6) * 0.07);
    (wire.material as THREE.LineBasicMaterial).opacity =
      0.4 + Math.sin(t * 0.9) * 0.16;

    rings.forEach((ring, i) => {
      ring.rotation.z += ring.userData.speed * 0.01;
      ring.rotation.y = pointerX * 0.1 * (i + 1);
    });

    // Position nodes along their parent ring orientation
    nodes.forEach(({ mesh, ring, angle }) => {
      const spec = ringSpecs[ring]!;
      const a = angle + t * spec.speed;
      const ringMesh = rings[ring];
      tmpV.set(Math.cos(a) * spec.r, 0, Math.sin(a) * spec.r);
      tmpE.set(spec.tilt, pointerX * 0.1 * (ring + 1), ringMesh ? ringMesh.rotation.z : 0);
      tmpV.applyEuler(tmpE);
      mesh.position.copy(tmpV);
    });

    if (particlePoints) particlePoints.rotation.y = t * 0.015;

    camera.position.x += (pointerX * 0.35 - camera.position.x) * 0.03;
    camera.position.y += (0.2 - pointerY * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  tick();

  const cleanups: (() => void)[] = [
    () => window.removeEventListener("pointermove", onPointer),
    () => io.disconnect(),
    () => ro.disconnect(),
    () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      container.contains(renderer.domElement) &&
        container.removeChild(renderer.domElement);
    },
  ];

  void company; // keep import tree-shaken-safe if unused later

  return {
    dispose() {
      running = false;
      cleanups.forEach((fn) => fn());
    },
  };
}
