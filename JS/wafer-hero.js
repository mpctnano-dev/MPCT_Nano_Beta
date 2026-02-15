(() => {
    'use strict';

    const HERO_SELECTOR = '.wafer-hero';

    /* ───────────────────────────────────────────────────────────
     *  Wafer-zone metadata — 100 % accurate semiconductor terms.
     *  Shown in the interactive hover tooltip.
     * ─────────────────────────────────────────────────────────── */
    const WAFER_ZONES = {
        die: {
            title: 'Active Die',
            desc: 'Each die holds a complete integrated circuit — standard-cell logic, SRAM cache, I/O pad ring, and analog IP. After probe test and diamond-saw dicing, each good die is packaged into a finished chip.'
        },
        exclusion: {
            title: 'Edge Exclusion Zone',
            desc: 'A ~3 mm ring of bare silicon where no dies are placed. Spin-coat uniformity, CVD film thickness, and CMP removal rate all degrade near the wafer bevel.'
        },
        bevel: {
            title: 'Wafer Bevel',
            desc: 'The chamfered and polished edge of the 300 mm monocrystalline silicon substrate. The SEMI-standard 22° bevel prevents micro-fractures during FOUP handling.'
        },
        notch: {
            title: 'Crystal Orientation Notch',
            desc: 'Semicircular cut indicating the \u27E8110\u27E9 crystal plane of the silicon. The lithography stepper uses this for sub-0.001° rotational alignment before each exposure.'
        },
        pcm: {
            title: 'Process Control Monitor (PCM)',
            desc: 'Test structures for in-line SPC — Kelvin resistors, MOS capacitors, ring oscillators, and alignment verniers measure Vt, Rs, Tox, and overlay accuracy.'
        }
    };

    /* ═══════════════════════════════════════════════════════════
     *  WaferHeroRealism — photorealistic patterned-wafer scene
     * ═══════════════════════════════════════════════════════════ */
    class WaferHeroRealism {

        constructor(root) {
            this.root = root;
            this.canvas = root.querySelector('#waferCanvas');
            this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: true }) : null;

            this.dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.bounds = { width: 0, height: 0, radius: 0 };

            this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
            this.scrollProgress = 0;
            this.rafId = 0;
            this.time = 0;
            this.scrollTicking = false;
            this.driftOffset = Math.random() * Math.PI * 2;

            this.isVisible = true;
            this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.prefersReducedMotion = this.motionQuery.matches;
            this.isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
            this.quality = 'high';
            this.frameInterval = 1000 / 60;
            this.lastFrameTime = 0;
            this.lastCssPointerX = null;
            this.lastCssPointerY = null;
            this.lastCssScroll = null;

            this.resizeObserver = null;
            this.visibilityObserver = null;

            /* Offscreen layer caches */
            this.baseLayer = null;
            this.thinFilmLayer = null;
            this.grainLayer = null;
            this.dieTemplate = null;
            this.dieWidth = 0;
            this.dieHeight = 0;

            /* Tooltip state */
            this.tooltip = null;
            this.tooltipTitle = null;
            this.tooltipDesc = null;
            this.currentZone = null;
            this.canvasShell = null;

            this.renderFrame = this.renderFrame.bind(this);
            this.handleResize = this.handleResize.bind(this);
            this.handleScroll = this.handleScroll.bind(this);
            this.handlePointerMove = this.handlePointerMove.bind(this);
            this.handlePointerLeave = this.handlePointerLeave.bind(this);
            this.handleVisibility = this.handleVisibility.bind(this);
            this.handleMotionChange = this.handleMotionChange.bind(this);
        }

        /* ── Lifecycle ────────────────────────────────────────── */

        init() {
            if (!this.canvas || !this.ctx) return;
            this.handleResize();
            this.updateScrollProgress();
            this.updatePointerVars();
            this.bindEvents();
            this.setupObservers();
            this.createTooltip();

            if (this.prefersReducedMotion) {
                this.draw(performance.now());
            } else {
                this.startLoop();
            }
        }

        /* ── Quality tier ─────────────────────────────────────── */

        determineQuality(width) {
            const memory = navigator.deviceMemory || 8;
            const cores = navigator.hardwareConcurrency || 8;
            if (this.isCoarsePointer || width <= 820 || memory <= 4 || cores <= 4) return 'mobile';
            if (width <= 1220 || memory <= 6 || cores <= 6) return 'balanced';
            return 'high';
        }

        getFrameInterval() {
            if (this.prefersReducedMotion) return 1000 / 6;
            if (this.quality === 'mobile') return 1000 / 32;
            if (this.quality === 'balanced') return 1000 / 45;
            return 1000 / 60;
        }

        /* ── Events ───────────────────────────────────────────── */

        bindEvents() {
            window.addEventListener('resize', this.handleResize, { passive: true });
            window.addEventListener('scroll', this.handleScroll, { passive: true });
            this.root.addEventListener('pointermove', this.handlePointerMove, { passive: true });
            this.root.addEventListener('pointerleave', this.handlePointerLeave);
            document.addEventListener('visibilitychange', this.handleVisibility);
            if (this.motionQuery.addEventListener) {
                this.motionQuery.addEventListener('change', this.handleMotionChange);
            } else if (this.motionQuery.addListener) {
                this.motionQuery.addListener(this.handleMotionChange);
            }
        }

        setupObservers() {
            if ('ResizeObserver' in window && this.canvas.parentElement) {
                this.resizeObserver = new ResizeObserver(() => this.handleResize());
                this.resizeObserver.observe(this.canvas.parentElement);
            }
            if ('IntersectionObserver' in window) {
                this.visibilityObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        this.isVisible = entry.isIntersecting;
                        if (!this.prefersReducedMotion) {
                            if (this.isVisible && !document.hidden) this.startLoop();
                            else this.stopLoop();
                        }
                    });
                }, { threshold: 0.01 });
                this.visibilityObserver.observe(this.root);
            }
        }

        handleResize() {
            if (!this.canvas || !this.ctx) return;
            const rect = this.canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            this.quality = this.determineQuality(rect.width);
            const dprCap = this.quality === 'mobile' ? 1.05 : this.quality === 'balanced' ? 1.3 : 1.6;
            this.dpr = Math.min(window.devicePixelRatio || 1, dprCap);
            this.canvas.width = Math.round(rect.width * this.dpr);
            this.canvas.height = Math.round(rect.height * this.dpr);
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

            this.bounds.width = rect.width;
            this.bounds.height = rect.height;
            this.bounds.radius = Math.min(rect.width, rect.height) * 0.535;
            this.frameInterval = this.getFrameInterval();
            this.lastFrameTime = 0;

            this.buildLayers();
            this.updateScrollProgress();
            this.draw(performance.now());
        }

        handleScroll() {
            if (this.scrollTicking) return;
            this.scrollTicking = true;
            window.requestAnimationFrame(() => {
                this.updateScrollProgress();
                this.scrollTicking = false;
                if (!this.prefersReducedMotion && this.isVisible && !this.rafId) this.startLoop();
            });
        }

        handlePointerMove(event) {
            if (this.isCoarsePointer) return;
            const rect = this.root.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
            this.pointer.targetX = this.clamp(px, -1, 1);
            this.pointer.targetY = this.clamp(py, -1, 1);
            this.updatePointerVars();
            this.updateTooltip(event.clientX, event.clientY);
            if (!this.prefersReducedMotion && this.isVisible && !this.rafId) this.startLoop();
        }

        handlePointerLeave() {
            this.pointer.targetX = 0;
            this.pointer.targetY = 0;
            this.updatePointerVars();
            this.hideTooltip();
        }

        handleVisibility() {
            if (document.hidden) this.stopLoop();
            else if (!this.prefersReducedMotion && this.isVisible) this.startLoop();
        }

        handleMotionChange(event) {
            this.prefersReducedMotion = event.matches;
            this.frameInterval = this.getFrameInterval();
            this.lastFrameTime = 0;
            if (this.prefersReducedMotion) { this.stopLoop(); this.draw(performance.now()); }
            else if (this.isVisible && !document.hidden) this.startLoop();
        }

        updatePointerVars() {
            const px = this.pointer.targetX.toFixed(4);
            const py = this.pointer.targetY.toFixed(4);
            if (px !== this.lastCssPointerX) { this.root.style.setProperty('--wafer-pointer-x', px); this.lastCssPointerX = px; }
            if (py !== this.lastCssPointerY) { this.root.style.setProperty('--wafer-pointer-y', py); this.lastCssPointerY = py; }
        }

        updateScrollProgress() {
            const rect = this.root.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            this.scrollProgress = this.clamp((vh - rect.top) / (vh + rect.height), 0, 1);
            const sv = this.scrollProgress.toFixed(4);
            if (sv !== this.lastCssScroll) { this.root.style.setProperty('--wafer-scroll', sv); this.lastCssScroll = sv; }
        }

        /* ── Animation loop ───────────────────────────────────── */

        startLoop() {
            if (this.rafId || this.prefersReducedMotion || document.hidden || !this.isVisible) return;
            this.lastFrameTime = 0;
            this.rafId = window.requestAnimationFrame(this.renderFrame);
        }

        stopLoop() {
            if (!this.rafId) return;
            window.cancelAnimationFrame(this.rafId);
            this.rafId = 0;
        }

        renderFrame(ts) {
            if (!this.prefersReducedMotion && this.lastFrameTime && (ts - this.lastFrameTime) < this.frameInterval) {
                this.rafId = window.requestAnimationFrame(this.renderFrame);
                return;
            }
            this.lastFrameTime = ts;
            this.time = ts;
            this.draw(ts);
            if (!this.prefersReducedMotion && this.isVisible && !document.hidden) {
                this.rafId = window.requestAnimationFrame(this.renderFrame);
            } else {
                this.rafId = 0;
            }
        }

        /* ═════════════════════════════════════════════════════════
         *  TOOLTIP — interactive wafer-zone information
         * ═════════════════════════════════════════════════════════ */

        createTooltip() {
            if (this.isCoarsePointer) return;

            this.canvasShell = this.root.querySelector('.wafer-hero__canvas-shell');

            const el = document.createElement('div');
            el.className = 'wafer-hero__tooltip';
            el.setAttribute('aria-hidden', 'true');
            el.innerHTML =
                '<span class="wafer-hero__tooltip-pip"></span>' +
                '<div class="wafer-hero__tooltip-title"></div>' +
                '<div class="wafer-hero__tooltip-desc"></div>';
            this.root.appendChild(el);

            this.tooltip = el;
            this.tooltipTitle = el.querySelector('.wafer-hero__tooltip-title');
            this.tooltipDesc = el.querySelector('.wafer-hero__tooltip-desc');
        }

        updateTooltip(clientX, clientY) {
            if (!this.tooltip || !this.canvasShell) return;

            const shellRect = this.canvasShell.getBoundingClientRect();
            const cx = shellRect.left + shellRect.width * 0.5;
            const cy = shellRect.top + shellRect.height * 0.5;
            const approxR = Math.min(shellRect.width, shellRect.height) * 0.47;

            const dx = clientX - cx;
            const dy = clientY - cy;
            const dist = Math.hypot(dx, dy);
            const n = dist / approxR;

            if (n > 1.08 || approxR < 40) {
                this.hideTooltip();
                return;
            }

            /* Zone detection */
            let zone;
            const isBottom = dy > approxR * 0.7 && Math.abs(dx) < approxR * 0.18;

            if (isBottom && n > 0.82) {
                zone = 'notch';
            } else if (n > 0.96) {
                zone = 'bevel';
            } else if (n > 0.86) {
                zone = 'exclusion';
            } else if (n < 0.1) {
                zone = 'pcm';
            } else {
                zone = 'die';
            }

            this.showTooltip(clientX, clientY, zone);
        }

        showTooltip(x, y, zone) {
            const data = WAFER_ZONES[zone];
            if (!data || !this.tooltip) return;

            if (this.currentZone !== zone) {
                this.tooltipTitle.textContent = data.title;
                this.tooltipDesc.textContent = data.desc;
                this.currentZone = zone;
            }

            /* Position near cursor, keep within viewport */
            const vw = window.innerWidth;
            let tx = x + 20;
            let ty = y + 16;
            if (tx + 280 > vw) tx = x - 296;
            if (ty + 120 > window.innerHeight) ty = y - 130;

            this.tooltip.style.left = tx + 'px';
            this.tooltip.style.top = ty + 'px';
            if (!this.tooltip.classList.contains('visible')) {
                this.tooltip.classList.add('visible');
            }
        }

        hideTooltip() {
            if (!this.tooltip) return;
            this.tooltip.classList.remove('visible');
            this.currentZone = null;
        }

        /* ═════════════════════════════════════════════════════════
         *  LAYER BUILDING — pre-computed offscreen canvases
         * ═════════════════════════════════════════════════════════ */

        getLayerSize() {
            if (this.quality === 'mobile') return this.bounds.width > 620 ? 920 : 760;
            if (this.quality === 'balanced') return this.bounds.width > 820 ? 1180 : 980;
            return this.bounds.width > 920 ? 1420 : 1200;
        }

        buildLayers() {
            const size = this.getLayerSize();
            const r = size * 0.5;
            this.buildDieTemplate(size);
            this.buildBaseLayer(size, r);
            this.buildThinFilmLayer(size, r);
            this.buildGrainLayer(size);
        }

        /* ── Single die IC pattern ────────────────────────────── */

        buildDieTemplate(waferSize) {
            const diesAcross = this.quality === 'mobile' ? 16 : this.quality === 'balanced' ? 19 : 22;
            const dw = Math.floor(waferSize / diesAcross);
            const dh = Math.floor(dw * 1.32);
            this.dieWidth = dw;
            this.dieHeight = dh;

            const cvs = document.createElement('canvas');
            cvs.width = dw;
            cvs.height = dh;
            const c = cvs.getContext('2d');

            c.fillStyle = '#2c3648';
            c.fillRect(0, 0, dw, dh);

            const densityGrad = c.createLinearGradient(0, 0, dw, dh);
            densityGrad.addColorStop(0, 'rgba(90,110,140,0.06)');
            densityGrad.addColorStop(0.5, 'rgba(70,90,120,0.03)');
            densityGrad.addColorStop(1, 'rgba(100,120,150,0.07)');
            c.fillStyle = densityGrad;
            c.fillRect(0, 0, dw, dh);

            const pad = Math.max(2, Math.floor(dw * 0.038));
            const padGap = Math.max(4, Math.floor(dw * 0.065));
            const margin = Math.max(3, Math.floor(dw * 0.058));
            const innerW = dw - margin * 2;
            const innerH = dh - margin * 2;

            /* Bond pad ring */
            c.fillStyle = 'rgba(185,170,105,0.52)';
            for (let x = margin; x + pad <= dw - margin; x += padGap) {
                c.fillRect(x, margin - pad + 1, pad, pad);
                c.fillRect(x, dh - margin - 1, pad, pad);
            }
            for (let y = margin + padGap; y + pad <= dh - margin - padGap; y += padGap) {
                c.fillRect(margin - pad + 1, y, pad, pad);
                c.fillRect(dw - margin - 1, y, pad, pad);
            }

            c.fillStyle = 'rgba(230,220,170,0.22)';
            for (let x = margin; x + pad <= dw - margin; x += padGap) {
                c.fillRect(x + 1, margin - pad + 2, 1, 1);
                c.fillRect(x + 1, dh - margin, 1, 1);
            }

            const coreX = margin + pad + 2;
            const coreY = margin + pad + 2;
            const coreW = innerW - (pad + 2) * 2;
            const coreH = innerH - (pad + 2) * 2;

            /* SRAM / cache block */
            const sramH = Math.floor(coreH * 0.35);
            const memPitch = Math.max(2, Math.floor(dw * 0.025));
            c.fillStyle = 'rgba(42,52,68,0.9)';
            c.fillRect(coreX, coreY, coreW, sramH);

            c.strokeStyle = 'rgba(100,130,170,0.16)';
            c.lineWidth = 0.4;
            for (let y = coreY; y < coreY + sramH; y += memPitch) {
                c.beginPath(); c.moveTo(coreX, y); c.lineTo(coreX + coreW, y); c.stroke();
            }
            for (let x = coreX; x < coreX + coreW; x += memPitch) {
                c.beginPath(); c.moveTo(x, coreY); c.lineTo(x, coreY + sramH); c.stroke();
            }

            c.fillStyle = 'rgba(130,160,200,0.14)';
            for (let y = coreY + 1; y < coreY + sramH; y += memPitch * 2) {
                for (let x = coreX + 1; x < coreX + coreW; x += memPitch * 2) {
                    c.fillRect(x, y, 1, 1);
                }
            }

            c.strokeStyle = 'rgba(150,175,210,0.2)';
            c.lineWidth = 0.7;
            c.beginPath(); c.moveTo(coreX, coreY + sramH); c.lineTo(coreX + coreW, coreY + sramH); c.stroke();

            /* Logic area */
            const logicY = coreY + sramH + 2;
            const logicH = coreH - sramH - 4;
            const lineSpacing = Math.max(2, Math.floor(dw * 0.028));

            c.strokeStyle = 'rgba(120,148,185,0.14)';
            c.lineWidth = 0.45;
            for (let y = logicY; y < logicY + logicH; y += lineSpacing) {
                const n = this.hash2D(y * 0.31, 42.7);
                if (n < 0.25) continue;
                c.beginPath(); c.moveTo(coreX + n * lineSpacing * 2, y); c.lineTo(coreX + coreW - (1 - n) * lineSpacing, y); c.stroke();
            }

            c.strokeStyle = 'rgba(110,140,178,0.12)';
            for (let x = coreX; x < coreX + coreW; x += lineSpacing) {
                const n = this.hash2D(x * 0.19, 23.1);
                if (n < 0.3) continue;
                c.beginPath(); c.moveTo(x, logicY + n * lineSpacing); c.lineTo(x, logicY + logicH - (1 - n) * lineSpacing * 2); c.stroke();
            }

            c.fillStyle = 'rgba(155,180,215,0.1)';
            for (let y = logicY; y < logicY + logicH; y += lineSpacing * 2) {
                for (let x = coreX; x < coreX + coreW; x += lineSpacing * 2) {
                    if (this.hash2D(x * 0.53, y * 0.41) > 0.55) c.fillRect(x, y, 1, 1);
                }
            }

            /* Analog block */
            const anaW = Math.floor(coreW * 0.22);
            const anaH = Math.floor(logicH * 0.3);
            const anaX = coreX + coreW - anaW - 1;
            const anaY = logicY + logicH - anaH - 1;
            c.fillStyle = 'rgba(50,62,82,0.5)';
            c.fillRect(anaX, anaY, anaW, anaH);
            c.strokeStyle = 'rgba(130,155,190,0.12)';
            c.lineWidth = 0.4;
            c.strokeRect(anaX, anaY, anaW, anaH);

            const indCx = anaX + anaW * 0.5;
            const indCy = anaY + anaH * 0.5;
            const indR = Math.min(anaW, anaH) * 0.32;
            c.strokeStyle = 'rgba(140,170,210,0.18)';
            c.lineWidth = 0.5;
            for (let turn = 0; turn < 3; turn++) {
                c.beginPath(); c.arc(indCx, indCy, indR * (0.35 + turn * 0.25), 0, Math.PI * 1.7); c.stroke();
            }

            /* Power rails */
            c.strokeStyle = 'rgba(160,185,220,0.18)';
            c.lineWidth = Math.max(1, dw * 0.014);
            for (const ry of [0.28, 0.54, 0.78]) {
                c.beginPath(); c.moveTo(1, Math.floor(dh * ry)); c.lineTo(dw - 1, Math.floor(dh * ry)); c.stroke();
            }
            c.lineWidth = Math.max(1, dw * 0.012);
            c.strokeStyle = 'rgba(150,178,215,0.14)';
            const vx = Math.floor(dw * 0.5);
            c.beginPath(); c.moveTo(vx, margin); c.lineTo(vx, dh - margin); c.stroke();

            /* Corner alignment marks */
            c.strokeStyle = 'rgba(180,200,230,0.22)';
            c.lineWidth = 0.6;
            const mk = Math.max(3, Math.floor(dw * 0.06));
            for (const [ccx, ccy, ddx, ddy] of [[2, 2, 1, 1], [dw - 2, 2, -1, 1], [2, dh - 2, 1, -1], [dw - 2, dh - 2, -1, -1]]) {
                c.beginPath(); c.moveTo(ccx, ccy); c.lineTo(ccx + mk * ddx, ccy); c.moveTo(ccx, ccy); c.lineTo(ccx, ccy + mk * ddy); c.stroke();
            }

            c.strokeStyle = 'rgba(90,115,150,0.15)';
            c.lineWidth = 0.6;
            c.strokeRect(0.5, 0.5, dw - 1, dh - 1);

            this.dieTemplate = cvs;
        }

        /* ── Full wafer base layer (substrate + die grid) ───── */

        buildBaseLayer(size, r) {
            const cvs = document.createElement('canvas');
            cvs.width = size;
            cvs.height = size;
            const c = cvs.getContext('2d');

            c.clearRect(0, 0, size, size);
            c.save();
            c.translate(r, r);

            c.beginPath();
            c.arc(0, 0, r * 0.995, 0, Math.PI * 2);
            c.clip();

            const sub = c.createRadialGradient(-r * 0.08, -r * 0.06, 0, 0, 0, r);
            sub.addColorStop(0, '#3a4358');
            sub.addColorStop(0.55, '#2f3848');
            sub.addColorStop(0.88, '#242c3a');
            sub.addColorStop(1, '#1a2030');
            c.fillStyle = sub;
            c.beginPath();
            c.arc(0, 0, r, 0, Math.PI * 2);
            c.fill();

            const activeR = r * 0.96;

            /* Polishing marks on bare-silicon ring */
            c.save();
            c.beginPath();
            c.arc(0, 0, r * 0.993, 0, Math.PI * 2);
            c.arc(0, 0, activeR, 0, Math.PI * 2, true);
            c.clip();
            const markCount = this.quality === 'mobile' ? 60 : 120;
            for (let i = 0; i < markCount; i++) {
                const angle = (i / markCount) * Math.PI * 2;
                const n = this.hash2D(i * 7.3, i * 11.1);
                c.strokeStyle = `rgba(140,160,185,${0.03 + n * 0.04})`;
                c.lineWidth = 0.4;
                c.beginPath();
                c.moveTo(Math.cos(angle) * activeR, Math.sin(angle) * activeR);
                c.lineTo(Math.cos(angle) * (r * 0.992), Math.sin(angle) * (r * 0.992));
                c.stroke();
            }
            c.restore();

            /* Die grid inside active area */
            c.save();
            c.beginPath();
            c.arc(0, 0, activeR, 0, Math.PI * 2);
            c.clip();

            const dw = this.dieWidth;
            const dh = this.dieHeight;
            const scribe = Math.max(1, Math.ceil(dw * 0.028));
            const pitchX = dw + scribe;
            const pitchY = dh + scribe;
            const cols = Math.ceil((activeR * 2) / pitchX) + 1;
            const rows = Math.ceil((activeR * 2) / pitchY) + 1;
            const ox = -(cols * pitchX) * 0.5;
            const oy = -(rows * pitchY) * 0.5;

            c.fillStyle = '#1e2635';
            c.beginPath();
            c.arc(0, 0, activeR, 0, Math.PI * 2);
            c.fill();

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = ox + col * pitchX;
                    const y = oy + row * pitchY;
                    const maxC = Math.max(Math.hypot(x, y), Math.hypot(x + dw, y), Math.hypot(x, y + dh), Math.hypot(x + dw, y + dh));
                    if (maxC > activeR - 2) continue;

                    c.drawImage(this.dieTemplate, x, y);

                    const dn = Math.hypot(x + dw * 0.5, y + dh * 0.5) / activeR;
                    const n = this.hash2D(col * 5.7, row * 9.3);
                    c.fillStyle = `rgba(${60 + n * 40},${80 + n * 30},${130 + n * 40},${0.01 + dn * 0.025 + n * 0.012})`;
                    c.fillRect(x, y, dw, dh);
                }
            }

            /* PCM test die locations */
            for (const [tc, tr] of [[Math.floor(cols * 0.5), Math.floor(rows * 0.5)], [Math.floor(cols * 0.35), Math.floor(rows * 0.35)], [Math.floor(cols * 0.65), Math.floor(rows * 0.65)]]) {
                const tx = ox + tc * pitchX;
                const ty = oy + tr * pitchY;
                const maxC = Math.max(Math.hypot(tx, ty), Math.hypot(tx + dw, ty), Math.hypot(tx, ty + dh), Math.hypot(tx + dw, ty + dh));
                if (maxC > activeR - 2) continue;
                c.fillStyle = 'rgba(60,75,100,0.18)';
                c.fillRect(tx + 1, ty + 1, dw - 2, dh - 2);
                c.strokeStyle = 'rgba(170,195,230,0.22)';
                c.lineWidth = 0.8;
                const mcx = tx + dw * 0.5;
                const mcy = ty + dh * 0.5;
                const ms = Math.min(dw, dh) * 0.18;
                c.beginPath();
                c.moveTo(mcx - ms, mcy); c.lineTo(mcx + ms, mcy);
                c.moveTo(mcx, mcy - ms); c.lineTo(mcx, mcy + ms);
                c.stroke();
            }

            c.restore();

            const procGrad = c.createRadialGradient(r * 0.04, -r * 0.04, 0, 0, 0, r);
            procGrad.addColorStop(0, 'rgba(70,90,130,0.06)');
            procGrad.addColorStop(0.4, 'rgba(50,70,110,0.02)');
            procGrad.addColorStop(0.8, 'rgba(30,40,70,0.08)');
            procGrad.addColorStop(1, 'rgba(15,22,38,0.12)');
            c.fillStyle = procGrad;
            c.beginPath();
            c.arc(0, 0, r, 0, Math.PI * 2);
            c.fill();

            c.restore();
            this.baseLayer = cvs;
        }

        /* ── Thin-film interference (gradient-based — instant) ─ */

        buildThinFilmLayer(size, r) {
            const cvs = document.createElement('canvas');
            cvs.width = size;
            cvs.height = size;
            const c = cvs.getContext('2d');

            c.save();
            c.translate(r, r);
            c.beginPath();
            c.arc(0, 0, r * 0.98, 0, Math.PI * 2);
            c.clip();

            /* Primary: SiO₂ 175 nm (centre) → 210 nm (edge) — ASTM colour chart
               175 nm = deep blue-violet, 210 nm = lighter blue */
            const primary = c.createRadialGradient(-r * 0.06, -r * 0.04, r * 0.04, 0, 0, r * 0.97);
            primary.addColorStop(0,    'rgba(55,  72,  200, 0.64)');
            primary.addColorStop(0.2,  'rgba(58,  78,  205, 0.60)');
            primary.addColorStop(0.4,  'rgba(65,  92,  210, 0.55)');
            primary.addColorStop(0.6,  'rgba(75,  108, 214, 0.48)');
            primary.addColorStop(0.75, 'rgba(85,  125, 212, 0.40)');
            primary.addColorStop(0.88, 'rgba(100, 145, 205, 0.30)');
            primary.addColorStop(0.96, 'rgba(120, 162, 195, 0.18)');
            primary.addColorStop(1,    'rgba(130, 170, 190, 0.08)');
            c.fillStyle = primary;
            c.beginPath();
            c.arc(0, 0, r, 0, Math.PI * 2);
            c.fill();

            /* Asymmetric process non-uniformity tint */
            const asym = c.createRadialGradient(r * 0.22, -r * 0.18, r * 0.08, r * 0.08, -r * 0.04, r * 0.65);
            asym.addColorStop(0, 'rgba(85, 55, 185, 0.10)');
            asym.addColorStop(0.5, 'rgba(65, 75, 195, 0.05)');
            asym.addColorStop(1, 'rgba(55, 90, 200, 0)');
            c.fillStyle = asym;
            c.beginPath();
            c.arc(0, 0, r, 0, Math.PI * 2);
            c.fill();

            /* CMP polish rings */
            c.strokeStyle = 'rgba(75, 115, 205, 0.04)';
            c.lineWidth = 1.2;
            for (let t = 0.18; t < 0.94; t += 0.11) {
                c.beginPath();
                c.arc(r * 0.02, -r * 0.01, r * t, 0, Math.PI * 2);
                c.stroke();
            }

            /* Warm tint on one side (second-order interference) */
            const warm = c.createLinearGradient(-r * 0.7, -r * 0.5, r * 0.8, r * 0.6);
            warm.addColorStop(0, 'rgba(120, 80, 200, 0.04)');
            warm.addColorStop(0.5, 'rgba(80, 70, 180, 0.02)');
            warm.addColorStop(1, 'rgba(60, 100, 180, 0.04)');
            c.fillStyle = warm;
            c.beginPath();
            c.arc(0, 0, r, 0, Math.PI * 2);
            c.fill();

            c.restore();
            this.thinFilmLayer = cvs;
        }

        /* ── Grain / noise texture ────────────────────────────── */

        buildGrainLayer(size) {
            const cvs = document.createElement('canvas');
            cvs.width = size;
            cvs.height = size;
            const c = cvs.getContext('2d');
            const imgData = c.createImageData(size, size);
            const px = imgData.data;
            for (let i = 0; i < px.length; i += 4) {
                const v = 80 + Math.floor(Math.random() * 100);
                px[i] = v; px[i + 1] = v; px[i + 2] = v; px[i + 3] = 12;
            }
            c.putImageData(imgData, 0, 0);
            this.grainLayer = cvs;
        }

        /* ═════════════════════════════════════════════════════════
         *  PER-FRAME DRAW — composites all layers with dynamics
         * ═════════════════════════════════════════════════════════ */

        draw(ts) {
            if (!this.ctx || !this.baseLayer || !this.thinFilmLayer || !this.grainLayer || !this.bounds.radius) return;

            const ctx = this.ctx;
            const W = this.bounds.width;
            const H = this.bounds.height;
            const R = this.bounds.radius;
            const motion = this.prefersReducedMotion ? 0 : 1;
            const isMobile = this.quality === 'mobile';
            const isBalanced = this.quality === 'balanced';

            const ease = this.prefersReducedMotion ? 1 : isMobile ? 0.042 : isBalanced ? 0.036 : 0.032;
            this.pointer.x += (this.pointer.targetX - this.pointer.x) * ease;
            this.pointer.y += (this.pointer.targetY - this.pointer.y) * ease;

            const ds = isMobile ? 0.66 : isBalanced ? 0.84 : 1;
            const driftX = motion * Math.sin(ts * 0.00011 + this.driftOffset) * 4.5 * ds;
            const driftY = motion * Math.cos(ts * 0.00009 + this.driftOffset * 0.75) * 2.8 * ds;
            const driftRot = motion * Math.sin(ts * 0.00005 + this.driftOffset) * 0.012 * ds;

            const biasX = W > 1100 ? 0.72 : W > 760 ? 0.68 : 0.62;
            const cx = W * biasX + (this.pointer.x * 8 + driftX) * motion;
            const cy = H * 0.57 + (this.pointer.y * 6 - this.scrollProgress * 18 + driftY) * motion;
            const rot = this.prefersReducedMotion ? -0.1 : (ts * 0.000032 + this.scrollProgress * 0.06 - 0.12 + driftRot);
            const reflEnergy = this.prefersReducedMotion ? 0.5 : (Math.sin(ts * 0.00055 + this.driftOffset) + 1) * 0.5;

            ctx.clearRect(0, 0, W, H);

            /* 1. Ambient glow */
            const aura = ctx.createRadialGradient(cx, cy, R * 0.18, cx, cy, R * 1.32);
            aura.addColorStop(0, 'rgba(100,160,220,0.16)');
            aura.addColorStop(0.5, 'rgba(70,120,180,0.05)');
            aura.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = aura;
            ctx.beginPath(); ctx.arc(cx, cy, R * 1.34, 0, Math.PI * 2); ctx.fill();

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rot);

            /* 2. Drop shadow */
            ctx.beginPath();
            ctx.ellipse(0, R * 0.88, R * 0.78, R * 0.16, 0, 0, Math.PI * 2);
            if (isMobile) { ctx.fillStyle = 'rgba(0,0,0,0.34)'; ctx.fill(); }
            else { ctx.fillStyle = 'rgba(0,0,0,0.44)'; ctx.filter = 'blur(14px)'; ctx.fill(); ctx.filter = 'none'; }

            /* 3. Clip to wafer */
            ctx.save();
            ctx.beginPath(); ctx.arc(0, 0, R * 0.99, 0, Math.PI * 2); ctx.clip();

            /* 4. Base layer */
            ctx.drawImage(this.baseLayer, -R, -R, R * 2, R * 2);

            /* 5. Thin-film interference */
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = isMobile ? 0.48 : isBalanced ? 0.54 : 0.58;
            ctx.rotate(-rot * 1.4 + this.pointer.x * 0.06 + this.pointer.y * 0.04);
            ctx.drawImage(this.thinFilmLayer, -R + this.pointer.x * R * 0.04, -R + this.pointer.y * R * 0.03, R * 2, R * 2);
            ctx.restore();

            /* 6. Grain */
            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = isMobile ? 0.07 : isBalanced ? 0.1 : 0.12;
            ctx.drawImage(this.grainLayer, -R, -R, R * 2, R * 2);
            ctx.restore();

            /* 7. Tilt-shade */
            if (!isMobile) {
                ctx.save();
                ctx.globalCompositeOperation = 'multiply';
                const tilt = ctx.createLinearGradient(
                    -R * 0.8 - this.pointer.x * R * 0.2, -R * 0.3 - this.pointer.y * R * 0.15,
                    R * 0.9 + this.pointer.x * R * 0.15, R * 0.35 + this.pointer.y * R * 0.1);
                tilt.addColorStop(0, 'rgba(0,6,16,0.01)');
                tilt.addColorStop(0.48, 'rgba(0,6,16,0.1)');
                tilt.addColorStop(1, 'rgba(0,6,16,0.22)');
                ctx.fillStyle = tilt;
                ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }

            /* 8. Specular */
            const vvx = this.pointer.x + driftX / Math.max(1, R);
            const vvy = this.pointer.y + driftY / Math.max(1, R);
            const lx = -R * 0.25 - vvx * R * 0.18;
            const ly = -R * 0.35 - vvy * R * 0.16;

            const spec = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 0.26);
            spec.addColorStop(0, `rgba(255,255,255,${0.75 + reflEnergy * 0.2})`);
            spec.addColorStop(0.18, `rgba(220,240,255,${0.2 + reflEnergy * 0.08})`);
            spec.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = spec;
            ctx.beginPath(); ctx.arc(lx, ly, R * 0.26, 0, Math.PI * 2); ctx.fill();

            const glint = ctx.createRadialGradient(lx * 0.97, ly * 0.97, 0, lx * 0.97, ly * 0.97, R * 0.055);
            glint.addColorStop(0, `rgba(255,255,255,${0.88 + reflEnergy * 0.1})`);
            glint.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = glint;
            ctx.beginPath(); ctx.arc(lx * 0.97, ly * 0.97, R * 0.055, 0, Math.PI * 2); ctx.fill();

            /* 9. Cleanroom tube streak */
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.translate(lx * 0.42, ly * 0.38);
            ctx.rotate(-0.32 + vvx * 0.2 + driftRot * 0.6);
            const tube = ctx.createLinearGradient(-R * 0.92, 0, R * 0.92, 0);
            tube.addColorStop(0, 'rgba(255,255,255,0)');
            tube.addColorStop(0.44, `rgba(200,228,255,${0.08 + reflEnergy * 0.04})`);
            tube.addColorStop(0.49, `rgba(255,255,255,${0.52 + reflEnergy * 0.14})`);
            tube.addColorStop(0.5, `rgba(255,255,255,${0.78 + reflEnergy * 0.16})`);
            tube.addColorStop(0.51, `rgba(255,255,255,${0.52 + reflEnergy * 0.14})`);
            tube.addColorStop(0.56, `rgba(200,228,255,${0.08 + reflEnergy * 0.04})`);
            tube.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = tube;
            ctx.fillRect(-R * 0.95, -R * 0.032, R * 1.9, R * 0.064);
            if (!isMobile) { ctx.globalAlpha = 0.4; ctx.translate(0, R * 0.06); ctx.fillRect(-R * 0.88, -R * 0.025, R * 1.76, R * 0.05); }
            ctx.restore();

            /* 10. Chromatic fringe */
            if (!isMobile) {
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.globalAlpha = 0.12 + reflEnergy * 0.05;
                const fA = Math.atan2(ly, lx) + Math.PI;
                const fR = R * 0.22;
                const fCx = lx + Math.cos(fA) * fR * 0.7;
                const fCy = ly + Math.sin(fA) * fR * 0.7;
                const fg = ctx.createRadialGradient(fCx, fCy, fR * 0.3, fCx, fCy, fR);
                fg.addColorStop(0, 'rgba(180,140,255,0.3)');
                fg.addColorStop(0.35, 'rgba(100,180,255,0.25)');
                fg.addColorStop(0.6, 'rgba(120,255,180,0.2)');
                fg.addColorStop(0.8, 'rgba(255,220,100,0.15)');
                fg.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = fg;
                ctx.beginPath(); ctx.arc(fCx, fCy, fR, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }

            /* 11. DoF blur at edges */
            if (!isMobile) {
                const dofS = isBalanced ? 0.72 : 1;
                const dofI = R * (isBalanced ? 0.78 : 0.75);
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, 0, R * 0.995, 0, Math.PI * 2);
                ctx.arc(0, 0, dofI, 0, Math.PI * 2, true);
                ctx.clip();
                ctx.globalAlpha = 0.14 * dofS;
                ctx.filter = `blur(${Math.max(2, R * 0.01 * dofS)}px)`;
                ctx.drawImage(this.baseLayer, -R, -R, R * 2, R * 2);
                ctx.globalCompositeOperation = 'screen';
                ctx.globalAlpha = 0.07 * dofS;
                ctx.rotate(-rot * 1.1);
                ctx.drawImage(this.thinFilmLayer, -R, -R, R * 2, R * 2);
                ctx.filter = 'none';
                ctx.restore();
            }

            /* 12. Vignette */
            const vig = ctx.createRadialGradient(0, 0, R * 0.52, 0, 0, R * 1.02);
            vig.addColorStop(0, 'rgba(0,0,0,0)');
            vig.addColorStop(0.7, 'rgba(0,0,0,0.18)');
            vig.addColorStop(1, 'rgba(0,0,0,0.46)');
            ctx.fillStyle = vig;
            ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();

            ctx.restore(); /* end wafer clip */

            /* 13. Notch */
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath(); ctx.arc(0, R * 0.985, R * 0.042, 0, Math.PI, true); ctx.fill();
            ctx.restore();

            /* 14. Bevel ring */
            const bevelW = Math.max(2.5, R * 0.012);
            let rim;
            if (typeof ctx.createConicGradient === 'function') {
                rim = ctx.createConicGradient(0, 0, 0);
                rim.addColorStop(0, 'rgba(200,218,240,0.92)');
                rim.addColorStop(0.15, 'rgba(240,245,255,0.98)');
                rim.addColorStop(0.35, 'rgba(140,170,210,0.88)');
                rim.addColorStop(0.55, 'rgba(200,220,245,0.94)');
                rim.addColorStop(0.75, 'rgba(240,248,255,0.96)');
                rim.addColorStop(0.9, 'rgba(160,185,220,0.9)');
                rim.addColorStop(1, 'rgba(200,218,240,0.92)');
            } else {
                rim = ctx.createLinearGradient(-R, -R, R, R);
                rim.addColorStop(0, 'rgba(240,245,255,0.96)');
                rim.addColorStop(0.4, 'rgba(160,190,225,0.9)');
                rim.addColorStop(0.7, 'rgba(200,220,245,0.94)');
                rim.addColorStop(1, 'rgba(240,248,255,0.92)');
            }
            ctx.strokeStyle = rim;
            ctx.lineWidth = bevelW;
            ctx.shadowColor = 'rgba(140,200,255,0.2)';
            ctx.shadowBlur = isMobile ? R * 0.015 : R * 0.04;
            ctx.beginPath(); ctx.arc(0, 0, R * 0.995, 0, Math.PI * 2); ctx.stroke();
            ctx.shadowBlur = 0;

            if (!isMobile) {
                ctx.strokeStyle = 'rgba(100,130,170,0.18)';
                ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.arc(0, 0, R * 0.985, 0, Math.PI * 2); ctx.stroke();
            }

            /* 15. Laser wafer ID */
            if (!isMobile) {
                ctx.save();
                ctx.globalAlpha = 0.15;
                ctx.fillStyle = '#8aa0c0';
                ctx.font = `${Math.max(5, R * 0.016)}px monospace`;
                ctx.textAlign = 'center';
                ctx.fillText('T4 N05-2287', 0, R * 0.93);
                ctx.restore();
            }

            ctx.restore(); /* end translate */
        }

        /* ═════════════════════════════════════════════════════════
         *  UTILITIES
         * ═════════════════════════════════════════════════════════ */

        hash2D(x, y) {
            const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
            return v - Math.floor(v);
        }

        clamp(val, min, max) {
            return Math.min(max, Math.max(min, val));
        }
    }

    /* ── Bootstrap ──────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        const heroRoot = document.querySelector(HERO_SELECTOR);
        if (!heroRoot) return;
        const scene = new WaferHeroRealism(heroRoot);
        scene.init();
    });
})();
