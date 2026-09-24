---
title: Amatrol 870 Mechatronics Learning System
description: The three-station Amatrol 870 automated production line at NAU in Flagstaff, Arizona - pick and place, go/no-go gauging, and inventory storage under PLC control.
tags:
  - Education
  - Automation
schema:
  - "@type": DefinedTerm
    name: Mechatronics Learning System
    description: >-
      A modular set of instructional workstations that reproduce the stations of an automated
      production line, each driven by an industrial programmable logic controller, so that
      learners practise sequencing, sensing, actuation, and interfacing on production-grade
      components rather than on simulations.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": DefinedTerm
    name: Go/No-Go Gauging
    description: >-
      An inspection method that answers whether a dimension falls inside its tolerance band
      without reporting the dimension itself, so that the binary result can be automated with
      simple sensors and acted on immediately by a controller.
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
    name: Mechatronics and PLC Instruction
    serviceType: Education
    description: >-
      Course-based hands-on instruction in automated parts feeding, pneumatic manipulation,
      in-process gauging, reject routing, programmable parts storage, sensor adjustment, and
      PLC ladder-logic sequencing on a three-station industrial mechatronics line.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/Contact_Us.html?category=equipment

  - "@type": IndividualProduct
    name: Amatrol 870 Mechatronics Learning System
    category: Mechatronics Training Line
    description: >-
      A three-station automated production line comprising the 87-MS1 Pick and Place Feeding
      Station, the 87-MS2 Gauging Station, and the 87-MS7 Inventory Storage Station, which
      together assemble, inspect, and store a working industrial directional control valve
      under programmable logic control.
    manufacturer:
      "@type": Organization
      name: Amatrol
    hasPart:
      - "@type": IndividualProduct
        name: Amatrol 87-MS1 Pick and Place Feeding Station
        url: https://nano.nau.edu/About_Equipment/Amatrol_87_MS1.html
      - "@type": IndividualProduct
        name: Amatrol 87-MS2 Gauging Station
        url: https://nano.nau.edu/About_Equipment/Amatrol_87_MS2.html
      - "@type": IndividualProduct
        name: Amatrol 87-MS7 Inventory Storage Station
        url: https://nano.nau.edu/About_Equipment/Amatrol_87_MS7.html
    additionalProperty:
      - "@type": PropertyValue
        name: Stations installed
        value: 87-MS1 Pick and Place, 87-MS2 Gauging, 87-MS7 Inventory Storage
      - "@type": PropertyValue
        name: Workpiece
        value: Industrial directional control valve, acrylic valve body 1.25 x 1.25 x 0.9375 in
      - "@type": PropertyValue
        name: Control platform
        value: Allen-Bradley CompactLogix (870-AB) or Siemens S7-300 (870-S7 / 870-PS7)
      - "@type": PropertyValue
        name: Electrical requirement
        value: 87-MS1 100 to 240 V 50/60 Hz single phase; 87-MS2 and 87-MS7 120 V 60 Hz single phase
      - "@type": PropertyValue
        name: Utilities
        value: Compressed air required at every station
      - "@type": PropertyValue
        name: Control interface
        value: Digital I/O interface module at each station for PLC connection

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is a mechatronics learning system?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A modular set of training workstations, each reproducing one station of an
            automated production line and each driven by an industrial PLC. Learners work
            with the same sensors, valve manifolds, manipulators, and controllers used in
            production, and the stations are connected so that a part is handed from one to
            the next. The design goal is that skills transfer directly to a plant floor
            rather than to a simulator.
      - "@type": Question
        name: What part does the Amatrol 870 line actually build?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A working industrial directional control valve, built around an acrylic valve
            body measuring 1.25 by 1.25 by 0.9375 inches. The 87-MS1 begins the assembly by
            feeding and placing components, the 87-MS2 gauges the result and routes rejects
            aside, and the 87-MS7 sorts and stores completed assemblies. The workpiece is
            what makes the three stations one line rather than three exercises.
      - "@type": Question
        name: What is go/no-go gauging?
        acceptedAnswer:
          "@type": Answer
          text: >-
            An inspection method that answers whether a dimension falls inside its tolerance
            band, without reporting the dimension itself. The part either passes the gauge or
            it does not. Because the decision is binary it can be automated with simple
            sensors and acted on immediately by a controller, which is why it is the standard
            inspection step on high-volume automated lines where measuring every part
            precisely would be too slow.
      - "@type": Question
        name: How does automated gauging differ from manual inspection?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Three ways that matter. Consistency: the measurement sequence is executed
            identically every cycle by a PLC, rather than depending on which operator is on
            shift. Speed: transfer and reject routing happen at line rate without a person
            handling the part. Traceability: every pass and fail decision exists as
            controller state that can be logged. What manual inspection retains is judgement
            about failures nobody anticipated when the sensors were placed.
      - "@type": Question
        name: What sensors does the 870 line use?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Each station carries a different set, and adjusting them is the curriculum rather
            than a preliminary to it. The 87-MS1 uses photoelectric and magnetic sensors, a
            programmable electronic pressure transducer, and a vacuum switch. The 87-MS2 uses
            an ultrasonic measurement module and a proximity gauging module. The 87-MS7 uses
            infrared sensors and a phototransistor optical interrupter switch.
      - "@type": Question
        name: What does an automated inventory storage station teach?
        acceptedAnswer:
          "@type": Answer
          text: >-
            How a controller keeps track of physical inventory. A storage station has to know
            which channels hold a part and which are empty, place a part in a specific
            location, and retrieve it later on demand. That requires the PLC to maintain state
            that matches the real world, and to recover when the two diverge. It is the first
            point in most automation curricula where a program has memory rather than only
            reacting to inputs.
      - "@type": Question
        name: What PLC does the Amatrol 870 line use?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Either an Allen-Bradley CompactLogix or a Siemens S7-300, supplied as the 870
            Mechatronics Learning System platform rather than built into any station. Each
            station presents a digital I/O interface module, and the curriculum, instructor
            guide, and student reference are processor-specific. Amatrol permits a mixed line,
            so one station can run Allen-Bradley while another runs Siemens.
      - "@type": Question
        name: Why do the Amatrol stations need compressed air?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Every actuator on the line is pneumatic. The 87-MS1 manipulator and vacuum
            gripper, the 87-MS2 part transfer and reject actuators, and the 87-MS7 gripper and
            brake all run from an electro-pneumatic valve manifold fed by shop air. Amatrol
            lists compressed air as a required utility for all three stations, alongside
            single-phase electrical service. Without air the stations power up and sequence in
            software but move nothing.
      - "@type": Question
        name: Can the Amatrol stations be reserved for research use?
        acceptedAnswer:
          "@type": Answer
          text: >-
            No. The Amatrol equipment at MPaCT is designated educational and cannot be
            independently reserved. Access runs through course enrolment or is arranged
            directly with the Lab Manager. This is a policy constraint, not a technical one.
