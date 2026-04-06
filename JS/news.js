/**
 * News page controller.
 *
 * The HTML file owns the compact grid cards because they need to exist for first paint and
 * progressive enhancement. This file owns the richer article data, the inline reader, and
 * the client-side filtering behavior. The contract between the two is `data-article-id`.
 */

const EQUIPMENT_LINKS = {
    'FLs1000': 'About_Equipment/Photoluminescence_Spectrometer.html',
    'HAAS Desktop CNC': 'About_Equipment/Haas_DesktopMill.html',
    'LPKF ProtoLaser': 'About_Equipment/LPKF_ProtoLaser.html',
    'LPKF ProtoLaser R4': 'About_Equipment/LPKF_ProtoLaser.html',
    'West-Bond Wire Bonder': 'About_Equipment/WestBond_WireBonder.html',
    'Bambu Lab H2D 3D Printer': 'About_Equipment/Bambu_H2D.html',
    'Photoluminescence Spectrometer': 'About_Equipment/Photoluminescence_Spectrometer.html',
    'Seebeck and Resistivity Instrument': 'About_Equipment/Seebeck_Resistivity_Instrument.html',
    'Tresky T-4909 Die Bonder': 'About_Equipment/Tresky_DieBonder.html',
    'BELSORP MAX X Surface and Pore Analyzer': 'About_Equipment/BELSORP_MAX_X.html',
    'SEM': 'About_Equipment/SEM.html',
    'TEM': 'About_Equipment/TEM.html',
    'XRD': 'About_Equipment/XRD.html'
};

/* Article definitions drive the expanded reader view. Keep ids synchronized with News.html. */

