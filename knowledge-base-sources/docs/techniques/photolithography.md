---
title: Photolithography (Contact Lithography)
description: Contact photolithography transfers photomask patterns at 0.5-1.0 µm on a SUSS MJB4 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Fabrication
  - Lithography
  - Semiconductors
schema:
  - "@type": DefinedTerm
    name: Photolithography
    alternateName: Contact Lithography
    description: >-
      A patterning process in which ultraviolet light transfers a photomask image into
      a photoresist film on a wafer or coupon, so that subsequent etch or deposition
      steps only affect the regions defined by that image.
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
    name: Contact Photolithography and Mask Alignment
    serviceType: Microfabrication
    description: >-
      UV contact and proximity lithography on wafers and coupons up to 100 mm, including
      mask alignment under 1 micrometre and exposure modes from soft contact to vacuum
      contact.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: SUSS MJB4
    category: UV contact mask aligner
    url: https://nano.nau.edu/About_Equipment/SUSS_MJB4.html
    manufacturer:
      "@type": Organization
      name: SUSS MicroTec
    additionalProperty:
      - "@type": PropertyValue
        name: Resolution
        value: About 0.5 to 1.0 micrometres, mode dependent
      - "@type": PropertyValue
        name: Resolution in vacuum contact
        value: 0.5 micrometres, best case
      - "@type": PropertyValue
        name: Maximum substrate size
        value: 100 mm round or square
      - "@type": PropertyValue
        name: Mask size
        value: 2 by 2 inch to 5 by 5 inch
      - "@type": PropertyValue
        name: Lamp source
        value: Mercury lamp, g-line, h-line, and i-line
      - "@type": PropertyValue
        name: Alignment accuracy
        value: Less than 1.0 micrometre, topside
      - "@type": PropertyValue
        name: Alignment travel
        value: X and Y plus or minus 5 mm, theta plus or minus 5 degrees

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is photolithography?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Photolithography transfers a pattern from a photomask into a photosensitive
            resist on a wafer or coupon using ultraviolet light. After development, the
            resist is a stencil: etch, lift-off, or another process then acts only where
            the stencil allows. On a contact aligner the mask is held against, or a
            controlled gap from, the resist rather than being projected by a stepper lens.
      - "@type": Question
        name: What is the difference between contact lithography and maskless direct write?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Contact lithography exposes the whole field through a physical glass photomask
            in one shot. Maskless direct write paints the pattern from a CAD file with a
            scanned beam or spatial modulator, so a new design does not need a new mask.
            Contact is faster once the mask exists and is specified here at about 0.5 µm
            in vacuum contact. Direct write is slower per wafer and has no mask cost.
            This lab's MJB4 is a contact aligner. It is not a maskless writer.
      - "@type": Question
        name: What resolution can the SUSS MJB4 achieve?
        acceptedAnswer:
          "@type": Answer
          text: >-
            About 0.5 to 1.0 µm, depending on contact mode. The catalogue lists vacuum
            contact as the best case at 0.5 µm, hard contact as the standard high-resolution
            mode at about 1 µm, and proximity (a 10 to 50 µm gap) for thick resists or
            topography where the mask must not touch. Alignment accuracy is listed as
            less than 1.0 µm topside. Those figures assume a capable resist process, a
            clean mask, and a flat substrate; they are not a promise on every coupon.
      - "@type": Question
        name: Do I need a photomask for the MJB4?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The MJB4 images a physical mask, from 2 by 2 inch up to 5 by 5 inch.
            There is no maskless mode on this tool. A design that will be exposed once
            and then thrown away may be cheaper on a laser or a printer. A design that
            will be repeated, aligned to a previous layer, or pushed to 0.5–1 µm is a
            mask job. Bring the mask, or plan the mask lead time, before booking the
            aligner.
      - "@type": Question
        name: What is the difference between photolithography and laser structuring?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Photolithography patterns a resist that then masks an etch or a lift-off.
            Laser structuring ablates the material itself. Lithography on the MJB4 reaches
            0.5–1.0 µm with a mask, on wafers up to 100 mm. Laser structuring on the
            ProtoLaser R4 reaches 35 µm line / 20 µm space with no mask, on boards,
            ceramics, glass, and foils up to 315 by 239 mm. Use lithography for device
            layers and aligned multilevel patterns. Use the laser for PCB-scale traces,
            cuts, and film removal where a mask is not worth making.
---

# Photolithography (Contact Lithography)

Photolithography is a patterning process in which ultraviolet light transfers a photomask image into a photoresist film on a wafer or coupon. After the resist is developed, later etch or deposition steps only affect the regions that image defined. On a contact aligner the mask sits against the resist, or a set gap from it, rather than being reduced through a stepper lens.

## How photolithography works

A substrate is coated with photoresist. A glass photomask, chrome-patterned, is aligned to existing features on the wafer. UV from a mercury lamp (g-line, h-line, or i-line) exposes the resist through the clear regions of the mask. Development removes either the exposed resist (positive) or the unexposed resist (negative), leaving a stencil.

Contact mode sets the resolution and the risk to the mask:

- **Soft contact.** The wafer is held gently against the mask. Safer for fragile or III-V pieces; resolution is coarser.
- **Hard contact.** Nitrogen pressure pushes the wafer firmly against the mask. Catalogue standard for about 1 µm.
- **Vacuum contact.** Air is pulled from between mask and wafer. Catalogue best case, about 0.5 µm.
- **Proximity / gap.** A controlled 10–50 µm gap. Used for thick resists (including SU-8 moulds) or topography where contact would damage the mask or the wafer.

Alignment on this tool is topside, specified at less than 1.0 µm, with ±5 mm of X/Y travel and ±5° of theta. The stage is built to take irregular coupons as well as round wafers, which is the research use, not a production cassette flow.

