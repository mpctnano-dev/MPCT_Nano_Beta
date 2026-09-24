---
title: Conductive-Ink PCB Printing
description: Desktop conductive-ink printing of prototype circuit boards on a Voltera V-One at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Fabrication
  - Electronics
schema:
  - "@type": DefinedTerm
    name: Conductive-Ink PCB Printing
    alternateName: Direct Ink Writing
    description: >-
      A desktop fabrication method in which conductive ink is dispensed onto a
      substrate to form traces, then cured, with optional drilling and solder-paste
      dispensing, so a circuit board can be prototyped without a photomask or
      an etch.
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
    name: Conductive-Ink PCB Printing
    serviceType: Electronics prototyping
    description: >-
      Print, drill, paste, and reflow of double-sided prototype circuit boards
      from Gerber files using dispensed conductive ink.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Voltera V-One
    category: Desktop PCB printer
    url: https://nano.nau.edu/About_Equipment/Voltera_VOne_PCB_Printer.html
    manufacturer:
      "@type": Organization
      name: Voltera
    additionalProperty:
      - "@type": PropertyValue
        name: Print area
        value: 128 by 116 by 3 mm
      - "@type": PropertyValue
        name: Minimum trace width
        value: 0.2 mm
      - "@type": PropertyValue
        name: Minimum trace spacing
        value: 0.2 mm
      - "@type": PropertyValue
        name: Minimum drill size
        value: 0.3 mm
      - "@type": PropertyValue
        name: Minimum pad diameter
        value: 0.6 mm

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is conductive-ink PCB printing?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Conductive-ink printing dispenses silver or similar ink onto a
            substrate to form traces, then cures the ink on a heated bed. The
            Voltera V-One also drills, dispenses solder paste, and reflows.
            The board is additive. Copper is not etched.
      - "@type": Question
        name: What is the difference between the V-One and the ProtoLaser?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Additive ink versus subtractive laser. The V-One prints 0.2 mm
            traces on a 128 by 116 mm area and is the fast classroom board.
            The LPKF ProtoLaser R4 structures copper-clad laminate at much
            finer line and space, and is the research PCB tool. The laser page
            owns that comparison; this page owns the ink process.
      - "@type": Question
        name: How fine a trace can the V-One print?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Voltera specifies 0.2 mm minimum trace width and 0.2 mm spacing,
            0.3 mm minimum drill, and 0.6 mm minimum pad diameter, on a 128 by
            116 by 3 mm print area. That is 8 mil class, not the ProtoLaser's
            tens of micrometres. QFN and 0402 are near the edge; 0201 is not
            the job.
      - "@type": Question
        name: Can the V-One make a multilayer board?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The catalogue lists double-sided and multi-layer workflows. Voltera
            specifies double-sided PCBs as the V-One layer capacity. Stacked
            layers beyond two are a workflow, not a four-layer production
            press. For laminated multilayers, the LPKF MultiPress is on the
            laser accessory list, not on this printer.
      - "@type": Question
        name: Why are my traces broken or too thin?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Nozzle height, ink rheology, and substrate probe. The V-One maps
            height before printing. A dirty nozzle, an empty cartridge, or a
            warped board that the clamp did not flatten will drop ink. 0.2 mm
            is the specified minimum, not a target for every design. Widen
            traces that carry current.
---

# Conductive-Ink PCB Printing

Conductive-ink PCB printing is a desktop fabrication method in which conductive ink is dispensed onto a substrate to form traces, then cured. Drilling and solder-paste dispensing sit on the same machine. The board is built additively. Copper is not etched, and no photomask is required.

## How conductive-ink PCB printing works

Gerber files drive a dispenser. A probe maps board height. Ink is laid as traces and pads, then cured on the heated bed. A drill makes holes. Solder paste is dispensed and reflowed on the same plate.

