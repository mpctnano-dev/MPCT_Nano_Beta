---
title: Thin Film Characterization
description: What can be measured on a thin film - thickness, roughness, composition, crystallinity - and which instrument at NAU's MPaCT Lab measures each one.
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
    name: Thin Film Characterization
    serviceType: Materials characterization
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
---

# Thin Film Characterization

You have deposited a film and need to know whether it came out right. This page is organised by the question rather than by the instrument.

## What can be measured, and with what

| Your question | Technique | Instrument | Sample survives |
|---|---|---|---|
| How thick is it? | Ellipsometry (optical) | Ellipsometer | Yes |
| How thick is it, exactly, in cross-section? | [TEM](../techniques/transmission-electron-microscopy.md) | JEOL JEM-F200 | No |
| How rough is the surface? | [AFM](../techniques/atomic-force-microscopy.md) (small patch) or [optical profilometry](../techniques/optical-profilometry.md) (mm-scale) | AFM Workshop B-2 / Keyence VK-X3000 | Yes |
| Is it continuous, or has it islanded? | [SEM](../techniques/scanning-electron-microscopy.md) | JEOL JSM-IT710HR | Usually |
| What is it made of? | SEM-EDS | JEOL JSM-IT710HR | Usually |
| Are there trace elements or dopants? | [SIMS](../techniques/secondary-ion-mass-spectrometry.md) | Hiden SIMS Workstation | No |
| Is it crystalline or amorphous? | [XRD](../techniques/x-ray-diffraction.md) or TEM diffraction | Rigaku SmartLab / JEM-F200 | Yes / No |
| How abrupt is the interface? | TEM cross-section | JEOL JEM-F200 | No |
| What is the grain size? | SEM, or TEM for fine grains | Both | Varies |
| Does it emit, and at what energy? | [Photoluminescence](../techniques/photoluminescence-spectroscopy.md) | Edinburgh Instruments FLS1000 | Yes |
| Is the surface electrically uniform? | [On-wafer probing](../techniques/on-wafer-probing.md) | MPI TS200 | Yes |
| What does a defect look like in colour? | [Digital microscopy](../techniques/digital-microscopy.md) | Keyence VHX-7000 | Yes |
| Can I copy a nano-pattern into this film? | [Nanoimprint lithography](../techniques/nanoimprint-lithography.md) | NIL Technology CNI v3.0 | Patterning, not metrology |

## Recommended order

Run non-destructive measurements first. The film is easier to replace than the information.

1. **Ellipsometry** - optical thickness and refractive index on a blanket area. Fast, contactless, no preparation.
2. **AFM** - roughness across a 50 by 50 micrometre area, and step height if a patterned step is available. Ambient air, no coating. Use [optical profilometry](../techniques/optical-profilometry.md) first if the survey is millimetres, not micrometres.
3. **SEM** - continuity, morphology, defect density over a wide area, plus EDS composition. Insulating films image in low-vacuum mode without a coating.
4. **XRD** - phase and crystallinity averaged over a large volume.
5. **TEM cross-section** - layer thicknesses, interface abruptness, and local crystallography. Destructive, and preparation takes days, so it is the last step and reserved for questions the earlier steps could not answer.

## Practical notes by film type

**Oxides and nitrides.** Insulating, so SEM either needs a thin conductive coating or low-vacuum mode. AFM needs neither, which is why roughness is usually measured before anything is coated. Coating first destroys the roughness measurement.

**Metals.** Straightforward for SEM with no preparation. Thin metal films roughen visibly with thermal treatment, and AFM quantifies that change where SEM only suggests it.

**Polymers and organics.** Beam-sensitive. Low accelerating voltage on SEM, or AFM in tapping mode to avoid dragging the tip across a soft surface.

**Multilayer stacks.** Only TEM resolves individual layers and their interfaces. Budget several days for [TEM sample preparation](../techniques/tem-sample-preparation.md) - disk grinding, dimpling, then ion milling.

## What to send

- A witness coupon from the same deposition run, if the production sample cannot be released
- The substrate material and nominal film thickness
- The deposition method and any post-deposition thermal treatment
- Whether the sample must be returned unaltered
- The decision the measurement will inform, which often changes which technique is appropriate

## Thin film characterization in Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds ellipsometry, AFM, optical profilometry, photoluminescence, field-emission SEM with EDS, XRD, SIMS, on-wafer probing, and analytical TEM with full sample preparation in one facility in Flagstaff, Arizona. A film can therefore move through the full sequence as a single project rather than being shipped between facilities.

The lab is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Discuss a thin film project](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
