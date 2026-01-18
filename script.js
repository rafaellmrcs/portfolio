// ===== Theme
const themeBtn = document.getElementById("themeBtn");
const THEME_KEY = "phone-sidebar-theme";

function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

const saved = localStorage.getItem(THEME_KEY);
if (saved === "light" || saved === "dark") {
  applyTheme(saved);
} else {
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  applyTheme(prefersLight ? "light" : "dark");
}

themeBtn?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

// ===== Sidebar open/close
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function openMenu(){
  sidebar.classList.add("is-open");
  overlay.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  menuBtn.setAttribute("aria-label", "Close menu");
}

function closeMenu(){
  sidebar.classList.remove("is-open");
  overlay.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open menu");
}

menuBtn?.addEventListener("click", () => {
  const isOpen = sidebar.classList.contains("is-open");
  isOpen ? closeMenu() : openMenu();
});

closeBtn?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar.classList.contains("is-open")) closeMenu();
});

// ===== Page switching
const navItems = Array.from(document.querySelectorAll(".navitem"));
const pages = Array.from(document.querySelectorAll(".page"));
const pagesWrap = document.getElementById("pages");

function setPage(name){
  navItems.forEach(b => b.classList.toggle("is-active", b.dataset.page === name));
  pages.forEach(p => p.classList.toggle("is-active", p.dataset.page === name));
  if (pagesWrap) pagesWrap.scrollTop = 0;
}

navItems.forEach(item => {
  item.addEventListener("click", () => {
    setPage(item.dataset.page);
    closeMenu();
  });
});

// ===== Footer year
document.getElementById("year").textContent = String(new Date().getFullYear());

// ===== Contact form (demo)
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("status");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    statusEl.textContent = "Please fill all fields correctly.";
    return;
  }
  statusEl.textContent = "Sending...";
  const fd = new FormData(form);
  const name = (fd.get("name") || "").toString().trim();

  setTimeout(() => {
    statusEl.textContent = `Thanks${name ? ", " + name : ""}! (Hook this to your backend later.)`;
    form.reset();
  }, 700);
});
