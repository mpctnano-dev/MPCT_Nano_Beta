---
title: Prototype Parts and Fixtures
description: You need a part made - how to choose between 3D printing, milling, and turning by geometry, material, and load, using the fabrication equipment at NAU in Flagstaff.
tags:
  - Sample Type
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
  - "@type": Service
    name: Prototype Fabrication
    serviceType: Rapid prototyping and machining
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
---

# Prototype Parts and Fixtures

You have a design, or a problem that needs a physical part, and you need it made. This page is organised by what the part has to do rather than by which machine is free.

## What can be made, and with what

| Your part | Process | Equipment | Key limit |
|---|---|---|---|
| Sample holder or alignment jig | [FDM printing](../techniques/additive-manufacturing-fdm.md) | Bambu Lab H2D | Softens near the polymer's glass transition |
| Enclosure or housing | FDM printing | Bambu Lab H2D | 325 × 320 × 325 mm in one piece |
| Part with internal channels or lattice | FDM printing | Bambu Lab H2D | Additive only - no cutter reaches it |
| Prismatic part needing a tolerance | [CNC milling](../techniques/cnc-machining.md) | Haas Desktop Mill | Plastics and machinable wax only |
| Shaft, pin, bushing, or threaded stud | [CNC turning](../techniques/cnc-machining.md) | Haas Desktop Lathe | 0.75 in max cutting diameter; brass, plastics, wax |
| Soft-jaw or workholding insert | FDM printing | Bambu Lab H2D | Print it, then machine the located face if needed |
| Two-material or soluble-support part | Dual-nozzle FDM | Bambu Lab H2D | Second nozzle reduces build volume to 300 mm in X |
| Printed circuit board prototype | [Conductive ink](../techniques/conductive-ink-pcb-printing.md) or [laser structuring](../techniques/laser-micromachining.md) | Voltera V-One, LPKF ProtoLaser R4 | Ink at 0.2 mm; laser at tens of micrometres |
| Microscale pattern on a wafer or coupon | [Photolithography](../techniques/photolithography.md) | SUSS MJB4 | Photomask required; 0.5–1.0 µm |
| Stamp-replicated nano-pattern | [Nanoimprint lithography](../techniques/nanoimprint-lithography.md) | NIL Technology CNI v3.0 | Master required; ~40 nm floor |
| Coupon cut from a wafer | [Wafer scribing](../techniques/wafer-scribing.md) | PELCO FlexScribe 300 | Brittle materials, 5 mm to 300 mm |
| Die or wire bonded assembly | [Die attach, wire bond](../techniques/die-and-wire-bonding.md) | Tresky T-4909-AE, West-Bond 7700D | Assembly, not part-making |
| Structural metal part | Not available here | - | Nothing at MPaCT is rated to cut structural metal |

## Decide in this order

Checking these in sequence resolves most parts in under a minute. Checking them in a different order is how a project discovers at the machine that the material was never an option.

1. **Material first.** The Haas Desktop Mill is rated for plastics and machinable wax; the Desktop Lathe for brass, plastics, and machinable wax. If the part must be aluminium, steel, or stainless, it cannot be made here and the rest of the decision does not apply.
2. **Then internal geometry.** Enclosed channels, lattices, and closed voids can only be printed.
3. **Then tolerance and function.** A bore that must hold a fit, a face that must seal, or a thread that must carry load is machined.
4. **Then load direction.** A printed part is weaker across its layers. If the principal load cannot be oriented into the layer plane, machine it.
5. **Then revision count.** Expecting to change the design? Print the iterations and commit to machining once.

Where the answer is still ambiguous, [3D printing vs CNC machining](../compare/3d-printing-vs-cnc-machining.md) works through the trade-offs in detail.

## Practical notes by part type

**Fixtures and sample holders.** The highest-value use of the printer. Custom geometry, low load, needed once. Check two things before printing: the glass transition temperature of the filament against wherever the fixture will sit, and solvent compatibility if it will be cleaned. A holder that goes into a vacuum bake or an ultrasonic bath fails on chemistry rather than on strength.

**Enclosures.** Print. Orient so that mounting bosses and threaded inserts sit within the layer plane rather than across it, since a boss loaded across its layers is the most common failure on printed housings.

**Round parts.** Turn them if they are under 0.75 in in diameter and made of brass, plastic, or wax. Above that diameter, or in any other material, the lathe is not the route.

**Parts with both round and prismatic features.** Two setups. Establish a datum in the first operation that the second can reference, or the features will not be concentric.

**Anything going into an instrument.** Say so. A fixture destined for the SEM chamber, the environmental chamber, or the probe station has vacuum, outgassing, or temperature constraints that change the material choice before the geometry is even discussed.

## What to submit

- A watertight solid model - STEP preferred, STL accepted for printing
- The material, or the environment and loads so one can be recommended
- Which faces are functional and which are cosmetic
- Any dimension that must hold a tolerance, called out explicitly
- Whether the part will meet heat, vacuum, solvents, or UV
- Quantity, because machining setup does not scale down with part count

## Prototype fabrication in Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds dual-nozzle FDM printing, desktop CNC milling and turning, PCB prototyping by conductive ink and by laser structuring, die bonding, and wire bonding in one facility in Flagstaff, Arizona. A prototype can move from printed concept through machined feature to populated and bonded assembly as a single project.

The lab is open to NAU researchers, external academic users, and industry partners. The [Bambu Lab H2D](../instruments/bambu-lab-h2d.md) can be reserved directly and appears on the [rate sheet](/Rates.html); the [Haas machines](../techniques/cnc-machining.md) are educational equipment accessed through the Lab Manager.

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Discuss a fabrication project](/Contact_Us.html?category=equipment){ .md-button .md-button--primary }
