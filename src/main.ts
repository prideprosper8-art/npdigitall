/**
 * Site bootstrap: nav, reveals, service/solution rendering, form flow,
 * and lazy-loads the Three.js hero core with graceful fallbacks.
 */
import { company, services, solutions } from "./data";

// ---------------------------------------------------------------- year
document.querySelectorAll<HTMLSpanElement>("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

// ---------------------------------------------------------------- nav
const nav = document.querySelector<HTMLElement>(".nav");
const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");

if (nav && toggle) {
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const close = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  document.querySelectorAll("nav a, .nav-cta").forEach((a) =>
    a.addEventListener("click", close)
  );
}

// ---------------------------------------------------------------- services
const serviceGrid = document.getElementById("service-grid");
if (serviceGrid) {
  serviceGrid.innerHTML = services
    .map(
      (s) => `
      <article class="service-card reveal">
        <img class="service-img" src="${s.image}" alt="" width="640" height="400" loading="lazy" decoding="async" />
        <div class="service-top"><span class="service-no">${s.no}</span><span class="service-icon" aria-hidden="true">${s.glyph}</span></div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <a href="index.html#contact">Discuss this service <b>&rarr;</b></a>
      </article>`
    )
    .join("");
}

// ---------------------------------------------------------------- capabilities
const techModules = document.getElementById("tech-modules");
const techTitle = document.getElementById("tech-title");
const techDesc = document.getElementById("tech-description");
const techIndex = document.getElementById("tech-index");
import { capabilities } from "./data";

if (techModules && techTitle && techDesc && techIndex) {
  techModules.innerHTML = capabilities
    .map(
      (c, i) =>
        `<button type="button" class="tech-module ${i === 0 ? "active" : ""}" data-index="${i}" aria-pressed="${i === 0}"><span>0${i + 1}</span>${c.title}</button>`
    )
    .join("");
  const updateDetail = (i: number) => {
    const cap = capabilities[i];
    if (cap) {
      techIndex.textContent = `0${i + 1}`;
      techTitle.textContent = cap.title;
      techDesc.textContent = cap.description;
    }
  };
  updateDetail(0);
  import("./orbit")
    .then(({ mountOrbit }) => {
      const orbit = mountOrbit(techModules!, document.querySelector<HTMLElement>(".technology-stage")!, updateDetail);
      (techModules as any).__orbit = orbit;
      orbit.setActive(0);
    })
    .catch(() => {
      // Fallback: static CSS orbit layout (no motion) if the chunk fails.
      techModules!.classList.add("orbit-fallback");
    });
}

// ---------------------------------------------------------------- solutions
const solutionList = document.getElementById("solution-list");
if (solutionList) {
  solutionList.innerHTML = solutions
    .map(
      (s, i) => `
      <article class="solution reveal">
        <button type="button" aria-expanded="false" aria-controls="sol-${i}">
          <span>${s.no}</span><h3>${s.title}</h3><i aria-hidden="true">+</i>
        </button>
        <div class="solution-body" id="sol-${i}">
          <div><small>THE CHALLENGE</small><p>${s.challenge}</p></div>
          <div><small>POSSIBLE APPROACH</small><p>${s.approach}</p></div>
          <div><small>SUITABLE FOR</small><p>${s.audience}</p></div>
          <a href="index.html#contact">Discuss requirements <span>&rarr;</span></a>
        </div>
      </article>`
    )
    .join("");

  solutionList.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (!btn) return;
    const item = btn.parentElement;
    if (!item) return;
    const isOpen = item.classList.contains("open");
    solutionList.querySelectorAll(".solution").forEach((x) => {
      x.classList.remove("open");
      x.querySelector("button")?.setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
}

// ---------------------------------------------------------------- reveals
const revealEls = document.querySelectorAll<HTMLElement>(".reveal");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (revealEls.length) {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }
}

// ---------------------------------------------------------------- contact form
const form = document.getElementById("contact-form") as HTMLFormElement | null;
if (form) {
  const status = form.querySelector<HTMLElement>(".form-status");
  const button = form.querySelector<HTMLButtonElement>("button[type=submit]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!status || !button) return;

    const formData = new FormData(form);
    button.disabled = true;
    button.dataset.state = "loading";
    status.className = "form-status";
    status.textContent = "Sending…";

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (res.ok) {
        status.className = "form-status success";
        status.textContent =
          "Thank you — your enquiry has been received. We will get back to you at the email you provided.";
        form.reset();
      } else {
        throw new Error(`Request failed (${res.status})`);
      }
    } catch {
      status.className = "form-status error";
      status.innerHTML =
        'Something went wrong sending your enquiry. Please email us directly at <a href="mailto:npdigitalinfo@gmail.com">npdigitalinfo@gmail.com</a>.';
    } finally {
      button.disabled = false;
      delete button.dataset.state;
    }
  });
}

// ---------------------------------------------------------------- 3D core (lazy)
const stage = document.getElementById("core-stage");
if (stage && !stage.dataset.loaded) {
  stage.dataset.loaded = "1";
  const start = () => {
    import("./core")
      .then(({ mountCore }) => {
        stage.classList.add("webgl");
        (stage as any).__core = mountCore(stage);
      })
      .catch(() => {
        /* CSS fallback stays visible */
      });
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    // Honour reduced motion / old browsers: keep the calm CSS fallback.
    stage.classList.add("static-fallback");
  } else {
    // Mount immediately — only the render loop itself is rAF-driven.
    // (Wrapping the mount in rAF would stall in hidden/background tabs.)
    let began = false;
    const begin = () => {
      if (began) return;
      began = true;
      start();
    };
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(begin, { timeout: 600 });
    }
    setTimeout(begin, 350);
  }
}

void company;
