---
title: Environmental Stress Testing
description: Temperature and humidity cycling from -68 to +190 C on a CSZ MicroClimate benchtop chamber at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Reliability
  - Electronics
schema:
  - "@type": DefinedTerm
    name: Environmental Stress Testing
    alternateName: Temperature and Humidity Cycling
    description: >-
      A reliability test method in which a component or assembly is held at, or cycled between,
      controlled temperature and humidity conditions in order to provoke failures that appear
      only after thermal or moisture stress.
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
    name: Temperature and Humidity Cycling for Reliability Testing
    serviceType: Reliability testing
    description: >-
      Steady-state soak, thermal cycling, and combined temperature-humidity exposure of
      electronics, materials, and small assemblies in a programmable benchtop chamber, from
      minus 68 to plus 190 degrees Celsius.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: CSZ MicroClimate MCBH-1.2
    category: Benchtop Temperature and Humidity Test Chamber
    url: https://nano.nau.edu/About_Equipment/CSZ_EnvChamber.html
    manufacturer:
      "@type": Organization
      name: Cincinnati Sub-Zero, Weiss Technik North America
    additionalProperty:
      - "@type": PropertyValue
        name: Workspace volume
        value: 1.2 cubic feet, 34 litres
      - "@type": PropertyValue
        name: Interior dimensions
        value: 16 by 11 by 12 inches, 40.6 by 28 by 30 cm
      - "@type": PropertyValue
        name: Temperature range
        value: Minus 68 to plus 190 degrees Celsius, cascade refrigeration
      - "@type": PropertyValue
        name: Humidity range
        value: 10 to 98 percent relative humidity
      - "@type": PropertyValue
        name: Control stability
        value: Plus or minus 0.5 degrees Celsius
      - "@type": PropertyValue
        name: Cooling performance
        value: From 24 to minus 40 degrees Celsius in 25 minutes; to minus 68 degrees Celsius in 60 minutes, empty chamber
      - "@type": PropertyValue
        name: Heating performance
        value: From 24 to plus 94 degrees Celsius in 10 minutes; to plus 190 degrees Celsius in 35 minutes, empty chamber
      - "@type": PropertyValue
        name: Live load capacity
        value: 175 W at minus 40 degrees Celsius; 100 W at minus 54 degrees Celsius
      - "@type": PropertyValue
        name: Controller
        value: CSZ EZT-430S touchscreen
      - "@type": PropertyValue
        name: Profiles
        value: Unlimited profiles, up to 64 steps each, with up to 3 events per loop
      - "@type": PropertyValue
        name: Electrical requirement
        value: 115 V with 20 A minimum service, or 230 V with 16 A minimum service, single phase

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: How cold can a benchtop environmental chamber get?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A single-stage benchtop chamber typically reaches about minus 30 degrees Celsius.
            Going lower requires cascade refrigeration, in which one refrigeration circuit
            cools the condenser of a second. The MicroClimate MCBH-1.2 at MPaCT is a cascade
            unit and reaches minus 68 degrees Celsius, taking about 60 minutes to get there
            from room temperature with an empty chamber.
      - "@type": Question
        name: What is the difference between an environmental chamber and a laboratory oven?
        acceptedAnswer:
          "@type": Answer
          text: >-
            An oven only heats, and it cools by switching off. An environmental chamber has
            active refrigeration and active humidity control, so it can hold a setpoint below
            ambient, ramp between setpoints at a controlled rate, and maintain a specified
            relative humidity. That difference is what allows cycling and accelerated aging
            tests; an oven can only bake or cure.
      - "@type": Question
        name: How much heat can my device dissipate inside the chamber?
        acceptedAnswer:
          "@type": Answer
          text: >-
            This is the live load capacity, and it falls as the setpoint falls because the
            refrigeration system is working against both the chamber walls and your device.
            For the MCBH-1.2 the published capacity is 175 watts at minus 40 degrees Celsius
            and 100 watts at minus 54 degrees Celsius. A device dissipating more than this
            will keep the chamber from reaching its setpoint, which is the most common reason
            a cold soak fails to stabilise.
      - "@type": Question
        name: Why did my chamber fail to reach its setpoint?
        acceptedAnswer:
          "@type": Answer
          text: >-
            In roughly this order of likelihood: the device under test is dissipating more
            power than the live load capacity at that temperature; the ramp rate programmed is
            faster than the chamber can achieve with a loaded workspace; the chamber is packed
            so tightly that air cannot circulate; or a port is open. Published performance
            figures are for an empty chamber at 60 Hz and a 24 degree Celsius ambient, and a
            loaded chamber will always be slower.
---

# Environmental Stress Testing

Environmental stress testing exposes a component or assembly to controlled temperature and humidity over time, to provoke failures that appear only after thermal cycling or moisture ingress. A programmable chamber holds a setpoint, ramps between setpoints, or runs a multi-step profile, so that months of field exposure can be compressed into days of laboratory time.

## How environmental stress testing works

Most field failures in electronics and packaged assemblies are not caused by a single extreme condition. They are caused by repetition. Materials with different coefficients of thermal expansion are bonded together - silicon to solder, solder to copper, copper to laminate - and every temperature excursion strains those interfaces slightly. Strain accumulates as fatigue, and fatigue eventually cracks a joint that would survive any single cycle indefinitely.

A test chamber applies that mechanism deliberately, through three modes:

