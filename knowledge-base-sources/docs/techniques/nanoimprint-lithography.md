---
title: Nanoimprint Lithography (NIL)
description: Thermal and UV nanoimprint lithography of stamp patterns on a NIL Technology CNI v3.0 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Fabrication
  - Lithography
schema:
  - "@type": DefinedTerm
    name: Nanoimprint Lithography
    alternateName: NIL
    description: >-
      A patterning process in which a master stamp is pressed into a
      thermoplastic or UV-curable resist so that the stamp's topography is
      replicated in the resist, then used as a mask or as a functional
      structure.
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
    name: Nanoimprint Lithography
    serviceType: Micro- and nanofabrication
    description: >-
      Thermal and UV nanoimprint, hot embossing, and related stamp replication
      of micro- and nanoscale patterns from a master.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: NIL Technology CNI v3.0
    category: Compact nanoimprint tool
    url: https://nano.nau.edu/About_Equipment/NIL_CNI_v3.html
    manufacturer:
      "@type": Organization
      name: NIL Technology
    additionalProperty:
      - "@type": PropertyValue
        name: Thermal imprint temperature
        value: Up to 250 C
      - "@type": PropertyValue
        name: UV imprint
        value: 365 nm or 405 nm, up to 200 C
      - "@type": PropertyValue
        name: Pressure
        value: Membrane pressure up to about 6.5 bar
      - "@type": PropertyValue
        name: Atmosphere
        value: Atmospheric or vacuum around 1 mbar
      - "@type": PropertyValue
        name: Feature size
        value: Approximately 40 nm to greater than 100 micrometres, master dependent
      - "@type": PropertyValue
        name: Chamber options
        value: 120 mm or 210 mm diameter

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is nanoimprint lithography?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Nanoimprint lithography replicates a master's topography by pressing
            it into a resist, then curing the resist with heat or ultraviolet
            light. The copy can be the functional pattern, or it can be a mask
            for a later etch. Resolution is set by the stamp, not by the
            wavelength of a lithography lamp.
      - "@type": Question
        name: What is the difference between nanoimprint and photolithography?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Transfer mechanism. Photolithography exposes a mask into resist with
            UV; the SUSS MJB4 is specified at about 0.5 to 1.0 micrometres and
            needs a photomask. Nanoimprint presses a stamp; the CNI v3.0 is
            specified from about 40 nm to greater than 100 micrometres, master
            dependent. Use the MJB4 when you have a chrome mask at micron
            scale. Use NIL when you have a stamp and need to copy it, including
            features the contact aligner cannot print.
      - "@type": Question
        name: How small a feature can the CNI v3.0 imprint?
        acceptedAnswer:
          "@type": Answer
          text: >-
            NIL Technology specifies replication from smaller than 40 nm to
            larger than 100 micrometres, master dependent. The tool does not
            invent resolution the stamp does not have. A poor master, trapped
            air, or an under-filled resist will print worse than 40 nm
            regardless of the brochure.
      - "@type": Question
        name: Do I need a photomask for nanoimprint?
        acceptedAnswer:
          "@type": Answer
          text: >-
            No. You need a stamp, or a master from which a stamp can be made.
            A chrome photomask for the MJB4 is not a NIL stamp. If you only
            have a CAD file and no master, neither this tool nor the contact
            aligner will write the pattern; laser structuring is the maskless
            route on this site, at a coarser scale.
      - "@type": Question
        name: Why are there voids in my imprint?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Air, or unfilled trenches. The CNI can imprint under vacuum of
            about 1 mbar, which is the usual first fix. Pressure is applied by
            a membrane, specified up to about 6.5 bar. If vacuum and pressure
            still leave voids, the resist thickness or the stamp aspect ratio
            is wrong, not the recipe time.
---

# Nanoimprint Lithography (NIL)

Nanoimprint lithography is a patterning process in which a master stamp is pressed into a thermoplastic or UV-curable resist so that the stamp's topography is replicated. The copy may be the functional structure, or a mask for a later etch. Resolution follows the stamp, not the wavelength of a lithography lamp.

## How nanoimprint lithography works

A stamp and a coated substrate are stacked in a chamber. A membrane applies uniform pressure. Heat softens a thermoplastic (thermal NIL, hot embossing), or UV cures a resist (UV NIL). Vacuum can be drawn first so air is not trapped in the features.

The NIL Technology CNI v3.0 is a desktop tool specified for thermal NIL up to 250 °C, UV NIL at 365 nm or 405 nm (up to 200 °C with UV lids), membrane pressure up to about 6.5 bar, atmospheric or ~1 mbar vacuum, and replication from about 40 nm to >100 µm, master dependent. Chamber options are 120 mm or 210 mm diameter. Load and unload are manual; process control is automatic.

