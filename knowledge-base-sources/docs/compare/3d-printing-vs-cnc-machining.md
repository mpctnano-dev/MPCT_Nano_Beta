---
title: 3D Printing vs CNC Machining
description: Whether to print or machine a part, decided by geometry, material, tolerance, and load, with the additive and subtractive equipment available at NAU in Flagstaff, Arizona.
tags:
  - Comparison
  - Fabrication
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

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: Should I 3D print or CNC machine this part?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Print it if the geometry is the difficult part - internal channels, lattices,
            undercuts, organic shapes - or if you expect to revise the design more than once.
            Machine it if a dimension has to hold a tolerance, a surface has to seal or slide,
            the load is structural, or the material must be fully dense and isotropic. When
            both would work, print first and machine the revision you settled on.
      - "@type": Question
        name: Is a CNC machined part stronger than a 3D printed one?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Generally yes, and for two separate reasons. A machined part is cut from stock
            that is already fully dense with isotropic properties, so it behaves the same in
            every direction. A printed part is a laminate whose layers are joined by polymer
            chain diffusion across a partially remelted interface, so it is weaker across the
            build direction than within a layer. The comparison also usually spans materials -
            machined brass against printed thermoplastic - which widens the gap further.
      - "@type": Question
        name: Can 3D printing make features CNC machining cannot?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes, and this is the clearest case for printing. A cutting tool has to physically
            reach every surface it produces, so enclosed internal channels, conformal cooling
            passages, lattice infill, and closed voids cannot be machined at all. Additive
            processes build those geometries as a consequence of how they work. Where a part
            has internal geometry, the choice is not additive versus subtractive - it is
            additive versus redesigning the part into assembled pieces.
      - "@type": Question
        name: Which is faster for a single prototype part?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Printing is usually faster in elapsed hands-on time, because the setup is
            slicing a model rather than fixturing a workpiece, establishing a coordinate
            origin, and measuring tool offsets. Machining setup does not scale down with part
            size, so a small simple part still needs the full setup. Actual queue and
            turnaround times at MPaCT depend on scheduling and are not published; ask the lab
            rather than planning around an assumed figure.
---

# 3D Printing vs CNC Machining

Additive and subtractive manufacturing are often presented as rivals. They are complements, and the choice between them is usually settled by one property of the part rather than by a general preference. Start here: **is the difficulty in the geometry, or in the tolerance and the load?** Geometry favours printing. Tolerance and load favour machining.

## Decision table

| | [FDM 3D printing](../techniques/additive-manufacturing-fdm.md) | [CNC machining](../techniques/cnc-machining.md) |
|---|---|---|
| **Process** | Adds material layer by layer | Removes material from solid stock |
| **Internal geometry** | Channels, lattices, closed voids - routine | Only where a tool can reach |
| **Undercuts and organic shapes** | Yes | Limited by tool access and setups |
| **Material state** | Layered laminate | Fully dense, isotropic |
| **Strength across build direction** | Reduced at layer interfaces | Not applicable - no interfaces |
| **Tolerance driver** | Thermal shrinkage | Machine rigidity and positioning |
| **Surface finish** | Visible layer lines | Set by the cutting edge; improvable |
| **Setup effort** | Slice the model | Fixture, set origin, measure tool offsets |
| **Cost driver** | Material mass and print time | Setup time, then cycle time |
| **Design iteration** | Cheap - reprint | Expensive - reprogram and refixture |
| **Materials at MPaCT** | PLA, PETG, TPU, ABS, ASA, PC, PA, PPS, fibre grades | Plastics, machinable wax, brass (lathe only) |
| **Equipment at MPaCT** | [Bambu Lab H2D](../instruments/bambu-lab-h2d.md) | [Haas Desktop Mill](../instruments/haas-desktop-mill.md), [Haas Desktop Lathe](../instruments/haas-desktop-lathe.md) |

## Choose by the question

**"The part has internal channels or a lattice."** - Print. A cutter cannot reach enclosed geometry. This is not a preference; it is the one case where only one process can produce the part at all.

**"A bore has to hold a fit, or a face has to seal."** - Machine. Printed dimensions move with thermal shrinkage, and a layered surface does not seal.

**"It is a sample holder, jig, or equipment adapter."** - Print. Low load, custom geometry, wanted this week, and material cost is grams.

**"It carries a structural load."** - Machine, and check the material rating first. If the load path is structural metal, the desktop machines at MPaCT are not rated for it and an outside shop is the right answer.

