---
title: X-ray Diffraction (XRD)
description: X-ray diffraction identifies crystal phases and measures thin-film thickness on a Rigaku SmartLab at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Crystallography
  - Thin Films
schema:
  - "@type": DefinedTerm
    name: X-ray Diffraction
    alternateName: XRD
    description: >-
      A characterization technique in which a collimated X-ray beam is scattered by a
      crystalline material, and the angles and intensities of the diffracted beams are used
      to identify phases, measure lattice spacing, and assess crystallographic orientation.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": DefinedTerm
    name: X-ray Reflectivity
    alternateName: XRR
    description: >-
      A specular X-ray measurement at grazing incidence in which interference fringes from
      a layered film are fitted to obtain thickness, density, and interface roughness without
      destroying the sample.
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
    name: X-ray Diffraction and Reflectivity
    serviceType: Materials characterization
    description: >-
      Phase identification, crystallinity, thin-film texture, residual stress, and X-ray
      reflectivity on powders, bulk solids, and films, using a multipurpose diffractometer
      with switchable focusing and parallel-beam optics.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Rigaku SmartLab
    category: Multipurpose X-ray diffractometer
    url: https://nano.nau.edu/About_Equipment/XRD.html
    manufacturer:
      "@type": Organization
      name: Rigaku
    additionalProperty:
      - "@type": PropertyValue
        name: Geometry
        value: Automated high-resolution theta-theta goniometer
      - "@type": PropertyValue
        name: Radiation
        value: Copper K-alpha
      - "@type": PropertyValue
        name: X-ray source
        value: Copper tube, up to 40 kV / 44 mA
      - "@type": PropertyValue
        name: Maximum wafer size
        value: Up to about 6 in, thin-film stage dependent
      - "@type": PropertyValue
        name: Optics
        value: Cross Beam Optics (CBO) for focusing or parallel beam
      - "@type": PropertyValue
        name: Detector
        value: HyPix-3000 hybrid pixel array, 0D, 1D, and 2D modes
      - "@type": PropertyValue
        name: Detector active area
        value: 77.5 by 38.5 mm, 100 micrometre pixels
      - "@type": PropertyValue
        name: Software
        value: SmartLab Studio II

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is the difference between XRD and TEM diffraction?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Volume versus locality. XRD averages over millimetres of sample and identifies
            which crystalline phases are present, with what lattice spacing and texture.
            TEM diffraction is taken from a region a few micrometres across, or smaller,
            after the sample has been thinned below 100 nm. Use XRD first when the question
            is "what phase is this, and is it crystalline." Use TEM when the question is
            "what is this grain, this interface, or this defect."
      - "@type": Question
        name: Can XRD measure thin films?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes, with the right geometry. A symmetric powder scan on a thin film is dominated
            by the substrate. Grazing-incidence XRD keeps the beam in the film so the film's
            peaks appear. X-ray reflectivity, at still shallower angles, returns thickness,
            density, and interface roughness from interference fringes. High-resolution XRD
            and reciprocal-space maps are the epitaxial-film versions of the same instrument.
      - "@type": Question
        name: What is X-ray reflectivity?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A specular scan at grazing incidence. X-rays reflect from each interface in a
            layered film and interfere. The fringe spacing gives thickness, the critical
            angle gives density, and how fast the fringes damp gives roughness. The
            measurement is non-destructive and needs a specularly flat film; a rough or
            scattering surface does not produce usable fringes.
      - "@type": Question
        name: Why did XRD miss a phase I know is there?
        acceptedAnswer:
          "@type": Answer
          text: >-
            XRD reports crystalline material above a volume threshold, typically a few
            percent for a laboratory powder scan. An amorphous fraction produces no Bragg
            peaks. A minority phase below the detection floor is invisible. A strongly
            textured film can hide peaks that a powder would show, because those planes
            never satisfy the diffraction condition in the geometry you used. Grazing
            incidence, a 2D detector frame, or TEM diffraction answers the cases a symmetric
            scan misses.
---

# X-ray Diffraction (XRD)

X-ray diffraction (XRD) is a characterization technique in which a collimated X-ray beam is scattered by a crystalline material, and the angles and intensities of the diffracted beams are used to identify phases, measure lattice spacing, and assess crystallographic orientation. Because the probe is an X-ray rather than an electron, the measurement averages over millimetres of sample, needs no vacuum, and leaves the specimen intact.

## How X-ray diffraction works

A crystal is a periodic array of atoms. When the wavelength of the incoming X-rays is comparable to the spacing of those atoms, waves scattered from successive planes interfere constructively only at specific angles. That condition is Bragg's law: nλ = 2d sinθ. A diffractometer scans angle, records intensity, and the resulting peak positions are the lattice spacings of the phases that are present.

A **powder** or polycrystalline film produces rings of intensity at those angles, which a 0D or 1D detector records as a conventional 2θ scan. A **single crystal** or epitaxial film produces spots; a 2D detector captures those spots in one frame, and a high-resolution scan maps a small region of reciprocal space around a chosen reflection.

Two geometries matter in a multipurpose instrument. A **focusing (Bragg-Brentano)** beam concentrates intensity onto the detector and is the default for phase identification of powders. A **parallel beam**, produced here by Cross Beam Optics, keeps incidence angle well defined across a flat specimen and is required for grazing-incidence diffraction and X-ray reflectivity on films.

