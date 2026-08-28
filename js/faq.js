export function initFaq() {
  const root = document.getElementById("faq");
  if (!root) return;

  const triggers = root.querySelectorAll("[data-faq-trigger]");

  function setOpen(trigger, open) {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    trigger.setAttribute("aria-expanded", String(open));
    if (panel) {
      panel.classList.toggle("hidden", !open);
    }
    const icon = trigger.querySelector(".faq-icon");
    if (icon) {
      icon.classList.toggle("rotate-180", open);
    }
  }

  // Event delegation — một listener cho cả nhóm
  root.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-faq-trigger]");
    if (!trigger) return;

    const willOpen = trigger.getAttribute("aria-expanded") !== "true";
    // Đóng hết rồi mở đúng cái vừa bấm
    triggers.forEach((t) => setOpen(t, false));
    if (willOpen) setOpen(trigger, true);
  });
}
