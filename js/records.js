const STORAGE_KEY = "studyflow-sessions-v2";

const STATUS_LABEL = {
  "dang-hoc": "Đang học",
  "da-xong": "Đã xong",
  "bo-do": "Bỏ dở",
  "hen-lai": "Hẹn lại",
};

const sorters = {
  "date-desc": (a, b) => b.date.localeCompare(a.date),
  "date-asc": (a, b) => a.date.localeCompare(b.date),
  "minutes-desc": (a, b) => b.minutes - a.minutes,
  "minutes-asc": (a, b) => a.minutes - b.minutes,
  "sessions-desc": (a, b) => b.sessions - a.sessions,
  "student-asc": (a, b) => a.student.localeCompare(b.student, "vi"),
};

const state = {
  records: [],
  query: "",
  subject: "all",
  status: "all",
  sort: "date-desc",
  loading: true,
  error: null,
};

function debounce(fn, delay = 300) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), delay);
  };
}

function visibleRecords() {
  const q = state.query.trim().toLowerCase();
  return state.records
    .filter((r) => state.subject === "all" || r.subject === state.subject)
    .filter((r) => state.status === "all" || r.status === state.status)
    .filter(
      (r) =>
        !q ||
        r.student.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q)
    )
    .sort(sorters[state.sort] || sorters["date-desc"]);
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

async function loadRecords() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length && parsed[0].student) return parsed;
    } catch {
      /* ignore */
    }
  }
  // Xóa cache cũ (schema nông sản) nếu còn
  localStorage.removeItem("studyflow-records-v1");
  const res = await fetch("./data/records.json");
  if (!res.ok) throw new Error(`Máy chủ trả về ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Dữ liệu không hợp lệ");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function buildRow(record) {
  const tpl = document.getElementById("row-template");
  const row = tpl.content.firstElementChild.cloneNode(true);
  row.dataset.id = record.id;
  row.querySelector('[data-cell="id"]').textContent = record.id;
  row.querySelector('[data-cell="student"]').textContent = record.student;
  row.querySelector('[data-cell="subject"]').textContent = record.subject;
  const statusEl = row.querySelector('[data-cell="status"]');
  statusEl.textContent = STATUS_LABEL[record.status] || record.status;
  statusEl.dataset.status = record.status;
  row.querySelector('[data-cell="minutes"]').textContent = `${record.minutes} phút`;
  row.querySelector('[data-cell="sessions"]').textContent = String(record.sessions);
  row.querySelector('[data-cell="date"]').textContent = record.date;
  const del = row.querySelector("[data-delete]");
  if (del) del.dataset.id = record.id;
  return row;
}

function render() {
  const root = document.getElementById("records-app");
  if (!root) return;

  const loadingEl = root.querySelector("[data-state='loading']");
  const errorEl = root.querySelector("[data-state='error']");
  const emptyEl = root.querySelector("[data-state='empty']");
  const tableWrap = root.querySelector("[data-state='table']");
  const tbody = root.querySelector("#records-tbody");
  const countEl = root.querySelector("[data-count]");
  const errorMsg = root.querySelector("[data-error-msg]");

  loadingEl?.classList.toggle("hidden", !state.loading);
  errorEl?.classList.toggle("hidden", state.loading || !state.error);
  if (errorMsg && state.error) errorMsg.textContent = state.error;

  if (state.loading || state.error) {
    emptyEl?.classList.add("hidden");
    tableWrap?.classList.add("hidden");
    return;
  }

  const list = visibleRecords();
  if (countEl) countEl.textContent = String(list.length);

  if (!list.length) {
    emptyEl?.classList.remove("hidden");
    tableWrap?.classList.add("hidden");
    if (tbody) tbody.replaceChildren();
    return;
  }

  emptyEl?.classList.add("hidden");
  tableWrap?.classList.remove("hidden");
  if (tbody) tbody.replaceChildren(...list.map(buildRow));
}

function bindControls(root) {
  const search = root.querySelector("#records-search");
  const subject = root.querySelector("#records-subject");
  const status = root.querySelector("#records-status");
  const sort = root.querySelector("#records-sort");
  const resetBtn = root.querySelector("#records-reset");
  const restoreBtn = root.querySelector("#records-restore");
  const form = root.querySelector("#records-add-form");
  const tbody = root.querySelector("#records-tbody");

  if (search) {
    search.addEventListener(
      "input",
      debounce((e) => {
        state.query = e.target.value;
        render();
      }, 300)
    );
  }
  if (subject) {
    subject.addEventListener("change", (e) => {
      state.subject = e.target.value;
      render();
    });
  }
  if (status) {
    status.addEventListener("change", (e) => {
      state.status = e.target.value;
      render();
    });
  }
  if (sort) {
    sort.addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.query = "";
      state.subject = "all";
      state.status = "all";
      state.sort = "date-desc";
      if (search) search.value = "";
      if (subject) subject.value = "all";
      if (status) status.value = "all";
      if (sort) sort.value = "date-desc";
      render();
    });
  }

  async function restore() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("studyflow-records-v1");
    state.loading = true;
    state.error = null;
    render();
    try {
      state.records = await loadRecords();
    } catch (err) {
      state.error = `Không tải được dữ liệu: ${err.message}`;
    } finally {
      state.loading = false;
      render();
    }
  }

  if (restoreBtn) restoreBtn.addEventListener("click", restore);
  root.querySelectorAll("[data-restore-retry]").forEach((btn) => {
    btn.addEventListener("click", restore);
  });

  if (tbody) {
    tbody.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-delete]");
      if (!btn) return;
      const id = btn.dataset.id;
      if (!id) return;
      if (!confirm(`Xóa phiên ${id}?`)) return;
      state.records = state.records.filter((r) => r.id !== id);
      saveLocal();
      render();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const student = String(fd.get("student") || "").trim();
      const subjectVal = String(fd.get("subject") || "");
      const statusVal = String(fd.get("status") || "dang-hoc");
      const minutes = Number(fd.get("minutes"));
      const sessions = Number(fd.get("sessions"));
      const dateVal = String(fd.get("date") || "");

      if (!student || !subjectVal || !dateVal || !(minutes > 0) || !(sessions >= 0)) {
        alert("Vui lòng điền đủ thông tin hợp lệ.");
        return;
      }

      const id = `SF-${dateVal.slice(2, 4)}${dateVal.slice(5, 7)}-${String(
        Math.floor(100 + Math.random() * 900)
      )}`;
      state.records = [
        {
          id,
          student,
          subject: subjectVal,
          status: statusVal,
          minutes,
          sessions,
          date: dateVal,
        },
        ...state.records,
      ];
      saveLocal();
      form.reset();
      render();
    });
  }
}

export async function initRecords() {
  const root = document.getElementById("records-app");
  if (!root) return;

  bindControls(root);
  render();

  try {
    state.records = await loadRecords();
  } catch (err) {
    state.error = `Không tải được dữ liệu: ${err.message}`;
  } finally {
    state.loading = false;
    render();
  }
}
