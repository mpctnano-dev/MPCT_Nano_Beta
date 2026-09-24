---
title: Powders and Porous Solids
description: What can be measured on a powder, catalyst, or porous solid - surface area, pore size, morphology, phase - and which instrument at NAU's MPaCT Lab measures each one.
tags:
  - Sample Type
  - Porous Materials
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
    name: Powder and Porous Materials Characterization
    serviceType: Materials characterization
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
---

# Powders and Porous Solids

You have a powder, catalyst, adsorbent, framework material, or porous ceramic, and you need to know what it is and how much surface it has. This page is organised by the question rather than by the instrument.

## What can be measured, and with what

| Your question | Technique | Instrument | Sample survives |
|---|---|---|---|
| What is the specific surface area? | [Gas sorption, BET](../techniques/gas-sorption-surface-area.md) | Microtrac BELSORP MAX X | Yes, after degassing |
| What is the pore size distribution? | [Gas sorption](../techniques/gas-sorption-surface-area.md) | BELSORP MAX X | Yes |
| Are there micropores below 1 nm? | Gas sorption with CO₂ or low P/P₀ | BELSORP MAX X | Yes |
| What is the total pore volume? | Gas sorption | BELSORP MAX X | Yes |
| What do the particles look like? | [SEM](../techniques/scanning-electron-microscopy.md) | JEOL JSM-IT710HR | Usually |
| What is the particle size and shape? | SEM imaging | JEOL JSM-IT710HR | Usually |
| What elements are present? | SEM-EDS | JEOL JSM-IT710HR | Usually |
| What is the internal structure of a particle? | [TEM](../techniques/transmission-electron-microscopy.md) | JEOL JEM-F200 | No |
| Is it crystalline, and which phase? | [XRD](../techniques/x-ray-diffraction.md) or TEM diffraction | Rigaku SmartLab / JEM-F200 | Yes / No |
| Is it thermally stable in service? | [Environmental stress testing](../techniques/environmental-stress-testing.md) | CSZ MicroClimate | Usually |
| Does it need drying before analysis? | [Degassing](../techniques/sample-degassing.md) | Microtrac BELPREP VAC | Yes, if conditions are right |

## Recommended order

Degassing comes first and is not optional. Everything after it is ordered so the non-destructive measurements happen while the sample is still intact.

1. **Degassing.** Physisorbed water and gases are removed under vacuum or flowing inert gas. An un-degassed sample reports a surface area that is wrong by an amount nobody can estimate afterwards, because the adsorbate had nowhere clean to adsorb.
2. **Gas sorption.** The full isotherm gives BET surface area, pore size distribution, and total pore volume from the same run. Micropore resolution requires low relative pressures and a genuinely long measurement.
3. **XRD.** Phase identification and crystallinity averaged over a large volume, on a sample that survives.
4. **SEM with EDS.** Particle morphology, agglomeration state, and elemental composition. Insulating powders image in low-vacuum mode without coating, which matters because a conductive coating fills fine surface texture.
5. **TEM.** Internal particle structure, lattice fringes, and fine porosity below what SEM resolves. Destructive and slow, so it answers the questions the earlier steps could not.

## Practical notes by material type

**Catalysts and supports.** BET area and pore size distribution are usually the primary result, and both depend entirely on degassing conditions. Report the degassing temperature and duration alongside the area - an area quoted without them is not comparable to anyone else's.

**Frameworks and microporous materials.** Nitrogen at 77 K diffuses slowly into pores below about 1 nm, and equilibration becomes the limiting factor. CO₂ at 273 K is the standard alternative for the smallest pores. Expect a long run.

**Beam-sensitive and organic powders.** Low accelerating voltage on the SEM, and treat degassing temperature as a risk rather than a setting - heating that removes water can also collapse a pore structure or decompose the material, and the measurement then describes something that no longer exists.

**Fine or low-density powders.** Sample mass drives whether a BET measurement is possible at all. A material with a small specific surface area needs proportionally more mass to give enough total adsorption to measure.

**Hygroscopic materials.** They re-adsorb water between degassing and analysis. Minimise exposure, and say so when submitting, so the handling can be arranged rather than discovered.

## What to send

- Enough material for the measurement - more than feels necessary for a low-surface-area sample
- The expected surface area, even as an order of magnitude, so the run can be planned
- Any temperature above which the material degrades, changes phase, or loses its pore structure
- The synthesis route and any prior thermal treatment
- Whether the material is air-sensitive, hygroscopic, or hazardous
- The decision the measurement will inform, which often changes which technique is appropriate

## Powder and porous materials characterization in Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a Microtrac BELSORP MAX X surface and pore analyzer with BELPREP VAC degassing, a JEOL JSM-IT710HR field-emission SEM with EDS, XRD, and an analytical JEOL JEM-F200 TEM in one facility in Flagstaff, Arizona. A powder can therefore be degassed, measured, imaged, and phase-identified as one project rather than shipped between facilities.

The lab is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Discuss a powder characterization project](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
