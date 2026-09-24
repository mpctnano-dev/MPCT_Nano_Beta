---
title: TEM Sample Preparation
description: Mechanical thinning, dimpling, and argon ion milling of TEM specimens on Fischione tools at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Sample Prep
  - Electron Microscopy
schema:
  - "@type": DefinedTerm
    name: TEM Sample Preparation
    alternateName: Ion Milling and Dimpling
    description: >-
      A sequence of mechanical grinding, dimpling, and argon ion milling that
      thins a bulk specimen to electron transparency, typically below 100 nm,
      so that it can be imaged in a transmission electron microscope.
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
    name: TEM Sample Preparation
    serviceType: Electron-microscopy specimen preparation
    description: >-
      Disk grinding, dimpling, and argon ion milling to produce
      electron-transparent TEM specimens.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Fischione Model 160
    category: TEM disk grinder
    url: https://nano.nau.edu/About_Equipment/TEM.html
    manufacturer:
      "@type": Organization
      name: Fischione
    additionalProperty:
      - "@type": PropertyValue
        name: Specimen diameter
        value: Up to 18 mm
      - "@type": PropertyValue
        name: Result
        value: Uniform thickness with parallel surfaces
      - "@type": PropertyValue
        name: Platen compatibility
        value: Transferable to Model 200 dimpling grinder

  - "@type": IndividualProduct
    name: Fischione Model 200
    category: TEM dimple grinder
    url: https://nano.nau.edu/About_Equipment/TEM.html
    manufacturer:
      "@type": Organization
      name: Fischione
    additionalProperty:
      - "@type": PropertyValue
        name: Specimen diameter
        value: Up to 3 mm
      - "@type": PropertyValue
        name: Starting thickness
        value: Up to 200 micrometres
      - "@type": PropertyValue
        name: Final centre thickness
        value: A few micrometres

  - "@type": IndividualProduct
    name: Fischione Model 1051
    category: TEM ion mill
    url: https://nano.nau.edu/About_Equipment/TEM.html
    manufacturer:
      "@type": Organization
      name: Fischione
    additionalProperty:
      - "@type": PropertyValue
        name: Ion sources
        value: Two TrueFocus sources, 100 eV to 10 keV
      - "@type": PropertyValue
        name: Beam current density
        value: Up to about 10 mA per square centimetre
      - "@type": PropertyValue
        name: Milling angle
        value: -15 to +10 degrees
      - "@type": PropertyValue
        name: Specimen size
        value: About 3 mm diameter by 250 micrometres thick

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: How is a TEM sample prepared at NAU?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Three steps, three Fischione tools. The Model 160 grinds a piece to
            a uniform disk. The Model 200 dimples the centre to a few
            micrometres. The Model 1051 argon-ion mill finishes to electron
            transparency. A wafer that is still 300 mm first has to be scribed
            down to a coupon.
      - "@type": Question
        name: When is a specimen thin enough to leave the mill?
        acceptedAnswer:
          "@type": Answer
          text: >-
            When it is electron-transparent at 200 kV, typically below 100 nm
            and often below 50 nm for high-resolution work. Dimpling stops at
            a few micrometres; ion milling does the last thinning. The TEM
            page owns the imaging question; this page owns the path to that
            thickness.
      - "@type": Question
        name: Why not ion mill from the start?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Time and heat. Argon milling a millimetre of bulk is slow and
            loads the sample. Mechanical grinding and dimpling remove the
            bulk. The mill is specified from about 100 eV to 10 keV so the
            last step can polish at low energy after a fast mill at high
            energy.
      - "@type": Question
        name: What size specimen do the TEM prep tools take?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The disk grinder takes pieces up to 18 mm. The dimple grinder and
            the mill are 3 mm TEM disks; the mill specifies about 3 mm diameter
            by 250 micrometres thick. Platens transfer from the 160 to the 200
            so the specimen is not demounted between grind and dimple.
      - "@type": Question
        name: Why is my TEM sample damaged after milling?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Ion energy and angle. High keV mills fast and amorphises the
            surface. The 1051 can run down to about 100 eV for a polish, at
            incidence from -15 to +10 degrees, with optional LN2 cooling.
            If the dimple was left too thick, the mill has to run long, and
            damage accumulates. Finish the mechanical steps first.
---

# TEM Sample Preparation

TEM sample preparation is the sequence of mechanical grinding, dimpling, and argon ion milling that thins a bulk specimen to electron transparency. The imaging is [transmission electron microscopy](transmission-electron-microscopy.md). This page is the path to a specimen the beam can go through.

## How TEM sample preparation works

A TEM needs a specimen thinner than about 100 nm. Three tools remove the rest:

