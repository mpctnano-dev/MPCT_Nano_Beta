---
title: Wafers and Coupons
description: Pattern, probe, cleave, or inspect a wafer or coupon at NAU's MPaCT Lab in Flagstaff, Arizona, from lithography through on-wafer test.
tags:
  - Sample Type
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
  - "@type": Service
    name: Wafer and Coupon Processing
    serviceType: Microfabrication and electrical test
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
---

# Wafers and Coupons

You have a wafer, or a piece of one, and you need to pattern it, probe it, or cut it down. This page is organised by the next step, not by the machine.

## What can be done, and with what

| Your question | Method | Instrument |
|---|---|---|
| How do I transfer a chrome mask into resist? | [Photolithography](../techniques/photolithography.md) | SUSS MJB4, up to 100 mm |
| How do I copy a stamp into resist? | [Nanoimprint lithography](../techniques/nanoimprint-lithography.md) | NIL Technology CNI v3.0 |
| Mask or stamp? | [Photolithography vs nanoimprint](../compare/photolithography-vs-nanoimprint.md) | Both tools |
| How do I cut a coupon from a wafer? | [Wafer scribing](../techniques/wafer-scribing.md) | PELCO FlexScribe 300, 5 mm to 300 mm |
| What are the I–V or RF numbers on pads? | [On-wafer probing](../techniques/on-wafer-probing.md) | MPI TS200, up to 200 mm |
| How thick is the film on this wafer? | [Ellipsometry](../techniques/spectroscopic-ellipsometry.md) | J.A. Woollam RC2 |
| What does the patterned surface look like? | [Digital microscopy](../techniques/digital-microscopy.md) or [SEM](../techniques/scanning-electron-microscopy.md) | Keyence VHX-7000 / JEOL JSM-IT710HR |
| How do I get a TEM specimen from this wafer? | [TEM sample preparation](../techniques/tem-sample-preparation.md) | Fischione 160, 200, 1051 |

## Decide in this order

1. **Must the wafer stay whole?** Probing, ellipsometry, and inspection can leave it intact. Scribing and TEM prep consume it.
2. **Is the next step a pattern or a measurement?** Patterning is lithography or nanoimprint. Measurement is probing, ellipsometry, or microscopy.
3. **Do you already have a mask, a stamp, or neither?** A chrome mask is the MJB4. A stamp is the CNI. A CAD file with no master is not either of those; board-scale patterns are [laser micromachining](../techniques/laser-micromachining.md) or [conductive ink](../techniques/conductive-ink-pcb-printing.md).
4. **What is the diameter?** The MJB4 takes 100 mm. The probe station takes 200 mm. The FlexScribe takes up to 300 mm.

A film already on the wafer is also a [thin film](thin-films.md) question.

## What to send

- Diameter, material, and whether the piece must be returned unaltered
- Whether a photomask or a stamp already exists
- Pad layout if the request is electrical
- The decision the measurement or process will inform

**MPaCT Lab** - Building 98E, South Engineering Lab, 561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve an instrument](/Reserve_Equipment.html){ .md-button }
