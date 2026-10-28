
document.addEventListener("DOMContentLoaded", () => {
  // Update the copyright year.
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile navigation.
  const menuToggle = document.getElementById("menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (menuToggle && navigation) {
    const closeMenu = () => {
      navigation.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");

      document.body.classList.toggle("menu-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  // Contact form elements.
  const form = document.getElementById("BBlood-contact-form");

  if (!form) {
    return;
  }

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const topicInput = document.getElementById("contact-topic");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");
  const consentInput = document.getElementById("contact-consent");

  const characterCount = document.getElementById("character-count");
  const statusBox = document.getElementById("contact-form-status");

  const errorElements = {
    name: document.getElementById("name-error"),
    email: document.getElementById("email-error"),
    topic: document.getElementById("topic-error"),
    subject: document.getElementById("subject-error"),
    message: document.getElementById("message-error"),
    consent: document.getElementById("consent-error")
  };

  // Show a validation error for a field.
  const setError = (field, message) => {
    const errorElement = errorElements[field];

    if (errorElement) {
      errorElement.textContent = message;
    }

    const input = {
      name: nameInput,
      email: emailInput,
      topic: topicInput,
      subject: subjectInput,
      message: messageInput,
      consent: consentInput
    }[field];

    if (input) {
      input.classList.toggle("input-invalid", Boolean(message));

      if (input.type === "checkbox") {
        input.setAttribute("aria-invalid", String(Boolean(message)));
      } else {
        input.setAttribute("aria-invalid", String(Boolean(message)));
      }
    }
  };

  const clearErrors = () => {
    Object.keys(errorElements).forEach((field) => {
      setError(field, "");
    });
  };

  const showStatus = (message, type) => {
    statusBox.textContent = message;
    statusBox.className = `contact-form-status status-${type}`;
    statusBox.hidden = false;
  };

  const clearStatus = () => {
    statusBox.textContent = "";
    statusBox.className = "contact-form-status";
    statusBox.hidden = true;
  };

  // Keep the message character counter updated.
  const updateCharacterCount = () => {
    if (characterCount && messageInput) {
      characterCount.textContent =
        `${messageInput.value.length} / ${messageInput.maxLength}`;
    }
  };

  messageInput.addEventListener("input", updateCharacterCount);
  updateCharacterCount();

  // Allow category cards to preselect the corresponding topic.
  document.querySelectorAll("[data-contact-topic]").forEach((link) => {
    link.addEventListener("click", () => {
      const selectedTopic = link.dataset.contactTopic;

      const matchingOption = Array.from(topicInput.options).find(
        (option) => option.value === selectedTopic
      );

      if (matchingOption) {
        topicInput.value = selectedTopic;
      }
    });
  });

  // Clear an individual field's error as the user edits it.
  [
    ["name", nameInput],
    ["email", emailInput],
    ["topic", topicInput],
    ["subject", subjectInput],
    ["message", messageInput]
  ].forEach(([field, input]) => {
    input.addEventListener("input", () => {
      setError(field, "");
      clearStatus();
    });

    input.addEventListener("change", () => {
      setError(field, "");
      clearStatus();
    });
  });

  consentInput.addEventListener("change", () => {
    setError("consent", "");
    clearStatus();
  });

  // Validate the form in the browser.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    clearErrors();
    clearStatus();

    let isValid = true;
    let firstInvalidField = null;

    const markInvalid = (field, input, message) => {
      setError(field, message);
      isValid = false;

      if (!firstInvalidField) {
        firstInvalidField = input;
      }
    };

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const topic = topicInput.value;
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      markInvalid("name", nameInput, "Please enter your name.");
    } else if (name.length < 2) {
      markInvalid("name", nameInput, "Please enter at least 2 characters.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      markInvalid("email", emailInput, "Please enter your email address.");
    } else if (
      email.length > 254 ||
      !emailPattern.test(email)
    ) {
      markInvalid("email", emailInput, "Please enter a valid email address.");
    }

    if (!topic) {
      markInvalid("topic", topicInput, "Please select an enquiry type.");
    }

    if (!subject) {
      markInvalid("subject", subjectInput, "Please enter a subject.");
    } else if (subject.length > 150) {
      markInvalid("subject", subjectInput, "The subject is too long.");
    }

    if (!message) {
      markInvalid("message", messageInput, "Please enter your message.");
    } else if (message.length < 10) {
      markInvalid(
        "message",
        messageInput,
        "Please enter at least 10 characters."
      );
    } else if (message.length > 3000) {
      markInvalid(
        "message",
        messageInput,
        "Your message must be 3000 characters or fewer."
      );
    }

    if (!consentInput.checked) {
      markInvalid(
        "consent",
        consentInput,
        "Please confirm that you have read the Privacy Policy."
      );
    }

    if (!isValid) {
      showStatus(
        "Please review the highlighted fields and correct the errors.",
        "error"
      );

      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return;
    }

    showStatus(
      "Your form passed browser validation. No message has been sent or stored because a backend or form service has not been connected yet.",
      "success"
    );
  });
});
