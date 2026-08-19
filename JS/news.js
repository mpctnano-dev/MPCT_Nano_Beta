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
    'XRD': 'About_Equipment/XRD.html',
    'Ellipsometer': 'About_Equipment/Ellipsometer.html',
    'J.A. Woollam RC2 Ellipsometer': 'About_Equipment/Ellipsometer.html',
    'Amatrol 87-MS1 Pick and Place': 'About_Equipment/Amatrol_87_MS1.html',
    'Amatrol 87-MS2 Gauging Station': 'About_Equipment/Amatrol_87_MS2.html',
    'Amatrol 87-MS7 Inventory Storage': 'About_Equipment/Amatrol_87_MS7.html',
    'Amatrol Smart Robot Workcell': 'About_Equipment/Amatrol_SmartRobot_Workcell.html',
    'Hiden Analytical Type 40010': 'About_Equipment/SIMS_Workstation.html',
    'SIMS Workstation': 'About_Equipment/SIMS_Workstation.html'
};

/* Mid-build renovation progress article — 12-frame scrubbable sequence in the hero. */

const LAB_RENOVATION_TIMELAPSE_FRAMES = [
    { src: 'Images/Lab_renovation/01-main-lab-metal-framing-worker.jpeg', alt: 'Metal framing going up in the main lab bay', phase: 'Framing', caption: 'Metal framing outlines new rooms across the main lab bay' },
    { src: 'Images/Lab_renovation/21-dust-barrier-containment-wall.jpeg', alt: 'Dust barrier separating construction from lab areas', phase: 'Protect', caption: 'Dust barriers keep the build zone separate from lab areas still in use' },
    { src: 'Images/Lab_renovation/05-main-bay-scissor-lifts-workers.jpeg', alt: 'Crews on lifts installing overhead systems', phase: 'Systems', caption: 'Crews work from lifts to install overhead building systems' },
    { src: 'Images/Lab_renovation/17-main-lab-hvac-install-in-progress.jpeg', alt: 'HVAC ductwork staged on the floor', phase: 'Systems', caption: 'Large ducts staged on the floor before they go into the ceiling' },
    { src: 'Images/Lab_renovation/06-main-bay-hvac-crew-at-work.jpeg', alt: 'HVAC crew working in the main bay', phase: 'Systems', caption: 'HVAC installation continues through the main bay' },
    { src: 'Images/Lab_renovation/22-wall-electrical-rough-in.jpeg', alt: 'Wiring and outlets going into newly framed walls', phase: 'Systems', caption: 'Wiring and outlets go into the new walls before drywall closes them' },
    { src: 'Images/Lab_renovation/20-corridor-drywall-and-hvac.jpeg', alt: 'Drywall and overhead work advancing together', phase: 'Rooms', caption: 'Drywall goes up as open bays start to become enclosed rooms' },
    { src: 'Images/Lab_renovation/23-finished-walls-exposed-ceiling.jpeg', alt: 'Closed walls with open ceiling systems still exposed', phase: 'Rooms', caption: 'Walls close in while overhead systems stay open for install' },
    { src: 'Images/Lab_renovation/28-main-hall-scissor-lifts-planning.jpeg', alt: 'Scissor lifts and planning in the main hall', phase: 'Rooms', caption: 'Work continues in the main hall as room layouts take shape' },
    { src: 'Images/Lab_renovation/27-drywall-room-worker-and-window.jpeg', alt: 'Interior room with drywall and a new window', phase: 'Rooms', caption: 'Interior rooms take shape around new windows and doorways' },
    { src: 'Images/Lab_renovation/30-room-85-drywall-rough-in.jpeg', alt: 'Room 85 drywall and rough-in underway', phase: 'Rooms', caption: 'Room shell complete: walls up, with flooring, ceiling, and fit-out still to come' },
    { src: 'Images/Lab_renovation/26-drywall-phase-interior-window.jpeg', alt: 'Interior hallway with observation window and closed walls', phase: 'Rooms', caption: 'Observation windows and enclosed rooms mark clear mid-build progress' }
];

const LAB_RENOVATION_TIMELAPSE_MILESTONES = [
    { id: 'framing', label: 'Framing', startIndex: 0 },
    { id: 'protect', label: 'Protect', startIndex: 1 },
    { id: 'systems', label: 'Systems', startIndex: 2 },
    { id: 'rooms', label: 'Rooms', startIndex: 6 }
];

/* Article definitions drive the expanded reader view. Keep ids synchronized with News.html. */

