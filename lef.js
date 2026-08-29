// ---------------------------------------------------------
// EmailJS
// ---------------------------------------------------------
if (window.emailjs) {
  emailjs.init("i1fCi2XAXMg2g9-uK");
}

// ---------------------------------------------------------
// Menu mobile (explorateur de fichiers)
// ---------------------------------------------------------
const menuIcon = document.getElementById("menu-icon");
const sidebar = document.getElementById("sidebar");

if (menuIcon && sidebar) {
  menuIcon.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuIcon.setAttribute("aria-expanded", String(isOpen));
  });

  sidebar.querySelectorAll(".file-link").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      menuIcon.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------------------------------------------------------
// Surligne le fichier actif dans la sidebar selon la section visible
// ---------------------------------------------------------
const fileLinks = document.querySelectorAll(".file-link");
const panes = document.querySelectorAll(".pane");

if (fileLinks.length && panes.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        fileLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.target === id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  panes.forEach((pane) => observer.observe(pane));
}

// ---------------------------------------------------------
// Effet de frappe pour le rôle dans le hero
// ---------------------------------------------------------
const typedEl = document.getElementById("typed");
const roles = [
  "Développeur Frontend",
  "Intégratreur HTML / CSS / JS",
  "Design d'interfaces web",
];

if (typedEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1500);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 60);
  };

  tick();
} else if (typedEl) {
  typedEl.textContent = roles[0];
}

// ---------------------------------------------------------
// Formulaire de contact
// ---------------------------------------------------------
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!window.emailjs) {
      formStatus.textContent = "Service d'envoi indisponible pour le moment.";
      formStatus.className = "form-status err";
      return;
    }

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    formStatus.textContent = "Envoi en cours…";
    formStatus.className = "form-status";

    emailjs.sendForm("service_6zko1u6", "template_wnuqjjq", "#contact-form").then(
      () => {
        formStatus.textContent = "Message envoyé ! Je vous réponds rapidement.";
        formStatus.className = "form-status ok";
        form.reset();
        submitBtn.disabled = false;
      },
      (error) => {
        formStatus.textContent = "Une erreur est survenue, réessayez dans un instant.";
        formStatus.className = "form-status err";
        submitBtn.disabled = false;
        console.error("EmailJS error:", error);
      }
    );
  });
}
