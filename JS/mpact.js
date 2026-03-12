/* Scroll reveal */
(function () {
    const els = document.querySelectorAll('.ml-reveal');
    if (!els.length) return;

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        },
        { threshold: 0.10, rootMargin: '0px 0px -36px 0px' }
    );

    els.forEach(el => io.observe(el));
})();

/* Copy acknowledgement — event-delegated */
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-copy[data-copy-target]');
    if (!btn) return;
    const targetId = btn.getAttribute('data-copy-target');
    const el = document.getElementById(targetId);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(function () {
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(function () {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
});

/* Sticky divider animation */
(function () {
    const divider = document.querySelector('.hero-divider');
    const header = document.querySelector('.site-header');
    if (!divider) return;

    const updateDivider = () => {
        const headerHeight = header ? header.offsetHeight : 80;
        const dividerRect = divider.getBoundingClientRect();

        // Activate the divider animation seamlessly just before it sticks
        // Triggering earlier (+ 300px) gives it a slower "coming to life" feel
        if (dividerRect.top <= headerHeight + 300) {
            divider.classList.add('is-stuck');
        } else {
            divider.classList.remove('is-stuck');
        }
    };

    window.addEventListener('scroll', updateDivider, { passive: true });
    updateDivider();
})();

/* ── Facility Buildout: YouTube IFrame API + Phase Sync ─── */
(function () {
    var mediaSection = document.getElementById('buildout-media');
    if (!mediaSection) return;

    var phaseItems = mediaSection.querySelectorAll('.ml-buildout__timeline-item[data-start]');
    var progressBar = mediaSection.querySelector('.ml-buildout__timeline-progress');
    var phaseDots = mediaSection.querySelectorAll('.ml-buildout__phase-dot[data-phase-index]');
    var ytPlayer = null;
    var phaseInterval = null;

    // Build phase map from data attributes (seconds)
    var phases = [];
    phaseItems.forEach(function (el) {
        phases.push({
            el: el,
            start: parseFloat(el.getAttribute('data-start')),
            end: parseFloat(el.getAttribute('data-end'))
        });
    });

    // Load YouTube IFrame API script
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    // YouTube API ready callback (must be global)
    window.onYouTubeIframeAPIReady = function () {
        ytPlayer = new YT.Player('buildout-yt-player', {
            videoId: 'pZgxggxylLM',
            playerVars: {
                rel: 0,
                modestbranding: 1,
                color: 'white',
                playsinline: 1
            },
            events: {
                onStateChange: onPlayerStateChange
            }
        });
    };

    function onPlayerStateChange(event) {
        clearInterval(phaseInterval);
        if (event.data === YT.PlayerState.PLAYING) {
            phaseInterval = setInterval(syncPhases, 250);
        }
    }

    function syncPhases() {
        if (!ytPlayer) return;
        var t = ytPlayer.getCurrentTime();
        phases.forEach(function (p, i) {
            var isActive = t >= p.start && t < p.end;
            p.el.setAttribute('data-active', isActive ? 'true' : 'false');
            if (phaseDots[i]) {
                phaseDots[i].setAttribute('data-active', isActive ? 'true' : 'false');
            }
        });
        if (progressBar && ytPlayer.getDuration) {
            var dur = ytPlayer.getDuration() || 60;
            var pct = Math.min(t / dur, 1) * 100;
            progressBar.style.height = pct + '%';
        }
    }

    phaseDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            if (!ytPlayer || typeof ytPlayer.seekTo !== 'function') return;
            var seekTo = parseFloat(dot.getAttribute('data-seek-to'));
            if (isNaN(seekTo)) return;
            ytPlayer.seekTo(seekTo, true);
            if (ytPlayer.getPlayerState() === YT.PlayerState.PAUSED ||
                ytPlayer.getPlayerState() === YT.PlayerState.ENDED) {
                ytPlayer.playVideo();
            }
            syncPhases();
        });
    });

    // Scroll reveal for timeline items
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animated = false;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !animated) {
                animated = true;
                observer.unobserve(entry.target);
                if (prefersReducedMotion) {
                    phaseItems.forEach(function (item) { item.classList.add('is-visible'); });
                    return;
                }
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(phaseItems,
                        { opacity: 0, x: -30, scale: 0.97 },
                        { opacity: 1, x: 0, scale: 1, duration: 0.7, stagger: 0.18, ease: 'power3.out',
                          onStart: function () {
                              phaseItems.forEach(function (item, i) {
                                  setTimeout(function () { item.classList.add('is-visible'); }, i * 180);
                              });
                          }
                        }
                    );
                } else {
                    phaseItems.forEach(function (item, i) {
                        setTimeout(function () { item.classList.add('is-visible'); }, i * 200);
                    });
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    observer.observe(mediaSection);
})();

