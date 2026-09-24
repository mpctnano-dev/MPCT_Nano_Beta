---
title: Wafer Scribing and Cleaving
description: Top-side wafer scribing and cleaving from 5 mm to 300 mm on a PELCO FlexScribe 300 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Sample Prep
  - Fabrication
schema:
  - "@type": DefinedTerm
    name: Wafer Scribing
    alternateName: Top-Side Scribing
    description: >-
      A sample-preparation method in which a carbide or diamond wheel scores a
      straight line on the top face of a brittle wafer or coupon so that the
      piece can be cleaved along that line.
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
    name: Wafer Scribing and Cleaving
    serviceType: Sample preparation
    description: >-
      Manual top-side scribing of silicon, sapphire, quartz, glass, and ceramic
      wafers and coupons from 5 mm to 300 mm for controlled cleaving.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: PELCO FlexScribe 300
    category: Manual wafer scriber
    url: https://nano.nau.edu/About_Equipment/PELCO_FlexScribe_300.html
    manufacturer:
      "@type": Organization
      name: Ted Pella
    additionalProperty:
      - "@type": PropertyValue
        name: Wafer size range
        value: 5 mm to 300 mm
      - "@type": PropertyValue
        name: Scribing method
        value: Carbide scribing wheel, top-side
      - "@type": PropertyValue
        name: Supported materials
        value: Silicon, sapphire, quartz, glass, ceramics

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is wafer scribing?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Wafer scribing scores a straight line on the top of a brittle
            wafer so the piece can be cleaved along that line. The PELCO
            FlexScribe 300 uses a carbide wheel on a sliding mechanism. It is
            a cut-down step, not a dicing saw and not a lithography tool.
      - "@type": Question
        name: What size wafers can the FlexScribe 300 take?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Ted Pella specifies the FlexScribe 300 for samples from 5 mm up to
            300 mm wafers. The 200 mm model is a different catalogue number.
            Irregular coupons are acceptable; the constraint is that the wheel
            can travel a straight line across the piece.
      - "@type": Question
        name: What is the difference between scribing and TEM disk grinding?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Scale and purpose. Scribing breaks a wafer into coupons. TEM disk
            grinding thins a 3 mm disk toward electron transparency. They are
            consecutive only if you need a TEM specimen from a large wafer:
            scribe a piece, then grind, dimple, and ion mill.
      - "@type": Question
        name: Can I scribe sapphire or glass?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The catalogue lists silicon, sapphire, quartz, glass, and
            ceramics. Ted Pella recommends a diamond wheel for thin glass,
            tempered glass, and sapphire, and a deep-cut wheel for thick glass.
            The standard carbide wheel is the general-purpose option. Ask which
            wheel is installed before scribing sapphire.
      - "@type": Question
        name: Why did my wafer not cleave on the scribe?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The scribe is a stress concentrator, not a cut through the wafer.
            Too light a pass, a wheel for the wrong hardness, or a break that
            starts off the line will wander. Ductile metals will not cleave
            this way at all. Make one straight score, then break with even
            support on both sides of the line.
---

# Wafer Scribing and Cleaving

Wafer scribing is a sample-preparation method in which a carbide or diamond wheel scores a straight line on the top face of a brittle wafer or coupon so that the piece can be cleaved along that line. It is how a 300 mm wafer becomes a coupon that fits another instrument.

## How wafer scribing works

A scribing wheel is mounted on a sliding carriage that travels in a straight line. The operator sets the piece on a ruled mat, aligns the intended break, and draws the wheel across the top surface. The score concentrates stress. A subsequent bend or tap separates the piece.

The PELCO FlexScribe 300 (Ted Pella, formerly LatticeGear) is specified from 5 mm samples to 300 mm wafers, top-side scribing, carbide wheel as standard. Catalogue materials are silicon, sapphire, quartz, glass, and ceramics. Diamond and deep-cut wheels are sold for harder or thicker stock; which wheel is on the tool is a check with staff, not an assumption.

This is not a dicing saw. There is no blade kerf through the full thickness, no water saw, and no programmed street.

## When to use wafer scribing

- Cutting a wafer into coupons for SEM, AFM, ellipsometry, or a probe station
- Cleaving silicon, glass, or sapphire along a chosen line
- Preparing a strip for a later cross-section
- First step toward a [TEM specimen](tem-sample-preparation.md), before disk grinding

## What wafer scribing cannot do

- **It does not dice streets at 50 µm.** A production dicing saw is a different machine.
- **It does not cut ductile metal.** The method is for brittle fracture.
- **The line is only as straight as the carriage and the setup.** Freehand glass cutting is not this tool.
- **It does not thin a TEM disk.** After the coupon exists, grinding and ion milling are separate instruments.

## The FlexScribe 300 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **PELCO FlexScribe 300** in Flagstaff, Arizona. The catalogue specifies 5 mm to 300 mm, carbide top-side scribing, and silicon, sapphire, quartz, glass, and ceramics. The instrument is listed as available. It is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Wafer size range | 5 mm to 300 mm (12 in) |
| Scribing method | Carbide scribing wheel |
| Orientation | Top-side |
| Materials | Silicon, sapphire, quartz, glass, ceramics |
| Operation | Manual |

Figures follow the [equipment catalogue](/About_Equipment/PELCO_FlexScribe_300.html) and Ted Pella's FlexScribe product page.

[Full FlexScribe 300 specifications and booking &rarr;](/About_Equipment/PELCO_FlexScribe_300.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** A wafer or brittle coupon between 5 mm and 300 mm. Say the material and thickness.
- **Orientation.** If the cleave must follow a crystal axis, say so before the score.
- **Wheel.** Sapphire and hard glass may need the diamond wheel. Ask which is installed.
- **Return.** Scribing is destructive of the original wafer shape. Pieces come back as coupons.

## Frequently asked questions

### What is wafer scribing?

Wafer scribing scores a straight line on the top of a brittle wafer so the piece can be cleaved along that line. The PELCO FlexScribe 300 uses a carbide wheel on a sliding mechanism. It is a cut-down step, not a dicing saw and not a lithography tool.

### What size wafers can the FlexScribe 300 take?

Ted Pella specifies the FlexScribe 300 for samples from 5 mm up to 300 mm wafers. The 200 mm model is a different catalogue number. Irregular coupons are acceptable; the constraint is that the wheel can travel a straight line across the piece.

### What is the difference between scribing and TEM disk grinding?

Scale and purpose. Scribing breaks a wafer into coupons. TEM disk grinding thins a 3 mm disk toward electron transparency. They are consecutive only if you need a TEM specimen from a large wafer: scribe a piece, then grind, dimple, and ion mill.

### Can I scribe sapphire or glass?

Yes. The catalogue lists silicon, sapphire, quartz, glass, and ceramics. Ted Pella recommends a diamond wheel for thin glass, tempered glass, and sapphire, and a deep-cut wheel for thick glass. The standard carbide wheel is the general-purpose option. Ask which wheel is installed before scribing sapphire.

### Why did my wafer not cleave on the scribe?

The scribe is a stress concentrator, not a cut through the wafer. Too light a pass, a wheel for the wrong hardness, or a break that starts off the line will wander. Ductile metals will not cleave this way at all. Make one straight score, then break with even support on both sides of the line.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
