
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const currentYear = document.querySelector("#current-year");

  // Automatically update the footer copyright year.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
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

    function closeMenu(returnFocus = false) {
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

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("click", (event) => {
      if (!menuIsOpen()) return;

      if (
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

  // Gallery category filters
  const filterButtons = document.querySelectorAll(".media-filter");
  const galleryItems = document.querySelectorAll(".media-gallery-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        const isSelected = filterButton === button;

        filterButton.classList.toggle("is-selected", isSelected);
        filterButton.setAttribute(
          "aria-pressed",
          String(isSelected)
        );
      });

      galleryItems.forEach((item) => {
        const itemCategory = item.dataset.category;
        const shouldShow =
          selectedCategory === "all" ||
          itemCategory === selectedCategory;

        item.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // Accessible image lightbox
  const lightbox = document.querySelector("#media-lightbox");
  const lightboxImage = document.querySelector(".media-lightbox-image");
  const lightboxCaption = document.querySelector(".media-lightbox-caption");
  const lightboxClose = document.querySelector(".media-lightbox-close");
  const imageButtons = document.querySelectorAll("[data-lightbox]");

  if (
    lightbox &&
    lightboxImage &&
    lightboxCaption &&
    lightboxClose &&
    typeof lightbox.showModal === "function"
  ) {
    let previousTrigger = null;

    function openLightbox(button) {
      const imageUrl = button.dataset.image;
      const imageAlt = button.dataset.alt || "";

      if (!imageUrl) return;

      previousTrigger = button;
      lightboxImage.src = imageUrl;
      lightboxImage.alt = imageAlt;
      lightboxCaption.textContent = imageAlt;

      if (!lightbox.open) {
        lightbox.showModal();
      }

      lightboxClose.focus();
    }

    function closeLightbox() {
      if (lightbox.open) {
        lightbox.close();
      }
    }

    imageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openLightbox(button);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    // Clicking the backdrop closes the viewer.
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    // Restore keyboard focus when the dialog closes.
    lightbox.addEventListener("close", () => {
      lightboxImage.removeAttribute("src");
      lightboxImage.alt = "";
      lightboxCaption.textContent = "";

      if (previousTrigger && document.contains(previousTrigger)) {
        previousTrigger.focus();
      }

      previousTrigger = null;
    });
  } else {
    // If native dialog support is unavailable, image buttons still work
    // as normal links to the full-sized image.
    imageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const imageUrl = button.dataset.image;

        if (imageUrl) {
          window.open(imageUrl, "_blank", "noopener,noreferrer");
        }
      });
    });
  }
});
