/**
 * layout.js
 *
 * Loads the shared header and footer into every page.
 * HTML lives in /includes/header.html and /includes/footer.html.
 *
 * NOTE: fetch() requires a web server — does not work on file:// protocol.
 */


// Fetches an HTML file and injects it into the element with the given id.
// The optional callback runs after the HTML is injected, so any functions
// that need the injected DOM (like menus and dropdowns) run at the right time.
function loadPart(id, file, callback) {
    const el = document.getElementById(id);
    if (!el) return;
    fetch(file)
        .then(r => r.text())
        .then(html => {
            el.innerHTML = html;
            if (callback) callback(el);
        });
}


// Reads the current page URL and adds an 'active' CSS class to the matching
// nav link so users can see which page they are on.
function highlightActiveLink(header) {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Highlight top-level nav links (Home, News, About)
    header.querySelectorAll('.nav-link[data-path]').forEach(link => {
        if (link.dataset.path === currentPath) link.classList.add('active');
    });

    // Highlight dropdown links and also light up their parent dropdown button,
    // so the dropdown trigger stays visually active when you're on a sub-page.
    header.querySelectorAll('.nav-dropdown-link[data-path], .nav-res-link[data-path]').forEach(link => {
        if (link.dataset.path === currentPath) {
            link.classList.add('active');
            const trigger = link.closest('.nav-item--has-dropdown')?.querySelector('.nav-dropdown-btn');
            if (trigger) trigger.classList.add('active');
        }
    });

    // degree-programs-grid.html is a sub-view of degree-programs, so the
    // Degree Programs button should stay active on both pages.
    if (currentPath === 'degree-programs.html' || currentPath === 'degree-programs-grid.html') {
        const degreeBtn = header.querySelector('#degreeDropdownItem .nav-dropdown-btn');
        if (degreeBtn) degreeBtn.classList.add('active');
    }

    // Keep the Workforce button active when on the Workforce Development page.
    if (currentPath === 'WorkForceDevelopment.html') {
        const wfdBtn = header.querySelector('#wfdDropdownItem .nav-dropdown-btn');
        if (wfdBtn) wfdBtn.classList.add('active');
    }
}


// Powers the hamburger menu on mobile screens.
// Handles open/close toggling, aria labels for accessibility,
// and automatically closes the menu when a nav link is tapped.
// Also resets drill-down state when the drawer closes.
function initMobileMenu(header) {
    const mobileBtn = header.querySelector('.mobile-toggle');
    const navMenu = header.querySelector('.nav-menu');
    if (!mobileBtn || !navMenu) return;

    // Give the nav menu an id so the button can reference it via aria-controls.
    if (!navMenu.id) navMenu.id = 'site-nav-menu';

    const iconOpen = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18" /></svg>';
    const iconClose = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6" /></svg>';

    const setBodyScrollLock = (locked) => {
        document.body.style.overflow = locked ? 'hidden' : '';
    };

    const setToggleVisual = (isOpen) => {
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
        mobileBtn.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
        mobileBtn.innerHTML = isOpen ? iconClose : iconOpen;
    };

    const resetDrill = () => {
        navMenu.classList.remove('is-drilling');
        header.querySelectorAll('.nav-item--has-dropdown.is-drill-active').forEach(item => {
            item.classList.remove('is-drill-active');
            item.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
        });
        // Also clear legacy .is-mobile-open if present after a restore from archive.
        header.querySelectorAll('.nav-item--has-dropdown.is-mobile-open').forEach(item => {
            item.classList.remove('is-mobile-open');
            item.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
        });
    };

    const closeMenu = () => {
        navMenu.classList.remove('is-open');
        setToggleVisual(false);
        setBodyScrollLock(false);
        resetDrill();
    };

    // Expose reset/close helpers for the drill-down controller.
    navMenu._mpctResetDrill = resetDrill;
    navMenu._mpctCloseMenu = closeMenu;

    mobileBtn.setAttribute('aria-controls', navMenu.id);
    setToggleVisual(false);

    // Toggle the menu open or closed when the hamburger button is tapped.
    mobileBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        setToggleVisual(isOpen);
        setBodyScrollLock(isOpen);
        if (!isOpen) resetDrill();
    });

    // Close the menu when any nav link inside it is clicked.
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close the mobile menu if the user resizes to desktop width,
    // so the nav doesn't stay stuck open after orientation changes.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeMenu();
    }, { passive: true });
}


