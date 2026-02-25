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

        const statusDot = document.querySelector('.status-indicator-wrapper .status-dot');
        const reserveBtn = document.querySelector('.hero-cta .btn.btn-primary');
        if (!statusDot || !reserveBtn) return;

        const isAvailable = statusDot.classList.contains('available');
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
            reserveBtn.innerHTML = reserveBtn.dataset.availableLabel;
        }
    };

    updateReserveButtonState();

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
                        <option>Cleanroom Gowning</option>
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

        // Clear any previous feedback
        const feedback = document.getElementById('formFeedback');
        if (feedback) { feedback.classList.add('hidden'); feedback.textContent = ''; }

        // Dynamic Population for Equipment
        if (category === 'equipment') {
            populateEquipmentData();
        }

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

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');
    const formData = new FormData(form);

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    feedback.classList.add('hidden');

    try {
        const response = await fetch('FormSubmission.php', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();

        feedback.classList.remove('hidden');
        if (result.success) {
            feedback.style.cssText = 'padding:14px 18px;border-radius:8px;background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7;font-weight:600;';
            feedback.textContent = result.message;
            form.reset();
            // Scroll to feedback
            setTimeout(() => {
                feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
            // Auto-reset after 5 seconds
            setTimeout(() => {
                resetSelection();
            }, 5000);
        } else {
            feedback.style.cssText = 'padding:14px 18px;border-radius:8px;background:#ffebee;color:#c62828;border:1px solid #ef9a9a;font-weight:600;';
            feedback.textContent = result.message || 'An error occurred. Please try again.';
        }
    } catch (err) {
        feedback.classList.remove('hidden');
        feedback.style.cssText = 'padding:14px 18px;border-radius:8px;background:#ffebee;color:#c62828;border:1px solid #ef9a9a;font-weight:600;';
        feedback.textContent = 'Unable to connect to the server. Please try again later or email us directly.';
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

// -------------------------------------------------------------------------
// Hero Divider: Re-trigger animations on bfcache restore
// The iMPaCT brand elements (.hd-i, .hd-mpact-mask) start at opacity:0
// and use one-shot 'forwards' animations to appear. On back/forward
// navigation the browser may restore from bfcache without replaying
// those animations, leaving the divider invisible.
// -------------------------------------------------------------------------
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const animatedEls = document.querySelectorAll('.hd-i, .hd-mpact-mask');
        animatedEls.forEach(el => {
            const saved = el.style.animation;
            el.style.animation = 'none';
            // Force reflow so the browser acknowledges the reset
            void el.offsetWidth;
            el.style.animation = saved || '';
        });
    }
});
