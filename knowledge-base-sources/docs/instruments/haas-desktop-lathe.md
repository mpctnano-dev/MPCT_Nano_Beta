---
title: Haas Desktop Lathe
description: A benchtop CNC turning centre with a full Haas control, 63 mm chuck and 6-station turret, for CNC training at NAU in Flagstaff, Arizona.
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
    name: CNC Turning Instruction and Benchtop Prototyping
    serviceType: Education and fabrication
    description: >-
      Hands-on instruction in lathe G-code programming and turning centre operation on an
      industry-standard Haas control, and benchtop turning of brass, plastics, and machinable
      wax.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/Contact_Us.html?category=equipment

  - "@type": IndividualProduct
    name: Haas Desktop Lathe
    category: Benchtop CNC Turning Centre
    url: https://nano.nau.edu/About_Equipment/Haas_DesktopLathe.html
    manufacturer:
      "@type": Organization
      name: Haas Automation
    additionalProperty:
      - "@type": PropertyValue
        name: Chuck size
        value: 2.5 in (63 mm)
      - "@type": PropertyValue
        name: Maximum cutting diameter
        value: 0.75 in (19 mm)
      - "@type": PropertyValue
        name: Axis travels
        value: X 2.70 in (69 mm), Z 2.75 in (70 mm)
      - "@type": PropertyValue
        name: Spindle speed
        value: 3,000 rpm maximum; must not be run below 500 rpm
      - "@type": PropertyValue
        name: Spindle power
        value: 1.5 hp (1.1 kW)
      - "@type": PropertyValue
        name: Turret
        value: 6 stations, 3 outside diameter (6 by 6 by 8 mm) and 3 inside diameter (16 mm)
      - "@type": PropertyValue
        name: Machine weight
        value: 265 lb (120 kg)
      - "@type": PropertyValue
        name: Power requirement
        value: 110 VAC at 15 A, or 220 VAC at 9 A
      - "@type": PropertyValue
        name: Connectivity
        value: Ethernet and WiFi

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What materials can the Haas Desktop Lathe cut?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Brass, plastics, and machinable wax. Haas rates the machine for these, and its
            1.5 horsepower spindle and 0.75 inch maximum cutting diameter are sized to match.
            Steel and other heavy metal removal are outside the rating. The material list is
            slightly broader than the Desktop Mill's because turning brass at small diameter
            demands less of the machine than milling it does.
      - "@type": Question
        name: What is the largest part the Desktop Lathe can turn?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The chuck takes 2.5 inches (63 mm), but the maximum cutting diameter is 0.75 inch
            (19 mm) and the travels are 2.70 inch in X and 2.75 inch in Z. In practice this
            means short parts under about 19 mm diameter. It is a training and small-part
            machine, and part size is the first constraint most users meet.
      - "@type": Question
        name: Why must the lathe spindle not run below 500 rpm?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Haas warns that running the spindle slower than 500 rpm will cause it to overheat,
            because the spindle motor depends on rotation for cooling. This sets a floor on
            surface speed. On small diameters it is rarely a constraint, since 500 rpm on a
            19 mm part is already a low surface speed; it matters most when a student
            programs a conservative finishing pass out of caution.
---

# Haas Desktop Lathe

The Haas Desktop Lathe is a benchtop CNC turning centre that runs a full-function Haas control in a portable enclosure. It takes a 2.5 inch chuck, turns up to 0.75 inch diameter, carries a 6-station turret, and runs from a standard wall outlet. It is rated for brass, plastics, and machinable wax, and it exists to teach lathe programming on the same control found on production machines.

## What it is for

Turning is programmed differently from milling. The coordinate system is two-axis, diameters are usually programmed rather than radii, tool nose radius compensation behaves differently, and canned cycles for roughing, grooving, and threading have no direct milling equivalent. A student who has only used a mill has not learned a lathe.

The Desktop Lathe supplies that instruction with the industrially relevant part intact - the Haas control, the turret, the setup workflow - and the expensive parts removed. It has:

- **A full Haas CNC control**, identical in interface and G-code to a production Haas turning centre
- **A 6-station turret**, three outside-diameter and three inside-diameter stations, so tool indexing and turret offsets are learned properly rather than simulated
- **Real workholding**, with three wedge clamps and an anti-rotation pin supplied

It does not have flood coolant, three-phase power, or the capacity to cut steel - none of which change how the control is programmed.

For the method itself - how milling and turning differ, what a setup requires, and where chatter comes from - see [CNC Machining](../techniques/cnc-machining.md). For choosing between machining and printing, see [3D printing vs CNC machining](../compare/3d-printing-vs-cnc-machining.md).

## When to use it

- Teaching lathe G-code, canned cycles, and turret setup
- Turning small brass and plastic parts, bushings, and fixture components
- Making adapters and spacers for use with other instruments in the lab
- Machining wax patterns for casting instruction
- Classroom demonstrations and outreach

## What it cannot do

- **Maximum cutting diameter is 0.75 inch.** This is the binding constraint on almost every job.
- **No steel or heavy metal removal.** Rated for brass, plastics, and machinable wax.
- **Air or no coolant.** No high-pressure flood system, which limits chip clearing and heat removal.
- **Spindle floor of 500 rpm.** Very slow finishing passes are not available.
- **Two axes.** No live tooling, no C axis, so no milled features on a turned part.
- **Educational access only.** This instrument cannot be independently reserved.

## The Desktop Lathe at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Haas Desktop Lathe** in Flagstaff, Arizona as part of its instructional equipment. It is reserved for educational use and is not available for independent reservation; access is arranged through the Lab Manager.

| Specification | Value |
|---|---|
| Chuck size | 2.5 in (63 mm) |
| Max cutting diameter | 0.75 in (19 mm) |
| X-axis travel | 2.70 in (69 mm) |
| Z-axis travel | 2.75 in (70 mm) |
| Spindle speed | 3,000 rpm max (do not run below 500 rpm) |
| Spindle power | 1.5 hp (1.1 kW) |
| Turret | 6 stations: 3 OD (6 × 6 × 8 mm), 3 ID (16 mm) |
| Machine weight | 265 lb (120 kg) |
| Power requirement | 110 VAC @ 15 A, or 220 VAC @ 9 A |
| Connectivity | Ethernet and WiFi |
| Rated materials | Brass, plastics, machinable wax |

Specifications are as published by Haas Automation for the Desktop Lathe.

[Full Desktop Lathe specifications &rarr;](/About_Equipment/Haas_DesktopLathe.html){ .md-button .md-button--primary }

## Access

This instrument is reserved for educational purposes and cannot be independently reserved. Course instructors and students should arrange access through the Lab Manager. See also the [Haas Desktop Mill](haas-desktop-mill.md), which pairs with it for milling instruction.

## Frequently asked questions

### What materials can the Haas Desktop Lathe cut?

Brass, plastics, and machinable wax. Haas rates the machine for these, and its 1.5 horsepower spindle and 0.75 inch maximum cutting diameter are sized to match. Steel and other heavy metal removal are outside the rating. The material list is slightly broader than the Desktop Mill's because turning brass at small diameter demands less of the machine than milling it does.

### What is the largest part the Desktop Lathe can turn?

The chuck takes 2.5 inches (63 mm), but the maximum cutting diameter is 0.75 inch (19 mm) and the travels are 2.70 inch in X and 2.75 inch in Z. In practice this means short parts under about 19 mm diameter. It is a training and small-part machine, and part size is the first constraint most users meet.

### Why must the lathe spindle not run below 500 rpm?

Haas warns that running the spindle slower than 500 rpm will cause it to overheat, because the spindle motor depends on rotation for cooling. This sets a floor on surface speed. On small diameters it is rarely a constraint, since 500 rpm on a 19 mm part is already a low surface speed; it matters most when a student programs a conservative finishing pass out of caution.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
