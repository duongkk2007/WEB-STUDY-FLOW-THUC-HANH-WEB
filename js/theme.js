export function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  function apply(dark) {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    toggle.setAttribute(
      "aria-label",
      dark ? "Chuyển chế độ sáng" : "Chuyển chế độ tối"
    );
  }

  // Đồng bộ trạng thái ban đầu 
  const isDark = document.documentElement.classList.contains("dark");
  toggle.setAttribute(
    "aria-label",
    isDark ? "Chuyển chế độ sáng" : "Chuyển chế độ tối"
  );

  toggle.addEventListener("click", () => {
    const next = !document.documentElement.classList.contains("dark");
    apply(next);
  });
}