**"I expect to revise the design two or three times."** - Print the revisions. Machine the version you settle on, if it needs machining at all.

**"It has to survive a temperature or a solvent."** - Check the polymer's glass transition and chemical compatibility. Where the environment rules out thermoplastics, the question stops being additive versus subtractive and becomes which material, then which process can work it.

**"It is round, on one axis, and needs a thread."** - Turn it. Threads and on-centre bores are what a lathe exists for, and a printed thread is a poor substitute in anything load-bearing.

## Choose by what the part is made of

Material decides more of these cases than geometry does, and it is the constraint most often checked last.

- **Engineering thermoplastic, unloaded or lightly loaded** - either process works. Print unless a tolerance says otherwise.
- **Engineering thermoplastic, structurally loaded** - machine from stock if the geometry allows, because stock is isotropic and a print is not.
- **Brass** - [Desktop Lathe](../instruments/haas-desktop-lathe.md) only, and only within a 0.75 in cutting diameter.
- **Machinable wax** - either desktop machine, typically as a pattern.
- **Aluminium, steel, or stainless** - neither. Nothing at MPaCT is rated for structural metal cutting.

## The two together

The processes are complementary in a way that shows up on real parts.

1. **Print the prototype.** Confirm fit, clearance, ergonomics, and assembly order while changes still cost a reprint.
2. **Machine the interfaces.** Where the settled design needs a bore, a seat, or a sealing face to hold size, that feature is machined even when the body is printed.
3. **Print the fixture that holds the machined part.** Soft-jaw inserts and locating fixtures are geometry-driven, low-load, and disposable - which is exactly what printing is good at.

A workflow that treats them as alternatives usually ends up machining something that should have been printed, or printing something that will not hold its size.

## What cannot be answered here

**Cost comparison.** The [rate sheet](/Rates.html) lists a per-gram recharge rate for the [Bambu H2D](../instruments/bambu-lab-h2d.md); the site's own `rates.json` records the same instrument as pending approval, on a per-hour unit. The two disagree. No rate is published for either Haas machine. A cost comparison between printing and machining is therefore not possible from published information, and none is offered.

**Turnaround.** No scheduling or queue figure is published for any fabrication instrument in this catalogue. Ask the lab.

## Frequently asked questions

### Should I 3D print or CNC machine this part?

Print it if the geometry is the difficult part - internal channels, lattices, undercuts, organic shapes - or if you expect to revise the design more than once. Machine it if a dimension has to hold a tolerance, a surface has to seal or slide, the load is structural, or the material must be fully dense and isotropic. When both would work, print first and machine the revision you settled on.

### Is a CNC machined part stronger than a 3D printed one?

Generally yes, and for two separate reasons. A machined part is cut from stock that is already fully dense with isotropic properties, so it behaves the same in every direction. A printed part is a laminate whose layers are joined by polymer chain diffusion across a partially remelted interface, so it is weaker across the build direction than within a layer. The comparison also usually spans materials - machined brass against printed thermoplastic - which widens the gap further.

### Can 3D printing make features CNC machining cannot?

Yes, and this is the clearest case for printing. A cutting tool has to physically reach every surface it produces, so enclosed internal channels, conformal cooling passages, lattice infill, and closed voids cannot be machined at all. Additive processes build those geometries as a consequence of how they work. Where a part has internal geometry, the choice is not additive versus subtractive - it is additive versus redesigning the part into assembled pieces.

### Which is faster for a single prototype part?

Printing is usually faster in elapsed hands-on time, because the setup is slicing a model rather than fixturing a workpiece, establishing a coordinate origin, and measuring tool offsets. Machining setup does not scale down with part size, so a small simple part still needs the full setup. Actual queue and turnaround times at MPaCT depend on scheduling and are not published; ask the lab rather than planning around an assumed figure.

## Both routes at one facility, in Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University runs a Bambu Lab H2D dual-nozzle FDM printer, a Haas Desktop Mill, and a Haas Desktop Lathe in the same building in Flagstaff, Arizona, alongside a [Voltera V-One PCB printer](/About_Equipment/Voltera_VOne_PCB_Printer.html), an [LPKF ProtoLaser R4](/About_Equipment/LPKF_ProtoLaser.html), and die and wire bonding.

A prototype can therefore move from printed concept to machined feature to populated board as one project with one point of contact. The lab is open to NAU researchers, external academic users, and industry partners; the Haas machines specifically are educational and are accessed through the Lab Manager.

If you are unsure which process your part needs, describe the geometry, the material, and the load and staff will advise before anything is booked.

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Ask which process you need](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
