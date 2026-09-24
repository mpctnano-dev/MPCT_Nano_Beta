---
title: Transmission Electron Microscopy (TEM)
description: Transmission electron microscopy resolves structure and chemistry at atomic scale, on a JEOL JEM-F200 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Electron Microscopy
schema:
  - "@type": DefinedTerm
    name: Transmission Electron Microscopy
    alternateName: TEM
    description: >-
      A characterization technique in which a beam of electrons is transmitted through a
      specimen thinner than roughly 100 nm to form an image or diffraction pattern,
      resolving internal structure and composition below 0.2 nm.
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
    name: Transmission Electron Microscopy (TEM)
    serviceType: Materials characterization
    description: >-
      Atomic-resolution imaging, electron diffraction, and chemical analysis of
      electron-transparent specimens using a 200 kV analytical TEM/STEM.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: JEOL JEM-F200
    category: Transmission Electron Microscope
    url: https://nano.nau.edu/About_Equipment/TEM.html
    manufacturer:
      "@type": Organization
      name: JEOL
    additionalProperty:
      - "@type": PropertyValue
        name: Accelerating voltage
        value: 20 to 200 kV
      - "@type": PropertyValue
        name: TEM point resolution
        value: 0.19 nm
      - "@type": PropertyValue
        name: STEM-HAADF resolution
        value: 0.14 nm
      - "@type": PropertyValue
        name: Electron gun
        value: Schottky FEG / Cold FEG
      - "@type": PropertyValue
        name: Magnification range (TEM)
        value: 20x to 2,000,000x
      - "@type": PropertyValue
        name: Magnification range (STEM)
        value: 200x to 150,000,000x
      - "@type": PropertyValue
        name: Analytical options
        value: EDS, EELS, tomography

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: How thin does a TEM sample need to be?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Below roughly 100 nm, and often below 50 nm for high-resolution work.
            The MPaCT Lab operates a dimple grinder, a disk grinder, and an ion
            beam mill for preparing electron-transparent specimens.
      - "@type": Question
        name: What is the difference between TEM and SEM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A TEM transmits electrons through a thin specimen to reveal internal
            structure at atomic resolution. An SEM scans a beam across a bulk
            surface and collects scattered or secondary electrons, giving surface
            topography at lower resolution with far simpler sample preparation.
      - "@type": Question
        name: Can external companies use the TEM at NAU?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The MPaCT Lab is a shared-use facility in Flagstaff, Arizona,
            open to NAU researchers, external academic users, and industry
            partners on either a fee-for-service or hands-on trained-user basis.
      - "@type": Question
        name: What can EELS detect that EDS cannot?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Light elements. EDS sensitivity falls away below boron, whereas EELS detects
            from lithium upward and is the method of choice for elements with atomic
            number of 10 or below. For sodium the detection limit is roughly an order of
            magnitude better with EELS than with EDS.
      - "@type": Question
        name: Can TEM determine oxidation state?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes, through EELS. The fine structure of an EELS edge depends on bonding
            environment, so it distinguishes oxidation states of transition metals and
            separates allotropes of carbon. This is information no imaging mode and no
            EDS spectrum provides.
---

# Transmission Electron Microscopy (TEM)

Transmission electron microscopy (TEM) is a characterization technique in which a beam of electrons is transmitted through a specimen thinner than roughly 100 nm. Electrons that pass through the sample are focused into an image or a diffraction pattern, revealing crystal structure, defects, interfaces, and chemical composition at resolutions below 0.2 nm - small enough to resolve individual atomic columns.

## How transmission electron microscopy works

An electron gun accelerates electrons to high energy, 20 to 200 kV on a typical analytical instrument. Because an accelerated electron has a wavelength thousands of times shorter than visible light, the resolution limit that constrains optical microscopes does not apply.

Electromagnetic lenses focus the beam onto a specimen that has been thinned until it is electron-transparent. Three things then happen to the electrons, and each is a different measurement:

- **Transmitted electrons** form the conventional bright-field image, where contrast comes from differences in thickness, density, and crystal orientation.
- **Scattered electrons** are collected at high angle to form a STEM-HAADF image, in which brightness scales with atomic number. Heavy elements appear bright, so composition can be read directly from the image.
- **Energy lost by the beam** is measured by electron energy loss spectroscopy (EELS), which reports bonding state and electronic structure. Separately, X-rays emitted by the excited sample are measured by energy-dispersive spectroscopy (EDS) to give elemental composition.