/* Extracted from MPaCT.html */
(function() {
    'use strict';
const fabSection = document.getElementById('cleanroom-fab');

                                const stageData = [
                                    {
                                        title: "1. Monocrystalline Silicon Substrate",
                                        desc: "An ultra-pure (11N) monocrystalline silicon wafer, grown via the Czochralski process and polished to atomic flatness.",
                                        detail: "Foundry processes begin with electronic-grade silicon (99.999999999% pure). The substrate is sliced from a single-crystal boule and undergoes rigorous Chemical Mechanical Planarization (CMP). Surface roughness must be sub-nanometer to ensure extreme uniformity for advanced high-k metal gate (HKMG) transistor fabrication and precise photolithographic depth-of-focus."
                                    },
                                    {
                                        title: "2. Photoresist Spin Coating",
                                        desc: "Under actinic yellow lighting, a Chemically Amplified Resist (CAR) is dispensed and spin-coated to a highly uniform nanometer-scale thickness.",
                                        detail: "The cleanroom transitions to actinic (yellow) safe-lighting to prevent premature UV exposure. Advanced Extreme Ultraviolet (EUV) resists, such as metal-oxide or highly sensitive chemically amplified resists, are dispensed as a liquid. High-speed centripetal rotation (up to 6000 RPM) guarantees a perfectly planar, ultra-thin film critical for resolving sub-10nm critical dimensions (CD)."
                                    },
                                    {
                                        title: "3. EUV Lithography Exposure",
                                        desc: "13.5nm Extreme Ultraviolet photons reflect off a Mo/Si multilayer mask, initiating a cascade of photoacid generators (PAGs) to pattern the resist.",
                                        detail: "State-of-the-art TSMC nodes rely on EUV lithography. Because 13.5nm light is absorbed by all matter (including air and glass), the system operates in a hard vacuum using Bragg reflector optics (alternating layers of Molybdenum and Silicon). The photons strike the resist, creating a latent image via photoacids that drastically alters the polymer's solubility during the subsequent developer bake."
                                    },
                                    {
                                        title: "4. Plasma Etch & BEOL Metallization",
                                        desc: "Anisotropic Reactive Ion Etching (RIE) carves the silicon, followed by copper dual-damascene electroplating for the interconnect wiring.",
                                        detail: "After the Front-End-Of-Line (FEOL) forms the actual FinFET/GAA transistor gates, the chip requires intricate wiring wiring. This Back-End-Of-Line (BEOL) uses a dual-damascene process. Trenches are carved into low-k dielectric insulators using highly directional plasma etching (RIE). These trenches are then seeded, electroplated with solid copper, and polished flat via CMP to build the 3D interconnect network."
                                    },
                                    {
                                        title: "5. Wafer Dicing & Tape Expansion",
                                        desc: "The wafer is singulated via laser grooving or mechanical blade dicing. The underlying UV-release tape is expanded radially to physically separate the dies.",
                                        detail: "A standard 300mm wafer contains hundreds of microscopic dies. Post-fabrication, they are separated along 'scribe lines' using stealth dicing (lasers) or ultra-thin diamond blades. To prevent the brittle, high-value chips from fracturing against one another, the wafer sits on a flexible polymer dicing tape. This tape is mechanically stretched outward, safely separating the dies for automated robotic pick-and-place packaging."
                                    }
                                ];

                                const container = document.getElementById('fab-canvas-container');
                                const scene = new THREE.Scene();

                                const fogColorWhite = new THREE.Color(0xf1f5f9);
                                const fogColorActinic = new THREE.Color(0xffeb99);
                                scene.fog = new THREE.FogExp2(fogColorWhite, 0.012);

                                const getW = () => fabSection.offsetWidth;
                                const getH = () => fabSection.offsetHeight;

                                const camera = new THREE.PerspectiveCamera(45, getW() / getH(), 0.1, 1000);
                                camera.position.set(0, 25, 30); camera.lookAt(0, 0, 0);

                                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
                                renderer.setSize(getW(), getH());
                                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                                renderer.toneMappingExposure = 1.0;
                                container.appendChild(renderer.domElement);

                                const pmremGenerator = new THREE.PMREMGenerator(renderer);
                                pmremGenerator.compileEquirectangularShader();
                                scene.environment = pmremGenerator.fromScene(new THREE.RoomEnvironment(), 0.04).texture;

                                const controls = new THREE.OrbitControls(camera, renderer.domElement);
                                controls.enableDamping = true;
                                controls.dampingFactor = 0.05;
                                controls.enablePan = false;
                                controls.maxDistance = 45;
                                controls.minDistance = 8;
                                controls.maxPolarAngle = Math.PI / 2 - 0.05;

                                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                                const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); scene.add(ambientLight);
                                const mainLight = new THREE.DirectionalLight(0xffffff, 1.2); mainLight.position.set(5, 20, 5); scene.add(mainLight);
                                // EUV plasma is actually incredibly bright and high-energy (generated from tin plasma). Emulating that sharp burst:
                                const exposureLight = new THREE.PointLight(0xa8e6ff, 0, 50); exposureLight.position.set(0, 15, 0); scene.add(exposureLight);
                                const laserLight = new THREE.PointLight(0xff0000, 0, 20); scene.add(laserLight);

                                function generateRadialRoughness() {
                                    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1024;
                                    const ctx = canvas.getContext('2d');
                                    ctx.fillStyle = 'rgb(30, 30, 30)'; ctx.fillRect(0, 0, 1024, 1024);
                                    ctx.lineWidth = 1;
                                    for (let i = 2; i < 512; i += 2) {
                                        const noise = Math.random() * 30;
                                        ctx.strokeStyle = `rgb(${30 + noise}, ${30 + noise}, ${30 + noise})`;
                                        ctx.beginPath(); ctx.arc(512, 512, i, 0, Math.PI * 2); ctx.stroke();
                                    }
                                    return new THREE.CanvasTexture(canvas);
                                }

                                function generateCircuitPatternTexture() {
                                    const canvas = document.createElement('canvas');
                                    canvas.width = 1024; canvas.height = 1024;
                                    const ctx = canvas.getContext('2d');

                                    // Base color
                                    ctx.fillStyle = '#64748b';
                                    ctx.fillRect(0, 0, 1024, 1024);

                                    // Trace styles
                                    ctx.strokeStyle = '#b0bac6';
                                    ctx.lineWidth = 12;
                                    ctx.lineCap = 'round';
                                    ctx.lineJoin = 'round';

                                    // Seeded RNG for consistent patterns
                                    let seed = 12345;
                                    const random = () => {
                                        let x = Math.sin(seed++) * 10000;
                                        return x - Math.floor(x);
                                    };

                                    const gridSize = 64;
                                    // Draw main traces
                                    for (let i = 0; i < 60; i++) {
                                        ctx.beginPath();
                                        let startX = Math.floor(random() * (1024 / gridSize)) * gridSize;
                                        let startY = Math.floor(random() * (1024 / gridSize)) * gridSize;
                                        ctx.moveTo(startX, startY);

                                        let segments = Math.floor(random() * 5) + 2;
                                        let curX = startX, curY = startY;

                                        for (let s = 0; s < segments; s++) {
                                            let dir = Math.floor(random() * 4);
                                            let len = (Math.floor(random() * 4) + 1) * gridSize;

                                            if (dir === 0) curY -= len; // Up
                                            else if (dir === 1) curX += len; // Right
                                            else if (dir === 2) curY += len; // Down
                                            else if (dir === 3) curX -= len; // Left

                                            // 45 degree angle routing chance
                                            if (random() > 0.7) {
                                                curX += gridSize;
                                                curY += gridSize;
                                            }

                                            // Clamp
                                            curX = Math.max(0, Math.min(1024, curX));
                                            curY = Math.max(0, Math.min(1024, curY));
                                            ctx.lineTo(curX, curY);

                                            // Draw nodes
                                            if (random() > 0.6) {
                                                ctx.fillStyle = '#b0bac6';
                                                ctx.moveTo(curX, curY);
                                                ctx.arc(curX, curY, 16, 0, Math.PI * 2);
                                            }
                                        }
                                        ctx.stroke();
                                    }

                                    // Draw dense logic blocks / IC pads
                                    ctx.fillStyle = '#b0bac6';
                                    for (let i = 0; i < 15; i++) {
                                        let px = Math.floor(random() * (1024 / gridSize)) * gridSize;
                                        let py = Math.floor(random() * (1024 / gridSize)) * gridSize;
                                        let w = (Math.floor(random() * 3) + 1) * gridSize;
                                        let h = (Math.floor(random() * 3) + 1) * gridSize;
                                        ctx.fillRect(px + 8, py + 8, w - 16, h - 16);
                                        // Internal pad vias
                                        ctx.fillStyle = '#64748b';
                                        ctx.beginPath();
                                        ctx.arc(px + w / 2, py + h / 2, 8, 0, Math.PI * 2);
                                        ctx.fill();
                                        ctx.fillStyle = '#b0bac6';
                                    }

                                    const tex = new THREE.CanvasTexture(canvas);
                                    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
                                    return tex;
                                }

                                const radialRoughness = generateRadialRoughness();
                                const etchGridTex = generateCircuitPatternTexture();

                                // 11N Silicon: Highly reflective, metallic grey.
                                const matSilicon = new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15, roughnessMap: radialRoughness, clearcoat: 1.0, clearcoatRoughness: 0.05 });
                                // Exposed Resist/Etched SiO2: Slightly frosted transparent look.
                                const matEtchOverlay = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: etchGridTex, metalness: 0.2, roughness: 0.6, transparent: true, opacity: 0, depthWrite: false });
                                // CAR Photoresist: Thin, refractive polymer.
                                const matResist = new THREE.MeshPhysicalMaterial({ color: 0xcc6600, metalness: 0.0, roughness: 0.1, transmission: 0.95, thickness: 0.05, transparent: true, opacity: 0 });
                                // Copper BEOL (Backend of Line): Pure, polished copper.
                                const matDie = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 1.0, roughness: 0.2, clearcoat: 0.3, transparent: true, opacity: 0 });
                                const matDiePatterned = new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, map: etchGridTex, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0 });

                                const systemGroup = new THREE.Group(); scene.add(systemGroup);
                                systemGroup.rotation.x = Math.PI / 16;
                                const waferGroup = new THREE.Group(); systemGroup.add(waferGroup);

                                const radius = 12;
                                const platter = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.2, 128), matSilicon);
                                platter.position.y = -0.1; platter.userData.name = "Monocrystalline Silicon Substrate";
                                waferGroup.add(platter);

                                const etchOverlay = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), matEtchOverlay);
                                etchOverlay.rotation.x = -Math.PI / 2; etchOverlay.position.y = 0.005;
                                waferGroup.add(etchOverlay);

                                const flatEdge = new THREE.Mesh(new THREE.BoxGeometry(8, 0.25, 1), matSilicon);
                                flatEdge.position.set(0, -0.1, 11.8); waferGroup.add(flatEdge);

                                const resistFilm = new THREE.Mesh(new THREE.CylinderGeometry(radius - 0.05, radius - 0.05, 0.03, 64), matResist);
                                resistFilm.position.y = 0.015; resistFilm.scale.set(0.001, 1, 0.001); resistFilm.visible = false;
                                resistFilm.userData.name = "Liquid Photoresist Film";
                                waferGroup.add(resistFilm);

                                const maskGroup = new THREE.Group(); maskGroup.position.y = 20; maskGroup.visible = false; systemGroup.add(maskGroup);
                                maskGroup.add(new THREE.Mesh(new THREE.BoxGeometry(26, 0.5, 26), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2, wireframe: true })));
                                const mirror = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 1.0, roughness: 0.02, side: THREE.DoubleSide }));
                                mirror.rotation.x = -Math.PI / 2; mirror.userData.name = "EUV Multilayer Reflector Mask";
                                maskGroup.add(mirror);
                                const layoutPattern = new THREE.GridHelper(24, 12, 0x050505, 0x050505); layoutPattern.position.y = -0.01;
                                maskGroup.add(layoutPattern);

                                const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 15, 8), new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
                                laserBeam.position.y = 7.5; laserBeam.visible = false; systemGroup.add(laserBeam);

                                const chipsData = []; const dummy = new THREE.Object3D();
                                const gridSize = 24; const chipSize = 0.85; const gap = 0.12;
                                const validPositions = [];
                                for (let x = -gridSize / 2; x < gridSize / 2; x++) {
                                    for (let z = -gridSize / 2; z < gridSize / 2; z++) {
                                        const pX = x * (chipSize + gap); const pZ = z * (chipSize + gap);
                                        if (Math.sqrt(pX * pX + pZ * pZ) < radius - 0.8) validPositions.push({ x: pX, z: pZ });
                                    }
                                }

                                const chipGeo = new THREE.BoxGeometry(chipSize, 0.25, chipSize); chipGeo.translate(0, 0.125, 0);
                                // Set multi-material: top face gets pattern, others get copper
                                // Faces: right(0), left(1), top(2), bottom(3), front(4), back(5)
                                const dieMaterials = [matDie, matDie, matDiePatterned, matDie, matDie, matDie];
                                const chipInstanced = new THREE.InstancedMesh(chipGeo, dieMaterials, validPositions.length);
                                chipInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                                chipInstanced.userData.name = "Copper BEOL Interconnects";
                                waferGroup.add(chipInstanced);

                                validPositions.forEach((pos, i) => {
                                    const data = { x: pos.x, y: 0, z: pos.z, originX: pos.x, originZ: pos.z, scaleX: 1, scaleY: 0.01, scaleZ: 1, index: i };
                                    chipsData.push(data);
                                    dummy.position.set(data.x, data.y, data.z); dummy.scale.set(data.scaleX, data.scaleY, data.scaleZ);
                                    dummy.updateMatrix(); chipInstanced.setMatrixAt(i, dummy.matrix);
                                });

                                const sparkCount = prefersReducedMotion ? 30 : 100;
                                const sparkGeo = new THREE.BufferGeometry(); const sparkPos = new Float32Array(sparkCount * 3); const sparkVel = [];
                                for (let i = 0; i < sparkCount; i++) { sparkPos[i * 3] = 0; sparkPos[i * 3 + 1] = -100; sparkPos[i * 3 + 2] = 0; sparkVel.push(new THREE.Vector3()); }
                                sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
                                const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xffaa00, size: 0.12, blending: THREE.AdditiveBlending, transparent: true }));
                                systemGroup.add(sparks);

                                let lastLaserX = 0; let lastLaserZ = 0;
                                function updateSparks(dt) {
                                    const positions = sparks.geometry.attributes.position.array;
                                    if (laserBeam.visible && (Math.abs(laserBeam.position.x - lastLaserX) > 0.01 || Math.abs(laserBeam.position.z - lastLaserZ) > 0.01)) {
                                        for (let i = 0; i < sparkCount; i++) {
                                            if (positions[i * 3 + 1] < -10) {
                                                positions[i * 3] = laserBeam.position.x; positions[i * 3 + 1] = laserBeam.position.y; positions[i * 3 + 2] = laserBeam.position.z;
                                                sparkVel[i].set((Math.random() - 0.5) * 3, Math.random() * 4 + 1, (Math.random() - 0.5) * 3);
                                                break;
                                            }
                                        }
                                    }
                                    lastLaserX = laserBeam.position.x; lastLaserZ = laserBeam.position.z;
                                    let isActive = false;
                                    for (let i = 0; i < sparkCount; i++) {
                                        if (positions[i * 3 + 1] > -10) {
                                            isActive = true; sparkVel[i].y -= 9.8 * dt;
                                            positions[i * 3] += sparkVel[i].x * dt; positions[i * 3 + 1] += sparkVel[i].y * dt; positions[i * 3 + 2] += sparkVel[i].z * dt;
                                        }
                                    }
                                    if (isActive) sparks.geometry.attributes.position.needsUpdate = true;
                                }

                                const raycaster = new THREE.Raycaster();
                                const mouse = new THREE.Vector2();
                                const tooltip = document.getElementById('fab-tooltip');
                                const interactables = [platter, resistFilm, mirror, chipInstanced];

                                fabSection.addEventListener('mousemove', (e) => {
                                    const rect = fabSection.getBoundingClientRect();
                                    mouse.x = ((e.clientX - rect.left) / getW()) * 2 - 1;
                                    mouse.y = -((e.clientY - rect.top) / getH()) * 2 + 1;
                                    if (tooltip) {
                                        tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
                                        tooltip.style.top = (e.clientY - rect.top + 15) + 'px';
                                    }
                                });

                                const scrubber = document.getElementById('fab-timeline-slider');
                                const timeCurrent = document.getElementById('fab-time-current');
                                const timeTotal = document.getElementById('fab-time-total');
                                const playPauseBtn = document.getElementById('fab-btn-playpause');
                                const playPauseIcon = document.getElementById('fab-icon-play');
                                const playPauseText = document.getElementById('fab-txt-playpause');
                                const titleEl = document.getElementById('fab-stage-title');
                                const descEl = document.getElementById('fab-stage-desc');
                                const stageSelect = document.getElementById('fab-stage-select');
                                let currentStageIndex = 0;

                                const masterTl = gsap.timeline({
                                    paused: true,
                                    onUpdate: function () {
                                        if (scrubber) scrubber.value = this.progress() * 100;
                                        if (timeCurrent) timeCurrent.innerText = this.time().toFixed(1) + "s";
                                        let activeStage = 0;
                                        if (this.time() >= this.labels["stage4"]) activeStage = 4;
                                        else if (this.time() >= this.labels["stage3"]) activeStage = 3;
                                        else if (this.time() >= this.labels["stage2"]) activeStage = 2;
                                        else if (this.time() >= this.labels["stage1"]) activeStage = 1;
                                        if (activeStage !== currentStageIndex) {
                                            currentStageIndex = activeStage;
                                            updateUIData(activeStage);
                                        }
                                        const isActinicPhase = (this.time() >= this.labels["stage1"] && this.time() < this.labels["stage3"]);
                                        if (isActinicPhase && !fabSection.classList.contains('fab-actinic-mode')) setActinicMode(true);
                                        else if (!isActinicPhase && fabSection.classList.contains('fab-actinic-mode')) setActinicMode(false);
                                    },
                                    onPlay: () => {
                                        if (playPauseIcon) playPauseIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
                                        if (playPauseText) playPauseText.innerText = "PAUSE";
                                        controls.enabled = false;
                                    },
                                    onPause: () => {
                                        if (playPauseIcon) playPauseIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
                                        if (playPauseText) playPauseText.innerText = masterTl.progress() === 1 ? "RESTART" : "PLAY";
                                        controls.enabled = true;
                                    }
                                });

                                masterTl.addLabel("stage0", 0);

                                masterTl.addLabel("stage1", 0.5);
                                masterTl.to(camera.position, { x: 0, y: 30, z: 20, duration: 1.5, ease: "power2.inOut" }, "stage1");
                                masterTl.to(controls.target, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power2.inOut" }, "stage1");
                                masterTl.to(camera, { fov: 40, duration: 1.5, onUpdate: () => camera.updateProjectionMatrix() }, "stage1");
                                masterTl.set(resistFilm, { visible: true }, "stage1");
                                masterTl.to(matResist, { opacity: 0.85, duration: 0.1 }, "stage1");
                                masterTl.to(waferGroup.rotation, { y: Math.PI * 6, duration: 2.5, ease: "power2.inOut" }, "stage1");
                                masterTl.to(resistFilm.scale, { x: 1, z: 1, duration: 1.5, ease: "power1.inOut" }, "stage1+=0.5");
                                masterTl.addPause();

                                masterTl.addLabel("stage2", masterTl.duration() + 0.1);
                                masterTl.to(camera.position, { x: 0, y: 15, z: 30, duration: 1.5, ease: "power2.inOut" }, "stage2");
                                masterTl.to(controls.target, { x: 0, y: 5, z: 0, duration: 1.5, ease: "power2.inOut" }, "stage2");
                                masterTl.set(maskGroup, { visible: true }, "stage2");
                                masterTl.to(maskGroup.position, { y: 3, duration: 1.5, ease: "back.out(1.2)" }, "stage2");
                                // Sharp EUV burst
                                masterTl.to(exposureLight, { intensity: 40, duration: 0.05 }, "stage2+=1.5");
                                masterTl.to(matResist.color, { r: 0.3, g: 0.05, b: 0.05, duration: 0.1 }, "stage2+=1.55");
                                masterTl.to(exposureLight, { intensity: 0, duration: 0.3 }, "stage2+=1.55");
                                masterTl.to(maskGroup.position, { y: 20, duration: 1.5, ease: "power2.in" }, "stage2+=2.0");
                                masterTl.set(maskGroup, { visible: false }, "stage2+=3.5");
                                masterTl.addPause();

                                masterTl.addLabel("stage3", masterTl.duration() + 0.1);
                                masterTl.to(camera.position, { x: 0, y: 8, z: 18, duration: 1.5, ease: "power2.inOut" }, "stage3");
                                masterTl.to(controls.target, { x: 0, y: 0, z: 5, duration: 1.5, ease: "power2.inOut" }, "stage3");
                                masterTl.to(camera, { fov: 50, duration: 1.5, onUpdate: () => camera.updateProjectionMatrix() }, "stage3");
                                masterTl.to(matEtchOverlay, { opacity: 0.8, duration: 0.5 }, "stage3+=1.0");
                                masterTl.to(matResist, { opacity: 0, duration: 0.5 }, "stage3+=1.0");
                                masterTl.set(resistFilm, { visible: false }, "stage3+=1.5");
                                masterTl.to([matDie, matDiePatterned], { opacity: 1, duration: 0.5 }, "stage3+=1.5");
                                masterTl.to(chipsData, { scaleY: 1, duration: 1.0, ease: "back.out(1.5)", stagger: { amount: 1.5, from: "center" } }, "stage3+=1.5");
                                masterTl.addPause();

                                masterTl.addLabel("stage4", masterTl.duration() + 0.1);
                                masterTl.to(camera.position, { x: 0, y: 22, z: 25, duration: 1.5, ease: "power2.inOut" }, "stage4");
                                masterTl.to(controls.target, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power2.inOut" }, "stage4");
                                masterTl.to(camera, { fov: 45, duration: 1.5, onUpdate: () => camera.updateProjectionMatrix() }, "stage4");
                                masterTl.set(laserBeam, { visible: true }, "stage4+=1.0");
                                masterTl.fromTo(laserBeam.material, { opacity: 0 }, { opacity: 0.8, duration: 0.1 }, "stage4+=1.0");
                                masterTl.to(laserLight, { intensity: 8, duration: 0.2 }, "stage4+=1.0");
                                masterTl.fromTo(laserBeam.position, { x: -12, z: 0 }, { x: 12, z: 0, duration: 0.8, ease: "none" }, "stage4+=1.2");
                                masterTl.fromTo(laserBeam.position, { x: 0, z: -12 }, { x: 0, z: 12, duration: 0.8, ease: "none" }, "stage4+=2.0");
                                masterTl.to(laserLight, { intensity: 0, duration: 0.2 }, "stage4+=2.8");
                                masterTl.to(laserBeam.material, { opacity: 0, duration: 0.1 }, "stage4+=2.8");
                                masterTl.set(laserBeam, { visible: false }, "stage4+=2.9");
                                masterTl.to([platter.position, flatEdge.position], { y: -0.5, duration: 1.5, ease: "power2.inOut" }, "stage4+=3.0");
                                masterTl.to(etchOverlay.position, { y: -0.495, duration: 1.5, ease: "power2.inOut" }, "stage4+=3.0");
                                const expansionFactor = 1.15;
                                masterTl.to(chipsData, { x: (i, target) => target.originX * expansionFactor, z: (i, target) => target.originZ * expansionFactor, duration: 2.0, ease: "power2.inOut" }, "stage4+=3.0");
                                const pickIndices = chipsData.filter((_, i) => i % 17 === 0);
                                masterTl.to(pickIndices, { y: 3.0, duration: 1.0, ease: "power1.inOut", stagger: 0.1 }, "stage4+=4.5");
                                masterTl.to(pickIndices, { scaleX: 0, scaleY: 0, scaleZ: 0, duration: 0.5, ease: "power1.in", stagger: 0.1 }, "stage4+=5.0");
                                masterTl.addPause();

                                setTimeout(() => {
                                    if (timeTotal) timeTotal.innerText = masterTl.duration().toFixed(1) + "s";
                                }, 100);

                                function setActinicMode(active) {
                                    if (active) {
                                        fabSection.classList.add('fab-actinic-mode');
                                        gsap.to(scene.fog.color, { r: fogColorActinic.r, g: fogColorActinic.g, b: fogColorActinic.b, duration: 0.5 });
                                        gsap.to(ambientLight.color, { r: 1.0, g: 0.8, b: 0.2, duration: 0.5 });
                                        gsap.to(mainLight, { intensity: 0.3, duration: 0.5 });
                                    } else {
                                        fabSection.classList.remove('fab-actinic-mode');
                                        gsap.to(scene.fog.color, { r: fogColorWhite.r, g: fogColorWhite.g, b: fogColorWhite.b, duration: 0.5 });
                                        gsap.to(ambientLight.color, { r: 1.0, g: 1.0, b: 1.0, duration: 0.5 });
                                        gsap.to(mainLight, { intensity: 1.0, duration: 0.5 });
                                    }
                                }

                                function updateUIData(stage) {
                                    if (stageSelect) stageSelect.value = stage;
                                    if (titleEl) titleEl.innerText = stageData[stage].title;
                                    if (descEl) descEl.innerText = stageData[stage].desc;
                                    const learnContent = document.getElementById('fab-learn-content');
                                    if (learnContent) {
                                        learnContent.innerHTML = `<h3>${stageData[stage].title}</h3><p>${stageData[stage].detail}</p>`;
                                    }
                                }

                                if (playPauseBtn) {
                                    playPauseBtn.addEventListener('click', () => {
                                        if (masterTl.progress() === 1) { masterTl.pause(0); masterTl.play(); }
                                        else if (masterTl.isActive()) { masterTl.pause(); }
                                        else { masterTl.play(); }
                                    });
                                }

                                if (scrubber) {
                                    scrubber.addEventListener('input', (e) => {
                                        masterTl.pause();
                                        masterTl.progress(e.target.value / 100);
                                    });
                                }

                                if (stageSelect) {
                                    stageSelect.addEventListener('change', (e) => {
                                        masterTl.pause();
                                        masterTl.seek("stage" + e.target.value);
                                    });
                                }

                                const btnHome = document.getElementById('fab-btn-home');
                                if (btnHome) {
                                    btnHome.addEventListener('click', () => {
                                        gsap.to(camera.position, { x: 0, y: 25, z: 30, duration: 1, ease: "power2.out" });
                                        gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.out" });
                                    });
                                }

                                const helpModal = document.getElementById('fab-help-modal');
                                const btnHelp = document.getElementById('fab-btn-help');
                                const btnCloseHelp = document.getElementById('fab-btn-close-help');
                                if (btnHelp && helpModal) btnHelp.addEventListener('click', () => helpModal.classList.add('open'));
                                if (btnCloseHelp && helpModal) btnCloseHelp.addEventListener('click', () => helpModal.classList.remove('open'));

                                const learnPanel = document.getElementById('fab-learn-panel');
                                const btnLearn = document.getElementById('fab-btn-learn');
                                const btnClosePanel = document.getElementById('fab-btn-close-panel');
                                if (btnLearn && learnPanel) btnLearn.addEventListener('click', () => learnPanel.classList.add('open'));
                                if (btnClosePanel && learnPanel) btnClosePanel.addEventListener('click', () => learnPanel.classList.remove('open'));

                                const clock = new THREE.Clock();
                                let isTabActive = true;
                                document.addEventListener('visibilitychange', () => {
                                    isTabActive = !document.hidden;
                                    if (isTabActive) clock.getDelta();
                                });

                                function animate() {
                                    requestAnimationFrame(animate);
                                    if (!isTabActive) return;
                                    const dt = Math.min(clock.getDelta(), 0.05);
                                    controls.update();
                                    updateSparks(dt);

                                    if (!masterTl.isActive() && !prefersReducedMotion) {
                                        waferGroup.rotation.y += 0.0005;
                                    }

                                    for (let i = 0; i < chipsData.length; i++) {
                                        const c = chipsData[i];
                                        dummy.position.set(c.x, c.y, c.z);
                                        dummy.scale.set(c.scaleX, c.scaleY, c.scaleZ);
                                        dummy.updateMatrix();
                                        chipInstanced.setMatrixAt(i, dummy.matrix);
                                    }
                                    chipInstanced.instanceMatrix.needsUpdate = true;

                                    if (!masterTl.isActive()) {
                                        raycaster.setFromCamera(mouse, camera);
                                        const visibleInteractables = interactables.filter(obj => obj.visible && (obj.material ? obj.material.opacity > 0 : true));
                                        const intersects = raycaster.intersectObjects(visibleInteractables);
                                        if (intersects.length > 0 && tooltip) {
                                            tooltip.innerText = intersects[0].object.userData.name;
                                            tooltip.style.opacity = 1;
                                        } else if (tooltip) {
                                            tooltip.style.opacity = 0;
                                        }
                                    } else if (tooltip) {
                                        tooltip.style.opacity = 0;
                                    }

                                    renderer.render(scene, camera);
                                }

                                window.addEventListener('resize', () => {
                                    camera.aspect = getW() / getH();
                                    camera.updateProjectionMatrix();
                                    renderer.setSize(getW(), getH());
                                });

                                const loadingEl = document.getElementById('fab-loading');
                                if (loadingEl) loadingEl.style.display = 'none';
                                gsap.to("#fab-ui-layer", { opacity: 1, duration: 1.0 });
                                updateUIData(0);
                                animate();
})();
