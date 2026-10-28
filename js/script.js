
// =========================================================
// BBlood — HOME PAGE JAVASCRIPT
// Handles mobile navigation, keyboard interaction, and year.
// No external libraries or dependencies.
// =========================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navigation = document.getElementById("primary-navigation");
  const currentYear = document.getElementById("current-year");

  // Automatically keep the copyright year current.
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  // Stop safely if the navigation elements are not present.
  if (!menuToggle || !navigation) {
    return;
  }

  /**
   * Open or close the mobile navigation.
   * The ARIA state remains synchronized with the visual state.
   */
  function setMenuOpen(isOpen) {
    navigation.classList.toggle("is-open", isOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );
  }

  // Toggle the menu with the menu button.
  menuToggle.addEventListener("click", () => {
    const isCurrentlyOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    setMenuOpen(!isCurrentlyOpen);
  });

  // Close the menu after selecting a navigation link.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  // Close the menu when the user clicks outside the header.
  document.addEventListener("click", (event) => {
    if (
      menuToggle.getAttribute("aria-expanded") === "true" &&
      !event.target.closest(".site-header")
    ) {
      setMenuOpen(false);
    }
  });

  // Escape closes the menu and returns focus to its toggle.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  // Reset the mobile menu when returning to desktop width.
  const desktopBreakpoint = window.matchMedia("(min-width: 801px)");

  function handleBreakpointChange(event) {
    if (event.matches) {
      setMenuOpen(false);
    }
  }

  if (typeof desktopBreakpoint.addEventListener === "function") {
    desktopBreakpoint.addEventListener(
      "change",
      handleBreakpointChange
    );
  } else {
    // Compatibility for older browsers.
    desktopBreakpoint.addListener(handleBreakpointChange);
  }
});
