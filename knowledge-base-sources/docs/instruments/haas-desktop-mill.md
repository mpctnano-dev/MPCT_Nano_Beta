---
title: Haas Desktop Mill
description: A 3-axis benchtop CNC mill with a full Haas control, 15,000 rpm ER11 spindle, for CNC training at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Fabrication
  - Education
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
    name: CNC Milling Instruction and Benchtop Prototyping
    serviceType: Education and fabrication
    description: >-
      Hands-on instruction in G-code programming and CNC mill operation on an industry-standard
      Haas control, and benchtop machining of plastics and machinable wax.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/Contact_Us.html?category=equipment

  - "@type": IndividualProduct
    name: Haas Desktop Mill
    category: Benchtop 3-Axis CNC Milling Machine
    url: https://nano.nau.edu/About_Equipment/Haas_DesktopMill.html
    manufacturer:
      "@type": Organization
      name: Haas Automation
    additionalProperty:
      - "@type": PropertyValue
        name: Axis travels
        value: X 6.00 in (152 mm), Y 10.00 in (254 mm), Z 3.00 in (76 mm)
      - "@type": PropertyValue
        name: Spindle nose to table
        value: 3.2 in (80 mm) maximum
      - "@type": PropertyValue
        name: Spindle speed
        value: 15,000 rpm maximum; must not be run below 1,500 rpm
      - "@type": PropertyValue
        name: Spindle drive
        value: Integral spindle and motor
      - "@type": PropertyValue
        name: Tool interface
        value: ER11 collet, single tool, manual change
      - "@type": PropertyValue
        name: Table size
        value: 18.1 by 10.6 in (460 by 270 mm)
      - "@type": PropertyValue
        name: T-slots
        value: Six slots, 0.390 in (10 mm) wide, 1.77 in (45 mm) centres
      - "@type": PropertyValue
        name: Maximum cutting feed and rapids
        value: 140 ipm (3.6 m/min) on all axes
      - "@type": PropertyValue
        name: Power requirement
        value: 110 VAC at 15 A, or 220 VAC at 9 A
      - "@type": PropertyValue
        name: Connectivity
        value: Ethernet and WiFi

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What materials can the Haas Desktop Mill cut?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Plastics and machinable wax. Haas designed and rates the machine for these
            materials, and its 1-tool ER11 spindle, absence of coolant, and benchtop rigidity
            are matched to them. Metals are outside the machine's rating and are not run on it.
            Aluminium and harder materials are jobs for a full-size vertical machining centre,
            not a desktop training mill.
      - "@type": Question
        name: Is the Desktop Mill control the same as an industrial Haas machine?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes, and that is the entire point of the machine. It runs a full-function Haas CNC
            control in a portable simulator enclosure, so the keypad layout, the setup
            procedure, the offsets, and the G-code are identical to a production Haas mill.
            A student who can set up a job here can set one up on a VF-series machine without
            relearning the interface.
      - "@type": Question
        name: Why must the spindle not run below 1,500 rpm?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Because the integral spindle motor relies on its own rotation for cooling. Below
            1,500 rpm it generates heat faster than it sheds it, and Haas warns explicitly
            that running slower will cause the spindle to overheat. In practice this sets the
            floor for surface speed, and it is why large-diameter tooling and slow finishing
            passes are not appropriate on this machine.
---

# Haas Desktop Mill

The Haas Desktop Mill is a 3-axis benchtop CNC milling machine that runs a full-function Haas control in a portable enclosure. Travels are 6 × 10 × 3 inches, the spindle reaches 15,000 rpm through an ER11 collet, and the machine runs from a standard wall outlet. It is rated for plastics and machinable wax, and it exists to teach CNC programming on the same control found on production machines.

## What it is for

CNC instruction has a recurring problem: the machines students most need to learn are the ones a department can least afford to have crashed. The Desktop Mill resolves it by keeping the part that matters pedagogically - the control - identical to industry, while removing the parts that make mistakes expensive.

What is retained:

- **A full Haas CNC control.** The same interface, offsets, work coordinate system, tool table, and G-code as a production Haas mill.
- **Real three-axis motion** with real feeds and rapids, so feed and speed decisions have real consequences on surface finish.
- **Standard setup workflow.** Workholding, tool length offsets, and part zero are established the same way as on a VMC.

