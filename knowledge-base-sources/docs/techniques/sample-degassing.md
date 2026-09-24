---
title: Sample Degassing and Pretreatment
description: Degassing removes adsorbed water and gas before sorption analysis, on a Microtrac BELPREP VAC at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Sample Preparation
  - Porous Materials
schema:
  - "@type": DefinedTerm
    name: Sample Degassing
    alternateName: Adsorption Pretreatment
    description: >-
      A sample preparation step in which physisorbed water and gases are removed from a solid
      by heating it under vacuum or flowing inert gas, so that the surface is clean before an
      adsorption isotherm is measured.
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
    name: Vacuum and Flow Degassing for Adsorption Analysis
    serviceType: Sample preparation
    description: >-
      Removal of physisorbed water and gases from powders, pellets, and molded bodies by
      heating under vacuum or under flowing inert gas, up to 450 degrees Celsius, with
      independently controlled ports.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Microtrac BELPREP VAC Series
    category: Vacuum Degassing and Pretreatment Unit
    url: https://nano.nau.edu/About_Equipment/BELPREP_VAC_Series.html
    manufacturer:
      "@type": Organization
      name: Microtrac MRB
    additionalProperty:
      - "@type": PropertyValue
        name: Models
        value: BELPREP VAC II with three ports; BELPREP VAC III with six ports
      - "@type": PropertyValue
        name: Heating range
        value: Room temperature to 430 degrees Celsius (VAC II); room temperature to 450 degrees Celsius (VAC III)
      - "@type": PropertyValue
        name: Pretreatment modes
        value: Pressure-reducing and heating; flow heating under inert gas, optional on VAC III
      - "@type": PropertyValue
        name: Port control
        value: Each port independently valved, with a single heater setpoint for all ports
      - "@type": PropertyValue
        name: Maximum applied pressure
        value: 0.2 MPa gauge
      - "@type": PropertyValue
        name: Cooling
        value: Radiation zone for controlled cool-down of the sample cell after heating
      - "@type": PropertyValue
        name: Permitted gases
        value: Inert purge gas only; harmful, corrosive, combustible, and poisonous gases are prohibited
      - "@type": PropertyValue
        name: External vacuum pump
        value: Rotary pump, 20 L/min or greater
      - "@type": PropertyValue
        name: Installation environment
        value: 10 to 35 degrees Celsius, 20 to 80 percent relative humidity

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: Why does a sample need to be degassed before BET analysis?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Because a surface exposed to air is already covered. Water and atmospheric gases
            physisorb onto it within minutes, and they occupy the same sites the probe gas
            would fill during the measurement. An incompletely degassed sample therefore
            reports a surface area lower than its true value, and the error is systematic
            rather than random. Degassing is part of the measurement, not preparation for it.
      - "@type": Question
        name: What degassing temperature should I use?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The highest temperature the material tolerates without changing. Higher
            temperatures remove adsorbed species faster and more completely, but sintering,
            decomposition, framework collapse, or loss of structural water all change the
            surface you are trying to measure. Where a material's tolerance is not known,
            the practical approach is to degas a portion at successively higher temperatures
            and stop below the point where the measured area starts to fall.
      - "@type": Question
        name: Can degassing change my sample?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes, and this is the reason the temperature is chosen deliberately rather than set
            to the instrument maximum. Metal-organic frameworks can collapse, hydrated phases
            can lose structural water, fine powders can sinter, and polymers can soften or
            decompose. The BELPREP VAC offers flow heating under inert gas as an alternative
            for samples that are damaged by high vacuum but tolerate heat, and the unit will
            not be set above the heater's maximum operating temperature.
---

# Sample Degassing and Pretreatment

Degassing removes physisorbed water and gases from a solid before an adsorption measurement, by holding the sample under vacuum or flowing inert gas at elevated temperature. Without it, part of the surface is already occupied and the measured surface area comes out low. Degassing is not preparation for the measurement; it sets the baseline the measurement is made against.

## How degassing works

A surface exposed to laboratory air reaches equilibrium with it within minutes. Water is the dominant contaminant on most oxides and framework materials, and it binds strongly enough that pumping alone will not remove it at room temperature. Two variables shift that equilibrium: lowering the pressure above the surface, and raising the temperature of the surface itself.

The BELPREP VAC applies both, in either of two modes:

