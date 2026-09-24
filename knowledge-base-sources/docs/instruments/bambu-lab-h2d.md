---
title: Bambu Lab H2D 3D Printer
description: Dual-nozzle FDM printing to 350 C in a 65 C heated chamber, 350 x 320 x 325 mm, at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Fabrication
  - Additive Manufacturing
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

  - "@type": Service
    name: Dual-Material Fused Deposition Modeling
    serviceType: Additive manufacturing
    description: >-
      Multi-material and multi-colour 3D printing of functional prototypes, fixtures, and
      end-use parts in engineering thermoplastics including fibre-reinforced grades, with
      dissolvable and dedicated support materials.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/Reserve_Equipment.html

  - "@type": IndividualProduct
    name: Bambu Lab H2D
    category: Dual-Nozzle FDM 3D Printer
    url: https://nano.nau.edu/About_Equipment/Bambu_H2D.html
    manufacturer:
      "@type": Organization
      name: Bambu Lab
    additionalProperty:
      - "@type": PropertyValue
        name: Build volume, single extrusion
        value: 325 by 320 by 325 mm
      - "@type": PropertyValue
        name: Build volume, dual extrusion
        value: 300 by 320 by 325 mm
      - "@type": PropertyValue
        name: Total reachable volume
        value: 350 by 320 by 325 mm across both nozzles
      - "@type": PropertyValue
        name: Nozzle
        value: Hardened steel, 0.4 mm standard, 0.2, 0.6 and 0.8 mm supported
      - "@type": PropertyValue
        name: Maximum nozzle temperature
        value: 350 degrees Celsius
      - "@type": PropertyValue
        name: Maximum build plate temperature
        value: 120 degrees Celsius
      - "@type": PropertyValue
        name: Maximum chamber temperature
        value: 65 degrees Celsius
      - "@type": PropertyValue
        name: Motion accuracy
        value: 50 micrometres, vision-assisted encoder system
      - "@type": PropertyValue
        name: Maximum toolhead speed
        value: 1000 mm/s
      - "@type": PropertyValue
        name: Maximum toolhead acceleration
        value: 20,000 mm/s squared
      - "@type": PropertyValue
        name: Filament diameter
        value: 1.75 mm
      - "@type": PropertyValue
        name: Machine size and weight
        value: 492 by 514 by 626 mm, 31 kg

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is the difference between a dual-nozzle and a single-nozzle 3D printer?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A single-nozzle printer changes material by purging the old one out of the hot end,
            which wastes filament and limits how different the two materials can be. A
            dual-nozzle printer keeps each material in its own hot end at its own temperature,
            so a rigid part can be printed with a dissolvable support, or two materials with
            different melting points can be combined in one part without a purge tower.
      - "@type": Question
        name: Can this printer handle carbon fibre filament?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. Two things make fibre-reinforced filament practical here: a hardened steel
            nozzle, which resists the abrasion that destroys brass nozzles, and a chamber
            heated to 65 degrees Celsius, which keeps high-temperature engineering polymers
            from warping and delaminating as they cool. Carbon and glass fibre reinforced
            grades of PA, PC, PET, and PPS are within the machine's published material range.
      - "@type": Question
        name: How accurate is an FDM 3D printed part?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Motion accuracy and part accuracy are different numbers. The H2D positions its
            toolhead to 50 micrometres across the build volume, which bounds the best case.
            Actual dimensional accuracy is usually dominated by the material rather than the
            machine, because thermoplastics shrink as they cool and the shrinkage depends on
            geometry, infill, and orientation. Where a dimension must be held tightly, print
            it oversize and machine it, or verify it after printing.
      - "@type": Question
        name: Why is my print warping or lifting off the bed?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Because the part is cooling unevenly and the resulting internal stress exceeds
            adhesion to the plate. The bottom layers are held flat while upper layers contract
            as they cool, and the corners lift first. The chamber heater is the primary fix,
            since it reduces the temperature difference across the part. Beyond that: a clean
            plate, an appropriate plate temperature, a brim on tall or narrow footprints, and
            avoiding directed cooling on high-temperature materials.
---

# Bambu Lab H2D 3D Printer

The Bambu Lab H2D is a dual-nozzle fused deposition modeling printer with a 350 × 320 × 325 mm build volume, a hot end reaching 350 °C, and a chamber heated to 65 °C. The two independent nozzles allow multi-material and multi-colour parts without purging, and the heated chamber extends the usable material range to fibre-reinforced engineering thermoplastics.

## What the H2D does

Fused deposition modeling melts thermoplastic filament and lays it down in stacked layers. The three properties that determine what a given FDM machine can actually make are the nozzle temperature, the chamber temperature, and how the machine handles more than one material.

- **Nozzle temperature** sets which polymers can be extruded at all. At 350 °C the H2D covers PC, PA, PPS, and PPA as well as PLA and PETG.
- **Chamber temperature** sets which polymers can be printed *successfully*. High-temperature engineering polymers shrink substantially on cooling, and in an unheated chamber that shrinkage is uneven, warping the part and splitting layers apart. A chamber at 65 °C narrows the temperature gradient through the part while it builds.
- **Two nozzles** mean two materials held simultaneously at two temperatures. That is what makes dissolvable supports and true multi-material parts practical, rather than a sequence of purges.

A vision-assisted encoder system holds motion accuracy to 50 µm across the build volume. Up to four AMS 2 Pro or eight AMS HT units can be connected for automated material handling across long or multi-colour jobs.

