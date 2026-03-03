/* ========================================
   AMINIH MUSDA CATERING — JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        updateScrollProgress();
        highlightNav();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        const isActive = navToggle.classList.toggle('active');
        navLinks.classList.toggle('active', isActive);
        navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        if (!progressBar) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString('id-ID') + '+';

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // --- Menu Tabs ---
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('.menu-item');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;

            menuItems.forEach(item => {
                const show = category === 'all' || item.dataset.category === category;
                item.style.display = show ? 'flex' : 'none';
                if (show) {
                    item.style.animation = 'none';
                    item.offsetHeight; // reflow
                    item.style.animation = 'fadeInUp 0.4s ease-out forwards';
                }
            });
        });
    });

    // --- Smooth scroll for all anchor links (does NOT conflict with carousel) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ================================================================
    // TESTIMONIAL CAROUSEL — Fixed: use scrollLeft instead of
    // scrollIntoView to prevent interfering with page scroll position
    // ================================================================
    const track = document.querySelector('.testimonial-track');
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (track) {
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentIndex = 0;
        let autoTimer = null;
        let isUserScrolling = false;

        // Build dots
        if (dotsContainer) {
            cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
                dot.addEventListener('click', () => goToCard(i));
                dotsContainer.appendChild(dot);
            });
        }

        // Build prev/next buttons
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        if (prevBtn) prevBtn.addEventListener('click', () => goToCard(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToCard(currentIndex + 1));

        function getCardWidth() {
            if (!cards.length) return 0;
            const style = window.getComputedStyle(cards[0]);
            return cards[0].offsetWidth + parseInt(style.marginRight || 0);
        }

        function goToCard(index) {
            currentIndex = ((index % totalCards) + totalCards) % totalCards;
            // Use scrollLeft — does NOT scroll the page
            track.scrollTo({
                left: currentIndex * getCardWidth(),
                behavior: 'smooth'
            });
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        // Detect scroll position to update dots when user manually swipes
        let scrollTimeout;
        track.addEventListener('scroll', () => {
            isUserScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const cardW = getCardWidth();
                if (cardW > 0) {
                    currentIndex = Math.round(track.scrollLeft / cardW);
                    currentIndex = Math.max(0, Math.min(currentIndex, totalCards - 1));
                    updateDots();
                }
                isUserScrolling = false;
            }, 150);
        }, { passive: true });

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => {
                if (!isUserScrolling) {
                    goToCard(currentIndex + 1);
                }
            }, 4500);
        }

        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        startAuto();
        track.addEventListener('mouseenter', stopAuto);
        track.addEventListener('mouseleave', startAuto);
        track.addEventListener('touchstart', () => {
            stopAuto();
            isUserScrolling = true;
        }, { passive: true });
        track.addEventListener('touchend', () => {
            isUserScrolling = false;
            setTimeout(startAuto, 2500);
        });
    }

    // --- Active nav link highlight on scroll (using class, not inline style) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta):not(.nav-phone)');

    function highlightNav() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let currentLightboxIndex = 0;

    function openLightbox(index) {
        currentLightboxIndex = index;
        const img = galleryItems[index];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        currentLightboxIndex = ((currentLightboxIndex + dir + galleryItems.length) % galleryItems.length);
        openLightbox(currentLightboxIndex);
    }

    if (lightbox) {
        galleryItems.forEach((img, i) => {
            img.style.cursor = 'zoom-in';
            img.parentElement.addEventListener('click', () => openLightbox(i));
        });
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            // Close all
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
            // Open clicked if it was closed
            if (!isOpen) item.classList.add('open');
        });
    });

    // --- Back to Top Button ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
