const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");
const introOverlay = document.querySelector(".intro-overlay");
const particleCanvas = document.querySelector(".particle-canvas");
const particleCtx = particleCanvas ? particleCanvas.getContext("2d") : null;

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

if (introOverlay) {
  setTimeout(() => {
    introOverlay.style.display = "none";
  }, 1400);
}

if (particleCanvas && particleCtx) {
  const particleCount = 70;
  const particles = [];
  const maxVelocity = 0.35;

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        radius: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * maxVelocity,
        vy: (Math.random() - 0.5) * maxVelocity,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }
  }

  function updateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particleCtx.fillStyle = "rgba(255, 88, 160, 0.85)";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;

      particleCtx.globalAlpha = p.alpha;
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      particleCtx.fill();
    });

    particleCtx.globalAlpha = 1;
    requestAnimationFrame(updateParticles);
  }

  resizeCanvas();
  createParticles();
  updateParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

const sections = document.querySelectorAll("main section");
const revealSections = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.25 }
);

sections.forEach((section) => observer.observe(section));
revealSections.forEach((section) => observer.observe(section));

const scrambleTargets = document.querySelectorAll(".scramble-text");
const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const scrambleIntervals = new Map();
const scrambleTimeouts = new Map();

function startScramble(el, durationMs = 1000) {
  const original = el.dataset.original || el.textContent;
  el.dataset.original = original;
  let frame = 0;

  const intervalId = setInterval(() => {
    const scrambled = original
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        const threshold = frame - index;
        if (threshold > 6) return char;
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      })
      .join("");

    el.textContent = scrambled;
    frame += 1;
  }, 25);

  scrambleIntervals.set(el, intervalId);

  const timeoutId = setTimeout(() => {
    stopScramble(el);
  }, durationMs);

  scrambleTimeouts.set(el, timeoutId);
}

function stopScramble(el) {
  const intervalId = scrambleIntervals.get(el);
  if (intervalId) {
    clearInterval(intervalId);
    scrambleIntervals.delete(el);
  }
  const timeoutId = scrambleTimeouts.get(el);
  if (timeoutId) {
    clearTimeout(timeoutId);
    scrambleTimeouts.delete(el);
  }
  if (el.dataset.original) {
    el.textContent = el.dataset.original;
  }
}

scrambleTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => startScramble(el, 400));
  el.addEventListener("mouseleave", () => stopScramble(el));
});