1. **Disk grinding (Fischione Model 160).** A platen-mounted piece, up to 18 mm, is ground to uniform thickness with parallel faces. A graduated stop advances 0.5 mm per rotation. The platen transfers to the dimpler so the specimen is not demounted.
2. **Dimpling (Fischione Model 200).** A 3 mm disk, starting up to 200 µm thick, is thinned at the centre to a few micrometres with a rotating wheel and slurry. Single- or double-sided. The rim stays thick enough to handle.
3. **Ion milling (Fischione Model 1051).** Two TrueFocus argon sources, ~100 eV to 10 keV, up to ~10 mA/cm², incidence −15° to +10°, 3 mm × 250 µm specimen, 360° rotation with rocking. Optional LN2 cooling. High energy removes material; low energy polishes.

A 300 mm wafer is [scribed](wafer-scribing.md) to a coupon before this sequence starts.

Site-specific TEM lamellae from a chosen device feature are prepared on the listed [DualBeam FIB-SEM](focused-ion-beam.md), not on these three mechanical tools. The DualBeam is the public catalogue route for lift-out.

## When to use TEM sample preparation

- Any question that needs the [JEM-F200](transmission-electron-microscopy.md) on a bulk solid, a film on a substrate, or a device cross-section
- Metals, ceramics, and semiconductors that can take mechanical thinning
- Finishing a dimpled disk that is still too thick for 200 kV

## What TEM sample preparation cannot do

- **It does not image.** Transparency is the output. Imaging is the TEM.
- **Soft, hydrated, or beam-sensitive organics may need a different prep** (cryo, FIB) that is not these three tools.
- **FIB lamellae are not this workflow.** If the site is a specific device feature, ask whether a focused-ion-beam lift-out is even available; it is not catalogued here.
- **Ion milling a thick disk without dimpling wastes time and adds damage.**

## The Fischione tools at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a **Fischione Model 160** disk grinder, a **Model 200** dimple grinder, and a **Model 1051** TEM mill in Flagstaff, Arizona. All three are listed as expected rather than available. Confirm live status on the catalogue pages before planning a prep.

When the tools are in service they are available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as trained hands-on users.

| Instrument | Role | Key limit |
|---|---|---|
| Fischione Model 160 | Disk grind | Up to 18 mm; platen transfers to Model 200 |
| Fischione Model 200 | Dimple | 3 mm disk; start ≤200 µm; centre to a few µm |
| Fischione Model 1051 | Argon mill | Dual sources, ~100 eV–10 keV; 3 mm × 250 µm |

Prep is booked with the TEM: [JEOL JEM-F200 catalogue page](/About_Equipment/TEM.html). Site-specific lift-out uses the listed [DualBeam](focused-ion-beam.md).

## Sample requirements

- **Starting piece.** A coupon that can become an 18 mm grind, then a 3 mm disk. Say the material. Silicon, metals, and ceramics are the usual path.
- **Target.** Plan-view or cross-section. Cross-sections of films need the stack protected and the interface in the thin region.
- **Return.** Prep consumes the piece. The 3 mm disk that goes in the TEM is not the wafer you brought.
- **Time.** Mechanical steps plus a mill are hours to days, not a walk-up image.

## Frequently asked questions

### How is a TEM sample prepared at NAU?

Three steps, three Fischione tools. The Model 160 grinds a piece to a uniform disk. The Model 200 dimples the centre to a few micrometres. The Model 1051 argon-ion mill finishes to electron transparency. A wafer that is still 300 mm first has to be scribed down to a coupon.

### When is a specimen thin enough to leave the mill?

When it is electron-transparent at 200 kV, typically below 100 nm and often below 50 nm for high-resolution work. Dimpling stops at a few micrometres; ion milling does the last thinning. The TEM page owns the imaging question; this page owns the path to that thickness.

### Why not ion mill from the start?

Time and heat. Argon milling a millimetre of bulk is slow and loads the sample. Mechanical grinding and dimpling remove the bulk. The mill is specified from about 100 eV to 10 keV so the last step can polish at low energy after a fast mill at high energy.

### What size specimen do the TEM prep tools take?

The disk grinder takes pieces up to 18 mm. The dimple grinder and the mill are 3 mm TEM disks; the mill specifies about 3 mm diameter by 250 micrometres thick. Platens transfer from the 160 to the 200 so the specimen is not demounted between grind and dimple.

### Why is my TEM sample damaged after milling?

Ion energy and angle. High keV mills fast and amorphises the surface. The 1051 can run down to about 100 eV for a polish, at incidence from -15 to +10 degrees, with optional LN2 cooling. If the dimple was left too thick, the mill has to run long, and damage accumulates. Finish the mechanical steps first.

## Request time on these instruments

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve an instrument](/Reserve_Equipment.html){ .md-button }
