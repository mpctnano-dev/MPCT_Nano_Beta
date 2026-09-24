---
title: CNC Machining (Milling and Turning)
description: How CNC milling and turning remove material to make a part, when to choose each, and what the desktop machines at NAU in Flagstaff, Arizona can and cannot cut.
tags:
  - Fabrication
  - Education
schema:
  - "@type": DefinedTerm
    name: CNC Machining
    alternateName: Computer Numerical Control Machining
    description: >-
      A family of subtractive manufacturing processes in which material is removed from a
      solid workpiece by a cutting tool whose position and speed are commanded by a numerical
      control program, producing a part whose dimensions derive from the machine's positioning
      accuracy rather than from a mould or a deposition path.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": DefinedTerm
    name: CNC Milling
    description: >-
      A subtractive manufacturing process in which a rotating cutting tool removes material
      from a workpiece held on a table, with tool and table positions driven by a numerical
      control program.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": DefinedTerm
    name: CNC Turning
    description: >-
      A subtractive manufacturing process in which a workpiece is rotated in a chuck while a
      stationary cutting tool is fed against it under numerical control, producing cylindrical
      features such as diameters, faces, grooves, and threads.
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
    name: CNC Machining Instruction
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
        name: What is the difference between CNC milling and CNC turning?
        acceptedAnswer:
          "@type": Answer
          text: >-
            What rotates. In milling the cutting tool spins and the workpiece is clamped to a
            table that moves beneath it, which suits prismatic parts - plates, blocks,
            housings, pockets, and holes off the centreline. In turning the workpiece spins in
            a chuck and a stationary tool is fed against it, which suits anything with an axis
            of revolution - shafts, pins, bushings, threads, and bores on centre. A part with
            both a round body and off-axis features usually needs both operations in sequence.
      - "@type": Question
        name: What does a CNC machine need before cutting starts?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Four things, and skipping any one of them is how crashes happen. A toolpath
            program posted for that specific control. Workholding that resists the cutting
            forces in every direction the tool will push. A work coordinate origin set on the
            actual part rather than assumed. And a tool length offset measured for each tool
            in the program. The control has no independent knowledge of where the part is; it
            executes coordinates it was given.
      - "@type": Question
        name: Why does my machined part have chatter marks?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Chatter is self-excited vibration: the tool bounces, leaves a wavy surface, and
            the next pass excites the same oscillation. The cause is almost always compliance
            somewhere in the loop - long tool overhang, a thin unsupported wall, or
            workholding that lets the part move. The fixes in order of effect are shorter tool
            stickout, better support close to the cut, and only then changes to speed and feed
            to move away from the resonance.
      - "@type": Question
        name: Can the CNC machines at NAU cut metal?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Only in a limited sense. The Haas Desktop Lathe at MPaCT is rated by the
            manufacturer for brass, plastics, and machinable wax, and the Haas Desktop Mill
            for plastics and machinable wax. Neither is rated for steel, stainless, or
            aluminium. These are instructional machines sized for teaching setup, programming,
            and operation on a real Haas control, not production machines for structural metal
            parts.
      - "@type": Question
        name: Why must a CNC spindle not run below its minimum speed?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Integral spindle motors on compact machines are cooled by their own rotation and
            are current-limited at low speed. Running below the rated minimum produces high
            torque demand with little cooling airflow, and the spindle overheats. Haas
            specifies a floor of 1,500 rpm on the Desktop Mill and 500 rpm on the Desktop
            Lathe. Where a large-diameter cut would call for a lower speed, the correct
            response is a smaller tool, not a slower spindle.
---

# CNC Machining (Milling and Turning)

CNC machining is a subtractive manufacturing process in which a cutting tool removes material from a solid workpiece under numerical control, leaving the finished geometry behind. Because the part is cut from stock that was already dense and isotropic, a machined component keeps the full mechanical properties of its material, and its dimensions derive from the machine's positioning accuracy rather than from a deposition path.

## How CNC machining works

A cutting edge is driven into the workpiece at a depth and a feed rate. Material ahead of the edge shears away as a chip, and the surface left behind is the finished geometry. Everything that separates a good part from scrap follows from three quantities:

**Cutting speed** - the relative velocity at the cutting edge, which sets heat generation and tool life. On a mill it comes from spindle rpm and tool diameter; on a lathe from spindle rpm and workpiece diameter, so it changes continuously as a facing cut approaches centre.

**Feed per tooth** - how much material each cutting edge takes. Too little and the edge rubs rather than cuts, generating heat and dulling the tool; too much and the edge is overloaded.

**Rigidity** - how much the tool, part, and fixture deflect under cutting force. Deflection puts the tool somewhere other than where the program commanded, and if deflection oscillates it becomes chatter. Rigidity, not the control, is what usually limits achievable tolerance on a small machine.

### Milling and turning

The two processes differ in what rotates, and every other difference follows from that.

| | CNC milling | CNC turning |
|---|---|---|
| **What rotates** | The tool | The workpiece |
| **Natural geometry** | Prismatic - plates, blocks, housings | Axisymmetric - shafts, pins, bushings |
| **Typical features** | Pockets, slots, faces, off-axis holes, contours | Diameters, faces, grooves, threads, on-centre bores |
| **Workholding** | Vice, clamps, fixture on a slotted table | Chuck gripping the outside diameter |
| **Tool changes** | Manual or automatic tool changer | Indexed turret |
| **Where it struggles** | Anything round and long | Anything off the axis of revolution |
| **Machine at MPaCT** | [Haas Desktop Mill](../instruments/haas-desktop-mill.md) | [Haas Desktop Lathe](../instruments/haas-desktop-lathe.md) |

