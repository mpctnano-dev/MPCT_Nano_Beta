---
title: MPaCT Lab Knowledge Base
description: Guides to characterization and fabrication at NAU's MPaCT Lab in Flagstaff, Arizona. Start from a sample, a method, or a choice between methods.
schema:
  - "@type": ResearchOrganization
    "@id": https://nano.nau.edu/#organization
    name: MPaCT Lab
    alternateName: Microelectronics Processing and Characterization Testing Lab
    parentOrganization:
      "@type": CollegeOrUniversity
      name: Northern Arizona University
    url: https://nano.nau.edu/
    email: mpct.nano@nau.edu
    telephone: "+1-928-523-2343"
    address:
      "@type": PostalAddress
      streetAddress: 561 E Pine Knoll Dr, Building 98E
      addressLocality: Flagstaff
      addressRegion: AZ
      postalCode: "86001"
      addressCountry: US
    geo:
      "@type": GeoCoordinates
      latitude: 35.17765608035483
      longitude: -111.6491191644177
  - "@type": CollectionPage
    name: MPaCT Lab Knowledge Base
    url: https://nano.nau.edu/knowledge-base/
    about:
      "@id": https://nano.nau.edu/#organization
    hasPart:
      - { "@type": WebPage, name: Techniques,               url: "https://nano.nau.edu/knowledge-base/techniques/" }
      - { "@type": WebPage, name: By Sample Type,           url: "https://nano.nau.edu/knowledge-base/samples/" }
      - { "@type": WebPage, name: Choosing Between Methods, url: "https://nano.nau.edu/knowledge-base/compare/" }
      - { "@type": WebPage, name: Instruments,              url: "https://nano.nau.edu/knowledge-base/instruments/" }
      - { "@type": WebPage, name: Concepts and Definitions, url: "https://nano.nau.edu/knowledge-base/concepts/" }
---

# Find a method or a sample

The MPaCT Lab at Northern Arizona University in Flagstaff is a shared-use characterization and fabrication facility. These guides match what you already have - a sample, a method, or a choice - to the instrument in Building 98E that does that work.

You do not need a model name or a booking to start.

## Where to start

| If you have | Open | Example |
|---|---|---|
| A sample in hand | [By sample type](samples/index.md) | a film, a wafer, a powder, a part, a packaged device |
| A method in mind | [Techniques](techniques/index.md) | TEM, XRD, 3D printing, photolithography |
| Two methods and need to choose | [Choosing between methods](compare/index.md) | SEM or AFM? Print it or mill it? Mask or stamp? |
| A machine name | [Instruments](instruments/index.md) | Bambu Lab H2D, Haas Desktop Mill |
| A term to look up | [Concepts](concepts/index.md) | ladder logic, Seebeck coefficient |

A **technique** page explains the method: what it measures or makes, what it cannot do, and which machine performs it. An **instrument** page is the hardware: sizes, speeds, and limits. Most of the lab is documented by method. Instrument pages exist for machines that people look up by make and model.

The [equipment catalogue](/Equipment.html) lists every tool, with live status and booking.

## The sections

<div class="grid cards" markdown>

-   __By sample type__

    Start from the material you already have.

    [Thin films](samples/thin-films.md) &middot;
    [Wafers and coupons](samples/wafers-and-coupons.md) &middot;
    [Powders and porous solids](samples/powders-and-porous-solids.md) &middot;
    [Bulk solids](samples/bulk-solids.md) &middot;
    [Prototype parts](samples/prototype-parts.md) &middot;
    [Devices and packages](samples/devices-and-packaged-parts.md)

    [__All sample types &rarr;__](samples/index.md)

