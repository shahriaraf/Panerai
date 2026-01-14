// --- 1. CURSOR ---
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
document.querySelectorAll(".hover-target").forEach((t) => {
  t.addEventListener("mouseenter", () => cursor.classList.add("grow"));
  t.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
});

// --- 2. NOTIFICATIONS (TOAST) ---
function notify(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// --- 3. AUTO-PLAY SLIDER ---
let sliderIndex = 0;
let isAnimating = false;
let autoPlayTimer;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function moveSlider(direction) {
  if (isAnimating) return;
  isAnimating = true;

  const currentSlide = slides[sliderIndex];
  let nextIndex =
    direction === "next"
      ? (sliderIndex + 1) % totalSlides
      : (sliderIndex - 1 + totalSlides) % totalSlides;
  const nextSlide = slides[nextIndex];

  // Setup
  nextSlide.style.transition = "none";
  nextSlide.classList.remove("prev-pos", "active", "next-pos");
  nextSlide.classList.add(direction === "next" ? "next-pos" : "prev-pos");
  void nextSlide.offsetWidth; // Force Reflow

  // Animate
  nextSlide.style.transition =
    "transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1)";
  currentSlide.classList.replace(
    "active",
    direction === "next" ? "prev-pos" : "next-pos"
  );
  nextSlide.classList.replace(
    direction === "next" ? "next-pos" : "prev-pos",
    "active"
  );

  sliderIndex = nextIndex;
  setTimeout(() => {
    isAnimating = false;
  }, 1200);
}

function startAutoPlay() {
  autoPlayTimer = setInterval(() => moveSlider("next"), 5000); // 5 Seconds
}

function manualMove(dir) {
  clearInterval(autoPlayTimer); // Stop auto when user clicks
  moveSlider(dir);
  startAutoPlay(); // Restart auto
}

startAutoPlay(); // Init

// --- 4. NAVIGATION ---
function navTo(id) {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.remove("active-section"));
  document.getElementById(id).classList.add("active-section");
  document
    .querySelectorAll(".nav-links a")
    .forEach((l) => l.classList.remove("active-link"));
  // Visual active state update handled by click context usually, simplified here:
  if (id === "home")
    document.querySelectorAll(".nav-links a")[0].classList.add("active-link");
}

// --- 5. ACCESSORIES CONFIGURATOR ---
function changeStrap(element, colorName, hueRotation) {
  // Visual Selection
  document
    .querySelectorAll(".strap-option")
    .forEach((el) => el.classList.remove("active-strap"));
  element.classList.add("active-strap");

  // Watch Effect
  const watchImg = document.getElementById("config-image");
  watchImg.style.filter = `drop-shadow(0 30px 40px black) hue-rotate(${hueRotation}deg)`;

  notify(`Selected ${colorName} Strap`);
}

// --- 6. VIDEO MODAL ---
const modal = document.getElementById("videoModal");
const player = document.getElementById("youtube-player");
function openModal() {
  modal.classList.add("open");
  player.src =
    "https://www.youtube.com/embed/h9YtN7g-jYk?autoplay=1&controls=0&rel=0";
  clearInterval(autoPlayTimer); // Pause slider
}
function closeModal() {
  modal.classList.remove("open");
  player.src = "";
  startAutoPlay(); // Resume slider
}
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

const mobileNav = document.getElementById("mobileNav");
const mobileBtn = document.querySelector(".mobile-menu-btn");

function toggleMobileNav() {
  mobileNav.classList.toggle("open");
  mobileBtn.classList.toggle("open");
}

function mobileNavTo(id) {
  toggleMobileNav();
  navTo(id);
}