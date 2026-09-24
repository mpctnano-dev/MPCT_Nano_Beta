---
title: Focused Ion Beam (DualBeam FIB-SEM)
description: Site-specific FIB milling, cross-sections, and SEM imaging on an FEI Quanta 3D FEG DualBeam at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Sample Prep
  - Electron Microscopy
schema:
  - "@type": DefinedTerm
    name: Focused Ion Beam
    alternateName: DualBeam FIB-SEM
    description: >-
      A characterization and sample-preparation method that uses a focused
      gallium ion beam to mill, cross-section, or lift out a site on a specimen,
      while a coincident SEM column images the same location during the cut.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": ResearchOrganization
    "@id": "https://nano.nau.edu/#organization"
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
    name: DualBeam FIB-SEM
    serviceType: Site-specific milling and electron imaging
    description: >-
      Focused-ion-beam milling, cross-sectioning, and coincident SEM imaging
      on a DualBeam platform, including TEM lamella preparation.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: FEI Quanta 3D FEG DualBeam
    category: DualBeam FIB-SEM
    url: https://nano.nau.edu/About_Equipment/DualBeam_FIBSEM.html
    manufacturer:
      "@type": Organization
      name: Thermo Fisher Scientific
    additionalProperty:
      - "@type": PropertyValue
        name: SEM resolution
        value: 1.2 nm at 30 kV, secondary electrons, high vacuum
      - "@type": PropertyValue
        name: Ion beam resolution
        value: 7 nm at 30 kV at the coincident point
      - "@type": PropertyValue
        name: Ion source
        value: Gallium liquid-metal ion source
      - "@type": PropertyValue
        name: Vacuum modes
        value: High vacuum, low vacuum, and ESEM

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is a DualBeam FIB-SEM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A DualBeam puts a focused gallium ion beam and a scanning electron
            microscope in the same chamber, aimed at the same point. The ion
            beam mills or cross-sections a chosen site. The SEM images that
            site while the cut is happening. It is not a second SEM sitting
            next to a mill.
      - "@type": Question
        name: What is the difference between DualBeam and the JEOL SEM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The JEOL JSM-IT710HR is an SEM for surface morphology and EDS. It
            does not mill. The Quanta 3D FEG DualBeam images and cuts. Use the
            JEOL when you need a survey image or composition. Use the DualBeam
            when you need a cross-section, a TEM lamella, or a site-specific
            cut.
      - "@type": Question
        name: Can the DualBeam prepare a TEM sample?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes, as a site-specific lamella. That is the listed public route
            for TEM lift-out on this catalog. Mechanical disk grinding,
            dimpling, and argon milling are a different workflow and are not
            listed on the public equipment catalogue.
      - "@type": Question
        name: Do I need a conductive coating?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Not always. The catalogue specifies high-vacuum, low-vacuum, and
            ESEM modes so insulators and hydrated specimens can be imaged
            without a coating. Milling still deposits gallium and can amorphise
            the cut face. Say if the surface must stay uncoated.
      - "@type": Question
        name: Why is my DualBeam cross-section smeared or redeposited?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Ion energy, current, and gas chemistry. High current mills fast and
            leaves debris. The catalogue lists gas-assisted etch and deposition
            (platinum, tungsten, carbon, and insulator etch) to reduce
            redeposition. A final low-current polish, not a longer high-current
            mill, is the usual fix.
---

# Focused Ion Beam (DualBeam FIB-SEM)

A DualBeam FIB-SEM uses a focused gallium ion beam to mill or cross-section a chosen site on a specimen, while a coincident SEM column images that same point during the cut. The output is a site-specific section, a TEM lamella, or a 3D slice series, not a survey image of a bulk surface.

## How DualBeam milling works

Two columns share one chamber. The SEM is a field-emission gun, specified from 200 V to 30 kV, with 1.2 nm secondary-electron resolution at 30 kV in high vacuum. The ion column is a gallium liquid-metal ion source, specified at 2–30 kV and 1 pA–65 nA, with 7 nm resolution at 30 kV at the coincident point.

The operator finds the site in the SEM, mills with the ion beam, and watches the SEM image as material is removed. Gas injectors can deposit platinum, tungsten, gold, or SiO2, or enhance the etch. The stage is a 5-axis eucentric goniometer (X/Y 50 mm, Z 25 mm, tilt −15° to +75°).

