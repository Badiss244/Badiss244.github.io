// ===============================================================
//  Badis Nabi — Portfolio interactions
// ===============================================================
(function () {
    'use strict';

    const nav        = document.querySelector('nav');
    const navToggle  = document.querySelector('.nav-toggle');
    const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
    const progress   = document.getElementById('scrollProgress');
    const sections   = Array.from(document.querySelectorAll('section[id]'));

    // ---- Mobile menu --------------------------------------------
    function closeMenu() {
        nav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = nav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(open));
        });
    }
    navAnchors.forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', e => {
        if (nav.classList.contains('open') && !nav.contains(e.target)) closeMenu();
    });

    // ---- Scroll-driven UI: nav shadow, progress bar, active link ----
    let ticking = false;
    function onScroll() {
        const y    = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;

        nav.classList.toggle('scrolled', y > 30);

        if (progress) {
            const pct = docH > 0 ? (y / docH) * 100 : 0;
            progress.style.width = pct + '%';
        }

        // scroll-spy: mark the section currently in view
        const line = y + window.innerHeight * 0.3;
        let current = '';
        sections.forEach(sec => { if (line >= sec.offsetTop) current = sec.id; });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });

        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    // ---- Scroll reveal ------------------------------------------
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);   // reveal once, then stop watching
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

    // ---- Cursor glow (fine pointers only) -----------------------
    if (window.matchMedia('(pointer: fine)').matches) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
        function render() {
            cx += (tx - cx) * 0.15;
            cy += (ty - cy) * 0.15;
            glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
            if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
                raf = requestAnimationFrame(render);
            } else {
                raf = null;
            }
        }
        window.addEventListener('mousemove', e => {
            tx = e.clientX; ty = e.clientY;
            glow.style.opacity = '1';
            if (!raf) raf = requestAnimationFrame(render);
        });
        document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    }
})();
