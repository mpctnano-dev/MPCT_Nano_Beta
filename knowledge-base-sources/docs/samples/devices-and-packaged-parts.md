---
title: Devices and Packaged Parts
description: How to inspect, package, or fail-analyse a device at NAU's MPaCT Lab in Flagstaff, Arizona, from die attach through wire bond and surface analysis.
tags:
  - Sample Type
  - Packaging
schema:
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
    name: Device and Package Characterization
    serviceType: Microelectronic packaging and failure analysis
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/Contact_Us.html?category=equipment
---

# Devices and Packaged Parts

You have a die, a packaged chip, a board-level assembly, or a part that already failed, and you need the next measurement or the next packaging step. This page is organised by what you are holding, not by which machine is free.

## What can be done, and with what

| You have | Your question | Method | Instrument |
|---|---|---|---|
| A bare die and a package | How do I attach it? | [Die attach](../techniques/die-and-wire-bonding.md) | Tresky T-4909-AE |
| A die already attached | How do I connect the pads? | [Wire bonding](../techniques/die-and-wire-bonding.md) | West-Bond 7700D |
| A packaged device that failed | What does the surface look like? | [SEM](../techniques/scanning-electron-microscopy.md) | JEOL JSM-IT710HR |
| A packaged device that failed | What is this contamination? | SEM-EDS | JEOL JSM-IT710HR |
| A film or implant in the stack | What is at what depth? | [SIMS](../techniques/secondary-ion-mass-spectrometry.md) | Hiden SIMS Workstation |
| A crystalline layer in the stack | What phase is it? | [XRD](../techniques/x-ray-diffraction.md) | Rigaku SmartLab |
| A bond wire or fracture surface | What is the morphology? | SEM | JEOL JSM-IT710HR |
| A device that must survive heat or humidity | Will this package still work after stress? | [Environmental stress testing](../techniques/environmental-stress-testing.md) | CSZ MicroClimate |
| A wafer or die with open pads | What are the I–V or RF numbers before packaging? | [On-wafer probing](../techniques/on-wafer-probing.md) | MPI TS200 |
| A wafer that needs a device pattern | How do I transfer a mask into resist? | [Photolithography](../techniques/photolithography.md) | SUSS MJB4 |
| A board that needs traces, not a package | How do I prototype the PCB? | [Conductive ink](../techniques/conductive-ink-pcb-printing.md) or [laser structuring](../techniques/laser-micromachining.md) | Voltera V-One, LPKF ProtoLaser R4 |
| A packaged part that needs a photo | What does it look like in colour? | [Digital microscopy](../techniques/digital-microscopy.md) | Keyence VHX-7000 |
| A connectorized RF part | What are the S-parameters? | [Vector network analysis](../techniques/vector-network-analysis.md) | Keysight E5063A |
| A discrete C, L, or R | How does Z change with frequency? | [Impedance analysis](../techniques/impedance-analysis.md) | Keysight E4990A |
| A device that must be measured cold | Transport or optics at a few kelvin? | [Cryogenic measurement](../techniques/cryogenic-measurement.md) | Montana CryoAdvance 50 |
| A thermoelectric bar | What are S and ρ versus temperature? | [Seebeck and resistivity](../techniques/seebeck-and-resistivity.md) | LINSEIS LSR-3 |
| A wired board on the bench | Voltage, current, or a waveform? | [Benchtop electrical](../techniques/benchtop-electrical-measurement.md) | Keithley 2110, AFG1022, TBS1052C |

## Decide in this order

1. **Is it still a die, or is it already a part?** A bare die goes to attach and wire bond. A packaged part goes to inspection or stress. Mixing those paths is how a working device is sputtered or a loose die is put in the SEM without a holder.
2. **Must the part be returned working?** SIMS consumes the analysed patch. TEM consumes the specimen. SEM usually does not, if you skip coating. Say so before the technique is chosen.
3. **Is the question electrical, structural, or chemical?** Electrical contact is packaging or a probe station. Structure of a fracture is SEM. Chemistry of a residue is SEM-EDS first, SIMS if the residue is a trace.
4. **Is the interconnect solder or gold wire?** Wire bonding is die-to-package. Solder is board-level. They are not substitutes.

## Practical notes by what you brought

**Bare die.** ESD packaging, pad metal stated, waffle pack preferred. Attach first, wire bond second, then inspect. Do not SEM a loose die that still has to be packaged unless you accept that it may be coated or contaminated.

**Open package or hybrid.** SEM of the wires and die surface is usually the first look. Do not coat if you still need to bond. Low-vacuum SEM avoids coating on many insulators.

**Failed closed package.** Decapsulation is not documented as a technique here. If the lid cannot come off, the useful measurements are external: environmental stress, and then whatever becomes visible after the package is opened by staff.

**Film-on-die or implant.** That is a [thin film](thin-films.md) question that happens to live on a device. XRD and SIMS still need a coupon that fits the holder. A 5 mm die may be too small for a standard XRD scan and too precious for a SIMS crater. Staff will say which.

**Board with a chip on it.** Packaging is already done. The next questions are solder joints, traces, and the die only if the package is opened. PCB prototype traces are Voltera or LPKF, not the wire bonder.

## What to send

- What it is: die, open package, closed package, board, or unknown failed part
- Whether it must be returned working, returned at all, or may be consumed
- Pad and lead metallisation, if you know it
- The failure, if there is one: open, short, drift, cracked, contaminated
- The decision the work will inform, which is what chooses packaging versus analysis

## Device work in Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds die attach, gold wire bonding, field-emission SEM with EDS, SIMS, XRD, and environmental stress testing in one building in Flagstaff, Arizona. A prototype can move from bare die to wired package to inspected failure as a single project, without shipping between facilities.

The lab is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Discuss a device or packaging project](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
