/* ============================================================
   ui.js — shared interactive behaviors across all public pages
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      const expanded = mobileNav.classList.contains("open");
      toggle.setAttribute("aria-expanded", String(expanded));
    });
  }

  // Highlight current page in nav
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a, .mobile-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current", "page");
  });

  // Duplicate ticker content for seamless loop
  const tickerInner = document.querySelector(".ticker-inner");
  if (tickerInner && !tickerInner.dataset.duplicated) {
    tickerInner.innerHTML += tickerInner.innerHTML;
    tickerInner.dataset.duplicated = "true";
  }

  // Reflect login state in header (Login button -> Dashboard link if a session exists)
  const session = window.PCET ? window.PCET.getSession() : null;
  const authSlot = document.querySelector("[data-auth-slot]");
  if (authSlot) {
    if (session) {
      const dest = session.role === "faculty" ? "faculty-dashboard.html" : "student-dashboard.html";
      authSlot.innerHTML = `<a href="${dest}" class="btn btn-primary btn-sm">My Dashboard</a>`;
    } else {
      authSlot.innerHTML = `<a href="login.html" class="btn btn-primary btn-sm">Portal Login</a>`;
    }
  }
});
