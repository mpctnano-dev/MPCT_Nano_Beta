---
title: Choosing Between Methods
description: Decision guides for the choices researchers face at NAU's MPaCT Lab - microscopy, surface inspection, printing versus machining, and lithography versus nanoimprint.
tags:
  - Comparison
schema:
  - "@type": ResearchOrganization
    "@id": https://nano.nau.edu/#organization
    name: MPaCT Lab
    url: https://nano.nau.edu/
    parentOrganization:
      "@type": CollegeOrUniversity
      name: Northern Arizona University
    address:
      "@type": PostalAddress
      streetAddress: 561 E Pine Knoll Dr, Building 98E
      addressLocality: Flagstaff
      addressRegion: AZ
      postalCode: "86001"
      addressCountry: US
  - "@type": ItemList
    name: Method comparisons
    itemListOrder: https://schema.org/ItemListUnordered
    numberOfItems: 4
    itemListElement:
      - { "@type": ListItem, position: 1, name: "TEM vs SEM vs AFM",                 url: "https://nano.nau.edu/knowledge-base/compare/choosing-a-technique/" }
      - { "@type": ListItem, position: 2, name: "Inspecting a surface",              url: "https://nano.nau.edu/knowledge-base/compare/inspecting-a-surface/" }
      - { "@type": ListItem, position: 3, name: "3D printing vs CNC machining",      url: "https://nano.nau.edu/knowledge-base/compare/3d-printing-vs-cnc-machining/" }
      - { "@type": ListItem, position: 4, name: "Photolithography vs nanoimprint",   url: "https://nano.nau.edu/knowledge-base/compare/photolithography-vs-nanoimprint/" }
---

# Choosing Between Methods

Each page leads with a decision table, then states the rule that resolves the trade-off.

| Decision | Page | The question that settles it |
|---|---|---|
| Which microscopy technique? | [TEM vs SEM vs AFM](choosing-a-technique.md) | Is the feature on the surface or inside it, and do you need a picture or a number? |
| How should I inspect this surface? | [Inspecting a surface](inspecting-a-surface.md) | Colour photograph, millimetre roughness, or a nanometre height map? |
| Print it or machine it? | [3D printing vs CNC machining](3d-printing-vs-cnc-machining.md) | Is the difficulty in the geometry, or in the tolerance and the load? |
| Mask or stamp? | [Photolithography vs nanoimprint](photolithography-vs-nanoimprint.md) | Do you have a chrome mask at micron scale, or a stamp to copy? |

## Smaller decisions, answered inside a technique page

These are resolved with a decision table on the page that owns the method:

- **Milling or turning?** - [CNC Machining](../techniques/cnc-machining.md#how-cnc-machining-works). What rotates decides it: the tool, or the workpiece.
- **Ellipsometry or profilometry for film thickness?** - [Spectroscopic Ellipsometry](../techniques/spectroscopic-ellipsometry.md).
- **Environmental chamber or laboratory oven?** - [Environmental Stress Testing](../techniques/environmental-stress-testing.md).
- **PLC or microcontroller?** - [Industrial Automation and PLC Control](../techniques/industrial-automation-plc.md).
- **FDM or resin printing?** - [Fused Deposition Modeling](../techniques/additive-manufacturing-fdm.md).
- **XRD or TEM diffraction?** - [X-ray Diffraction](../techniques/x-ray-diffraction.md).
- **SIMS or SEM-EDS?** - [Secondary Ion Mass Spectrometry](../techniques/secondary-ion-mass-spectrometry.md).
- **Die attach or wire bonding?** - [Die Attach and Wire Bonding](../techniques/die-and-wire-bonding.md). They are consecutive steps, not a choice.
- **Photoluminescence or Raman?** - [Photoluminescence Spectroscopy](../techniques/photoluminescence-spectroscopy.md). Emission and lifetime versus vibrational identity.
- **Laser structuring or a printed circuit?** - [Laser Micromachining](../techniques/laser-micromachining.md). Subtract copper, or print ink.
- **On-wafer probing or packaged test?** - [On-Wafer Probing](../techniques/on-wafer-probing.md). The die as fabricated, or the product after assembly.
- **VNA or impedance analyzer?** - [Vector Network Analysis](../techniques/vector-network-analysis.md). S-parameters of a 50 Ω network, or Z of a component from 20 Hz.

If the material is the fixed thing, start [by sample type](../samples/index.md). If you already know the method, use the [techniques index](../techniques/index.md).

**MPaCT Lab** - Building 98E, South Engineering Lab, 561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Ask which method you need](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
