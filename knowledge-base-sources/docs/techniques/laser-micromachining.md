---
title: Laser Micromachining (Laser Structuring)
description: Laser micromachining structures, drills, and cuts thermally sensitive substrates on an LPKF ProtoLaser R4 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Fabrication
  - Laser Processing
  - Electronics
schema:
  - "@type": DefinedTerm
    name: Laser Micromachining
    alternateName: Laser Structuring
    description: >-
      A fabrication process in which a pulsed laser ablates material to structure, drill,
      or cut a substrate, removing metal, ceramic, glass, or polymer with little heat
      transfer into the surrounding part.
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
    name: Laser Micromachining and PCB Structuring
    serviceType: Laser fabrication
    description: >-
      Picosecond laser structuring, drilling, cutting, and thin-film ablation on FR4,
      ceramics, glass, and flexible foils for RF, microwave, and electronics prototypes.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: LPKF ProtoLaser R4
    category: Picosecond laser micromachining system
    url: https://nano.nau.edu/About_Equipment/LPKF_ProtoLaser.html
    manufacturer:
      "@type": Organization
      name: LPKF
    additionalProperty:
      - "@type": PropertyValue
        name: Laser wavelength
        value: 515 nm (green)
      - "@type": PropertyValue
        name: Pulse length
        value: About 1.5 picoseconds
      - "@type": PropertyValue
        name: Laser power
        value: 8 W maximum
      - "@type": PropertyValue
        name: Minimum line and space
        value: 35 micrometres line, 20 micrometres space
      - "@type": PropertyValue
        name: Maximum material size
        value: 315 by 239 millimetres
      - "@type": PropertyValue
        name: Processing area
        value: 305 by 229 by 7 millimetres
      - "@type": PropertyValue
        name: Positioning accuracy
        value: Plus or minus 8 micrometres in the scan field
      - "@type": PropertyValue
        name: Repeatability
        value: Plus or minus 0.23 micrometres
      - "@type": PropertyValue
        name: Structuring speed
        value: About 3.5 square centimetres per minute on 18 micrometre copper
      - "@type": PropertyValue
        name: Control software
        value: LPKF CircuitPro PL

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is laser micromachining?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Laser micromachining removes material with a focused pulsed laser instead of
            a cutting tool. On the ProtoLaser R4 the pulse is about 1.5 picoseconds at
            515 nm, which the catalogue describes as cold ablation: copper, ceramic, glass,
            or polymer is ejected before much heat reaches the surrounding substrate.
            The same tool structures conductive layers, drills vias, cuts outlines, and
            strips thin films such as ITO or gold.
      - "@type": Question
        name: What is the difference between laser structuring and mechanical PCB milling?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A mill cuts by contact. A picosecond laser ablates without a bit, so there is
            no tool radius, no vibration from a cutter, and no bit to replace. The R4 is
            specified at 35 µm minimum line and 20 µm minimum space; a mechanical mill is
            typically limited near 100 µm by the bit. Laser structuring is contactless.
            It is not a plated production process: through-hole plating and multilayer
            lamination are separate steps, and those LPKF accessories are listed as
            unavailable on the catalogue page.
      - "@type": Question
        name: What is the difference between the LPKF ProtoLaser and the Voltera V-One?
        acceptedAnswer:
          "@type": Answer
          text: >-
            They add copper in opposite directions. The Voltera V-One prints conductive
            ink onto a blank board. The ProtoLaser R4 removes copper or another film from
            a clad or coated substrate. Use the Voltera when the starting material is
            bare and the traces can be ink. Use the R4 when you already have a metal
            layer, need finer line and space, or the substrate is ceramic, glass, or
            polyimide that a mill or an ink printer does not handle.
      - "@type": Question
        name: What materials can the ProtoLaser R4 process?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The catalogue lists FR4, fired ceramics including alumina and LTCC, glass,
            and flexible polyimide foils. Operating modes include copper structuring,
            cutting and depaneling, micro-via and through-hole drilling, and removal of
            thin films such as TCO, ITO, or gold from glass or plastic. Bring the stack-up:
            cladding thickness, dielectric, and any coating the beam must not damage.
      - "@type": Question
        name: Can the ProtoLaser plate through-holes or laminate multilayers?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Not with the accessories currently listed as available. The catalogue shows
            the LPKF Electroplater, MultiPress S, reflow oven, and wave solder as
            unavailable. The Pick and Place is listed as available. The R4 itself drills
            holes and structures copper; plated vias and laminated inner layers are a
            different process, and that process is not on this tool today. Confirm live
            accessory status on the catalogue page before assuming a plated or multilayer
            workflow.
