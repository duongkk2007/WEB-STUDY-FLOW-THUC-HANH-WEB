export function initSlider() {
  const root = document.getElementById("slider");
  if (!root) return;

  const track = document.getElementById("slider-track");
  const slides = root.querySelectorAll("[data-slide]");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");
  const dotsRoot = document.getElementById("slider-dots");
  if (!track || !slides.length) return;

  let index = 0;
  let timer = null;
  const INTERVAL = 5000;

  // Sinh chấm chỉ dẫn từ số slide thật
  if (dotsRoot) {
    dotsRoot.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.className =
        "h-2.5 w-2.5 rounded-full bg-line transition-colors dark:bg-white/30 " +
        (i === 0 ? "bg-brand-600 dark:bg-brand-600" : "");
      dot.addEventListener("click", () => go(i));
      dotsRoot.appendChild(dot);
    });
  }

  function go(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((s, i) => {
      s.toggleAttribute("inert", i !== index);
    });

    if (dotsRoot) {
      const dots = dotsRoot.querySelectorAll("button");
      dots.forEach((d, i) => {
        const active = i === index;
        d.setAttribute("aria-selected", String(active));
        d.classList.toggle("bg-brand-600", active);
        d.classList.toggle("dark:bg-brand-600", active);
        d.classList.toggle("bg-line", !active);
        d.classList.toggle("dark:bg-white/30", !active);
      });
    }
  }

  function start() {
    stop();
    timer = setInterval(() => go(index + 1), INTERVAL);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (prevBtn) prevBtn.addEventListener("click", () => go(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => go(index + 1));

  // Tự chạy nhưng dừng khi người dùng đang xem
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  // Khởi tạo
  go(0);
  start();
}
