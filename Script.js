"use strict";

/* =========================================
   GROWTHORA — LANDING PAGE JAVASCRIPT
========================================= */


/* 1. SELECT ELEMENTS */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#nav-menu");

const leadForm = document.querySelector("#lead-generation-form");
const formMessage = document.querySelector("#form-message");

const currentYear = document.querySelector("#current-year");


/* 2. CURRENT YEAR */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* 3. MOBILE NAVIGATION */

if (menuToggle && navMenu) {
  function closeMenu() {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  function openMenu() {
    navMenu.classList.add("active");
    menuToggle.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu after selecting a navigation link.
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu when clicking outside it.
  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  // Close menu with the Escape key.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Reset navigation when returning to desktop layout.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });
}


/* 4. FORM FIELD HELPERS */

function getField(id) {
  return document.getElementById(id);
}

function setFieldError(fieldId, errorId, message) {
  const field = getField(fieldId);
  const error = getField(errorId);

  if (field) {
    field.setAttribute(
      "aria-invalid",
      message ? "true" : "false"
    );
  }

  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(fieldId, errorId) {
  setFieldError(fieldId, errorId, "");
}

function showFormMessage(message, type) {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = "form-message " + type;
}

function clearFormMessage() {
  if (!formMessage) return;

  formMessage.textContent = "";
  formMessage.className = "form-message";
}


/* 5. INPUT VALIDATION HELPERS */

function isValidEmail(email) {
  // Basic format check. The server must validate independently.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidWebsite(url) {
  if (!url) return true;

  try {
    const parsedURL = new URL(url);

    return (
      parsedURL.protocol === "https:" ||
      parsedURL.protocol === "http:"
    );
  } catch {
    return false;
  }
}


/* 6. VALIDATE LEAD FORM */

function validateLeadForm() {
  let isValid = true;

  const nameField = getField("full-name");
  const emailField = getField("email");
  const companyField = getField("company");
  const websiteField = getField("website");
  const serviceField = getField("service");
  const consentField = getField("privacy-consent");

  if (
    !nameField ||
    !emailField ||
    !companyField ||
    !websiteField ||
    !serviceField ||
    !consentField
  ) {
    showFormMessage(
      "The form could not be validated. Please refresh the page and try again.",
      "error"
    );

    return false;
  }

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const company = companyField.value.trim();
  const website = websiteField.value.trim();
  const service = serviceField.value;

  // Validate name.
  if (name.length < 2 || name.length > 100) {
    setFieldError(
      "full-name",
      "name-error",
      "Please enter a name between 2 and 100 characters."
    );

    isValid = false;
  } else {
    clearFieldError("full-name", "name-error");
  }

  // Validate email.
  if (
    email.length > 254 ||
    !isValidEmail(email)
  ) {
    setFieldError(
      "email",
      "email-error",
      "Please enter a valid work email address."
    );

    isValid = false;
  } else {
    clearFieldError("email", "email-error");
  }

  // Validate company name.
  if (company.length < 2 || company.length > 150) {
    setFieldError(
      "company",
      "company-error",
      "Please enter a company name between 2 and 150 characters."
    );

    isValid = false;
  } else {
    clearFieldError("company", "company-error");
  }

  // Validate optional website.
  if (
    website.length > 2048 ||
    !isValidWebsite(website)
  ) {
    setFieldError(
      "website",
      "website-error",
      "Enter a valid website URL starting with http:// or https://."
    );

    isValid = false;
  } else {
    clearFieldError("website", "website-error");
  }

  // Validate service selection.
  if (!service) {
    setFieldError(
      "service",
      "service-error",
      "Please select the service you need."
    );

    isValid = false;
  } else {
    clearFieldError("service", "service-error");
  }

  // Validate privacy consent.
  const consentError = getField("consent-error");

  if (!consentField.checked) {
    if (consentError) {
      consentError.textContent =
        "Please provide consent before submitting your enquiry.";
    }

    consentField.setAttribute("aria-invalid", "true");

    isValid = false;
  } else {
    if (consentError) {
      consentError.textContent = "";
    }

    consentField.setAttribute("aria-invalid", "false");
  }

  if (!isValid) {
    showFormMessage(
      "Please review the highlighted fields and try again.",
      "error"
    );

    const firstInvalidField = leadForm.querySelector(
      '[aria-invalid="true"]'
    );

    if (firstInvalidField) {
      firstInvalidField.focus();
    }
  }

  return isValid;
}


/* 7. CLEAR FIELD ERRORS WHILE TYPING */

if (leadForm) {
  const fieldErrorPairs = [
    ["full-name", "name-error"],
    ["email", "email-error"],
    ["company", "company-error"],
    ["website", "website-error"],
    ["service", "service-error"]
  ];

  fieldErrorPairs.forEach(([fieldId, errorId]) => {
    const field = getField(fieldId);

    if (!field) return;

    field.addEventListener("input", () => {
      clearFieldError(fieldId, errorId);
      clearFormMessage();
    });

    field.addEventListener("change", () => {
      clearFieldError(fieldId, errorId);
      clearFormMessage();
    });
  });

  const consent = getField("privacy-consent");

  if (consent) {
    consent.addEventListener("change", () => {
      const error = getField("consent-error");

      if (consent.checked && error) {
        error.textContent = "";
        consent.setAttribute("aria-invalid", "false");
      }

      clearFormMessage();
    });
  }
}


/* 8. LEAD FORM SUBMISSION */

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearFormMessage();

    // Run frontend validation.
    if (!validateLeadForm()) {
      return;
    }

    // Honeypot check: this is only a basic signal.
    // Real spam protection must also be implemented server-side.
    const honeypot = getField("company-website");

    if (honeypot && honeypot.value.trim() !== "") {
      // Do not disclose the honeypot field to the visitor.
      showFormMessage(
        "Your enquiry could not be processed. Please try again.",
        "error"
      );

      return;
    }

    /*
      BACKEND INTEGRATION POINT

      After your backend is ready, send the form data to your
      secure API endpoint here.

      Example structure:

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(leadData)
      });

      Never trust client-side validation alone.
      The server must validate every field, enforce consent,
      apply rate limiting, and protect stored lead information.
    */

    showFormMessage(
      "The form passed validation, but submission is not connected yet. Please connect the backend to receive enquiries.",
      "error"
    );
  });
}


/* 9. FAQ ACCORDION */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  });
});


/* 10. TRACK CTA CLICKS */

document.querySelectorAll('a[href="#lead-form"]').forEach((link) => {
  link.addEventListener("click", () => {
    /*
      ANALYTICS INTEGRATION POINT

      Once Google Analytics is configured and consent requirements
      are handled, a conversion-related event can be recorded here.

      Do not send names, email addresses, phone numbers, or other
      personally identifiable information to analytics.
    */

    // No analytics data is sent by this standalone script.
  });
});


/* 11. HANDLE INTERNAL NAVIGATION */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    // Preserve normal browser behavior for modifier-key clicks.
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    // Let the browser perform its normal anchor navigation.
  });
});