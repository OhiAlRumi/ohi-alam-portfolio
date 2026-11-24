// Add the reveal class only when JavaScript is available.
document.documentElement.classList.add("js-ready");

// Mobile navigation: open and close the menu on small screens.
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      mainNav.classList.remove("is-open");
    });
  });
}

// Reveal sections as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Keep the footer year current.
const yearElement = document.querySelector("#current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Contact form: send the visitor's message using FormSubmit's AJAX endpoint.
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const buttonLabel = submitButton.querySelector(".button-label");
    const originalLabel = buttonLabel.textContent;

    formStatus.textContent = "Sending your message...";
    formStatus.classList.remove("error");
    submitButton.disabled = true;
    buttonLabel.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("The message could not be sent. Please try again.");
      }

      formStatus.textContent = "Thank you! Your message has been sent successfully.";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = error.message || "Something went wrong. Please email me directly.";
      formStatus.classList.add("error");
    } finally {
      submitButton.disabled = false;
      buttonLabel.textContent = originalLabel;
    }
  });
}
