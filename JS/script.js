/**
 * Core Application Logic
 * Handles interactive elements: slider, sticky header navigation, mobile menu, and scroll animations.
 * * Architecture Note:
 * Logic is encapsulated within 'DOMContentLoaded' to ensure DOM readiness.
 * IntersectionObservers are used for performance-critical scroll effects instead of scroll event listeners where possible.
 */

/**
 * Horizontal scroll handler for equipment cards.
 * Uses native smooth scroll API for better performance than custom animation loops.
 * @param {number} amount - Pixel value to scroll (positive=right, negative=left)
 */
function scrollGrid(amount) {
    const container = document.getElementById('cardContainer');
    if (container) {
        container.scrollBy({ left: amount, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // Sticky Header Logic
    // Toggles 'scrolled' class based on scroll position for glassmorphism effect.
    // -------------------------------------------------------------------------
    const header = document.getElementById('mainHeader');
    let lastHeaderHeight = 0;

    const syncStickyOffsets = () => {
        const activeHeader = document.getElementById('mainHeader');
        if (!activeHeader) return;

        const measuredHeight = Math.round(activeHeader.getBoundingClientRect().height);
        if (Math.abs(measuredHeight - lastHeaderHeight) >= 1) {
            document.documentElement.style.setProperty('--site-header-height', `${measuredHeight}px`);
            lastHeaderHeight = measuredHeight;
        }
    };

    if (header) {
        let isHeaderCompact = false;

        const updateHeaderState = () => {
            const shouldCompact = window.scrollY > 50;
            if (shouldCompact !== isHeaderCompact) {
                header.classList.toggle('scrolled', shouldCompact);
                isHeaderCompact = shouldCompact;
                // Recalculate sticky offsets after the CSS transition finishes (0.3s)
                setTimeout(syncStickyOffsets, 350);
            }
            // NOTE: syncStickyOffsets intentionally NOT called on every scroll tick here.
            // Calling getBoundingClientRect() on every scroll event causes
            // layout thrashing. The CSS variable is only updated on load/resize/transition end.
        };

        updateHeaderState();
        syncStickyOffsets(); // Measure once after initial state is set
        window.addEventListener('scroll', updateHeaderState, { passive: true });
        window.addEventListener('resize', syncStickyOffsets, { passive: true });
        window.setTimeout(syncStickyOffsets, 120);
    }

    // Featured Equipment Carousel (Homepage)
    // Connects the Left/Right arrows to the scroll logic
    // -------------------------------------------------------------------------
    const carouselLeft = document.querySelector('.nav-btn.left');
    const carouselRight = document.querySelector('.nav-btn.right');

    if (carouselLeft && carouselRight) {
        carouselLeft.addEventListener('click', () => {
            scrollGrid(-350); // Scroll Left
        });

        carouselRight.addEventListener('click', () => {
            scrollGrid(350); // Scroll Right
        });
    }

    // Integrated Education Paths - 3x3 Grid Navigation
    // -------------------------------------------------------------------------
    const eduNavLeft = document.getElementById('eduNavLeft');
    const eduNavRight = document.getElementById('eduNavRight');
    const eduCardsGrid = document.getElementById('eduCardsGrid');
    const eduDotsContainer = document.getElementById('eduDots');

    if (eduNavLeft && eduNavRight && eduCardsGrid && eduDotsContainer) {
        let currentPage = 0;
        let totalPages = 3;

        function getCardsPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function updatePagination() {
            const cardsPerView = getCardsPerView();
            totalPages = Math.ceil(7 / cardsPerView); // 7 cards total

            // Generate dots
            eduDotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.className = `edu-dot ${i === currentPage ? 'active' : ''}`;
                dot.dataset.index = i;
                dot.addEventListener('click', () => updateEduPage(i));
                eduDotsContainer.appendChild(dot);
            }

            // Validate currentPage
            if (currentPage >= totalPages) {
                updateEduPage(totalPages - 1);
            } else {
                updateEduPage(currentPage);
            }
        }

        function updateEduPage(page) {
            currentPage = page;

            // Slide the grid
            const translateX = -(page * 100);
            eduCardsGrid.style.transform = `translateX(${translateX}%)`;

            // Update pagination dots active state
            const dots = eduDotsContainer.querySelectorAll('.edu-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === page);
            });

            // Update button states
            eduNavLeft.disabled = page === 0;
            eduNavRight.disabled = page === totalPages - 1;
        }

        eduNavLeft.addEventListener('click', () => {
            if (currentPage > 0) updateEduPage(currentPage - 1);
        });

        eduNavRight.addEventListener('click', () => {
            if (currentPage < totalPages - 1) updateEduPage(currentPage + 1);
        });

        // Resize listener
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updatePagination, 100);
        });

        // Initialize
        updatePagination();
    }

    // -------------------------------------------------------------------------
    // Scroll Animation Observer (Progressive Enhancement)
    // Handles both new '.reveal-on-scroll' and legacy '.card' animations.
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const legacyElements = document.querySelectorAll('.card, .metric-box');

    if ('IntersectionObserver' in window) {
        const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    if (target.classList.contains('reveal-on-scroll')) {
                        target.classList.add('revealed');
                    } else {
                        target.classList.add('fade-in');
                    }
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        // New System
        revealElements.forEach(el => observer.observe(el));

        // Legacy System (apply loose opacity0 only if not using new class)
        legacyElements.forEach(el => {
            if (!el.classList.contains('reveal-on-scroll')) {
                el.style.opacity = '0';
                observer.observe(el);
            }
        });
    } else {
        // Fallback
        revealElements.forEach(el => el.classList.add('revealed'));
        legacyElements.forEach(el => el.style.opacity = '1');
    }

    // -------------------------------------------------------------------------
    // Animated Statistics Counter
    // -------------------------------------------------------------------------
    const stats = document.querySelectorAll('.metric-value');
    if (stats.length > 0) {
        const animateValue = (obj, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // EaseOutExpo effect
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                let value = Math.floor(easeProgress * (end - start) + start);

                if (obj.dataset.suffix) value += obj.dataset.suffix;
                if (obj.dataset.prefix) value = obj.dataset.prefix + value;

                obj.innerHTML = value;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const rawText = target.innerText;
                    let prefix = rawText.includes('$') ? '$' : '';
                    let suffix = rawText.includes('%') ? '%' : (rawText.includes('+') ? '+' : '');
                    let endValue = parseInt(rawText.replace(/[^0-9]/g, ''));

                    if (!isNaN(endValue)) {
                        target.dataset.prefix = prefix;
                        target.dataset.suffix = suffix;
                        animateValue(target, 0, endValue, 2000);
                    }
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    // -------------------------------------------------------------------------
    // About Page Reserve Tool Button State
    // -------------------------------------------------------------------------
    const updateReserveButtonState = () => {
        const isProductPage = document.querySelector('.product-page');
        if (!isProductPage) return;

        const reserveBtn = document.querySelector('.hero-cta .btn.btn-primary');
        if (!reserveBtn) return;

        const statusTag = document.querySelector('.hero-badges .status-tag');
        const statusDot = document.querySelector('.status-indicator-wrapper .status-dot');

        const isAvailable = statusTag
            ? statusTag.classList.contains('available')
            : (statusDot ? statusDot.classList.contains('available') : false);
        const storedLabel = reserveBtn.dataset.availableLabel;
        if (!storedLabel) {
            reserveBtn.dataset.availableLabel = reserveBtn.innerHTML.trim();
        }

        if (!isAvailable) {
            reserveBtn.classList.add('disabled');
            reserveBtn.setAttribute('aria-disabled', 'true');
            reserveBtn.setAttribute('tabindex', '-1');
            if (reserveBtn.tagName.toLowerCase() === 'a') {
                reserveBtn.setAttribute('href', '#');
            }
            reserveBtn.innerHTML = '<i class="fas fa-ban" style="margin-right: 8px;"></i> Currently Unavailable';
        } else if (reserveBtn.dataset.availableLabel) {
            reserveBtn.classList.remove('disabled');
            reserveBtn.removeAttribute('aria-disabled');
            reserveBtn.removeAttribute('tabindex');
            if (reserveBtn.tagName.toLowerCase() === 'a') {
                const currentHref = reserveBtn.getAttribute('href') || '';
                if (!currentHref.includes('Reserve_Equipment.html')) {
                    reserveBtn.setAttribute('href', '../Reserve_Equipment.html');
                }
            }
            reserveBtn.innerHTML = reserveBtn.dataset.availableLabel;
        }
    };

    updateReserveButtonState();
    if (document.querySelector('.product-page')) {
        const badges = document.querySelector('.hero-badges');
        if (badges) {
            const observer = new MutationObserver(() => updateReserveButtonState());
            observer.observe(badges, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }
    }

});

/**
 * Contact Page Logic (Contact_Us.html)
 * Data structure and functions for dynamic form generation.
 * -------------------------------------------------------------------------
 */
const fieldData = {
    'equipment': {
        title: "Equipment Inquiry",
        desc: "Check availability or request specs for specific tools.",
        fields: `
            <div class="grid grid-2 gap-lg">
                <div>
                    <label class="block font-bold mb-1">Equipment Category</label>
                    <select id="equipmentCategory" name="equipment_category" class="form-control">
                        <option value="">-- All Categories --</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold mb-1 required">Equipment Name</label>
                    <select id="equipmentName" name="equipment_name" class="form-control" required>
                        <option value="">-- Select Tool --</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold mb-1">Intended Usage</label>
                    <select name="intended_usage" class="form-control">
                        <option>Self-Use (I need training)</option>
                        <option>Service (Staff runs samples)</option>
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="block font-bold mb-1 required">Experimental Details / Measurement Goals</label>
                    <textarea name="experimental_details" rows="3" class="form-control" placeholder="Describe sample type, size, and what you need to measure..." required></textarea>
                </div>
            </div>
        `
    },
    'research': {
        title: "Research & Strategic Partnerships",
        desc: "Propose a joint project, grant partnership, or industry collaboration.",
        fields: `
            <div class="form-stack">
                <div>
                    <label class="block font-bold mb-1 required">Project Title / Topic</label>
                    <input type="text" name="project_title" class="form-control" placeholder="e.g. Novel Dielectric Characterization" required>
                </div>
                <div class="grid grid-2 gap-lg">
                    <div>
                        <label class="block font-bold mb-1">Funding Agency</label>
                        <input type="text" name="funding_agency" class="form-control" placeholder="NSF, DOE, Industry...">
                    </div>
                    <div>
                        <label class="block font-bold mb-1">Timeline</label>
                        <select name="timeline" class="form-control">
                            <option>Short Term (< 3 months)</option>
                            <option>Mid Term (~6 months)</option>
                            <option>Long Term (1+ year)</option>
                            <option>Grant Proposal Phase</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block font-bold mb-1 required">Project Description / Abstract</label>
                    <textarea name="project_abstract" rows="5" class="form-control" placeholder="Provide a brief summary of the project goals..." required></textarea>
                </div>
            </div>
        `
    },
    'billing': {
        title: "Billing & Invoicing",
        desc: "Resolve payment issues or request quotes.",
        fields: `
            <div class="grid grid-2 gap-lg">
                <div>
                    <label class="block font-bold mb-1 required">Reference Number</label>
                    <input type="text" name="reference_number" class="form-control" placeholder="Invoice # or PO #" required>
                </div>
                <div>
                    <label class="block font-bold mb-1 required">Billing Contact Person</label>
                    <input type="text" name="billing_contact" class="form-control" required>
                </div>
                <div class="col-span-2">
                    <label class="block font-bold mb-1">Billing Address</label>
                    <textarea name="billing_address" rows="2" class="form-control" required></textarea>
                </div>
                <div class="col-span-2">
                    <label class="block font-bold mb-1">Issue Description</label>
                    <textarea name="issue_description" rows="3" class="form-control" placeholder="Describe the billing discrepancy or request..." required></textarea>
                </div>
            </div>
        `
    },
    'training': {
        title: "Safety & Training",
        desc: "Register for safety courses or equipment authorization.",
        fields: `
            <div class="grid grid-2 gap-lg">
                <div>
                    <label class="block font-bold mb-1 required">Request Type</label>
                    <select name="request_type" class="form-control" required>
                        <option>Safety Training (New User)</option>
                        <option>Tool Training</option>
                        <option>Outreach / Workshop</option>
                        <option>Group Demo</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold mb-1 required">Training Specifics</label>
                    <select name="training_specifics" class="form-control" required>
                        <option>EHS Basic Safety</option>
                        <option>Lab Gowning and Entry Protocol</option>
                        <option>Specific Tool (Describe below)</option>
                        <option>Custom Workshop</option>
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="block font-bold mb-1">Notes / Additional Details</label>
                    <textarea name="notes" rows="3" class="form-control" placeholder="Please specify tool names, group size, or workshop topics..." required></textarea>
                </div>
            </div>
        `
    },
    'courses': {
        title: "Course Support",
        desc: "Inquiries regarding lab classes or curriculum.",
        fields: `
            <div class="grid grid-2 gap-lg">
                <div>
                    <label class="block font-bold mb-1 required">Course Number</label>
                    <input type="text" name="course_number" class="form-control" placeholder="e.g. EE400" required>
                </div>
                <div>
                    <label class="block font-bold mb-1">Semester</label>
                    <select name="semester" class="form-control">
                        <option>Fall 2025</option>
                        <option>Spring 2026</option>
                        <option>Summer 2026</option>
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="block font-bold mb-1 required">Inquiry</label>
                    <textarea name="inquiry" rows="3" class="form-control" placeholder="Question about lab schedule, materials, or enrollment..."></textarea>
                </div>
            </div>
        `
    },
    'tour': {
        title: "Schedule a Tour",
        desc: "Visit the facility.",
        fields: `
            <div class="grid grid-2 gap-lg">
                <div>
                    <label class="block font-bold mb-1 required">Group Size</label>
                    <input type="number" name="group_size" class="form-control" placeholder="Approx number of people" required>
                </div>
                <div>
                    <label class="block font-bold mb-1 required">Group Type</label>
                    <select name="group_type" class="form-control" required>
                        <option>K-12 School</option>
                        <option>Prospective Students</option>
                        <option>Industry Partners</option>
                        <option>Academic Guests</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold mb-1 required">Preferred Date</label>
                    <input type="date" name="preferred_date" class="form-control" required>
                </div>
                <div>
                    <label class="block font-bold mb-1">Alternative Date</label>
                    <input type="date" name="alternative_date" class="form-control">
                </div>
                <div class="col-span-2">
                    <label class="block font-bold mb-1">Notes / Specific Interests</label>
                    <textarea name="notes" rows="3" class="form-control" placeholder="Any specific areas you'd like to see or topics to cover?"></textarea>
                </div>
            </div>
        `
    },
    'sales': {
        title: "Vendor / Sales",
        desc: "Product demonstrations and supply chain.",
        fields: `
            <div class="form-stack">
                <div>
                    <label class="block font-bold mb-1 required">Product Category</label>
                    <input type="text" name="product_category" class="form-control" placeholder="e.g. Chemicals, Metrology Equipment, PPE" required>
                </div>
                <div>
                    <label class="block font-bold mb-1 required">Message</label>
                    <textarea name="message" rows="4" class="form-control" placeholder="Describe your product or reason for contact..." required></textarea>
                </div>
            </div>
        `
    },
    'other': {
        title: "General Inquiry",
        desc: "How can we help you?",
        fields: `
            <div>
                <label class="block font-bold mb-1 required">Message</label>
                <textarea name="message" rows="5" class="form-control" placeholder="Please describe your question or issue..." required></textarea>
            </div>
        `
    },
    'issue': {
        title: "Report an Issue",
        desc: "Found a problem with equipment or facilities? Let us know.",
        fields: `
            <div class="grid grid-2 gap-lg">
                <div>
                    <label class="block font-bold mb-1 required">Issue Type</label>
                    <select name="issue_type" class="form-control">
                        <option>Equipment Malfunction</option>
                        <option>Facilities (Power, Water, HVAC)</option>
                        <option>Software / Network</option>
                        <option>Safety Concern</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold mb-1">Equipment Name (if applicable)</label>
                    <input type="text" name="equipment_name" class="form-control" placeholder="e.g. Zeiss SEM">
                </div>
                <div class="col-span-2">
                    <label class="block font-bold mb-1 required">Description</label>
                    <textarea name="description" rows="4" class="form-control" placeholder="Please describe the issue in detail..."></textarea>
                </div>
            </div>
        `
    }
};

// Helper function to populate equipment dropdowns
async function populateEquipmentData() {
    const categorySelect = document.getElementById('equipmentCategory');
    const equipmentSelect = document.getElementById('equipmentName');

    if (!categorySelect || !equipmentSelect) return;

    // If already populated, just return (or we could force refresh)
    if (categorySelect.getAttribute('data-loaded') === 'true') return;

    try {
        const response = await fetch('equipment.json');
        if (!response.ok) throw new Error('Failed to load equipment data');

        const data = await response.json();
        const equipmentList = data.equipment || [];

        // 1. Populate Categories
        const categories = [...new Set(equipmentList.map(item => item.category))].sort();

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });

        // 2. Define Filter Logic
        const filterEquipment = () => {
            const selectedCat = categorySelect.value;
            const currentVal = equipmentSelect.value;

            // Clear existing options
            equipmentSelect.innerHTML = '<option value="">-- Select Tool --</option>';

            // Filter list
            const filtered = selectedCat
                ? equipmentList.filter(item => item.category === selectedCat)
                : equipmentList;

            // Sort by name
            filtered.sort((a, b) => a.name.localeCompare(b.name));

            // Populate options
            filtered.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name;
                option.textContent = item.name;
                equipmentSelect.appendChild(option);
            });

            // Restore selection if possible, or reset
            // If category changed, likely reset.
        };

        // Initial populate (all equipment)
        filterEquipment();

        // Add Event Listener
        categorySelect.addEventListener('change', filterEquipment);

        // Mark as loaded
        categorySelect.setAttribute('data-loaded', 'true');

    } catch (error) {
        console.error('Error populating equipment:', error);
        const errOption = document.createElement('option');
        errOption.textContent = "Error loading equipment";
        categorySelect.appendChild(errOption);
    }
}