---

# Amatrol 870 Mechatronics Learning System

The Amatrol 870 Mechatronics Learning System is a modular automated production line built from industrial-grade stations, each driven by a programmable logic controller. The MPaCT Lab at Northern Arizona University in Flagstaff, Arizona runs three of its stations - pick and place feeding, go/no-go gauging, and inventory storage - as one continuous line that assembles, inspects, and stores a working industrial directional control valve.

## Why these three stations are one page

Amatrol sells the 870 stations individually, but at MPaCT they do not function in isolation. All three build the same workpiece, in sequence, and Amatrol's own datasheets state the dependency in both directions: the 87-MS1 and 87-MS2 each *require* the 87-MS7, and the 87-MS7 exists to sort what the other two produce.

| Station | Role in the sequence |
|---|---|
| [87-MS1 Pick and Place Feeding](/About_Equipment/Amatrol_87_MS1.html) | Feeds components and places them - starts the valve assembly |
| [87-MS2 Gauging](/About_Equipment/Amatrol_87_MS2.html) | Gauges the assembly, routes accepted parts on and rejects aside |
| [87-MS7 Inventory Storage](/About_Equipment/Amatrol_87_MS7.html) | Sorts completed assemblies into programmable storage |

A student who learns only one station has learned a machine. A student who runs all three has learned a line, which is the thing the curriculum is actually for.

## The workpiece

The line assembles a working industrial directional control valve around an acrylic valve body measuring 1¼ × 1¼ × 15/16 in. Four bodies ship with each station's parts set.

This matters more than it appears. Because the same physical part travels the whole line, a fault at one station shows up as a symptom at the next - a mis-seated component placed at the 87-MS1 is rejected at the 87-MS2, and a storage channel the 87-MS7 believes is full stalls the sequence upstream. Diagnosing across that boundary is the skill the line teaches that no single station can.

## What each station teaches

### 87-MS1 - Pick and place feeding

Starts the assembly sequence: parts are fed from a powered feeder to a pick position, transferred by a pneumatic manipulator with a vacuum gripper, and delivered to storage.

