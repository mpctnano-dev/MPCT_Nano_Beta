/**
 * Layout Components
 * --------------------------------------
 * Defines custom web components <site-header> and <site-footer>
 * to ensure consistency across all pages without server-side includes.
 *
 * Dynamic features:
 *  - Gold CTA button text/href adapts per page section:
 *      WFD pages          → "Enroll Now"
 *      MPaCT section pages → "Reserve Equipment"
 *      Home + all others  → "Apply Now"
 *  - Home nav item displays as house icon (no text)
 *  - Nav order: Home (icon) | MPaCT Lab | Degree Programs | WFD | Resources ▾
 *  - Resources dropdown: About Us, Contact Us, Careers
 *  - Active nav link highlighting
 *  - MPaCT Lab mega-menu (icon grid)
 *  - WFD split-panel mega-menu (creative new design)
 */

class SiteHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // ── Path helpers ─────────────────────────────────────────────────
        const isInSubfolder = window.location.pathname.includes('/About_Equipment/');
        const basePath      = isInSubfolder ? '../' : './';
        const currentPage   = window.location.pathname.split('/').pop() || 'index.html';

        // ── Context detection ────────────────────────────────────────────
        const MPACT_PAGES = [
            'MPaCT.html', 'Equipment.html', 'Safety_Training.html',
            'Lab_Calendar.html', 'Research_Publications.html', 'EquipmentRequest.html'
        ];
        const WFD_PAGES = ['WorkForceDevelopment.html'];

        const isMPaCTSection = MPACT_PAGES.includes(currentPage) || isInSubfolder;
        const isWFDSection   = WFD_PAGES.includes(currentPage);

        // ── Dynamic CTA button ───────────────────────────────────────────
        // MPaCT section → "Reserve Equipment"
        // WFD section   → "Enroll Now"
        // Home + all other pages → "Apply Now"
        let ctaText, ctaHref;
        if (isWFDSection) {
            ctaText = 'Enroll Now';
            ctaHref = `${basePath}Contact_Us.html?category=research`;
        } else if (isMPaCTSection) {
            ctaText = 'Reserve Equipment';
            ctaHref = `${basePath}Contact_Us.html?category=equipment`;
        } else {
            ctaText = 'Apply Now';
            ctaHref = `${basePath}Contact_Us.html?category=equipment`;
        }

        // ── HTML ─────────────────────────────────────────────────────────
        this.innerHTML = `
        <header class="site-header" id="mainHeader">
            <div class="main-nav-container container">

                <a href="${basePath}index.html" class="brand-logo">
                    <img src="${basePath}Images/NAU.png" alt="Northern Arizona University" class="header-logo">
                    <div class="brand-divider"></div>
                    <div class="brand-text">
                        <span class="dept1">Microelectronics</span>
                        <span class="dept-sub">at Northern Arizona University</span>
                    </div>
                </a>

                <button class="mobile-toggle" aria-label="Open Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                </button>

                <nav class="nav-menu">

                    <!-- Home — icon only (no text label) -->
                    <div class="nav-item">
                        <a href="${basePath}index.html"
                           class="nav-link nav-link--icon"
                           data-path="index.html"
                           aria-label="Home">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                        </a>
                    </div>

                    <!-- ═══════ MPaCT Lab Mega-Menu (icon grid) ═══════ -->
                    <div class="nav-item nav-item--has-dropdown" id="mpactDropdownItem">
                        <button class="nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">
                            MPaCT Lab
                            <svg class="nav-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        <div class="nav-mega-panel" role="menu" aria-label="MPaCT Lab navigation">
                            <div class="nav-mega-inner">
                                <div class="nav-dropdown-grid">

                                    <a href="${basePath}MPaCT.html" class="nav-dropdown-link"
                                        data-path="MPaCT.html" role="menuitem">
                                        <div class="nav-dropdown-icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                            </svg>
                                        </div>
                                        <div class="nav-dropdown-text">
                                            <strong>Lab Overview</strong>
                                            <small>About the MPaCT Facility</small>
                                        </div>
                                    </a>

                                    <a href="${basePath}Equipment.html" class="nav-dropdown-link"
                                        data-path="Equipment.html" role="menuitem">
                                        <div class="nav-dropdown-icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                                            </svg>
                                        </div>
                                        <div class="nav-dropdown-text">
                                            <strong>Equipment Catalog</strong>
                                            <small>Browse 25+ instruments</small>
                                        </div>
                                    </a>

                                    <a href="${basePath}Contact_Us.html?category=equipment" class="nav-dropdown-link"
                                        data-path="Contact_Us.html" role="menuitem">
                                        <div class="nav-dropdown-icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                                <line x1="9" y1="12" x2="15" y2="12"></line>
                                                <line x1="9" y1="16" x2="13" y2="16"></line>
                                            </svg>
                                        </div>
                                        <div class="nav-dropdown-text">
                                            <strong>Reserve Equipment</strong>
                                            <small>Submit a usage request</small>
                                        </div>
                                    </a>

                                    <a href="${basePath}Research_Publications.html" class="nav-dropdown-link"
                                        data-path="Research_Publications.html" role="menuitem">
                                        <div class="nav-dropdown-icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                            </svg>
                                        </div>
                                        <div class="nav-dropdown-text">
                                            <strong>Research &amp; Publications</strong>
                                            <small>Lab output &amp; papers</small>
                                        </div>
                                    </a>

                                    <a href="${basePath}Lab_Calendar.html" class="nav-dropdown-link"
                                        data-path="Lab_Calendar.html" role="menuitem">
                                        <div class="nav-dropdown-icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </div>
                                        <div class="nav-dropdown-text">
                                            <strong>Lab Calendar</strong>
                                            <small>Schedule &amp; events</small>
                                        </div>
                                    </a>

                                    <a href="${basePath}Safety_Training.html" class="nav-dropdown-link"
                                        data-path="Safety_Training.html" role="menuitem">
                                        <div class="nav-dropdown-icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                <polyline points="9 12 11 14 15 10"></polyline>
                                            </svg>
                                        </div>
                                        <div class="nav-dropdown-text">
                                            <strong>Safety &amp; Training</strong>
                                            <small>Certifications &amp; SOPs</small>
                                        </div>
                                    </a>

                                    <div class="nav-dropdown-link nav-dropdown-link--disabled"
                                        role="menuitem" aria-disabled="true">
                                        <div class="nav-dropdown-icon">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <rect x="3" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="14" width="7" height="7"></rect>
                                                <rect x="3" y="14" width="7" height="7"></rect>
                                            </svg>
                                        </div>
                                        <div class="nav-dropdown-text">
                                            <strong>Cleanroom <span class="nav-soon-badge">Soon</span></strong>
                                            <small>Class 1000 access</small>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- End MPaCT Lab Mega-Menu -->

                    <!-- Degree Programs -->
                    <div class="nav-item">
                        <a href="${basePath}degree-programs.html" class="nav-link"
                            data-path="degree-programs.html">Degree Programs</a>
                    </div>

                    <!-- ═══════ WFD Split-Panel Mega-Menu ═══════ -->
                    <div class="nav-item nav-item--has-dropdown" id="wfdDropdownItem">
                        <button class="nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">
                            WFD
                            <svg class="nav-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        <div class="nav-wfd-panel" role="menu" aria-label="Workforce Development navigation">
                            <div class="nav-wfd-inner">

                                <!-- LEFT: Featured dark panel -->
                                <div class="nav-wfd-left">
                                    <div class="nav-wfd-left__eyebrow">
                                        <span class="nav-wfd-left__dot"></span>
                                        NAU Nano
                                    </div>
                                    <div class="nav-wfd-left__title">
                                        Workforce<br><em>Development</em>
                                    </div>
                                    <p class="nav-wfd-left__desc">
                                        Day-1 ready graduates for Arizona's semiconductor fab floor — powered by Intel, TSMC, and Microchip Technology.
                                    </p>
                                    <div class="nav-wfd-left__stats">
                                        <div class="nav-wfd-stat">
                                            <div class="nav-wfd-stat__num">4</div>
                                            <div class="nav-wfd-stat__label">Programs</div>
                                        </div>
                                        <div class="nav-wfd-stat">
                                            <div class="nav-wfd-stat__num">6</div>
                                            <div class="nav-wfd-stat__label">Degrees</div>
                                        </div>
                                    </div>
                                    <a href="${basePath}WorkForceDevelopment.html" class="nav-wfd-left__cta">
                                        Learn More
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </a>
                                </div>

                                <!-- RIGHT: Editorial link list -->
                                <div class="nav-wfd-right">
                                    <div class="nav-wfd-right__label">Programs &amp; Pathways</div>

                                    <a href="${basePath}WorkForceDevelopment.html#ptap"
                                        class="nav-wfd-link" data-path="WorkForceDevelopment.html" role="menuitem">
                                        <div class="nav-wfd-link__body">
                                            <div class="nav-wfd-link__title">
                                                PTAP Apprenticeship
                                                <span class="nav-wfd-badge nav-wfd-badge--live">Enrolling</span>
                                            </div>
                                            <div class="nav-wfd-link__sub">2-year state-registered program with TSMC Arizona</div>
                                        </div>
                                        <svg class="nav-wfd-link__arrow" width="14" height="14" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </a>

                                    <a href="${basePath}degree-programs.html"
                                        class="nav-wfd-link" data-path="degree-programs.html" role="menuitem">
                                        <div class="nav-wfd-link__body">
                                            <div class="nav-wfd-link__title">
                                                Degree Programs
                                                <span class="nav-wfd-badge nav-wfd-badge--new">6 Tracks</span>
                                            </div>
                                            <div class="nav-wfd-link__sub">EE, CS, CE, ME, Mechatronics, BSET</div>
                                        </div>
                                        <svg class="nav-wfd-link__arrow" width="14" height="14" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </a>

                                    <a href="${basePath}WorkForceDevelopment.html#industry"
                                        class="nav-wfd-link" role="menuitem">
                                        <div class="nav-wfd-link__body">
                                            <div class="nav-wfd-link__title">
                                                Industry Partnerships
                                            </div>
                                            <div class="nav-wfd-link__sub">Sponsored research, co-ops, and talent pipelines</div>
                                        </div>
                                        <svg class="nav-wfd-link__arrow" width="14" height="14" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </a>

                                    <a href="${basePath}WorkForceDevelopment.html#careers"
                                        class="nav-wfd-link" role="menuitem">
                                        <div class="nav-wfd-link__body">
                                            <div class="nav-wfd-link__title">
                                                Career Pathways
                                                <span class="nav-wfd-badge nav-wfd-badge--soon">Soon</span>
                                            </div>
                                            <div class="nav-wfd-link__sub">Job placement, internships &amp; co-op placements</div>
                                        </div>
                                        <svg class="nav-wfd-link__arrow" width="14" height="14" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </a>

                                    <a href="${basePath}Contact_Us.html?category=research"
                                        class="nav-wfd-link" role="menuitem">
                                        <div class="nav-wfd-link__body">
                                            <div class="nav-wfd-link__title">Become a Partner</div>
                                            <div class="nav-wfd-link__sub">Shape curriculum &amp; access top talent early</div>
                                        </div>
                                        <svg class="nav-wfd-link__arrow" width="14" height="14" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </a>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- End WFD Mega-Menu -->

                    <!-- ═══════ Resources Dropdown ═══════ -->
                    <div class="nav-item nav-item--has-dropdown" id="resourcesDropdownItem">
                        <button class="nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">
                            Resources
                            <svg class="nav-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        <div class="nav-mega-panel nav-resources-panel" role="menu" aria-label="Resources navigation">
                            <div class="nav-mega-inner nav-resources-inner">

                                <a href="${basePath}About_Us.html"
                                    class="nav-res-link" data-path="About_Us.html" role="menuitem">
                                    <div class="nav-res-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <circle cx="12" cy="8" r="4"></circle>
                                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"></path>
                                        </svg>
                                    </div>
                                    <div class="nav-res-text">
                                        <strong>About Us</strong>
                                        <small>Our mission, team &amp; facility</small>
                                    </div>
                                </a>

                                <a href="${basePath}Contact_Us.html"
                                    class="nav-res-link" data-path="Contact_Us.html" role="menuitem">
                                    <div class="nav-res-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    </div>
                                    <div class="nav-res-text">
                                        <strong>Contact Us</strong>
                                        <small>Get in touch with the lab</small>
                                    </div>
                                </a>

                                <a href="${basePath}Contact_Us.html?category=careers"
                                    class="nav-res-link" role="menuitem">
                                    <div class="nav-res-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
                                            <line x1="12" y1="12" x2="12" y2="16"></line>
                                            <line x1="10" y1="14" x2="14" y2="14"></line>
                                        </svg>
                                    </div>
                                    <div class="nav-res-text">
                                        <strong>Careers</strong>
                                        <small>Jobs, internships &amp; co-ops</small>
                                    </div>
                                </a>

                            </div>
                        </div>
                    </div>
                    <!-- End Resources Dropdown -->

                    <!-- Dynamic CTA button -->
                    <div class="nav-item">
                        <a href="${ctaHref}" class="btn btn-sm btn-gold">${ctaText}</a>
                    </div>

                </nav>
            </div>
        </header>
        `;

        this.highlightActiveLink();
        this.initMobileMenu();
        this.initAllDropdowns();
    }

    highlightActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        // Top-level nav links
        this.querySelectorAll('.nav-link[data-path]').forEach(link => {
            if (link.dataset.path === currentPath) link.classList.add('active');
        });

        // Dropdown links — also highlight the parent trigger
        this.querySelectorAll('.nav-dropdown-link[data-path], .nav-wfd-link[data-path], .nav-res-link[data-path]').forEach(link => {
            if (link.dataset.path === currentPath) {
                link.classList.add('active');
                const trigger = link.closest('.nav-item--has-dropdown')?.querySelector('.nav-dropdown-btn');
                if (trigger) trigger.classList.add('active');
            }
        });

        // Highlight WFD trigger when on WFD page
        if (currentPath === 'WorkForceDevelopment.html') {
            const wfdBtn = this.querySelector('#wfdDropdownItem .nav-dropdown-btn');
            if (wfdBtn) wfdBtn.classList.add('active');
        }
    }

    initMobileMenu() {
        const mobileBtn = this.querySelector('.mobile-toggle');
        const navMenu   = this.querySelector('.nav-menu');
        if (!mobileBtn || !navMenu) return;

        if (!navMenu.id) navMenu.id = 'site-nav-menu';

        const closeMenu = () => {
            navMenu.classList.remove('is-open');
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.setAttribute('aria-label', 'Open Menu');
            this.querySelectorAll('.nav-item--has-dropdown.is-mobile-open').forEach(item => {
                item.classList.remove('is-mobile-open');
                item.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
            });
        };

        mobileBtn.setAttribute('aria-controls', navMenu.id);
        mobileBtn.setAttribute('aria-expanded', 'false');

        mobileBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('is-open');
            mobileBtn.setAttribute('aria-expanded', String(isOpen));
            mobileBtn.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) closeMenu();
        }, { passive: true });
    }

    /**
     * initAllDropdowns — sets up hover/click/keyboard behaviour for every
     * .nav-item--has-dropdown on the page. Works for both MPaCT (nav-mega-panel)
     * and WFD (nav-wfd-panel) because both share the same trigger class.
     */
    initAllDropdowns() {
        const dropdownItems = this.querySelectorAll('.nav-item--has-dropdown');

        dropdownItems.forEach(item => {
            const btn   = item.querySelector('.nav-dropdown-btn');
            const panel = item.querySelector('.nav-mega-panel, .nav-wfd-panel');
            if (!btn || !panel) return;

            let closeTimer = null;

            const open = () => {
                clearTimeout(closeTimer);
                // Close all other open dropdowns first
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
                    closeTimer = setTimeout(() => {
                        item.classList.remove('is-open');
                        btn.setAttribute('aria-expanded', 'false');
                    }, 120);
                }
            };

            // ── Desktop: mouse hover ──────────────────────────────────────
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth <= 1024) return;
                open();
            });
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth <= 1024) return;
                close();
            });

            // ── Mobile: tap to accordion-expand ──────────────────────────
            btn.addEventListener('click', (e) => {
                if (window.innerWidth > 1024) return;
                e.stopPropagation();
                const isOpen = item.classList.toggle('is-mobile-open');
                btn.setAttribute('aria-expanded', String(isOpen));
            });

            // ── Keyboard: Enter/Space opens; Escape closes ────────────────
            btn.addEventListener('keydown', (e) => {
                if (window.innerWidth <= 1024) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.classList.contains('is-open') ? close(true) : open();
                }
                if (e.key === 'Escape') { close(true); btn.focus(); }
            });

            panel.querySelectorAll('a').forEach(link => {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') { close(true); btn.focus(); }
                });
            });
        });

        // ── Click outside closes all ──────────────────────────────────────
        document.addEventListener('click', (e) => {
            dropdownItems.forEach(item => {
                if (!item.contains(e.target)) {
                    item.classList.remove('is-open', 'is-mobile-open');
                    item.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}


/* ═══════════════════════════════════════════════════════════════
   Site Footer
   ═══════════════════════════════════════════════════════════════ */
class SiteFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const isInSubfolder = window.location.pathname.includes('/About_Equipment/');
        const basePath      = isInSubfolder ? '../' : './';

        this.innerHTML = `
        <footer class="site-footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-brand">
                        <img src="${basePath}Images/NAU.png" class="footer-logo" alt="NAU Logo"
                            onerror="this.style.display='none'">
                        <p style="color: rgba(255,255,255,0.7); max-width: 300px; margin-bottom: 25px;">
                            The Microelectronics Processing, Characterization, and Testing Lab is dedicated
                            to advancing semiconductor education and research.</p>
                        <div class="social-row">
                            <a href="https://twitter.com/NAU" target="_blank" class="social-icon" aria-label="X (Twitter)">
                                <svg viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/NAU/" target="_blank" class="social-icon" aria-label="Facebook">
                                <svg viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/nauflagstaff/" target="_blank" class="social-icon" aria-label="Instagram">
                                <svg viewBox="0 0 24 24">
                                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2.5a1 1 0 100 2 1 1 0 000-2z"></path>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/school/northern-arizona-university/" target="_blank"
                                class="social-icon" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="footer-col">
                        <h4>User Portal</h4>
                        <ul class="footer-links">
                            <li><a href="${basePath}Contact_Us.html?category=equipment">Book Equipment</a></li>
                            <li><a href="${basePath}Contact_Us.html?category=issue">Report an Issue</a></li>
                            <li><a href="${basePath}Safety_Training.html">Safety Training</a></li>
                            <li><a href="#">SDS Database</a></li>
                            <li><a href="#">Lab Policies</a></li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h4>Academics</h4>
                        <ul class="footer-links">
                            <li><a href="https://catalog.nau.edu/Catalog/">Undergraduate Courses</a></li>
                            <li><a href="${basePath}degree-programs.html">Graduate Research</a></li>
                            <li><a href="${basePath}degree-programs.html">Certificate Programs</a></li>
                            <li><a href="${basePath}WorkForceDevelopment.html">Workforce Development</a></li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h4>Connect</h4>
                        <ul class="footer-links">
                            <li><a href="${basePath}Contact_Us.html">Contact Us</a></li>
                            <li><a href="${basePath}Contact_Us.html?category=research">Partner With Us</a></li>
                            <li><a href="https://nau.edu/alumni/">Alumni Network</a></li>
                            <li><a href="https://foundation.nau.edu/">Support NAU Nano</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="container footer-bottom-flex">
                    <p>&copy; 2026 Northern Arizona University. All Rights Reserved.</p>
                    <div class="footer-links-flex">
                        <a href="https://in.nau.edu/eoa/" target="_blank" class="footer-link-mute">Nondiscrimination</a>
                        <a href="https://in.nau.edu/accessibility/" target="_blank" class="footer-link-mute">Accessibility</a>
                        <a href="https://nau.edu/privacy/" target="_blank" class="footer-link-mute">Privacy</a>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}


// ── Register Web Components ───────────────────────────────────────────────────
customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);


// ── Lazy-load Equipment Status script only on pages that need it ──────────────
const injectEquipmentStatusScript = () => {
    const needsStatus = document.querySelector('.tech-card') || document.querySelector('.product-page');
    if (!needsStatus) return;
    if (document.querySelector('script[data-equipment-status]')) return;

    const isInSubfolder = window.location.pathname.includes('/About_Equipment/');
    const basePath      = isInSubfolder ? '../' : './';

    const script = document.createElement('script');
    script.src   = `${basePath}JS/Equipment_Status.js`;
    script.defer = true;
    script.dataset.equipmentStatus = 'true';
    document.body.appendChild(script);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectEquipmentStatusScript);
} else {
    injectEquipmentStatusScript();
}
