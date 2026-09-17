/**
 * gallery.js — accessible lightbox for the photo gallery
 */
(function () {
  "use strict";

  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.querySelector(".lightbox");
  if (!items.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector("img");
  const captionEl = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__prev");
  const nextBtn = lightbox.querySelector(".lightbox__next");

  let currentIndex = 0;
  let lastFocused = null;

  function show(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    captionEl.textContent = item.dataset.caption || img.alt || "";
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => open(index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(index);
      }
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });
})();