Three vacuum modes are listed: high vacuum, low vacuum (10–130 Pa), and ESEM (10–4000 Pa). Low vacuum and ESEM are why an insulator does not automatically need a coating.

## When to use DualBeam

- A cross-section through a chosen defect, via, or interface
- A TEM lamella from a specific device site
- 3D slice-and-view of a small volume
- Gas-assisted deposition or selective etch at that site
- Imaging a non-conductive or hydrated specimen in low vacuum or ESEM while milling

## What DualBeam cannot do

- **It is not the survey SEM.** Morphology and EDS of a large field belong on the [JEOL JSM-IT710HR](scanning-electron-microscopy.md).
- **It is not a blanket TEM prep of a 3 mm disk.** Site-specific lift-out is the DualBeam job. Mechanical grind, dimple, and argon mill are a different path; those tools are not on the public catalogue.
- **Gallium is implanted and the cut face can amorphise.** A DualBeam lamella is not an unirradiated crystal.
- **7 nm ion resolution is not SEM resolution.** The SEM column is 1.2 nm; the mill is coarser.

## The Quanta 3D FEG at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates an **FEI Quanta 3D FEG DualBeam** in Flagstaff, Arizona. The catalogue specifies 1.2 nm SEM resolution at 30 kV (SE, high vacuum), 7 nm ion resolution at 30 kV at coincidence, a Ga LMIS, high / low / ESEM vacuum, and gas chemistry for deposition and etch. The instrument is listed on the public equipment catalogue. It is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Electron source | Field-emission gun, 200 V–30 kV |
| SEM resolution | 1.2 nm at 30 kV (SE, high vacuum); 2.9 nm at 1 kV (SE) |
| Ion source | Ga liquid-metal ion source |
| Ion resolution | 7 nm at 30 kV at the coincident point |
| Ion voltage / current | 2–30 kV; 1 pA–65 nA, 15 steps |
| Vacuum | High vacuum; low vacuum 10–130 Pa; ESEM 10–4000 Pa |
| Stage | 5-axis eucentric; X/Y 50 mm, Z 25 mm, tilt −15° to +75° |

Figures follow the [equipment catalogue](/About_Equipment/DualBeam_FIBSEM.html).

[Full DualBeam specifications and booking &rarr;](/About_Equipment/DualBeam_FIBSEM.html){ .md-button .md-button--primary }

## Sample requirements

- **Site.** A feature you can find in the SEM. DualBeam is not a random mill of a whole coupon.
- **Material.** Say if it is insulating, hydrated, or beam-sensitive. That chooses vacuum mode and current.
- **Protective layer.** If the top surface matters, a deposited strap is part of the run, not optional.
- **TEM lift-out.** Say the target thickness and whether the lamella must go on the [JEM-F200](transmission-electron-microscopy.md) in this lab.

## Frequently asked questions

### What is a DualBeam FIB-SEM?

A DualBeam puts a focused gallium ion beam and a scanning electron microscope in the same chamber, aimed at the same point. The ion beam mills or cross-sections a chosen site. The SEM images that site while the cut is happening. It is not a second SEM sitting next to a mill.

### What is the difference between DualBeam and the JEOL SEM?

The JEOL JSM-IT710HR is an SEM for surface morphology and EDS. It does not mill. The Quanta 3D FEG DualBeam images and cuts. Use the JEOL when you need a survey image or composition. Use the DualBeam when you need a cross-section, a TEM lamella, or a site-specific cut.

### Can the DualBeam prepare a TEM sample?

Yes, as a site-specific lamella. That is the listed public route for TEM lift-out on this catalog. Mechanical disk grinding, dimpling, and argon milling are a different workflow and are not listed on the public equipment catalogue.

### Do I need a conductive coating?

Not always. The catalogue specifies high-vacuum, low-vacuum, and ESEM modes so insulators and hydrated specimens can be imaged without a coating. Milling still deposits gallium and can amorphise the cut face. Say if the surface must stay uncoated.

### Why is my DualBeam cross-section smeared or redeposited?

Ion energy, current, and gas chemistry. High current mills fast and leaves debris. The catalogue lists gas-assisted etch and deposition (platinum, tungsten, carbon, and insulator etch) to reduce redeposition. A final low-current polish, not a longer high-current mill, is the usual fix.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