const ARTICLES = [
    {
        id: 'facility-renovation',
        title: 'Facility Renovation Milestone',
        tagLabel: 'Facility',
        date: '2026-01-15',
        readTime: '3 min read',
        heroImage: 'Images/blueprint_1.jpeg',
        heroAlt: 'Facility renovation blueprint at MPaCT Lab',
        statusBadge: 'Milestone',
        stats: [
            { value: '$2.5M', label: 'Investment' },
            { value: 'Multi-Phase', label: 'Build Approach' },
            { value: 'Shared Access', label: 'Facility Model' }
        ],
        sections: [
            {
                heading: 'Project Overview',
                body: 'MPaCT Lab at Northern Arizona University has launched a $2.5 million renovation initiative — a landmark step toward establishing a world-class shared metrology facility. The investment reflects NAU\'s commitment to providing cutting-edge infrastructure accessible to academic, government, and industry partners across the region. Preliminary construction phases are underway, with targeted completion milestones set throughout 2026.'
            },
            {
                heading: 'What\'s Being Built',
                body: 'The renovation covers vibration-isolated flooring designed to protect sensitive metrology instruments, upgraded HVAC systems with precision humidity and temperature control, new power conditioning units, and expanded cleanroom-adjacent workspace. These upgrades meet the strict environmental requirements of electron microscopes, surface profilers, X-ray diffraction systems, and atomic force microscopes.'
            }
        ],
        // This article uses a dated milestone timeline so the reader can show renovation sequencing, not just prose.
        featured: {
            type: 'phases',
            heading: 'Project Phases',
            items: [
                { period: 'Q1 2026', title: 'Site Preparation & Demolition', desc: 'Structural reinforcement and vibration-isolation foundation prep' },
                { period: 'Q2 2026', title: 'HVAC & Electrical Upgrades', desc: 'Precision environmental controls and power conditioning installation' },
                { period: 'Q3 2026', title: 'Cleanroom Fit-Out', desc: 'Cleanroom partition walls, gowning anteroom, and HEPA filtration systems' },
                { period: 'Q4 2026', title: 'Equipment Move-In', desc: 'Instrument relocation, commissioning, and user access launch' }
            ]
        },
        cta: { text: 'Interested in using the shared facility?', label: 'Learn About MPaCT', href: 'MPaCT.html' },
        gallery: [
            { src: 'Images/blueprint_1.jpeg', alt: 'Facility floor plan', caption: 'Detailed facility floor plan and layout' },
            { src: 'Images/engineering_building.jpg', alt: 'NAU Engineering Building', caption: 'NAU Engineering Building — home of MPaCT Lab' }
        ]
    },

    {
        id: 'january-2026-achievements',
        title: 'January 2026 Achievements',
        tagLabel: 'Installation',
        date: '2026-01-31',
        readTime: '4 min read',
        heroImage: 'Images/FLS1000.png',
        heroAlt: 'FLs1000 fiber laser system at MPaCT',
        statusBadge: 'New Systems',
        stats: [
            { value: '3', label: 'Systems Installed' },
            { value: 'Jan 2026', label: 'Commissioning Month' },
            { value: '100%', label: 'Operational' }
        ],
        sections: [
            {
                heading: 'Three Systems, One Month',
                body: 'January 2026 marked a landmark milestone for MPaCT Lab with the simultaneous commissioning of three major instruments: the FLs1000 fiber laser system, the HAAS Desktop CNC mill and lathe, and the LPKF PCB prototyping platform. Each instrument completed rigorous acceptance testing, calibration, and safety sign-off before being cleared for user access. Together they span microfabrication, precision machining, and rapid electronics prototyping — dramatically widening MPaCT\'s technical coverage in a single month.'
            }
        ],
        // This featured block intentionally reuses the accessory-card visual pattern so the commissioned systems scan quickly.
        featured: {
            type: 'equipment-cards',
            heading: 'Commissioned Systems',
            items: [
                {
                    name: 'FLs1000',
                    img: 'Images/FLS1000.png',
                    desc: 'Laser microfabrication and ablation'
                },
                {
                    name: 'HAAS Desktop CNC',
                    img: 'Images/DeskMill.png',
                    desc: 'Precision mill and lathe operations'
                },
                {
                    name: 'LPKF ProtoLaser R4',
                    img: 'Images/LPKF.png',
                    desc: 'Rapid PCB prototyping and laser structuring'
                }
            ]
        },
        cta: { text: 'Ready to book time on these systems?', label: 'Book Equipment', href: 'Book_Equipment.html' },
        galleryLayout: 'three-up',
        gallery: [
            { src: 'Images/FLS1000.png', alt: 'FLs1000 fiber laser system', caption: 'FLs1000 fiber laser system now commissioned at MPaCT' },
            { src: 'Images/LPKF.png', alt: 'LPKF PCB prototyping system', caption: 'LPKF ProtoLaser rapid PCB prototyping' },
            { src: 'Images/DeskMill.png', alt: 'HAAS Desktop CNC Mill', caption: 'HAAS Desktop CNC Mill precision machining' }
        ]
    },

    {
        id: 'mobile-van',
        title: 'Mobile Van',
        tagLabel: 'Outreach',
        date: '2026-02-15',
        readTime: '3 min read',
        heroImage: 'Images/Van_Image.jpeg',
        heroAlt: 'NAU mobile outreach van',
        statusBadge: 'Outreach',
        stats: [
            { value: '1', label: 'Custom Van Build' },
            { value: 'Statewide', label: 'Outreach Reach' },
            { value: '< 20 min', label: 'Venue Setup Time' }
        ],
        sections: [
            {
                heading: 'Bringing the Lab to the Community',
                body: 'MPaCT Lab has completed development of a fully equipped mobile STEM outreach unit — a purpose-built custom van featuring a retractable awning, heavy-duty roof rack, and full branded exterior wrap. The unit is designed to bring hands-on science, technology, engineering, and mathematics experiences directly to schools, tribal colleges, community events, and workforce development sites across northern Arizona. Geographic barriers to quality STEM education are a real problem in rural communities — the mobile unit is MPaCT\'s direct response.'
            }
        ],
        // The outreach article works best as a capability checklist because readers are usually evaluating visit readiness.
        featured: {
            type: 'feature-list',
            heading: 'What\'s Included',
            items: [
                'Custom van build with full MPaCT/NAU branded exterior wrap',
                'Retractable awning for covered outdoor setup in any weather',
                'Heavy-duty roof rack for secure equipment transport',
                'Portable digital microscopy and handheld imaging tools',
                'Precision measurement and metrology demonstration equipment',
                'Full venue setup in under 20 minutes',
                'Available to K-12 schools, tribal colleges, and community institutions'
            ]
        },
        cta: { text: 'Want to bring MPaCT to your school or event?', label: 'Request a Visit', href: 'Contact_Us.html' },
        gallery: []
    },

    {
        id: 'open-for-bookings',
        title: 'Now Open for Bookings',
        tagLabel: 'Bookings',
        date: '2026-03-01',
        readTime: '3 min read',
        heroImage: 'Images/lab_services.jpg',
        heroAlt: 'MPaCT lab services and equipment',
        statusBadge: 'Open Now',
        stats: [
            { value: 'Open', label: 'Booking Status' },
            { value: '7', label: 'Services Available' },
            { value: 'All Users', label: 'Access Level' }
        ],
        sections: [
            {
                heading: 'Facility Open for Reservations',
                body: 'MPaCT Lab is pleased to announce that equipment booking and metrology services are now officially available to all users. Students, faculty, and external industry and government partners can reserve instrument time, request sample analysis, and access operator-assisted measurement services via the online portal. The booking system provides real-time availability, transparent pricing, and streamlined scheduling — accessible 24/7 from any device.'
            },
            {
                heading: 'How to Book',
                body: 'Visit the Book Equipment page, select your instrument or service, choose your date and session duration, and submit your request. For custom projects or large-volume sample runs, contact the lab directly. NAU-affiliated researchers qualify for reduced academic rates. First-time users are encouraged to schedule a brief orientation with a lab specialist before their initial booking.'
            }
        ],
        // Services are presented as a browsable grid because the user decision here is typically "what can I book right now?"
        featured: {
            type: 'service-grid',
            heading: 'Available Services',
            items: [
                { icon: '🔌', name: 'LPKF ProtoLaser R4', img: 'Images/LPKF.png', desc: 'Rapid PCB prototyping and laser structuring' },
                { icon: '🧵', name: 'West-Bond Wire Bonder', img: 'Images/bond.jpg', desc: 'Fine-pitch wire bonding for advanced packaging' },
                { icon: '🖨️', name: 'Bambu Lab H2D 3D Printer', img: 'Images/3d_printer.png', desc: 'Rapid additive manufacturing and part iteration' },
                { icon: '🔆', name: 'Photoluminescence Spectrometer', img: 'Images/FLS1000.png', desc: 'Optical emission and lifetime characterization' },
                { icon: '📈', name: 'Seebeck and Resistivity Instrument', img: 'Images/Seebeck.png', desc: 'Thermoelectric and electrical transport testing' },
                { icon: '🧩', name: 'Tresky T-4909 Die Bonder', img: 'Images/Die_B.png', desc: 'Precision die attach and packaging assembly' },
                { icon: '🧪', name: 'BELSORP MAX X Surface and Pore Analyzer', img: 'Images/SurfaceandPore.jpg', desc: 'Surface area and pore-size characterization' }
            ]
        },
        cta: { text: 'Ready to get started?', label: 'Book Now', href: 'Book_Equipment.html' },
        gallery: []
    },

    /*
     * Advancing Shared Facility Vision is temporarily hidden while the published set stays focused on
     * the current five stories. Keep the full object nearby so the article can be restored without
     * rebuilding its roadmap structure or copy.
     *
    {
        id: 'advancing-shared-facility',
        title: 'Advancing Shared Facility Vision',
        tagLabel: 'Facility',
        date: '2025-12-10',
        readTime: '4 min read',
        heroImage: 'Images/processing_lab.jpg',
        heroAlt: 'MPaCT processing lab infrastructure',
        statusBadge: 'Milestone',
        stats: [
            { value: 'Multi-Phase', label: 'Development Plan' },
            { value: '2025–26', label: 'Active Period' },
            { value: '6+', label: 'Systems Added' }
        ],
        sections: [
            {
                heading: 'A Deliberate, Long-Term Build',
                body: 'The development of MPaCT\'s shared facility is not a single event — it is a deliberate, multi-phase program. Each equipment acquisition, infrastructure upgrade, and partnership agreement is a calculated step toward a fully operational, self-sustaining shared facility serving academia, industry, and government at a nationally competitive level. The 2025–2026 academic year has been the most active build period to date, with significant additions across characterization, fabrication, and infrastructure.'
            },
            {
                heading: 'What\'s Next',
                body: 'The roadmap continues with targeted investments in surface analysis, in-situ characterization, and lab automation. MPaCT is also expanding its training and workforce development programs to match the growing instrument suite with a growing pool of certified users. Partnership agreements with regional industry and government agencies are being finalized to establish service-level agreements and cost-sharing models.'
            }
        ],
        // The roadmap renderer communicates sequence and status better than another paragraph-heavy article body.
        featured: {
            type: 'progress',
            heading: 'Facility Roadmap',
            items: [
                { status: 'active', icon: '→', label: 'SEM & TEM Commissioned', detail: 'High-resolution electron microscopy operational', statusLabel: 'In Progress' },
                { status: 'active', icon: '→', label: 'XRD System Commissioned', detail: 'Phase ID, Rietveld, and thin-film GIXRD available', statusLabel: 'In Progress' },
                { status: 'done', icon: '✓', label: 'FLs1000, HAAS & LPKF Installed', detail: 'Laser, CNC, and PCB prototyping systems live', statusLabel: 'Complete' },
                { status: 'active', icon: '→', label: '$2.5M Facility Renovation', detail: 'Vibration isolation, HVAC, cleanroom fit-out — phased through 2026', statusLabel: 'In Progress' },
                { status: 'planned', icon: '◦', label: 'Surface Analysis Tools', detail: 'XPS, Auger, and SIMS capabilities planned', statusLabel: 'Planned' },
                { status: 'planned', icon: '◦', label: 'Lab Automation & Robotics', detail: 'Automated sample handling and scheduling integration', statusLabel: 'Planned' }
            ]
        },
        cta: { text: 'Explore the full instrument catalog.', label: 'View Equipment', href: 'Equipment.html' },
        gallery: []
    },
    */

    {
        id: 'lpkf-protolaser-r4-commissioned',
        title: 'LPKF ProtoLaser R4 Commissioned',
        tagLabel: 'Installation',
        date: '2026-03-20',
        readTime: '4 min read',
        heroImage: 'Images/LPKF.png',
        heroAlt: 'LPKF ProtoLaser R4 at MPaCT Lab',
        statusBadge: 'New System',
        stats: [
            { value: 'Live', label: 'System Status' },
            { value: '20 µm', label: 'Circuit Spacing' },
            { value: '8 W', label: 'Laser Power' }
        ],
        sections: [
            {
                heading: 'System Commissioned',
                body: 'MPaCT Lab\'s LPKF ProtoLaser R4 is now fully commissioned and available for rapid PCB prototyping and precision laser processing. The system supports cold ablation, a low-heat process that reduces cracking and delamination on sensitive laminates and ceramics. Final acceptance, calibration, and operational checks were completed before release for project work and training.'
            },
            {
                heading: 'What It Enables',
                body: 'The ProtoLaser R4 handles FR4, fired ceramics, glass, and flexible polyimide foils for circuit structuring, drilling, cutting, depaneling, and thin-film removal. It is well-suited to electronics prototyping, advanced packaging work, and instructional fabrication workflows that need fine features without the vibration or tool wear of traditional milling.'
            }
        ],
        // Technical specs stay tabular here because users compare capabilities row by row before booking instrument time.
        featured: {
            type: 'spec-table',
            heading: 'Technical Specifications',
            rows: [
                { label: 'Laser Power', val: '8 W (Max)' },
                { label: 'Processing Area (X/Y/Z)', val: '305 mm x 229 mm x 7 mm' },
                { label: 'Positioning Accuracy', val: '+/- 8 µm (Scan Field)' },
                { label: 'Repeatability', val: '+/- 0.23 µm' },
                { label: 'Structuring Speed', val: '~3.5 cm²/min (18 µm Cu)' },
                { label: 'Control Software', val: 'LPKF CircuitPro PL' }
            ]
        },
        cta: { text: 'Need rapid PCB prototyping or precision laser structuring?', label: 'Book LPKF Time', href: 'Book_Equipment.html' },
        gallery: []
    }
];

