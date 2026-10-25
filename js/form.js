/* ============================================================
   EntryX — form.js
   Маска телефона, валидация, кнопки выбора тарифа
   ============================================================ */

(function () {
  "use strict";

  const form = document.getElementById("booking");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const nameErr = document.getElementById("nameErr");
  const phoneErr = document.getElementById("phoneErr");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const dateErr = document.getElementById("dateErr");
  const timeErr = document.getElementById("timeErr");
  const tariffSel = document.getElementById("tariffSel");
  const status = document.getElementById("formStatus");
  const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Утилиты ---------- */
  function showError(input, errEl, msg, focus) {
    input.setAttribute("aria-invalid", "true");
    errEl.textContent = msg;
    if (focus) input.focus();
  }

  function clearError(input, errEl) {
    input.removeAttribute("aria-invalid");
    if (errEl.textContent) errEl.textContent = "";
  }

  /* ---------- Маска телефона +7 (___) ___-__-__ ---------- */
  function formatPhone(value) {
    const digits = value.replace(/\D/g, "").replace(/^[78]/, "").slice(0, 10);
    let out = "+7";
    if (digits.length > 0) out += " (" + digits.slice(0, 3);
    if (digits.length >= 4) out += ") " + digits.slice(3, 6);
    if (digits.length >= 7) out += "-" + digits.slice(6, 8);
    if (digits.length >= 9) out += "-" + digits.slice(8, 10);
    return out;
  }

  phoneInput.addEventListener("input", function () {
    phoneInput.value = formatPhone(phoneInput.value);
    if (phoneInput.getAttribute("aria-invalid") === "true") {
      clearError(phoneInput, phoneErr);
    }
  });

  nameInput.addEventListener("input", function () {
    if (nameInput.getAttribute("aria-invalid") === "true") {
      clearError(nameInput, nameErr);
    }
  });

  dateInput.addEventListener("input", function () {
    if (dateInput.getAttribute("aria-invalid") === "true") {
      clearError(dateInput, dateErr);
    }
  });

  timeInput.addEventListener("input", function () {
    if (timeInput.getAttribute("aria-invalid") === "true") {
      clearError(timeInput, timeErr);
    }
  });

  /* ---------- Проверка даты (не в прошлом) ---------- */
  function isPastDate(value) {
    if (!value) return false;
    const day = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  }

  /* ---------- Валидация ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = true;

    let ok = true;

    const name = nameInput.value.trim();
    if (name.length < 2) {
      showError(nameInput, nameErr, "Введите имя (минимум 2 символа).", ok);
      ok = false;
    } else {
      clearError(nameInput, nameErr);
    }

    const digits = phoneInput.value.replace(/\D/g, "");
    if (!/^(7|8)?\d{10}$/.test(digits)) {
      showError(
        phoneInput,
        phoneErr,
        "Введите номер полностью, например +7 (912) 345-67-89.",
        ok && name.length >= 2
      );
      ok = false;
    } else {
      clearError(phoneInput, phoneErr);
    }

    if (!dateInput.value) {
      showError(dateInput, dateErr, "Выберите дату.", ok);
      ok = false;
    } else if (isPastDate(dateInput.value)) {
      showError(dateInput, dateErr, "Дата не может быть в прошлом.", false);
      ok = false;
    } else {
      clearError(dateInput, dateErr);
    }

    if (!timeInput.value) {
      showError(timeInput, timeErr, "Выберите время.", ok);
      ok = false;
    } else {
      clearError(timeInput, timeErr);
    }

    if (!ok) return;

    status.textContent =
      "Демо-режим: заявка не отправлена, так как у страницы нет серверной части. " +
      "Подключите обработчик формы или позвоните в клуб.";
    status.hidden = false;
    form.reset();
  });

  /* ---------- Кнопки «Выбрать» в тарифах ---------- */
  document.querySelectorAll("[data-tariff]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      tariffSel.value = btn.getAttribute("data-tariff");
      const behavior = reduceMotionMQ.matches ? "auto" : "smooth";
      form.scrollIntoView({ behavior: behavior, block: "center" });
      setTimeout(function () {
        nameInput.focus({ preventScroll: true });
      }, 400);
    });
  });
})();