---

# Laser Micromachining (Laser Structuring)

Laser micromachining is a fabrication process in which a pulsed laser ablates material to structure, drill, or cut a substrate. On a picosecond tool the pulse is short enough that metal, ceramic, glass, or polymer can be removed with little heat transfer into the surrounding part, which is why the same machine can pattern an RF laminate and cut a fired ceramic without a mechanical bit.

## How laser micromachining works

A focused pulse deposits energy in a spot faster than that energy can diffuse as heat. Material at the focus is ejected. The catalogue calls this **cold ablation**. The heat-affected zone is small compared with a nanosecond laser or a mill, which is what keeps RF laminates from delaminating and ceramics from micro-cracking when the process is in spec.

Four jobs share that pulse:

- **Structuring.** Ablating a copper or other conductive layer to leave traces, with a specified minimum of 35 µm line and 20 µm space.
- **Cutting and depaneling.** Separating a board, flex, or ceramic coupon from a panel.
- **Drilling.** Micro-vias and through-holes.
- **Surface processing.** Stripping a thin film such as TCO or ITO from glass or plastic without cutting through the substrate.

The beam does not care about a drill-bit radius. Corners, tapers, and isolated pads are a scan-path problem, not a tool-geometry problem. The process is still subtractive: it removes what is already there. It does not deposit copper.

## When to use laser micromachining

- Rapid PCB or RF prototypes on copper-clad laminates, including high-frequency materials that mill poorly
- Flexible polyimide circuits that would distort under a cutter or a hot process
- Fired ceramics (alumina, LTCC): cutting, drilling, or channel structuring without a grinding wheel
- Selective removal of gold, ITO, or TCO from glass or plastic
- Geometry a mill cannot reach because of bit radius, or a job where vibration from a cutter is the risk
- Any case where a photomask is not justified and [contact photolithography](photolithography.md) is the wrong resolution or the wrong substrate

## What laser micromachining cannot do

- **It does not plate holes or laminate inner layers on its own.** The R4 drills and structures. Through-hole copper and multilayer pressing are accessories, and the catalogue lists the Electroplater, MultiPress S, reflow oven, and wave solder as unavailable.
- **It is not sub-micron lithography.** 35 µm line / 20 µm space is the specified minimum. Features at 0.5–1.0 µm belong on the [mask aligner](photolithography.md).
- **It does not add metal the way a printer does.** Starting from a blank dielectric is a [Voltera V-One](/About_Equipment/Voltera_VOne_PCB_Printer.html) question, not an R4 question.
- **It is not a structural-metal mill.** The catalogue's applications are electronics substrates, ceramics, glass, foils, and thin films. It is not a substitute for [CNC machining](cnc-machining.md) of a fixture.
- **Cold ablation is not zero heat in every stack.** A process off the material window can still crack ceramic or lift copper. The first coupon is a process check, not a finished part.

## The ProtoLaser R4 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates an **LPKF ProtoLaser R4** picosecond laser micromachining system in Flagstaff, Arizona. The catalogue specifies a 515 nm green laser, a pulse length of about 1.5 ps, 8 W maximum power, and a working envelope of 315 × 239 mm material with a 305 × 229 × 7 mm processing volume.

