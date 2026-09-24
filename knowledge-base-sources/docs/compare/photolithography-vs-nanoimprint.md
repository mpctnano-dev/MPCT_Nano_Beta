---
title: Photolithography vs Nanoimprint
description: Whether to pattern with a chrome mask or copy a stamp on the MJB4 or CNI v3.0 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Comparison
  - Fabrication
schema:
  - "@type": ResearchOrganization
    "@id": https://nano.nau.edu/#organization
    name: MPaCT Lab
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
  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: Should I use photolithography or nanoimprint?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Use the SUSS MJB4 when you have a chrome photomask and need 0.5 to
            1.0 micrometre features on a wafer up to 100 mm. Use the CNI v3.0
            when you have a stamp to copy, including features the contact
            aligner cannot print. Neither writes from a CAD file with no master.
      - "@type": Question
        name: Can nanoimprint replace a mask aligner?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Not for a chrome-mask process at micron scale, and not for aligned
            multilayer lithography of the kind the MJB4 is built for. Nanoimprint
            copies topography. Photolithography exposes an image. They share a
            resist step and then diverge.
---

# Photolithography vs Nanoimprint

The two tools at the MPaCT Lab in Flagstaff, Arizona, pattern resist. They do not do the same job. One exposes a mask with ultraviolet light. The other presses a stamp.

Start here: **do you already have a chrome mask, or a stamp?**

## Decision table

| | [Photolithography](../techniques/photolithography.md) | [Nanoimprint lithography](../techniques/nanoimprint-lithography.md) |
|---|---|---|
| **Transfer** | UV through a photomask | Mechanical imprint from a stamp |
| **What you must bring** | Chrome mask, 2 × 2 in to 5 × 5 in | A master or stamp that fits the chamber |
| **Feature size** | About 0.5–1.0 µm | About 40 nm to >100 µm, master dependent |
| **Largest substrate** | 100 mm | 120 mm or 210 mm chamber, option dependent |
| **Alignment of a second layer** | Topside, specified better than 1.0 µm | Not a production overlay system on this desktop tool |
| **Instrument at MPaCT** | SUSS MJB4 | NIL Technology CNI v3.0 |

## Choose by the question

**"I have a chrome mask for a 100 mm wafer."** - MJB4.

**"I have a stamp and need copies, including sub-100 nm features."** - CNI.

**"I only have a CAD file."** - Neither. Board-scale maskless work is [laser micromachining](../techniques/laser-micromachining.md) or [conductive-ink printing](../techniques/conductive-ink-pcb-printing.md).

**"I need a second layer aligned to the first."** - MJB4. Do not treat the CNI as a stepper.

Both tools are listed as expected rather than available on the equipment catalogue. Confirm live status before planning a run.

## Frequently asked questions

### Should I use photolithography or nanoimprint?

Use the SUSS MJB4 when you have a chrome photomask and need 0.5 to 1.0 micrometre features on a wafer up to 100 mm. Use the CNI v3.0 when you have a stamp to copy, including features the contact aligner cannot print. Neither writes from a CAD file with no master.

### Can nanoimprint replace a mask aligner?

Not for a chrome-mask process at micron scale, and not for aligned multilayer lithography of the kind the MJB4 is built for. Nanoimprint copies topography. Photolithography exposes an image. They share a resist step and then diverge.

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve an instrument](/Reserve_Equipment.html){ .md-button }
