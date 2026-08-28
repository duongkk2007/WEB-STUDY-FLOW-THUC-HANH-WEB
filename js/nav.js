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

  // ESC đóng menu + trả focus
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Bấm ra ngoài header
  document.addEventListener("click", (e) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (!header.contains(e.target)) {
      setOpen(false);
    }
  });

  // Đóng khi phóng lên desktop
  const mq = window.matchMedia("(min-width: 1024px)");
  function onResize(e) {
    if (e.matches) setOpen(false);
  }
  mq.addEventListener("change", onResize);

  // Đóng khi bấm link trong menu
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

  function update() {
    const show = window.scrollY > 400;
    btn.classList.toggle("hidden", !show);
    btn.classList.toggle("flex", show);
  }

  window.addEventListener("scroll", update, { passive: true });
  update();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}