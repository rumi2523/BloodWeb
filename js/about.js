
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const currentYear = document.querySelector("#current-year");

  // Update the copyright year automatically.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (!menuToggle || !navigation) {
    return;
  }

  const menuIsOpen = () =>
    menuToggle.getAttribute("aria-expanded") === "true";

  function openMenu() {
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    navigation.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  function closeMenu({ returnFocus = false } = {}) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");

    if (returnFocus) {
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

  // Close the menu after a navigation link is selected.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close the menu when the user clicks outside it.
  document.addEventListener("click", (event) => {
    if (!menuIsOpen()) return;

    const clickedInsideMenu = navigation.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  // Allow keyboard users to dismiss the menu.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuIsOpen()) {
      closeMenu({ returnFocus: true });
    }
  });

  // Reset the mobile menu when returning to desktop width.
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 761px)").matches) {
      closeMenu();
    }
  });
});
