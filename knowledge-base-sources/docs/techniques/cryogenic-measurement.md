---
title: Cryogenic Electrical and Optical Measurement
description: Closed-cycle cryogenic measurement from 3.2 K to 350 K on a Montana CryoAdvance 50 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Electrical
  - Cryogenics
schema:
  - "@type": DefinedTerm
    name: Closed-Cycle Optical Cryostat Measurement
    alternateName: Cryogenic Electrical Measurement
    description: >-
      A characterization method in which a sample is cooled in vacuum by a
      closed-cycle cryocooler, without liquid helium, so that electrical
      transport and optical measurements can be made from a few kelvin to
      above room temperature.
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
    name: Cryogenic Electrical and Optical Measurement
    serviceType: Low-temperature characterization
    description: >-
      Variable-temperature electrical transport and optical access from 3.2 K
      to 350 K in a closed-cycle, sample-in-vacuum cryostat.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Montana Instruments CryoAdvance 50
    category: Closed-cycle optical cryostat
    url: https://nano.nau.edu/About_Equipment/Montana_CryoStation.html
    manufacturer:
      "@type": Organization
      name: Montana Instruments
    additionalProperty:
      - "@type": PropertyValue
        name: Temperature range
        value: 3.2 K to 350 K
      - "@type": PropertyValue
        name: Cooling power
        value: 130 mW at 4.2 K
      - "@type": PropertyValue
        name: Sample space
        value: 53 mm diameter by 116 mm
      - "@type": PropertyValue
        name: Optical access
        value: 5 windows, 60 degree full angle
      - "@type": PropertyValue
        name: Electrical wiring
        value: 20 DC lines and 2 RF feedthroughs
      - "@type": PropertyValue
        name: Temperature stability
        value: Less than 10 mK peak to peak
      - "@type": PropertyValue
        name: Platform vibration
        value: Less than 5 nm peak to peak

  - "@type": IndividualProduct
    name: Rutherford Titan 10
    category: Liquid nitrogen generator and storage dewar
    url: https://nano.nau.edu/About_Equipment/LN2_Storage_Dewars.html
    manufacturer:
      "@type": Organization
      name: Rutherford and Titan
    additionalProperty:
      - "@type": PropertyValue
        name: Production capacity
        value: Up to 10 L per day
      - "@type": PropertyValue
        name: Storage tank
        value: 55 L vacuum-insulated dewar
      - "@type": PropertyValue
        name: Electrical service
        value: 120 V, 60 Hz

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is a closed-cycle optical cryostat?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A closed-cycle cryostat cools a sample with a mechanical cryocooler
            rather than with liquid helium. The CryoAdvance 50 is sample-in-vacuum,
            with windows for optical access and DC plus RF wiring for transport.
            Base temperature is specified at 3.2 K. Electricity runs the cooler;
            helium is not consumed.
      - "@type": Question
        name: How cold does the CryoAdvance 50 go?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Montana Instruments specifies 3.2 K to 350 K at the platform, 130 mW
            of cooling power at 4.2 K, and a typical cooldown to 4.2 K of about
            two hours. Peak-to-peak temperature stability is specified below
            10 mK and platform vibration below 5 nm, with the vibration figure
            stated for a damped manual positioner.
      - "@type": Question
        name: Do I need liquid helium for measurements at NAU?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Not for this cryostat. The CryoAdvance 50 is closed-cycle. Liquid
            nitrogen on site is a separate supply, the Rutherford Titan 10
            generator, used for dewars and for instruments that take LN2, not
            as the cryogen for this cooler.
      - "@type": Question
        name: Can I do photoluminescence inside the cryostat?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Optically, yes: five windows, 60 degree full angle, four side and
            one top. Electrically, 20 DC lines and two RF feedthroughs are
            specified. Combining that access with the Edinburgh FLS1000 or
            another spectrometer is a setup question for staff, not a guarantee
            that a turnkey PL cryostat experiment is already aligned.
      - "@type": Question
        name: Why did my sample not reach the setpoint?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Heat load. Poor thermal anchoring, too many warm wires, a window
            load, or a sample that dissipates power will hold the platform
            above the empty-cryostat specification. The 130 mW figure is at
            4.2 K on the cooler, not a budget for an unanchored package. Check
            mounting, radiation shielding, and wiring before assuming the
            cooler has failed.
---

# Cryogenic Electrical and Optical Measurement

Closed-cycle optical cryostat measurement is a characterization method in which a sample is cooled in vacuum by a mechanical cryocooler, without liquid helium. Electrical transport and optical access are available from a few kelvin to above room temperature. The cooler runs on electricity; helium is not consumed.

## How closed-cycle cryogenic measurement works

A Gifford-McMahon or similar cold head removes heat from a sample platform in vacuum. Radiation shields and windows keep the optical path while blocking room-temperature load. Temperature is controlled on the platform; the sample reaches that temperature only if it is anchored.

