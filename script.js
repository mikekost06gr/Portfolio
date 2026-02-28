/* ==============================================
   Portfolio — Script
   ============================================== */

(function () {
  "use strict";

  // ——————————————————————————————————————
  // CURSOR GLOW — follows mouse on desktop
  // ——————————————————————————————————————
  const cursorGlow = document.getElementById("cursorGlow");

  if (window.matchMedia("(hover: hover)").matches && cursorGlow) {
    document.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = e.clientX + "px";
      cursorGlow.style.top = e.clientY + "px";
    });
  }

  // ——————————————————————————————————————
  // NAVBAR — hide on scroll down, show on scroll up
  // ——————————————————————————————————————
  const nav = document.getElementById("nav");
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNav() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      nav.classList.add("nav--hidden");
    } else {
      nav.classList.remove("nav--hidden");
    }

    if (currentScrollY > 20) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });

  // ——————————————————————————————————————
  // MOBILE MENU TOGGLE
  // ——————————————————————————————————————
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("open");
    document.body.style.overflow = navMenu.classList.contains("open")
      ? "hidden"
      : "";
  });

  // Close menu on link click
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // ——————————————————————————————————————
  // SMOOTH SCROLL for nav links
  // ——————————————————————————————————————
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ——————————————————————————————————————
  // SCROLL ANIMATIONS — IntersectionObserver
  // ——————————————————————————————————————

  // Add classes to elements we want to animate
  function setupAnimations() {
    // Hero elements fade in immediately (with stagger via CSS transition-delay)
    const heroContent = document.querySelector(".home_content");
    const heroVisual = document.querySelector(".home_visual");
    if (heroContent) heroContent.classList.add("fade-up");
    if (heroVisual) heroVisual.classList.add("fade-up");

    // Section titles & content blocks
    document
      .querySelectorAll(".section_title, .section__title")
      .forEach((el) => el.classList.add("fade-up"));
    document
      .querySelectorAll(".about_text")
      .forEach((el) => el.classList.add("fade-up"));
    document
      .querySelectorAll(".about_image")
      .forEach((el) => el.classList.add("fade-up"));
    document
      .querySelectorAll(".contact__content")
      .forEach((el) => el.classList.add("fade-up"));

    // Grids with stagger
    document
      .querySelectorAll(".skills_grid")
      .forEach((el) => el.classList.add("stagger"));
    document
      .querySelectorAll(".projects_grid")
      .forEach((el) => el.classList.add("stagger"));
  }

  setupAnimations();

  // Observer
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-up, .stagger").forEach((el) => {
    observer.observe(el);
  });

  // ——————————————————————————————————————
  // CONTACT FORM — submit via Formspree
  // ——————————————————————————————————————
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitText = submitBtn.querySelector(".contact-form__submit-text");
      const submitLoading = submitBtn.querySelector(
        ".contact-form__submit-loading",
      );

      // Show loading state
      submitBtn.disabled = true;
      submitText.hidden = true;
      submitLoading.hidden = false;
      formStatus.textContent = "";
      formStatus.className = "contact-form__status";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          formStatus.textContent =
            "Message sent successfully! I'll get back to you soon.";
          formStatus.classList.add("contact-form__status--success");
          contactForm.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        formStatus.textContent =
          "Oops! Something went wrong. Please try again or email me directly.";
        formStatus.classList.add("contact-form__status--error");
      } finally {
        submitBtn.disabled = false;
        submitText.hidden = false;
        submitLoading.hidden = true;
      }
    });
  }

  // ——————————————————————————————————————
  // ACTIVE NAV LINK highlighting
  // ——————————————————————————————————————
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll("[data-nav]");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navItems.forEach((item) => {
            item.style.color = "";
            if (item.getAttribute("href") === `#${id}`) {
              item.style.color = "var(--accent)";
            }
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ——————————————————————————————————————
  // LANGUAGE TOGGLE — i18n with JSON files
  // ——————————————————————————————————————
  const langToggle = document.getElementById("langToggle");
  const langFlag = document.getElementById("langFlag");

  // Default language is Greek
  let currentLang = localStorage.getItem("lang") || "gr";

  // Cache loaded translations
  const translations = {};

  async function loadTranslations(lang) {
    if (translations[lang]) return translations[lang];
    try {
      const res = await fetch(`locales/${lang}.json`);
      const data = await res.json();
      translations[lang] = data;
      return data;
    } catch (err) {
      console.error(`Failed to load ${lang}.json`, err);
      return null;
    }
  }

  function applyTranslations(data) {
    if (!data) return;

    // Text content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (data[key] !== undefined) {
        el.textContent = data[key];
      }
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (data[key] !== undefined) {
        el.placeholder = data[key];
      }
    });
  }

  function updateFlagIcon(lang) {
    // Show the OTHER language's flag (the one you'd switch TO)
    if (lang === "en") {
      langFlag.src = "images/gr.png";
      langFlag.alt = "GR";
      langToggle.title = "Ελληνικά";
    } else {
      langFlag.src = "images/en.svg";
      langFlag.alt = "EN";
      langToggle.title = "English";
    }
  }

  async function setLanguage(lang) {
    const data = await loadTranslations(lang);
    applyTranslations(data);
    updateFlagIcon(lang);
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "gr" ? "el" : "en";
  }

  // Apply saved language on load
  setLanguage(currentLang);

  // Toggle on click
  langToggle.addEventListener("click", () => {
    const newLang = currentLang === "en" ? "gr" : "en";
    setLanguage(newLang);

    // Hide notification if user switches language
    const notif = document.getElementById("langNotification");
    if (notif) dismissNotification(notif);
  });

  // ——————————————————————————————————————
  // LANGUAGE NOTIFICATION — show once per session
  // ——————————————————————————————————————
  function dismissNotification(notif) {
    if (!notif || notif.classList.contains("hide")) return;
    notif.classList.add("hide");
    setTimeout(() => notif.remove(), 300);
  }

  const langNotif = document.getElementById("langNotification");
  const langNotifClose = document.getElementById("langNotifClose");

  if (langNotif && !sessionStorage.getItem("langNotifShown")) {
    sessionStorage.setItem("langNotifShown", "1");

    // Auto-dismiss after 8 seconds (matches CSS bar animation)
    const notifTimer = setTimeout(() => dismissNotification(langNotif), 8000);

    // Manual close
    langNotifClose.addEventListener("click", () => {
      clearTimeout(notifTimer);
      dismissNotification(langNotif);
    });
  } else if (langNotif) {
    langNotif.remove();
  }
})();