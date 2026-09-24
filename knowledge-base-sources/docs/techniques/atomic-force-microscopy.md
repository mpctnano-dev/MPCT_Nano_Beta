---
title: Atomic Force Microscopy (AFM)
description: Atomic force microscopy measures surface roughness and step height in nanometres, on an AFM Workshop B-2 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Scanning Probe
schema:
  - "@type": DefinedTerm
    name: Atomic Force Microscopy
    alternateName: AFM
    description: >-
      A surface metrology technique in which a probe on a flexible cantilever is scanned
      across a sample at constant force, recording the vertical motion required to
      produce a calibrated three-dimensional height map.
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
    name: Atomic Force Microscopy (AFM)
    serviceType: Surface metrology
    description: >-
      Quantitative nanoscale surface topography, roughness, and step-height measurement
      in ambient conditions, with no vacuum and no conductive coating required.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: AFM Workshop B-2
    category: Atomic Force Microscope
    url: https://nano.nau.edu/About_Equipment/B2_AFM.html
    manufacturer:
      "@type": Organization
      name: AFM Workshop
    additionalProperty:
      - "@type": PropertyValue
        name: XY scan range
        value: 50 um x 50 um
      - "@type": PropertyValue
        name: Z range
        value: 17 um
      - "@type": PropertyValue
        name: Scanners
        value: Linearized X, Y and Z with closed-loop strain gauges
      - "@type": PropertyValue
        name: Imaging modes
        value: Vibrating (tapping), non-vibrating (contact), phase, lateral force
      - "@type": PropertyValue
        name: Noise floor
        value: Under 0.3 nm in standard configuration; under 0.15 nm with the optional vibration isolation table

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is the difference between AFM and SEM for surface roughness?
        acceptedAnswer:
          "@type": Answer
          text: >-
            AFM measures height directly with a physical probe and returns calibrated
            roughness values in nanometres. SEM encodes topography as image brightness,
            which looks three-dimensional but is not a height measurement. For a
            quantitative Ra or RMS roughness figure, AFM is the correct instrument.
      - "@type": Question
        name: Does an AFM sample need to be conductive or coated?
        acceptedAnswer:
          "@type": Answer
          text: >-
            No. AFM senses force rather than current, so insulators, polymers, and
            oxides are measured directly with no conductive coating. Measurements run
            in ambient air rather than vacuum, so the sample is returned unaltered.
      - "@type": Question
        name: How large an area can the AFM scan?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Up to 50 by 50 micrometres laterally, with 17 micrometres of vertical
            range. Features taller than that, or surveys across a whole wafer, are
            better handled by optical profilometry on the Keyence VK-X3000.
      - "@type": Question
        name: Why does my AFM image look streaked or wider than expected?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Almost always tip convolution. The measured image is the true surface
            broadened by the shape of the tip, so steep walls slope and narrow trenches
            appear shallow. Lateral widths on high-aspect-ratio features are therefore
            systematically overstated. Vertical heights stay accurate, which is why AFM
            step-height data is trustworthy even where widths are not.
---

# Atomic Force Microscopy (AFM)

Atomic force microscopy (AFM) is a surface metrology technique in which a sharp probe on a flexible cantilever is scanned across a sample while the force between tip and surface is held constant. The vertical motion required to maintain that force is recorded at every point, producing a calibrated three-dimensional height map with sub-nanometre vertical sensitivity.

## How atomic force microscopy works

The probe is a tip a few nanometres across at the end of a cantilever. A laser reflects off the back of the cantilever onto a segmented photodetector, so any deflection of the cantilever moves the laser spot and is measured directly. A feedback loop drives a piezoelectric scanner to keep that deflection constant as the tip moves, and the scanner's vertical correction *is* the topography.

Two modes cover most work:

- **Contact mode** keeps the tip in continuous contact and tracks the surface directly. It is fast and tolerant of setup error, and it suits hard, flat samples. Lateral drag can damage soft material.
- **Tapping mode** oscillates the cantilever near resonance so the tip touches the surface only briefly at the bottom of each cycle. Shear force falls sharply, which is what makes polymers, biological material, and loosely bound particles measurable.

Two further channels record material contrast rather than height. **Phase imaging** measures the lag between drive and response, distinguishing regions of differing stiffness or adhesion even where they are level. **Lateral force** measures cantilever twist and maps friction.

