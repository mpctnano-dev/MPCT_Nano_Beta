---
title: Spectroscopic Ellipsometry
description: Spectroscopic ellipsometry measures thin-film thickness and optical constants without contact, on a J.A. Woollam RC2 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Thin Films
  - Optical Metrology
schema:
  - "@type": DefinedTerm
    name: Spectroscopic Ellipsometry
    alternateName: SE
    description: >-
      An optical characterization technique that measures the change in polarisation state of
      light reflected from a surface, and derives thin-film thickness and optical constants by
      fitting that change to a layer model.
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
    name: Spectroscopic Ellipsometry and Mueller-Matrix Analysis
    serviceType: Thin-film metrology
    description: >-
      Non-contact measurement of film thickness, refractive index, extinction coefficient, and
      optical anisotropy from the ultraviolet to the near infrared, including uniformity mapping
      across wafers and large substrates.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: J.A. Woollam RC2
    category: Dual-Rotating-Compensator Spectroscopic Ellipsometer
    url: https://nano.nau.edu/About_Equipment/Ellipsometer.html
    manufacturer:
      "@type": Organization
      name: J.A. Woollam
    additionalProperty:
      - "@type": PropertyValue
        name: Spectral range
        value: 210 to 1690 nm (model X with NIR extension)
      - "@type": PropertyValue
        name: Wavelengths per acquisition
        value: 790 from 210 to 1000 nm, plus 275 from 1005 to 1690 nm
      - "@type": PropertyValue
        name: Spectral resolution
        value: 1 nm spacing and under 2.5 nm FWHM in the UV-visible; 2.5 nm spacing and under 3.5 nm FWHM in the near infrared
      - "@type": PropertyValue
        name: Optical design
        value: Patented dual rotating compensator (D-RCE) with achromatic compensators
      - "@type": PropertyValue
        name: Mueller matrix
        value: All 15 elements normalised to m11
      - "@type": PropertyValue
        name: Detectors
        value: Backthinned silicon CCD array (UV-visible) and InGaAs photodiode array (near infrared)
      - "@type": PropertyValue
        name: Acquisition rate
        value: About 0.1 to 3 seconds per measurement point
      - "@type": PropertyValue
        name: Sample size
        value: Standard configurations up to 200 mm or 300 mm wafers
      - "@type": PropertyValue
        name: Angle of incidence
        value: 45 to 90 degrees on the automated angle base, accuracy plus or minus 0.02 degrees
      - "@type": PropertyValue
        name: Beam
        value: Collimated, 3 to 4 mm diameter, divergence under 0.4 degrees
      - "@type": PropertyValue
        name: Thickness precision
        value: Standard deviation under 0.005 nm across thirty consecutive ten-second measurements of nominally 25 nm SiO2 on Si
      - "@type": PropertyValue
        name: Software
        value: CompleteEASE

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: How thin a film can ellipsometry measure?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Below a nanometre. Ellipsometry measures a polarisation ratio rather than an
            intensity, so it does not depend on a reference beam and is not limited by
            photometric noise in the way reflectometry is. On the RC2, thirty consecutive
            ten-second measurements of a nominally 25 nm oxide on silicon repeat to a standard
            deviation under 0.005 nm. Sub-nanometre native oxides and monolayers are routine.
      - "@type": Question
        name: Does ellipsometry damage the sample?
        acceptedAnswer:
          "@type": Answer
          text: >-
            No. The measurement is non-contact and uses low-power light in the ultraviolet to
            near-infrared range. Nothing touches the surface, no vacuum is required, and the
            sample leaves in the state it arrived. This is the reason ellipsometry is used
            in-line during deposition and etching, where a destructive check is impossible.
      - "@type": Question
        name: What is the difference between ellipsometry and profilometry?
        acceptedAnswer:
          "@type": Answer
          text: >-
            They answer different questions. A profilometer measures a physical step height and
            needs a step to measure. Ellipsometry measures the optical response of a layer and
            returns both thickness and the optical constants n and k, on an unpatterned film
            with no step at all. Where a film is transparent and uniform, ellipsometry is more
            precise; where a film is opaque, rough, or optically unknown, optical
            profilometry or an atomic force microscope gives the more direct answer.
      - "@type": Question
        name: Why does my ellipsometry fit give more than one thickness?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Because the polarisation response of a transparent film is periodic in thickness.
            A single-wavelength measurement cannot distinguish one period from the next, so
            several thicknesses fit the data equally well. Three things break the degeneracy:
            measuring across a wide spectral range, measuring at more than one angle of
            incidence, and constraining the fit with an independently known approximate
            thickness. The RC2 addresses the first two directly.
