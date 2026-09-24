---
title: Seebeck Coefficient and Resistivity
description: Simultaneous Seebeck coefficient and resistivity measurement on a LINSEIS LSR-3 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Electrical
  - Thermoelectrics
schema:
  - "@type": DefinedTerm
    name: Seebeck Coefficient Measurement
    alternateName: Thermoelectric Characterization
    description: >-
      An electrical characterization method that measures the voltage generated
      by a temperature gradient across a sample, the Seebeck coefficient, and
      the electrical resistivity by a four-terminal method, usually as a
      function of temperature.
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
    name: Seebeck Coefficient and Electrical Resistivity Measurement
    serviceType: Thermoelectric characterization
    description: >-
      Simultaneous Seebeck coefficient and four-terminal resistivity
      measurement of bulk thermoelectric samples versus temperature.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: LINSEIS LSR-3
    category: Seebeck and resistivity analyzer
    url: https://nano.nau.edu/About_Equipment/Seebeck_Resistivity_Instrument.html
    manufacturer:
      "@type": Organization
      name: LINSEIS
    additionalProperty:
      - "@type": PropertyValue
        name: Temperature options
        value: Approximately -100 C to 500 C; up to 1500 C with furnace options
      - "@type": PropertyValue
        name: Sample sizes
        value: Bars or cylinders up to 23 mm long; discs 10, 12.7, or 25.4 mm
      - "@type": PropertyValue
        name: Seebeck method
        value: Static gradient or slope method with dual thermocouples
      - "@type": PropertyValue
        name: Resistivity method
        value: DC four-terminal, 0 to 160 mA source
      - "@type": PropertyValue
        name: Atmospheres
        value: Inert, oxidizing, reducing, or vacuum

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is the Seebeck coefficient?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The Seebeck coefficient is the voltage generated per kelvin of
            temperature difference across a material. Together with electrical
            resistivity and thermal conductivity it determines the
            thermoelectric figure of merit ZT. The LSR-3 measures Seebeck and
            resistivity on the same bulk sample; thermal conductivity is a
            different instrument.
      - "@type": Question
        name: What sample size does the LSR-3 take?
        acceptedAnswer:
          "@type": Answer
          text: >-
            LINSEIS specifies bars or cylinders with a small footprint and
            length up to 23 mm, and discs of 10, 12.7, or 25.4 mm. The
            catalogue lists bars and cylinders 6 to 23 mm in length and the
            same disc diameters. Thin-film adapters exist as an option; do not
            assume one is installed.
      - "@type": Question
        name: How hot or cold can the measurement go?
        acceptedAnswer:
          "@type": Answer
          text: >-
            LINSEIS sells three furnaces: a low-temperature furnace from
            -100 C to 500 C, infrared furnaces to 800 C or 1100 C, and a
            resistance furnace to 1500 C. The catalogue quotes approximately
            -100 C to 500 C, with 1500 C as a furnace option. Which furnace is
            fitted is not asserted here; ask staff before planning a 1500 C run.
      - "@type": Question
        name: Can the LSR-3 measure ZT by itself?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Not in the base configuration. ZT needs thermal conductivity as
            well as Seebeck and resistivity. LINSEIS offers a Harman option
            for a direct ZT on thermoelectric legs; that option is not claimed
            as installed. A full ZT usually combines this instrument with a
            thermal-conductivity measurement.
      - "@type": Question
        name: Why is my Seebeck coefficient noisier than the resistivity?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Seebeck is a small voltage on a small gradient. Poor thermal
            contact, a gradient that is not steady, or thermocouple placement
            that is not the electrical contact will scatter S while four-wire
            resistivity still looks clean. LINSEIS states Seebeck accuracy of
            about plus or minus 7 percent and resistivity about plus or minus
            10 percent; contact quality is how you get inside those bands.
---

# Seebeck Coefficient and Resistivity

Seebeck coefficient measurement is an electrical characterization method that records the voltage generated by a temperature gradient across a sample, together with four-terminal electrical resistivity, usually versus temperature. The two numbers describe a thermoelectric material. Thermal conductivity, and therefore ZT, is a separate measurement unless a dedicated option is fitted.

## How Seebeck and resistivity measurement works

The sample is clamped between electrodes. A heater sets a gradient. Two thermocouples measure temperatures and the voltage between them. The slope of voltage versus ΔT is the Seebeck coefficient (static DC / slope method). Resistivity is a DC four-terminal measurement with a current source specified at 0–160 mA, optional 220 mA.