Because AFM senses force and not current, it needs neither vacuum nor a conductive coating - the fundamental difference from electron microscopy, and often the reason it is chosen.

## When to use AFM

AFM is the correct choice when the question is quantitative and vertical:

- Measuring surface roughness as a calibrated Ra or RMS value
- Measuring step height of a deposited or etched film
- Confirming thin-film uniformity and continuity after deposition
- Measuring the height and pitch of patterned nanostructures
- Distinguishing phases of differing stiffness by phase contrast
- Characterising surfaces that must not be coated, dried, or placed in vacuum

If you need a number in nanometres rather than a picture, AFM is the instrument.

## What AFM cannot do

- **The scan area is small.** 50 by 50 micrometres per image. Whole-wafer survey work belongs on [optical profilometry](optical-profilometry.md).
- **It is slow.** A high-resolution image is minutes, not seconds. It is a measurement tool, not a survey tool.
- **Vertical range is limited.** Features taller than 17 micrometres exceed the scanner.
- **It reports no chemistry.** AFM measures shape and mechanical response. For elemental composition use [SEM-EDS](scanning-electron-microscopy.md).
- **The tip convolves the image.** Measured lateral width is the true feature broadened by the tip shape. Steep walls and deep trenches are systematically distorted; vertical heights remain accurate.

## AFM at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates an **AFM Workshop B-2** atomic force microscope in Flagstaff, Arizona. The scanners are linearized in all three axes with closed-loop strain gauges, so lateral distances and step heights are measured against a calibrated scale rather than inferred from piezo drive voltage.

It runs in ambient air. No vacuum, no sputter coating, no fixation - a sample can be measured and returned in the same condition it arrived. For thin films, coatings, and patterned substrates that must continue to a downstream process step, this is decisive.

The instrument supports both research and teaching, and is available to NAU researchers, external academic users, and industry partners on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| XY scan range | 50 um x 50 um |
| Z range | 17 um |
| Noise floor | < 0.3 nm standard; < 0.15 nm with vibration isolation table |
| Scanners | Linearized X, Y, Z with closed-loop strain gauges |
| Imaging modes | Vibrating (tapping), non-vibrating (contact), phase, lateral force |
| Environment | Ambient air, acoustic enclosure |

Noise floor figures are as published by AFM Workshop for the B-2.

[Full AFM Workshop B-2 specifications and booking &rarr;](/About_Equipment/B2_AFM.html){ .md-button .md-button--primary }

## Sample requirements

AFM asks less of a sample than any other technique in the lab:

- **Flatness.** Total height variation under 17 micrometres across the scan area. Very rough samples are the one common disqualifier.
- **Size.** Must sit stably on the stage. Small coupons, chips, and cleaved pieces are ideal.
- **Cleanliness.** Loose particles and residue attach to the tip and corrupt the scan. Blow off with dry nitrogen before submitting.
- **Conductivity.** Not required.
- **Vacuum compatibility.** Not required.
- **Coating.** Not required, and not wanted - a sputtered layer changes the roughness being measured.

## Frequently asked questions

### What is the difference between AFM and SEM for surface roughness?

AFM measures height directly with a physical probe and returns calibrated roughness values in nanometres. SEM encodes topography as image brightness, which looks three-dimensional but is not a height measurement. For a quantitative Ra or RMS roughness figure, AFM is the correct instrument.

### Does an AFM sample need to be conductive or coated?

No. AFM senses force rather than current, so insulators, polymers, and oxides are measured directly with no conductive coating. Measurements run in ambient air rather than vacuum, so the sample is returned unaltered.

### How large an area can the AFM scan?

Up to 50 by 50 micrometres laterally, with 17 micrometres of vertical range. Features taller than that, or surveys across a whole wafer, are better handled by [optical profilometry](optical-profilometry.md) on the Keyence VK-X3000.

### Why does my AFM image look streaked or wider than expected?

Almost always tip convolution. The measured image is the true surface broadened by the shape of the tip, so steep walls slope and narrow trenches appear shallow. Lateral widths on high-aspect-ratio features are therefore systematically overstated. Vertical heights stay accurate, which is why AFM step-height data is trustworthy even where widths are not.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
