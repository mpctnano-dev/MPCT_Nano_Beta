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

/* Facility Buildout — GSAP ScrollTrigger pinned scroll-through */
(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    var section = document.querySelector('.ml-buildout');
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    var cards = section.querySelectorAll('.ml-buildout__card');
    var dots = section.querySelectorAll('.ml-buildout__dot');
    var phaseNum = document.getElementById('bo-number');
    var progressFill = document.getElementById('bo-progress');
    var blueprint = section.querySelector('.ml-buildout__blueprint');
    var nums = ['01', '02', '03', '04'];
    var total = cards.length;
    var currentPhase = 0;

    function setPhase(index) {
        if (index === currentPhase) return;
        currentPhase = index;

        cards.forEach(function (card, i) {
            if (i === index) {
                card.classList.add('is-active');
            } else {
                card.classList.remove('is-active');
            }
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i <= index);
        });

        phaseNum.textContent = nums[index];
    }

    /* Pin the section and scrub through phases on scroll */
    ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        /* Scroll distance = 4 viewports (one per phase) */
        end: '+=' + (window.innerHeight * total),
        pin: '.ml-buildout__pin',
        pinSpacing: true,
        onUpdate: function (self) {
            var progress = self.progress;
            var idx = Math.min(Math.floor(progress * total), total - 1);
            setPhase(idx);
            progressFill.style.width = (progress * 100) + '%';
        }
    });

    /* Blueprint parallax zoom while scrolling through */
    gsap.to(blueprint, {
        scale: 1.25,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    /* Dot clicks scroll to respective phase */
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var idx = parseInt(dot.dataset.index, 10);
            var trigger = ScrollTrigger.getAll().find(function (t) {
                return t.trigger === section;
            });
            if (!trigger) return;
            var targetScroll = trigger.start + (trigger.end - trigger.start) * (idx / total) + 1;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        });
    });
})();
