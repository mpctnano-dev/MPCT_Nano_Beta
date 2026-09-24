---
title: Instruments
description: The machines at NAU's MPaCT Lab that people look up by name, with sizes, speeds, and hard limits. For the method itself, start with Techniques.
tags:
  - Reference
schema:
  - "@type": ResearchOrganization
    "@id": https://nano.nau.edu/#organization
    name: MPaCT Lab
    url: https://nano.nau.edu/
    parentOrganization:
      "@type": CollegeOrUniversity
      name: Northern Arizona University
    address:
      "@type": PostalAddress
      streetAddress: 561 E Pine Knoll Dr, Building 98E
      addressLocality: Flagstaff
      addressRegion: AZ
      postalCode: "86001"
      addressCountry: US
  - "@type": ItemList
    name: Instruments documented at MPaCT Lab
    itemListOrder: https://schema.org/ItemListUnordered
    numberOfItems: 5
    itemListElement:
      - { "@type": ListItem, position: 1, name: Bambu Lab H2D 3D Printer,                url: "https://nano.nau.edu/knowledge-base/instruments/bambu-lab-h2d/" }
      - { "@type": ListItem, position: 2, name: Haas Desktop Mill,                       url: "https://nano.nau.edu/knowledge-base/instruments/haas-desktop-mill/" }
      - { "@type": ListItem, position: 3, name: Haas Desktop Lathe,                      url: "https://nano.nau.edu/knowledge-base/instruments/haas-desktop-lathe/" }
      - { "@type": ListItem, position: 4, name: Amatrol 870 Mechatronics Learning System, url: "https://nano.nau.edu/knowledge-base/instruments/amatrol-870-mechatronics-line/" }
      - { "@type": ListItem, position: 5, name: Amatrol Smart Robot Workcell,            url: "https://nano.nau.edu/knowledge-base/instruments/amatrol-smart-robot-workcell/" }
---

# Instruments

Use this section when you already know the machine by name. If you know what you need measured or made, start with [Techniques](../techniques/index.md) instead.

A technique page is the method: what it can tell you, what it cannot, and which machine in the lab performs it. An instrument page is the hardware: bed size, spindle limits, who can use it. Most of the lab is documented on a technique page. These pages are for machines that people look up by make and model.

## Fabrication

| Instrument | Method | Key limit |
|---|---|---|
| [Bambu Lab H2D](bambu-lab-h2d.md) | [FDM printing](../techniques/additive-manufacturing-fdm.md) | 325 × 320 × 325 mm build volume |
| [Haas Desktop Mill](haas-desktop-mill.md) | [CNC milling](../techniques/cnc-machining.md) | Plastics and machinable wax only |
| [Haas Desktop Lathe](haas-desktop-lathe.md) | [CNC turning](../techniques/cnc-machining.md) | 0.75 in max cutting diameter |

## Automation and robotics

| Instrument | Method | Key limit |
|---|---|---|
| [Amatrol 870 Mechatronics Learning System](amatrol-870-mechatronics-line.md) | [PLC control](../techniques/industrial-automation-plc.md) | Educational access only |
| [Amatrol Smart Robot Workcell](amatrol-smart-robot-workcell.md) | [Robot programming](../techniques/industrial-automation-plc.md) | Educational access only |

!!! note "Three stations, one page"
    The 87-MS1 pick and place, 87-MS2 gauging, and 87-MS7 inventory storage stations are listed separately in the equipment catalogue, and documented here as one line. They build a single workpiece in sequence; none of them is a complete machine on its own. Each station's catalogue entry remains at [About Equipment](/Equipment.html).

## Everything else

Other instruments in the catalogue are documented by method rather than by model.

