---
title: Impedance Analysis
description: Frequency-swept impedance analysis of components from 20 Hz to 120 MHz on a Keysight E4990A at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Electrical
schema:
  - "@type": DefinedTerm
    name: Impedance Analysis
    alternateName: LCR and Impedance Spectroscopy
    description: >-
      An electrical characterization method that measures the complex impedance
      of a component or material as a function of frequency, yielding
      resistance, reactance, capacitance, inductance, and related parameters
      from a four-terminal-pair measurement.
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
    name: Impedance Analysis
    serviceType: Electrical characterization
    description: >-
      Frequency-swept impedance measurement of components, materials, and
      devices from 20 Hz to 120 MHz with a built-in DC bias source.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Keysight E4990A
    category: Impedance analyzer
    url: https://nano.nau.edu/About_Equipment/Keysight_ImpAnalyzer.html
    manufacturer:
      "@type": Organization
      name: Keysight
    additionalProperty:
      - "@type": PropertyValue
        name: Frequency range
        value: 20 Hz to 120 MHz
      - "@type": PropertyValue
        name: Basic accuracy
        value: Plus or minus 0.08 percent, typical plus or minus 0.045 percent
      - "@type": PropertyValue
        name: Impedance range
        value: 25 milliohms to 40 megaohms, 10 percent accuracy range
      - "@type": PropertyValue
        name: DC bias
        value: 0 to plus or minus 40 V, 0 to plus or minus 100 mA
      - "@type": PropertyValue
        name: Display
        value: 10.4 inch touchscreen

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is impedance analysis?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Impedance analysis measures how a device resists alternating current
            as frequency changes. The result is a complex number, reported as
            magnitude and phase or as R and X, from which C, L, D, and Q are
            derived. A sweep, rather than a single LCR reading, is what shows
            resonances, dielectric loss, and equivalent-circuit behaviour.
      - "@type": Question
        name: What is the difference between an impedance analyzer and an LCR meter?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Sweep versus a point. An LCR meter reports C, L, or R at one
            frequency. The E4990A sweeps 20 Hz to 120 MHz, plots the traces, and
            fits equivalent circuits. Use an LCR meter for a sorting number. Use
            the analyzer when the frequency dependence is the question.
      - "@type": Question
        name: What is the difference between impedance analysis and a VNA?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Quantity and band. Impedance analysis reports Z of a component on
            an auto-balancing bridge from 20 Hz to 120 MHz, including a DC
            bias. A vector network analyzer reports S-parameters of a 50 ohm
            network, typically from 100 kHz upward. Capacitors, inductors, and
            dielectrics start here. Antennas, filters, and boards start on the
            VNA.
      - "@type": Question
        name: How accurate is the E4990A?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Keysight specifies basic accuracy of plus or minus 0.08 percent,
            typically plus or minus 0.045 percent, over a 25 milliohm to 40
            megaohm range at 10 percent accuracy. That figure is at the
            instrument port under the datasheet conditions, not at the end of
            an uncompensated fixture. Open, short, and load compensation at the
            fixture is part of the measurement.
      - "@type": Question
        name: Why is my capacitance reading frequency-dependent when I expected a constant?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Real capacitors have ESL and ESR. Dielectrics have relaxation.
            Fixtures add their own C and L. A single 1 kHz LCR number hides
            that. Sweep, look for the resonance, and fit an equivalent circuit
            rather than treating one point as the part.
---

# Impedance Analysis

Impedance analysis is an electrical characterization method that measures the complex impedance of a component or material as a function of frequency. Resistance, reactance, capacitance, inductance, dissipation factor, and quality factor are derived from that sweep. A four-terminal-pair connection and a DC bias source are what make the number more than a single LCR reading.

## How impedance analysis works

An auto-balancing bridge applies an AC stimulus and measures voltage and current at the device. Frequency is swept. Each point is a complex Z, displayed as |Z|, θ, R, X, C, L, D, or Q.

The Keysight E4990A is specified from 20 Hz to 120 MHz, with basic accuracy ±0.08% (typical ±0.045%), an impedance range of 25 mΩ to 40 MΩ (10% accuracy range), and a built-in DC bias of 0 to ±40 V and 0 to ±100 mA. Measurement parameters listed on the catalogue page are |Z|, |Y|, θ, R, X, G, B, L, C, D, and Q.

