/**
 * NATHAN TAKA TSAGA — PORTFOLIO
 * script.js — Vanilla JavaScript
 *
 * Features:
 *  1. Loading screen
 *  2. Navbar scroll behaviour + active link highlighting
 *  3. Mobile hamburger menu
 *  4. Typed text animation
 *  5. Scroll-reveal animations (IntersectionObserver)
 *  6. Animated skill bars (triggered on scroll-into-view)
 *  7. Back-to-top button
 *  8. Contact form validation & feedback
 *  9. Footer year auto-update
 */

/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  // Give the progress bar time to finish, then hide loader
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = ''; // restore scroll
  }, 1900);
});

// Prevent scrolling while loader is visible
document.body.style.overflow = 'hidden';


/* ============================================================
   2. NAVBAR — scroll style + active section highlighting
   ============================================================ */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Add .scrolled class to navbar when page is scrolled
window.addEventListener('scroll', handleScroll, { passive: true });

function handleScroll() {
  // Scrolled state for navbar background
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link highlighting
  highlightActiveSection();

  // Back-to-top visibility
  toggleBackToTop();
}

function highlightActiveSection() {
  const scrollY = window.scrollY + 120; // offset for navbar height

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}


/* ============================================================
   3. MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger   = document.getElementById('hamburger');
const navLinksEl  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a nav link is clicked
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navLinksEl.classList.contains('open')) {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});


/* ============================================================
   4. TYPED TEXT ANIMATION
   ============================================================ */
const phrases = [
  'Software Engineering Student',
  'Web Developer',
  'Problem Solver',
  'Co-op Seeker',
  'Tech Enthusiast',
];

const typedEl   = document.getElementById('typed-text');
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    // Remove one character
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100; // faster on delete

  if (!isDeleting && charIndex === current.length) {
    // Pause at full word before deleting
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(type, delay);
}

// Start typing after the hero animations finish
setTimeout(type, 1500);


/* ============================================================
   5. SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once revealed (no re-trigger)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,   // 12% of element visible triggers reveal
    rootMargin: '0px 0px -50px 0px', // slight bottom offset
  }
);

// Observe all reveal elements
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


/* ============================================================
   6. ANIMATED SKILL BARS
   ============================================================ */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find all skill fills inside the visible skills section
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-width') + '%';
          // Small delay to ensure CSS transition fires properly
          requestAnimationFrame(() => {
            fill.style.width = targetWidth;
          });
        });
        // Only animate once
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
  skillObserver.observe(skillsSection);
}


/* ============================================================
   7. BACK TO TOP BUTTON
   ============================================================ */
const backToTopBtn = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   8. CONTACT FORM — validation & simulated submission
   ============================================================ */
const contactForm    = document.getElementById('contact-form');
const formFeedback   = document.getElementById('form-feedback');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather values
    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    // Simple validation
    if (!name || !email || !subject || !message) {
      showFeedback('// Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showFeedback('// Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending (replace with real API call when ready)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    await simulateDelay(1600);

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    contactForm.reset();
    showFeedback('// Message sent! I\'ll get back to you soon 🚀', 'success');
  });
}

/**
 * Display a feedback message below the form.
 * @param {string} msg - The message to show.
 * @param {'success'|'error'} type - Visual style.
 */
function showFeedback(msg, type) {
  formFeedback.textContent = msg;
  formFeedback.className = `form-feedback ${type === 'error' ? 'error' : ''}`;
  // Auto-clear after 5 seconds
  setTimeout(() => { formFeedback.textContent = ''; }, 5000);
}

/**
 * Validate email format with a basic regex.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Returns a Promise that resolves after `ms` milliseconds.
 */
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ============================================================
   9. FOOTER — auto-update year
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ============================================================
   10. SMOOTH SCROLL for anchor links (fallback for older browsers)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});


/* ============================================================
   11. TECH BUBBLE — stagger-in animation on hover area enter
   ============================================================ */
const techCloud = document.querySelector('.tech-cloud');
if (techCloud) {
  const bubbles = techCloud.querySelectorAll('.tech-bubble');

  const cloudObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        bubbles.forEach((bubble, i) => {
          bubble.style.animationDelay = `${i * 0.07}s`;
          bubble.classList.add('bubble-in');
        });
        cloudObserver.unobserve(techCloud);
      }
    },
    { threshold: 0.4 }
  );
  cloudObserver.observe(techCloud);
}