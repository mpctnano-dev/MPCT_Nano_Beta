---
title: Die Attach and Wire Bonding
description: Die attach and thermosonic gold wire bonding for prototype packaging at NAU's MPaCT Lab in Flagstaff, Arizona, on Tresky and West-Bond tools.
tags:
  - Fabrication
  - Packaging
schema:
  - "@type": DefinedTerm
    name: Die Attach
    alternateName: Die Bonding
    description: >-
      The process of placing a semiconductor die onto a substrate or package and joining it
      with adhesive, eutectic solder, or thermocompression, establishing mechanical support
      and, where required, a thermal or electrical path to the package.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": DefinedTerm
    name: Thermosonic Wire Bonding
    alternateName: Wire Bonding
    description: >-
      A packaging process that joins a fine gold wire to a die pad and then to a package
      lead using ultrasonic energy and heat, forming a metallurgical bond without melting
      the wire.
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
    name: Die Attach and Gold Wire Bonding
    serviceType: Microelectronic packaging
    description: >-
      Manual die placement and thermosonic gold wire bonding for prototype and R&D
      packaging, including adhesive die attach, optional flip-chip placement, and
      ball-wedge interconnects.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Tresky T-4909-AE
    category: Manual die bonder
    url: https://nano.nau.edu/About_Equipment/Tresky_DieBonder.html
    manufacturer:
      "@type": Organization
      name: Dr. Tresky AG
    additionalProperty:
      - "@type": PropertyValue
        name: Placement accuracy
        value: Plus or minus 10 micrometres, operator and process dependent
      - "@type": PropertyValue
        name: Bond force
        value: 20 g to 1000 g, programmable
      - "@type": PropertyValue
        name: Stage travel
        value: 180 by 180 mm, manual air-cushioned
      - "@type": PropertyValue
        name: Z travel
        value: 95 mm
      - "@type": PropertyValue
        name: Spindle rotation
        value: 360 degrees unlimited

  - "@type": IndividualProduct
    name: West-Bond 7700D
    category: Manual thermosonic ball-wedge wire bonder
    url: https://nano.nau.edu/About_Equipment/WestBond_WireBonder.html
    manufacturer:
      "@type": Organization
      name: West-Bond
    additionalProperty:
      - "@type": PropertyValue
        name: Bonding method
        value: Thermosonic ball-wedge
      - "@type": PropertyValue
        name: Wire
        value: Gold, 0.7 to 2.0 mils (18 to 50 micrometres)
      - "@type": PropertyValue
        name: Bond force
        value: 18 to 90 g, dual preset
      - "@type": PropertyValue
        name: Transducer
        value: 63 kHz nominal, 5 W dual channel
      - "@type": PropertyValue
        name: Throat reach
        value: 5.125 in
      - "@type": PropertyValue
        name: Z tool range
        value: 0.5 in

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is the difference between die bonding and wire bonding?
        acceptedAnswer:
          "@type": Answer
          text: >-
            They are consecutive steps, not alternatives. Die attach places the chip on
            the package or substrate and joins it with adhesive, a eutectic, or
            thermocompression. Wire bonding then connects the die pads to the package
            leads with gold wire. A packaged prototype usually needs both. Flip-chip
            is the exception: the electrical joints are made at attach, and wire bonding
            is not used.
      - "@type": Question
        name: What wire does the West-Bond 7700D use?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Gold wire from 0.7 to 2.0 mils in diameter, which is 18 to 50 micrometres.
            Bonds are ball-to-wedge: a ball on the die pad, a wedge on the lead, made
            with ultrasonic energy and workpiece heat. Aluminium, copper, and silver
            wire are not the standard process on this machine; West-Bond's published
            application for the 7700D series is gold.
      - "@type": Question
        name: How accurately can the Tresky place a die?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Plus or minus 10 micrometres in the standard manual process, stated by
            Tresky as operator- and process-dependent. A flip-chip alignment option is
            specified at plus or minus 5 micrometres. This is a research and prototype
            bonder, not a high-speed production machine; the value of the T-4909-AE is
            changeover time and the 95 mm Z stroke for cavities and stacked die, not
            units per hour.
      - "@type": Question
        name: Do I need both machines for a packaged device?
        acceptedAnswer:
          "@type": Answer
          text: >-
            For a conventional die-in-package, yes: attach the die, then wire-bond the
            pads. If the device is already packaged, neither machine is the next step;
            inspection and failure analysis are. If the interconnect is flip-chip,
            the Tresky can place the die and the West-Bond is not in the path, unless
            you also need stud bumps, which the 7700D can form in bump mode.
---

# Die Attach and Wire Bonding

Die attach places a semiconductor die onto a substrate or package and joins it mechanically. Wire bonding then connects the die pads to the package leads with a fine gold wire, using ultrasonic energy and heat rather than solder. Together they are the packaging sequence for a prototype device: the chip becomes a part that can be probed, socketed, or put into a system.

## How die attach and wire bonding work

### Die attach

The die is picked from a waffle pack or gel pack, aligned to the substrate, and set down under a controlled force. The joint is one of three kinds:

- **Adhesive.** Epoxy or sinter paste is dispensed or stamped, the die is placed, and the adhesive is cured. This is the default for R&D because it is forgiving of pad metallisation.
- **Eutectic.** A gold-based or other eutectic preform melts and solidifies as a metallic joint. It needs heat and a compatible metallisation.
- **Flip-chip.** The die is inverted and the electrical joints are made at attach, through bumps or pillars, so wire bonding is not the interconnect.