/* Render the one article-specific block that sits between the narrative body and the CTA. */

const renderFeatured = (featured) => {
    if (!featured) return '';

    const heading = featured.heading
        ? `<h3 class="nar-section-heading">${featured.heading}</h3>`
        : '';

    switch (featured.type) {

        case 'phases':
            return heading + `<div class="nar-phases">` +
                featured.items.map(item => `
                    <div class="nar-phase-item">
                        <div class="nar-phase-item__period">${item.period}</div>
                        <div class="nar-phase-item__body">
                            <p class="nar-phase-item__title">${item.title}</p>
                            <p class="nar-phase-item__desc">${item.desc}</p>
                        </div>
                    </div>
                `).join('') + `</div>`;

        case 'equipment-cards':
            return heading + `<div class="accessories-grid nar-system-grid">` +
                featured.items.map(item => {
                    const link = EQUIPMENT_LINKS[item.name] || 'Equipment.html';
                    return `
                    <a href="${link}" class="acc-card">
                        <div class="acc-img-box">
                            <img src="${item.img || 'Images/microchip.png'}" alt="${item.name}">
                        </div>
                        <div class="acc-info">
                            <div class="acc-title">${item.name}</div>
                            <span class="acc-desc">${item.desc || item.category || ''}</span>
                            <div class="acc-status available"><span class="dot green"></span> Available</div>
                        </div>
                    </a>
                `;}).join('') + `</div>`;

        case 'feature-list':
            return heading + `<div class="nar-feature-list">` +
                featured.items.map(item => `
                    <div class="nar-feature-item">${item}</div>
                `).join('') + `</div>`;

        case 'service-grid':
            return heading + `<div class="accessories-grid">` +
                featured.items.map(item => {
                    const link = EQUIPMENT_LINKS[item.name] || 'Book_Equipment.html';
                    return `
                    <a href="${link}" class="acc-card">
                        <div class="acc-img-box">
                            <img src="${item.img || 'Images/microchip.png'}" alt="${item.name}">
                        </div>
                        <div class="acc-info">
                            <div class="acc-title">${item.name}</div>
                            <div class="acc-status available"><span class="dot green"></span> Available</div>
                        </div>
                    </a>`;
                }).join('') + `</div>`;

        case 'progress':
            return heading + `<div class="nar-progress">` +
                featured.items.map(item => `
                    <div class="nar-progress-item nar-progress-item--${item.status}">
                        <div class="nar-progress-item__icon">${item.icon}</div>
                        <div>
                            <p class="nar-progress-item__label">${item.label}</p>
                            <p class="nar-progress-item__detail">${item.detail}</p>
                        </div>
                        <span class="nar-progress-item__status">${item.statusLabel}</span>
                    </div>
                `).join('') + `</div>`;

        case 'spec-table':
            return heading + `<table class="nar-spec-table">` +
                featured.rows.map(row => `
                    <tr>
                        <td>${row.label}</td>
                        <td>${row.val}</td>
                    </tr>
                `).join('') + `</table>`;

        default:
            return '';
    }
};

