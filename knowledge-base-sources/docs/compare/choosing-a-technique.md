---
title: TEM vs SEM vs AFM
description: Which microscopy technique answers your question, compared by resolution, sample survival, and what each one actually measures, at NAU's MPaCT Lab.
tags:
  - Comparison
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
        name: Which is better, TEM or SEM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Neither is better; they answer different questions. SEM images a surface
            with almost no preparation and reaches about 1 nm. TEM images through a
            thin section and reaches 0.19 nm, but the sample must be destroyed to
            prepare it. Ask whether the feature is on the surface or inside it.
      - "@type": Question
        name: Can AFM replace SEM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Only for quantitative height and roughness on small, flat areas. AFM
            returns calibrated nanometre heights that SEM cannot, but it scans just
            50 by 50 micrometres, reports no chemistry, and is far slower. Most
            projects use SEM to find the region of interest and AFM to measure it.
---

# TEM vs SEM vs AFM

The three techniques are often described as competing. They are not. Each measures a different physical quantity, and the choice follows from the question rather than from which instrument is available.

Start here: **is the feature on the surface or inside the material, and do you need a picture or a number?**

## Decision table

| | [TEM](../techniques/transmission-electron-microscopy.md) | [SEM](../techniques/scanning-electron-microscopy.md) | [AFM](../techniques/atomic-force-microscopy.md) |
|---|---|---|---|
| **Measures** | Internal structure, crystallography | Surface morphology, composition | Surface height, mechanical contrast |
| **Best resolution** | 0.19 nm point; 0.14 nm STEM | 1.0 nm at 20 kV | Sub-nanometre vertical |
| **Field of view** | A few micrometres | Millimetres to nanometres | 50 x 50 um maximum |
| **Height data** | No | Qualitative only | Calibrated, quantitative |
| **Chemistry** | EDS and EELS | EDS | None |
| **Sample survives** | No - thinned below 100 nm | Usually | Yes - unaltered |
| **Vacuum needed** | Yes | Yes | No |
| **Coating needed** | No | Insulators, or use low vacuum | No |
| **Preparation time** | Days | Minutes to hours | Minutes |
| **Instrument at MPaCT** | JEOL JEM-F200 | JEOL JSM-IT710HR | AFM Workshop B-2 |

## Choose by the question

**"What does the surface look like?"** - SEM. Little preparation, wide magnification range, and it usually reveals what to do next.

**"What elements are present?"** - SEM with EDS, for anything above roughly 0.1 weight percent. Below that, [SIMS](../techniques/secondary-ion-mass-spectrometry.md).

**"How rough is it, in nanometres?"** - AFM. This is the one question SEM cannot answer, because SEM records brightness rather than height. An SEM image of a rough surface and a smooth one can look alike.

**"How thick is my film, and is it uniform?"** - AFM across a patterned step, or [ellipsometry](/About_Equipment/Ellipsometer.html) for optical thickness on a blanket film. For a cross-section through a multilayer stack, TEM.

**"What is the crystal structure, and where are the defects?"** - TEM. Electron diffraction gives phase and orientation; imaging resolves dislocations, stacking faults, and grain boundaries.

**"Why did this part fail?"** - SEM first, always. Fracture surfaces, wear, corrosion, and contamination are surface phenomena, and SEM examines them without destroying the evidence.

**"Is my sample contaminated, and with what?"** - SEM-EDS to find and identify it. TEM only if the contaminant is buried or below the EDS detection limit.

## Choose by what happens to the sample

This constraint decides more projects than resolution does.

- **The sample must be returned intact** - AFM. Ambient air, no coating, no vacuum.
- **The sample can be coated but not destroyed** - SEM. A few nanometres of carbon or gold, or low-vacuum mode with no coating at all.
- **The sample can be destroyed** - TEM becomes available, and with it the highest resolution and the only route to internal structure.

Sequence matters. Run the non-destructive measurements first: AFM, then SEM, then TEM last. Reversing that order throws away the sample before the easy questions have been answered.

## A typical combined workflow

For a deposited thin film on silicon:

1. **AFM** - roughness and step height on the as-deposited surface. Non-destructive, so the wafer continues to the next step.
2. **SEM** - surface morphology over a wide area, grain structure, defect density, EDS for composition.
3. **TEM** - cleave a piece, thin it, and section the stack to measure layer thickness, interface abruptness, and crystallinity.

Each step narrows where the next one looks. Going straight to TEM without the first two usually means thinning the wrong region.

## Frequently asked questions

### Which is better, TEM or SEM?

Neither is better; they answer different questions. SEM images a surface with almost no preparation and reaches about 1 nm. TEM images through a thin section and reaches 0.19 nm, but the sample must be destroyed to prepare it. Ask whether the feature is on the surface or inside it.

### Can AFM replace SEM?

Only for quantitative height and roughness on small, flat areas. AFM returns calibrated nanometre heights that SEM cannot, but it scans just 50 by 50 micrometres, reports no chemistry, and is far slower. Most projects use SEM to find the region of interest and AFM to measure it.


## All three at one facility, in Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University runs a JEOL JEM-F200 TEM, a JEOL JSM-IT710HR field-emission SEM, and an AFM Workshop B-2 in the same building in Flagstaff, Arizona, alongside [TEM sample preparation](../techniques/tem-sample-preparation.md) and the [DualBeam](../techniques/focused-ion-beam.md), [XRD](../techniques/x-ray-diffraction.md), [SIMS](../techniques/secondary-ion-mass-spectrometry.md), and [ellipsometry](../techniques/spectroscopic-ellipsometry.md).

A combined workflow therefore runs as one project with one point of contact, rather than being split across facilities. The lab is open to NAU researchers, external academic users, and industry partners.

If you are unsure which technique your question needs, describe the sample and the decision you are trying to make and staff will advise before you book anything.

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Ask which technique you need](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
