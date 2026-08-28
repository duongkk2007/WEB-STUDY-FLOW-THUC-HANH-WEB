export function initPromo() {
  const btn = document.getElementById("promo-copy");
  if (!btn) return;

  const code = btn.dataset.code || "STUDYFLOW25";
  const original = btn.textContent;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      btn.textContent = "Đã copy!";
      btn.setAttribute("aria-live", "polite");
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    } catch {
      // Fallback nếu clipboard API bị chặn
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      btn.textContent = "Đã copy!";
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    }
  });
}
