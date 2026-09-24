---
title: Fused Deposition Modeling (FDM)
description: How FDM 3D printing builds a part layer by layer, why printed parts are weaker along Z, and what the method can and cannot make at NAU in Flagstaff, Arizona.
tags:
  - Fabrication
  - Additive Manufacturing
schema:
  - "@type": DefinedTerm
    name: Fused Deposition Modeling
    alternateName: FDM
    description: >-
      An additive manufacturing process in which thermoplastic filament is melted and extruded
      through a heated nozzle, and deposited layer by layer to build a three-dimensional part.
    inDefinedTermSet: https://nano.nau.edu/knowledge-base/concepts/

  - "@type": DefinedTerm
    name: Anisotropy in Additive Manufacturing
    description: >-
      The direction dependence of a printed part's mechanical properties, arising because
      material deposited within a layer is continuous while adjacent layers are joined only by
      polymer chain interdiffusion across a partially remelted interface, so strength measured
      across the build direction is lower than strength measured within a layer.
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
    name: FDM 3D Printing
    serviceType: Additive manufacturing
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/Reserve_Equipment.html

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: How strong is an FDM printed part?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Strong within a layer and measurably weaker across layers. Material extruded along
            a path is continuous polymer; adjacent layers are joined only where the incoming
            bead remelts the one below and polymer chains diffuse across the interface. That
            bond is real but never reaches bulk strength, so a printed part loaded across the
            build direction fails at the layer interface rather than in the material. Design
            for it by orienting the part so the principal tensile load runs within the layer
            plane.
      - "@type": Question
        name: What is the difference between FDM and resin (SLA) 3D printing?
        acceptedAnswer:
          "@type": Answer
          text: >-
            FDM extrudes molten thermoplastic filament through a nozzle; SLA cures liquid
            photopolymer with light. FDM gives engineering thermoplastics with known
            mechanical properties, larger build volumes, and no post-processing beyond support
            removal. SLA gives finer feature resolution and smoother surfaces, but the cured
            photopolymers are more brittle, degrade under UV, and require a wash and post-cure
            step. Choose FDM for functional parts and SLA for fine detail and appearance.
      - "@type": Question
        name: Can a 3D printed part be used as a functional fixture?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes, and it is one of the strongest uses of the method. Sample holders, alignment
            jigs, tool trays, and equipment adapters are low-load, geometry-driven parts that
            would be slow and expensive to machine and are printed in hours. The constraints
            that matter are temperature and chemistry rather than strength: check the glass
            transition temperature of the filament against the environment, and check solvent
            compatibility before a fixture goes near a cleaning bath.
      - "@type": Question
        name: Why are my layers separating?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Delamination means the incoming bead did not remelt the layer below enough for
            polymer chains to diffuse across the interface. The usual causes are nozzle
            temperature set too low for the material, part cooling too fast in cold ambient
            air, or a layer time so long that the previous layer had cooled below the
            temperature at which it can bond. A heated chamber addresses the second and third
            directly, which is why engineering polymers such as ABS, PC, and PA are printed in
            an enclosed heated build volume rather than an open frame.
      - "@type": Question
        name: Does FDM require support material?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Only where the part overhangs beyond roughly 45 degrees from vertical, or bridges
            an unsupported span. Below that angle each layer is carried by the one beneath it.
            Supports are removed by hand and leave witness marks, so where the surface matters
            the fix is orientation rather than better supports. A second nozzle can print a
            soluble support material such as PVA, which dissolves away and leaves internal
            geometry that hand removal could never reach.
---

# Fused Deposition Modeling (FDM)

Fused deposition modeling is an additive manufacturing process in which thermoplastic filament is drawn into a heated nozzle, melted, and extruded as a thin bead that is deposited along a programmed path. The nozzle traces one cross-section of the part, the build platform indexes down by one layer height, and the next cross-section is deposited on top, fusing to the layer below as it cools.

## How FDM works

Three physical processes decide whether a print succeeds, and all three are thermal.

**Melting and extrusion.** Filament is fed at a controlled rate into a heated block. Volumetric flow is set by feed rate and nozzle diameter, and the melt must reach temperature before it reaches the nozzle - which is what limits print speed on a given hot end far more often than the motion system does.

**Interlayer bonding.** A freshly deposited bead partially remelts the layer beneath it, and polymer chains diffuse across the interface. The strength of that weld depends on how hot the interface gets and how long it stays above the polymer's mobility threshold. This is the origin of every FDM strength characteristic.

**Cooling and shrinkage.** Thermoplastics contract as they cool. Contraction is resisted by the material already bonded to the plate, so internal stress builds through the part. When that stress exceeds bed adhesion, the part lifts at a corner - warping. Materials with higher shrinkage, ABS and PC among them, warp readily in open air and print reliably in a heated chamber.

**Anisotropy follows directly.** Within a layer the material is continuous extruded polymer. Between layers it is a diffusion weld. A part is therefore not one material with one strength but a laminate, and orientation on the build plate is an engineering decision rather than a packing convenience.

## When to use FDM