-   __Techniques__

    What each method measures or makes, how it works, and its limits.

    *Characterization* -
    [TEM](techniques/transmission-electron-microscopy.md) &middot;
    [SEM](techniques/scanning-electron-microscopy.md) &middot;
    [DualBeam](techniques/focused-ion-beam.md) &middot;
    [AFM](techniques/atomic-force-microscopy.md) &middot;
    [Optical profilometry](techniques/optical-profilometry.md) &middot;
    [Ellipsometry](techniques/spectroscopic-ellipsometry.md) &middot;
    [Photoluminescence](techniques/photoluminescence-spectroscopy.md) &middot;
    [XRD](techniques/x-ray-diffraction.md) &middot;
    [SIMS](techniques/secondary-ion-mass-spectrometry.md) &middot;
    [On-wafer probing](techniques/on-wafer-probing.md) &middot;
    [Digital microscopy](techniques/digital-microscopy.md) &middot;
    [Wide-area CMM](techniques/coordinate-measuring.md) &middot;
    [Impedance](techniques/impedance-analysis.md) &middot;
    [VNA](techniques/vector-network-analysis.md) &middot;
    [Cryogenics](techniques/cryogenic-measurement.md) &middot;
    [Seebeck](techniques/seebeck-and-resistivity.md) &middot;
    [Benchtop electrical](techniques/benchtop-electrical-measurement.md) &middot;
    [SLM](techniques/spatial-light-modulation.md) &middot;
    [Gas sorption and BET](techniques/gas-sorption-surface-area.md) &middot;
    [Degassing](techniques/sample-degassing.md)

    *Testing and calibration* -
    [Environmental stress testing](techniques/environmental-stress-testing.md) &middot;
    [Pressure calibration](techniques/pressure-calibration.md)

    *Fabrication and automation* -
    [FDM 3D printing](techniques/additive-manufacturing-fdm.md) &middot;
    [CNC machining](techniques/cnc-machining.md) &middot;
    [Laser micromachining](techniques/laser-micromachining.md) &middot;
    [Photolithography](techniques/photolithography.md) &middot;
    [Nanoimprint](techniques/nanoimprint-lithography.md) &middot;
    [Die and wire bonding](techniques/die-and-wire-bonding.md) &middot;
    [Conductive-ink PCB](techniques/conductive-ink-pcb-printing.md) &middot;
    [Wafer scribing](techniques/wafer-scribing.md) &middot;
    [TEM sample prep](techniques/tem-sample-preparation.md) &middot;
    [PLC and automation](techniques/industrial-automation-plc.md)

    [__All techniques &rarr;__](techniques/index.md)

-   __Choosing between methods__

    Decision tables, then the rule that resolves the trade-off.

    [TEM vs SEM vs AFM](compare/choosing-a-technique.md) &middot;
    [Inspecting a surface](compare/inspecting-a-surface.md) &middot;
    [3D printing vs CNC](compare/3d-printing-vs-cnc-machining.md) &middot;
    [Photolithography vs nanoimprint](compare/photolithography-vs-nanoimprint.md)

    [__All comparisons &rarr;__](compare/index.md)

-   __Instruments__

    Machines people look up by name, with sizes, speeds, and hard limits.

    [Bambu Lab H2D](instruments/bambu-lab-h2d.md) &middot;
    [Haas Desktop Mill](instruments/haas-desktop-mill.md) &middot;
    [Haas Desktop Lathe](instruments/haas-desktop-lathe.md) &middot;
    [Amatrol 870 line](instruments/amatrol-870-mechatronics-line.md) &middot;
    [Smart Robot Workcell](instruments/amatrol-smart-robot-workcell.md)

    [__All instruments &rarr;__](instruments/index.md)

-   __Concepts__

    Terms used in these guides, defined once and grouped by domain.

    [Microscopy](concepts/index.md#electron-and-probe-microscopy) &middot;
    [Thin-film metrology](concepts/index.md#optical-and-thin-film-metrology) &middot;
    [Microfabrication](concepts/index.md#microfabrication) &middot;
    [Electrical](concepts/index.md#electrical-characterization) &middot;
    [Packaging](concepts/index.md#microelectronic-packaging) &middot;
    [Porosity](concepts/index.md#porosity-and-surface-area) &middot;
    [Calibration](concepts/index.md#reliability-and-calibration) &middot;
    [Additive](concepts/index.md#additive-manufacturing) &middot;
    [Subtractive](concepts/index.md#subtractive-manufacturing) &middot;
    [Automation](concepts/index.md#industrial-automation-and-control)

    [__Full glossary &rarr;__](concepts/index.md)

</div>

## Contact

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button .md-button--primary } [Reserve an instrument](/Reserve_Equipment.html){ .md-button }