Five frequency options exist on the product (10 / 20 / 30 / 50 / 120 MHz). The catalogue states 20 Hz to 120 MHz. This page uses that catalogue range. If a lower option is what is actually fitted, staff will say so.

## When to use impedance analysis

- Characterising capacitors, inductors, ferrite beads, and resonators versus frequency
- C–V of a semiconductor device, using the DC bias
- Dielectric or magnetic material measurements with the appropriate fixture
- Finding a self-resonance that a single-frequency LCR meter will miss
- Equivalent-circuit fitting of a component model

## What impedance analysis cannot do

- **It is not an S-parameter measurement.** Antennas, 50 Ω filters, and board traces are [vector network analysis](vector-network-analysis.md).
- **It is not a DC I–V curve tracer.** Bias is a superimposed DC on an impedance sweep. Full I–V is a source-measure unit or the [probe station](on-wafer-probing.md).
- **Accuracy is at the port, after compensation.** An uncompensated clip lead is not ±0.08%.
- **120 MHz is the top of this instrument.** Higher-frequency impedance of an RF part is a VNA problem.

## The E4990A at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a **Keysight E4990A** impedance analyzer in Flagstaff, Arizona. The catalogue specifies 20 Hz to 120 MHz, basic accuracy ±0.08% (typical ±0.045%), 25 mΩ to 40 MΩ (10% accuracy range), DC bias 0 to ±40 V and 0 to ±100 mA, and a 10.4 in touchscreen with GPIB / LAN / USB.

The equipment catalogue currently lists the E4990A as expected rather than available. Confirm live status on the [catalogue page](/About_Equipment/Keysight_ImpAnalyzer.html) before planning a measurement.

When the tool is in service it is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Frequency range | 20 Hz to 120 MHz |
| Basic accuracy | ±0.08% (typical ±0.045%) |
| Impedance range | 25 mΩ to 40 MΩ (10% accuracy range) |
| Parameters | \|Z\|, \|Y\|, θ, R, X, G, B, L, C, D, Q |
| DC bias | 0 to ±40 V, 0 to ±100 mA |
| Interface | 10.4 in touchscreen; GPIB / LAN / USB |

Figures follow the [equipment catalogue](/About_Equipment/Keysight_ImpAnalyzer.html) and Keysight's E4990A product specification.

[Full E4990A specifications and booking &rarr;](/About_Equipment/Keysight_ImpAnalyzer.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** A discrete component, a coupon in a material fixture, or a device that can be contacted at the analyzer port. Say the expected C, L, or R so the right fixture is chosen.
- **Compensation.** Open, short, and load at the fixture are part of the run, not optional.
- **Bias.** State the DC voltage or current if the device needs it. ±40 V and ±100 mA are the built-in limits.

## Frequently asked questions

### What is impedance analysis?

Impedance analysis measures how a device resists alternating current as frequency changes. The result is a complex number, reported as magnitude and phase or as R and X, from which C, L, D, and Q are derived. A sweep, rather than a single LCR reading, is what shows resonances, dielectric loss, and equivalent-circuit behaviour.

### What is the difference between an impedance analyzer and an LCR meter?

Sweep versus a point. An LCR meter reports C, L, or R at one frequency. The E4990A sweeps 20 Hz to 120 MHz, plots the traces, and fits equivalent circuits. Use an LCR meter for a sorting number. Use the analyzer when the frequency dependence is the question.

### What is the difference between impedance analysis and a VNA?

Quantity and band. Impedance analysis reports Z of a component on an auto-balancing bridge from 20 Hz to 120 MHz, including a DC bias. A vector network analyzer reports S-parameters of a 50 ohm network, typically from 100 kHz upward. Capacitors, inductors, and dielectrics start here. Antennas, filters, and boards start on the VNA.

### How accurate is the E4990A?

Keysight specifies basic accuracy of plus or minus 0.08 percent, typically plus or minus 0.045 percent, over a 25 milliohm to 40 megaohm range at 10 percent accuracy. That figure is at the instrument port under the datasheet conditions, not at the end of an uncompensated fixture. Open, short, and load compensation at the fixture is part of the measurement.

### Why is my capacitance reading frequency-dependent when I expected a constant?

Real capacitors have ESL and ESR. Dielectrics have relaxation. Fixtures add their own C and L. A single 1 kHz LCR number hides that. Sweep, look for the resonance, and fit an equivalent circuit rather than treating one point as the part.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
