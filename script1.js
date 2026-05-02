
// Mobile nav
const burger = document.querySelector(".nav__burger");
const mobile = document.querySelector(".nav__mobile");

function setMobileMenuOpen(isOpen) {
	if (!mobile) return;

	mobile.classList.toggle("is-open", isOpen);
	mobile.setAttribute("aria-hidden", isOpen ? "false" : "true");
	if (burger) burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

if (burger && mobile) {
	burger.setAttribute("aria-expanded", "false");

	burger.addEventListener("click", () => {
		const isOpen = mobile.classList.contains("is-open");
		setMobileMenuOpen(!isOpen);
	});

	mobile.querySelectorAll("a").forEach((a) => {
		a.addEventListener("click", () => setMobileMenuOpen(false));
	});
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
	if ("IntersectionObserver" in window) {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) e.target.classList.add("is-in");
				});
			},
			{ threshold: 0.12 }
		);
		revealEls.forEach((el) => io.observe(el));
	} else {
		revealEls.forEach((el) => el.classList.add("is-in"));
	}
}

// Scroll to top button
const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
	const toggleScrollTop = () => {
		scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
	};

	window.addEventListener("scroll", toggleScrollTop, { passive: true });
	toggleScrollTop();

	scrollTopBtn.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
}

// Project modals
const projectTriggers = document.querySelectorAll(".project-trigger");
const projectModals = document.querySelectorAll(".project-modal");
let activeModal = null;
let lastTrigger = null;

function closeProjectModal() {
	if (!activeModal) return;

	activeModal.classList.remove("is-open");
	activeModal.setAttribute("aria-hidden", "true");
	document.body.classList.remove("modal-open");

	if (lastTrigger && typeof lastTrigger.focus === "function") {
		lastTrigger.focus();
	}

	activeModal = null;
	lastTrigger = null;
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
	if (closeButton) closeButton.focus();
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
		setMobileMenuOpen(false);
	}
});

// Contact form
const form = document.getElementById("contactForm");

function ensureFormNote(formEl) {
	let noteEl = document.getElementById("formNote");
	if (noteEl) return noteEl;

	noteEl = document.createElement("p");
	noteEl.className = "form__note";
	noteEl.id = "formNote";
	noteEl.setAttribute("role", "status");
	noteEl.setAttribute("aria-live", "polite");
	formEl.appendChild(noteEl);
	return noteEl;
}

if (form) {
	const note = ensureFormNote(form);

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		note.textContent = "Sending...";

		const payload = {
			name: form.name?.value?.trim() || "",
			email: form.email?.value?.trim() || "",
			service: form.service?.value || "",
			message: form.message?.value?.trim() || "",
		};

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data?.error || "Failed to send");

			note.textContent = "Sent! I’ll reply soon.";
			form.reset();
		} catch (err) {
			note.textContent = err?.message || "Something went wrong.";
		}
	});
}

