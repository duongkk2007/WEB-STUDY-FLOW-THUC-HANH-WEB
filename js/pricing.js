export function initPricing() {
  const root = document.getElementById("pricing");
  if (!root) return;

  const toggle = document.getElementById("pricing-toggle");
  const prices = root.querySelectorAll("[data-price]");
  const periods = root.querySelectorAll("[data-period]");
  const labelMonthly = document.getElementById("label-monthly");
  const labelYearly = document.getElementById("label-yearly");
  if (!toggle) return;

  const dong = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  function update(yearly) {
    toggle.setAttribute("aria-checked", String(yearly));
    // Visual knob via CSS aria-checked or class
    const knob = toggle.querySelector("span");
    if (knob) {
      knob.classList.toggle("translate-x-5", yearly);
      knob.classList.toggle("left-0.5", !yearly);
    }
    toggle.classList.toggle("bg-brand-600", yearly);
    toggle.classList.toggle("bg-line", !yearly);

    prices.forEach((el) => {
      const value = yearly
        ? Number(el.dataset.yearly)
        : Number(el.dataset.monthly);
      el.textContent = dong.format(value);
    });

    periods.forEach((el) => {
      el.textContent = yearly ? "/năm" : "/tháng";
    });

    if (labelMonthly) {
      labelMonthly.classList.toggle("text-ink", !yearly);
      labelMonthly.classList.toggle("dark:text-white", !yearly);
      labelMonthly.classList.toggle("text-muted", yearly);
    }
    if (labelYearly) {
      labelYearly.classList.toggle("text-ink", yearly);
      labelYearly.classList.toggle("dark:text-white", yearly);
      labelYearly.classList.toggle("text-muted", !yearly);
      labelYearly.classList.toggle("dark:text-white/50", !yearly);
    }
  }

  // Khởi tạo theo aria-checked hiện tại
  update(toggle.getAttribute("aria-checked") === "true");

  toggle.addEventListener("click", () => {
    const next = toggle.getAttribute("aria-checked") !== "true";
    update(next);
  });

  // Hỗ trợ bàn phím (Space / Enter)
  toggle.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const next = toggle.getAttribute("aria-checked") !== "true";
      update(next);
    }
  });
}
