
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const elements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08
    });

    elements.forEach(element => observer.observe(element));
  } else {
    elements.forEach(element => element.classList.add("visible"));
  }
});

// ===================================
// COPY EMAIL TO CLIPBOARD
// ===================================

document.addEventListener("DOMContentLoaded", () => {

  const emailButton = document.querySelector(".email-copy");
  const feedback = document.getElementById("copy-feedback");

  if (!emailButton) return;

  emailButton.addEventListener("click", async () => {

    const email = emailButton.dataset.email;

    try {

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = email;
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        const copied = document.execCommand("copy");
        temporaryInput.remove();

        if (!copied) {
          throw new Error("Copy command failed");
        }
      }

      if (feedback) {
        feedback.textContent = "Email copied to clipboard!";
      }

      const action = emailButton.querySelector(".contact-action");

      if (action) {
        action.textContent = "Copied ✓";

        setTimeout(() => {
          action.textContent = "Copy ↗";
        }, 2500);
      }

    } catch (error) {

      if (feedback) {
        feedback.textContent =
          "Unable to copy automatically. Please select the email address.";
      }

    }

  });

});


/* =========================================
   VLADAKO — BEFORE / AFTER COMPARISON
========================================= */

(function () {
  "use strict";

  function initializeComparisons() {

    const comparisons = document.querySelectorAll(
      "[data-comparison]"
    );

    comparisons.forEach((slider) => {

      let isDragging = false;

      function setPosition(percent) {

        const value = Math.max(
          0,
          Math.min(100, percent)
        );

        slider.style.setProperty(
          "--split",
          value + "%"
        );

        slider.setAttribute(
          "aria-valuenow",
          Math.round(value)
        );

        slider.setAttribute(
          "aria-valuetext",
          Math.round(value) +
          " percent of the clay render visible"
        );
      }

      function updateFromPointer(event) {

        const rect = slider.getBoundingClientRect();

        if (!rect.width) return;

        const position =
          ((event.clientX - rect.left) / rect.width) * 100;

        setPosition(position);
      }

      slider.addEventListener(
        "pointerdown",
        (event) => {

          if (event.button !== 0) return;

          isDragging = true;

          slider.setPointerCapture(event.pointerId);

          updateFromPointer(event);
        }
      );

      slider.addEventListener(
        "pointermove",
        (event) => {

          if (!isDragging) return;

          updateFromPointer(event);
        }
      );

      function stopDragging() {
        isDragging = false;
      }

      slider.addEventListener(
        "pointerup",
        stopDragging
      );

      slider.addEventListener(
        "pointercancel",
        stopDragging
      );

      slider.addEventListener(
        "lostpointercapture",
        stopDragging
      );

      slider.addEventListener(
        "keydown",
        (event) => {

          const current =
            Number(slider.getAttribute("aria-valuenow")) || 0;

          let next = current;

          switch (event.key) {

            case "ArrowLeft":
              next = current - 5;
              break;

            case "ArrowRight":
              next = current + 5;
              break;

            case "Home":
              next = 0;
              break;

            case "End":
              next = 100;
              break;

            default:
              return;
          }

          event.preventDefault();

          setPosition(next);
        }
      );

      setPosition(50);

    });
  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initializeComparisons
    );

  } else {

    initializeComparisons();

  }

})();


/* =========================================
   VLADAKO — FAQ ACCORDION
   Only one answer open at a time
========================================= */

(function () {
  "use strict";

  function initializeFAQ() {

    const items = document.querySelectorAll(
      ".faq-item"
    );

    items.forEach((item) => {

      item.addEventListener("toggle", () => {

        if (!item.open) return;

        items.forEach((otherItem) => {

          if (otherItem !== item) {
            otherItem.open = false;
          }

        });

      });

    });

  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initializeFAQ
    );

  } else {

    initializeFAQ();

  }

})();

/* =====================================
   VLADAKO — PROJECT HERO GALLERIES
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hero-gallery").forEach((gallery) => {
    const images = Array.from(
      gallery.querySelectorAll(".hero-gallery-slide")
    );

    const previous = gallery.querySelector(".gallery-prev");
    const next = gallery.querySelector(".gallery-next");
    const counter = gallery.querySelector(".gallery-counter");

    if (!images.length) return;

    let current = 0;

    function showImage(index) {
      current = (index + images.length) % images.length;

      images.forEach((image, i) => {
        const active = i === current;
        image.classList.toggle("is-active", active);
        image.hidden = !active;
        image.setAttribute("aria-hidden", String(!active));
      });

      if (counter) {
        counter.textContent =
          String(current + 1).padStart(2, "0") +
          " / " +
          String(images.length).padStart(2, "0");
      }
    }

    if (previous) {
      previous.addEventListener("click", () => {
        showImage(current - 1);
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        showImage(current + 1);
      });
    }

    showImage(0);
  });
});
