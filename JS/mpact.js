/* ============================================================
   MPaCT Homepage V2 — JavaScript
   Counter animations, scroll reveals
   ============================================================ */

/* ------- Scroll Reveal (mp2-reveal, mp-reveal, ml-reveal) ------- */
(function () {
    const els = document.querySelectorAll('.mp2-reveal, .mp-reveal, .ml-reveal');
    if (!els.length) return;

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        },
        { threshold: 0.10, rootMargin: '0px 0px -36px 0px' }
    );

    els.forEach(el => io.observe(el));
})();


/* ------- Animated Counters ------- */
(function () {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const useSeparator = el.dataset.separator === ',';
        const duration = 1800;
        const startTime = performance.now();

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            let current = Math.round(eased * target);

            if (useSeparator) {
                current = current.toLocaleString();
            }

            el.textContent = prefix + current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateCounter(e.target);
                    io.unobserve(e.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    counters.forEach(el => io.observe(el));
})();


/* ------- Sticky divider animation (legacy support) ------- */
(function () {
    const divider = document.querySelector('.hero-divider');
    const header = document.querySelector('.site-header');
    if (!divider) return;

    const updateDivider = () => {
        const headerHeight = header ? header.offsetHeight : 80;
        const dividerRect = divider.getBoundingClientRect();

        if (dividerRect.top <= headerHeight + 300) {
            divider.classList.add('is-stuck');
        } else {
            divider.classList.remove('is-stuck');
        }
    };

    window.addEventListener('scroll', updateDivider, { passive: true });
    updateDivider();
})();