Which chamber and which lid (high-temperature, UV 365, UV 405) are installed is not asserted here. Confirm with staff before writing a recipe around a lid you may not have.

## When to use nanoimprint lithography

- Copying a stamp that already exists, including sub-100 nm features the contact aligner cannot print
- Hot embossing a polymer
- UV replication of optical microstructures
- Polymer bonding or micro-contact printing, which the manufacturer lists on the same tool
- Repeating a pattern without paying for a new chrome mask each time, once the stamp exists

## What nanoimprint lithography cannot do

- **It does not write from CAD.** No stamp means no imprint. Maskless board-scale work is [laser micromachining](laser-micromachining.md) or [conductive-ink printing](conductive-ink-pcb-printing.md).
- **40 nm is a master specification, not a guaranteed result on your stack.** Aspect ratio, residual layer, and demoulding set the real floor.
- **It is not a stepper.** Alignment of a second layer is not specified as a production overlay system on this desktop tool.
- **Contact lithography remains the route for a chrome mask at 0.5–1.0 µm** on the [SUSS MJB4](photolithography.md).

## The CNI v3.0 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a **NIL Technology CNI v3.0** compact nanoimprinter in Flagstaff, Arizona. The catalogue specifies thermal NIL, UV NIL, hot embossing, micro-contact printing, and polymer bonding; 250 °C thermal / 200 °C with UV lids; membrane pressure up to about 6.5 bar; ~1 mbar vacuum; ~40 nm to >100 µm features; and 120 mm or 210 mm chambers.

The equipment catalogue currently lists the CNI v3.0 as expected rather than available. Confirm live status on the [catalogue page](/About_Equipment/NIL_CNI_v3.html) before planning an imprint.

When the tool is in service it is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Technologies | Thermal NIL, UV NIL, hot embossing, micro-contact printing, polymer bonding |
| Thermal temperature | Up to 250 °C |
| UV | 365 nm or 405 nm, up to 200 °C |
| Pressure | Membrane, up to about 6.5 bar |
| Atmosphere | Atmospheric or vacuum (~1 mbar) |
| Feature size | ~40 nm to >100 µm, master dependent |
| Chamber | 120 mm or 210 mm diameter options |

Figures follow the [equipment catalogue](/About_Equipment/NIL_CNI_v3.html) and NIL Technology's CNI v3.0 brochure.

[Full CNI v3.0 specifications and booking &rarr;](/About_Equipment/NIL_CNI_v3.html){ .md-button .md-button--primary }

## Sample requirements

- **Stamp.** A master that fits the installed chamber. Say the material and the smallest feature.
- **Substrate.** A wafer or coupon that fits the same chamber. Stack height is limited; NIL Technology quotes up to 25 mm for the imprint stack.
- **Resist.** Thermoplastic or UV-curable, matched to the lid that is installed.
- **Demould.** Say if the stamp is soft or hard; sticking is a process failure, not a software one.

## Frequently asked questions

### What is nanoimprint lithography?

Nanoimprint lithography replicates a master's topography by pressing it into a resist, then curing the resist with heat or ultraviolet light. The copy can be the functional pattern, or it can be a mask for a later etch. Resolution is set by the stamp, not by the wavelength of a lithography lamp.

### What is the difference between nanoimprint and photolithography?

Transfer mechanism. Photolithography exposes a mask into resist with UV; the SUSS MJB4 is specified at about 0.5 to 1.0 micrometres and needs a photomask. Nanoimprint presses a stamp; the CNI v3.0 is specified from about 40 nm to greater than 100 micrometres, master dependent. Use the MJB4 when you have a chrome mask at micron scale. Use NIL when you have a stamp and need to copy it, including features the contact aligner cannot print.

### How small a feature can the CNI v3.0 imprint?

NIL Technology specifies replication from smaller than 40 nm to larger than 100 micrometres, master dependent. The tool does not invent resolution the stamp does not have. A poor master, trapped air, or an under-filled resist will print worse than 40 nm regardless of the brochure.

### Do I need a photomask for nanoimprint?

No. You need a stamp, or a master from which a stamp can be made. A chrome photomask for the MJB4 is not a NIL stamp. If you only have a CAD file and no master, neither this tool nor the contact aligner will write the pattern; laser structuring is the maskless route on this site, at a coarser scale.

### Why are there voids in my imprint?

Air, or unfilled trenches. The CNI can imprint under vacuum of about 1 mbar, which is the usual first fix. Pressure is applied by a membrane, specified up to about 6.5 bar. If vacuum and pressure still leave voids, the resist thickness or the stamp aspect ratio is wrong, not the recipe time.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
