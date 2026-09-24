---
title: Benchtop Electrical Measurement
description: Benchtop DMM, function generator, and oscilloscope measurement at NAU's MPaCT Lab in Flagstaff, Arizona, on Keithley and Tektronix instruments.
tags:
  - Electrical
  - Characterization
schema:
  - "@type": DefinedTerm
    name: Benchtop Electrical Measurement
    alternateName: DMM Oscilloscope and Function Generator
    description: >-
      General-purpose electrical measurement in which a digital multimeter,
      an arbitrary function generator, and a digital oscilloscope source and
      record voltage, current, and waveforms on the bench, without a probe
      station or a network analyzer.
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
    name: Benchtop Electrical Measurement
    serviceType: Electrical test
    description: >-
      Voltage, current, and waveform measurement and generation on the bench
      using a 5.5-digit DMM, a two-channel function generator, and a 50 MHz
      oscilloscope.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Keithley 2110
    category: 5.5-digit digital multimeter
    url: https://nano.nau.edu/About_Equipment/Keithley_2110.html
    manufacturer:
      "@type": Organization
      name: Keithley
    additionalProperty:
      - "@type": PropertyValue
        name: Resolution
        value: 5.5 digit, 120000 count
      - "@type": PropertyValue
        name: Measurement functions
        value: 15 functions
      - "@type": PropertyValue
        name: Interfaces
        value: USB, RS-232, and GPIB

  - "@type": IndividualProduct
    name: Tektronix AFG1022
    category: Arbitrary function generator
    url: https://nano.nau.edu/About_Equipment/Tektronix_AFG1022.html
    manufacturer:
      "@type": Organization
      name: Tektronix
    additionalProperty:
      - "@type": PropertyValue
        name: Channels
        value: "2"
      - "@type": PropertyValue
        name: Sine frequency
        value: 1 microhertz to 25 MHz
      - "@type": PropertyValue
        name: Arbitrary record length
        value: 2 to 8192 points
      - "@type": PropertyValue
        name: Frequency resolution
        value: 1 microhertz

  - "@type": IndividualProduct
    name: Tektronix TBS1052C
    category: Digital storage oscilloscope
    url: https://nano.nau.edu/About_Equipment/Tektronix_TBS1052C.html
    manufacturer:
      "@type": Organization
      name: Tektronix
    additionalProperty:
      - "@type": PropertyValue
        name: Bandwidth
        value: 50 MHz
      - "@type": PropertyValue
        name: Channels
        value: "2"
      - "@type": PropertyValue
        name: Sample rate
        value: 1 GS/s
      - "@type": PropertyValue
        name: Record length
        value: 20 kpoints

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What instruments are on the benchtop electrical stack?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Three. A Keithley 2110 5.5-digit multimeter for DC and AC voltage,
            current, and resistance. A Tektronix AFG1022 two-channel function
            generator. A Tektronix TBS1052C 50 MHz, 1 GS/s oscilloscope. They
            are the general-purpose bench, not a probe station and not a VNA.
      - "@type": Question
        name: What is the difference between this bench and on-wafer probing?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Access. On-wafer probing contacts pads on a wafer up to 200 mm
            inside a shielded station, including RF. This bench takes leads,
            BNCs, and packaged parts. If the device is still a die on a wafer,
            start at the MPI TS200. If it is a board or a wired package, start
            here.
      - "@type": Question
        name: How fast a sine can the AFG1022 generate?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Tektronix specifies the AFG1022 sine from 1 microhertz to 25 MHz.
            The catalogue line "up to 60 MHz (AFG1000 series)" is the AFG1062.
            This page uses 25 MHz for the installed AFG1022. Square is specified
            to 12.5 MHz. Arbitrary waveforms are 2 to 8,192 points.
      - "@type": Question
        name: Why can I not see a 100 MHz clock on the oscilloscope?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Bandwidth. The TBS1052C is specified at 50 MHz and 1 GS/s, 20
            kpoints, two channels. A 100 MHz edge is outside that analogue
            bandwidth. The sample rate is not the bandwidth. Use a faster
            scope, or the VNA, for faster signals.
      - "@type": Question
        name: Can external companies use the benchtop instruments at NAU?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The three instruments are listed as available. They are open
            to NAU researchers, external academic users, and industry partners,
            on a fee-for-service basis or as trained hands-on users, in
            Flagstaff, Arizona.
---

# Benchtop Electrical Measurement

Benchtop electrical measurement is general-purpose sourcing and recording of voltage, current, and waveforms on wired parts, boards, and packages. A 5.5-digit multimeter, a two-channel function generator, and a 50 MHz oscilloscope cover the work that does not need a probe station or a network analyzer.

