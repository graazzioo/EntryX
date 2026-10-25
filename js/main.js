/* ============================================================
   EntryX — main.js
   Меню, скролл-спай (aria-current), год в футере
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Год в футере ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Мобильное меню ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const desktopMQ = window.matchMedia("(min-width: 900px)");

  function setMenu(open) {
    if (!menuBtn || !mobileNav) return;
    mobileNav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("menu-open", open);
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });

    /* Клик по ссылке внутри меню — закрыть */
    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    /* Escape — закрыть и вернуть фокус */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuBtn.focus();
      }
    });

    /* При выходе на десктопную ширину — гарантированно закрыть */
    desktopMQ.addEventListener("change", function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* ---------- Scrollspy: aria-current в навигации ---------- */
  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"], .mobile-nav a[href^="#"]')
  );

  const sections = navLinks
    .map(function (a) {
      const id = a.getAttribute("href");
      return id && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActive(hash) {
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === hash) {
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    let currentHash = "";

    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) currentHash = "#" + entry.target.id;
        });
        setActive(currentHash);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      spy.observe(s);
    });
  }
})();