---
title: Amatrol Smart Robot Workcell
description: A FANUC LR Mate 200iD/4S six-axis robot training cell, 550 mm reach and 4 kg payload, at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Education
  - Robotics
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
    name: Industrial Robot Programming Instruction
    serviceType: Education
    description: >-
      Course-based hands-on instruction in six-axis industrial robot operation, teach pendant
      programming, motion sequencing, cell integration, and fault troubleshooting on a
      production-grade FANUC robot in a guarded workcell.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/Contact_Us.html?category=equipment

  - "@type": IndividualProduct
    name: FANUC LR Mate 200iD/4S
    category: Six-Axis Industrial Robot
    url: https://nano.nau.edu/About_Equipment/Amatrol_SmartRobot_Workcell.html
    manufacturer:
      "@type": Organization
      name: FANUC
    additionalProperty:
      - "@type": PropertyValue
        name: Controlled axes
        value: 6
      - "@type": PropertyValue
        name: Payload
        value: 4 kg
      - "@type": PropertyValue
        name: Reach
        value: 550 mm
      - "@type": PropertyValue
        name: Repeatability
        value: Plus or minus 0.01 mm
      - "@type": PropertyValue
        name: Mechanical weight
        value: 20 kg
      - "@type": PropertyValue
        name: Motion range
        value: J1 340 degrees, J2 230 degrees, J3 402 degrees, J4 380 degrees, J5 240 degrees, J6 720 degrees
      - "@type": PropertyValue
        name: Mounting
        value: Floor, angle, or inverted
      - "@type": PropertyValue
        name: Protection rating
        value: IP67
      - "@type": PropertyValue
        name: Controller
        value: FANUC R-30iB Plus

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What robot is in the Smart Robot Workcell?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A FANUC LR Mate 200iD/4S, a six-axis industrial robot with a 550 mm reach, 4 kg
            payload, and plus or minus 0.01 mm repeatability, running on a FANUC R-30iB Plus
            controller. It is a production robot rather than a training replica, which means
            the teach pendant, the programming language, and the safety configuration are the
            ones a graduate will meet on a plant floor.
      - "@type": Question
        name: What is the reach and payload of a FANUC LR Mate 200iD/4S?
        acceptedAnswer:
          "@type": Answer
          text: >-
            550 mm reach and 4 kg payload, with a mechanical weight of 20 kg. Its six axes
            move through J1 340 degrees, J2 230 degrees, J3 402 degrees, J4 380 degrees, J5
            240 degrees, and J6 720 degrees. The arm is rated IP67 and can be mounted on the
            floor, at an angle, or inverted, which is why it appears in machine-tending cells
            where overhead mounting saves floor space.
      - "@type": Question
        name: Do students program the robot directly?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. Teach pendant programming and motion sequencing are the core of the
            curriculum, alongside cell integration with conveyors, sensors, and safety
            interlocks, and fault isolation when a cycle stops. The robot is operated inside a
            guarded cell with interlocked safety devices, and safe operation is taught as a
            prerequisite rather than as an appendix.
---

# Amatrol Smart Robot Workcell

The Amatrol Smart Robot Workcell is a training cell built around a FANUC LR Mate 200iD/4S six-axis industrial robot: 550 mm reach, 4 kg payload, ±0.01 mm repeatability, on a FANUC R-30iB Plus controller. It teaches robot operation, teach pendant programming, cell integration, and troubleshooting on production hardware inside a guarded, interlocked enclosure.

## What it teaches

The distinguishing feature of this cell is that the robot is not an educational analogue of an industrial robot. It is an industrial robot: the same model, the same controller, and the same pendant used for machine tending and pick-and-place in production plants.

- **Teach pendant programming.** Jogging, teaching positions, frames, and motion instructions on the R-30iB Plus.
- **Motion sequencing.** Building a repeatable cycle, and understanding why a taught point behaves differently in joint space than in Cartesian space.
- **Cell integration.** Conveyors, sensors, and I/O handshaking between the robot and the surrounding equipment.
- **Safety systems.** Interlocked guarding and safety devices, operated as a condition of running the cell.
- **Troubleshooting.** Fault isolation and recovery when a cycle stops mid-sequence, which is the skill that separates an operator from a technician.

Workcell configurations vary. The robot specification below is fixed; the peripheral equipment - conveyors, pallets, sorting fixtures - depends on how the cell is configured for a given course.

## Robot specification

| Specification | Value |
|---|---|
| Model | FANUC LR Mate 200iD/4S |
| Controlled axes | 6 |
| Payload | 4 kg |
| Reach | 550 mm |
| Repeatability | ±0.01 mm |
| Mechanical weight | 20 kg |
| Motion range | J1 340°, J2 230°, J3 402°, J4 380°, J5 240°, J6 720° |
| Mounting | Floor, angle, or inverted |
| Protection rating | IP67 |
| Controller | FANUC R-30iB Plus |

Specifications are as published by FANUC America for the LR Mate 200iD/4S. Peripheral workcell equipment is configuration-dependent and is not specified here.

[Full workcell details &rarr;](/About_Equipment/Amatrol_SmartRobot_Workcell.html){ .md-button .md-button--primary }

## Access

This equipment is reserved for educational purposes and cannot be independently reserved. Access is arranged through the Lab Manager.

The workcell sits on its own cart alongside the three-station [Amatrol 870 Mechatronics Learning System](amatrol-870-mechatronics-line.md), and the two are taught as complements rather than alternatives: the 870 line teaches PLC-driven station sequencing, and this cell teaches six-axis robot programming. For the control theory common to both, see [Industrial Automation and PLC Control](../techniques/industrial-automation-plc.md).

## Frequently asked questions

### What robot is in the Smart Robot Workcell?

A FANUC LR Mate 200iD/4S, a six-axis industrial robot with a 550 mm reach, 4 kg payload, and ±0.01 mm repeatability, running on a FANUC R-30iB Plus controller. It is a production robot rather than a training replica, so the teach pendant, the programming language, and the safety configuration are the ones a graduate will meet on a plant floor.

### What is the reach and payload of a FANUC LR Mate 200iD/4S?

550 mm reach and 4 kg payload, with a mechanical weight of 20 kg. Its six axes move through J1 340°, J2 230°, J3 402°, J4 380°, J5 240°, and J6 720°. The arm is rated IP67 and can be mounted on the floor, at an angle, or inverted, which is why it appears in machine-tending cells where overhead mounting saves floor space.

### Do students program the robot directly?

Yes. Teach pendant programming and motion sequencing are the core of the curriculum, alongside cell integration with conveyors, sensors, and safety interlocks, and fault isolation when a cycle stops. The robot is operated inside a guarded cell with interlocked safety devices, and safe operation is taught as a prerequisite rather than as an appendix.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
