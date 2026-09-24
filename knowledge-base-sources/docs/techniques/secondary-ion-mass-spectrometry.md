---
title: Secondary Ion Mass Spectrometry (SIMS)
description: Secondary ion mass spectrometry depth-profiles trace composition on a Hiden Analytical SIMS Workstation at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Surface Analysis
  - Thin Films
schema:
  - "@type": DefinedTerm
    name: Secondary Ion Mass Spectrometry
    alternateName: SIMS
    description: >-
      A surface analysis technique in which a focused primary ion beam sputters a specimen,
      and the ejected secondary ions are mass-analysed, yielding elemental and molecular
      composition as a function of depth with trace-level sensitivity.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": DefinedTerm
    name: Sputtered Neutral Mass Spectrometry
    alternateName: SNMS
    description: >-
      A variant of secondary ion mass spectrometry in which sputtered neutral atoms are
      ionised after they leave the surface, so that the detected signal is less dependent
      on the local ionisation probability and depth profiles can be quantified more directly.
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
    name: Secondary Ion Mass Spectrometry and SNMS
    serviceType: Surface analysis
    description: >-
      Dynamic and static SIMS plus sputtered-neutral mass spectrometry for trace composition,
      depth profiling, and optional elemental imaging of films, dopants, and surfaces.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Hiden Analytical SIMS Workstation
    category: Quadrupole SIMS/SNMS surface analysis system
    url: https://nano.nau.edu/About_Equipment/SIMS_Workstation.html
    manufacturer:
      "@type": Organization
      name: Hiden Analytical
    additionalProperty:
      - "@type": PropertyValue
        name: Analyser
        value: MAXIM quadrupole SIMS/SNMS spectrometer
      - "@type": PropertyValue
        name: Mass range
        value: 300 to 1000 amu (typical)
      - "@type": PropertyValue
        name: Depth resolution
        value: About 5 nm (typical thin-film profiling)
      - "@type": PropertyValue
        name: Ion guns
        value: Configurable, for example Ar/O2 and Cs; electron flood gun option for insulators
      - "@type": PropertyValue
        name: Detection
        value: Positive and negative secondary ions; SNMS via integral electron-impact ioniser
      - "@type": PropertyValue
        name: Sample size
        value: Up to 40 by 40 mm, maximum 10 mm thickness
      - "@type": PropertyValue
        name: Vacuum
        value: UHV analysis chamber with load lock

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is the difference between SIMS and SEM-EDS?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Detection floor and depth. SEM-EDS identifies major and minor elements in the
            top micrometre, typically down to about 0.1 weight percent, without consuming
            the sample. SIMS sputters the surface and detects traces at parts-per-million
            to parts-per-billion levels, with a depth profile through a film. Use EDS when
            the question is "what is this particle." Use SIMS when the question is "how
            much dopant is at what depth."
      - "@type": Question
        name: How destructive is SIMS?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The analysed area is consumed. Dynamic SIMS erodes a crater, typically tens to
            hundreds of micrometres across and up to a few micrometres deep, as the profile
            is acquired. Static SIMS uses a much lower ion dose so that the top molecular
            layer is sampled with far less erosion, at the cost of no useful depth profile.
            The rest of the coupon is unaltered. Do not submit the only piece of a device
            that must be returned intact.
      - "@type": Question
        name: What is SNMS and why use it?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Sputtered Neutral Mass Spectrometry ionises atoms after they have left the
            surface, rather than relying on the small fraction that leave already ionised.
            Secondary-ion yield varies by orders of magnitude with matrix and chemistry,
            which is why a raw SIMS profile of a multilayer is not a concentration profile.
            SNMS reduces that matrix effect so that a depth profile can be quantified with
            fewer standards.
      - "@type": Question
        name: Why is my SIMS depth profile not quantitative?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Because ionisation probability is a property of the matrix, not just of the
            element. The same number of dopant atoms produces a different secondary-ion
            count in silicon, in oxide, and at an interface. Quantification needs a
            standard of similar matrix, a known implant fluence, or SNMS. Without that,
            a SIMS profile is a relative depth distribution, which is still the right
            measurement for "is the dopant where I think it is."
---

# Secondary Ion Mass Spectrometry (SIMS)

Secondary ion mass spectrometry (SIMS) is a surface analysis technique in which a focused primary ion beam sputters a specimen, and the ejected secondary ions are mass-analysed. The result is elemental and molecular composition as a function of depth, with sensitivity that reaches parts per million to parts per billion, at the cost of consuming the analysed area.

## How secondary ion mass spectrometry works

A beam of primary ions strikes the surface in ultrahigh vacuum. Each impact ejects atoms, molecules, and a small fraction of ions from the top few nanometres. Those **secondary ions** are extracted into a mass spectrometer. As the beam continues, it erodes a crater, and the changing ion signal versus time is a **depth profile**.

Two dose regimes are used as different measurements.

**Dynamic SIMS** uses a high primary-ion current. The surface is eroded continuously, and the profile through a film, a dopant implant, or a multilayer is the point of the experiment.

**Static SIMS** keeps the ion dose low enough that each patch of surface is struck at most once. The spectrum then reflects the intact molecular fragments of the top layer, and there is no useful crater.

Most of the sputtered material leaves as **neutrals**, not ions. **Sputtered Neutral Mass Spectrometry (SNMS)** ionises those neutrals after they have left the surface, typically by electron impact. Because the ionisation step is moved off the sample, the signal depends less on the local chemistry, and a depth profile can be quantified with fewer matrix-matched standards.