function selectCategory(category, element) {
    // Highlighting Logic
    document.querySelectorAll('.gateway-card').forEach(card => card.classList.remove('selected'));
    if (element) {
        element.classList.add('selected');
    }

    // Data Injection
    const data = fieldData[category];
    const formContainer = document.getElementById('formContainer');
    const dynamicFields = document.getElementById('dynamicFields');
    const formTitle = document.getElementById('formTitle');
    const formDesc = document.getElementById('formDesc');

    if (data) {
        formTitle.textContent = data.title;
        formDesc.textContent = data.desc;
        dynamicFields.innerHTML = data.fields;
        dynamicFields.className = 'fade-in';

        // Set hidden category input
        const categoryInput = document.getElementById('categoryInput');
        if (categoryInput) categoryInput.value = category;

        // Switching categories — drop any message left over from the old one.
        setContactFeedback('', '');

        // Dynamic Population for Equipment
        if (category === 'equipment') {
            populateEquipmentData();
        }

        // Apply validation rules to the newly injected dynamic fields AND the
        // whole form so common fields (name, email, org, phone) get hints too.
        // Safe to call repeatedly — each helper guards against double-wiring.
        applyContactFieldRules(document.getElementById('contactForm'));

        // Show Form
        formContainer.classList.remove('hidden');
        void formContainer.offsetWidth;
        formContainer.classList.add('fade-in');

        // Smooth Scroll
        setTimeout(() => {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

function resetSelection() {
    document.querySelectorAll('.gateway-card').forEach(card => card.classList.remove('selected'));
    document.getElementById('formContainer').classList.add('hidden');
    document.getElementById('formContainer').classList.remove('fade-in');
    document.getElementById('gatewayGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------------------------------------------------------------
// Contact form — client-side validation and live input helpers.
// Contact_Us.html uses novalidate, so every soft constraint you see
// on the page (phone masking, maxlength hints, word counters, number
// clamps, name-field character rules) is enforced here. Defaults are
// centralized below so dynamic fields from fieldData inherit them
// without each category template having to repeat min/max/maxlength.
// FormSubmission.php repeats these rules server-side so the wall is
// still there if JS is disabled or the endpoint is hit directly.
// ---------------------------------------------------------------
const CONTACT_FIELD_DEFAULTS = {
    textMaxLen:     150,
    emailMaxLen:    100,
    textareaMaxLen: 2500,
    wordLimit:      500,
    numberMin:      1,
    numberMax:      1000,
};

// Format a US phone number as (XXX) XXX-XXXX while the user types.
function contactFormatUsPhone(value, isDeleting) {
    const digits = (value || '').replace(/\D/g, '').slice(0, 10);
    if (!digits) return '';
    if (digits.length < 3) return `(${digits}`;
    if (digits.length === 3) return isDeleting ? `(${digits}` : `(${digits}) `;
    if (digits.length < 7)  return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Apply sensible min/max/maxlength defaults to every field inside `container`.
// Dynamic fields from fieldData rarely set these themselves; this keeps every
// category's inputs within reasonable bounds without editing each template.
function applyContactFieldRules(container) {
    if (!container) return;

    const today = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const minDate = fmt(today);
    const maxDate = fmt(new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()));

    container.querySelectorAll('input[type="text"]').forEach(el => {
        if (!el.hasAttribute('maxlength')) el.setAttribute('maxlength', CONTACT_FIELD_DEFAULTS.textMaxLen);
    });
    container.querySelectorAll('input[type="email"]').forEach(el => {
        if (!el.hasAttribute('maxlength')) el.setAttribute('maxlength', CONTACT_FIELD_DEFAULTS.emailMaxLen);
    });
    container.querySelectorAll('textarea').forEach(el => {
        if (!el.hasAttribute('maxlength'))      el.setAttribute('maxlength', CONTACT_FIELD_DEFAULTS.textareaMaxLen);
        if (!el.hasAttribute('data-max-words')) el.setAttribute('data-max-words', CONTACT_FIELD_DEFAULTS.wordLimit);
    });
    container.querySelectorAll('input[type="number"]').forEach(el => {
        if (!el.hasAttribute('min'))  el.setAttribute('min',  CONTACT_FIELD_DEFAULTS.numberMin);
        if (!el.hasAttribute('max'))  el.setAttribute('max',  CONTACT_FIELD_DEFAULTS.numberMax);
        if (!el.hasAttribute('step')) el.setAttribute('step', '1');
    });
    container.querySelectorAll('input[type="date"]').forEach(el => {
        el.min = minDate;
        el.max = maxDate;
    });

    attachContactNumberClamp(container);
    attachContactMaxLengthHints(container);
    attachContactWordCounters(container);
    attachContactPhoneFormat(container);
    attachContactNameOrgHints(container);
}

// Number inputs otherwise accept "e", "E", "+", scientific notation, and
// arbitrary decimals even when step="1". This blocks the junk keys, clamps
// the value to max while the user types, and clamps to min on blur so the
// number they see on screen is exactly the number that submits.
function attachContactNumberClamp(container) {
    container.querySelectorAll('input[type="number"]').forEach(el => {
        if (el._contactClampWired) return;
        el._contactClampWired = true;
        const min = el.hasAttribute('min') ? parseFloat(el.min) : null;
        const max = el.hasAttribute('max') ? parseFloat(el.max) : null;

        el.addEventListener('input', () => {
            const v = el.value.trim();
            if (v === '') return;
            const n = Number(v);
            if (isNaN(n)) return;
            if (max !== null && n > max) el.value = max;
        });
        el.addEventListener('blur', () => {
            const v = el.value.trim();
            if (v === '') return;
            const n = Number(v);
            if (isNaN(n)) { el.value = ''; return; }
            let clamped = n;
            if (min !== null && clamped < min) clamped = min;
            if (max !== null && clamped > max) clamped = max;
            el.value = clamped;
        });
        el.addEventListener('keydown', e => {
            if (['e', 'E', '+'].includes(e.key)) e.preventDefault();
            if (e.key === '-' && (!el.min || parseFloat(el.min) >= 0)) e.preventDefault();
            if (e.key === '.' && el.getAttribute('step') === '1') e.preventDefault();
        });
    });
}

// Show "N characters remaining" for text/email inputs with maxlength.
function attachContactMaxLengthHints(container) {
    container.querySelectorAll('input[maxlength]:not([type="tel"]):not([type="number"])').forEach(input => {
        if (input._contactHintWired) return;
        input._contactHintWired = true;
        const max = parseInt(input.maxLength, 10);
        const hint = document.createElement('span');
        hint.style.cssText = 'display:none; font-size:0.78rem; margin-top:3px;';
        input.parentNode.insertBefore(hint, input.nextSibling);
        input.addEventListener('input', () => {
            const remaining = max - input.value.length;
            if (remaining === 0) {
                hint.textContent = `Limit reached (${max} characters max)`;
                hint.style.color = 'var(--nau-red, #c0392b)';
                hint.style.fontWeight = '600';
                hint.style.display = 'block';
            } else if (remaining <= 5) {
                hint.textContent = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`;
                hint.style.color = 'var(--nau-gold, #e6a817)';
                hint.style.display = 'block';
            } else {
                hint.style.display = 'none';
            }
        });
    });
}

// Live word count for textareas with data-max-words.
function attachContactWordCounters(container) {
    container.querySelectorAll('textarea[data-max-words]').forEach(textarea => {
        if (textarea._contactCounterWired) return;
        textarea._contactCounterWired = true;
        const maxWords = parseInt(textarea.dataset.maxWords, 10);
        const counter = document.createElement('span');
        counter.style.cssText = 'display:block; text-align:right; font-size:0.78rem; margin-top:3px;';
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        const update = () => {
            const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
            const over = words > maxWords;
            const remaining = maxWords - words;
            if (over) {
                counter.textContent = `${words} / ${maxWords} words — ${Math.abs(remaining)} over limit`;
            } else if (remaining <= 50) {
                counter.textContent = `${words} / ${maxWords} words — ${remaining} remaining`;
            } else {
                counter.textContent = `${words} / ${maxWords} words`;
            }
            counter.style.color = over ? 'var(--nau-red, #c0392b)' : remaining <= 50 ? 'var(--nau-gold, #e6a817)' : 'var(--gray-500, #9ca3af)';
            counter.style.fontWeight = over ? '600' : '400';
        };
        textarea.addEventListener('input', update);
        update();
    });
}

function attachContactPhoneFormat(container) {
    container.querySelectorAll('input[data-phone-field], input[type="tel"]').forEach(input => {
        if (input._contactPhoneWired) return;
        input._contactPhoneWired = true;
        input.addEventListener('input', e => {
            const del = e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward';
            input.value = contactFormatUsPhone(input.value, del);
        });
        input.addEventListener('blur', () => {
            input.value = contactFormatUsPhone(input.value, false);
        });
    });
}

// Inline warnings near name/org fields: emoji + digits + mashing.
function attachContactNameOrgHints(container) {
    container.querySelectorAll('input[data-name-field]').forEach(input => {
        if (input._contactNameWired) return;
        input._contactNameWired = true;
        const hint = document.createElement('span');
        hint.style.cssText = 'display:none; font-size:0.78rem; color:var(--nau-red,#c0392b); margin-top:2px;';
        input.after(hint);
        input.addEventListener('input', () => {
            const v = input.value;
            if (/\p{Extended_Pictographic}/u.test(v)) {
                hint.textContent = 'Emoji are not allowed in name fields.';
                hint.style.display = 'block';
            } else if (/[0-9!@#$%^&*()\[\]{}|\\:;"<>,?\/~`+=]/.test(v)) {
                hint.textContent = 'Names should contain letters, spaces, hyphens, or apostrophes only.';
                hint.style.display = 'block';
            } else {
                hint.style.display = 'none';
            }
        });
    });
    container.querySelectorAll('input[data-org-field]').forEach(input => {
        if (input._contactOrgWired) return;
        input._contactOrgWired = true;
        const hint = document.createElement('span');
        hint.style.cssText = 'display:none; font-size:0.78rem; margin-top:2px;';
        input.after(hint);
        input.addEventListener('input', () => {
            const v = input.value;
            if (/\p{Extended_Pictographic}/u.test(v)) {
                hint.textContent = 'Emoji are not allowed in this field.';
                hint.style.color = 'var(--nau-red,#c0392b)';
                hint.style.display = 'block';
            } else if (/(.)\1{3,}/.test(v)) {
                hint.textContent = 'Please enter a valid organization name.';
                hint.style.color = 'var(--nau-gold,#e6a817)';
                hint.style.display = 'block';
            } else {
                hint.style.display = 'none';
            }
        });
    });
}

// Central submit-time validation. Returns array of { el, label } for invalid
// fields, outlining each with a red border for visual feedback.
function validateContactForm(form) {
    const invalid = [];
    const emojiRx = /\p{Extended_Pictographic}/u;
    const mashRx  = /(.)\1{3,}/;
    const nameRx  = /^[\p{L}\s'\-\.]+$/u;

    const labelOf = (el) => {
        const lbl = el.closest('label') ||
                    (el.id ? form.querySelector(`label[for="${el.id}"]`) : null) ||
                    el.parentElement?.querySelector('label');
        if (lbl) {
            const clone = lbl.cloneNode(true);
            clone.querySelectorAll('input,select,textarea,span').forEach(n => n.remove());
            const t = clone.textContent.trim();
            if (t) return t;
        }
        return el.name || el.id || 'Field';
    };

    const markInvalid = (el, reason) => {
        el.style.outline = '2px solid var(--nau-red, #c0392b)';
        el.style.outlineOffset = '2px';
        el.addEventListener('input',  () => { el.style.outline = ''; el.style.outlineOffset = ''; }, { once: true });
        el.addEventListener('change', () => { el.style.outline = ''; el.style.outlineOffset = ''; }, { once: true });
        invalid.push({ el, label: reason ? `${labelOf(el)} (${reason})` : labelOf(el) });
    };

    // Required fields
    form.querySelectorAll('[required]').forEach(el => {
        if (el.offsetParent === null && el.type !== 'hidden') return; // skip hidden
        const v = (el.value || '').trim();
        if (!v) { markInvalid(el); return; }
        if (el.validity && !el.validity.valid) { markInvalid(el); return; }
    });

    // Email format (even if not required)
    form.querySelectorAll('input[type="email"]').forEach(el => {
        const v = (el.value || '').trim();
        if (!v) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) markInvalid(el, 'invalid email');
    });

    // Name fields
    form.querySelectorAll('input[data-name-field]').forEach(el => {
        const v = (el.value || '').trim();
        if (!v) return;
        if (emojiRx.test(v))       markInvalid(el, 'remove emoji');
        else if (!nameRx.test(v))  markInvalid(el, 'letters, spaces, hyphens, apostrophes only');
    });

    // Emoji + mashing on all other text inputs + textareas
    form.querySelectorAll('input[type="text"]:not([data-name-field]):not([readonly]), textarea').forEach(el => {
        const v = (el.value || '').trim();
        if (!v) return;
        if (invalid.find(f => f.el === el)) return;
        if (emojiRx.test(v)) markInvalid(el, 'remove emoji');
        else if (mashRx.test(v)) markInvalid(el, 'remove repeated characters');
    });

    // Word limits
    form.querySelectorAll('textarea[data-max-words]').forEach(el => {
        const v = (el.value || '').trim();
        if (!v) return;
        if (invalid.find(f => f.el === el)) return;
        const maxW = parseInt(el.dataset.maxWords, 10);
        const wc = v.split(/\s+/).length;
        if (wc > maxW) markInvalid(el, `over ${maxW}-word limit`);
    });

    // Numeric ranges
    form.querySelectorAll('input[type="number"]').forEach(el => {
        const v = (el.value || '').trim();
        if (!v) return;
        if (invalid.find(f => f.el === el)) return;
        const n = Number(v);
        if (isNaN(n)) { markInvalid(el, 'must be a number'); return; }
        if (n < 0) { markInvalid(el, 'cannot be negative'); return; }
        const min = el.hasAttribute('min') ? parseFloat(el.min) : null;
        const max = el.hasAttribute('max') ? parseFloat(el.max) : null;
        if (min !== null && n < min) markInvalid(el, `must be at least ${min}`);
        else if (max !== null && n > max) markInvalid(el, `must be ${max} or less`);
    });

    return invalid;
}

// Single source of truth for how the contact-form feedback strip shows
// and hides messages. Every call clears the previous timer first so a
// stale success can't swallow a fresh error, and every message schedules
// its own auto-hide — errors at 8 s, success at 10 s. Passing html=''
// just tears the strip down.
function setContactFeedback(html, kind) {
    const el = document.getElementById('formFeedback');
    if (!el) return;
    clearTimeout(el._feedbackTimer);
    if (!html) {
        el.style.display = 'none';
        el.className = 'bk-feedback';
        el.innerHTML = '';
        return;
    }
    el.innerHTML = html;
    el.className = 'bk-feedback bk-feedback--' + kind;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    el._feedbackTimer = setTimeout(() => {
        el.style.display = 'none';
        el.className = 'bk-feedback';
        el.innerHTML = '';
    }, kind === 'success' ? 10000 : 8000);
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    // Re-validating from a clean slate — drop any red outlines left behind
    // by a previous failed attempt before we decide what's wrong this time.
    form.querySelectorAll('[style*="outline"]').forEach(el => {
        el.style.outline = '';
        el.style.outlineOffset = '';
    });

    const invalid = validateContactForm(form);
    if (invalid.length > 0) {
        const names = invalid.map(f => f.label).join(', ');
        setContactFeedback(
            `<strong>${invalid.length} field${invalid.length > 1 ? 's need' : ' needs'} attention:</strong> ${names}.`,
            'error'
        );
        invalid[0].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    setContactFeedback('', '');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        const response = await fetch('FormSubmission.php', {
            method: 'POST',
            body: new FormData(form),
        });
        const result = await response.json();

        if (result.success) {
            setContactFeedback(result.message || 'Your message was sent.', 'success');
            form.reset();
            // Return the page to the gateway view after the success toast
            // has had enough time to be read.
            setTimeout(resetSelection, 5000);
        } else {
            setContactFeedback(result.message || 'An error occurred. Please try again.', 'error');
        }
    } catch (err) {
        setContactFeedback('Unable to connect to the server. Please try again later or email us directly.', 'error');
        console.error('Form submission error:', err);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
    }
}

// Global Exports
window.fieldData = fieldData;
window.selectCategory = selectCategory;
window.resetSelection = resetSelection;
window.handleFormSubmit = handleFormSubmit;

// Auto-select Contact Us category from URL parameter (e.g., ?category=research)
document.addEventListener('DOMContentLoaded', () => {
    // Apply validators to the static common fields on load. selectCategory()
    // will re-apply after dynamic fields are injected.
    const contactFormEl = document.getElementById('contactForm');
    if (contactFormEl) applyContactFieldRules(contactFormEl);

    const urlParams = new URLSearchParams(window.location.search);
    const autoCategory = urlParams.get('category');
    if (autoCategory && typeof fieldData !== 'undefined' && fieldData[autoCategory]) {
        const targetCard = document.querySelector(`.gateway-card[onclick*="'${autoCategory}'"]`);
        // Pass targetCard if found, otherwise null (valid for hidden categories like 'issue')
        selectCategory(autoCategory, targetCard);
    }
});


// -------------------------------------------------------------------------
// EQUIPMENT CATALOG LOGIC
// Handles Grid/List toggle and Category Filtering
// -------------------------------------------------------------------------
const container = document.getElementById('equipmentContainer');
const gridBtn = document.getElementById('gridViewBtn');
const listBtn = document.getElementById('listViewBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const locationBtns = document.querySelectorAll('.location-btn');
const cards = document.querySelectorAll('.tech-card');
const searchInput = document.getElementById('searchInput');

const getCardTitle = (card) => {
    const titleEl = card.querySelector('.tech-title');
    return titleEl ? titleEl.textContent.trim() : '';
};

const normalizeTerm = (value) => (value || '').toLowerCase().trim();

const buildSearchSuggestions = () => {
    if (!searchInput || cards.length === 0) return;

    const listId = 'equipmentSearchList';
    let dataList = document.getElementById(listId);
    if (!dataList) {
        dataList = document.createElement('datalist');
        dataList.id = listId;
        document.body.appendChild(dataList);
    }

    searchInput.setAttribute('list', listId);
    dataList.innerHTML = '';

    const names = Array.from(cards)
        .map((card) => getCardTitle(card))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

    names.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        dataList.appendChild(option);
    });
};

// 1. VIEW SWITCHER (Grid vs List)
if (container && gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => {
        container.classList.remove('list-layout');
        container.classList.add('grid-layout');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });

    listBtn.addEventListener('click', () => {
        container.classList.remove('grid-layout');
        container.classList.add('list-layout');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
}

// 2. FILTERING LOGIC (Category + Location)
const getActiveCategory = () => {
    const active = document.querySelector('.category-btn.active');
    return active ? active.getAttribute('data-filter') : 'all';
};

const getActiveLocation = () => {
    const active = document.querySelector('.location-btn.active');
    return active ? active.getAttribute('data-location') : 'all';
};

const matchesLocation = (card, locationFilter) => {
    if (locationFilter === 'all') return true;
    // Default to Flagstaff if not specified
    const raw = card.getAttribute('data-location') || 'Flagstaff';
    const locations = raw.split(',').map(loc => loc.trim().toLowerCase());
    return locations.includes(locationFilter.toLowerCase());
};

const applyFilters = () => {
    const activeCategory = getActiveCategory();
    const activeLocation = getActiveLocation();
    const term = normalizeTerm(searchInput ? searchInput.value : '');

    cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const categoryMatch = activeCategory === 'all' || category === activeCategory;
        const locationMatch = matchesLocation(card, activeLocation);
        const title = normalizeTerm(getCardTitle(card));
        const matchesSearch = !term || title.includes(term);

        if (categoryMatch && locationMatch && matchesSearch) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
};

if (categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });
}

if (locationBtns.length > 0) {
    locationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            locationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });
}

if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

buildSearchSuggestions();
applyFilters();