Tresky's True Vertical Technology keeps the pickup spindle perpendicular to the stage at any bond height, so the die stays parallel to the substrate in a cavity or on a stacked die, not only on a flat package.

### Wire bonding

On a **ball-wedge** thermosonic bonder, gold wire is fed through a capillary. An electronic flame-off forms a ball. The first bond is that ball, ultrasonically welded to the die pad with heat in the workpiece. The tool then moves to the lead and makes a crescent **wedge** bond, and the wire is torn to start the next cycle.

Ultrasonic energy breaks surface oxides and drives solid-state diffusion; the wire is not melted as a solder joint is. The process is local. The rest of the die sees the stage temperature, typically in the 100–150 °C range on a heated workholder, not a reflow profile.

## When to use die attach and wire bonding

- Packaging a bare die so it can be probed, socketed, or mounted on a board
- Building a hybrid or multi-chip module on a ceramic or laminate substrate
- Repairing or replacing a wire on a prototype
- Forming gold stud bumps for a later flip-chip attach
- MEMS, optoelectronic, and sensor assemblies where solder is too coarse or too hot
- Teaching and process development, where changeover time matters more than throughput

## What die attach and wire bonding cannot do

- **They are not board-level assembly.** A packaged part still has to be soldered or socketed onto a PCB. That is a different process, on different equipment.
- **They are not production throughput.** Both machines at MPaCT are manual. Cycle time is set by the operator, not by a vision system running a thousand units an hour.
- **Wire bonding needs bondable metallisation.** Aluminium or gold pads on the die, and a gold or gold-plated lead, are the standard. An oxidised copper pad, a dirty surface, or a pad smaller than the ball will not bond.
- **The West-Bond 7700D is specified for gold wire.** 0.7 to 2.0 mil (18–50 µm). Aluminium wedge bonding and copper wire are different machines or different options, not the published 7700D application.
- **Placement accuracy is not lithography.** ±10 µm is enough for most prototype packages and is not a flip-chip-on-fine-pitch production spec without the alignment option and a capable process.

## Die attach and wire bonding at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University runs a **Tresky T-4909-AE** manual die bonder and a **West-Bond 7700D** manual thermosonic ball-wedge wire bonder in Flagstaff, Arizona. A prototype can be attached and then wired in the same facility.

| | Tresky T-4909-AE | West-Bond 7700D |
|---|---|---|
| Role | Die attach, flip-chip placement | Gold wire interconnect |
| Process | Adhesive, eutectic (with heat option), flip-chip | Thermosonic ball-wedge |
| Key limit | ±10 µm placement, operator dependent | Gold wire 0.7–2.0 mil |
| Bond force | 20–1000 g, programmable | 18–90 g, dual preset |
| Work area | 180 × 180 mm stage; 95 mm Z | 5.125 in throat; 0.5 in Z tool range |
| Transducer | - | 63 kHz, 5 W dual channel |

Tresky figures are from the T-4909-AE datasheet (Accelonix / Tresky). West-Bond figures are from the 7700D series specification (West-Bond B7700D / 7700dspc): gold wire 0.7–2.0 mil, bond force 18–90 g, 63 kHz transducer, 5.125 in throat, 0.5 in Z range.

The machines are available to NAU researchers, external academic users, and industry partners. Access is arranged through a service request or the Lab Manager.

[Tresky T-4909-AE specifications](/About_Equipment/Tresky_DieBonder.html){ .md-button } [West-Bond 7700D specifications](/About_Equipment/WestBond_WireBonder.html){ .md-button }

## Sample requirements

- **Die.** In a waffle pack or gel pack if possible, with pad metallisation stated. A loose die in a vial is how pads get scratched.
- **Substrate or package.** Clean, with the attach area and lead metallisation identified. Cavities are acceptable on the Tresky; say the depth.
- **Wire.** Gold, 0.7–2.0 mil, unless staff specify otherwise. Bring the spool only if it is already qualified.
- **Drawings.** Pad layout, intended loop direction, and which pads must not be touched.
- **Handling.** ESD-safe packaging. These are unpackaged semiconductors.

## Frequently asked questions

### What is the difference between die bonding and wire bonding?

They are consecutive steps, not alternatives. Die attach places the chip on the package or substrate and joins it with adhesive, a eutectic, or thermocompression. Wire bonding then connects the die pads to the package leads with gold wire. A packaged prototype usually needs both. Flip-chip is the exception: the electrical joints are made at attach, and wire bonding is not used.

### What wire does the West-Bond 7700D use?

Gold wire from 0.7 to 2.0 mils in diameter, which is 18 to 50 micrometres. Bonds are ball-to-wedge: a ball on the die pad, a wedge on the lead, made with ultrasonic energy and workpiece heat. Aluminium, copper, and silver wire are not the standard process on this machine; West-Bond's published application for the 7700D series is gold.

### How accurately can the Tresky place a die?

Plus or minus 10 micrometres in the standard manual process, stated by Tresky as operator- and process-dependent. A flip-chip alignment option is specified at plus or minus 5 micrometres. This is a research and prototype bonder, not a high-speed production machine; the value of the T-4909-AE is changeover time and the 95 mm Z stroke for cavities and stacked die, not units per hour.

### Do I need both machines for a packaged device?

For a conventional die-in-package, yes: attach the die, then wire-bond the pads. If the device is already packaged, neither machine is the next step; inspection and failure analysis are. If the interconnect is flip-chip, the Tresky can place the die and the West-Bond is not in the path, unless you also need stud bumps, which the 7700D can form in bump mode.

## Request time on these instruments

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve an instrument](/Reserve_Equipment.html){ .md-button }