| Instrument | Documented at |
|---|---|
| JEOL JEM-F200 | [Transmission Electron Microscopy](../techniques/transmission-electron-microscopy.md) |
| JEOL JSM-IT710HR | [Scanning Electron Microscopy](../techniques/scanning-electron-microscopy.md) |
| FEI Quanta 3D FEG DualBeam | [Focused Ion Beam](../techniques/focused-ion-beam.md) |
| AFM Workshop B-2 | [Atomic Force Microscopy](../techniques/atomic-force-microscopy.md) |
| Keyence VK-X3000 | [Optical Profilometry](../techniques/optical-profilometry.md) |
| J.A. Woollam RC2 | [Spectroscopic Ellipsometry](../techniques/spectroscopic-ellipsometry.md) |
| Edinburgh Instruments FLS1000 | [Photoluminescence Spectroscopy](../techniques/photoluminescence-spectroscopy.md) |
| Microtrac BELSORP MAX X | [Gas Sorption and BET](../techniques/gas-sorption-surface-area.md) |
| Microtrac BELPREP VAC | [Sample Degassing](../techniques/sample-degassing.md) |
| CSZ MicroClimate MCBH-1.2 | [Environmental Stress Testing](../techniques/environmental-stress-testing.md) |
| Fluke Calibration P3114 | [Pressure Calibration](../techniques/pressure-calibration.md) |
| MPI TS200 | [On-Wafer Probing](../techniques/on-wafer-probing.md) |
| LPKF ProtoLaser R4 | [Laser Micromachining](../techniques/laser-micromachining.md) |
| SUSS MJB4 | [Photolithography](../techniques/photolithography.md) |
| Rigaku SmartLab | [X-ray Diffraction](../techniques/x-ray-diffraction.md) |
| Hiden Analytical SIMS Workstation | [Secondary Ion Mass Spectrometry](../techniques/secondary-ion-mass-spectrometry.md) |
| Tresky T-4909-AE | [Die attach](../techniques/die-and-wire-bonding.md) |
| West-Bond 7700D | [Wire bonding](../techniques/die-and-wire-bonding.md) |
| Keyence VHX-7000 | [Digital microscopy](../techniques/digital-microscopy.md) |
| Keyence WM-6000 | [Wide-area CMM](../techniques/coordinate-measuring.md) |
| Keysight E4990A | [Impedance analysis](../techniques/impedance-analysis.md) |
| Keysight E5063A | [Vector network analysis](../techniques/vector-network-analysis.md) |
| Montana CryoAdvance 50 | [Cryogenic measurement](../techniques/cryogenic-measurement.md) |
| Rutherford Titan 10 | [Cryogenic measurement](../techniques/cryogenic-measurement.md) (LN2 supply) |
| LINSEIS LSR-3 | [Seebeck and resistivity](../techniques/seebeck-and-resistivity.md) |
| Keithley 2110 | [Benchtop electrical](../techniques/benchtop-electrical-measurement.md) |
| Tektronix AFG1022 | [Benchtop electrical](../techniques/benchtop-electrical-measurement.md) |
| Tektronix TBS1052C | [Benchtop electrical](../techniques/benchtop-electrical-measurement.md) |
| Thorlabs EXULUS-HD2HP | [Spatial light modulation](../techniques/spatial-light-modulation.md) |
| NIL Technology CNI v3.0 | [Nanoimprint lithography](../techniques/nanoimprint-lithography.md) |
| Voltera V-One | [Conductive-ink PCB printing](../techniques/conductive-ink-pcb-printing.md) |
| PELCO FlexScribe 300 | [Wafer scribing](../techniques/wafer-scribing.md) |
| Fischione Model 160 | [TEM sample preparation](../techniques/tem-sample-preparation.md) |
| Fischione Model 200 | [TEM sample preparation](../techniques/tem-sample-preparation.md) |
| Fischione Model 1051 | [TEM sample preparation](../techniques/tem-sample-preparation.md) |

The [equipment catalogue](/Equipment.html) lists every tool, with live status and booking.

**MPaCT Lab** - Building 98E, South Engineering Lab, 561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)
