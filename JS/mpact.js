/* Scroll reveal */
(function () {
    const els = document.querySelectorAll('.ml-reveal');
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

/* Sticky divider animation */
(function () {
    const divider = document.querySelector('.hero-divider');
    const header = document.querySelector('.site-header');
    if (!divider) return;

    const updateDivider = () => {
        const headerHeight = header ? header.offsetHeight : 80;
        const dividerRect = divider.getBoundingClientRect();

        // Activate the divider animation seamlessly just before it sticks
        // Triggering earlier (+ 300px) gives it a slower "coming to life" feel
        if (dividerRect.top <= headerHeight + 300) {
            divider.classList.add('is-stuck');
        } else {
            divider.classList.remove('is-stuck');
        }
    };

    window.addEventListener('scroll', updateDivider, { passive: true });
    updateDivider();
})();