What is removed:

- Metal cutting, coolant, three-phase power, an automatic tool changer, and a machine footprint that requires floor space.

A CNC pen holder converts the machine into a plotter, which allows a toolpath to be proofed on paper before it is cut. For a teaching machine that is a genuinely useful mode, not a novelty.

For the method itself - how milling and turning differ, what a setup requires, and where chatter comes from - see [CNC Machining](../techniques/cnc-machining.md). For choosing between machining and printing, see [3D printing vs CNC machining](../compare/3d-printing-vs-cnc-machining.md).

## When to use it

- Teaching G-code programming and CNC mill operation
- Proofing a toolpath with a pen before committing it to material
- Machining fixtures, jigs, and sample holders from plastic
- Cutting machinable wax patterns
- Finishing a critical face or bore on a 3D printed part from the [Bambu Lab H2D](bambu-lab-h2d.md)
- Classroom demonstrations and outreach

## What it cannot do

- **It does not cut metal.** Haas rates the machine for plastics and machinable wax.
- **Travels are 6 × 10 × 3 inches.** Anything larger needs a different machine.
- **One tool at a time.** No tool changer; multi-tool jobs require manual changes and re-established offsets.
- **No coolant or compressed air.** Which limits chip evacuation and heat management on deeper cuts.
- **Spindle floor of 1,500 rpm.** Large-diameter tooling and slow passes are not available.
- **Educational access only.** This instrument cannot be independently reserved.

## The Desktop Mill at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Haas Desktop Mill** in Flagstaff, Arizona as part of its instructional equipment. It is reserved for educational use and is not available for independent reservation; access is arranged through the Lab Manager.

| Specification | Value |
|---|---|
| Axis travels (X/Y/Z) | 6.00 × 10.00 × 3.00 in (152 × 254 × 76 mm) |
| Spindle nose to table | 3.2 in (80 mm) max |
| Spindle speed | 15,000 rpm max (do not run below 1,500 rpm) |
| Spindle drive | Integral spindle/motor |
| Tool interface | ER11 collet |
| Tool capacity | 1, manual change |
| Table size | 18.1 × 10.6 in (460 × 270 mm) |
| T-slots | 6 slots, 0.390 in (10 mm) wide, 1.77 in (45 mm) centres |
| Max cutting feed | 140 ipm (3.6 m/min) |
| Rapids (X/Y/Z) | 140 ipm (3.6 m/min) |
| Power requirement | 110 VAC @ 15 A, or 220 VAC @ 9 A |
| Connectivity | Ethernet and WiFi |
| Rated materials | Plastics and machinable wax |

Specifications are as published by Haas Automation for the Desktop Mill.

[Full Desktop Mill specifications &rarr;](/About_Equipment/Haas_DesktopMill.html){ .md-button .md-button--primary }

## Access

This instrument is reserved for educational purposes and cannot be independently reserved. Course instructors and students should arrange access through the Lab Manager. See also the [Haas Desktop Lathe](haas-desktop-lathe.md), which pairs with it for turning instruction.

## Frequently asked questions

### What materials can the Haas Desktop Mill cut?

Plastics and machinable wax. Haas designed and rates the machine for these materials, and its 1-tool ER11 spindle, absence of coolant, and benchtop rigidity are matched to them. Metals are outside the machine's rating and are not run on it. Aluminium and harder materials are jobs for a full-size vertical machining centre, not a desktop training mill.

### Is the Desktop Mill control the same as an industrial Haas machine?

Yes, and that is the entire point of the machine. It runs a full-function Haas CNC control in a portable simulator enclosure, so the keypad layout, the setup procedure, the offsets, and the G-code are identical to a production Haas mill. A student who can set up a job here can set one up on a VF-series machine without relearning the interface.

### Why must the spindle not run below 1,500 rpm?

Because the integral spindle motor relies on its own rotation for cooling. Below 1,500 rpm it generates heat faster than it sheds it, and Haas warns explicitly that running slower will cause the spindle to overheat. In practice this sets the floor for surface speed, and it is why large-diameter tooling and slow finishing passes are not appropriate on this machine.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
