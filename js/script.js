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

            el.textContent = current.toLocaleString('id-ID');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                const suffix = el.dataset.suffix || '';
                el.textContent += suffix;
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
    // ================================================================\n
    // --- WhatsApp Form Modal Logic ---
    const modal = document.getElementById('waFormModal');
    const form = document.getElementById('waForm');
    const closeBtn = document.getElementById('modalClose');
    const openBtns = document.querySelectorAll('.service-wa-btn');

    if (modal && form && closeBtn) {
        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('name');
            const eventType = formData.get('eventType');
            const date = formData.get('date');
            const guestCount = formData.get('guestCount');
            const location = formData.get('location');
            const budget = formData.get('budget');

            const message = `Halo AMC, saya ingin pesan catering untuk ${eventType} pada ${date} untuk ${guestCount} orang. Lokasi: ${location}. Budget: ${budget}. Nama: ${name}.`;
            const url = `https://wa.me/628568773200?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            closeModal();
            form.reset();
        });
    }

});
