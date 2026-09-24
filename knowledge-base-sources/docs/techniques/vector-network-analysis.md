---
title: Vector Network Analysis
description: Two-port S-parameter measurement of antennas, filters, and cables on a Keysight E5063A at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Electrical
  - RF
schema:
  - "@type": DefinedTerm
    name: Vector Network Analysis
    alternateName: VNA
    description: >-
      An RF characterization method that measures the complex scattering
      parameters of a two-port network, reporting how the device reflects and
      transmits a 50 ohm stimulus as a function of frequency.
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
    name: Vector Network Analysis
    serviceType: RF characterization
    description: >-
      Two-port S-parameter measurement of passive RF components, antennas,
      cables, and boards.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Keysight E5063A
    category: Vector network analyzer
    url: https://nano.nau.edu/About_Equipment/Vector_Network_Analyzer.html
    manufacturer:
      "@type": Organization
      name: Keysight
    additionalProperty:
      - "@type": PropertyValue
        name: Frequency coverage
        value: 100 kHz to 500 MHz through 18 GHz, option dependent
      - "@type": PropertyValue
        name: Test ports
        value: 2-port S-parameter, 50 ohm, Type-N
      - "@type": PropertyValue
        name: Dynamic range
        value: About 122 dB typical at 100 MHz to 4.35 GHz, IFBW 10 Hz
      - "@type": PropertyValue
        name: Trace noise
        value: About 0.002 dB rms typical at 8 MHz to 4.35 GHz, IFBW 70 kHz

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is a vector network analyzer?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A vector network analyzer measures how a device reflects and
            transmits an RF stimulus, as complex S-parameters versus
            frequency. Magnitude and phase are both recorded. A scalar power
            meter does not replace it. The E5063A is a two-port, 50 ohm
            instrument with Type-N connectors.
      - "@type": Question
        name: What frequency range is installed on the E5063A?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Keysight sells eight options from 100 kHz to 500 MHz up to 18 GHz.
            The catalogue lists that full option set and does not name which
            option is fitted. This page does not pick one. Ask staff, or read
            the live catalogue, before planning a measurement above a few
            gigahertz.
      - "@type": Question
        name: What is the difference between a VNA and an impedance analyzer?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Ports and band. The E4990A reports component impedance on a bridge
            from 20 Hz to 120 MHz, with DC bias. The E5063A reports S-parameters
            of a 50 ohm network from 100 kHz upward. Capacitors and dielectrics
            start on the impedance analyzer. Antennas, filters, cables, and
            boards start here.
      - "@type": Question
        name: Why are my S-parameters wrong after I connected the cables?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Calibration plane. SOLT, TRL, unknown thru, waveguide, ECal, and
            adapter removal are listed on the catalogue page. An uncalibrated
            cable is part of the measurement. Calibrate at the plane you care
            about, then do not disturb the cables.
      - "@type": Question
        name: Can the VNA measure a wafer?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Not by itself. On-wafer RF is the MPI TS200 plus appropriate
            probes, which may be connected to a VNA. A packaged connectorized
            part can go straight on the E5063A Type-N ports. A bare die cannot.
---

# Vector Network Analysis

Vector network analysis is an RF characterization method that measures the complex scattering parameters of a two-port network. Reflection and transmission of a 50 Ω stimulus are recorded versus frequency, with magnitude and phase. Filters, antennas, cables, and connectorized boards are the usual devices.

## How vector network analysis works

The analyzer sources an RF wave at port 1 or port 2 and measures the outgoing and returning waves. S11 and S22 are reflections. S21 and S12 are transmissions. Calibration moves the reference plane to the device.

The Keysight E5063A is a two-port, 50 Ω, Type-N ENA. Frequency options run from 100 kHz–500 MHz to 18 GHz. Catalogue typical dynamic range is about 122 dB (100 MHz–4.35 GHz, IFBW 10 Hz) and typical trace noise about 0.002 dB rms (8 MHz–4.35 GHz, IFBW 70 kHz). Calibration methods listed: SOLT, TRL, unknown thru, waveguide, ECal, adapter removal/insertion. Interfaces: USB, LAN; optional GPIB.