## How the bench is used

Three instruments sit together because most teaching and debug loops need all three.

- **Keithley 2110.** 5.5-digit / 120,000-count DMM, 15 measurement functions, dual display, USB, RS-232, and GPIB. Catalogue reading rate is up to 200 readings per second. Use it for DC values, 2-wire and 4-wire resistance, and a first look at a bias point.
- **Tektronix AFG1022.** Two channels. Manufacturer sine range 1 µHz to 25 MHz, not the 60 MHz of the AFG1062. Arbitrary records 2 to 8,192 points, 1 µHz frequency resolution, 50 built-in waveform types in the catalogue. Amplitude into 50 Ω is specified from 1 mVpp to 10 Vpp.
- **Tektronix TBS1052C.** 50 MHz analogue bandwidth, two channels, 1 GS/s, 20 kpoints, 7 in WVGA, USB. Use it to see the waveform the generator produced, or the one the circuit produced.

On-wafer work, S-parameters, and impedance sweeps are other pages.

## When to use the benchtop stack

- Lab teaching and coursework
- Debugging a packaged board
- Generating a stimulus and measuring the response with leads
- Confirming a DC bias before a more expensive instrument is booked

## What the benchtop stack cannot do

- **It is not 50 Ω network analysis.** That is the [E5063A](vector-network-analysis.md).
- **It is not a 120 MHz impedance analyzer.** That is the [E4990A](impedance-analysis.md).
- **It is not on-wafer.** That is the [MPI TS200](on-wafer-probing.md).
- **AFG1022 sine stops at 25 MHz.** The catalogue's 60 MHz is the series sibling.
- **TBS1052C analogue bandwidth is 50 MHz.** Sample rate 1 GS/s does not extend that.

## The instruments at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Keithley 2110**, a **Tektronix AFG1022**, and a **Tektronix TBS1052C** in Flagstaff, Arizona. All three are listed as available. They are open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as trained hands-on users.

| Instrument | Role | Key limit |
|---|---|---|
| Keithley 2110 | 5.5-digit DMM | 15 functions; USB / RS-232 / GPIB |
| Tektronix AFG1022 | 2-channel AFG | Sine to 25 MHz; 8k-point arbitrary |
| Tektronix TBS1052C | 2-channel DSO | 50 MHz, 1 GS/s, 20 kpoints |

Catalogue pages: [Keithley 2110](/About_Equipment/Keithley_2110.html), [AFG1022](/About_Equipment/Tektronix_AFG1022.html), [TBS1052C](/About_Equipment/Tektronix_TBS1052C.html). AFG sine bandwidth follows the Tektronix AFG1022 specification, not the AFG1000-series maximum.

## Sample requirements

- **Form.** A packaged part, a board, or a wired coupon. Not a bare wafer.
- **Connectors.** Banana, BNC, or clips. Say if you need 50 Ω termination.
- **Grounding.** Floating measurements on the DMM are not a substitute for a differential probe the scope does not have.

## Frequently asked questions

### What instruments are on the benchtop electrical stack?

Three. A Keithley 2110 5.5-digit multimeter for DC and AC voltage, current, and resistance. A Tektronix AFG1022 two-channel function generator. A Tektronix TBS1052C 50 MHz, 1 GS/s oscilloscope. They are the general-purpose bench, not a probe station and not a VNA.

### What is the difference between this bench and on-wafer probing?

Access. On-wafer probing contacts pads on a wafer up to 200 mm inside a shielded station, including RF. This bench takes leads, BNCs, and packaged parts. If the device is still a die on a wafer, start at the MPI TS200. If it is a board or a wired package, start here.

### How fast a sine can the AFG1022 generate?

Tektronix specifies the AFG1022 sine from 1 microhertz to 25 MHz. The catalogue line "up to 60 MHz (AFG1000 series)" is the AFG1062. This page uses 25 MHz for the installed AFG1022. Square is specified to 12.5 MHz. Arbitrary waveforms are 2 to 8,192 points.

### Why can I not see a 100 MHz clock on the oscilloscope?

Bandwidth. The TBS1052C is specified at 50 MHz and 1 GS/s, 20 kpoints, two channels. A 100 MHz edge is outside that analogue bandwidth. The sample rate is not the bandwidth. Use a faster scope, or the VNA, for faster signals.

### Can external companies use the benchtop instruments at NAU?

Yes. The three instruments are listed as available. They are open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as trained hands-on users, in Flagstaff, Arizona.

## Request time on these instruments

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve an instrument](/Reserve_Equipment.html){ .md-button }
