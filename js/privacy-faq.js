
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Automatically update the copyright year.
  const currentYear = document.querySelector("#current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  const menuToggle = document.querySelector("#menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (menuToggle && navigation) {
    const menuIsOpen = () =>
      menuToggle.getAttribute("aria-expanded") === "true";

    function openMenu() {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation menu");
      navigation.classList.add("is-open");
      document.body.classList.add("menu-open");
    }

    function closeMenu(restoreFocus = false) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
      document.body.classList.remove("menu-open");

      if (restoreFocus) {
        menuToggle.focus();
      }
    }

    menuToggle.addEventListener("click", () => {
      if (menuIsOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("click", (event) => {
      if (
        menuIsOpen() &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuIsOpen()) {
        closeMenu(true);
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 761px)").matches) {
        closeMenu();
      }
    });
  }

  // Accessible FAQ accordion
  const faqList = document.querySelector("[data-faq-list]");

  if (faqList) {
    const faqButtons = faqList.querySelectorAll(".pf-faq-question");

    function setFaqState(button, shouldOpen) {
      const answerId = button.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);

      button.setAttribute("aria-expanded", String(shouldOpen));

      if (answer) {
        answer.hidden = !shouldOpen;
      }
    }

    faqButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const isCurrentlyOpen =
          button.getAttribute("aria-expanded") === "true";

        // Close other questions so only one answer is expanded at a time.
        faqButtons.forEach((otherButton) => {
          if (otherButton !== button) {
            setFaqState(otherButton, false);
          }
        });

        setFaqState(button, !isCurrentlyOpen);
      });
    });

    // Support direct links such as privacy-faq.html#faq-question-4.
    function openFaqFromHash() {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      const target = document.getElementById(targetId);

      if (!target) return;

      let button = target.matches(".pf-faq-question")
        ? target
        : target.querySelector(".pf-faq-question");

      if (!button) {
        const answer = target.closest(".pf-faq-answer");

        if (answer) {
          button = faqList.querySelector(
            `[aria-controls="${answer.id}"]`
          );
        }
      }

      if (button && faqList.contains(button)) {
        faqButtons.forEach((otherButton) => {
          setFaqState(otherButton, otherButton === button);
        });
      }
    }

    window.addEventListener("hashchange", openFaqFromHash);
    openFaqFromHash();
  }
});
