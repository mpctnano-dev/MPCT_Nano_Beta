/**
 * Wire the baked-in nano.nau.edu header on /knowledge-base/ pages.
 *
 * layout.js fetches chrome into #site-header. MkDocs pages already include
 * #mainHeader in the HTML so crawlers see the nav without JavaScript.
 * Reuse the same init helpers against that existing node.
 *
 * Also clip Material's TOC / left nav so they stop above the site footer.
 * Material sizes those columns to the viewport and does not know about
 * the pasted nano.nau.edu footer.
 */
(function initDocsHeader() {
    function wire() {
        const header = document.getElementById('mainHeader');
        if (!header) return;
        if (typeof highlightActiveLink === 'function') highlightActiveLink(header);
        if (typeof initMobileMenu === 'function') initMobileMenu(header);
        if (typeof initMobileDrillNav === 'function') initMobileDrillNav(header);
        if (typeof initAllDropdowns === 'function') initAllDropdowns(header);
    }

    function clipSidebarsToFooter() {
        const footer = document.querySelector('.site-footer');
        if (!footer) return;
        const footerTop = footer.getBoundingClientRect().top;
        const gap = 16;
        document.querySelectorAll('.md-sidebar__scrollwrap').forEach((wrap) => {
            const top = wrap.getBoundingClientRect().top;
            const room = Math.min(window.innerHeight - top, footerTop - top) - gap;
            wrap.style.setProperty('height', Math.max(0, room) + 'px', 'important');
        });
    }

    // Material sizes the same wraps on scroll; run again after it so the
    // footer clip wins.
    let clipTimer = 0;
    function scheduleClip() {
        clipSidebarsToFooter();
        requestAnimationFrame(clipSidebarsToFooter);
        clearTimeout(clipTimer);
        clipTimer = setTimeout(clipSidebarsToFooter, 50);
    }

    function start() {
        wire();
        scheduleClip();
        window.addEventListener('scroll', scheduleClip, { passive: true });
        window.addEventListener('resize', scheduleClip, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
