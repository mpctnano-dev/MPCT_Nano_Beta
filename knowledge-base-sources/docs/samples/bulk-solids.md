---
title: Bulk Solids
description: Phase, thermoelectric numbers, and dimensions on bars, pellets, ceramics, and large parts at NAU's MPaCT Lab in Flagstaff, Arizona.
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
    name: Bulk Solid Characterization
    serviceType: Materials characterization
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
---

# Bulk Solids

You have a bar, pellet, ceramic, metal coupon, or a part too large for a microscope stage. This page is organised by the question, not by the machine. The measurements below are available at the MPaCT Lab in Flagstaff, Arizona.

## What can be measured, and with what

| Your question | Method | Instrument |
|---|---|---|
| What phase is it? | [X-ray diffraction](../techniques/x-ray-diffraction.md) | Rigaku SmartLab |
| What are the Seebeck coefficient and resistivity? | [Seebeck and resistivity](../techniques/seebeck-and-resistivity.md) | LINSEIS LSR-3 |
| What does the surface look like? | [SEM](../techniques/scanning-electron-microscopy.md) or [digital microscopy](../techniques/digital-microscopy.md) | JEOL JSM-IT710HR / Keyence VHX-7000 |
| How rough is a small, flat patch? | [AFM](../techniques/atomic-force-microscopy.md) | AFM Workshop B-2 |
| How rough is a millimetre-scale patch? | [Optical profilometry](../techniques/optical-profilometry.md) | Keyence VK-X3000 |
| What is the internal structure? | [TEM](../techniques/transmission-electron-microscopy.md), after [prep](../techniques/tem-sample-preparation.md) | JEOL JEM-F200 |
| Will it survive temperature and humidity? | [Environmental stress testing](../techniques/environmental-stress-testing.md) | CSZ MicroClimate |
| How large is this assembly, in millimetres? | [Wide-area CMM](../techniques/coordinate-measuring.md) | Keyence WM-6000 |

A powder or a porous pellet that needs surface area is a [powders](powders-and-porous-solids.md) question. A deposited film is a [thin film](thin-films.md) question.

## Decide in this order

1. **Does the sample fit a holder, or is it a large part?** XRD, Seebeck, AFM, and TEM prep take coupons and bars. The WM-6000 measures parts that will not fit a benchtop stage.
2. **Must the sample be returned intact?** XRD and Seebeck usually leave a bulk piece. TEM prep does not.
3. **Is the question electrical, structural, or dimensional?** Electrical is Seebeck or a later [device](devices-and-packaged-parts.md) measurement. Structure is XRD, SEM, or TEM. Dimensions of a large assembly are the CMM.

## What to send

- Geometry and material. For Seebeck, a bar or disc that matches the [LSR-3 sizes](../techniques/seebeck-and-resistivity.md).
- Whether the piece must be returned unaltered
- The longest dimension if the request is a CMM measurement
- The decision the measurement will inform

**MPaCT Lab** - Building 98E, South Engineering Lab, 561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve an instrument](/Reserve_Equipment.html){ .md-button }