A part with both a round body and off-axis features needs both operations, run in sequence, with the second setup referenced to a datum established in the first.

## When to use CNC machining

- **The material must be fully dense and isotropic.** Machining starts from wrought or cast stock and does not change that.
- **A tolerance or a fit has to hold.** Bearing seats, threads, mating faces, and sealing surfaces.
- **Surface finish matters.** A machined surface is set by the cutting edge and can be improved by a finishing pass.
- **The geometry is prismatic or axisymmetric.** These are the shapes cutters reach naturally.
- **The part must be made from a specific certified stock.** The material is the stock you started with, with a known heat treatment and traceability.

## What CNC machining cannot do

- **Reach enclosed internal geometry.** If a cutter cannot get to a surface, the surface cannot be machined. Internal channels, lattices, and closed voids are additive-only geometry.
- **Ignore workholding.** Every feature has to survive being clamped. Thin walls, tall unsupported bosses, and small parts with no gripping surface are limited by fixturing rather than by the cutter.
- **Cut anything the machine is not rated for.** Spindle power, rigidity, and the manufacturer's material rating are hard limits, not guidance.
- **Produce a part without a setup.** Programming, workholding, origin setting, and tool offsets take time that does not scale down with part size.

## CNC machining at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University runs two Haas desktop CNC machines in Flagstaff, Arizona, both running the same Haas control as the company's production machines.

| | [Haas Desktop Mill](../instruments/haas-desktop-mill.md) | [Haas Desktop Lathe](../instruments/haas-desktop-lathe.md) |
|---|---|---|
| Working envelope | 6.00 × 10.00 × 3.00 in (X/Y/Z) | 0.75 in max cutting diameter; 2.70 in X, 2.75 in Z |
| Workholding | 18.1 × 10.6 in table, 6 T-slots | 2.5 in chuck |
| Spindle | 15,000 rpm max, no lower than 1,500 rpm | 3,000 rpm max, no lower than 500 rpm; 1.5 hp |
| Tooling | ER11 collet, 1 tool, manual change | 6-station turret: 3 OD, 3 ID |
| Rated materials | Plastics and machinable wax | Brass, plastics, machinable wax |

!!! warning "These machines are not rated for structural metal"
    Haas rates the Desktop Mill for plastics and machinable wax, and the Desktop Lathe for brass, plastics, and machinable wax. Neither is rated for aluminium, steel, or stainless. They exist to teach setup, programming, and operation on a genuine Haas control at desktop scale. A project needing machined metal parts needs a production machine shop, and staff will say so rather than attempt it.

Both machines are designated educational equipment, accessed through course enrolment or the Lab Manager. For choosing between machining and printing, see [3D printing vs CNC machining](../compare/3d-printing-vs-cnc-machining.md); for routing a specific part, see [Prototype parts and fixtures](../samples/prototype-parts.md).

## What to submit

- A solid model with dimensions and tolerances called out - STEP preferred
- The material, checked against the machine's rating before anything else
- Which surfaces are functional and which are cosmetic
- How the part should be held, or which face may carry clamping marks
- The quantity, because setup time dominates on a single piece

## Frequently asked questions

### What is the difference between CNC milling and CNC turning?

What rotates. In milling the cutting tool spins and the workpiece is clamped to a table that moves beneath it, which suits prismatic parts - plates, blocks, housings, pockets, and holes off the centreline. In turning the workpiece spins in a chuck and a stationary tool is fed against it, which suits anything with an axis of revolution - shafts, pins, bushings, threads, and bores on centre. A part with both a round body and off-axis features usually needs both operations in sequence.

### What does a CNC machine need before cutting starts?

Four things, and skipping any one of them is how crashes happen. A toolpath program posted for that specific control. Workholding that resists the cutting forces in every direction the tool will push. A work coordinate origin set on the actual part rather than assumed. And a tool length offset measured for each tool in the program. The control has no independent knowledge of where the part is; it executes coordinates it was given.

### Why does my machined part have chatter marks?

Chatter is self-excited vibration: the tool bounces, leaves a wavy surface, and the next pass excites the same oscillation. The cause is almost always compliance somewhere in the loop - long tool overhang, a thin unsupported wall, or workholding that lets the part move. The fixes in order of effect are shorter tool stickout, better support close to the cut, and only then changes to speed and feed to move away from the resonance.

### Can the CNC machines at NAU cut metal?

Only in a limited sense. The Haas Desktop Lathe at MPaCT is rated by the manufacturer for brass, plastics, and machinable wax, and the Haas Desktop Mill for plastics and machinable wax. Neither is rated for steel, stainless, or aluminium. These are instructional machines sized for teaching setup, programming, and operation on a real Haas control, not production machines for structural metal parts.

### Why must a CNC spindle not run below its minimum speed?

Integral spindle motors on compact machines are cooled by their own rotation and are current-limited at low speed. Running below the rated minimum produces high torque demand with little cooling airflow, and the spindle overheats. Haas specifies a floor of 1,500 rpm on the Desktop Mill and 500 rpm on the Desktop Lathe. Where a large-diameter cut would call for a lower speed, the correct response is a smaller tool, not a slower spindle.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Ask about CNC access](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