**X-ray reflectivity (XRR)** is the same instrument at still shallower angles. Specular reflection from each interface in a layered film interferes. Fringe spacing is thickness, the critical angle is density, and the decay of the fringes is roughness.

## When to use X-ray diffraction

- Identifying which crystalline phases are present in a powder, bulk solid, or film
- Deciding whether a deposit is crystalline, poorly crystalline, or amorphous
- Measuring lattice constants, crystallite size from peak broadening, and preferred orientation (texture)
- Measuring residual stress from peak shift with sample tilt
- Measuring film thickness, density, and interface roughness by X-ray reflectivity
- Mapping an epitaxial film in reciprocal space (rocking curves, reciprocal-space maps)
- Any case where the sample must not be coated, thinned, or placed in vacuum

## What X-ray diffraction cannot do

- **It does not see amorphous material as peaks.** A glass, a polymer, or an amorphous oxide produces a broad hump, not a phase ID.
- **It averages.** A laboratory scan reports the majority crystalline volume. A minority phase, a single grain, or a buried nanoparticle is a [TEM](transmission-electron-microscopy.md) or [SIMS](secondary-ion-mass-spectrometry.md) question.
- **It does not identify elements.** Peak positions are lattice spacings. Composition is inferred from the phase, not measured as EDS or SIMS measures it.
- **Thin films on a symmetric scan are substrate-dominated.** Grazing incidence or reflectivity is required; a powder-geometry scan of a 20 nm film is usually the substrate.
- **Rough or curved samples degrade reflectivity.** XRR needs a specularly flat film.

## The SmartLab at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Rigaku SmartLab** multipurpose X-ray diffractometer in Flagstaff, Arizona. The SmartLab is a theta-theta instrument: the sample stays horizontal and the source and detector move, which is what makes powders, liquids in holders, and large wafers practical on the same platform.

Cross Beam Optics switches between focusing and parallel-beam geometries without rebuilding the beam path. The **HyPix-3000** hybrid pixel detector operates in 0D, 1D, and 2D modes on the same sensor, so a powder scan, a reflectivity curve, and a 2D frame do not require swapping detectors. Acquisition and analysis run in SmartLab Studio II.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Geometry | Automated high-resolution theta-theta goniometer |
| X-ray source | Copper tube, up to 40 kV / 44 mA |
| Radiation | Copper K-alpha |
| Optics | Cross Beam Optics (CBO), focusing or parallel beam |
| Detector | HyPix-3000 hybrid pixel array (0D / 1D / 2D) |
| Goniometer | ~0.0001 deg resolution |
| Maximum wafer size | Up to about 6 in, thin-film stage dependent |
| Software | SmartLab Studio II |
| Sample types | Powders, bulk solids, thin films, wafers; liquids and pastes with holders |

Source, detector, optics, goniometer, and wafer capacity follow the [equipment catalogue](/About_Equipment/XRD.html).

[Full XRD specifications and booking &rarr;](/About_Equipment/XRD.html){ .md-button .md-button--primary }

## Sample requirements

- **Powders.** A filled holder, typically tens to hundreds of milligrams. Random orientation is assumed; a strongly plate-like powder will texture in the holder.
- **Bulk solids.** A flat face large enough for the beam. A sawn or polished face is better than a fracture surface.
- **Thin films.** A specularly flat coupon. Say the substrate, the nominal thickness, and the deposition method. Reflectivity and grazing incidence both fail on a visibly rough film.
- **Preparation.** None for most samples. No coating, no vacuum, no thinning.
- **Return.** The measurement is non-destructive. The sample leaves in the state it arrived.

## Frequently asked questions

### What is the difference between XRD and TEM diffraction?

Volume versus locality. XRD averages over millimetres of sample and identifies which crystalline phases are present, with what lattice spacing and texture. TEM diffraction is taken from a region a few micrometres across, or smaller, after the sample has been thinned below 100 nm. Use XRD first when the question is "what phase is this, and is it crystalline." Use TEM when the question is "what is this grain, this interface, or this defect."

### Can XRD measure thin films?

Yes, with the right geometry. A symmetric powder scan on a thin film is dominated by the substrate. Grazing-incidence XRD keeps the beam in the film so the film's peaks appear. X-ray reflectivity, at still shallower angles, returns thickness, density, and interface roughness from interference fringes. High-resolution XRD and reciprocal-space maps are the epitaxial-film versions of the same instrument.

### What is X-ray reflectivity?

A specular scan at grazing incidence. X-rays reflect from each interface in a layered film and interfere. The fringe spacing gives thickness, the critical angle gives density, and how fast the fringes damp gives roughness. The measurement is non-destructive and needs a specularly flat film; a rough or scattering surface does not produce usable fringes.

### Why did XRD miss a phase I know is there?

XRD reports crystalline material above a volume threshold, typically a few percent for a laboratory powder scan. An amorphous fraction produces no Bragg peaks. A minority phase below the detection floor is invisible. A strongly textured film can hide peaks that a powder would show, because those planes never satisfy the diffraction condition in the geometry you used. Grazing incidence, a 2D detector frame, or TEM diffraction answers the cases a symmetric scan misses.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