---

# Spectroscopic Ellipsometry

Spectroscopic ellipsometry measures the change in polarisation state of light reflected from a surface, and derives film thickness and optical constants by fitting that change to a layer model. Because it reads a ratio of polarisation components rather than an absolute intensity, it needs no reference beam, and it resolves layer thickness to a small fraction of a nanometre without touching the sample.

## How spectroscopic ellipsometry works

Light of known polarisation strikes the sample at an oblique angle. Reflection changes the amplitude and phase of the component polarised parallel to the plane of incidence differently from the component polarised perpendicular to it. Ellipsometry measures that difference, conventionally as two angles: **Ψ**, the amplitude ratio, and **Δ**, the phase difference.

Ψ and Δ are not thickness. They are the raw optical response, and turning them into a thickness requires a model - a stack of layers, each with an assumed optical dispersion, whose parameters are adjusted until the calculated response matches the measured one. Ellipsometry is therefore an inverse technique: the measurement is fast and precise, and the interpretation carries the assumptions.

Measuring across a spectrum rather than at one wavelength is what makes the inversion tractable. Several hundred wavelengths give several hundred independent constraints on a handful of model parameters, which is normally enough to determine thickness and dispersion together rather than assuming one to get the other.

A **rotating compensator** design adds a spinning waveplate to the beam path. One compensator lets the instrument measure Δ across the full 0–360° range and detect depolarisation. Two compensators, one before and one after the sample, allow the full Mueller matrix to be recovered - the complete 4×4 description of how the sample transforms any input polarisation, which is what anisotropic and depolarising samples require.

## When to use spectroscopic ellipsometry

- Measuring the thickness of a transparent or semi-transparent film, from sub-nanometre to several microns
- Extracting refractive index and extinction coefficient as functions of wavelength
- Characterising a multilayer stack where individual layers cannot be isolated
- Mapping thickness and optical uniformity across a wafer or large substrate
- Measuring optically anisotropic or depolarising material, where full Mueller-matrix data is needed
- Monitoring deposition or etch rate in real time, with the instrument attached to a process chamber
- Any case where the film must not be touched, coated, cleaved, or placed in vacuum

## What spectroscopic ellipsometry cannot do

- **It does not measure thickness directly.** Every result comes from a model fit. A wrong dispersion model produces a confident, precise, wrong thickness.
- **It requires a specular reflection.** Rough or scattering surfaces depolarise the beam and degrade or defeat the fit.
- **It cannot see through an opaque overlayer.** Once light stops reaching a buried interface, that interface is invisible.
- **Thickness solutions are periodic.** For transparent films, several thicknesses can fit the same data; see the FAQ below.
- **The spot is millimetres, not microns.** The standard collimated beam is 3–4 mm across, so it averages over that area. Feature-level measurement needs focusing optics, [atomic force microscopy](atomic-force-microscopy.md), or [electron microscopy](scanning-electron-microscopy.md).
- **It returns optical constants, not chemistry.** n and k constrain composition but do not identify elements. For that, use SEM-EDS or secondary ion mass spectrometry.

## The RC2 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **J.A. Woollam RC2** spectroscopic ellipsometer in Flagstaff, Arizona. The RC2 uses J.A. Woollam's patented dual-rotating-compensator design, which is the configuration that recovers the full Mueller matrix rather than Ψ and Δ alone. In practice that is the difference between characterising an isotropic oxide and characterising a birefringent, patterned, or depolarising sample.

