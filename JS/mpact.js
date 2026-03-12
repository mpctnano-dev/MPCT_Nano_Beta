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

/* ── Facility Buildout: YouTube IFrame API + Phase Sync ─── */
(function () {
    var mediaSection = document.getElementById('buildout-media');
    if (!mediaSection) return;

    var phaseItems = mediaSection.querySelectorAll('.ml-buildout__timeline-item[data-start]');
    var progressBar = mediaSection.querySelector('.ml-buildout__timeline-progress');
    var phaseDots = mediaSection.querySelectorAll('.ml-buildout__phase-dot[data-phase-index]');
    var ytPlayer = null;
    var phaseInterval = null;

    // Build phase map from data attributes (seconds)
    var phases = [];
    phaseItems.forEach(function (el) {
        phases.push({
            el: el,
            start: parseFloat(el.getAttribute('data-start')),
            end: parseFloat(el.getAttribute('data-end'))
        });
    });

    // Load YouTube IFrame API script
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    // YouTube API ready callback (must be global)
    window.onYouTubeIframeAPIReady = function () {
        ytPlayer = new YT.Player('buildout-yt-player', {
            videoId: 'pZgxggxylLM',
            playerVars: {
                rel: 0,
                modestbranding: 1,
                color: 'white',
                playsinline: 1
            },
            events: {
                onStateChange: onPlayerStateChange
            }
        });
    };

    function onPlayerStateChange(event) {
        clearInterval(phaseInterval);
        if (event.data === YT.PlayerState.PLAYING) {
            phaseInterval = setInterval(syncPhases, 250);
        }
    }

    function syncPhases() {
        if (!ytPlayer) return;
        var t = ytPlayer.getCurrentTime();
        phases.forEach(function (p, i) {
            var isActive = t >= p.start && t < p.end;
            p.el.setAttribute('data-active', isActive ? 'true' : 'false');
            if (phaseDots[i]) {
                phaseDots[i].setAttribute('data-active', isActive ? 'true' : 'false');
            }
        });
        if (progressBar && ytPlayer.getDuration) {
            var dur = ytPlayer.getDuration() || 60;
            var pct = Math.min(t / dur, 1) * 100;
            progressBar.style.height = pct + '%';
        }
    }

    phaseDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            if (!ytPlayer || typeof ytPlayer.seekTo !== 'function') return;
            var seekTo = parseFloat(dot.getAttribute('data-seek-to'));
            if (isNaN(seekTo)) return;
            ytPlayer.seekTo(seekTo, true);
            if (ytPlayer.getPlayerState() === YT.PlayerState.PAUSED ||
                ytPlayer.getPlayerState() === YT.PlayerState.ENDED) {
                ytPlayer.playVideo();
            }
            syncPhases();
        });
    });

    // Scroll reveal for timeline items
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animated = false;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !animated) {
                animated = true;
                observer.unobserve(entry.target);
                if (prefersReducedMotion) {
                    phaseItems.forEach(function (item) { item.classList.add('is-visible'); });
                    return;
                }
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(phaseItems,
                        { opacity: 0, x: -30, scale: 0.97 },
                        { opacity: 1, x: 0, scale: 1, duration: 0.7, stagger: 0.18, ease: 'power3.out',
                          onStart: function () {
                              phaseItems.forEach(function (item, i) {
                                  setTimeout(function () { item.classList.add('is-visible'); }, i * 180);
                              });
                          }
                        }
                    );
                } else {
                    phaseItems.forEach(function (item, i) {
                        setTimeout(function () { item.classList.add('is-visible'); }, i * 200);
                    });
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    observer.observe(mediaSection);
})();