Positioning accuracy is listed as ±8 µm in the scan field, repeatability as ±0.23 µm, and structuring speed as about 3.5 cm²/min on 18 µm copper. Control is LPKF CircuitPro PL.

The laser itself is listed as available. Accessory status is separate: Pick and Place is listed as available; MultiPress S, Electroplater, reflow oven, and wave solder are listed as unavailable. Confirm live status on the catalogue page; it is the source of truth for what is actually on the floor.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Laser wavelength | 515 nm (green) |
| Pulse length | ~1.5 ps |
| Laser power | 8 W maximum |
| Minimum line / space | 35 µm / 20 µm |
| Maximum material size | 315 × 239 mm |
| Processing area (X / Y / Z) | 305 × 229 × 7 mm |
| Positioning accuracy | ±8 µm (scan field) |
| Repeatability | ±0.23 µm |
| Structuring speed | ~3.5 cm²/min (18 µm Cu) |
| Software | LPKF CircuitPro PL |

Figures follow the [equipment catalogue](/About_Equipment/LPKF_ProtoLaser.html).

[Full ProtoLaser R4 specifications and booking &rarr;](/About_Equipment/LPKF_ProtoLaser.html){ .md-button .md-button--primary }

## Sample requirements

- **Substrate.** FR4, ceramic, glass, polyimide, or another catalogue material, with the copper or film thickness stated. A 18 µm copper process window is not a 70 µm window.
- **Size.** Inside 315 × 239 mm, and not thicker than the 7 mm Z processing range.
- **Stack-up.** Dielectric, cladding, coverlay, and any coating the beam must leave intact.
- **Files.** Gerber or a vector path staff can import into CircuitPro. Dimensioned outlines if the job is a cut, not a circuit.
- **Hazards.** Declare anything that outgasses, is beryllia, or is a polymer you do not want carbonised.

## Frequently asked questions

### What is laser micromachining?

Laser micromachining removes material with a focused pulsed laser instead of a cutting tool. On the ProtoLaser R4 the pulse is about 1.5 picoseconds at 515 nm, which the catalogue describes as cold ablation: copper, ceramic, glass, or polymer is ejected before much heat reaches the surrounding substrate. The same tool structures conductive layers, drills vias, cuts outlines, and strips thin films such as ITO or gold.

### What is the difference between laser structuring and mechanical PCB milling?

A mill cuts by contact. A picosecond laser ablates without a bit, so there is no tool radius, no vibration from a cutter, and no bit to replace. The R4 is specified at 35 µm minimum line and 20 µm minimum space; a mechanical mill is typically limited near 100 µm by the bit. Laser structuring is contactless. It is not a plated production process: through-hole plating and multilayer lamination are separate steps, and those LPKF accessories are listed as unavailable on the catalogue page.

### What is the difference between the LPKF ProtoLaser and the Voltera V-One?

They add copper in opposite directions. The Voltera V-One prints conductive ink onto a blank board. The ProtoLaser R4 removes copper or another film from a clad or coated substrate. Use the Voltera when the starting material is bare and the traces can be ink. Use the R4 when you already have a metal layer, need finer line and space, or the substrate is ceramic, glass, or polyimide that a mill or an ink printer does not handle.

### What materials can the ProtoLaser R4 process?

The catalogue lists FR4, fired ceramics including alumina and LTCC, glass, and flexible polyimide foils. Operating modes include copper structuring, drilling of micro-vias and through-holes, cutting and depaneling, and removal of thin films such as TCO, ITO, or gold from glass or plastic. Bring the stack-up: cladding thickness, dielectric, and any coating the beam must not damage.

### Can the ProtoLaser plate through-holes or laminate multilayers?

Not with the accessories currently listed as available. The catalogue shows the LPKF Electroplater, MultiPress S, reflow oven, and wave solder as unavailable. The Pick and Place is listed as available. The R4 itself drills holes and structures copper; plated vias and laminated inner layers are a different process, and that process is not on this tool today. Confirm live accessory status on the catalogue page before assuming a plated or multilayer workflow.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
