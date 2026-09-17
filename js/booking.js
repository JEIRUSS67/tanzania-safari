/**
 * booking.js — client-side validation and submission for the
 * booking request form and the contact form. Server-side PHP
 * re-validates everything; this is a UX layer only.
 */
(function () {
  "use strict";

  const rules = {
    full_name: { required: true, label: "Full name" },
    email: { required: true, label: "Email address", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: true, label: "Phone number" },
    country: { required: true, label: "Country" },
    safari: { required: true, label: "Preferred safari" },
    travel_date: { required: true, label: "Preferred travel date" },
    travelers: { required: true, label: "Number of travelers" },
    duration: { required: false, label: "Safari duration" },
    accommodation: { required: false, label: "Accommodation preference" },
    message: { required: false, label: "Special requests" },
  };

  const contactRules = {
    name: { required: true, label: "Name" },
    email: { required: true, label: "Email address", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    subject: { required: true, label: "Subject" },
    message: { required: true, label: "Message" },
  };

  function validateField(form, name, fieldRules) {
    const field = form.elements[name];
    if (!field) return true;
    const wrapper = field.closest(".form-field");
    const errorEl = wrapper ? wrapper.querySelector(".field-error") : null;
    const value = field.value.trim();

    let message = "";
    if (fieldRules.required && !value) {
      message = fieldRules.label + " is required.";
    } else if (value && fieldRules.pattern && !fieldRules.pattern.test(value)) {
      message = "Enter a valid " + fieldRules.label.toLowerCase() + ".";
    }

    if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  function setStatus(statusEl, type, text) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = "form-status " + (type === "success" ? "is-success" : "is-error");
  }

  function loadCsrfToken(form) {
    const tokenField = form.querySelector('input[name="csrf_token"]');
    if (!tokenField) return;
    fetch("php/csrf.php", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.token) tokenField.value = data.token;
      })
      .catch(() => {
        /* Token will simply be empty; the server rejects the submission
           with a clear "session expired, please refresh" message. */
      });
  }

  function wireForm(formSelector, ruleSet, endpoint) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    const statusEl = form.querySelector(".form-status");
    const submitBtn = form.querySelector('button[type="submit"]');

    loadCsrfToken(form);

    Object.keys(ruleSet).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      field.addEventListener("blur", () => validateField(form, name, ruleSet[name]));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;
      Object.keys(ruleSet).forEach((name) => {
        const fieldValid = validateField(form, name, ruleSet[name]);
        isValid = isValid && fieldValid;
      });

      if (!isValid) {
        setStatus(statusEl, "error", "Please correct the highlighted fields and try again.");
        const firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      const formData = new FormData(form);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        const result = await response.json();

        if (response.ok && result.success) {
          setStatus(statusEl, "success", result.message || "Thank you. Your request has been received.");
          form.reset();
        } else {
          setStatus(statusEl, "error", result.message || "Something went wrong. Please try again.");
        }
      } catch (err) {
        setStatus(
          statusEl,
          "error",
          "We couldn't reach the server. Please check your connection and try again."
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText || "Submit";
        }
      }
    });
  }

  wireForm("#booking-form", rules, "php/booking.php");
  wireForm("#contact-form", contactRules, "php/contact.php");
})();
