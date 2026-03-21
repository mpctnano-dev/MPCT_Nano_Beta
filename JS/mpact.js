/* Hero Divider — dynamic sticky activation
 * Starts as position:relative (static) while the hero is visible.
 * The moment the hero section fully exits the viewport (scrolled past),
 * --static is removed so the divider locks under the header via position:sticky.
 * Reverses when scrolling back up into the hero.
 */
(function () {
    const divider = document.querySelector('.hero-divider--static');
    const hero = document.querySelector('.ml-hero');
    if (!divider || !hero) return;

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                // Hero back in view — return divider to flow
                divider.classList.add('hero-divider--static');
                divider.classList.remove('is-stuck');
            } else {
                // Hero scrolled past — activate sticky under header
                divider.classList.remove('hero-divider--static');
                divider.classList.add('is-stuck');
            }
        });
    }, { threshold: 0 });

    io.observe(hero);
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

