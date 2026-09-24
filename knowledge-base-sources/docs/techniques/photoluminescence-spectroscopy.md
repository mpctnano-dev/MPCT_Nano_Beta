---
title: Photoluminescence Spectroscopy (PL)
description: Photoluminescence spectroscopy measures emission spectra and lifetimes on an Edinburgh FLS1000 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Optical Metrology
  - Semiconductors
schema:
  - "@type": DefinedTerm
    name: Photoluminescence Spectroscopy
    alternateName: PL
    description: >-
      An optical characterization technique in which a specimen is excited with light and
      the resulting emission is recorded as a spectrum or as a decay versus time, reporting
      electronic structure, defects, and carrier lifetime without contacting the sample.
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
    name: Photoluminescence Spectroscopy
    serviceType: Optical materials characterization
    description: >-
      Steady-state and time-resolved photoluminescence from the ultraviolet to the mid-infrared,
      including emission and excitation spectra, lifetimes from picoseconds to seconds, and
      polarization-resolved emission, on films, powders, and solutions.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Edinburgh Instruments FLS1000
    category: Modular photoluminescence spectrometer
    url: https://nano.nau.edu/About_Equipment/Photoluminescence_Spectrometer.html
    manufacturer:
      "@type": Organization
      name: Edinburgh Instruments
    additionalProperty:
      - "@type": PropertyValue
        name: Spectral range
        value: About 185 to 5500 nm
      - "@type": PropertyValue
        name: Lifetime range
        value: Picoseconds to seconds
      - "@type": PropertyValue
        name: Sensitivity
        value: Greater than 35,000 to 1 signal-to-noise ratio
      - "@type": PropertyValue
        name: Steady-state source
        value: 450 W ozone-free xenon arc lamp
      - "@type": PropertyValue
        name: Monochromator
        value: 325 mm focal length Czerny-Turner with triple grating turret
      - "@type": PropertyValue
        name: Wavelength accuracy
        value: Plus or minus 0.2 nm, grating dependent
      - "@type": PropertyValue
        name: Stray light rejection
        value: 1 to 10^5 single monochromator, 1 to 10^10 double monochromator
      - "@type": PropertyValue
        name: Minimum step
        value: 0.01 nm

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is photoluminescence spectroscopy?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Photoluminescence spectroscopy records the light a specimen emits after it has
            been excited by light of a shorter wavelength. The emission spectrum locates
            electronic transitions and defect bands. The decay of that emission versus time
            is the lifetime, which reports how carriers or excited states recombine.
      - "@type": Question
        name: What is the difference between photoluminescence and Raman spectroscopy?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Photoluminescence is emission from an electronic excited state, usually much
            stronger than Raman and shifted by electron-volts rather than by vibrational
            wavenumbers. Raman is inelastic scattering from vibrations. Use PL when the
            question is band gap, defects, or lifetime. Use Raman when the question is
            chemical identity or crystal phase.
      - "@type": Question
        name: Can photoluminescence measure carrier lifetime?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. Time-correlated single-photon counting covers picoseconds to microseconds.
            Multichannel scaling covers longer phosphorescence, from nanoseconds to seconds.
            The FLS1000 is specified for lifetimes across that whole span. Lifetime is a
            decay of emission after pulsed excitation, not a substitute for a transport
            measurement of mobility.
      - "@type": Question
        name: Why is my photoluminescence signal weak or missing?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The excitation wavelength is not absorbed, the emission is outside the detector
            window, the surface is quenched by contamination or a metal overlayer, or the
            material is indirect-gap and simply emits weakly at room temperature. Cooling,
            a different excitation line, and a clean uncoated surface are the usual first
            checks. A missing signal is often a sample or geometry problem, not a broken lamp.
      - "@type": Question
        name: Can external companies use the photoluminescence spectrometer at NAU?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The MPaCT Lab is a shared-use facility in Flagstaff, Arizona, open to NAU
            researchers, external academic users, and industry partners on either a
            fee-for-service or hands-on trained-user basis.
---

# Photoluminescence Spectroscopy (PL)

Photoluminescence spectroscopy (PL) is an optical characterization technique in which a specimen is excited with light and the resulting emission is recorded as a spectrum or as a decay versus time. It reports electronic structure, defects, and carrier lifetime without contacting the sample.

## How photoluminescence spectroscopy works

A photon is absorbed and promotes an electron into an excited state. When that electron returns toward the ground state, some of the energy is re-emitted as light. The **emission spectrum** is intensity versus wavelength of that light. An **excitation spectrum** is intensity at a fixed emission wavelength while the excitation wavelength is scanned, which maps which absorptions feed that emission.

**Lifetime** is the decay of emission after a short excitation pulse. Time-correlated single-photon counting (TCSPC) builds that decay from many weak pulses and covers picoseconds to microseconds. Multichannel scaling covers slower phosphorescence, out to seconds.

