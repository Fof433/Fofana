document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking a link or outside
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickInsideToggle = mobileMenu.contains(event.target);

        if (!isClickInsideMenu && !isClickInsideToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });

    // Prevent menu from scrolling when open on mobile
    navMenu.addEventListener('click', (event) => {
        if (event.target.tagName !== 'A') {
            event.stopPropagation();
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // Smooth Scrolling for Anchors (Optional if CSS scroll-behavior: smooth isn't supported)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    // Back to Top Button Functionality
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // page light toggle removed

    // Scroll down button (bottom)
    const scrollDownBtn = document.getElementById('scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        });
    }

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = "block";
            lightboxImg.src = img.src;
            lightboxCaption.innerHTML = img.alt;
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = "none";
        document.body.style.overflow = 'auto'; // Enable scroll
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target == lightbox) {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // Contact form — ouvre le client mail du visiteur et affiche un feedback
    const contactForm = document.getElementById('contact-form');
    const contactFeedback = document.getElementById('contact-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name')?.value.trim() || '';
            const email = document.getElementById('contact-email')?.value.trim() || '';
            const message = document.getElementById('contact-message')?.value.trim() || '';

            const show = (msg, type = 'error') => {
                if (contactFeedback) {
                    contactFeedback.textContent = msg;
                    contactFeedback.classList.remove('success', 'error');
                    contactFeedback.classList.add(type);
                } else {
                    alert(msg);
                }
            };

            if (!name || !email || !message) {
                show('Merci de remplir tous les champs.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                show("L'adresse e-mail n'est pas valide.", 'error');
                return;
            }

            const owner = 'elianefatifofana@gmail.com';
            const subject = encodeURIComponent(`Message depuis le site — ${name}`);
            const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailto = `mailto:${owner}?subject=${subject}&body=${body}`;

            // ouvre le client mail de l'utilisateur (enverra le message à la boîte du propriétaire)
            window.location.href = mailto;

            show(`Votre client mail va s'ouvrir. Si rien ne se passe, envoyez-le manuellement à ${owner}.`, 'success');

            setTimeout(() => contactForm.reset(), 800);
        });
    }
});
