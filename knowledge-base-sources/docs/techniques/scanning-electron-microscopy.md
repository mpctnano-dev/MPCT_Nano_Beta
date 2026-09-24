---
title: Scanning Electron Microscopy (SEM)
description: Scanning electron microscopy images surface morphology and composition from 1 nm up, on a JEOL JSM-IT710HR at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Electron Microscopy
schema:
  - "@type": DefinedTerm
    name: Scanning Electron Microscopy
    alternateName: SEM
    description: >-
      A characterization technique in which a focused electron beam is scanned across a
      specimen surface, with detectors collecting emitted electrons and X-rays to image
      surface topography and composition down to about one nanometre.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

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

  - "@type": Service
    name: Scanning Electron Microscopy (SEM) and EDS Microanalysis
    serviceType: Materials characterization
    description: >-
      Surface imaging from millimetre to nanometre scale with elemental analysis by
      energy-dispersive X-ray spectroscopy, on a field-emission SEM with high- and
      low-vacuum modes.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: JEOL JSM-IT710HR
    category: Field Emission Scanning Electron Microscope
    url: https://nano.nau.edu/About_Equipment/SEM.html
    manufacturer:
      "@type": Organization
      name: JEOL
    additionalProperty:
      - "@type": PropertyValue
        name: Accelerating voltage
        value: 0.5 to 30 kV
      - "@type": PropertyValue
        name: Resolution (high vacuum)
        value: 1.0 nm at 20 kV; 3.0 nm at 1 kV
      - "@type": PropertyValue
        name: Resolution (low vacuum)
        value: 4.0 nm at 30 kV
      - "@type": PropertyValue
        name: Analytical resolution
        value: 3.0 nm at 15 kV, 3 nA probe current
      - "@type": PropertyValue
        name: Maximum probe current
        value: 300 nA
      - "@type": PropertyValue
        name: Direct magnification
        value: 5x to 600,000x
      - "@type": PropertyValue
        name: Electron source
        value: In-lens Schottky field emission gun
      - "@type": PropertyValue
        name: Detectors
        value: Secondary electron and quadrant backscatter with live 3D reconstruction
      - "@type": PropertyValue
        name: Integrated analytics
        value: JEOL energy-dispersive X-ray spectroscopy (EDS)

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: Does an SEM sample need to be coated?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Conductive samples do not. Insulating samples normally require a few
            nanometres of sputtered carbon or gold to prevent charging. The low-vacuum
            mode on the JSM-IT710HR is an alternative that images many insulators
            uncoated, which matters when the sample must be preserved.
      - "@type": Question
        name: What elements can SEM-EDS detect?
        acceptedAnswer:
          "@type": Answer
          text: >-
            EDS detects elements from boron upward in the periodic table. It cannot
            detect hydrogen, helium, or lithium. Practical detection limits are around
            0.1 to 1 weight percent, so EDS is a bulk-composition tool rather than a
            trace-analysis one. For trace elements use secondary ion mass spectrometry.
      - "@type": Question
        name: Can external companies use the SEM at NAU?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The MPaCT Lab is a shared-use facility in Flagstaff, Arizona, open to
            NAU researchers, external academic users, and industry partners on either a
            fee-for-service or hands-on trained-user basis.
      - "@type": Question
        name: Why is my SEM sample charging?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Charge is accumulating faster than it drains away, which happens on
            insulating samples. The image drifts, glares, or refuses to focus. Three
            fixes work: sputter a few nanometres of conductive coating, drop the
            accelerating voltage to around 1 kV, or switch to low-vacuum mode, where
            residual gas neutralises the surface and no coating is needed.
---

# Scanning Electron Microscopy (SEM)

Scanning electron microscopy (SEM) is a characterization technique in which a focused electron beam is scanned across a specimen surface in a raster pattern. Detectors collect the electrons and X-rays emitted at each point, building an image of surface topography and composition at resolutions down to about one nanometre - roughly a thousand times finer than an optical microscope.

## How scanning electron microscopy works

An electron gun produces a beam that electromagnetic lenses focus to a probe a few nanometres across. Scan coils sweep that probe across the sample line by line. At every point the beam interacts with the material and generates several signals, each collected by a different detector and each answering a different question:

- **Secondary electrons** are low-energy electrons knocked from the top few nanometres of the surface. They are highly sensitive to topography, and they produce the familiar three-dimensional-looking SEM image.
- **Backscattered electrons** are beam electrons reflected by atomic nuclei. Yield rises with atomic number, so a backscatter image separates regions by mean composition - heavy phases appear bright without any need for chemical analysis.
- **Characteristic X-rays** are emitted when the beam ejects an inner-shell electron and an outer electron drops to fill the vacancy. Each element emits a fixed set of X-ray energies, so measuring them identifies which elements are present. This is energy-dispersive X-ray spectroscopy, or EDS.

