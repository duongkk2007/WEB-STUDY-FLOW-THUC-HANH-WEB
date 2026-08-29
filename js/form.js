function messageFor(field) {
  const v = field.validity;
  if (v.valueMissing) return "Vui lòng điền mục này.";
  if (v.typeMismatch) {
    if (field.type === "email")
      return "Email chưa đúng dạng, ví dụ: chuvua@gmail.com";
    return "Giá trị chưa đúng định dạng.";
  }
  if (v.patternMismatch) {
    if (field.name === "dienThoai" || field.id === "dien-thoai")
      return "Nhập 10 chữ số, bắt đầu bằng 0. Ví dụ: 0912345678";
    return "Giá trị không khớp định dạng yêu cầu.";
  }
  if (v.tooShort)
    return `Cần ít nhất ${field.minLength} ký tự.`;
  if (v.tooLong)
    return `Tối đa ${field.maxLength} ký tự.`;
  if (v.customError) return field.validationMessage;
  return "Dữ liệu không hợp lệ.";
}

function showFieldError(field, message) {
  field.setAttribute("aria-invalid", "true");
  const box = document.getElementById(`${field.id}-error`);
  if (box) box.textContent = message;
}

function clearFieldError(field) {
  field.removeAttribute("aria-invalid");
  const box = document.getElementById(`${field.id}-error`);
  if (box) box.textContent = "";
}

function showToast(message, type = "success") {
  let toast = document.getElementById("form-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "form-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.className =
      "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill px-5 py-3 text-sm font-semibold text-white shadow-lg transition-opacity";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.backgroundColor = type === "success" ? "#2b3a99" : "#b91c1c";
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");
  clearTimeout(toast._tid);
  toast._tid = setTimeout(() => {
    toast.classList.add("opacity-0");
  }, 3200);
}

export function initForm() {
  const form = document.querySelector("form[novalidate]");
  if (!form || !form.closest("main")) return;
  // only contact form
  if (!form.querySelector("#ho-ten")) return;

  const fields = [...form.querySelectorAll("input, select, textarea")].filter(
    (el) => el.willValidate
  );

  const summary = document.getElementById("form-error-summary");

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.validity.valid) clearFieldError(field);
    });
    field.addEventListener("blur", () => {
      if (!field.validity.valid && field.value !== "") {
        showFieldError(field, messageFor(field));
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstInvalid = null;
    let count = 0;

    fields.forEach((field) => {
      if (!field.checkValidity()) {
        showFieldError(field, messageFor(field));
        count += 1;
        if (!firstInvalid) firstInvalid = field;
      } else {
        clearFieldError(field);
      }
    });

    if (summary) {
      if (count > 0) {
        summary.textContent = `Có ${count} mục cần sửa. Vui lòng kiểm tra các ô được đánh dấu.`;
        summary.classList.remove("hidden");
      } else {
        summary.textContent = "";
        summary.classList.add("hidden");
      }
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // fake success
    form.reset();
    fields.forEach(clearFieldError);
    if (summary) {
      summary.textContent = "";
      summary.classList.add("hidden");
    }
    showToast("Đã gửi liên hệ thành công. StudyFlow sẽ phản hồi sớm.");
  });
}
