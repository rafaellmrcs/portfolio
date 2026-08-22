// Mobile nav
const burger = document.querySelector(".nav__burger");
const mobile = document.querySelector(".nav__mobile");

if (burger && mobile) {
  burger.addEventListener("click", () => {
    mobile.classList.toggle("is-open");
    mobile.setAttribute("aria-hidden", mobile.classList.contains("is-open") ? "false" : "true");
  });

  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobile.classList.remove("is-open");
      mobile.setAttribute("aria-hidden", "true");
    });
  });
}

// Scroll reveal
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-in");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Tech stack accordion
const stackPanels = document.querySelectorAll(".stack-panel");

stackPanels.forEach((panel) => {
  panel.addEventListener("toggle", () => {
    if (!panel.open) return;

    stackPanels.forEach((otherPanel) => {
      if (otherPanel !== panel) {
        otherPanel.open = false;
      }
    });
  });
});

// Selected work filters
const projectFilters = document.querySelectorAll(".project-filter");
const projectsGrid = document.querySelector(".projects-grid");
const projectCards = document.querySelectorAll(".project-card");
const projectsEmpty = document.querySelector(".projects-empty");

function filterProjects(filter) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const categories = card.dataset.categories?.split(" ") || [];
    const shouldShow = filter === "all" || categories.includes(filter);

    card.classList.toggle("is-hidden", !shouldShow);
    if (shouldShow) visibleCount += 1;
  });

  if (projectsGrid) {
    projectsGrid.classList.toggle("is-filtered", filter !== "all");
  }

  if (projectsEmpty) {
    projectsEmpty.hidden = visibleCount > 0;
  }
}

projectFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";

    projectFilters.forEach((otherButton) => {
      const isActive = otherButton === button;
      otherButton.classList.toggle("is-active", isActive);
      otherButton.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    filterProjects(filter);
  });
});

// Featured work carousel
const featuredCarousel = document.querySelector(".featured-work");
const featuredSlides = document.querySelectorAll("[data-carousel-slide]");
const featuredDots = document.querySelectorAll("[data-carousel-dot]");
const featuredPrev = document.querySelector("[data-carousel-prev]");
const featuredNext = document.querySelector("[data-carousel-next]");
let activeFeaturedSlide = 0;
let featuredTimer = null;

function setFeaturedSlide(index) {
  if (!featuredSlides.length) return;

  activeFeaturedSlide = (index + featuredSlides.length) % featuredSlides.length;

  featuredSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeFeaturedSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", isActive ? "false" : "true");
  });

  featuredDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeFeaturedSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function stopFeaturedCarousel() {
  if (!featuredTimer) return;

  window.clearInterval(featuredTimer);
  featuredTimer = null;
}

function startFeaturedCarousel() {
  if (prefersReducedMotion || featuredSlides.length < 2) return;

  stopFeaturedCarousel();
  featuredTimer = window.setInterval(() => {
    setFeaturedSlide(activeFeaturedSlide + 1);
  }, 5600);
}

if (featuredSlides.length) {
  setFeaturedSlide(0);

  featuredPrev?.addEventListener("click", () => {
    setFeaturedSlide(activeFeaturedSlide - 1);
    startFeaturedCarousel();
  });

  featuredNext?.addEventListener("click", () => {
    setFeaturedSlide(activeFeaturedSlide + 1);
    startFeaturedCarousel();
  });

  featuredDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setFeaturedSlide(Number(dot.dataset.carouselDot) || 0);
      startFeaturedCarousel();
    });
  });

  if (featuredCarousel) {
    featuredCarousel.addEventListener("pointerenter", stopFeaturedCarousel);
    featuredCarousel.addEventListener("pointerleave", startFeaturedCarousel);
    featuredCarousel.addEventListener("focusin", stopFeaturedCarousel);
    featuredCarousel.addEventListener("focusout", startFeaturedCarousel);
  }

  startFeaturedCarousel();
}

// Subtle premium tilt for visual cards
const canUsePointerMotion = !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches;

if (canUsePointerMotion) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

// Scroll to top button
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }, { passive: true });

  // Scroll to top on click
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

const projectTriggers = document.querySelectorAll(".project-trigger");
const projectModals = document.querySelectorAll(".project-modal");
let activeModal = null;
let lastTrigger = null;

function closeProjectModal() {
  if (!activeModal) return;

  activeModal.classList.remove("is-open");
  activeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (lastTrigger) {
    lastTrigger.focus();
  }

  activeModal = null;
}

function openProjectModal(modal, trigger) {
  if (!modal) return;

  if (activeModal && activeModal !== modal) {
    closeProjectModal();
  }

  activeModal = modal;
  lastTrigger = trigger;
  activeModal.classList.add("is-open");
  activeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = activeModal.querySelector(".project-modal__close");
  if (closeButton) {
    closeButton.focus();
  }
}

projectTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const targetId = trigger.dataset.modalTarget;
    const modal = document.getElementById(targetId);
    openProjectModal(modal, trigger);
  });
});

projectModals.forEach((modal) => {
  modal.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", () => closeProjectModal());
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

if (form && note) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    note.textContent = "Sending...";

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      service: form.service.value,
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send");

      note.textContent = "Sent! I’ll reply soon.";
      form.reset();
    } catch (err) {
      note.textContent = err.message || "Something went wrong.";
    }
  });
}
