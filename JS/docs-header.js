/**
 * Knowledge-base pages ship with #mainHeader already in the HTML.
 * layout.js only initializes a header it fetched into #site-header, which
 * these pages do not have, so the same helpers are called on #mainHeader.
 *
 * Material sets .md-sidebar__scrollwrap height to the viewport. The site
 * footer is in the document flow, so that height would run the TOC and left
 * nav through the footer. Cap each wrap at the footer, then re-apply after
 * Material writes its own height on scroll.
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

    // Material writes wrap height on scroll. Re-run after that write.
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