// Inject a Back bar and drill into a section panel on mobile
// (replaces the archived accordion expand in CSS/_preserved_mobile_nav.css).
function initMobileDrillNav(header) {
    const navMenu = header.querySelector('.nav-menu');
    if (!navMenu) return;

    const dropdownItems = header.querySelectorAll('.nav-item--has-dropdown');

    const drillBar = document.createElement('div');
    drillBar.className = 'nav-drill-bar';
    drillBar.innerHTML = `
        <button type="button" class="nav-drill-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
        </button>
        <span class="nav-drill-title"></span>
    `;
    navMenu.prepend(drillBar);

    const backBtn = drillBar.querySelector('.nav-drill-back');
    const titleEl = drillBar.querySelector('.nav-drill-title');

    const exitDrill = () => {
        const active = navMenu.querySelector('.is-drill-active');
        const activeBtn = active?.querySelector('.nav-dropdown-btn');
        if (typeof navMenu._mpctResetDrill === 'function') {
            navMenu._mpctResetDrill();
        } else {
            navMenu.classList.remove('is-drilling');
            header.querySelectorAll('.is-drill-active').forEach(item => {
                item.classList.remove('is-drill-active');
                item.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
            });
        }
        activeBtn?.focus();
    };

    const enterDrill = (item) => {
        const btn = item.querySelector('.nav-dropdown-btn');
        if (!btn) return;

        dropdownItems.forEach(other => {
            other.classList.remove('is-drill-active', 'is-mobile-open');
            other.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
        });

        item.classList.add('is-drill-active');
        navMenu.classList.add('is-drilling');
        btn.setAttribute('aria-expanded', 'true');

        // Button label text without the chevron SVG.
        const label = [...btn.childNodes]
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim())
            .join(' ')
            .trim() || btn.textContent.trim();
        titleEl.textContent = label;
        backBtn.focus();
    };

    backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exitDrill();
    });

    dropdownItems.forEach(item => {
        const btn = item.querySelector('.nav-dropdown-btn');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            if (window.innerWidth > 1024) return;
            e.preventDefault();
            e.stopPropagation();
            enterDrill(item);
        });
    });

    // Escape while drilling returns to the root list (does not close the sheet).
    navMenu.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (window.innerWidth > 1024) return;
        if (!navMenu.classList.contains('is-drilling')) return;
        e.stopPropagation();
        exitDrill();
    });
}


// Sets up hover, click, and keyboard behaviour for every dropdown in the nav
// (MPaCT Lab, Degree Programs, Workforce). All three share the same trigger
// class so this one function handles all of them.
function initAllDropdowns(header) {
    const dropdownItems = header.querySelectorAll('.nav-item--has-dropdown');

    dropdownItems.forEach(item => {
        const btn = item.querySelector('.nav-dropdown-btn');
        const panel = item.querySelector('.nav-mega-panel');
        if (!btn || !panel) return;

        // closeTimer lets us delay closing so the user has time to
        // move their mouse from the trigger button into the dropdown panel
        // without it snapping shut.
        let closeTimer = null;

        const open = () => {
            clearTimeout(closeTimer);
            // Close any other open dropdown before opening this one,
            // so only one dropdown is ever visible at a time.
            dropdownItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('is-open');
                    other.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
                }
            });
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        };

        const close = (immediate = false) => {
            if (immediate) {
                item.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                // Small delay so moving the mouse from button to panel doesn't close it.
                closeTimer = setTimeout(() => {
                    item.classList.remove('is-open');
                    btn.setAttribute('aria-expanded', 'false');
                }, 120);
            }
        };

        // On desktop, open on hover and close when the mouse leaves.
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth <= 1024) return;
            open();
        });
        item.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 1024) return;
            close();
        });

        /*
         * Archived accordion toggle (see CSS/_preserved_mobile_nav.css).
         * Replaced by drill-down in initMobileDrillNav.
         *
         * btn.addEventListener('click', (e) => {
         *     if (window.innerWidth > 1024) return;
         *     e.stopPropagation();
         *     const willOpen = !item.classList.contains('is-mobile-open');
         *     dropdownItems.forEach(other => {
         *         other.classList.remove('is-mobile-open');
         *         other.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
         *     });
         *     if (willOpen) {
         *         item.classList.add('is-mobile-open');
         *         btn.setAttribute('aria-expanded', 'true');
         *     }
         * });
         */

        // Keyboard support: Enter or Space opens the dropdown,
        // Escape closes it and returns focus to the trigger button.
        btn.addEventListener('keydown', (e) => {
            if (window.innerWidth <= 1024) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.classList.contains('is-open') ? close(true) : open();
            }
            if (e.key === 'Escape') { close(true); btn.focus(); }
        });

        // Pressing Escape while focus is inside a dropdown link
        // also closes the panel and returns focus to the trigger.
        panel.querySelectorAll('a').forEach(link => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') { close(true); btn.focus(); }
            });
        });
    });

    // Clicking outside a desktop dropdown closes open panels.
    // Mobile drill state is owned by initMobileDrillNav / initMobileMenu.
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) return;
        dropdownItems.forEach(item => {
            if (!item.contains(e.target)) {
                item.classList.remove('is-open');
                item.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
            }
        });
    });
}


// Load the header, then wire up all interactive behaviour once it's in the DOM.
loadPart('site-header', '/includes/header.html', (el) => {
    highlightActiveLink(el);
    initMobileMenu(el);
    initMobileDrillNav(el);
    initAllDropdowns(el);
});

// Load the footer — no interactive behaviour needed.
loadPart('site-footer', '/includes/footer.html');


// Equipment_Status.js polls live equipment availability data and is only
// needed on pages that display equipment cards. Rather than loading it on
// every page, we check for the relevant elements first and only inject the
// script when they exist — keeping unnecessary requests off every other page.
const injectEquipmentStatusScript = () => {
    const needsStatus = document.querySelector('.tech-card') || document.querySelector('.product-page');
    if (!needsStatus) return;

    // Prevent the script from being injected more than once if this runs twice.
    if (document.querySelector('script[data-equipment-status]')) return;

    // Equipment pages inside About_Equipment/ are one level deeper,
    // so the script path needs to step up one folder with ../
    const isInSubfolder = window.location.pathname.includes('/About_Equipment/');
    const basePath = isInSubfolder ? '../' : './';

    const script = document.createElement('script');
    script.src = `${basePath}JS/Equipment_Status.js`;
    script.defer = true;
    script.dataset.equipmentStatus = 'true';
    document.body.appendChild(script);
};

// Run after the DOM is ready so querySelector can find the equipment elements.
// If the DOM is already loaded by the time this script runs, call it immediately.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectEquipmentStatusScript);
} else {
    injectEquipmentStatusScript();
}
