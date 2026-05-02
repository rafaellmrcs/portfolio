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
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-in");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

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
  });

  // Scroll to top on click
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
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