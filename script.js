// Premium-feel JS: mobile nav, slider (dots + swipe), scroll reveal, fake contact submit

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

// Slider
const track = document.querySelector(".slider__track");
const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.querySelector(".dots");
const buttons = document.querySelectorAll(".icon-btn[data-dir]");

let index = 0;
let startX = 0;
let dragging = false;

function buildDots(){
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dotbtn" + (i === index ? " is-active" : "");
    b.setAttribute("aria-label", `Go to slide ${i+1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });
}

function updateDots(){
  if (!dotsWrap) return;
  const dots = dotsWrap.querySelectorAll(".dotbtn");
  dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
}

function goTo(i){
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = Number(btn.dataset.dir);
    goTo(index + dir);
  });
});

buildDots();

// Touch/Swipe support
if (track) {
  track.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) {
      goTo(index + (dx < 0 ? 1 : -1));
    }
  });

  track.addEventListener("pointercancel", () => dragging = false);
}

const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

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