A contact aligner is not a stepper. There is no reduction lens and no die-by-die stepping. One mask field is one exposure.

## When to use photolithography

- Patterning device layers on silicon, glass, or III-V coupons up to 100 mm
- Aligning a second (or later) mask to an existing layer
- MEMS, contacts, and waveguides where 0.5–1.0 µm is the feature size
- Thick-resist moulds for microfluidics, including SU-8
- Any repeating design that already has, or can wait for, a photomask
- Fragile or irregular pieces that a production stepper will not accept

## What photolithography cannot do

- **It does not write from a CAD file.** No mask means no exposure on the MJB4. A one-off board-scale pattern is [laser micromachining](laser-micromachining.md) or a printed circuit, not this tool.
- **It is not sub-100 nm lithography.** 0.5 µm in vacuum contact is the catalogue best case. Finer than that is a different class of tool.
- **Contact can mark the mask and the resist.** Particles between mask and wafer print as defects and can damage chrome. Proximity trades resolution for mask life.
- **It is not the etch, the deposit, or the lift-off.** Those are later steps on other equipment. An aligned exposure is only the stencil.
- **UV-NIL is listed as optional on the catalogue page.** Stamp replication at tens of nanometres is the [CNI v3.0](nanoimprint-lithography.md), not this aligner. Do not assume nanoimprint is installed on the MJB4.

## The MJB4 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a **SUSS MJB4** UV contact mask aligner in Flagstaff, Arizona. The catalogue specifies wafers and coupons up to 100 mm (round or square), masks from 2 × 2 in to 5 × 5 in, a mercury g/h/i-line lamp, resolution of about 0.5–1.0 µm, and topside alignment better than 1.0 µm.

The equipment catalogue currently lists the MJB4 as expected rather than available. Confirm live status on the [catalogue page](/About_Equipment/SUSS_MJB4.html) before planning a lithography run; that page is the source of truth for whether the lamp and alignment are in service.

When the tool is in service it is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Resolution | ~0.5–1.0 µm, mode dependent |
| Vacuum contact (best case) | 0.5 µm |
| Hard contact | ~1 µm |
| Proximity gap | 10–50 µm |
| Maximum substrate | 100 mm round or square |
| Mask size | 2 × 2 in to 5 × 5 in |
| Lamp | Mercury, g / h / i-line |
| Alignment accuracy | <1.0 µm topside |
| Alignment travel | X/Y ±5 mm, theta ±5° |

Figures follow the [equipment catalogue](/About_Equipment/SUSS_MJB4.html).

[Full MJB4 specifications and booking &rarr;](/About_Equipment/SUSS_MJB4.html){ .md-button .md-button--primary }

## Sample requirements

- **Substrate.** A wafer or coupon no larger than 100 mm, flat enough for contact. Say the material: silicon, glass, III-V, or other. Irregular pieces are acceptable if they sit on the chuck.
- **Resist.** Already coated, or say which resist and thickness you need so staff can plan the coat. Thick SU-8 is a proximity job, not vacuum contact.
- **Mask.** 2 × 2 in to 5 × 5 in, polarity and chrome-side orientation stated. If you do not have a mask yet, that is the first lead time, not the aligner.
- **Alignment marks.** Visible from the topside for a second-layer job. This tool is specified for topside alignment.
- **Hazards.** Declare solvents, leftover resist, and any substrate that is toxic or brittle.

## Frequently asked questions

### What is photolithography?

Photolithography transfers a pattern from a photomask into a photosensitive resist on a wafer or coupon using ultraviolet light. After development, the resist is a stencil: etch, lift-off, or another process then acts only where the stencil allows. On a contact aligner the mask is held against, or a controlled gap from, the resist rather than being projected by a stepper lens.

### What is the difference between contact lithography and maskless direct write?

Contact lithography exposes the whole field through a physical glass photomask in one shot. Maskless direct write paints the pattern from a CAD file with a scanned beam or spatial modulator, so a new design does not need a new mask. Contact is faster once the mask exists and is specified here at about 0.5 µm in vacuum contact. Direct write is slower per wafer and has no mask cost. This lab's MJB4 is a contact aligner. It is not a maskless writer.

### What resolution can the SUSS MJB4 achieve?

About 0.5 to 1.0 µm, depending on contact mode. The catalogue lists vacuum contact as the best case at 0.5 µm, hard contact as the standard high-resolution mode at about 1 µm, and proximity (a 10 to 50 µm gap) for thick resists or topography where the mask must not touch. Alignment accuracy is listed as less than 1.0 µm topside. Those figures assume a capable resist process, a clean mask, and a flat substrate; they are not a promise on every coupon.

### Do I need a photomask for the MJB4?

Yes. The MJB4 images a physical mask, from 2 by 2 inch up to 5 by 5 inch. There is no maskless mode on this tool. A design that will be exposed once and then thrown away may be cheaper on a laser or a printer. A design that will be repeated, aligned to a previous layer, or pushed to 0.5–1 µm is a mask job. Bring the mask, or plan the mask lead time, before booking the aligner.

### What is the difference between photolithography and laser structuring?

Photolithography patterns a resist that then masks an etch or a lift-off. Laser structuring ablates the material itself. Lithography on the MJB4 reaches 0.5–1.0 µm with a mask, on wafers up to 100 mm. Laser structuring on the ProtoLaser R4 reaches 35 µm line / 20 µm space with no mask, on boards, ceramics, glass, and foils up to 315 by 239 mm. Use lithography for device layers and aligned multilevel patterns. Use the laser for PCB-scale traces, cuts, and film removal where a mask is not worth making.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
