(function() {
  'use strict';

  const heroSlides = document.querySelectorAll('.hero__slide');
  if (heroSlides.length === 0) return;

  let currentIndex = 0;
  const interval = 6000; // Change slide every 6 seconds
  let slideInterval;

  function nextSlide() {
    // Remove active class from current slide
    heroSlides[currentIndex].classList.remove('hero__slide--active');
    
    // Move to next slide, loop back to 0 if at end
    currentIndex = (currentIndex + 1) % heroSlides.length;
    
    // Add active class to new slide
    heroSlides[currentIndex].classList.add('hero__slide--active');
  }

  // Start the slideshow
  slideInterval = setInterval(nextSlide, interval);

  // Optional: Pause on hover for better UX
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    heroSection.addEventListener('mouseleave', () => {
      slideInterval = setInterval(nextSlide, interval);
    });
  }

  // Handle reduced motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    clearInterval(slideInterval);
  }

})();