The Montana Instruments CryoAdvance 50 is specified at 3.2–350 K, 130 mW cooling power at 4.2 K, sample space Ø53 mm × 116 mm, five windows at 60° full angle, 20 DC lines plus 2 RF feedthroughs, peak-to-peak temperature stability below 10 mK, and platform vibration below 5 nm (stated with a damped manual positioner). Typical cooldown to 4.2 K is about two hours.

On-site liquid nitrogen is a separate instrument: the Rutherford Titan 10 generator, specified at up to 10 L/day into a 55 L vacuum-insulated tank. It fills dewars and supports instruments that take LN2. It is not the cryogen for the CryoAdvance 50. Catalogue purity and circuit-amp ratings disagree with one of the manufacturer's public pages; those two figures are not published as fact here.

## When to use cryogenic measurement

- Resistivity, Hall, or I–V versus temperature down to a few kelvin
- Optical spectroscopy or imaging of a sample that must be cold, through the windows
- Devices that cannot be dunked in liquid helium
- Experiments that need hours at a stable setpoint rather than a single shot in a bath

## What cryogenic measurement cannot do

- **The sample is in vacuum, not in exchange gas, unless a specific option is fitted.** Gas-environment work is a different cryostat.
- **<5 nm vibration is a platform specification with a damped positioner, not a guarantee at the sample.** An undamped mount, a cable, or a turbo will be noisier.
- **130 mW at 4.2 K is not a budget for a warm package.** Anchoring is the measurement.
- **It is not a dilution refrigerator.** 3.2 K is the specified floor, not millikelvin.
- **LN2 generation is not a temperature controller.** The Titan 10 makes liquid nitrogen; it does not set a 4 K setpoint.

## The CryoAdvance 50 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a **Montana Instruments CryoAdvance 50** closed-cycle optical cryostat in Flagstaff, Arizona, with on-site LN2 from a **Rutherford Titan 10** generator. Both are listed as expected rather than available. Confirm live status on the catalogue pages before planning a cooldown.

When the cryostat is in service it is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Temperature range | 3.2 K to 350 K |
| Cooling power | 130 mW at 4.2 K |
| Sample space | Ø53 mm × 116 mm |
| Optical access | 5 windows, 60° full angle |
| Electrical | 20 DC lines + 2 RF feedthroughs |
| Temperature stability | <10 mK peak to peak |
| Platform vibration | <5 nm peak to peak |
| Typical cooldown to 4.2 K | ~2 h |

Figures follow the [CryoAdvance 50 catalogue page](/About_Equipment/Montana_CryoStation.html) and Montana Instruments' published CryoAdvance-50 specification. LN2 supply: [Titan 10](/About_Equipment/LN2_Storage_Dewars.html).

[Full CryoAdvance 50 specifications and booking &rarr;](/About_Equipment/Montana_CryoStation.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** A coupon or device that fits the Ø53 mm × 116 mm space and can be anchored to the platform.
- **Wiring.** Say how many DC and RF connections you need. 20 DC and 2 RF are the specified feedthroughs.
- **Optical.** Say the wavelength and whether you need a side window or the top window.
- **Heat load.** State dissipation. An unanchored heater will not reach 3.2 K.
- **LN2.** If you need a dewar fill rather than a cryostat run, that is the Titan 10, not this page's measurement.

## Frequently asked questions

### What is a closed-cycle optical cryostat?

A closed-cycle cryostat cools a sample with a mechanical cryocooler rather than with liquid helium. The CryoAdvance 50 is sample-in-vacuum, with windows for optical access and DC plus RF wiring for transport. Base temperature is specified at 3.2 K. Electricity runs the cooler; helium is not consumed.

### How cold does the CryoAdvance 50 go?

Montana Instruments specifies 3.2 K to 350 K at the platform, 130 mW of cooling power at 4.2 K, and a typical cooldown to 4.2 K of about two hours. Peak-to-peak temperature stability is specified below 10 mK and platform vibration below 5 nm, with the vibration figure stated for a damped manual positioner.

### Do I need liquid helium for measurements at NAU?

Not for this cryostat. The CryoAdvance 50 is closed-cycle. Liquid nitrogen on site is a separate supply, the Rutherford Titan 10 generator, used for dewars and for instruments that take LN2, not as the cryogen for this cooler.

### Can I do photoluminescence inside the cryostat?

Optically, yes: five windows, 60 degree full angle, four side and one top. Electrically, 20 DC lines and two RF feedthroughs are specified. Combining that access with the Edinburgh FLS1000 or another spectrometer is a setup question for staff, not a guarantee that a turnkey PL cryostat experiment is already aligned.

### Why did my sample not reach the setpoint?

Heat load. Poor thermal anchoring, too many warm wires, a window load, or a sample that dissipates power will hold the platform above the empty-cryostat specification. The 130 mW figure is at 4.2 K on the cooler, not a budget for an unanchored package. Check mounting, radiation shielding, and wiring before assuming the cooler has failed.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
