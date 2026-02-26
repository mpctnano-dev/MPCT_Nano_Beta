/**
 * services.js — 3D Printing Service Form Logic
 * Handles: file upload validation, shipping toggle, advanced accordion,
 *          default-scale checkbox, client-side validation, and success state.
 */
(function () {
    'use strict';

    const form = document.getElementById('printRequestForm');
    if (!form) return; // Only run on pages with the print form

    /* ── DOM refs ────────────────────────────────────────── */
    const dropzone = document.getElementById('pf-dropzone');
    const fileInput = document.getElementById('pf-files');
    const fileList = document.getElementById('pf-file-list');
    const deliverySelect = document.getElementById('pf-delivery');
    const shippingSection = document.getElementById('pf-shipping-section');
    const defaultScaleCheck = document.getElementById('pf-default-scale');
    const sizeInput = document.getElementById('pf-size');
    const advancedBtn = document.getElementById('pf-advanced-btn');
    const advancedPanel = document.getElementById('pf-advanced-panel');
    const successPanel = document.getElementById('pf-success');
    const ticketIdEl = document.getElementById('pf-ticket-id');
    const submitAnotherBtn = document.getElementById('pf-submit-another-btn');

    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    const ALLOWED_EXT = ['.stl', '.3mf'];
    let uploadedFiles = [];

    /* ── File upload logic ───────────────────────────────── */
    // Click on dropzone opens file picker
    dropzone.addEventListener('click', () => fileInput.click());

    // Drag-and-drop
    dropzone.addEventListener('dragover', e => {
        e.preventDefault();
        dropzone.classList.add('pf__dropzone--active');
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('pf__dropzone--active');
    });
    dropzone.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.classList.remove('pf__dropzone--active');
        addFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
        addFiles(fileInput.files);
        fileInput.value = ''; // reset so same file can be re-added
    });

    function addFiles(newFiles) {
        clearError('pf-files-error');
        for (const file of newFiles) {
            if (uploadedFiles.length >= MAX_FILES) {
                showError('pf-files-error', `Maximum ${MAX_FILES} files allowed.`);
                break;
            }
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            if (!ALLOWED_EXT.includes(ext)) {
                showError('pf-files-error', `"${file.name}" is not an accepted file type. Only .stl and .3mf are allowed.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                showError('pf-files-error', `"${file.name}" exceeds the 50 MB file size limit.`);
                continue;
            }
            // Check for duplicate names
            if (uploadedFiles.some(f => f.name === file.name)) continue;
            uploadedFiles.push(file);
        }
        renderFileList();
    }

    function renderFileList() {
        fileList.innerHTML = '';
        uploadedFiles.forEach((file, idx) => {
            const chip = document.createElement('div');
            chip.className = 'pf__file-chip';
            const sizeKB = (file.size / 1024).toFixed(0);
            const sizeLabel = sizeKB > 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : sizeKB + ' KB';
            chip.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span class="pf__file-name">${file.name}</span>
                <span class="pf__file-size">${sizeLabel}</span>
                <button type="button" class="pf__file-remove" data-idx="${idx}" aria-label="Remove file">×</button>
            `;
            fileList.appendChild(chip);
        });

        // Remove handlers
        fileList.querySelectorAll('.pf__file-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                uploadedFiles.splice(idx, 1);
                renderFileList();
            });
        });
    }

    /* ── Shipping toggle ─────────────────────────────────── */
    deliverySelect.addEventListener('change', () => {
        const isShip = deliverySelect.value === 'ship';
        shippingSection.style.display = isShip ? 'block' : 'none';
        // Toggle required on shipping fields
        shippingSection.querySelectorAll('.pf__input').forEach(input => {
            if (isShip) {
                input.setAttribute('required', '');
            } else {
                input.removeAttribute('required');
                input.value = input.name === 'ship_country' ? 'United States' : '';
                clearError(input.id + '-error');
            }
        });
    });

    /* ── Default scale checkbox ──────────────────────────── */
    defaultScaleCheck.addEventListener('change', () => {
        if (defaultScaleCheck.checked) {
            sizeInput.disabled = true;
            sizeInput.value = '';
            sizeInput.placeholder = 'Using file default';
            sizeInput.removeAttribute('required');
            clearError('pf-size-error');
        } else {
            sizeInput.disabled = false;
            sizeInput.placeholder = 'e.g. 120 × 80 × 50';
            sizeInput.setAttribute('required', '');
        }
    });

    /* ── Advanced options accordion ───────────────────────── */
    let advancedOpen = false;
    advancedBtn.addEventListener('click', () => {
        advancedOpen = !advancedOpen;
        advancedPanel.style.display = advancedOpen ? 'block' : 'none';
        advancedBtn.classList.toggle('pf__advanced-btn--open', advancedOpen);
    });

    /* ── Form validation & submission ────────────────────── */
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (validate()) {
            showSuccess();
        }
    });

    function validate() {
        let valid = true;

        // Required text/select/email fields
        const required = [
            { id: 'pf-name', msg: 'Please enter your name.' },
            { id: 'pf-email', msg: 'Please enter a valid email address.' },
            { id: 'pf-affiliation', msg: 'Please select your affiliation.' },
            { id: 'pf-department', msg: 'Please enter your department, lab, or company.' },
            { id: 'pf-project-type', msg: 'Please select a project type.' },
            { id: 'pf-quantity', msg: 'Please enter a quantity (at least 1).' },
            { id: 'pf-material', msg: 'Please select a material.' },
            { id: 'pf-color1', msg: 'Please enter a color preference.' },
            { id: 'pf-color2', msg: 'Please enter a second-choice color.' },
            { id: 'pf-delivery', msg: 'Please select a delivery method.' },
        ];

        // Size is required unless default scale is checked
        if (!defaultScaleCheck.checked) {
            required.push({ id: 'pf-size', msg: 'Please enter the intended print size in mm.' });
        }

        required.forEach(({ id, msg }) => {
            const el = document.getElementById(id);
            const errId = id + '-error';
            clearError(errId);
            if (!el.value || el.value.trim() === '') {
                showError(errId, msg);
                valid = false;
            }
        });

        // Email format
        const emailEl = document.getElementById('pf-email');
        if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
            showError('pf-email-error', 'Please enter a valid email address.');
            valid = false;
        }

        // Quantity must be ≥ 1
        const qtyEl = document.getElementById('pf-quantity');
        if (qtyEl.value && parseInt(qtyEl.value) < 1) {
            showError('pf-quantity-error', 'Quantity must be at least 1.');
            valid = false;
        }

        // Files required
        clearError('pf-files-error');
        if (uploadedFiles.length === 0) {
            showError('pf-files-error', 'Please upload at least one .stl or .3mf file.');
            valid = false;
        }

        // Shipping fields if ship is selected
        if (deliverySelect.value === 'ship') {
            const shipFields = [
                { id: 'pf-street', msg: 'Street address is required.' },
                { id: 'pf-city', msg: 'City is required.' },
                { id: 'pf-state', msg: 'State is required.' },
                { id: 'pf-zip', msg: 'ZIP code is required.' },
                { id: 'pf-country', msg: 'Country is required.' },
            ];
            shipFields.forEach(({ id, msg }) => {
                const el = document.getElementById(id);
                const errId = id + '-error';
                clearError(errId);
                if (!el.value || el.value.trim() === '') {
                    showError(errId, msg);
                    valid = false;
                }
            });
        }

        // Policy checkbox
        clearError('pf-policy-error');
        if (!document.getElementById('pf-policy-agree').checked) {
            showError('pf-policy-error', 'You must agree to the policies before submitting.');
            valid = false;
        }

        // Scroll to first error
        if (!valid) {
            const firstErr = form.querySelector('.pf__error--visible');
            if (firstErr) {
                firstErr.closest('.pf__group, .pf__section--submit')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return valid;
    }

    function showError(errId, msg) {
        const el = document.getElementById(errId);
        if (el) {
            el.textContent = msg;
            el.classList.add('pf__error--visible');
        }
    }

    function clearError(errId) {
        const el = document.getElementById(errId);
        if (el) {
            el.textContent = '';
            el.classList.remove('pf__error--visible');
        }
    }

    /* ── Success state ───────────────────────────────────── */
    function showSuccess() {
        // Generate ticket ID: 3DP-YYYYMMDD-XXXX
        const now = new Date();
        const datePart = now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0');
        const randPart = String(Math.floor(1000 + Math.random() * 9000));
        const ticketId = `3DP-${datePart}-${randPart}`;

        ticketIdEl.textContent = ticketId;
        form.style.display = 'none';
        document.getElementById('pf-advanced-toggle').style.display = 'none';
        successPanel.style.display = 'block';
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    submitAnotherBtn.addEventListener('click', () => {
        form.reset();
        uploadedFiles = [];
        renderFileList();
        shippingSection.style.display = 'none';
        advancedPanel.style.display = 'none';
        advancedOpen = false;
        advancedBtn.classList.remove('pf__advanced-btn--open');
        sizeInput.disabled = false;
        sizeInput.placeholder = 'e.g. 120 × 80 × 50';
        sizeInput.setAttribute('required', '');

        // Clear all errors
        form.querySelectorAll('.pf__error').forEach(el => {
            el.textContent = '';
            el.classList.remove('pf__error--visible');
        });

        successPanel.style.display = 'none';
        form.style.display = 'block';
        document.getElementById('pf-advanced-toggle').style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

})();

/* ── FAQ exclusive accordion ──────────────────────────────── */
(function () {
    'use strict';
    document.querySelectorAll('.faq-list').forEach(function (list) {
        list.addEventListener('toggle', function (e) {
            if (e.target.open) {
                list.querySelectorAll('details[open]').forEach(function (d) {
                    if (d !== e.target) d.removeAttribute('open');
                });
            }
        }, true);
    });
})();