- **Geometry is the point.** Internal channels, lattices, conformal shapes, and undercuts that no cutter can reach.
- **The part is a fixture, jig, or holder.** Low load, custom geometry, wanted this week.
- **Iteration matters more than finish.** Several design revisions in a day, at material cost.
- **The material must be a known engineering thermoplastic.** PLA, PETG, ABS, ASA, PC, PA, PPS, and fibre-reinforced grades all have published property data.
- **A soluble support is required.** Dual extrusion with PVA reaches internal geometry that hand removal cannot.

## What FDM cannot do

- **Match machined tolerance or surface finish.** The process leaves visible layer lines, and the achievable tolerance is a function of thermal shrinkage rather than of positioning accuracy. Where a fit or a sealing face matters, machine it - see [3D printing vs CNC machining](../compare/3d-printing-vs-cnc-machining.md).
- **Produce isotropic parts.** No process parameter removes the layer interface. It can be made stronger; it cannot be made absent.
- **Print metal.** FDM at MPaCT is thermoplastic only.
- **Survive arbitrary temperatures.** A printed fixture softens near the polymer's glass transition. Check that figure against the environment before it goes into an oven, a chamber, or a vacuum bake.
- **Guarantee dimensional stability over time.** Semi-crystalline materials and fibre-filled grades can creep and absorb moisture, which moves dimensions on parts that are meant to hold them.

## FDM at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University runs a [Bambu Lab H2D](../instruments/bambu-lab-h2d.md) dual-nozzle FDM printer in Flagstaff, Arizona, available to NAU researchers, external academic users, and industry partners.

The specifications that decide what the method can do here:

| Capability | Figure | Why it matters |
|---|---|---|
| Build volume | 325 × 320 × 325 mm single, 300 × 320 × 325 mm dual | Sets the largest part printable in one piece |
| Max nozzle temperature | 350 °C | Reaches high-temperature engineering polymers, not only PLA and PETG |
| Max chamber temperature | 65 °C | The specification that makes ABS, PC, PA, and fibre grades practical rather than warp-prone |
| Max bed temperature | 120 °C | First-layer adhesion for high-shrinkage materials |
| Motion accuracy | 50 µm, vision-assisted encoder | The positioning floor; thermal shrinkage, not motion, sets the achievable tolerance |
| Nozzle | Hardened steel, 0.4 mm standard | Abrasion resistance for carbon- and glass-filled filament |
| Dual extrusion | Yes | Soluble PVA support, or two materials in one part |

Full specifications, materials list, and printer-specific questions are on the [Bambu Lab H2D instrument page](../instruments/bambu-lab-h2d.md). Deciding between printing and machining is covered on the [comparison page](../compare/3d-printing-vs-cnc-machining.md), and choosing a route for a specific part on [Prototype parts and fixtures](../samples/prototype-parts.md).

## What to submit

- A watertight solid model - STEP preferred, STL accepted
- The material, or the environment and loads so one can be recommended
- Which faces are functional, so orientation can be chosen for strength and finish rather than for packing
- Any dimension that must hold a tolerance, called out explicitly
- Whether the part will be exposed to heat, solvents, or UV

## Frequently asked questions

### How strong is an FDM printed part?

Strong within a layer and measurably weaker across layers. Material extruded along a path is continuous polymer; adjacent layers are joined only where the incoming bead remelts the one below and polymer chains diffuse across the interface. That bond is real but never reaches bulk strength, so a printed part loaded across the build direction fails at the layer interface rather than in the material. Design for it by orienting the part so the principal tensile load runs within the layer plane.

### What is the difference between FDM and resin (SLA) 3D printing?

FDM extrudes molten thermoplastic filament through a nozzle; SLA cures liquid photopolymer with light. FDM gives engineering thermoplastics with known mechanical properties, larger build volumes, and no post-processing beyond support removal. SLA gives finer feature resolution and smoother surfaces, but the cured photopolymers are more brittle, degrade under UV, and require a wash and post-cure step. Choose FDM for functional parts and SLA for fine detail and appearance.

### Can a 3D printed part be used as a functional fixture?

Yes, and it is one of the strongest uses of the method. Sample holders, alignment jigs, tool trays, and equipment adapters are low-load, geometry-driven parts that would be slow and expensive to machine and are printed in hours. The constraints that matter are temperature and chemistry rather than strength: check the glass transition temperature of the filament against the environment, and check solvent compatibility before a fixture goes near a cleaning bath.

### Why are my layers separating?

Delamination means the incoming bead did not remelt the layer below enough for polymer chains to diffuse across the interface. The usual causes are nozzle temperature set too low for the material, part cooling too fast in cold ambient air, or a layer time so long that the previous layer had cooled below the temperature at which it can bond. A heated chamber addresses the second and third directly, which is why engineering polymers such as ABS, PC, and PA are printed in an enclosed heated build volume rather than an open frame.

### Does FDM require support material?

Only where the part overhangs beyond roughly 45 degrees from vertical, or bridges an unsupported span. Below that angle each layer is carried by the one beneath it. Supports are removed by hand and leave witness marks, so where the surface matters the fix is orientation rather than better supports. A second nozzle can print a soluble support material such as PVA, which dissolves away and leaves internal geometry that hand removal could never reach.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
