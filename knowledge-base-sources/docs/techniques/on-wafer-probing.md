---
title: On-Wafer Probing (Probe Station)
description: On-wafer probing measures I-V, C-V, and RF on wafers up to 200 mm on an MPI TS200 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Electrical Test
  - Semiconductors
schema:
  - "@type": DefinedTerm
    name: On-Wafer Probing
    alternateName: Probe Station Measurement
    description: >-
      An electrical characterization method in which needle or RF probes contact pads
      on a bare die or wafer so that current, voltage, capacitance, or high-frequency
      parameters can be measured before the device is packaged.
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
    name: On-Wafer Electrical Probing
    serviceType: Electrical characterization
    description: >-
      Manual DC, RF, and millimeter-wave probing of semiconductor devices on fragments
      through 200 mm wafers, including heated-chuck measurements from ambient to 300
      degrees Celsius.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: MPI TS200
    category: Manual wafer probe system
    url: https://nano.nau.edu/About_Equipment/MPI_TS200.html
    manufacturer:
      "@type": Organization
      name: MPI
    additionalProperty:
      - "@type": PropertyValue
        name: Wafer size
        value: Up to 200 mm (8 inch)
      - "@type": PropertyValue
        name: Temperature range
        value: Ambient to 300 degrees Celsius
      - "@type": PropertyValue
        name: Stage travel
        value: 205 by 205 millimetres
      - "@type": PropertyValue
        name: Chuck Z-stroke
        value: 10 millimetres
      - "@type": PropertyValue
        name: Chuck planarity
        value: Less than 10 micrometres across 200 mm
      - "@type": PropertyValue
        name: Microscope travel
        value: 50 by 50 millimetres with Z-lift
      - "@type": PropertyValue
        name: Measurement types
        value: DC, RF, and millimeter-wave

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is on-wafer probing?
        acceptedAnswer:
          "@type": Answer
          text: >-
            On-wafer probing contacts pads on a bare die or wafer with needle or RF
            probes so the device can be measured electrically before it is packaged.
            A probe station holds the wafer, aligns the probes under a microscope, and
            provides a stable, often shielded, platform. The meters, sources, and
            network analysers are separate instruments that connect through the probes.
            The station is the contact; it is not itself the analyser.
      - "@type": Question
        name: What is the difference between on-wafer probing and packaged device testing?
        acceptedAnswer:
          "@type": Answer
          text: >-
            On-wafer probing measures the die or the wafer as fabricated, through
            micro-probes on the pads. Packaged testing measures a bonded, encapsulated
            part through a socket or a board. Wafer probing gives earlier feedback and
            avoids package parasitics; it also leaves probe marks and requires accessible
            pads. If the question is the packaged product, including bond wires and the
            moulding, packaged test is the measurement. If the question is the device
            before assembly, probe it.
      - "@type": Question
        name: What wafer size does the MPI TS200 accept?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Substrates from small fragments up to 200 mm (8 inch) wafers. The chuck is
            200 mm. Stage travel is 205 by 205 mm, with a 10 mm Z-stroke for loading
            and chuck planarity listed as less than 10 µm across 200 mm. Pieces that
            sit on the chuck and can be vacuum-held or otherwise secured are in family;
            a substrate larger than 200 mm is not.
      - "@type": Question
        name: Can the probe station measure RF and millimeter-wave devices?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The catalogue lists DC, RF, and millimeter-wave as capabilities of the TS200,
            with RF and mmWave probing described as S-parameter work on filters, antennas,
            and high-speed circuits using specialised RF probes. The station is the
            mechanical and shielded platform. A vector network analyser and the matching
            probes have to be part of the setup; they are not implied by the chuck size
            alone. Say the frequency range when you request time.
      - "@type": Question
        name: Why is my probe contact noisy or unstable?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Oxide or contamination on the pad, a probe that is not scrubbing through that
            film, vibration, light on a photosensitive junction, or an unshielded cable
            on a low-current measurement. The TS200's ShielDEnvironment is specified as
            EMI-shielded and light-tight for that last case. Thermal drift on a hot chuck
            also walks a contact. Clean pads, a controlled overtravel, and the shield
            closed are the usual first checks; a noisy trace is more often the contact
            and the environment than a failed instrument.
---

# On-Wafer Probing (Probe Station)

On-wafer probing is an electrical characterization method in which needle or RF probes contact pads on a bare die or wafer so that current, voltage, capacitance, or high-frequency parameters can be measured before the device is packaged. The probe station is the mechanical and shielded platform. The meters and analysers that take the data are separate instruments connected through those probes.

## How on-wafer probing works

The wafer or fragment sits on a chuck. A microscope finds the pads. Micro-positioners, magnetic or vacuum based, bring each probe down until it scrubs the pad metal and makes a contact. Independent X, Y, Z, and theta on the stage align the device under that set of probes.

What you measure depends on what is cabled:

- **DC.** Current–voltage and capacitance–voltage through low-noise cables. The catalogue describes this work as needing a shielded, light-tight environment for low-current measurements.
- **RF and millimeter-wave.** S-parameters and related high-frequency tests through RF probes, for filters, antennas, and high-speed circuits.
- **Thermal.** The same contacts with the chuck heated. The catalogue lists ambient to 300 °C as the standard range, and notes that the platform can be expanded to −60 °C. Expansion is not the installed default; the published range is ambient–300 °C.
- **Failure analysis.** Tracing a signal on an IC to a local short or open, with high-magnification optics.