Its silicon CCD and InGaAs arrays collect roughly a thousand wavelengths simultaneously. Acquisition is listed on the [catalogue page](/About_Equipment/Ellipsometer.html) as about 0.1 to 3 seconds per measurement point.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Spectral range | 210–1690 nm (model X with NIR extension) |
| Wavelengths per acquisition | ~790 across 210–1000 nm, plus ~275 across 1005–1690 nm |
| Spectral resolution | 1 nm spacing, <2.5 nm FWHM (UV-Vis); 2.5 nm spacing, <3.5 nm FWHM (NIR) |
| Optical design | Patented dual rotating compensator (D-RCE), achromatic |
| Measured quantities | Ψ (0–90°), Δ (0–360°), depolarisation, %T, %R |
| Mueller matrix | All 15 elements normalised to m11 |
| Detectors | Backthinned silicon CCD array (UV-Vis); InGaAs photodiode array (NIR) |
| Acquisition rate | ~0.1 to 3 seconds per measurement point |
| Sample size | Standard configurations up to 200 mm or 300 mm wafers |
| Angle of incidence | 45–90° automated, typically |
| Beam | Collimated, 3–4 mm diameter |
| Software | CompleteEASE |

Acquisition rate and sample size follow the [equipment catalogue](/About_Equipment/Ellipsometer.html). Optical design and spectral range follow J.A. Woollam's RC2 specification sheet.

[Full ellipsometer specifications and booking &rarr;](/About_Equipment/Ellipsometer.html){ .md-button .md-button--primary }

## Sample requirements

- **Surface.** Specular or near-specular. A visibly hazy surface will depolarise the beam.
- **Size.** Large enough to accept a 3–4 mm beam at an oblique angle, which means an illuminated footprint of roughly 4 × 10 mm at 65°. Small samples are measurable with focusing optics.
- **Substrate.** A reflective or absorbing substrate under the film improves sensitivity. Transparent substrates such as glass need backside roughening or index matching to suppress the back reflection.
- **Preparation.** None. No coating, no cleaving, no vacuum.
- **Prior knowledge helps.** Bring whatever you know: nominal thickness, deposition method, expected material. Every constraint you supply removes an ambiguity from the fit.

## Frequently asked questions

### How thin a film can ellipsometry measure?

Below a nanometre. Ellipsometry measures a polarisation ratio rather than an intensity, so it does not depend on a reference beam and is not limited by photometric noise in the way reflectometry is. On the RC2, thirty consecutive ten-second measurements of a nominally 25 nm oxide on silicon repeat to a standard deviation under 0.005 nm. Sub-nanometre native oxides and monolayers are routine.

### Does ellipsometry damage the sample?

No. The measurement is non-contact and uses low-power light in the ultraviolet to near-infrared range. Nothing touches the surface, no vacuum is required, and the sample leaves in the state it arrived. This is the reason ellipsometry is used in-line during deposition and etching, where a destructive check is impossible.

### What is the difference between ellipsometry and profilometry?

They answer different questions. A profilometer measures a physical step height and needs a step to measure. Ellipsometry measures the optical response of a layer and returns both thickness and the optical constants n and k, on an unpatterned film with no step at all. Where a film is transparent and uniform, ellipsometry is more precise; where a film is opaque, rough, or optically unknown, [optical profilometry](optical-profilometry.md) or an [atomic force microscope](atomic-force-microscopy.md) gives the more direct answer.

### Why does my ellipsometry fit give more than one thickness?

Because the polarisation response of a transparent film is periodic in thickness. A single-wavelength measurement cannot distinguish one period from the next, so several thicknesses fit the data equally well. Three things break the degeneracy: measuring across a wide spectral range, measuring at more than one angle of incidence, and constraining the fit with an independently known approximate thickness. The RC2 addresses the first two directly.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