LINSEIS specifies atmospheres of inert, oxidizing, reducing, or vacuum, water cooling, and sample sizes of bars or cylinders up to 23 mm long and discs of 10, 12.7, or 25.4 mm. Published Seebeck accuracy is about ±7% with ±3.5% repeatability; resistivity about ±10% with ±5% repeatability. Those are manufacturer figures, not in-house measurements.

Which of the three furnaces is installed is not asserted. The catalogue leads with approximately −100 °C to 500 °C and names 1500 °C as a furnace option.

## When to use Seebeck and resistivity measurement

- Bulk thermoelectric legs, bars, and discs
- Tracking S and ρ versus temperature in a chosen atmosphere
- Comparing doped samples on the same geometry
- Feeding a ZT calculation once thermal conductivity is known from another method

## What Seebeck and resistivity measurement cannot do

- **It does not measure thermal conductivity.** No κ, no ZT, unless a Harman option is actually installed.
- **Thin films need an adapter that may not be fitted.** Default geometry is bulk.
- **Accuracy bands are manufacturer typical, not a certificate for your contact.**
- **1500 °C is an option, not a promise.** Confirm the furnace.

## The LSR-3 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **LINSEIS LSR-3** Seebeck and resistivity system in Flagstaff, Arizona. The catalogue specifies approximately −100 °C to 500 °C with furnace options to 1500 °C; bars and cylinders 6–23 mm long; discs 10, 12.7, or 25.4 mm; static gradient / slope Seebeck with dual thermocouples; DC four-terminal resistivity; and inert, oxidizing, reducing, or vacuum atmospheres. The instrument is listed as available. It is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Temperature | Approx. −100 °C to 500 °C; up to 1500 °C with furnace options |
| Bar / cylinder samples | Length up to 23 mm |
| Disc samples | 10, 12.7, or 25.4 mm |
| Seebeck method | Static gradient / slope, dual thermocouples |
| Resistivity | DC four-terminal, 0–160 mA (optional 220 mA) |
| Atmospheres | Inert, oxidizing, reducing, or vacuum |

Figures follow the [equipment catalogue](/About_Equipment/Seebeck_Resistivity_Instrument.html) and LINSEIS LSR-3 published specifications.

[Full LSR-3 specifications and booking &rarr;](/About_Equipment/Seebeck_Resistivity_Instrument.html){ .md-button .md-button--primary }

## Sample requirements

- **Geometry.** A bar, cylinder, or disc that matches the table. Parallel faces and known length between thermocouple contacts.
- **Contacts.** Say if the material is difficult to contact. Oxide skins wreck both S and ρ.
- **Atmosphere.** Inert is the usual request. Oxidizing or reducing must be stated.
- **Temperature.** State the maximum. Do not assume 1500 °C.

## Frequently asked questions

### What is the Seebeck coefficient?

The Seebeck coefficient is the voltage generated per kelvin of temperature difference across a material. Together with electrical resistivity and thermal conductivity it determines the thermoelectric figure of merit ZT. The LSR-3 measures Seebeck and resistivity on the same bulk sample; thermal conductivity is a different instrument.

### What sample size does the LSR-3 take?

LINSEIS specifies bars or cylinders with a small footprint and length up to 23 mm, and discs of 10, 12.7, or 25.4 mm. The catalogue lists bars and cylinders 6 to 23 mm in length and the same disc diameters. Thin-film adapters exist as an option; do not assume one is installed.

### How hot or cold can the measurement go?

LINSEIS sells three furnaces: a low-temperature furnace from -100 C to 500 C, infrared furnaces to 800 C or 1100 C, and a resistance furnace to 1500 C. The catalogue quotes approximately -100 C to 500 C, with 1500 C as a furnace option. Which furnace is fitted is not asserted here; ask staff before planning a 1500 C run.

### Can the LSR-3 measure ZT by itself?

Not in the base configuration. ZT needs thermal conductivity as well as Seebeck and resistivity. LINSEIS offers a Harman option for a direct ZT on thermoelectric legs; that option is not claimed as installed. A full ZT usually combines this instrument with a thermal-conductivity measurement.

### Why is my Seebeck coefficient noisier than the resistivity?

Seebeck is a small voltage on a small gradient. Poor thermal contact, a gradient that is not steady, or thermocouple placement that is not the electrical contact will scatter S while four-wire resistivity still looks clean. LINSEIS states Seebeck accuracy of about plus or minus 7 percent and resistivity about plus or minus 10 percent; contact quality is how you get inside those bands.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