Voltera specifies the V-One at 128 × 116 × 3 mm print area, 0.2 mm minimum trace width and spacing, XYZ resolution 10 × 10 × 1 µm, double-sided layer capacity, FR1/FR4 substrates 1–3 mm thick, and 100–120 VAC (or 200–240 VAC), 575 W. Catalogue figures match the print area, 0.2 mm trace/space, 0.3 mm drill, and 0.6 mm pad.

The comparison with the [LPKF ProtoLaser R4](laser-micromachining.md) is owned on that page: subtract copper at tens of micrometres, or print ink at 0.2 mm.

## When to use conductive-ink PCB printing

- A classroom or prototype board needed the same day
- Double-sided boards at 0.2 mm class traces
- Designs that will change before a panel is ordered
- Teaching Gerber-to-board without a wet etch

## What conductive-ink PCB printing cannot do

- **It is not 35/20 µm laser structuring.** That is the ProtoLaser.
- **0.2 mm is the floor.** Fine-pitch BGAs are not this printer.
- **It is not a four-layer production press.** Double-sided is the specified capacity.
- **Ink is not copper foil.** Current-carrying capacity and RF loss differ. Do not treat a printed trace as a 1 oz copper equivalent without measuring it.

## The V-One at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Voltera V-One** PCB printer in Flagstaff, Arizona. The catalogue specifies 128 × 116 × 3 mm print area, 0.2 mm minimum trace width and spacing, 0.3 mm minimum drill, 0.6 mm minimum pad, and double-sided and multi-layer workflows. The instrument is listed as available. It is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Print area | 128 × 116 × 3 mm |
| Minimum trace width | 0.2 mm |
| Minimum trace spacing | 0.2 mm |
| Minimum drill | 0.3 mm |
| Minimum pad diameter | 0.6 mm |
| PCB capability | Double-sided and multi-layer workflows |

Figures follow the [equipment catalogue](/About_Equipment/Voltera_VOne_PCB_Printer.html) and Voltera's published V-One technical specifications.

[Full V-One specifications and booking &rarr;](/About_Equipment/Voltera_VOne_PCB_Printer.html){ .md-button .md-button--primary }

## Sample requirements

- **Files.** Gerber. Say layers, drill, and whether the board is double-sided.
- **Substrate.** FR1 or FR4, 1–3 mm, fitting the 128 × 116 mm area.
- **Components.** Paste and reflow are on the same bed. Fine-pitch parts still have to match 0.2 mm traces and 0.6 mm pads.
- **Current.** If a trace carries power, widen it. The minimum geometry is for signals.

## Frequently asked questions

### What is conductive-ink PCB printing?

Conductive-ink printing dispenses silver or similar ink onto a substrate to form traces, then cures the ink on a heated bed. The Voltera V-One also drills, dispenses solder paste, and reflows. The board is additive. Copper is not etched.

### What is the difference between the V-One and the ProtoLaser?

Additive ink versus subtractive laser. The V-One prints 0.2 mm traces on a 128 by 116 mm area and is the fast classroom board. The LPKF ProtoLaser R4 structures copper-clad laminate at much finer line and space, and is the research PCB tool. The laser page owns that comparison; this page owns the ink process.

### How fine a trace can the V-One print?

Voltera specifies 0.2 mm minimum trace width and 0.2 mm spacing, 0.3 mm minimum drill, and 0.6 mm minimum pad diameter, on a 128 by 116 by 3 mm print area. That is 8 mil class, not the ProtoLaser's tens of micrometres. QFN and 0402 are near the edge; 0201 is not the job.

### Can the V-One make a multilayer board?

The catalogue lists double-sided and multi-layer workflows. Voltera specifies double-sided PCBs as the V-One layer capacity. Stacked layers beyond two are a workflow, not a four-layer production press. For laminated multilayers, the LPKF MultiPress is on the laser accessory list, not on this printer.

### Why are my traces broken or too thin?

Nozzle height, ink rheology, and substrate probe. The V-One maps height before printing. A dirty nozzle, an empty cartridge, or a warped board that the clamp did not flatten will drop ink. 0.2 mm is the specified minimum, not a target for every design. Widen traces that carry current.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
