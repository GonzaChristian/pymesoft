// ==========================================================================
// PYMESOFT — INTERACTION & ANIMATION SCRIPT
// ==========================================================================

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const dropdowns = document.querySelectorAll(".dropdown");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

// Theme Management (with smooth icon transition & localStorage)
function setTheme(theme) {
  const isDark = theme === "dark";
  body.classList.toggle("dark", isDark);
  if (themeIcon) {
    themeIcon.style.transform = "rotate(90deg) scale(0.6)";
    setTimeout(() => {
      themeIcon.textContent = isDark ? "☀" : "☾";
      themeIcon.style.transform = "rotate(0deg) scale(1)";
    }, 150);
  }
  if (themeText) themeText.textContent = isDark ? "Claro" : "Oscuro";
  localStorage.setItem("pymesoft-theme", theme);
}

const storedTheme = localStorage.getItem("pymesoft-theme");
const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(storedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  setTheme(body.classList.contains("dark") ? "light" : "dark");
});

// Mobile Navigation Toggle with Hamburger Animation
menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close Mobile Nav when clicking any link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1020) {
      navLinks?.classList.remove("open");
      menuToggle?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

// Mobile Dropdown Support
dropdowns.forEach(dropdown => {
  const toggleBtn = dropdown.querySelector(".nav-link");
  toggleBtn?.addEventListener("click", e => {
    if (window.innerWidth <= 1020) {
      e.preventDefault();
      dropdown.classList.toggle("open");
    }
  });
});

// Close Mobile Nav when clicking outside
document.addEventListener("click", e => {
  if (window.innerWidth <= 1020 && navLinks?.classList.contains("open")) {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }
});

// Scroll Reveal with Staggered Intersection Observer
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Number Counters Animation
document.querySelectorAll("[data-counter]").forEach(el => {
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = Number(el.dataset.counter || 0);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const duration = 1100;

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Quartic Out Easing for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      counterObs.disconnect();
    });
  }, { threshold: 0.5 });
  counterObs.observe(el);
});

// Ultra-Fluid 3D Card Tilt with Damped Physical Inertia
document.querySelectorAll(".tilt").forEach(card => {
  card.style.willChange = "transform";

  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease";
  });

  card.addEventListener("mousemove", e => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transition = "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease";
    card.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
    card.style.transform = "";
  });
});

// Interactive Contact Form Demonstration
contactForm?.addEventListener("submit", e => {
  e.preventDefault();
  const required = ["nombre", "correo", "solucion", "mensaje"];
  const missing = required.some(name => !contactForm.elements[name]?.value.trim());

  if (missing) {
    if (formMessage) {
      formMessage.textContent = "Por favor, completa los campos requeridos.";
      formMessage.style.color = "var(--danger)";
    }
    return;
  }

  // Email format validation
  const emailVal = contactForm.elements["correo"]?.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailVal)) {
    if (formMessage) {
      formMessage.textContent = "Ingresa un correo electrónico válido.";
      formMessage.style.color = "var(--danger)";
    }
    return;
  }

  if (formMessage) {
    formMessage.textContent = "✓ Solicitud registrada exitosamente. Pronto nos comunicaremos contigo.";
    formMessage.style.color = "var(--success)";
  }
  contactForm.reset();
});

// Dynamic Footer Copyright Year
document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});