- **Powered parts feeding.** Sequencing a feeder and reading sensor feedback to confirm a part reached the pick position.
- **Pneumatic pick-and-place.** Operating and adjusting a vacuum-gripper manipulator, including shock absorber setting and vacuum switch adjustment.
- **Sensor configuration.** Photoelectric and magnetic sensors, a programmable electronic pressure transducer, and a vacuum switch - each adjusted rather than merely observed.
- **PLC program design** for station sequencing and interlocking.
- **Mechatronics safety**, including electro-pneumatic safety practice and lockout/tagout.

### 87-MS2 - Gauging

Adds quality inspection. A non-servo traverse shuttle positions parts under ultrasonic and proximity gauging modules, and ladder logic routes each part to storage or to the reject module.

- **Go/no-go gauging.** Setting an analog sensor with a discrete output - deciding, in hardware, where the tolerance boundary sits.
- **Non-servo linear motion.** Adjusting a traverse axis with synchronous belt and ball screw drives, including belt tensioning and travel setting.
- **Part transfer and reject routing.** The first place students meet branching logic tied to a physical outcome.
- **Station sequencing** in manual, automatic, and reset modes.
- **Lockout/tagout**, taught as part of the curriculum rather than alongside it.

### 87-MS7 - Inventory storage

Sorts and stores completed assemblies. A programmable-position pneumatic robot moves parts between a presentation module and a 4-channel storage module.

- **Programmable parts storage.** Placing and retrieving parts in a 4-channel module, which requires the controller to track what is where.
- **Pneumatic pick-and-place with brakes.** Adjusting a pneumatic brake and gripper on a programmable-position robot.
- **Infrared and optical sensing.** Configuring infrared sensors and a phototransistor optical interrupter switch.
- **Manual, automatic, and reset functions**, including the recovery path when the controller's model of the storage module no longer matches reality.
- **Non-servo electric slide and torque clamp sequencing.**

For the method behind all three - what a PLC is, how ladder logic executes, why sensor adjustment is the hard part - see [Industrial Automation and PLC Control](../techniques/industrial-automation-plc.md).

## Configuration

| Item | 87-MS1 | 87-MS2 | 87-MS7 |
|---|---|---|---|
| System role | Station 1 | Station 2 | Station 7 |
| Electrical | 100–240 V, 50/60 Hz, 1ph | 120 V, 60 Hz, 1ph | 120 V, 60 Hz, 1ph |
| Utilities | Compressed air | Compressed air | Compressed air |
| Control interface | Digital I/O module | Digital I/O module | Digital I/O module |
| Sensors | Photoelectric, magnetic, pressure transducer, vacuum switch | Ultrasonic measurement, proximity gauging | Infrared, phototransistor optical interrupter |
| Motion | Pneumatic pick-and-place manipulator | Non-servo electric traverse, synchronous belt and ball screw | Programmable-position pneumatic robot, gripper and brake |
| Key modules | Operator station, powered feed, pick and place robot, finished parts storage | Operator station, traverse shuttle, gauging modules, part transfer, part reject, finished parts storage | Operator station, pneumatic robot, 4-channel storage, parts presentation |
| Lockout/tagout kit | Not listed | 2 hasps, 2 tags, 4 two-key padlocks | 2 hasps, 2 tags, 4 two-key padlocks |
| Parts set | Acrylic valve body ×4 | Acrylic valve body ×4 | Acrylic valve body ×4 |

Every station additionally requires the 870 Mechatronics Learning System control platform - Allen-Bradley CompactLogix (870-AB) or Siemens S7-300 (870-S7 / 870-PS7) - plus a curriculum PC.

!!! warning "Figures Amatrol does not publish"
    All three datasheets state that *complete technical specifications are available upon request*. No dimensional envelope, cycle time, throughput, gauging resolution, or storage capacity per channel is published for any station, and none is asserted here.

!!! note "One station in the published sequence is not in the MPaCT catalogue"
    Amatrol specifies the **87-MS6 Torque Assembly** station as required companion equipment for both the 87-MS1 and the 87-MS2. No 87-MS6 appears in the MPaCT equipment catalogue. Whether the line runs a modified sequence without it, or the station is present but uncatalogued, is a question for the Lab Manager rather than something that can be resolved from published sources.

[87-MS1 details &rarr;](/About_Equipment/Amatrol_87_MS1.html){ .md-button }
[87-MS2 details &rarr;](/About_Equipment/Amatrol_87_MS2.html){ .md-button }
[87-MS7 details &rarr;](/About_Equipment/Amatrol_87_MS7.html){ .md-button }

## The rest of the 870 family

Amatrol builds nine stations in the 870 series. MPaCT holds three. Knowing what the others do explains where the installed line stops:

