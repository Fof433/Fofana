document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------
     Mobile menu
     ------------------------- */
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  navLinks.forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    mobileMenu.classList.remove('active');
  }));

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenu.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });

  /* -------------------------
     Intersection Observer - reveal (remplace scroll listener)
     ------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    // fallback
    reveals.forEach(el => el.classList.add('active'));
  }

  /* -------------------------
     Smooth anchors
     ------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
  });

  /* -------------------------
     Back to top / scroll down
     ------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => backToTopBtn.classList.toggle('show', window.scrollY > 300));
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  const scrollDownBtn = document.getElementById('scroll-down');
  if (scrollDownBtn) scrollDownBtn.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));

  /* -------------------------
     Lightbox (HTML ajouté dans index.html)
     ------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));
  let lbIndex = -1;

  function openLightbox(index) {
    if (!lightbox) return;
    lbIndex = index;
    const img = galleryImgs[lbIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = img.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    lightboxImg.src = '';
  }

  galleryImgs.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
  const lbClose = document.querySelector('.lightbox-close');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') openLightbox((lbIndex + 1) % galleryImgs.length);
    if (e.key === 'ArrowLeft') openLightbox((lbIndex - 1 + galleryImgs.length) % galleryImgs.length);
  });

  /* -------------------------
     Hero subtitle rotating (fade)
     ------------------------- */
  const specialties = ['Robes de mariée', 'Haute couture', 'Créations sur mesure'];
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    let si = 0;
    heroSubtitle.textContent = specialties[0];
    setInterval(() => {
      heroSubtitle.classList.add('fade-out');
      setTimeout(() => {
        si = (si + 1) % specialties.length;
        heroSubtitle.textContent = specialties[si];
        heroSubtitle.classList.remove('fade-out');
      }, 420);
    }, 3000);
  }

  // Typing effect for hero title (one-shot, accessible)
  (function heroTyping() {
    const titleWrap = document.querySelector('.animated-title');
    const typedEl = document.getElementById('typed-title');
    if (!titleWrap || !typedEl) return;
    const full = titleWrap.dataset.text || "L'ÉLÉGANCE SUR MESURE";
    const speed = 70; // ms per character (machine-like)
    const startDelay = 350; // ms before typing starts

    // Respect prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typedEl.textContent = full;
      return;
    }

    typedEl.textContent = '';
    let i = 0;
    const cursor = titleWrap.querySelector('.type-cursor');

    setTimeout(() => {
      const interval = setInterval(() => {
        typedEl.textContent += full.charAt(i);
        i++;
        if (i >= full.length) {
          clearInterval(interval);
          // keep the cursor blinking; optionally reduce its opacity after a moment
          setTimeout(() => { if (cursor) cursor.style.opacity = '0.9'; }, 300);
        }
      }, speed);
    }, startDelay);
  })();

  /* -------------------------
     Gallery filter (buttons injected in HTML)
     ------------------------- */
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  function hideItem(item) {
    item.classList.add('is-hidden');
    setTimeout(() => { item.style.display = 'none'; }, 360);
    item.setAttribute('aria-hidden', 'true');
  }
  function showItem(item) {
    item.style.display = '';
    requestAnimationFrame(() => item.classList.remove('is-hidden'));
    item.setAttribute('aria-hidden', 'false');
  }

  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    galleryItems.forEach(item => {
      const cat = item.dataset.category || 'uncategorized';
      if (filter === 'all' || filter === cat) showItem(item); else hideItem(item);
    });
  }));

  /* -------------------------
     Contact form — validation inline + confetti + mailto
     ------------------------- */
  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-feedback');

  if (contactForm) {
    function showFieldError(field, message) {
      field.classList.add('invalid');
      const existing = field.nextElementSibling;
      if (!existing || !existing.classList || !existing.classList.contains('field-error')) {
        const err = document.createElement('small');
        err.className = 'field-error';
        err.textContent = message;
        field.insertAdjacentElement('afterend', err);
      }
    }
    function clearFieldError(field) {
      field.classList.remove('invalid');
      const next = field.nextElementSibling;
      if (next && next.classList && next.classList.contains('field-error')) next.remove();
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const message = document.getElementById('contact-message');
      let valid = true;

      [name, email, message].forEach(f => clearFieldError(f));

      if (!name.value.trim()) { showFieldError(name, 'Veuillez renseigner votre nom.'); valid = false; }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRe.test(email.value.trim())) { showFieldError(email, 'Adresse e‑mail invalide.'); valid = false; }
      if (!message.value.trim()) { showFieldError(message, 'Le message ne peut pas être vide.'); valid = false; }

      if (!valid) { if (contactFeedback) { contactFeedback.textContent = 'Veuillez corriger les champs en rouge.'; contactFeedback.className = 'contact-feedback error'; } return; }

      // success UI + confetti
      spawnConfetti(18);
      showSuccessBadge();

      const owner = 'elianefatifofana@gmail.com';
      const subject = encodeURIComponent(`Message depuis le site — ${name.value.trim()}`);
      const body = encodeURIComponent(`Nom: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\nMessage:\n${message.value.trim()}`);

      setTimeout(() => {
        window.location.href = `mailto:${owner}?subject=${subject}&body=${body}`;
        contactForm.reset();
        if (contactFeedback) { contactFeedback.textContent = 'Prêt — votre client mail va s\'ouvrir.'; contactFeedback.className = 'contact-feedback success'; }
      }, 700);
    });

    function showSuccessBadge() {
      let badge = contactForm.querySelector('.success-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'success-badge show';
        badge.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Prêt à envoyer</span>';
        contactForm.querySelector('.btn-submit').insertAdjacentElement('afterend', badge);
        setTimeout(() => badge.classList.remove('show'), 2200);
      }
    }

    function spawnConfetti(amount = 12) {
      const colors = ['#d4af37', '#ff9a9a', '#f6c6b6', '#ffd5e0', '#f0e68c'];
      for (let i = 0; i < amount; i++) {
        const el = document.createElement('div');
        el.className = 'confetti';
        document.body.appendChild(el);
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        const left = window.innerWidth / 2 + (Math.random() - 0.5) * 240;
        el.style.left = `${left}px`;
        el.style.top = `${window.innerHeight - 120}px`;
        requestAnimationFrame(() => {
          el.style.transform = `translateY(-${200 + Math.random() * 320}px) rotate(${Math.random() * 720}deg)`;
          el.style.opacity = '1';
        });
        setTimeout(() => el.remove(), 1200);
      }
    }
  }

  /* -------------------------
     Preloader (unchanged)
     ------------------------- */
  const preloader = document.getElementById('preloader');
  if (preloader) window.addEventListener('load', () => { preloader.style.opacity = '0'; setTimeout(() => preloader.style.display = 'none', 500); });
});