The station's ShielDEnvironment is specified as EMI-shielded and light-tight. Close it when the current is small or the device is photosensitive. Leave it open and you are measuring the room as much as the die.

Probes mark pads. A probed die is not an unprobed die. That is expected, not a defect in the station.

## When to use on-wafer probing

- I–V or C–V of a transistor, diode, or test structure before packaging
- Checking a process monitor on a wafer or a cleaved piece
- RF or mmWave characterisation of a filter, antenna, or high-speed circuit on the substrate it was built on
- Temperature dependence of a device from ambient to 300 °C
- Debugging an IC node that is still accessible on the die
- Any electrical question that packaging would bury under bond-wire and socket parasitics

## What on-wafer probing cannot do

- **It is not packaged-device test.** Bond wires, moulding, and sockets are a different measurement. If the product is the package, probe the package, not the wafer.
- **The station is not the analyser.** DC sources, meters, and a VNA are separate catalogue instruments. Request the stack, not only the TS200.
- **It is not an automatic production prober.** The TS200 is a manual analytical station. Throughput is the operator, not a cassette and a map.
- **Pads have to be reachable.** A passivated die with no openings, a bump array the probes cannot land on, or a package that is already closed is the wrong sample.
- **−60 °C is listed as an expansion, not as the standard chuck.** Do not plan a cryogenic run from the ambient–300 °C specification.

## The TS200 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds an **MPI TS200** manual probe system in Flagstaff, Arizona. The catalogue specifies wafers up to 200 mm, stage travel of 205 × 205 mm, a 10 mm chuck Z-stroke, chuck planarity of less than 10 µm across 200 mm, microscope travel of 50 × 50 mm with Z-lift, and DC, RF, and millimeter-wave measurement types. The standard thermal range is ambient to 300 °C.

The equipment catalogue currently lists the TS200 as expected rather than available. Confirm live status on the [catalogue page](/About_Equipment/MPI_TS200.html) before planning a probing session; that page is the source of truth for whether the station is on the floor.

When the tool is in service it is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Wafer size | Up to 200 mm (8 in) |
| Temperature range | Ambient–300 °C (standard) |
| Stage travel | 205 × 205 mm |
| Chuck Z-stroke | 10 mm |
| Chuck planarity | <10 µm across 200 mm |
| Microscope travel | 50 × 50 mm with Z-lift |
| Platen | Steel or aluminium, high rigidity |
| Capabilities | DC, RF, and mmWave |

Figures follow the [equipment catalogue](/About_Equipment/MPI_TS200.html).

[Full TS200 specifications and booking &rarr;](/About_Equipment/MPI_TS200.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** A wafer up to 200 mm, or a fragment that can be held on the chuck. Loose bare die need a carrier; a die rattling on the chuck is how probes crash.
- **Pads.** Open, large enough to land, and with the metal stated. Draw the pad map. Say which pads are ground.
- **Passivation.** Openings must exist. A fully passivated circuit cannot be probed without a deprocess step that is not this station.
- **What you want measured.** I–V, C–V, S-parameters, or a temperature sweep. Frequency, voltage compliance, and current compliance belong in the request, because they choose the instruments on the other end of the cables.
- **Handling.** ESD-safe packaging. These are unpackaged semiconductors.

## Frequently asked questions

### What is on-wafer probing?

On-wafer probing contacts pads on a bare die or wafer with needle or RF probes so the device can be measured electrically before it is packaged. A probe station holds the wafer, aligns the probes under a microscope, and provides a stable, often shielded, platform. The meters, sources, and network analysers are separate instruments that connect through the probes. The station is the contact; it is not itself the analyser.

### What is the difference between on-wafer probing and packaged device testing?

On-wafer probing measures the die or the wafer as fabricated, through micro-probes on the pads. Packaged testing measures a bonded, encapsulated part through a socket or a board. Wafer probing gives earlier feedback and avoids package parasitics; it also leaves probe marks and requires accessible pads. If the question is the packaged product, including bond wires and the moulding, packaged test is the measurement. If the question is the device before assembly, probe it.

### What wafer size does the MPI TS200 accept?

Substrates from small fragments up to 200 mm (8 inch) wafers. The chuck is 200 mm. Stage travel is 205 by 205 mm, with a 10 mm Z-stroke for loading and chuck planarity listed as less than 10 µm across 200 mm. Pieces that sit on the chuck and can be vacuum-held or otherwise secured are in family; a substrate larger than 200 mm is not.

### Can the probe station measure RF and millimeter-wave devices?

The catalogue lists DC, RF, and millimeter-wave as capabilities of the TS200, with RF and mmWave probing described as S-parameter work on filters, antennas, and high-speed circuits using specialised RF probes. The station is the mechanical and shielded platform. A vector network analyser and the matching probes have to be part of the setup; they are not implied by the chuck size alone. Say the frequency range when you request time.

### Why is my probe contact noisy or unstable?

Oxide or contamination on the pad, a probe that is not scrubbing through that film, vibration, light on a photosensitive junction, or an unshielded cable on a low-current measurement. The TS200's ShielDEnvironment is specified as EMI-shielded and light-tight for that last case. Thermal drift on a hot chuck also walks a contact. Clean pads, a controlled overtravel, and the shield closed are the usual first checks; a noisy trace is more often the contact and the environment than a failed instrument.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