A quadrupole analyser, as on this workstation, scans mass sequentially. It is well suited to depth profiling a chosen set of species. It is not a time-of-flight analyser: it does not record a full mass spectrum at every pixel in one shot.

## When to use secondary ion mass spectrometry

- Measuring dopant or impurity concentration versus depth in a semiconductor or oxide film
- Checking whether a film, a barrier, or a contaminant is present at the surface or buried
- Identifying trace elements that [SEM-EDS](scanning-electron-microscopy.md) cannot see
- Mapping elemental distribution in two or three dimensions, when imaging is configured
- Static SIMS for molecular fragments at a surface, including residues and thin organic layers
- Any composition-versus-depth question on a coupon that can be sacrificed in the analysed spot

## What secondary ion mass spectrometry cannot do

- **It is not a picture of the surface.** Spatial resolution is set by the primary-beam diameter, typically tens to hundreds of micrometres on a quadrupole workstation, not nanometres. Morphology is an [SEM](scanning-electron-microscopy.md) or [AFM](atomic-force-microscopy.md) question.
- **A raw SIMS intensity is not a concentration.** Matrix effects can change secondary-ion yield by orders of magnitude at an interface. Quantification needs a standard, a known implant, or SNMS.
- **It consumes the analysed area.** Dynamic SIMS leaves a crater. The only piece of a working device is the wrong sample.
- **Insulators charge.** Without charge compensation, the spectrum distorts or vanishes. An electron flood gun is the usual fix; the catalogue lists it as an option for insulating samples.
- **It does not report chemical state the way XPS does.** Mass identifies species; oxidation state and bonding are inferred, not measured as a core-level shift.

## The Hiden SIMS Workstation at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Hiden Analytical SIMS Workstation** (catalogue designation Type 40010) in Flagstaff, Arizona. The analyser is Hiden's **MAXIM** quadrupole, built for both secondary-ion detection and SNMS via an integral electron-impact ioniser. Positive and negative ions can be recorded. Mass-range options on the MAXIM are 300, 510, or 1000 amu.

Samples load from a lock onto a holder that presents the top surface in the analysis plane. Hiden specifies a maximum coupon of 40 × 40 mm and a maximum thickness of 10 mm, with spring-clip mounting rather than adhesive.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Analyser | MAXIM quadrupole SIMS/SNMS |
| Operating modes | Dynamic SIMS, static SIMS, SNMS |
| Mass range | 300 to 1000 amu (typical) |
| Depth resolution | ~5 nm (typical thin-film profiling) |
| Ion guns | Configurable (e.g. Ar/O₂, Cs) |
| Charge compensation | Electron flood gun option for insulating samples |
| Detection | Positive and negative secondary ions; SNMS via integral ioniser |
| Sample size | Up to ~40 × 40 mm, max ~10 mm thick |
| Vacuum | UHV chamber with turbomolecular pumping and LN2 cryopanel |
| Software | MASsoft |

Mass range, depth resolution, ion guns, flood-gun option, and sample size follow the [equipment catalogue](/About_Equipment/SIMS_Workstation.html).

[Full SIMS specifications and booking &rarr;](/About_Equipment/SIMS_Workstation.html){ .md-button .md-button--primary }

## Sample requirements

- **A coupon that can be sputtered.** The analysed patch will not be returned in its original state.
- **Size.** Within 40 × 40 mm and 10 mm thick, with a face that can be clipped to the holder. No adhesive.
- **Vacuum compatibility.** UHV. Oils, tapes, and heavy plasticisers are not acceptable.
- **Conductivity.** Metals and doped semiconductors are straightforward. Insulators need charge compensation; say so when you submit.
- **What you already know.** Nominal stack, expected species, and whether you need a relative profile or a quantified one. Quantification is a standards conversation, not a default.

## Frequently asked questions

### What is the difference between SIMS and SEM-EDS?

Detection floor and depth. SEM-EDS identifies major and minor elements in the top micrometre, typically down to about 0.1 weight percent, without consuming the sample. SIMS sputters the surface and detects traces at parts-per-million to parts-per-billion levels, with a depth profile through a film. Use EDS when the question is "what is this particle." Use SIMS when the question is "how much dopant is at what depth."

### How destructive is SIMS?

The analysed area is consumed. Dynamic SIMS erodes a crater, typically tens to hundreds of micrometres across and up to a few micrometres deep, as the profile is acquired. Static SIMS uses a much lower ion dose so that the top molecular layer is sampled with far less erosion, at the cost of no useful depth profile. The rest of the coupon is unaltered. Do not submit the only piece of a device that must be returned intact.

### What is SNMS and why use it?

Sputtered Neutral Mass Spectrometry ionises atoms after they have left the surface, rather than relying on the small fraction that leave already ionised. Secondary-ion yield varies by orders of magnitude with matrix and chemistry, which is why a raw SIMS profile of a multilayer is not a concentration profile. SNMS reduces that matrix effect so that a depth profile can be quantified with fewer standards.

### Why is my SIMS depth profile not quantitative?

Because ionisation probability is a property of the matrix, not just of the element. The same number of dopant atoms produces a different secondary-ion count in silicon, in oxide, and at an interface. Quantification needs a standard of similar matrix, a known implant fluence, or SNMS. Without that, a SIMS profile is a relative depth distribution, which is still the right measurement for "is the dopant where I think it is."

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