The beam does not penetrate the sample and emerge on the other side, which is the essential difference from [transmission electron microscopy](transmission-electron-microscopy.md). SEM reads a surface; TEM reads through a thin section.

## When to use SEM

SEM is the correct choice when the question concerns a surface, and the features of interest are larger than roughly 10 nm:

- Imaging fracture surfaces, wear, corrosion, and failure sites
- Measuring feature size, line width, and film cross-section on a cleaved device
- Identifying which elements make up a particle, inclusion, or contaminant
- Mapping how composition varies across a surface
- Counting and sizing particles, pores, or grains over a large area
- Inspecting solder joints, wire bonds, and package interconnects

SEM is also the sensible first look at almost any unknown solid. It needs little preparation, covers millimetres to nanometres in one session, and usually determines which more specialised technique is worth booking next.

## What SEM cannot do

- **It sees the surface, not the interior.** Buried layers and internal structure need a cross-section, or TEM.
- **Resolution stops well short of atomic.** At 1.0 nm the JSM-IT710HR resolves fine structure but not lattice planes or individual atomic columns.
- **EDS is not trace analysis.** Detection limits sit near 0.1 to 1 weight percent, and elements lighter than boron are invisible to it.
- **Quantitative height is unreliable.** SEM images look three-dimensional but encode topography as brightness, not as calibrated height. For height and roughness in nanometres, use [atomic force microscopy](atomic-force-microscopy.md).
- **The chamber is a vacuum.** Wet, volatile, or living samples must be dried, frozen, or chemically fixed first.

## SEM at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **JEOL JSM-IT710HR** field-emission scanning electron microscope in Flagstaff, Arizona. The instrument pairs an in-lens Schottky field-emission gun with integrated EDS, so imaging and elemental analysis happen in one session rather than across two bookings.

Its high- and low-vacuum modes switch without breaking vacuum, which means poorly conducting samples - ceramics, polymers, geological material, biological tissue - can often be imaged without a conductive coating. For samples that must be returned unaltered, that is frequently the deciding capability.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Accelerating voltage | 0.5 to 30 kV |
| Resolution, high vacuum | 1.0 nm at 20 kV; 3.0 nm at 1 kV |
| Resolution, low vacuum | 4.0 nm at 30 kV |
| Analytical resolution | 3.0 nm at 15 kV, 3 nA probe current |
| Maximum probe current | 300 nA |
| Direct magnification | 5x to 600,000x |
| Electron source | In-lens Schottky field emission gun |
| Detectors | Secondary electron, quadrant backscatter with live 3D |
| Integrated analytics | JEOL EDS for live spectra and X-ray maps |
| Automation | Montage, scripting, remote control, data management |

Specifications are as published by JEOL for the JSM-IT710HR.

[Full JEOL JSM-IT710HR specifications and booking &rarr;](/About_Equipment/SEM.html){ .md-button .md-button--primary }

## Sample requirements

SEM is tolerant, which is why it is usually the first stop:

- **Size.** Anything that fits the chamber and stage. Small enough to mount, rigid enough not to shed.
- **Vacuum compatibility.** Dry and non-outgassing. Wet samples must be dried or critical-point dried; volatile material is not admissible.
- **Conductivity.** Metals and doped semiconductors need nothing. Insulators either take a thin sputtered coating or go into low-vacuum mode uncoated.
- **Cross-sections.** To see a film stack in section, cleave or polish first. The [PELCO FlexScribe 300](/About_Equipment/PELCO_FlexScribe_300.html) is available for controlled cleaving.

If you are unsure whether your material is vacuum-compatible, [contact the lab](/Contact_Us.html?category=equipment) before submitting a request.

## Frequently asked questions

### Does an SEM sample need to be coated?

Conductive samples do not. Insulating samples normally require a few nanometres of sputtered carbon or gold to prevent charging. The low-vacuum mode on the JSM-IT710HR is an alternative that images many insulators uncoated, which matters when the sample must be preserved.

### What elements can SEM-EDS detect?

EDS detects elements from boron upward in the periodic table. It cannot detect hydrogen, helium, or lithium. Practical detection limits are around 0.1 to 1 weight percent, so EDS is a bulk-composition tool rather than a trace-analysis one. For trace elements use [secondary ion mass spectrometry](secondary-ion-mass-spectrometry.md).

### Can external companies use the SEM at NAU?

Yes. The MPaCT Lab is a shared-use facility in Flagstaff, Arizona, open to NAU researchers, external academic users, and industry partners on either a fee-for-service or hands-on trained-user basis.

### Why is my SEM sample charging?

Charge is accumulating faster than it drains away, which happens on insulating samples. The image drifts, glares, or refuses to focus. Three fixes work: sputter a few nanometres of conductive coating, drop the accelerating voltage to around 1 kV, or switch to low-vacuum mode, where residual gas neutralises the surface and no coating is needed.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