/* Wire the static grid markup to the richer reader experience once the page shell is available. */

document.addEventListener('DOMContentLoaded', () => {

    const newsFiltering = window.NewsFiltering;
    if (!newsFiltering) return;

    const {
        buildNewsRadarItems,
        filterNewsCards,
        formatMonthLabel,
        getAvailableMonths
    } = newsFiltering;

    const heroSection     = document.getElementById('newsHeroSection');
    const filterSection   = document.getElementById('newsFilterSection');
    const gridSection     = document.getElementById('newsGridSection');
    const articleReader   = document.getElementById('newsArticleReader');
    const emptyState      = document.getElementById('newsEmptyState');
    const searchInput     = document.getElementById('newsSearch');
    const resetBtn        = document.getElementById('newsResetFilters');
    const resultsLabel    = document.getElementById('newsResultsLabel');
    const moreSection     = document.getElementById('newsMoreStories');
    const moreGrid        = document.getElementById('newsMoreGrid');
    const moreSummary     = document.getElementById('newsMoreSummary');
    const calendarTrigger = document.getElementById('newsCalendarTrigger');
    const calendarPopover = document.getElementById('newsCalendarPopover');
    const calendarLabel   = document.getElementById('newsCalendarLabel');
    const calendarYear    = document.getElementById('calendarYear');
    const calendarMonthGrid = document.getElementById('calendarMonthGrid');
    const calendarPrevYear  = document.getElementById('calendarPrevYear');
    const calendarNextYear  = document.getElementById('calendarNextYear');
    const calendarClear     = document.getElementById('calendarClear');
    const calendarScrim     = document.getElementById('newsCalendarScrim');
    const filterBtns     = Array.from(document.querySelectorAll('.news-filter-btn[data-tag]'));
    const gridCards      = Array.from(document.querySelectorAll('#newsGrid .news-card'));
    const availableMonths = getAvailableMonths(ARTICLES);
    const cardModels = gridCards.map(card => ({
        element: card,
        id: card.dataset.articleId || '',
        tags: card.dataset.tags || '',
        text: [
            card.querySelector('.news-card__title')?.textContent || '',
            card.querySelector('.news-card__excerpt')?.textContent || '',
            Array.from(card.querySelectorAll('.news-card__hashtag')).map(node => node.textContent || '').join(' ')
        ].join(' '),
        date: card.querySelector('.news-card__timestamp')?.dataset.date || ''
    }));

    let activeTag         = 'all';
    let activeMonth       = '';
    let searchQuery       = '';
    let currentArticleIdx = -1;

    /* Convert absolute publish dates into relative labels for the grid without mutating the source article data. */

    const renderTimestamps = () => {
        const now = new Date();
        document.querySelectorAll('#newsGrid .news-card__timestamp[data-date]').forEach(el => {
            const d     = new Date(el.dataset.date + 'T00:00:00');
            const days  = Math.floor((now - d) / 86400000);
            if (days === 0)      el.textContent = 'Today';
            else if (days === 1) el.textContent = 'Yesterday';
            else if (days <= 7)  el.textContent = `${days} days ago`;
            else el.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        });
    };

    const getActiveTagLabel = () => {
        const activeBtn = filterBtns.find(btn => btn.classList.contains('active'));
        return activeBtn ? activeBtn.textContent.trim() : 'All';
    };

    const updateResultsLabel = (visibleCount) => {
        if (!resultsLabel) return;

        const parts = [`Showing ${visibleCount} ${visibleCount === 1 ? 'story' : 'stories'}`];
        if (activeMonth) parts.push(formatMonthLabel(activeMonth));
        if (activeTag !== 'all') parts.push(getActiveTagLabel());
        if (searchQuery) parts.push(`Search: "${searchInput.value.trim()}"`);
        resultsLabel.textContent = parts.join(' | ');
    };

    const getRadarExcerpt = (article) => {
        const summary = article.sections?.[0]?.body || '';
        return summary.length > 168 ? `${summary.slice(0, 165).trimEnd()}...` : summary;
    };

    const bindArticleTriggers = (cards) => {
        cards.forEach(card => {
            if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

            const trigger = () => {
                const id = card.dataset.articleId;
                if (id) openArticle(id);
            };

            card.addEventListener('click', trigger);
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    trigger();
                }
            });
        });
    };

    /* ── Calendar picker ────────────────────────────────────────── */

    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const availableMonthSet = new Set(availableMonths.map(m => m.value));
    let calendarViewYear = new Date().getFullYear();

    const renderCalendarGrid = () => {
        if (!calendarMonthGrid || !calendarYear) return;
        calendarYear.textContent = calendarViewYear;

        calendarMonthGrid.innerHTML = MONTH_NAMES.map((name, i) => {
            const val = `${calendarViewYear}-${String(i + 1).padStart(2, '0')}`;
            const isAvailable = availableMonthSet.has(val);
            const isSelected = activeMonth === val;
            const cls = ['news-calendar-month'];
            if (isSelected) cls.push('is-selected');
            if (!isAvailable) cls.push('is-disabled');
            return `<button class="${cls.join(' ')}" type="button" data-month="${val}">${name}</button>`;
        }).join('');

        calendarMonthGrid.querySelectorAll('.news-calendar-month:not(.is-disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                activeMonth = btn.dataset.month;
                calendarLabel.textContent = formatMonthLabel(activeMonth);
                closeCalendar();
                applyFilters();
            });
        });
    };

    const isMobile = () => window.matchMedia('(max-width: 760px)').matches;

    const openCalendar = () => {
        calendarPopover.classList.add('is-open');
        calendarTrigger.classList.add('is-active');
        if (isMobile() && calendarScrim) calendarScrim.classList.add('is-visible');
        renderCalendarGrid();
    };

    const closeCalendar = () => {
        calendarPopover.classList.remove('is-open');
        calendarTrigger.classList.remove('is-active');
        if (calendarScrim) calendarScrim.classList.remove('is-visible');
    };

    if (calendarTrigger) {
        calendarTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            calendarPopover.classList.contains('is-open') ? closeCalendar() : openCalendar();
        });
    }

    if (calendarPrevYear) calendarPrevYear.addEventListener('click', (e) => { e.stopPropagation(); calendarViewYear--; renderCalendarGrid(); });
    if (calendarNextYear) calendarNextYear.addEventListener('click', (e) => { e.stopPropagation(); calendarViewYear++; renderCalendarGrid(); });
    if (calendarClear) calendarClear.addEventListener('click', (e) => {
        e.stopPropagation();
        activeMonth = '';
        calendarLabel.textContent = 'Any date';
        closeCalendar();
        applyFilters();
    });

    document.addEventListener('click', (e) => {
        if (calendarPopover && !calendarPopover.contains(e.target) && !calendarTrigger.contains(e.target)) {
            closeCalendar();
        }
    });

    if (calendarScrim) calendarScrim.addEventListener('click', closeCalendar);

    /* ── More Stories (bottom suggestion bar) ──────────────────── */

    const renderMoreStories = (visibleArticleIds) => {
        if (!moreSection || !moreGrid) return;

        if (!visibleArticleIds.length) {
            moreSection.style.display = 'none';
            moreGrid.innerHTML = '';
            return;
        }

        const moreItems = buildNewsRadarItems(ARTICLES, { visibleArticleIds });

        if (!moreItems.length) {
            moreSection.style.display = 'none';
            return;
        }

        if (moreSummary) {
            moreSummary.textContent = 'Related stories from the MPaCT feed';
        }

        moreGrid.innerHTML = moreItems.map(article => `
            <div class="news-more-card" data-article-id="${article.id}" role="button" tabindex="0" aria-label="Read ${article.title}">
                <div class="news-more-card__icon">
                    <img src="${article.heroImage}" alt="${article.heroAlt}" loading="lazy">
                </div>
                <div class="news-more-card__body">
                    <span class="news-more-card__tag">${article.tagLabel}</span>
                    <p class="news-more-card__title">${article.title}</p>
                </div>
                <span class="news-more-card__arrow"><i class="fas fa-arrow-right"></i></span>
            </div>
        `).join('');

        moreSection.style.display = '';
        bindArticleTriggers(Array.from(moreGrid.querySelectorAll('.news-more-card')));
    };

    /* Filter against tag, search text, and month so the grid and the lower signal board stay synchronized. */

    const applyFilters = () => {
        const visibleCards = filterNewsCards(cardModels, {
            activeTag,
            activeMonth,
            searchQuery
        });
        const visibleIds = new Set(visibleCards.map(card => card.id));

        cardModels.forEach(card => {
            card.element.style.display = visibleIds.has(card.id) ? '' : 'none';
        });

        if (emptyState) emptyState.style.display = visibleCards.length === 0 ? 'block' : 'none';
        updateResultsLabel(visibleCards.length);
        renderMoreStories(visibleCards.map(card => card.id));
    };

    /* Opening an article swaps the grid for the reader while preserving enough state for prev/next navigation. */

    const openArticle = (id) => {
        const idx = ARTICLES.findIndex(a => a.id === id);
        if (idx === -1) return;
        currentArticleIdx = idx;

        populateArticleReader(ARTICLES[idx]);

        if (heroSection) heroSection.classList.add('is-hidden');
        gridSection.classList.add('is-hidden');
        filterSection.classList.add('is-hidden');

        setTimeout(() => {
            if (heroSection) heroSection.style.display = 'none';
            gridSection.style.display   = 'none';
            filterSection.style.display = 'none';
            articleReader.style.display = 'block';
            articleReader.offsetHeight; // Force layout so the visibility transition starts from the hidden state.
            articleReader.classList.add('is-visible');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    };

    const closeArticle = () => {
        articleReader.classList.remove('is-visible');
        setTimeout(() => {
            articleReader.style.display = 'none';
            articleReader.innerHTML     = '';
            currentArticleIdx           = -1;

            if (heroSection) heroSection.style.display = '';
            gridSection.style.display   = '';
            filterSection.style.display = '';
            if (heroSection) heroSection.offsetHeight; // Force layout before restoring the hero so the entry animation can run.
            gridSection.offsetHeight;   // Force layout before restoring the grid so the re-entry animation actually runs.
            if (heroSection) heroSection.classList.remove('is-hidden');
            gridSection.classList.remove('is-hidden');
            filterSection.classList.remove('is-hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 320);
    };

    /* Build the reader view from structured article data so long-form content stays centralized in one place. */

    const populateArticleReader = (article) => {
        const idx           = ARTICLES.findIndex(a => a.id === article.id);
        const hasPrev       = idx > 0;
        const hasNext       = idx < ARTICLES.length - 1;
        const formattedDate = new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });

        const statsHTML = article.stats.map(s => `
            <div class="nar-stat-box">
                <span class="nar-stat-box__value">${s.value}</span>
                <span class="nar-stat-box__label">${s.label}</span>
            </div>
        `).join('');

        const bodyHTML = article.sections.map(s => `
            <h3 class="nar-section-heading">${s.heading}</h3>
            <p>${s.body}</p>
        `).join('');

        const featuredHTML = renderFeatured(article.featured);

        const ctaHTML = article.cta ? `
            <div class="nar-cta-section">
                <p class="nar-cta-section__text">${article.cta.text}</p>
                <a href="${article.cta.href}" class="nar-cta-btn">${article.cta.label} &rarr;</a>
            </div>
        ` : '';

        const galleryClass = article.galleryLayout === 'three-up' ? ' nar-gallery--three-up' : '';
        const galleryHTML = Array.isArray(article.gallery) && article.gallery.length ? `
            <div class="nar-gallery${galleryClass}">
                ${article.gallery.map(img => `
                    <div class="nar-gallery__item">
                        <img class="nar-gallery__img" src="${img.src}" alt="${img.alt}" loading="lazy">
                        <p class="nar-gallery__caption">${img.caption}</p>
                    </div>
                `).join('')}
            </div>
        ` : '';

        // Use adjacent articles as lightweight recommendations. This keeps the logic deterministic and avoids a second ranking layer.
        const others = [];
        for (let i = 1; others.length < 2; i++) {
            const next = ARTICLES[(idx + i) % ARTICLES.length];
            if (next && next.id !== article.id) others.push(next);
            if (i > ARTICLES.length) break;
        }

        const exploreHTML = others.map(a => `
            <div class="nar-mini-card" data-article-id="${a.id}" role="button" tabindex="0" aria-label="Read: ${a.title}">
                <img class="nar-mini-card__thumb" src="${a.heroImage}" alt="${a.heroAlt}" loading="lazy">
                <div class="nar-mini-card__body">
                    <span class="nar-mini-card__tag">${a.tagLabel}</span>
                    <p class="nar-mini-card__title">${a.title}</p>
                </div>
            </div>
        `).join('');

        articleReader.innerHTML = `
            <div class="nar-back-bar">
                <div class="container nar-back-bar__inner">
                    <button class="nar-back-btn" id="narBackBtn">All News</button>
                    <div class="nar-article-nav">
                        <button class="nar-nav-btn" id="narPrevBtn" ${!hasPrev ? 'disabled' : ''}>&#8592; Prev</button>
                        <span class="nar-nav-counter">${idx + 1} / ${ARTICLES.length}</span>
                        <button class="nar-nav-btn" id="narNextBtn" ${!hasNext ? 'disabled' : ''}>Next &#8594;</button>
                    </div>
                </div>
            </div>

            <div class="nar-hero">
                <img class="nar-hero__img" src="${article.heroImage}" alt="${article.heroAlt}">
                <div class="nar-hero__overlay"></div>
                <div class="nar-hero__meta">
                    <span class="nar-hero__category">${article.tagLabel}</span>
                    <span class="nar-hero__dot">&#9679;</span>
                    <span class="nar-hero__date">${formattedDate}</span>
                    <span class="nar-hero__dot">&#9679;</span>
                    <span class="nar-hero__readtime">${article.readTime}</span>
                </div>
            </div>

            <div class="nar-content">
                <h1 class="nar-title">${article.title}</h1>

                <div class="nar-stats">
                    ${statsHTML}
                </div>

                <div class="nar-body">
                    ${bodyHTML}
                    ${featuredHTML}
                </div>

                ${ctaHTML}

                ${galleryHTML}
            </div>

            <div class="nar-explore">
                <div class="nar-explore__inner">
                    <h2 class="nar-explore__heading">More Articles</h2>
                    <div class="nar-explore__grid">
                        ${exploreHTML}
                    </div>
                </div>
            </div>
        `;

        // Reader controls are rebound after every render because the container markup is replaced wholesale.
        document.getElementById('narBackBtn').addEventListener('click', closeArticle);

        // Prev/next updates the active index first, then rerenders from the source article array.
        const prevBtn = document.getElementById('narPrevBtn');
        const nextBtn = document.getElementById('narNextBtn');
        if (prevBtn && hasPrev) {
            prevBtn.addEventListener('click', () => {
                currentArticleIdx--;
                populateArticleReader(ARTICLES[currentArticleIdx]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        if (nextBtn && hasNext) {
            nextBtn.addEventListener('click', () => {
                currentArticleIdx++;
                populateArticleReader(ARTICLES[currentArticleIdx]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Recommendation cards share the same open path and remain keyboard accessible.
        articleReader.querySelectorAll('.nar-mini-card').forEach(card => {
            const go = () => {
                const next = ARTICLES.find(a => a.id === card.dataset.articleId);
                if (!next) return;
                currentArticleIdx = ARTICLES.indexOf(next);
                populateArticleReader(next);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            card.addEventListener('click', go);
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
            });
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
            activeTag = btn.dataset.tag.toLowerCase();
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            applyFilters();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activeTag = 'all';
            activeMonth = '';
            searchQuery = '';

            filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tag === 'all'));
            if (searchInput) searchInput.value = '';
            if (calendarLabel) calendarLabel.textContent = 'Any date';
            closeCalendar();

            applyFilters();
        });
    }

    /* Grid cards map click and keyboard activation to the same article-open path for consistent behavior. */

    bindArticleTriggers(gridCards);

    /* Initialize derived UI state after the static markup is in place. */
    renderTimestamps();
    applyFilters();

});
