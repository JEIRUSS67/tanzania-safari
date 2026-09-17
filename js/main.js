/**
 * main.js — shared site behaviour
 * Navigation, sticky header state, scroll reveal, smooth
 * anchor scrolling, and the FAQ accordion (where present).
 */
(function () {
  "use strict";

  /* ---------- Sticky header ---------- */
  const header = document.querySelector(".site-header");
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navScrim = document.querySelector(".nav-scrim");

  function closeNav() {
    if (!navMenu) return;
    navMenu.classList.remove("is-open");
    navScrim && navScrim.classList.remove("is-open");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!navMenu) return;
    navMenu.classList.add("is-open");
    navScrim && navScrim.classList.add("is-open");
    navToggle && navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });
    navScrim && navScrim.addEventListener("click", closeNav);
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Safari filter (Safaris page) ---------- */
  const filterRow = document.querySelector(".filter-row");
  if (filterRow) {
    const buttons = filterRow.querySelectorAll("button");
    const cards = document.querySelectorAll("[data-category]");
    filterRow.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "" : "none";
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-item__q");
    const answer = item.querySelector(".faq-item__a");
    if (!question || !answer) return;
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".faq-item__a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("is-open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
})();
