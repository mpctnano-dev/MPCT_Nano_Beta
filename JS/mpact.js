/* Hero Divider — dynamic sticky activation
 * A zero-height sentinel is inserted immediately before the divider.
 * Because the sentinel is never sticky, its getBoundingClientRect().top
 * always reflects the divider's natural scroll position.
 * The moment the sentinel reaches the header, sticky activates — no lag.
 * Reverses cleanly when scrolling back up.
 */
(function () {
    const divider = document.querySelector('.hero-divider--static');
    if (!divider) return;

    // Sentinel: zero-height, non-sticky — tracks the divider's natural position.
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    divider.parentNode.insertBefore(sentinel, divider);

    let stuck = false;

    function getHeaderH() {
        return parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')
        ) || 64;
    }

    function check() {
        const shouldStick = sentinel.getBoundingClientRect().top <= getHeaderH();
        if (shouldStick === stuck) return;
        stuck = shouldStick;
        divider.classList.toggle('hero-divider--static', !stuck);
        divider.classList.toggle('is-stuck', stuck);
    }

    window.addEventListener('scroll', check, { passive: true });
    check(); // Correct initial state on load / back-navigation
})();

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

/* Copy acknowledgement — event-delegated */
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-copy[data-copy-target]');
    if (!btn) return;
    const targetId = btn.getAttribute('data-copy-target');
    const el = document.getElementById(targetId);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(function () {
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(function () {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
});