Which frequency option is fitted is not asserted.

## When to use vector network analysis

- Antenna return loss
- Filter insertion and rejection
- Cable and connector characterisation
- Passive 50 Ω components
- Board impedance with the PCB-analyzer option, if that option is actually installed

## What vector network analysis cannot do

- **It is not a low-frequency LCR measurement.** Below 100 kHz, and for C–V with DC bias, use the [E4990A](impedance-analysis.md).
- **It is not a spectrum analyzer.** It does not measure an unknown transmitter's emissions.
- **The top frequency is option dependent.** Do not assume 18 GHz.
- **A wafer needs probes.** See [on-wafer probing](on-wafer-probing.md).

## The E5063A at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a **Keysight E5063A ENA** vector network analyzer in Flagstaff, Arizona. The catalogue lists frequency options from 100 kHz to 500 MHz through 18 GHz, two Type-N 50 Ω ports, typical dynamic range about 122 dB, and typical trace noise about 0.002 dB rms.

The equipment catalogue currently lists the VNA as expected rather than available. Confirm live status, and which frequency option is fitted, on the [catalogue page](/About_Equipment/Vector_Network_Analyzer.html).

When the tool is in service it is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Frequency | 100 kHz to 500 MHz / 1.5 / 3 / 4.5 / 6.5 / 8.5 / 14 / 18 GHz (option dependent) |
| Ports | 2-port S-parameter, 50 Ω, Type-N |
| Dynamic range (typ.) | ~122 dB at 100 MHz–4.35 GHz, IFBW 10 Hz |
| Trace noise (typ.) | ~0.002 dB rms at 8 MHz–4.35 GHz, IFBW 70 kHz |
| Calibration | SOLT, TRL, unknown thru, waveguide, ECal, adapter removal |
| Interfaces | USB, LAN; optional GPIB |

Figures follow the [equipment catalogue](/About_Equipment/Vector_Network_Analyzer.html) and Keysight's E5063A specification.

[Full E5063A specifications and booking &rarr;](/About_Equipment/Vector_Network_Analyzer.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** A connectorized two-port, a cable, or an antenna with a known connector. Type-N at the instrument; adapters are part of calibration.
- **Calibration kit.** Say the connector family. ECal is faster if the right module exists.
- **Power.** Passive parts are the documented use. Active devices need a conversation about damage levels.

## Frequently asked questions

### What is a vector network analyzer?

A vector network analyzer measures how a device reflects and transmits an RF stimulus, as complex S-parameters versus frequency. Magnitude and phase are both recorded. A scalar power meter does not replace it. The E5063A is a two-port, 50 ohm instrument with Type-N connectors.

### What frequency range is installed on the E5063A?

Keysight sells eight options from 100 kHz to 500 MHz up to 18 GHz. The catalogue lists that full option set and does not name which option is fitted. This page does not pick one. Ask staff, or read the live catalogue, before planning a measurement above a few gigahertz.

### What is the difference between a VNA and an impedance analyzer?

Ports and band. The E4990A reports component impedance on a bridge from 20 Hz to 120 MHz, with DC bias. The E5063A reports S-parameters of a 50 ohm network from 100 kHz upward. Capacitors and dielectrics start on the impedance analyzer. Antennas, filters, cables, and boards start here.

### Why are my S-parameters wrong after I connected the cables?

Calibration plane. SOLT, TRL, unknown thru, waveguide, ECal, and adapter removal are listed on the catalogue page. An uncalibrated cable is part of the measurement. Calibrate at the plane you care about, then do not disturb the cables.

### Can the VNA measure a wafer?

Not by itself. On-wafer RF is the MPI TS200 plus appropriate probes, which may be connected to a VNA. A packaged connectorized part can go straight on the E5063A Type-N ports. A bare die cannot.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
