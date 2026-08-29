export function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const header = document.getElementById("site-header");
  if (!toggle || !menu || !header) return;

  function setOpen(open) {
    menu.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    document.body.classList.toggle("overflow-hidden", open);
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (!header.contains(e.target)) {
      setOpen(false);
    }
  });

  const mq = window.matchMedia("(min-width: 1024px)");
  function onResize(e) {
    if (e.matches) setOpen(false);
  }
  mq.addEventListener("change", onResize);

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

export function initHeaderOnScroll() {
  const header = document.getElementById("site-header");
  const sentinel = document.getElementById("nav-sentinel");
  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(([entry]) => {
    const scrolled = !entry.isIntersecting;
    header.classList.toggle("shadow-sm", scrolled);
    header.classList.toggle("shadow-md", scrolled);
  });
  observer.observe(sentinel);
}

export function initToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;

  // Bảo đảm style cố định kể cả khi thiếu utility Tailwind
  btn.style.position = "fixed";
  btn.style.bottom = "1.5rem";
  btn.style.right = "1.5rem";
  btn.style.zIndex = "50";
  btn.style.width = "3rem";
  btn.style.height = "3rem";
  btn.style.borderRadius = "9999px";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "pointer";
  btn.style.border = "none";

  function update() {
    const show = window.scrollY > 300;
    if (show) {
      btn.classList.remove("hidden");
      btn.style.display = "flex";
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    } else {
      btn.style.display = "none";
      btn.style.pointerEvents = "none";
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