For the method itself - how layers bond, why printed parts are anisotropic, and how FDM compares with resin printing - see [Fused Deposition Modeling](../techniques/additive-manufacturing-fdm.md). For choosing between printing and machining, see [3D printing vs CNC machining](../compare/3d-printing-vs-cnc-machining.md).

## When to use it

- Functional prototypes and fixtures in engineering thermoplastics
- Parts needing dissolvable or dedicated support material, such as internal channels and overhangs
- Multi-colour or multi-material components printed in one job
- Fibre-reinforced parts where stiffness matters more than surface finish
- Jigs, tooling, and sample holders for other instruments in the lab
- Mid-size models where the 350 mm span is the deciding constraint

## What it cannot do

- **It does not reach machining tolerance.** Thermoplastic shrinkage dominates dimensional accuracy. Critical dimensions should be printed oversize and finished on the [Haas Desktop Mill](haas-desktop-mill.md), or verified after printing.
- **Layer lines are structural, not cosmetic.** FDM parts are anisotropic and weakest between layers. Orientation is a design decision, not a print setting.
- **It is not a metal process.** Filament only.
- **Fine features are bounded by nozzle diameter.** A 0.2 mm nozzle helps, at a large cost in print time.
- **Overhangs need support.** Which the dual nozzle makes cleaner to remove, not unnecessary.
- **Optical clarity is not achievable.** Layer boundaries scatter light.

## The H2D at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Bambu Lab H2D** in Flagstaff, Arizona, available to NAU researchers, external academic users, and industry partners. It is one of the few instruments in the catalogue that can be reserved directly rather than submitted through a service request.

| Specification | Value |
|---|---|
| Technology | FDM/FFF, 1.75 mm filament |
| Build volume, single extrusion | 325 × 320 × 325 mm |
| Build volume, dual extrusion | 300 × 320 × 325 mm |
| Total reachable volume | 350 × 320 × 325 mm |
| Nozzle | Hardened steel; 0.4 mm standard, 0.2 / 0.6 / 0.8 mm supported |
| Max nozzle temperature | 350 °C |
| Max build plate temperature | 120 °C |
| Max chamber temperature | 65 °C |
| Motion accuracy | 50 µm, vision-assisted encoder |
| Max toolhead speed | 1000 mm/s |
| Max toolhead acceleration | 20,000 mm/s² |
| Build plate | Flexible textured PEI (smooth PEI optional) |
| Materials | PLA, PETG, TPU, PVA, ABS, ASA, PC, PA, PET, PPS, PPA, and carbon/glass fibre grades |
| AMS support | Up to 4 × AMS 2 Pro or 8 × AMS HT |
| Machine size | 492 × 514 × 626 mm |
| Net weight | 31 kg |

Specifications are as published by Bambu Lab for the H2D.

**Recharge rate:** the [rate sheet](/Rates.html) lists $7.33 per gram internal and $11.17 per gram external. The site's `rates.json` records this instrument as pending approval on a per-hour unit, so the two sources disagree on both the figure and the billable unit. Confirm the current rate with the lab before budgeting.

[Full H2D specifications and booking &rarr;](/About_Equipment/Bambu_H2D.html){ .md-button .md-button--primary }

## What to submit

- **Geometry.** STL, STEP, or 3MF. STEP is preferred where the part may need to be modified.
- **Material.** Name it, or describe the service condition - temperature, load, chemical exposure - and let the lab choose.
- **Critical dimensions.** Marked on a drawing. Anything that must hold a tolerance needs to be identified before printing, not after.
- **Orientation constraints.** If a surface must be smooth, or a direction must carry load, say which.
- **Quantity and deadline.** Print time scales with volume and inversely with layer height; a tall part can run for a day or more.

## Frequently asked questions

### What is the difference between a dual-nozzle and a single-nozzle 3D printer?

A single-nozzle printer changes material by purging the old one out of the hot end, which wastes filament and limits how different the two materials can be. A dual-nozzle printer keeps each material in its own hot end at its own temperature, so a rigid part can be printed with a dissolvable support, or two materials with different melting points can be combined in one part without a purge tower.

### Can this printer handle carbon fibre filament?

Yes. Two things make fibre-reinforced filament practical here: a hardened steel nozzle, which resists the abrasion that destroys brass nozzles, and a chamber heated to 65 °C, which keeps high-temperature engineering polymers from warping and delaminating as they cool. Carbon and glass fibre reinforced grades of PA, PC, PET, and PPS are within the machine's published material range.

### How accurate is an FDM 3D printed part?

Motion accuracy and part accuracy are different numbers. The H2D positions its toolhead to 50 µm across the build volume, which bounds the best case. Actual dimensional accuracy is usually dominated by the material rather than the machine, because thermoplastics shrink as they cool and the shrinkage depends on geometry, infill, and orientation. Where a dimension must be held tightly, print it oversize and machine it, or verify it after printing.

### Why is my print warping or lifting off the bed?

Because the part is cooling unevenly and the resulting internal stress exceeds adhesion to the plate. The bottom layers are held flat while upper layers contract as they cool, and the corners lift first. The chamber heater is the primary fix, since it reduces the temperature difference across the part. Beyond that: a clean plate, an appropriate plate temperature, a brim on tall or narrow footprints, and avoiding directed cooling on high-temperature materials.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