## When to use TEM

TEM is the correct choice when the question is about internal structure at or near the atomic scale:

- Identifying crystal phase and orientation from electron diffraction
- Imaging dislocations, stacking faults, and grain boundaries
- Measuring layer thickness and abruptness in a semiconductor stack
- Locating dopants or precipitates and identifying them by composition
- Distinguishing an amorphous region from a crystalline one

If the question concerns surface topography, particle counts, or features larger than about 100 nm, [scanning electron microscopy](scanning-electron-microscopy.md) answers it faster and with far less sample preparation. If the question concerns bulk crystal structure averaged over a large volume, use [X-ray diffraction](x-ray-diffraction.md).

## What TEM cannot do

Being clear about the limits saves everyone a wasted session:

- **The sample must be destroyed.** Thinning to electron transparency is irreversible.
- **The field of view is tiny.** A TEM image covers a few micrometres at most. It cannot tell you whether what you are looking at is representative; that requires complementary bulk measurement.
- **Beam damage is real.** Polymers, biological material, and some oxides degrade under a 200 kV beam within seconds.
- **Preparation dominates the schedule.** Producing a good specimen routinely takes longer than the microscope session itself.

## TEM at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **JEOL JEM-F200** transmission electron microscope in Flagstaff, Arizona. It is a 200 kV analytical TEM/STEM with a field-emission gun, configured for both high-resolution imaging and chemical analysis.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user. NAU is the only university in northern Arizona offering shared-use access to an analytical TEM of this class.

| Specification | Value |
|---|---|
| Accelerating voltage | 20 to 200 kV |
| TEM point resolution | 0.19 nm |
| STEM-HAADF resolution | 0.14 nm |
| Electron gun | Schottky FEG / Cold FEG |
| Magnification range (TEM) | 20x to 2,000,000x |
| Magnification range (STEM) | 200x to 150,000,000x |
| Analytical options | EDS, EELS, tomography |

Available accessories include a backscattered electron detector for enhanced Z-contrast and an electron biprism for electron holography and phase imaging.

[Full JEOL JEM-F200 specifications and booking &rarr;](/About_Equipment/TEM.html){ .md-button .md-button--primary }

## Sample requirements

Specimens must be electron-transparent: below roughly 100 nm, and below 50 nm for high-resolution imaging. The lab operates a full preparation suite:

- Dimple grinder - thins the centre of a disk while leaving a supporting rim
- Disk grinder - produces flat, parallel-sided disks of uniform thickness
- Ion beam mill - final thinning to electron transparency by argon ion sputtering
- Site-specific lift-out is the listed [DualBeam](focused-ion-beam.md)

If you are unsure whether your material can be prepared, [contact the lab](/Contact_Us.html?category=equipment) before submitting a request. Staff will advise on preparation route and realistic turnaround.

## Frequently asked questions

### How thin does a TEM sample need to be?

Below roughly 100 nm, and often below 50 nm for high-resolution work. The MPaCT Lab operates a dimple grinder, a disk grinder, and an ion beam mill for preparing electron-transparent specimens. See [TEM sample preparation](tem-sample-preparation.md).

### What is the difference between TEM and SEM?

A TEM transmits electrons through a thin specimen to reveal internal structure at atomic resolution. An SEM scans a beam across a bulk surface and collects scattered or secondary electrons, giving surface topography at lower resolution with far simpler sample preparation.

### Can external companies use the TEM at NAU?

Yes. The MPaCT Lab is a shared-use facility in Flagstaff, Arizona, open to NAU researchers, external academic users, and industry partners on either a fee-for-service or hands-on trained-user basis.

### What can EELS detect that EDS cannot?

Light elements. EDS sensitivity falls away below boron, whereas EELS detects from lithium upward and is the method of choice for elements with atomic number of 10 or below. For sodium the detection limit is roughly an order of magnitude better with EELS than with EDS.

### Can TEM determine oxidation state?

Yes, through EELS. The fine structure of an EELS edge depends on bonding environment, so it distinguishes oxidation states of transition metals and separates allotropes of carbon. This is information no imaging mode and no EDS spectrum provides.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
