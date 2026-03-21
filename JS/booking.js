/* booking.js drives the Book Equipment page. It loads equipment data,
   swaps in category-specific fields, switches between standard and
   educational flows, calculates estimated cost, validates visible fields,
   and submits the form. */

(function () {
    'use strict';

    // Static data used to build the form and pricing states.

    // These IDs use the course-request flow instead of the standard booking flow.
    const EDUCATIONAL_IDS = ['EQ-001', 'EQ-002', 'EQ-003', 'EQ-004', 'EQ-025', 'EQ-040'];

    // Show accessory availability on the info card for equipment that supports add-ons.
    const ACCESSORIES = {
        'EQ-006': ['3D Scanner'],
        'EQ-020': ['LPKF MultiPress S', 'LPKF Electroplater', 'LPKF Pick & Place', 'LPKF Reflow Oven', 'Wave Solder'],
        'EQ-037': ['Backscattered Detector', 'Electron Biprism'],
    };

    // Material warnings appear when an equipment choice has known restrictions.
    const MATERIAL_WARNINGS = {
        'EQ-012': 'Haas Desktop Lathe: Soft materials only (brass, plastics, wax). Hard metals and steel are strictly prohibited.',
        'EQ-013': 'Haas Desktop Mill: Plastics and wax only. No aluminum, steel, or hardened materials.',
    };

    // Only these machines show the optional cryogenic cooling control.
    const CRYO_EQUIPMENT = ['EQ-036'];

    // Rate data is loaded at runtime from rates.json — do not hardcode rates here.

    // Converts the duration select values into billable hours.
    const DURATION_HOURS = {
        '30min':     0.5,
        '1hr':       1,
        '2hr':       2,
        '4hr':       4,
        'full_day':  8,
        'multi_day': null, // cannot calculate — show note
    };

    // Optional operating-mode checkboxes shown for supported instruments.
    const OPERATING_MODES = {
        // ---- Metrology ----
        'EQ-005': ['Contact Mode', 'Tapping Mode', 'Force Spectroscopy', 'Phase Imaging'],
        'EQ-007': ['Vacuum Degassing', 'Flow Degassing', 'Bake-Out Pretreatment', 'Multi-Port Batch Processing'],
        'EQ-008': ['BET Surface Area', 'Adsorption Isotherm', 'Micro / Mesopore Analysis', 'Vapor Sorption'],
        'EQ-010': ['Spectroscopic Scan', 'Variable-Angle Measurement', 'Mapping Mode', 'In-Situ Monitoring'],
        'EQ-011': ['Gauge Calibration', 'Differential Calibration', 'Transducer Verification', 'Linearity Check'],
        'EQ-015': ['High-Magnification Imaging', 'Wide-Area Inspection', 'Measurement & Analysis', 'Documentation / Report'],
        'EQ-016': ['Laser Confocal', 'Focus Variation', 'White-Light Interferometry', 'Spectral Interference'],
        'EQ-017': ['Touch Probing', '3D Laser Scanning', 'Comparative Measurement', 'GD&T Analysis'],
        'EQ-026': ['Steady-State PL Spectra', 'TCSPC Lifetime Measurement', 'MCS Phosphorescence', 'Anisotropy Measurement'],
        'EQ-027': ['Secondary Electron Imaging', 'Backscatter Imaging', 'EDS Analysis', 'Low-Vacuum Mode'],
        'EQ-029': ['Dynamic SIMS Profiling', 'Static SIMS', 'SNMS Mode', 'EQP Plasma Analysis'],
        'EQ-030': ['Video Input Mode', 'Static Pattern Mode', 'CGH / Diffraction', 'Trigger Output Mode'],
        'EQ-037': ['TEM Imaging (BF / DF)', 'STEM-HAADF', 'EDS Analysis', 'EELS'],
        'EQ-042': ['Powder XRD (\u03b8-2\u03b8)', 'Grazing Incidence XRD', 'X-Ray Reflectivity (XRR)', 'Texture / Pole Figures'],
        // ---- Electrical ----
        'EQ-009': ['Temperature Cycling', 'Humidity Control', 'Steady-State Soak', 'Programmable Profiles'],
        'EQ-014': ['DC / AC Voltage & Current', 'Resistance & Continuity', 'Frequency & Period', 'Temperature (Thermocouple)'],
        'EQ-018': ['LCR Frequency Sweep', 'DC Bias Sweep', 'Equivalent Circuit Analysis', 'Limit Line Test'],
        'EQ-021': ['Electrical Transport', 'Optical Spectroscopy', 'Quantum Characterization', 'Automated Temperature Cycling'],
        'EQ-022': ['DC Probing', 'RF Probing', 'mmW Probing', 'Thermal Probing (up to 300 \u00b0C)'],
        'EQ-028': ['Seebeck Coefficient', 'Resistivity (4-Terminal)', 'High-Resistance Option', 'Thin-Film Adapter Mode'],
        'EQ-032': ['Standard Waveform Output', 'Arbitrary Waveform Output', 'Dual-Channel Mode', 'Frequency Counter'],
        'EQ-033': ['Time-Domain Viewing', 'Triggering & Gating', 'Automated Measurements', 'USB Data Capture'],
        'EQ-039': ['Frequency Sweep (S-Parameters)', 'Time-Domain Analysis', 'Calibration & De-Embedding', 'Port Extension'],
        // ---- Fabrication ----
        'EQ-006': ['Single-Extrusion Printing', 'Dual-Extrusion (Multi-Material)', 'AMS-Assisted Printing', 'Laser / Cutting Module'],
        'EQ-012': ['Facing', 'Turning', 'Grooving', 'Educational G-Code Programming'],
        'EQ-013': ['Face Milling', 'Contour Milling', 'Drilling / Pocketing', '2.5D Profiling'],
        'EQ-020': ['Trace Structuring', 'Via Drilling', 'Contour Routing', 'Fiducial Marking'],
        'EQ-023': ['Thermal NIL', 'UV NIL', 'Hot Embossing', 'Vacuum Imprint'],
        'EQ-031': ['Soft Contact', 'Hard Contact', 'Vacuum Contact', 'Proximity / Gap'],
        'EQ-038': ['Manual Pick & Place', 'Epoxy Bonding', 'Eutectic Bonding', 'Flip-Chip Assembly'],
        'EQ-041': ['Ball-Wedge Bonding', 'Manual XYZ Control', 'Stitch Bonding', 'Programmable Logic'],
        // ---- Sample Prep ----
        'EQ-034': ['Single-Sided Dimpling', 'Double-Sided Dimpling', 'Depth-Controlled Dimpling', 'Final Prep (pre-ion mill)'],
        'EQ-035': ['Coarse Grinding', 'Fine Grinding', 'Thickness Control', 'Platen Transfer (to Model 200)'],
        'EQ-036': ['High-Energy Milling', 'Low-Energy Polishing', 'Double-Sided Milling', 'Automated Recipes'],
        // ---- Support Systems ----
        'EQ-019': ['LN\u2082 Dispensing', 'Storage / Inventory Management', 'Transfer Operations', 'Generator Production Mode'],
    };

    // Section 4 templates keyed by equipment category.
    const CATEGORY_FIELDS = {
        'Metrology': `
            <div class="pf__row--2col">
                <div class="pf__group">
                    <label class="pf__label">Sample Type <span class="pf__req">*</span></label>
                    <select name="sample_type" class="pf__select" required>
                        <option value="" disabled selected>Select type\u2026</option>
                        <option value="thin_film">Thin Film / Coating</option>
                        <option value="wafer">Wafer</option>
                        <option value="bulk">Bulk Solid</option>
                        <option value="powder">Powder</option>
                        <option value="liquid">Liquid / Solution</option>
                        <option value="biological">Biological</option>
                        <option value="device">Packaged Device</option>
                        <option value="other">Other</option>
                    </select>
                    <span class="pf__error" id="err_sample_type">Please select a sample type.</span>
                </div>
                <div class="pf__group">
                    <label class="pf__label">Sample Dimensions</label>
                    <input type="text" name="sample_dimensions" class="pf__input"
                        placeholder="e.g. 10 mm \u00d7 10 mm \u00d7 0.5 mm">
                </div>
            </div>
            <div class="pf__row--2col">
                <div class="pf__group">
                    <label class="pf__label">Conductivity (if relevant)</label>
                    <select name="sample_conductivity" class="pf__select">
                        <option value="" selected>Not applicable</option>
                        <option value="conductive">Conductive</option>
                        <option value="non_conductive">Non-Conductive</option>
                        <option value="coated">Sputter-Coated</option>
                        <option value="semiconductor">Semiconductor</option>
                    </select>
                </div>
                <div class="pf__group bk-checkbox-mid">
                    <label class="pf__checkbox-label">
                        <input type="checkbox" name="vacuum_compatible" class="pf__checkbox" value="yes">
                        Sample is vacuum compatible
                    </label>
                </div>
            </div>`,

        'Electrical': `
            <div class="pf__row">
                <div class="pf__group">
                    <label class="pf__label">Device / DUT Description <span class="pf__req">*</span></label>
                    <input type="text" name="dut_description" class="pf__input" required
                        placeholder="e.g. GaN HEMT on SiC substrate, 5 \u00d7 5 mm die">
                    <span class="pf__error" id="err_dut_description">Please describe your device or DUT.</span>
                </div>
            </div>
            <div class="pf__row--2col">
                <div class="pf__group">
                    <label class="pf__label">Temperature Requirements</label>
                    <input type="text" name="temperature_requirements" class="pf__input"
                        placeholder="e.g. RT only, or 4\u00a0K \u2013 300\u00a0K sweep">
                </div>
                <div class="pf__group">
                    <label class="pf__label">Atmosphere / Environment</label>
                    <select name="atmosphere_requirements" class="pf__select">
                        <option value="ambient" selected>Ambient (air)</option>
                        <option value="inert">Inert Gas (N\u2082 / Ar)</option>
                        <option value="vacuum">Vacuum</option>
                        <option value="reducing">Reducing Atmosphere</option>
                    </select>
                </div>
            </div>`,

        'Fabrication': `
            <div class="pf__row--2col">
                <div class="pf__group">
                    <label class="pf__label">Material / Substrate Type <span class="pf__req">*</span></label>
                    <input type="text" name="material_type" class="pf__input" required
                        placeholder="e.g. FR-4, silicon wafer, PLA filament, polyimide">
                    <span class="pf__error" id="err_material_type">Please specify your material or substrate.</span>
                </div>
                <div class="pf__group">
                    <label class="pf__label">Material Dimensions</label>
                    <input type="text" name="material_dimensions" class="pf__input"
                        placeholder="e.g. 150\u00a0mm wafer, 100 \u00d7 100\u00a0mm board">
                </div>
            </div>
            <div class="pf__row">
                <div class="pf__group">
                    <label class="pf__label">Consumables / Special Materials Needed</label>
                    <input type="text" name="consumables_needed" class="pf__input"
                        placeholder="e.g. positive photoresist, 25\u00a0\u00b5m Au wire, epoxy adhesive, PLA filament color">
                </div>
            </div>
            <div id="materialWarningBanner" class="bk-field-warning" style="display:none;"></div>`,

        'Sample Prep': `
            <div class="pf__row--2col">
                <div class="pf__group">
                    <label class="pf__label">Specimen Material <span class="pf__req">*</span></label>
                    <input type="text" name="specimen_material" class="pf__input" required
                        placeholder="e.g. Silicon, GaAs, stainless steel">
                    <span class="pf__error" id="err_specimen_material">Please specify the specimen material.</span>
                </div>
                <div class="pf__group">
                    <label class="pf__label">Specimen Dimensions</label>
                    <input type="text" name="specimen_dimensions" class="pf__input"
                        placeholder="e.g. 3\u00a0mm disc, 10\u00a0mm \u00d7 5\u00a0mm">
                </div>
            </div>
            <div class="pf__row--2col">
                <div class="pf__group">
                    <label class="pf__label">Target Final Thickness</label>
                    <input type="text" name="target_thickness" class="pf__input"
                        placeholder="e.g. &lt;\u00a0100\u00a0nm for TEM electron transparency">
                </div>
                <div class="pf__group">
                    <label class="pf__label">Processing Type</label>
                    <select name="processing_type" class="pf__select">
                        <option value="single_sided">Single-Sided</option>
                        <option value="double_sided">Double-Sided</option>
                    </select>
                </div>
            </div>
            <div id="cryoCoolingRow" class="pf__row" style="display:none;">
                <div class="pf__group">
                    <label class="pf__checkbox-label">
                        <input type="checkbox" name="cryogenic_cooling" class="pf__checkbox" value="yes">
                        Cryogenic LN\u2082 cooling required (Ion Beam Mill only)
                    </label>
                    <span class="pf__helper">LN\u2082 cooling minimizes amorphization during milling. Requires advance scheduling.</span>
                </div>
            </div>`,

        'Support Systems': `
            <div class="pf__row--2col">
                <div class="pf__group">
                    <label class="pf__label">Quantity / Volume Needed <span class="pf__req">*</span></label>
                    <input type="text" name="quantity_needed" class="pf__input" required
                        placeholder="e.g. 5 liters, 1 dewar fill">
                    <span class="pf__error" id="err_quantity_needed">Please specify the quantity required.</span>
                </div>
                <div class="pf__group">
                    <label class="pf__label">Container Type</label>
                    <input type="text" name="container_type" class="pf__input"
                        placeholder="e.g. 4\u00a0L personal dewar, transfer vessel">
                </div>
            </div>`,
    };

    // Runtime state for the current page session.
    let equipmentData = [];
    let ratesData     = {};   // ID-keyed map built from rates.json on load
    let isEducationalMode = false;

    // Load data first so dropdowns and URL preselection have the catalog available.
    document.addEventListener('DOMContentLoaded', async () => {
        await Promise.all([loadEquipmentData(), loadRatesData()]);
        populateCategoryDropdown();
        readUrlParams();
        bindEvents();
    });

    // Pull the equipment list used by the category and equipment dropdowns.
    async function loadEquipmentData() {
        try {
            const res = await fetch('equipment.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            // Keep a dedicated Educational category so those machines can share the same picker.
            equipmentData = (data.equipment || []).map(item => {
                if (EDUCATIONAL_IDS.includes(item.id)) {
                    return Object.assign({}, item, { category: 'Educational' });
                }
                return item;
            });
        } catch (e) {
            console.error('booking.js: failed to load equipment.json', e);
        }
    }

    // Pull billing rates from rates.json and index by equipment ID for O(1) lookup.
    async function loadRatesData() {
        try {
            const res = await fetch('rates.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            (data.rates || []).forEach(r => { ratesData[r.id] = r; });
        } catch (e) {
            console.error('booking.js: failed to load rates.json', e);
        }
    }

    // Build the category filter from the loaded equipment catalog.
    function populateCategoryDropdown() {
        const catSel = document.getElementById('bkCategory');
        if (!catSel) return;
        const cats = [...new Set(equipmentData.map(i => i.category))].sort();
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            catSel.appendChild(opt);
        });
    }

    // Rebuild the equipment dropdown after the category changes.
    function populateEquipmentDropdown(category) {
        const eqSel = document.getElementById('bkEquipment');
        if (!eqSel) return;
        eqSel.innerHTML = '<option value="" disabled selected>-- Select Equipment --</option>';

        const filtered = category
            ? equipmentData.filter(i => i.category === category)
            : equipmentData;

        [...filtered].sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = item.name;
            eqSel.appendChild(opt);
        });
    }

    // Support Equipment.html links that pass ?equipment=EQ-... into this page.
    function readUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const eqId = params.get('equipment');
        if (!eqId) return;

        const item = equipmentData.find(i => i.id === eqId);
        if (!item) return;

        const catSel = document.getElementById('bkCategory');
        const eqSel  = document.getElementById('bkEquipment');
        if (!catSel || !eqSel) return;

        catSel.value = item.category;
        populateEquipmentDropdown(item.category);
        eqSel.value = item.id;
        onEquipmentChange(item);
    }

    // Attach the form event handlers once the DOM and equipment catalog are ready.
    function bindEvents() {
        const catSel = document.getElementById('bkCategory');
        const eqSel  = document.getElementById('bkEquipment');
        const form   = document.getElementById('bookingForm');

        if (catSel) {
            catSel.addEventListener('change', () => {
                populateEquipmentDropdown(catSel.value);
                clearEquipmentSelection();
            });
        }

        if (eqSel) {
            eqSel.addEventListener('change', () => {
                const item = equipmentData.find(i => i.id === eqSel.value);
                if (item) onEquipmentChange(item);
            });
        }

        if (form) {
            form.addEventListener('submit', handleBookingSubmit);
        }

        const userTypeSel = document.getElementById('bkUserType');
        if (userTypeSel) {
            userTypeSel.addEventListener('change', () => {
                updateUserTypeFields();
                if (isEducationalMode) checkEducationalAccess();
                updateCostDisplay();
            });
        }

        const durationSel = document.getElementById('bkDuration');
        if (durationSel) {
            durationSel.addEventListener('change', () => updateCostDisplay());
        }
    }

    // Keep the hidden fields, info card, dynamic fields, and cost panel in sync.
    function onEquipmentChange(item) {
        setHidden('bk_equipment_id',       item.id);
        setHidden('bk_equipment_name',     item.name);
        setHidden('bk_equipment_category', item.category);
        setHidden('bk_equipment_status',   item.status);

        const isEduc = EDUCATIONAL_IDS.includes(item.id);
        setFormMode(isEduc);

        renderInfoCard(item);

        if (!isEduc) {
            renderDynamicFields(item);
            updateCostDisplay(item);
        }

        const card = document.getElementById('equipmentInfoCard');
        if (card) {
            setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
        }
    }

    // Swap between the standard booking flow and the educational request flow.
    function setFormMode(educational) {
        isEducationalMode = educational;
        const bookingSections = document.getElementById('bookingSections');
        const eduSection      = document.getElementById('educationalRequestSection');
        const submitBtn       = document.getElementById('bkSubmitBtn');
        const categoryField   = document.getElementById('bk_form_category');

        if (bookingSections) bookingSections.style.display = educational ? 'none' : '';
        if (eduSection)      eduSection.style.display      = educational ? '' : 'none';
        if (submitBtn)       submitBtn.textContent          = educational ? 'Submit Course Request' : 'Submit Booking Request';
        if (categoryField)   categoryField.value            = educational ? 'educational' : 'booking';

        // Hidden sections should not keep their required rules active.
        toggleRequiredInSection('bookingSections', !educational);
        toggleRequiredInSection('educationalRequestSection', educational);

        if (educational) {
            checkEducationalAccess();
        } else {
            disableSubmit(false);
        }
    }

    // Turn data-bk-required fields on or off when a section is hidden.
    function toggleRequiredInSection(containerId, enable) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.querySelectorAll('[data-bk-required]').forEach(el => {
            if (enable) {
                el.setAttribute('required', '');
            } else {
                el.removeAttribute('required');
                el.style.borderColor = '';
                const errEl = document.getElementById('err_' + el.name);
                if (errEl) errEl.style.display = 'none';
            }
        });
    }

    // Show / hide NAU-specific fields based on the selected user type.
    function updateUserTypeFields() {
        const userType        = document.getElementById('bkUserType')?.value;
        const fields          = document.getElementById('bkUserTypeFields');
        const supervisorGroup = document.getElementById('bkSupervisorGroup');
        const jobTitleGroup   = document.getElementById('bkJobTitleGroup');

        if (!fields) return;

        const isNau = userType === 'nau_student' || userType === 'nau_faculty_staff';

        fields.style.display = isNau ? '' : 'none';

        // Toggle required on NAU fields.
        fields.querySelectorAll('[data-bk-required]').forEach(el => {
            if (isNau) {
                el.setAttribute('required', '');
            } else {
                el.removeAttribute('required');
                el.style.borderColor = '';
                const errEl = document.getElementById('err_' + el.name);
                if (errEl) errEl.style.display = 'none';
            }
        });

        // Supervisor (student only) vs. Job Title (faculty only).
        if (supervisorGroup) {
            supervisorGroup.style.display = userType === 'nau_student' ? '' : 'none';
            const supInput = supervisorGroup.querySelector('[data-bk-required]');
            if (supInput) {
                if (userType === 'nau_student') supInput.setAttribute('required', '');
                else { supInput.removeAttribute('required'); supInput.style.borderColor = ''; }
            }
        }
        if (jobTitleGroup) {
            jobTitleGroup.style.display = userType === 'nau_faculty_staff' ? '' : 'none';
        }
    }

    // Educational requests accept internal NAU users only.
    function checkEducationalAccess() {
        const userType = document.getElementById('bkUserType');
        const val = userType ? userType.value : '';
        const isNAU = (val === 'nau_student' || val === 'nau_faculty_staff');
        const isExternal = (val === 'external_academic' || val === 'industry');

        const externalBlock = document.getElementById('eduExternalBlock');
        const eduFields     = document.getElementById('eduFields');

        if (isExternal) {
            if (externalBlock) externalBlock.style.display = 'flex';
            if (eduFields)     eduFields.style.display     = 'none';
            disableSubmit(true);
        } else {
            if (externalBlock) externalBlock.style.display = 'none';
            if (eduFields)     eduFields.style.display     = '';
            disableSubmit(false);
        }
    }

    // Reset all equipment-dependent UI when the selection is cleared.
    function clearEquipmentSelection() {
        setHidden('bk_equipment_id', '');
        setHidden('bk_equipment_name', '');
        setHidden('bk_equipment_category', '');
        setHidden('bk_equipment_status', '');

        const card = document.getElementById('equipmentInfoCard');
        if (card) card.style.display = 'none';

        const dynFields = document.getElementById('dynamicFields');
        if (dynFields) {
            dynFields.innerHTML = '<p class="bk-fields-placeholder"><i class="fas fa-info-circle"></i> Select equipment above to see technical detail fields.</p>';
        }

        const modeCont = document.getElementById('modesContainer');
        if (modeCont) modeCont.innerHTML = '';

        setFormMode(false);
        disableSubmit(false);
    }

    // Render the status card above the form for the selected instrument.
    function renderInfoCard(item) {
        const card = document.getElementById('equipmentInfoCard');
        if (!card) return;

        const isEduc = EDUCATIONAL_IDS.includes(item.id);
        const badgeClass = {
            'Metrology':       'badge-blue',
            'Electrical':      'badge-purple',
            'Fabrication':     'badge-gold',
            'Sample Prep':     'badge-green',
            'Support Systems': 'badge-purple',
            'Educational':     'badge-blue',
        }[item.category] || 'badge-blue';

        if (isEduc) {
            card.className = 'bk-info-card bk-info-card--educational';
            card.innerHTML = `
                <div class="bk-info-header">
                    <div class="bk-info-meta">
                        <span class="badge badge-blue">Educational</span>
                        <h3 class="bk-info-name">${esc(item.name)}</h3>
                    </div>
                    <div class="bk-info-status">
                        <i class="fas fa-graduation-cap" style="color: var(--nau-blue);"></i>
                        <span class="bk-status-label">Course Use Only</span>
                    </div>
                </div>
                <div class="bk-info-alert bk-info-alert--educational">
                    <i class="fas fa-info-circle"></i>
                    <div><strong>Educational Equipment</strong><br>This equipment is reserved for NAU coursework. Complete the course request form below to arrange access for your class.</div>
                </div>`;
            card.style.display = 'block';
            return;
        }

        const { cls, label, sub } = getStatusInfo(item);
        const accs = ACCESSORIES[item.id] || [];
        const accsHtml = accs.length
            ? `<div class="bk-info-accessories"><i class="fas fa-puzzle-piece"></i> Accessories available: ${accs.map(esc).join(', ')}</div>`
            : '';

        let alertHtml = '';
        if (item.status !== 'AVAILABLE') {
            const dateStr = item.expectedDate ? ` Expected: ${formatDate(item.expectedDate)}.` : '';
            alertHtml = `
                <div class="bk-info-alert bk-info-alert--warning">
                    <i class="fas fa-clock"></i>
                    <div><strong>Equipment Unavailable</strong> \u2014 your request will be queued for when it becomes available.${dateStr}</div>
                </div>`;
        }

        card.className = 'bk-info-card';
        card.innerHTML = `
            <div class="bk-info-header">
                <div class="bk-info-meta">
                    <span class="badge ${badgeClass}">${esc(item.category)}</span>
                    <h3 class="bk-info-name">${esc(item.name)}</h3>
                </div>
                <div class="bk-info-status">
                    <span class="status-dot ${cls}"></span>
                    <div class="bk-status-text">
                        <span class="bk-status-label">${esc(label)}</span>
                        <span class="bk-status-sub">${esc(sub)}</span>
                    </div>
                </div>
            </div>
            ${accsHtml}
            ${alertHtml}`;

        card.style.display = 'block';
        disableSubmit(false);
    }

    function getStatusInfo(item) {
        if (item.status === 'AVAILABLE') {
            return { cls: 'available', label: 'Available Now', sub: 'Ready to reserve' };
        }
        if (item.status === 'EXPECTED') {
            const date = item.expectedDate ? formatDate(item.expectedDate) : null;
            return {
                cls:   'expected',
                label: 'Not Yet Available',
                sub:   date ? 'Expected online: ' + date : 'Availability date TBD',
            };
        }
        return { cls: 'busy', label: 'Currently Unavailable', sub: 'Your request will be queued' };
    }

    function formatDate(raw) {
        if (!raw) return '';
        const [m, d, y] = raw.split('/');
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const mo = parseInt(m, 10) - 1;
        const yr = y ? (y.length === 2 ? '20' + y : y) : '';
        return `${months[mo] || m} ${parseInt(d, 10)}${yr ? ', ' + yr : ''}`;
    }

    // Insert Section 4 inputs that match the selected equipment category.
    function renderDynamicFields(item) {
        const container = document.getElementById('dynamicFields');
        if (!container) return;

        const template = CATEGORY_FIELDS[item.category];
        if (template) {
            container.innerHTML = `<div class="bk-dynamic-fields">${template}</div>`;
        } else {
            container.innerHTML = '<p class="bk-fields-placeholder"><i class="fas fa-check-circle"></i> No additional technical fields required for this category.</p>';
        }

        // Material warnings are attached only to the machines that need them.
        if (MATERIAL_WARNINGS[item.id]) {
            const warn = document.getElementById('materialWarningBanner');
            if (warn) {
                warn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${esc(MATERIAL_WARNINGS[item.id])}`;
                warn.style.display = 'flex';
            }
        }

        // The cryogenic option only applies to the Ion Beam Mill flow.
        const cryoRow = document.getElementById('cryoCoolingRow');
        if (cryoRow) {
            cryoRow.style.display = CRYO_EQUIPMENT.includes(item.id) ? '' : 'none';
        }

        renderModes(item);
    }

    // Add preferred operating mode checkboxes when the selected tool defines them.
    function renderModes(item) {
        const container = document.getElementById('modesContainer');
        if (!container) return;
        const modes = OPERATING_MODES[item.id];
        if (!modes || !modes.length) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = `
            <div class="pf__row">
                <div class="pf__group">
                    <label class="pf__label">Preferred Operating Mode(s)</label>
                    <div class="bk-modes-grid">
                        ${modes.map(m => `
                        <label class="pf__checkbox-label">
                            <input type="checkbox" name="operating_modes" class="pf__checkbox" value="${esc(m)}">
                            ${esc(m)}
                        </label>`).join('')}
                    </div>
                    <span class="pf__helper">Select all that apply. Lab staff will confirm available modes during scheduling.</span>
                </div>
            </div>`;
    }

    // Update the estimate panel from the current equipment, user type, and duration.
    function updateCostDisplay(itemOverride) {
        const pendingEl    = document.getElementById('costPending');
        const tbdEl        = document.getElementById('costTBD');
        const calculatedEl = document.getElementById('costCalculated');
        if (!pendingEl || !tbdEl || !calculatedEl) return;
        const pendingTitle = document.getElementById('costPendingTitle');
        const pendingText  = document.getElementById('costPendingText');
        const tbdTitle = tbdEl.querySelector('.bk-cost-tbd__body strong');
        const tbdText  = tbdEl.querySelector('.bk-cost-tbd__body p');

        // Read the selected equipment from the hidden field unless a fresh item was passed in.
        const item = itemOverride || equipmentData.find(i => i.id === (document.getElementById('bk_equipment_id') || {}).value);
        if (!item || EDUCATIONAL_IDS.includes(item.id)) {
            pendingEl.style.display = '';
            tbdEl.style.display = 'none';
            calculatedEl.style.display = 'none';
            return;
        }

        const rate = ratesData[item.id];
        const userType = (document.getElementById('bkUserType') || {}).value || '';
        const isInternal = (userType === 'nau_student' || userType === 'nau_faculty_staff');
        const isExternal = (userType === 'external_academic' || userType === 'industry');
        const durationVal = (document.getElementById('bkDuration') || {}).value || '1hr';
        const hours = DURATION_HOURS[durationVal];
        const perUnit = isInternal ? rate && rate.internal : (isExternal ? rate && rate.external : null);
        const durationLabel = document.querySelector('#bkDuration option:checked');

        if (pendingTitle) pendingTitle.textContent = 'Select equipment and duration to see estimated cost.';
        if (pendingText) {
            pendingText.textContent = 'Rates are based on your user type (internal vs. external) and session duration. Date and start time do not change the estimate.';
        }

        if (tbdTitle) tbdTitle.textContent = 'Rate Not Yet Published';
        if (tbdText) {
            tbdText.textContent = 'Billing rates for this equipment are currently under review. The lab team will provide a cost estimate when confirming your session.';
        }

        // No rate mapping exists yet for this tool.
        if (!rate) {
            pendingEl.style.display = 'none';
            tbdEl.style.display = 'flex';
            calculatedEl.style.display = 'none';
            return;
        }

        // Without a user type, show the preview text instead of a single final number.
        if (!userType) {
            pendingEl.style.display = '';
            tbdEl.style.display = 'none';
            calculatedEl.style.display = 'none';
            if (rate.internal !== null && rate.internal !== undefined && rate.external !== null && rate.external !== undefined) {
                if (hours === null) {
                    if (pendingTitle) pendingTitle.textContent = 'Select user type to confirm your multi-day estimate.';
                    if (pendingText) {
                        pendingText.textContent = 'Published hourly rates for this equipment are $' + rate.internal.toFixed(2) + ' internal and $' + rate.external.toFixed(2) + ' external. Multi-day sessions require a custom quote.';
                    }
                } else {
                    const internalTotal = rate.internal * hours;
                    const externalTotal = rate.external * hours;
                    if (pendingTitle) pendingTitle.textContent = 'Select user type to confirm your estimated cost.';
                    if (pendingText) {
                        pendingText.textContent = (durationLabel ? durationLabel.textContent : durationVal) + ': Internal estimate $' + internalTotal.toFixed(2) + ', External estimate $' + externalTotal.toFixed(2) + '. Date and start time do not change the estimate.';
                    }
                }
            }
            return;
        }

        // The rate row exists, but this tool still needs a manual quote.
        if (perUnit === null || perUnit === undefined) {
            pendingEl.style.display = 'none';
            tbdEl.style.display = 'flex';
            calculatedEl.style.display = 'none';
            return;
        }

        // Multi-day sessions still need a manual quote even when the hourly rate is published.
        if (hours === null) {
            pendingEl.style.display = 'none';
            tbdEl.style.display = 'flex';
            calculatedEl.style.display = 'none';
            if (tbdTitle) tbdTitle.textContent = 'Multi-Day Estimate';
            if (tbdText) tbdText.textContent = 'For multi-day sessions, please contact the lab for a custom quote. Rate: $' + perUnit.toFixed(2) + ' per ' + rate.unit + '.';
            return;
        }

        // Show the final calculated estimate once the rate and duration are known.
        const total = perUnit * hours;
        const userLabel = isInternal ? 'Internal (NAU)' : 'External';

        pendingEl.style.display = 'none';
        tbdEl.style.display = 'none';
        calculatedEl.style.display = '';

        const costUserTypeLabel = document.getElementById('costUserTypeLabel');
        const costUnit     = document.getElementById('costUnit');
        const costRate     = document.getElementById('costRate');
        const costDuration = document.getElementById('costDuration');
        const costTotal    = document.getElementById('costTotal');

        if (costUserTypeLabel) costUserTypeLabel.textContent = userLabel;
        if (costUnit)     costUnit.textContent     = rate.unit;
        if (costRate)     costRate.textContent     = '$' + perUnit.toFixed(2);
        if (costDuration) costDuration.textContent = durationLabel ? durationLabel.textContent : durationVal;
        if (costTotal)    costTotal.textContent    = '$' + total.toFixed(2);
    }

    // Submit through FormSubmission.php and show inline success or error feedback.
    async function handleBookingSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;

        const submitBtn = document.getElementById('bkSubmitBtn');
        const feedback  = document.getElementById('formFeedback');

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting\u2026';

        const formData = new FormData(e.target);
        collapseCheckboxes(formData, 'operating_modes');
        try {
            const res  = await fetch('FormSubmission.php', { method: 'POST', body: formData });
            const json = await res.json();
            if (json.success) {
                const msg = isEducationalMode
                    ? '<i class="fas fa-check-circle"></i> Course request submitted! The lab team will contact you to discuss scheduling for your class.'
                    : '<i class="fas fa-check-circle"></i> Booking request submitted! The lab team will contact you to confirm your session.';
                showFeedback(feedback, true, msg);
                e.target.reset();
                clearEquipmentSelection();
                setTimeout(() => hideFeedback(feedback), 8000);
            } else {
                showFeedback(feedback, false,
                    '<i class="fas fa-times-circle"></i> ' + (json.message || 'Submission failed. Please try again or email mpct.nano@gmail.com.'));
            }
        } catch (err) {
            showFeedback(feedback, false,
                '<i class="fas fa-times-circle"></i> Network error. Please check your connection and try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Booking Request';
        }
    }

    // Join repeated checkbox values into a single comma-separated field for email output.
    function collapseCheckboxes(formData, fieldName) {
        const values = formData.getAll(fieldName);
        formData.delete(fieldName);
        if (values.length) formData.set(fieldName, values.join(', '));
    }

    // Validate only the required fields that are currently visible.
    function validateForm() {
        let valid = true;
        document.querySelectorAll('#bookingForm [required]').forEach(el => {
            // Ignore inputs inside hidden sections because their flow is inactive.
            if (el.closest('[style*="display: none"]') || el.closest('[style*="display:none"]')) return;
            const errEl = document.getElementById('err_' + el.name);
            if (!el.value.trim()) {
                valid = false;
                el.style.borderColor = 'var(--nau-red)';
                if (errEl) errEl.style.display = 'block';
            } else {
                el.style.borderColor = '';
                if (errEl) errEl.style.display = 'none';
            }
        });

        // Billing notice checkbox — must be acknowledged before submitting.
        const agreeBox   = document.getElementById('bkAgreeTerms');
        const agreeError = document.getElementById('bkAgreeError');
        if (agreeBox && !agreeBox.checked) {
            valid = false;
            if (agreeError) agreeError.style.display = 'flex';
            agreeBox.closest('.bk-billing-notice__agree').style.outline = '2px solid #ff7b7b';
            agreeBox.closest('.bk-billing-notice__agree').style.outlineOffset = '-2px';
            if (!document.querySelector('#bookingForm [style*="border-color"]')) {
                agreeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (agreeBox) {
            if (agreeError) agreeError.style.display = 'none';
            agreeBox.closest('.bk-billing-notice__agree').style.outline = '';
            agreeBox.closest('.bk-billing-notice__agree').style.outlineOffset = '';
        }

        if (!valid) {
            const firstErr = document.querySelector('#bookingForm [required]:invalid, #bookingForm [style*="--nau-red"]');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return valid;
    }

    // Small DOM and text helpers used across the page.
    function setHidden(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }

    function disableSubmit(disabled) {
        const btn = document.getElementById('bkSubmitBtn');
        if (!btn) return;
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.5' : '';
        btn.style.cursor  = disabled ? 'not-allowed' : '';
    }

    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function showFeedback(el, success, msg) {
        if (!el) return;
        el.innerHTML   = msg;
        el.className   = 'bk-feedback ' + (success ? 'bk-feedback--success' : 'bk-feedback--error');
        el.style.display = 'block';
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideFeedback(el) {
        if (el) el.style.display = 'none';
    }

})();
