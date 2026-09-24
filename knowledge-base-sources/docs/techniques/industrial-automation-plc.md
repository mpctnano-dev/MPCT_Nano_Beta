---
title: Industrial Automation and PLC Control
description: How programmable logic controllers sequence an automated production line, what ladder logic is, and where sensor adjustment decides whether a station works at NAU.
tags:
  - Education
  - Automation
schema:
  - "@type": DefinedTerm
    name: Programmable Logic Controller
    alternateName: PLC
    description: >-
      An industrial computer that reads discrete and analog inputs from field sensors,
      evaluates a control program on a fixed repeating scan, and drives outputs to actuators,
      built for continuous operation in an electrically noisy plant environment with
      deterministic timing and field-serviceable wiring.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": DefinedTerm
    name: Ladder Logic
    description: >-
      A graphical programming language for programmable logic controllers in which control
      relationships are drawn as rungs between two power rails, each rung evaluating a
      combination of input conditions on the left to energise an output coil on the right,
      derived from the relay wiring diagrams the language replaced.
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
    name: Industrial Automation and PLC Instruction
    serviceType: Education
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/Contact_Us.html?category=equipment

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is a programmable logic controller?
        acceptedAnswer:
          "@type": Answer
          text: >-
            An industrial computer that reads sensor inputs, evaluates a control program on a
            fixed repeating scan, and drives outputs to actuators. What distinguishes it from
            a general-purpose computer is the execution model and the packaging: the program
            runs to completion on every scan with deterministic timing, the I/O terminates on
            field-serviceable screw terminals, and the hardware is specified for continuous
            operation in electrical noise, vibration, and plant temperature swings.
      - "@type": Question
        name: What is the difference between a PLC and a microcontroller?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Execution model and serviceability, more than processing power. A microcontroller
            runs code an engineer wrote and structured freely, and is usually soldered to a
            custom board. A PLC runs a fixed scan cycle - read all inputs, evaluate the whole
            program, write all outputs - which makes timing predictable and reasoning about
            state simpler, and it is wired to field terminals a maintenance technician can
            trace and replace. A microcontroller is cheaper per unit; a PLC is cheaper to keep
            running for twenty years.
      - "@type": Question
        name: What is ladder logic?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A graphical PLC programming language in which control relationships are drawn as
            rungs between two vertical power rails. Input conditions sit on the left of each
            rung and an output coil on the right, so a rung reads as "if these conditions are
            true, energise this output". It looks the way it does because it replaced physical
            relay wiring diagrams, which is also why electricians can read it without being
            taught a programming language.
      - "@type": Question
        name: Why does sensor adjustment matter more than the program?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Because a correct program acting on a wrong input produces confidently wrong
            behaviour. A photoelectric sensor aimed slightly off reports a part present when
            the fixture is empty; an infrared sensor misaligned at a storage channel reports
            occupied when it is clear; an analog gauging sensor with its threshold set wrong
            passes parts that should be rejected. None of these raise a fault. The station
            runs its sequence perfectly against a false picture of the world, which is why
            most automation faults are found at the sensor rather than in the code.
      - "@type": Question
        name: Why does my station stop mid-cycle?
        acceptedAnswer:
          "@type": Answer
          text: >-
            In order of frequency: a sensor that never reported the condition the sequence is
            waiting for, low or absent compressed air so a pneumatic actuator never reaches
            its end position, an interlock or emergency stop that is open, or controller state
            that no longer matches the machine after a manual intervention. Check the input
            image in the controller against what is physically true before reading the
            program. A stopped station is usually waiting correctly for something that did not
            happen.
      - "@type": Question
        name: Does automation training at NAU use real industrial controllers?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The MPaCT Lab in Flagstaff, Arizona runs an Amatrol 870 Mechatronics Learning
            System on Allen-Bradley CompactLogix or Siemens S7-300 processors, and a Smart
            Robot Workcell built around a FANUC LR Mate 200iD/4S on an R-30iB Plus controller.
            These are production controllers and a production robot, not educational
            analogues, so the pendant, the programming environment, and the safety
            configuration are the ones a graduate meets on a plant floor.
---

# Industrial Automation and PLC Control

Industrial automation is the control of a physical production process by a programmable controller that reads sensors, decides, and drives actuators without a person in the loop. A programmable logic controller executes its program on a fixed repeating scan, so the machine's behaviour is deterministic and can be reasoned about, tested, and handed to a maintenance technician who did not write it.

## How a PLC works

The controller runs a **scan cycle**, and the cycle is the whole design:

1. **Read inputs.** Every field input - photoelectric sensors, proximity switches, limit switches, analog transducers - is sampled at once into an input image table.
2. **Evaluate the program.** The control program runs top to bottom against that frozen snapshot. Inputs do not change mid-evaluation.
3. **Write outputs.** The resulting output image is driven to the valve manifolds, motor starters, and indicators in one pass.

Freezing the inputs is what makes the model tractable. A rung cannot see a sensor change halfway through evaluation, so the logic behaves the same way every scan and a fault is reproducible rather than intermittent.

**Ladder logic** is the language most lines are written in. Rungs sit between two vertical rails; conditions on the left, an output coil on the right. It is a direct descendant of relay wiring diagrams, which is why it is drawn rather than typed and why an electrician can read it.

