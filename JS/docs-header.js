/**
 * Wire the baked-in nano.nau.edu header on /learn/ pages.
 *
 * layout.js fetches chrome into #site-header. MkDocs pages already include
 * #mainHeader in the HTML so crawlers see the nav without JavaScript.
 * Reuse the same init helpers against that existing node.
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wire);
    } else {
        wire();
    }
})();