- **Steady state.** The chamber holds one temperature, and optionally one relative humidity, for a long soak. This is how moisture uptake, drift, and slow chemical degradation are measured.
- **Thermal cycling.** The chamber ramps between two setpoints repeatedly. Cycle count, dwell time, and ramp rate are the variables, and each cycle applies one increment of fatigue to every interface in the sample.
- **Combined temperature and humidity.** Heat accelerates chemical processes; moisture supplies the reactant and the conduction path. Together they drive corrosion, delamination, and surface-insulation-resistance failures that neither produces alone.

Humidity control below ambient dew point requires both directions of control. A steam generator raises humidity; a refrigerated coil condenses moisture out to lower it. Reaching low temperatures requires **cascade refrigeration**, where one refrigeration circuit cools the condenser of a second, because a single stage cannot span room temperature to −68 °C.

## When to use environmental stress testing

- Thermal cycling of printed circuit assemblies to find solder joint fatigue
- Verifying that a sensor, or a whole instrument, holds calibration across its rated range
- Accelerated aging of coatings, adhesives, polymers, and encapsulants
- Measuring moisture uptake and dimensional change in a material
- Screening a batch before deployment, to precipitate infant-mortality failures
- Qualifying a design against a temperature-humidity profile from a standard or a customer specification

## What environmental stress testing cannot do

- **It is not thermal shock.** Shock testing transfers a sample between two conditioned zones in seconds. A single chamber ramps, and the ramp is limited by the refrigeration system and by the mass inside.
- **Acceleration factors are model-dependent.** Converting cycles in a chamber into years in the field requires an assumed model. The chamber supplies the cycles, not the extrapolation.
- **Live load limits what may be powered inside.** See the FAQ; a device dissipating more than the chamber can remove will prevent the setpoint being reached.
- **The workspace is 1.2 cubic feet.** This is a benchtop chamber for components and small assemblies, not for whole systems.
- **It does not identify the failure.** The chamber produces a failed part. Locating the crack takes [scanning electron microscopy](scanning-electron-microscopy.md) or cross-sectioning.

## The MicroClimate chamber at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **CSZ MicroClimate MCBH-1.2** benchtop temperature and humidity chamber in Flagstaff, Arizona. Cascade refrigeration takes it to −68 °C in a 1.2 cubic foot workspace that sits on a bench rather than requiring floor space and three-phase power.

The EZT-430S controller stores an unlimited number of profiles of up to 64 steps each, logs data with digital signatures and audit trails, and can be monitored remotely over the network - which matters for a test that runs for a week.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Workspace volume | 1.2 ft³ (34 L) |
| Interior dimensions | 16 × 11 × 12 in (40.6 × 28 × 30 cm) |
| Exterior dimensions | 37 × 32 × 28 in (94 × 81 × 71 cm) |
| Temperature range | −68 to +190 °C (cascade) |
| Humidity range | 10–98 % RH |
| Control stability | ±0.5 °C |
| Live load capacity | 175 W at −40 °C |
| Controller | CSZ EZT-430S touchscreen |
| Profiles | Unlimited, up to 64 steps each |
| Electrical | 115 V / 230 V single phase |

Temperature range, humidity range, stability, volume, and live-load rating follow the [equipment catalogue](/About_Equipment/CSZ_EnvChamber.html).

[Full chamber specifications and booking &rarr;](/About_Equipment/CSZ_EnvChamber.html){ .md-button .md-button--primary }

## Sample requirements

- **Size.** Must fit a 16 × 11 × 12 inch workspace with clearance for air circulation on all sides. A packed chamber does not hold its setpoint.
- **Powered devices.** State the dissipated power and the lowest setpoint you need. A 2-inch access port with plug is fitted for instrumentation cabling.
- **Materials.** Nothing that outgasses corrosively, or that melts or ignites within the programmed range.
- **Humidity testing.** Only if the sample tolerates condensation, which will occur on any surface below the chamber dew point.
- **Test definition.** Bring the profile: setpoints, ramp rates, dwell times, cycle count, and the pass criterion. If the test comes from a published standard, name it.

## Frequently asked questions

### How cold can a benchtop environmental chamber get?

A single-stage benchtop chamber typically reaches about −30 °C. Going lower requires cascade refrigeration, in which one refrigeration circuit cools the condenser of a second. The MicroClimate MCBH-1.2 at MPaCT is a cascade unit and reaches −68 °C, taking about 60 minutes to get there from room temperature with an empty chamber.

### What is the difference between an environmental chamber and a laboratory oven?

An oven only heats, and it cools by switching off. An environmental chamber has active refrigeration and active humidity control, so it can hold a setpoint below ambient, ramp between setpoints at a controlled rate, and maintain a specified relative humidity. That difference is what allows cycling and accelerated aging tests; an oven can only bake or cure.

### How much heat can my device dissipate inside the chamber?

This is the live load capacity, and it falls as the setpoint falls because the refrigeration system is working against both the chamber walls and your device. For the MCBH-1.2 the published capacity is 175 watts at −40 °C and 100 watts at −54 °C. A device dissipating more than this will keep the chamber from reaching its setpoint, which is the most common reason a cold soak fails to stabilise.

### Why did my chamber fail to reach its setpoint?

In roughly this order of likelihood: the device under test is dissipating more power than the live load capacity at that temperature; the ramp rate programmed is faster than the chamber can achieve with a loaded workspace; the chamber is packed so tightly that air cannot circulate; or a port is open. Published performance figures are for an empty chamber at 60 Hz and a 24 °C ambient, and a loaded chamber will always be slower.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