State is where students first meet real difficulty. A station that only reacts to inputs is straightforward. A station that must *remember* - which storage channel holds a part, which parts have been gauged, where the sequence was interrupted - has a model of the world that can diverge from the world. Recovering from that divergence is the manual/automatic/reset problem, and it is the part of the curriculum that transfers most directly to industry.

## When to use PLC-based control

- **The process is sequential and repetitive.** Feed, place, gauge, sort - the class of problem PLCs were built for.
- **Uptime matters more than unit cost.** Field-serviceable terminals and standard hardware beat a cheaper custom board when the line has to run for years.
- **Non-authors will maintain it.** Ladder logic is readable by maintenance staff; a C firmware image is not.
- **Timing must be predictable.** A fixed scan gives a bounded worst-case response, which an interrupt-driven general-purpose system does not.
- **Safety functions are involved.** Interlocks, emergency stops, and lockout/tagout integrate with industrial controllers as designed features rather than as additions.

## What PLC control cannot do

- **Complex computation.** Vision processing, model fitting, and floating-point-heavy work belong on a PC or a dedicated controller alongside the PLC, not in ladder logic.
- **Fix a bad sensor picture.** The controller acts on what it is told. A misaligned sensor produces correct behaviour against a false world state, and nothing in the program can detect it.
- **Move without power to the actuators.** On a pneumatic line, no compressed air means the sequence advances in software and the machine stands still.
- **Substitute for mechanical adjustment.** Belt tension, shock absorbers, gripper pressure, and traverse travel are set by hand. No amount of programming compensates for a manipulator that overshoots.

## Where automation is taught at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University runs two complementary automation platforms in Flagstaff, Arizona.

| Platform | Controller | What it teaches |
|---|---|---|
| [Amatrol 870 Mechatronics Learning System](../instruments/amatrol-870-mechatronics-line.md) | Allen-Bradley CompactLogix or Siemens S7-300 | Station and line sequencing, sensor adjustment, go/no-go gauging, programmable storage, LOTO |
| [Amatrol Smart Robot Workcell](../instruments/amatrol-smart-robot-workcell.md) | FANUC R-30iB Plus | Teach pendant programming, motion sequencing, cell integration, fault recovery |

The 870 line teaches control of a process by a controller. The workcell teaches control of a manipulator by a controller. Industry needs both, and the handshake between them - a robot and a PLC exchanging I/O to agree that a part is ready - is where cell integration actually lives.

Both platforms are designated educational equipment and are accessed through course enrolment or the Lab Manager, not through the instrument reservation system that covers the characterization tools.

## Frequently asked questions

### What is a programmable logic controller?

An industrial computer that reads sensor inputs, evaluates a control program on a fixed repeating scan, and drives outputs to actuators. What distinguishes it from a general-purpose computer is the execution model and the packaging: the program runs to completion on every scan with deterministic timing, the I/O terminates on field-serviceable screw terminals, and the hardware is specified for continuous operation in electrical noise, vibration, and plant temperature swings.

### What is the difference between a PLC and a microcontroller?

Execution model and serviceability, more than processing power. A microcontroller runs code an engineer wrote and structured freely, and is usually soldered to a custom board. A PLC runs a fixed scan cycle - read all inputs, evaluate the whole program, write all outputs - which makes timing predictable and reasoning about state simpler, and it is wired to field terminals a maintenance technician can trace and replace. A microcontroller is cheaper per unit; a PLC is cheaper to keep running for twenty years.

### What is ladder logic?

A graphical PLC programming language in which control relationships are drawn as rungs between two vertical power rails. Input conditions sit on the left of each rung and an output coil on the right, so a rung reads as "if these conditions are true, energise this output". It looks the way it does because it replaced physical relay wiring diagrams, which is also why electricians can read it without being taught a programming language.

### Why does sensor adjustment matter more than the program?

Because a correct program acting on a wrong input produces confidently wrong behaviour. A photoelectric sensor aimed slightly off reports a part present when the fixture is empty; an infrared sensor misaligned at a storage channel reports occupied when it is clear; an analog gauging sensor with its threshold set wrong passes parts that should be rejected. None of these raise a fault. The station runs its sequence perfectly against a false picture of the world, which is why most automation faults are found at the sensor rather than in the code.

### Why does my station stop mid-cycle?

In order of frequency: a sensor that never reported the condition the sequence is waiting for, low or absent compressed air so a pneumatic actuator never reaches its end position, an interlock or emergency stop that is open, or controller state that no longer matches the machine after a manual intervention. Check the input image in the controller against what is physically true before reading the program. A stopped station is usually waiting correctly for something that did not happen.

### Does automation training at NAU use real industrial controllers?

Yes. The MPaCT Lab in Flagstaff, Arizona runs an Amatrol 870 Mechatronics Learning System on Allen-Bradley CompactLogix or Siemens S7-300 processors, and a Smart Robot Workcell built around a FANUC LR Mate 200iD/4S on an R-30iB Plus controller. These are production controllers and a production robot, not educational analogues, so the pendant, the programming environment, and the safety configuration are the ones a graduate meets on a plant floor.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Ask about automation courses](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