A spectrofluorometer selects excitation and emission with monochromators rather than with fixed filters, so the same instrument can scan a semiconductor film, a quantum-dot dispersion, and a molecular dye without changing filter sets. Polarizers on both paths give **anisotropy**, which reports how quickly an emitter rotates or how oriented a film is.

PL is not absorption. A weak emitter can still absorb strongly. A strong emitter can still be quenched at the surface.

## When to use photoluminescence spectroscopy

- Locating the emission energy of a semiconductor, quantum dot, or phosphor
- Comparing defect or impurity bands between growth runs
- Measuring fluorescence or phosphorescence lifetime
- Checking whether a film is optically active before building a device on it
- Polarization-resolved emission when orientation or mobility of the emitter matters
- Any case where the sample must not be contacted, coated, or placed in vacuum

## What photoluminescence spectroscopy cannot do

- **A missing band is not proof the material is absent.** Indirect-gap semiconductors and metals emit weakly. Surface quenching can kill PL from a film that is otherwise intact.
- **It does not report composition the way EDS or SIMS does.** Peak position constrains the electronic transition; it does not identify an element.
- **Room-temperature PL can hide structure that appears only when cooled.** The catalogue page does not list a cryostat as part of this instrument.
- **The measurement averages over the illuminated spot.** Feature-level emission needs a microscope, which is a different setup.
- **It is not a substitute for quantum-efficiency metrology unless the run is set up for absolute PLQY.** Spectral shape and lifetime do not by themselves give a yield.

## The FLS1000 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates an **Edinburgh Instruments FLS1000** modular photoluminescence spectrometer in Flagstaff, Arizona. The catalogue lists spectral coverage of about 185 to 5500 nm, lifetimes from picoseconds to seconds, a 450 W ozone-free xenon lamp for steady-state work, and a signal-to-noise ratio greater than 35,000:1.

A 325 mm Czerny-Turner monochromator with a triple grating turret selects wavelength. Picosecond diode lasers and a microsecond flashlamp cover the pulsed measurements. Wavelength accuracy is listed as ±0.2 nm, grating dependent.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Spectral range | ~185 to 5500 nm |
| Lifetime range | Picoseconds to seconds |
| Sensitivity | >35,000:1 SNR |
| Steady-state source | 450 W ozone-free xenon arc lamp |
| Pulsed sources | Picosecond diode lasers and microsecond flashlamp |
| Monochromator | 325 mm Czerny-Turner, triple grating turret |
| Wavelength accuracy | ±0.2 nm (grating dependent) |
| Minimum step | 0.01 nm |
| Stray light rejection | 1:10⁵ (single mono), 1:10¹⁰ (double mono) |
| Software | USB control via PC software |

Figures follow the [equipment catalogue](/About_Equipment/Photoluminescence_Spectrometer.html).

[Full FLS1000 specifications and booking &rarr;](/About_Equipment/Photoluminescence_Spectrometer.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** Films, wafers, powders, cuvettes, and small coupons that sit in the sample chamber.
- **Surface.** Clean enough that the excitation reaches the material you care about. A metal cap or a dirty polymer overlayer will quench or shadow the emission.
- **Optical access.** The instrument looks at light, not at a buried layer behind an opaque stack.
- **Hazards.** Declare anything fluorescent, photosensitive, or toxic before submission.
- **What you already know.** Nominal composition, expected emission window, and whether you need a spectrum, a lifetime, or both.

## Frequently asked questions

### What is photoluminescence spectroscopy?

Photoluminescence spectroscopy records the light a specimen emits after it has been excited by light of a shorter wavelength. The emission spectrum locates electronic transitions and defect bands. The decay of that emission versus time is the lifetime, which reports how carriers or excited states recombine.

### What is the difference between photoluminescence and Raman spectroscopy?

Photoluminescence is emission from an electronic excited state, usually much stronger than Raman and shifted by electron-volts rather than by vibrational wavenumbers. Raman is inelastic scattering from vibrations. Use PL when the question is band gap, defects, or lifetime. Use Raman when the question is chemical identity or crystal phase.

### Can photoluminescence measure carrier lifetime?

Yes. Time-correlated single-photon counting covers picoseconds to microseconds. Multichannel scaling covers longer phosphorescence, from nanoseconds to seconds. The FLS1000 is specified for lifetimes across that whole span. Lifetime is a decay of emission after pulsed excitation, not a substitute for a transport measurement of mobility.

### Why is my photoluminescence signal weak or missing?

The excitation wavelength is not absorbed, the emission is outside the detector window, the surface is quenched by contamination or a metal overlayer, or the material is indirect-gap and simply emits weakly at room temperature. Cooling, a different excitation line, and a clean uncoated surface are the usual first checks. A missing signal is often a sample or geometry problem, not a broken lamp.

### Can external companies use the photoluminescence spectrometer at NAU?

Yes. The MPaCT Lab is a shared-use facility in Flagstaff, Arizona, open to NAU researchers, external academic users, and industry partners on either a fee-for-service or hands-on trained-user basis.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