const ARTICLES = [
    {
        id: 'tem-installation-2026',
        title: 'JEOL JEM-F200 TEM Installation Underway',
        tagLabel: 'Installation',
        date: '2026-08-18',
        readTime: '4 min read',
        heroImage: 'Images/TEM.jpg',
        heroAlt: 'JEOL JEM-F200 transmission electron microscope at MPaCT Lab',
        statusBadge: 'In Progress',
        stats: [
            { value: 'Aug 4 to Nov', label: 'Install Window' },
            { value: '200 kV', label: 'TEM / STEM' },
            { value: '0.14 nm', label: 'STEM Resolution' }
        ],
        sections: [
            {
                heading: 'Installation Underway in Building 98E',
                body: 'MPaCT Lab at Northern Arizona University is installing a JEOL JEM-F200 transmission electron microscope in Building 98E on the Flagstaff campus. The install window opened on August 4, 2026 and runs through the first week of November. A TEM takes months to install rather than days, because the room has to hold tight limits on vibration, stray magnetic fields, and temperature before the column can go in. Only then can the system be assembled, pumped down, aligned, and tested against spec. The instrument is not open for booking until that work is signed off.'
            },
            {
                heading: 'What a Transmission Electron Microscope Does',
                body: 'A TEM sends a beam of electrons through a specimen thin enough for them to pass, then forms an image from the electrons that make it out the other side. The wavelength of an accelerated electron is far shorter than that of visible light, so a TEM resolves detail no optical microscope can reach. It also resolves finer detail than a scanning electron microscope, which images the surface rather than looking through the sample. The JEM-F200 is a multipurpose TEM/STEM operating from 20 to 200 kV, with 0.19 nm point resolution in TEM mode and 0.14 nm in STEM-HAADF, driven by a Schottky field emission gun. Magnification runs from 20x to 2,000,000x in TEM and from 200x to 150,000,000x in STEM.'
            },
            {
                heading: 'Applications and Uses',
                body: 'TEM work spans imaging, diffraction, and spectroscopy. Bright-field and dark-field imaging reveal crystal defects such as dislocations, stacking faults, and grain boundaries, along with the interfaces between layers in a device stack. STEM-HAADF gives Z-contrast, so heavier elements stand out against lighter ones, which is how thin interfacial layers and buried structures get located. On the analytical side, EDS produces elemental maps and line scans across a feature, while EELS resolves bonding and electronic structure at high energy resolution. Tomography options extend this into three dimensions. In practice the instrument covers semiconductor cross-sections and interface quality, nanoparticle size and morphology, 2D material characterization, catalyst structure, and failure analysis where the cause sits below what an SEM can see.'
            },
            {
                heading: 'How the TEM Fits the MPaCT Suite',
                body: 'The TEM joins the Materials Characterization suite at MPaCT Lab as its highest-resolution instrument. Each technique in that suite answers a different question. XRD gives crystal structure averaged across a sample, SEM gives surface morphology and composition at the micron scale, SIMS gives trace chemistry with depth, and the TEM gives atomic-scale structure and chemistry at one specific location. MPaCT Lab also runs the sample preparation chain that TEM work depends on. The TEM Prep Disk Grinder, Dimple Grinder, and Ion Beam Mill thin specimens down to electron transparency, so preparation and imaging both happen in the same facility rather than requiring samples to be sent out.'
            },
            {
                heading: 'What Comes Next',
                body: 'For the rest of the window, crews continue column assembly, alignment, and acceptance testing in Building 98E, followed by operator training. MPaCT Lab will post another update as the first week of November approaches. Reservations open once the system passes acceptance.'
            }
        ],
        featured: {
            type: 'progress',
            heading: 'TEM Install Timeline',
            items: [
                {
                    status: 'done',
                    icon: '✓',
                    label: 'Install Window Opens',
                    detail: 'Work began August 4, 2026 in Building 98E on the Flagstaff campus',
                    statusLabel: 'Complete'
                },
                {
                    status: 'active',
                    icon: '→',
                    label: 'System Assembly',
                    detail: 'The JEM-F200 column and support systems are being built up on site',
                    statusLabel: 'In Progress'
                },
                {
                    status: 'planned',
                    icon: '◦',
                    label: 'Alignment and Acceptance Testing',
                    detail: 'Beam alignment, then resolution and stability checks measured against spec',
                    statusLabel: 'Planned'
                },
                {
                    status: 'planned',
                    icon: '◦',
                    label: 'Install Window Closes',
                    detail: 'Through the first week of November 2026, with user access following sign-off',
                    statusLabel: 'Planned'
                }
            ]
        },
        cta: {
            text: 'See full specs, operating modes, and accessories for the JEM-F200.',
            label: 'About the TEM',
            href: 'About_Equipment/TEM.html'
        },
        gallery: [
            {
                src: 'Images/TEM_under_Installation.jpg',
                alt: 'The JEOL JEM-F200 TEM column part-way through assembly at MPaCT Lab, Building 98E',
                caption: 'The JEM-F200 part-way through assembly in Building 98E',
                portrait: true
            },
            {
                src: 'Images/TEM_Outer_Layer.jpg',
                alt: 'The JEOL JEM-F200 column with outer panels off, vacuum plumbing and wiring exposed, with JEM-F200 control software running on the monitor alongside',
                caption: 'Outer panels still off, exposing the vacuum plumbing and wiring that get routed and sealed before alignment. The JEM-F200 control software is already up on the console.',
                portrait: true
            }
        ]
    },

    {
        id: 'xrd-ellipsometer-sem-installation-2026',
        title: 'XRD, Ellipsometer, and SEM Installation Underway',
        tagLabel: 'Installation',
        date: '2026-08-18',
        readTime: '4 min read',
        heroImage: 'Images/SEM.jpg',
        heroAlt: 'JEOL JSM-IT710HR field emission SEM at MPaCT Lab',
        statusBadge: 'In Progress',
        stats: [
            { value: '3', label: 'Systems Installing' },
            { value: 'Aug to Sep', label: 'Install Windows' },
            { value: 'Bldg 98E', label: 'Flagstaff Campus' }
        ],
        sections: [
            {
                heading: 'Three Systems, Three Overlapping Windows',
                body: 'Three characterization instruments are going in at MPaCT Lab in Building 98E this month. The Rigaku SmartLab XRD and the JEOL JSM-IT710HR field emission SEM both started on August 17. The XRD is expected to wrap by the end of August, and the SEM should run into the first week of September in Room 103. The J.A. Woollam RC2 ellipsometer starts mid-week, around August 19, and should take about a week. None of the three are open for reservations until each one clears acceptance testing.'
            },
            {
                heading: 'Rigaku SmartLab XRD: Crystal Structure and Thin Films',
                body: 'X-ray diffraction directs X-rays at a sample and measures the angles at which they scatter constructively off planes of atoms. Those angles act as a fingerprint of the crystal structure. The SmartLab is a multipurpose platform built around a Cu source running up to 40 kV and 44 mA, a HyPix-3000 detector that collects in 0D, 1D, or 2D, and Cross Beam Optics that switch between focusing and parallel-beam geometry without a hardware change. Its theta-theta goniometer resolves to roughly 0.0001 degrees. Between those modes the system covers phase identification and crystallinity in powders and bulk solids, grazing-incidence diffraction for thin films and coatings, X-ray reflectivity for film thickness, density, and interface roughness, and pole figures for crystallographic texture and residual stress, on samples up to roughly 6-inch wafers.'
            },
            {
                heading: 'J.A. Woollam RC2 Ellipsometer: Non-Contact Film Metrology',
                body: 'An ellipsometer measures how polarized light changes when it reflects off a surface, then derives film thickness and the optical constants n and k from that change without touching the sample. The RC2 uses a dual-rotating compensator design that captures all 16 Mueller matrix elements, which is what makes anisotropic and depolarizing samples tractable. It collects more than 1000 wavelengths across a 210 to 1690 nm range, extendable to 2500 nm, in roughly 0.1 to 3 seconds per point, and handles wafers up to 200 or 300 mm depending on configuration. Typical work includes dielectric and photoresist thickness, optical constants of new materials, uniformity mapping across a wafer, and real-time growth or etch monitoring. All of it is non-destructive, where a stylus profilometer would need a scribed step and physical contact.'
            },
            {
                heading: 'JEOL JSM-IT710HR SEM: Imaging and Microanalysis',
                body: 'A scanning electron microscope rasters a focused electron probe across a surface and builds an image from the electrons and X-rays that come back. The JSM-IT710HR pairs an in-lens Schottky field emission gun with probe currents at or above 300 nA, giving a small probe without giving up signal. High- and low-vacuum modes switch in one click, so poorly conducting or outgassing samples can be imaged without a conductive coating. Secondary and quadrant backscatter detectors handle morphology and compositional contrast, with live 3D surface reconstruction, and integrated JEOL EDS produces live spectra and X-ray maps during imaging. It is the general-purpose instrument for surface morphology, fracture and failure analysis, particle sizing, cross-section inspection, and elemental composition.'
            },
            {
                heading: 'How They Work Together',
                body: 'The XRD and ellipsometer belong to the Thin Film Deposition &amp; Analysis track at MPaCT Lab, which is concerned with film thickness, crystal orientation, and stress. The SEM belongs to Materials Characterization, covering structure and composition from bulk samples down to nanostructures. Used together, a deposited film can be measured for thickness and optical constants on the RC2, checked for phase, texture, and stress on the SmartLab, and inspected for morphology and elemental makeup on the SEM, with the incoming TEM available when a question needs atomic-scale resolution.'
            }
        ],
        featured: {
            type: 'phases',
            heading: 'Three-Track Installation Timeline',
            items: [
                {
                    period: 'Aug 17 to end of August',
                    title: 'Rigaku SmartLab XRD',
                    desc: 'Install started August 17 in Building 98E and is expected to finish by the end of the month. Brings phase identification, grazing-incidence thin-film diffraction, X-ray reflectivity, and texture and stress analysis.'
                },
                {
                    period: 'Aug 19, about one week',
                    title: 'J.A. Woollam RC2 Ellipsometer',
                    desc: 'Install starts mid-week and is expected to take about a week. Adds non-contact thickness and optical constants (n, k), full Mueller matrix data, and uniformity mapping on wafers up to 300 mm.'
                },
                {
                    period: 'Aug 17 to early September',
                    title: 'JEOL JSM-IT710HR FE-SEM',
                    desc: 'Install started August 17 in 98E Room 103 and runs through the end of August into the first week of September. Covers high- and low-vacuum imaging, live 3D surface reconstruction, and integrated EDS.'
                }
            ]
        },
        cta: {
            text: 'See where these systems sit in the MPaCT instrument suite.',
            label: 'View Equipment',
            href: 'Equipment.html'
        },
        galleryLayout: 'three-up',
        gallery: [
            {
                src: 'Images/XRD_installation.jpg',
                alt: 'Rigaku SmartLab XRD with its enclosure doors open during installation, goniometer and detector arm visible inside',
                caption: 'The SmartLab with its enclosure open, showing the theta-theta goniometer, X-ray tube, and detector arm still carrying their shipping restraints',
                portrait: true
            },
            {
                src: 'Images/Ellipsometer_installation.jpg',
                alt: 'J.A. Woollam RC2 ellipsometer during installation at MPaCT Lab, goniometer arms and sample stage visible with packing material still in place',
                caption: 'The RC2 on site with its sample stage still wrapped, goniometer arms carrying the angle-of-incidence scale from 40 to 80 degrees',
                portrait: true
            },
            {
                src: 'Images/SEM_installation.jpg',
                alt: 'JEOL JSM-IT710HR SEM during installation, column and specimen chamber on the vibration isolation frame with the electronics bay open',
                caption: 'The JSM-IT710HR column and chamber set on the vibration isolation frame in 98E Room 103, electronics bay still open',
                portrait: true
            }
        ]
    },

    {
        id: 'amatrol-sims-flagstaff-installation-2026',
        title: 'Amatrol Training Line and SIMS Installing at Flagstaff',
        tagLabel: 'Installation',
        date: '2026-08-18',
        readTime: '4 min read',
        heroImage: 'Images/Amatrol_smartrobot.png',
        heroAlt: 'Amatrol Smart Robot Workcell at MPaCT Lab, Building 98E, Flagstaff',
        statusBadge: 'In Progress',
        stats: [
            { value: '4', label: 'Amatrol Stations' },
            { value: '5 nm', label: 'SIMS Depth Resolution' },
            { value: 'Aug to Sep', label: 'Install Windows' }
        ],
        sections: [
            {
                heading: 'Two Installations at the Flagstaff Campus',
                body: 'Two systems are going in at MPaCT Lab, Building 98E, 561 E Pine Knoll Dr in Flagstaff. The Amatrol training line is scheduled to start around August 31 and take roughly a week, wrapping in the first week of September. The Hiden Analytical Type 40010 SIMS workstation follows, installing from the first week of September through the middle to third week of the month. One is a teaching floor for workforce training, the other a research instrument for trace chemical analysis. Neither is in service yet.'
            },
            {
                heading: 'Amatrol Line: Mechatronics and Automation Training',
                body: 'The training line is made up of four stations drawn from the Amatrol 870 Mechatronics Learning System. Station 1, the 87-MS1 Pick and Place Feeding Station, teaches automated parts feeding, pneumatic pick-and-place manipulation, and station-level sequencing under PLC control. Station 2, the 87-MS2 Gauging Station, covers automated go/no-go gauging, part transfer, and reject logic. Station 7, the 87-MS7 Inventory Storage Station, handles automated storage and retrieval through a four-channel storage module. Alongside them, the Smart Robot Workcell is built around a FANUC LR Mate 200iD/4S six-axis industrial robot and supports robot operation, programming, troubleshooting, and material handling in a lab-scale automated cell. Across the four stations students work on PLC programming, sensor integration, pneumatics, inspection logic, and robotics, which are the skills that run semiconductor fabs and advanced manufacturing lines. These are instructional stations rather than individually reservable instruments, and access comes through scheduled coursework and workforce development programs.'
            },
            {
                heading: 'Hiden Type 40010 SIMS: Trace Chemistry and Depth Profiles',
                body: 'Secondary ion mass spectrometry sputters a surface with a primary ion beam and mass-analyzes the ions ejected in the process. It is the most sensitive of the common surface analysis techniques, reaching trace levels that EDS and XPS cannot. The Type 40010 is a UHV system built around a MAXIM quadrupole SIMS/SNMS spectrometer, detecting both positive and negative ions with roughly 5 nm depth resolution on thin films. Its mass range runs from 300 to 1000 amu depending on configuration, it takes samples up to about 40 by 40 mm and 10 mm thick, and an electron flood gun option handles insulating materials. Dynamic SIMS supports dopant and implant depth profiles in semiconductors, contamination detection at trace concentrations, and layer-by-layer composition through multilayer stacks. Static SIMS covers molecular species at the surface, SNMS adds quantitative depth profiles, and imaging modes produce 2D and 3D chemical maps.'
            },
            {
                heading: 'Where They Land in MPaCT',
                body: 'The Amatrol line feeds the workforce development pipeline at MPaCT Lab, building the automation and mechatronics skills that Arizona employers in semiconductors and advanced manufacturing hire for. SIMS joins the Materials Characterization suite as its trace-chemistry and depth-profiling instrument. It complements the SEM and its EDS for surface and micron-scale composition, XRD for crystal structure, and the incoming TEM for atomic-scale imaging. MPaCT Lab will post another update once this Flagstaff track wraps in September.'
            }
        ],
        featured: {
            type: 'phases',
            heading: 'Installation Windows',
            items: [
                {
                    period: 'Aug 31 to first week of September',
                    title: 'Amatrol Training Line',
                    desc: 'About a week to install the 87-MS1 Pick and Place, 87-MS2 Gauging Station, 87-MS7 Inventory Storage, and the Smart Robot Workcell. These are instructional stations, so access runs through scheduled coursework rather than individual bookings.'
                },
                {
                    period: 'First to third week of September',
                    title: 'Hiden Analytical Type 40010 SIMS',
                    desc: 'Installs from the first week of September through the middle to third week. Brings dynamic and static SIMS plus SNMS for depth profiling, dopant and impurity detection, and surface chemistry.'
                }
            ]
        },
        cta: {
            text: 'See how these training stations fit MPaCT workforce programs.',
            label: 'Workforce Development',
            href: 'WorkForceDevelopment.html'
        }
        /* No gallery: no installation photos exist for this track yet. Product shots
           belong on the equipment pages, not in a progress update. */
    },

    {
        id: 'intel-chips-scholarship-2026',
        title: 'Intel-SRC CHIPS Scholarship Supports Master\'s Students at NAU and University of Arizona',
        tagLabel: 'Partnership',
        date: '2026-04-27',
        readTime: '4 min read',

        // Replace with a real semiconductor/lab photo
  
        heroImage: 'Images/Intel_News_Thumbnail.png',
        heroAlt: 'Intel, SRC, and NAU Partnership Banner',
        statusBadge: 'Scholarship Program',

        // Three headline statistics that scan quickly at the top of the reader view.
        stats: [
            { value: '12', label: 'Master\'s Scholars' },
            { value: 'AY 26–27', label: 'Cohort Start' },
            { value: 'Intel + SRC + U of A', label: 'Program Partners' }
        ],
        sections: [
            {
                heading: 'A Major Step for Arizona Semiconductor Workforce Development',
                body: 'Northern Arizona University\'s Steve Sanghi College of Engineering (SCE), in collaboration with the University of Arizona (U of A), has been selected by Intel and the Semiconductor Research Corporation (SRC) to host a 12-student Master\'s Scholarship cohort under the Intel-SRC CHIPS Scholarship & Fellowship Program. The cohort will launch in Academic Year 2026–27, training the next generation of engineers for Arizona\'s growing semiconductor industry, including Intel\'s advanced manufacturing and Research and Development operations.'
            },
            {
                heading: 'Three Critical Areas, Two Institutions',
                body: 'The program targets three pillars of Intel\'s Arizona operations: advanced packaging and heterogeneous integration, manufacturing process metrology, and co-packaged optics (CPO). Students are drawn from Mechanical Engineering, Electrical and Computer Engineering, and Optical Engineering, with two cohort tracks ensuring each degree program aligns directly with Intel and SRC program priorities. NAU contributes 9 scholars and U of A 3, with cross-campus co-advising and facility access built into every student\'s plan of study.'
            },
            {
                heading: 'Complementary Strengths Across the Alliance',
                body: 'NAU brings the MPaCT Lab, a 35+ instrument fabrication and metrology facility, alongside new curriculum supported by a $8M Arizona Commerce Authority semiconductor workforce grant and an established TSMC apprenticeship pipeline. As a Hispanic-Serving Institution with approximately 60% first-generation enrollment, NAU reaches underrepresented communities across rural northern Arizona. U of A contributes decades of Intel-aligned photonics expertise through the Wyant College of Optical Sciences and the Center for Semiconductor Manufacturing, which is staffed in part by former Intel engineers and has graduated more than 200 Master\'s and PhD students through SRC-affiliated programs.'
            },
            {
                heading: 'From Lab to Career',
                body: 'Every Intel Scholar will complete a thesis or independent project aligned with semiconductor manufacturing priorities, gain hands-on access to advanced instrumentation at both campuses, and participate in at least one Intel facility visit per year. Career development is anchored by Individual Development Plans, cohort mentoring, and active internship support in Manufacturing & Process Development, Silicon Hardware Engineering, and Semiconductor Research. The program targets a 75% or higher placement rate into semiconductor industry roles or PhD programs within one year of graduation.'
            }
        ],

        // Partnership logos/partners rendered as a progress-style roadmap of program pillars.
        featured: {
            type: 'phases',
            heading: 'Program Training Pillars',
            items: [
                {
                    period: 'Pillar 1',
                    title: 'Metrology & Inspection',
                    desc: 'In-fab and near-fab measurement, defect detection, and yield analysis using MPaCT\'s 35+ instrument suite'
                },
                {
                    period: 'Pillar 2',
                    title: 'Precision Manufacturing & Packaging',
                    desc: 'Fine-pitch assembly, chemical-mechanical planarization, and packaging automation'
                },
                {
                    period: 'Pillar 3',
                    title: 'Materials Reliability',
                    desc: 'Interconnect fatigue, thermal cycling, failure analysis, and 3D heterogeneous integration'
                },
                {
                    period: 'Pillar 4',
                    title: 'Co-Packaged Optics (CPO)',
                    desc: 'Fiber-attach, optical engine integration, and silicon photonics at U of A\'s photonics cleanroom and labs'
                }
            ]
        },
        // Article CTA points readers at the dedicated scholarship page so a
        // prospective MS applicant landing on the news article can move
        // straight into the eligibility / details / register flow.
        cta: {
            text: 'Could you be one of the next NAU Intel-SRC Scholars?',
            label: 'Apply for the Scholarship',
            href: 'CHIPS_Scholars_Program.html'
        },
        gallery: [
            {
                src: 'Images/engineering_building.jpg',
                alt: 'NAU Engineering Building',
                caption: 'NAU Steve Sanghi College of Engineering — home of the MPaCT Lab'
            },
            {
                src: 'Images/nano_fabrication.jpg',
                alt: 'MPaCT Lab semiconductor fabrication',
                caption: 'MPaCT Lab houses 35+ instruments for semiconductor processing and metrology'
            }
        ]
    },
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
                body: 'The renovation covers vibration-isolated flooring designed to protect sensitive metrology instruments, upgraded HVAC systems with precision humidity and temperature control, new power conditioning units, and expanded process-support workspace. These upgrades meet the strict environmental requirements of electron microscopes, surface profilers, X-ray diffraction systems, and atomic force microscopes.'
            }
        ],
        // This article uses a dated milestone timeline so the reader can show renovation sequencing, not just prose.
        featured: {
            type: 'phases',
            heading: 'Project Phases',
            items: [
                { period: 'Q1 2026', title: 'Site Preparation & Demolition', desc: 'Structural reinforcement and vibration-isolation foundation prep' },
                { period: 'Q2 2026', title: 'HVAC & Electrical Upgrades', desc: 'Precision environmental controls and power conditioning installation' },
                { period: 'Q3 2026', title: 'Facility Fit-Out', desc: 'Controlled-environment partition walls, gowning area, and HEPA filtration systems' },
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
        id: 'lab-renovation-progress-timelapse',
        title: 'MPaCT Lab Renovation: Mid-Build Progress',
        tagLabel: 'Facility',
        date: '2026-07-31',
        readTime: '4 min read',
        heroAlt: 'MPaCT Lab renovation and build-out in progress',
        statusBadge: 'In Progress',
        stats: [],
        sections: [
            {
                heading: 'Renovation Underway at MPaCT Lab',
                body: 'MPaCT Lab at Northern Arizona University is in the middle of a facility renovation to expand its shared metrology and semiconductor research space. Crews are working through the main lab bays on metal framing, HVAC rough-in, drywall, and overhead systems, building toward a cleaner, more modern environment for precision instruments. The project is part of NAU\'s wider push on semiconductor workforce development and shared research facilities for academic, industry, and government partners.'
            },
            {
                heading: 'Equipment Installation Continues',
                body: 'While construction continues, MPaCT has kept commissioning and installing new systems and protecting instruments already on site. Recent additions include the FLs1000 fiber laser, HAAS Desktop CNC, and LPKF ProtoLaser R4, with sensitive systems kept under containment during nearby work. More installs and relocations will follow as renovation zones wrap up, with broader user access expected in the coming months.'
            },
            {
                heading: 'What Comes Next',
                body: 'Next up is finishing the interior build-out, completing mechanical and electrical systems, preparing spaces, and moving into the actual equipment installation and commissioning. MPaCT will post more updates as major phases close. In the meantime, the lab is still focused on its 35+ instrument suite and the research, training, and industry partnerships that drive the facility.'
            }
        ],
        featured: {
            type: 'progress',
            heading: 'Current Project Status',
            items: [
                {
                    status: 'active',
                    icon: '&#128736;',
                    label: 'Facility Renovation',
                    detail: 'Framing, HVAC, drywall, and overhead systems underway across main and west bays',
                    statusLabel: 'In Progress'
                },
                {
                    status: 'active',
                    icon: '&#9881;',
                    label: 'Equipment Installation',
                    detail: 'New systems commissioning and existing instruments protected during active construction',
                    statusLabel: 'In Progress'
                },
                {
                    status: 'active',
                    icon: '&#128274;',
                    label: 'Containment & Protection',
                    detail: 'Dust barriers and plastic containment keeping operating lab zones safe during build-out',
                    statusLabel: 'In Progress'
                },
                {
                    status: 'planned',
                    icon: '&#128640;',
                    label: 'Facility Launch',
                    detail: 'Final fit-out, instrument relocation, and expanded user access expected soon',
                    statusLabel: 'Coming Soon'
                }
            ]
        },
        cta: {
            text: 'Interested in the shared facility and instrument suite at MPaCT?',
            label: 'Learn About MPaCT',
            href: 'MPaCT.html'
        },
        heroLayout: 'timelapse',
        heroImage: 'Images/Lab_renovation/05-main-bay-scissor-lifts-workers.jpeg',
        gallery: LAB_RENOVATION_TIMELAPSE_FRAMES
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
        cta: { text: 'Ready to book time on these systems?', label: 'Book Equipment', href: 'Reserve_Equipment.html' },
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
        cta: { text: 'Ready to get started?', label: 'Book Now', href: 'Reserve_Equipment.html' },
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
                { status: 'active', icon: '→', label: '$2.5M Facility Renovation', detail: 'Vibration isolation, HVAC, facility fit-out — phased through 2026', statusLabel: 'In Progress' },
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
        cta: { text: 'Need rapid PCB prototyping or precision laser structuring?', label: 'Book LPKF Time', href: 'Reserve_Equipment.html' },
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
                    const link = EQUIPMENT_LINKS[item.name] || 'Reserve_Equipment.html';
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

/* Hero banner helpers — pseudo-timelapse lives in the article hero area. */

let activeTimelapseTimer = null;

const renderHeroMeta = (article, formattedDate) => `
    <div class="nar-hero__meta">
        <span class="nar-hero__category">${article.tagLabel}</span>
        <span class="nar-hero__dot">&#9679;</span>
        <span class="nar-hero__date">${formattedDate}</span>
        <span class="nar-hero__dot">&#9679;</span>
        <span class="nar-hero__readtime">${article.readTime}</span>
    </div>
`;

const renderHeroTimelapse = (frames, metaHTML) => {
    const milestones = LAB_RENOVATION_TIMELAPSE_MILESTONES;
    const phaseStripHTML = milestones.map((m, i) => `
        <button type="button" class="nar-hero-timelapse__milestone${i === 0 ? ' is-active' : ''}" data-index="${m.startIndex}" aria-label="Jump to ${m.label}">
            <span class="nar-hero-timelapse__milestone-dot"></span>
            <span class="nar-hero-timelapse__milestone-label">${m.label}</span>
        </button>
    `).join('');

    return `
        <div class="nar-hero-timelapse-wrap" id="narHeroTimelapse" tabindex="0" role="region" aria-label="Renovation progress sequence">
            <div class="nar-hero nar-hero--timelapse">
                <div class="nar-hero-timelapse__stage">
                    <img class="nar-hero-timelapse__img" src="${frames[0].src}" alt="${frames[0].alt}" loading="eager">
                    <div class="nar-hero__overlay nar-hero__overlay--timelapse"></div>
                    <span class="nar-hero-timelapse__badge">${frames[0].phase}</span>
                    <span class="nar-hero-timelapse__counter">1 / ${frames.length}</span>
                    ${metaHTML}
                </div>
            </div>
            <div class="nar-hero-timelapse__panel">
                <p class="nar-hero-timelapse__caption">${frames[0].caption}</p>
                <div class="nar-hero-timelapse__controls">
                    <button type="button" class="nar-hero-timelapse__btn nar-hero-timelapse__btn--prev" aria-label="Previous frame">&#8592;</button>
                    <button type="button" class="nar-hero-timelapse__btn nar-hero-timelapse__btn--play">&#9654; Play</button>
                    <button type="button" class="nar-hero-timelapse__btn nar-hero-timelapse__btn--next" aria-label="Next frame">&#8594;</button>
                </div>
                <div class="nar-hero-timelapse__slider-row">
                    <input type="range" class="nar-hero-timelapse__slider" min="0" max="${frames.length - 1}" value="0" aria-label="Progress scrubber">
                </div>
                <div class="nar-hero-timelapse__phase-strip" aria-label="Renovation phases">${phaseStripHTML}</div>
            </div>
        </div>
    `;
};

const initNarHeroTimelapse = (root, frames) => {
    if (!root || !frames.length) return;

    const img = root.querySelector('.nar-hero-timelapse__img');
    const caption = root.querySelector('.nar-hero-timelapse__caption');
    const counter = root.querySelector('.nar-hero-timelapse__counter');
    const badge = root.querySelector('.nar-hero-timelapse__badge');
    const slider = root.querySelector('.nar-hero-timelapse__slider');
    const playBtn = root.querySelector('.nar-hero-timelapse__btn--play');
    const prevBtn = root.querySelector('.nar-hero-timelapse__btn--prev');
    const nextBtn = root.querySelector('.nar-hero-timelapse__btn--next');
    const milestones = Array.from(root.querySelectorAll('.nar-hero-timelapse__milestone'));
    const milestonesData = LAB_RENOVATION_TIMELAPSE_MILESTONES;

    let index = 0;
    let playing = false;
    let fadeTimer = null;
    let hasPainted = false;
    const INTERVAL_MS = 2000;
    const FADE_MS = 220;

    const getActiveMilestoneIndex = (frameIndex) => {
        let active = 0;
        milestonesData.forEach((m, i) => {
            if (frameIndex >= m.startIndex) active = i;
        });
        return active;
    };

    const preloadFrames = () => {
        frames.forEach(frame => {
            const preload = new Image();
            preload.src = frame.src;
        });
    };

    const updateMilestones = (frameIndex) => {
        const activeIdx = getActiveMilestoneIndex(frameIndex);
        milestones.forEach((btn, i) => btn.classList.toggle('is-active', i === activeIdx));
    };

    const applyFrame = (frame, frameIndex) => {
        img.src = frame.src;
        img.alt = frame.alt;
        caption.textContent = frame.caption;
        counter.textContent = `${frameIndex + 1} / ${frames.length}`;
        if (badge) badge.textContent = frame.phase;
        slider.value = String(frameIndex);
        updateMilestones(frameIndex);
    };

    const showFrame = (nextIndex, { animate = true } = {}) => {
        const clamped = Math.max(0, Math.min(frames.length - 1, nextIndex));
        if (hasPainted && clamped === index && animate) return;

        index = clamped;
        const frame = frames[index];

        if (fadeTimer) {
            clearTimeout(fadeTimer);
            fadeTimer = null;
            img.classList.remove('is-fading');
        }

        if (!animate || !hasPainted) {
            applyFrame(frame, index);
            hasPainted = true;
            return;
        }

        img.classList.add('is-fading');
        fadeTimer = window.setTimeout(() => {
            applyFrame(frame, index);
            img.classList.remove('is-fading');
            fadeTimer = null;
        }, FADE_MS);
    };

    const stopPlay = () => {
        playing = false;
        if (activeTimelapseTimer) {
            clearInterval(activeTimelapseTimer);
            activeTimelapseTimer = null;
        }
        if (playBtn) {
            playBtn.innerHTML = '&#9654; Play';
            playBtn.setAttribute('aria-label', 'Play progress sequence');
        }
    };

    const startPlay = () => {
        if (index >= frames.length - 1) showFrame(0);
        playing = true;
        if (playBtn) {
            playBtn.innerHTML = '&#9208; Pause';
            playBtn.setAttribute('aria-label', 'Pause progress sequence');
        }
        activeTimelapseTimer = setInterval(() => {
            if (index >= frames.length - 1) {
                stopPlay();
                return;
            }
            showFrame(index + 1);
        }, INTERVAL_MS);
    };

    preloadFrames();
    showFrame(0, { animate: false });
    if (playBtn) playBtn.setAttribute('aria-label', 'Play progress sequence');
    if (caption) caption.setAttribute('aria-live', 'polite');

    slider.addEventListener('input', () => {
        stopPlay();
        showFrame(parseInt(slider.value, 10));
    });

    prevBtn?.addEventListener('click', () => {
        stopPlay();
        showFrame(index - 1);
    });

    nextBtn?.addEventListener('click', () => {
        stopPlay();
        showFrame(index + 1);
    });

    playBtn?.addEventListener('click', () => {
        if (playing) stopPlay();
        else startPlay();
    });

    milestones.forEach(btn => {
        btn.addEventListener('click', () => {
            stopPlay();
            showFrame(parseInt(btn.dataset.index, 10));
        });
    });

    root.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stopPlay();
            showFrame(index - 1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            stopPlay();
            showFrame(index + 1);
        }
        if (event.key === ' ' || event.key === 'Enter') {
            if (event.target === root || event.target === playBtn) {
                event.preventDefault();
                if (playing) stopPlay();
                else startPlay();
            }
        }
    });
};