- **Pressure-reducing and heating.** The sample cell is evacuated by an external rotary pump while the cell sits in a heater block. This is the standard route, and the most complete.
- **Flow heating.** An inert gas is passed over the heated sample instead of evacuating it. Species desorbed from the surface are swept away rather than pumped away. Some materials - fine powders that would be entrained by a pump, or structures that collapse under vacuum - tolerate this where they do not tolerate the first mode.

After heating, the cell is moved into a **radiation zone** to cool in a controlled way before it is weighed and transferred. Cooling matters as much as heating: a hot cell brought straight into room air re-adsorbs water, and a cell weighed before it reaches thermal equilibrium gives a wrong dry mass, which propagates into every per-gram result downstream.

## When to use degassing

- Before any BET surface area or pore size distribution measurement
- Before vapour sorption or chemisorption experiments
- To establish a reliable dry mass for a hygroscopic powder
- Where a batch of samples must be pretreated identically, using independently valved ports
- Where a material is damaged by vacuum but tolerates heat, using flow heating

## What degassing cannot do

- **It does not clean chemisorbed species.** Physisorbed water and gas leave; anything chemically bound to the surface stays, and will still be there during the measurement.
- **It cannot exceed what the material tolerates.** A framework that collapses at 200 °C sets the ceiling, regardless of how much water remains.
- **It does not unblock pores.** Residue, binder, or template blocking a pore mouth is not removed by heating under vacuum.
- **It is not a drying oven substitute.** The ports are sized for adsorption sample cells, not for bulk material.
- **Corrosive, combustible, and toxic gases are prohibited** in the unit, which rules out some pretreatment chemistries entirely.

## The BELPREP VAC at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Microtrac BELPREP VAC** pretreatment unit in Flagstaff, Arizona, alongside the [BELSORP MAX X](gas-sorption-surface-area.md) it feeds. Ports are independently valved, so several samples are pretreated in one cycle under a common temperature program.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Models | VAC II (3 ports); VAC III (6 ports) |
| Heating range | Room temperature to 430 °C (VAC II); to 450 °C (VAC III) |
| Pretreatment modes | Pressure-reducing and heating; flow heating (optional on VAC III) |
| Port control | Individually valved ports, common heater setpoint |
| Maximum applied pressure | 0.2 MPa gauge |
| Cooling | Radiation zone for controlled post-heating cool-down |
| Purge gas | Inert only; corrosive, combustible, and poisonous gases prohibited |
| Vacuum | External rotary pump, ≥ 20 L/min |
| Installation environment | 10–35 °C, 20–80 % RH |

Heating range, ports, and pressure limit follow the BELPREP VAC manuals. The external pump rating follows the [equipment catalogue](/About_Equipment/BELPREP_VAC_Series.html).

[Full BELPREP VAC specifications and booking &rarr;](/About_Equipment/BELPREP_VAC_Series.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** Powders, pellets, granules, and molded bodies in a compatible adsorption sample cell.
- **Thermal limit.** State the highest temperature the material tolerates. This is the single piece of information that determines how the pretreatment is run.
- **Composition.** Declare anything that decomposes, melts, sublimes, or evolves a hazardous gas on heating.
- **Fine powders.** Material light enough to be drawn into the manifold must be retained with glass wool or a filter rod, or run in flow mode.
- **Quantity.** Enough for the downstream measurement, plus allowance for mass loss on degassing.

## Frequently asked questions

### Why does a sample need to be degassed before BET analysis?

Because a surface exposed to air is already covered. Water and atmospheric gases physisorb onto it within minutes, and they occupy the same sites the probe gas would fill during the measurement. An incompletely degassed sample therefore reports a surface area lower than its true value, and the error is systematic rather than random. Degassing is part of the measurement, not preparation for it.

### What degassing temperature should I use?

The highest temperature the material tolerates without changing. Higher temperatures remove adsorbed species faster and more completely, but sintering, decomposition, framework collapse, or loss of structural water all change the surface you are trying to measure. Where a material's tolerance is not known, the practical approach is to degas a portion at successively higher temperatures and stop below the point where the measured area starts to fall.

### Can degassing change my sample?

Yes, and this is the reason the temperature is chosen deliberately rather than set to the instrument maximum. Metal–organic frameworks can collapse, hydrated phases can lose structural water, fine powders can sinter, and polymers can soften or decompose. The BELPREP VAC offers flow heating under inert gas as an alternative for samples that are damaged by high vacuum but tolerate heat, and the unit will not be set above the heater's maximum operating temperature.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