87-MS1 Pick and Place · 87-MS2 Gauging · 87-MS3 Orientation Processing · 87-MS4 Sorting/Buffering · 87-MS5-P2 Servo Robotic Assembly · 87-MS6 Torque Assembly · 87-MS7 Inventory Storage · 87-MS8M60 CNC Mill (Denford Micromill) · 87-MS9 Mechatronics Hydraulic Press

## The 870 line at MPaCT Lab, Flagstaff, Arizona

The three stations stand side by side on their rolling bases in the education bay at Building 98E, coupled so that a part passes from feeding through gauging to storage without being carried by hand. A shared compressor supplies the pneumatic manifolds at all three, which is why the line has a single air dependency rather than three.

The [Smart Robot Workcell](amatrol-smart-robot-workcell.md), built around a FANUC LR Mate 200iD/4S, sits on its own cart alongside the line. It is a separate Amatrol product with a separate curriculum, and it is not one of the 870 stations - the 870 line teaches PLC-driven station sequencing, and the workcell teaches six-axis robot programming.

The MPaCT Lab is a shared-use facility at Northern Arizona University, open to NAU researchers, external academic users, and industry partners. The Amatrol equipment specifically is educational and is not available on the fee-for-service basis that applies to the characterization instruments.

## Access

This equipment is reserved for educational purposes and cannot be independently reserved. Access is arranged through the Lab Manager.

## Frequently asked questions

### What is a mechatronics learning system?

A modular set of training workstations, each reproducing one station of an automated production line and each driven by an industrial PLC. Learners work with the same sensors, valve manifolds, manipulators, and controllers used in production, and the stations are connected so that a part is handed from one to the next. The design goal is that skills transfer directly to a plant floor rather than to a simulator.

### What part does the Amatrol 870 line actually build?

A working industrial directional control valve, built around an acrylic valve body measuring 1.25 by 1.25 by 0.9375 inches. The 87-MS1 begins the assembly by feeding and placing components, the 87-MS2 gauges the result and routes rejects aside, and the 87-MS7 sorts and stores completed assemblies. The workpiece is what makes the three stations one line rather than three exercises.

### What is go/no-go gauging?

An inspection method that answers whether a dimension falls inside its tolerance band, without reporting the dimension itself. The part either passes the gauge or it does not. Because the decision is binary it can be automated with simple sensors and acted on immediately by a controller, which is why it is the standard inspection step on high-volume automated lines where measuring every part precisely would be too slow.

### How does automated gauging differ from manual inspection?

Three ways that matter. Consistency: the measurement sequence is executed identically every cycle by a PLC, rather than depending on which operator is on shift. Speed: transfer and reject routing happen at line rate without a person handling the part. Traceability: every pass and fail decision exists as controller state that can be logged. What manual inspection retains is judgement about failures nobody anticipated when the sensors were placed.

### What sensors does the 870 line use?

Each station carries a different set, and adjusting them is the curriculum rather than a preliminary to it. The 87-MS1 uses photoelectric and magnetic sensors, a programmable electronic pressure transducer, and a vacuum switch. The 87-MS2 uses an ultrasonic measurement module and a proximity gauging module. The 87-MS7 uses infrared sensors and a phototransistor optical interrupter switch.

### What does an automated inventory storage station teach?

How a controller keeps track of physical inventory. A storage station has to know which channels hold a part and which are empty, place a part in a specific location, and retrieve it later on demand. That requires the PLC to maintain state that matches the real world, and to recover when the two diverge. It is the first point in most automation curricula where a program has memory rather than only reacting to inputs.

### What PLC does the Amatrol 870 line use?

Either an Allen-Bradley CompactLogix or a Siemens S7-300, supplied as the 870 Mechatronics Learning System platform rather than built into any station. Each station presents a digital I/O interface module, and the curriculum, instructor guide, and student reference are processor-specific. Amatrol permits a mixed line, so one station can run Allen-Bradley while another runs Siemens.

### Why do the Amatrol stations need compressed air?

Every actuator on the line is pneumatic. The 87-MS1 manipulator and vacuum gripper, the 87-MS2 part transfer and reject actuators, and the 87-MS7 gripper and brake all run from an electro-pneumatic valve manifold fed by shop air. Amatrol lists compressed air as a required utility for all three stations, alongside single-phase electrical service. Without air the stations power up and sequence in software but move nothing.

### Can the Amatrol stations be reserved for research use?

No. The Amatrol equipment at MPaCT is designated educational and cannot be independently reserved. Access runs through course enrolment or is arranged directly with the Lab Manager. This is a policy constraint, not a technical one.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