/* Legacy body-level timelapse (kept for reuse if needed elsewhere). */

const renderTimelapseGallery = (frames) => {
    if (!frames.length) return '';

    return `
        <div class="nar-timelapse" id="narTimelapse">
            <div class="nar-timelapse__stage">
                <img class="nar-timelapse__img" src="${frames[0].src}" alt="${frames[0].alt}" loading="lazy">
                <span class="nar-timelapse__counter">1 / ${frames.length}</span>
            </div>
            <p class="nar-timelapse__caption">${frames[0].caption}</p>
            <div class="nar-timelapse__controls">
                <button type="button" class="nar-timelapse__btn nar-timelapse__btn--prev" aria-label="Previous frame">&#8592;</button>
                <button type="button" class="nar-timelapse__btn nar-timelapse__btn--play">Play</button>
                <input type="range" class="nar-timelapse__slider" min="0" max="${frames.length - 1}" value="0" aria-label="Progress scrubber">
                <button type="button" class="nar-timelapse__btn nar-timelapse__btn--next" aria-label="Next frame">&#8594;</button>
            </div>
        </div>
    `;
};

const initNarTimelapse = (root, frames) => {
    if (!root || !frames.length) return;

    const img = root.querySelector('.nar-timelapse__img');
    const caption = root.querySelector('.nar-timelapse__caption');
    const counter = root.querySelector('.nar-timelapse__counter');
    const slider = root.querySelector('.nar-timelapse__slider');
    const playBtn = root.querySelector('.nar-timelapse__btn--play');
    const prevBtn = root.querySelector('.nar-timelapse__btn--prev');
    const nextBtn = root.querySelector('.nar-timelapse__btn--next');

    let index = 0;
    let playing = false;
    const INTERVAL_MS = 2000;

    const showFrame = (nextIndex) => {
        index = Math.max(0, Math.min(frames.length - 1, nextIndex));
        const frame = frames[index];

        img.classList.add('is-fading');
        window.setTimeout(() => {
            img.src = frame.src;
            img.alt = frame.alt;
            caption.textContent = frame.caption;
            counter.textContent = `${index + 1} / ${frames.length}`;
            slider.value = String(index);
            img.classList.remove('is-fading');
        }, 150);
    };

    const stopPlay = () => {
        playing = false;
        if (activeTimelapseTimer) {
            clearInterval(activeTimelapseTimer);
            activeTimelapseTimer = null;
        }
        if (playBtn) playBtn.textContent = 'Play';
    };

    const startPlay = () => {
        playing = true;
        if (playBtn) playBtn.textContent = 'Pause';
        activeTimelapseTimer = setInterval(() => {
            showFrame(index >= frames.length - 1 ? 0 : index + 1);
        }, INTERVAL_MS);
    };

    showFrame(0);

    slider.addEventListener('input', () => {
        stopPlay();
        showFrame(parseInt(slider.value, 10));
    });

    prevBtn?.addEventListener('click', () => {
        stopPlay();
        showFrame(index - 1);
    });

    nextBtn?.addEventListener('click', () => {
        stopPlay();
        showFrame(index + 1);
    });

    playBtn?.addEventListener('click', () => {
        if (playing) stopPlay();
        else startPlay();
    });
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

    /* Convert absolute publish dates into relative labels for the grid without mutating the source article data.
       Cards with data-format="absolute" keep their fixed calendar date. */

    const renderTimestamps = () => {
        const now = new Date();
        document.querySelectorAll('#newsGrid .news-card__timestamp[data-date]').forEach(el => {
            const d = new Date(el.dataset.date + 'T00:00:00');
            if (el.dataset.format === 'absolute') {
                el.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                return;
            }
            const days = Math.floor((now - d) / 86400000);
            if (days === 0)      el.textContent = 'Today';
            else if (days === 1) el.textContent = 'Yesterday';
            else if (days > 1 && days <= 7) el.textContent = `${days} days ago`;
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

    /* Matches the breakpoint where the calendar becomes a bottom sheet, which
       is the whole touch band — the trigger lives inside the collapsing filter
       panel at ≤1024px, and that panel clips its own overflow. */
    const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;

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
        if (activeTimelapseTimer) {
            clearInterval(activeTimelapseTimer);
            activeTimelapseTimer = null;
        }

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
        if (activeTimelapseTimer) {
            clearInterval(activeTimelapseTimer);
            activeTimelapseTimer = null;
        }

        const idx           = ARTICLES.findIndex(a => a.id === article.id);
        const hasPrev       = idx > 0;
        const hasNext       = idx < ARTICLES.length - 1;
        const formattedDate = new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });

        const statsHTML = Array.isArray(article.stats) && article.stats.length
            ? article.stats.map(s => `
            <div class="nar-stat-box">
                <span class="nar-stat-box__value">${s.value}</span>
                <span class="nar-stat-box__label">${s.label}</span>
            </div>
        `).join('')
            : '';

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

        let galleryHTML = '';
        const heroUsesTimelapse = article.heroLayout === 'timelapse';

        if (!heroUsesTimelapse && article.galleryLayout === 'timelapse' && Array.isArray(article.gallery) && article.gallery.length) {
            galleryHTML = renderTimelapseGallery(article.gallery);
        } else if (!heroUsesTimelapse && Array.isArray(article.gallery) && article.gallery.length) {
            const galleryClass = article.galleryLayout === 'three-up' ? ' nar-gallery--three-up' : '';
            galleryHTML = `
            <div class="nar-gallery${galleryClass}">
                ${article.gallery.map(img => `
                    <div class="nar-gallery__item${img.wide ? ' nar-gallery__item--wide' : ''}">
                        <img class="nar-gallery__img${img.portrait ? ' nar-gallery__img--portrait' : ''}" src="${img.src}" alt="${img.alt}" loading="lazy">
                        <p class="nar-gallery__caption">${img.caption}</p>
                    </div>
                `).join('')}
            </div>
        `;
        }

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

        const heroMetaHTML = renderHeroMeta(article, formattedDate);

        let heroHTML = '';
        if (article.heroLayout === 'timelapse' && Array.isArray(article.gallery) && article.gallery.length) {
            heroHTML = renderHeroTimelapse(article.gallery, heroMetaHTML);
        } else if (article.id === 'intel-chips-scholarship-2026') {
            heroHTML = `
            <div class="nar-hero">
                <img class="nar-hero__img" src="Images/Intel_News_Thumbnail.png" alt="Intel and NAU Partnership Banner">
                <div class="nar-hero__overlay" style="background: transparent;"></div>
                <div class="nar-hero__meta">
                    <span class="nar-hero__category">${article.tagLabel}</span>
                    <span class="nar-hero__dot">&#9679;</span>
                    <span class="nar-hero__date">${formattedDate}</span>
                    <span class="nar-hero__dot">&#9679;</span>
                    <span class="nar-hero__readtime">${article.readTime}</span>
                </div>
            </div>`;
            
            /* COMMENTED OUT - Original animated puzzle container with Intel video
            <div class="nar-hero concept-hero-override" id="conceptHeroContainer">
                <div class="puzzle-container" id="intelPuzzleContainer">
                    <div class="puzzle-piece left-piece">
                        <div class="puzzle-logo-wrapper">
                            <img src="Images/NAU_letters_clean.png" alt="NAU" class="puzzle-logo nau-logo">
                        </div>
                    </div>
                    <div class="puzzle-piece right-piece">
                        <video id="intelPuzzleVideo" src="Images/Intel.mp4#t=1.5" autoplay muted class="puzzle-video"></video>
                    </div>
                    <svg class="puzzle-energy-seam" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#FAC01A" />
                                <stop offset="50%" stop-color="#ffffff" />
                                <stop offset="100%" stop-color="#002454" />
                            </linearGradient>
                        </defs>
                        <!-- Perimeter framing paths -->
                        <path class="puzzle-energy-frame" d="M 46 0 L 0 0 L 0 100 L 46 100"></path>
                        <path class="puzzle-energy-frame" d="M 46 0 L 100 0 L 100 100 L 46 100"></path>
                        <!-- Interlock seam path -->
                        <path class="puzzle-energy-path" d="M 46.0 0 L 47.5 10 L 48.9 20 L 50.0 30 L 50.8 40 L 51.0 50 L 50.8 60 L 50.0 70 L 48.9 80 L 47.5 90 L 46.0 100"></path>
                    </svg>
                </div>
                <div class="nar-hero__overlay" style="background: transparent; z-index: 2;"></div>
                <div class="nar-hero__meta" style="z-index: 10;">
                    <span class="nar-hero__category">${article.tagLabel}</span>
                    <span class="nar-hero__dot">&#9679;</span>
                    <span class="nar-hero__date">${formattedDate}</span>
                    <span class="nar-hero__dot">&#9679;</span>
                    <span class="nar-hero__readtime">${article.readTime}</span>
                </div>
            </div>
            */
        } else {
            heroHTML = `
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
            </div>`;
        }

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

            ${heroHTML}


            <div class="nar-content">
                <h1 class="nar-title">${article.title}</h1>

                ${statsHTML ? `<div class="nar-stats">${statsHTML}</div>` : ''}

                <div class="nar-body">
                    ${bodyHTML}
                    ${featuredHTML}
                </div>

                ${galleryHTML}

                ${ctaHTML}
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

        if (article.id === 'intel-chips-scholarship-2026') {
            setTimeout(() => {
                const container = document.getElementById('intelPuzzleContainer');
                if (container) container.classList.add('snapped');
                
                const vid = document.getElementById('intelPuzzleVideo');
                if (vid) {
                    vid.currentTime = 0;
                    vid.play();
                }
            }, 500);
        }

        if (article.heroLayout === 'timelapse') {
            initNarHeroTimelapse(document.getElementById('narHeroTimelapse'), article.gallery);
        } else if (article.galleryLayout === 'timelapse') {
            initNarTimelapse(document.getElementById('narTimelapse'), article.gallery);
        }

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
