---
title: Spatial Light Modulation
description: Phase-only spatial light modulation for wavefront control on a Thorlabs EXULUS-HD2HP at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Optics
  - Characterization
schema:
  - "@type": DefinedTerm
    name: Spatial Light Modulation
    alternateName: SLM
    description: >-
      An optical method in which a liquid-crystal-on-silicon panel imposes a
      programmed phase pattern on a reflected beam, shaping wavefronts for
      holography, beam steering, and structured illumination.
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
    name: Spatial Light Modulation
    serviceType: Optical wavefront control
    description: >-
      Phase-only reflective LCoS spatial light modulation for wavefront
      shaping in the visible to near infrared.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Thorlabs EXULUS-HD2HP
    category: Spatial light modulator
    url: https://nano.nau.edu/About_Equipment/Spatial_Light_Modulator.html
    manufacturer:
      "@type": Organization
      name: Thorlabs
    additionalProperty:
      - "@type": PropertyValue
        name: Technology
        value: Reflective LCoS, phase-only
      - "@type": PropertyValue
        name: Active area
        value: 15.42 mm by 9.66 mm
      - "@type": PropertyValue
        name: Resolution
        value: 1920 by 1200
      - "@type": PropertyValue
        name: Fill factor
        value: Greater than 92 percent
      - "@type": PropertyValue
        name: Phase range
        value: 2 pi at 633 nm
      - "@type": PropertyValue
        name: Operating wavelength
        value: 400 to 850 nm
      - "@type": PropertyValue
        name: Cooling
        value: Liquid-cooled head with external chiller

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is a spatial light modulator?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A spatial light modulator is a pixelated panel that changes the
            phase, and sometimes the amplitude, of light reflected from each
            pixel. The EXULUS-HD2HP is phase-only, reflective LCoS. A pattern
            written to the panel becomes a wavefront on the beam.
      - "@type": Question
        name: What wavelength does the EXULUS-HD2HP cover?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Thorlabs specifies 400 to 850 nm, 2 pi phase at 633 nm, 1920 by
            1200 pixels, 8 micrometre pitch, and an active area of 15.42 by
            9.66 mm. The catalogue's "pi or 2 pi, model dependent" is the
            series language. This model is specified at 2 pi at 633 nm.
      - "@type": Question
        name: Why does the high-power SLM need a chiller?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Phase stability. The HD2HP is the high-power, liquid-cooled head,
            specified for optical power handling up to 200 W per square
            centimetre and flickering below 0.01 percent RMS. Without cooling,
            absorbed power shifts the liquid-crystal phase. The chiller is
            part of the instrument, not an optional extra for this model.
      - "@type": Question
        name: Can I use the SLM as a display or an intensity modulator?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Not as specified. This panel is phase-only. Amplitude modulation
            and colour display are different devices. You can convert phase
            into intensity with a downstream analyzer or a Fourier filter, but
            that is an optical setup, not a mode on the panel.
      - "@type": Question
        name: Why is my reconstructed hologram dim or noisy?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Fill factor, bit depth, and incident polarisation. The panel is
            specified at greater than 92 percent fill factor and 8-bit drive
            over HDMI. Light that is not polarised for the liquid crystal, or
            a pattern that is not calibrated at the working wavelength, dumps
            power into the zeroth order. Calibrate phase versus grey level at
            the wavelength you actually use.
---

# Spatial Light Modulation

Spatial light modulation is an optical method in which a liquid-crystal-on-silicon panel imposes a programmed phase pattern on a reflected beam. The pattern shapes the wavefront for holography, beam steering, and structured illumination. The panel is a phase device, not a projector.

## How spatial light modulation works

Each pixel of a reflective LCoS backplane sets the optical path of the light that hits it. A computer writes an 8-bit image over an HDMI-compatible input. USB handles control. Polarisation of the incoming beam has to match the liquid-crystal axis.

Thorlabs specifies the EXULUS-HD2HP at 400–850 nm, 1920 × 1200 (WUXGA), 8 µm pitch, 15.42 × 9.66 mm active area, fill factor >92%, 2π phase at 633 nm, 60 Hz, flickering <0.01% RMS, and liquid cooling for high-power handling (≤200 W/cm²). Interfaces are HDMI-compatible and USB 2.0.

The catalogue listed "π or 2π at 633 nm (model dependent)". For this high-power HD2 model Thorlabs publishes 2π at 633 nm. That is the figure used here.

## When to use spatial light modulation

- Generating a hologram or a structured beam
- Wavefront correction
- Optical trapping or beam steering in the 400–850 nm band
- Interferometry that needs a stable phase panel
- Teaching Fourier optics with a live pattern

## What spatial light modulation cannot do

- **It is not an intensity display.** Phase-only.
- **400–850 nm is the band.** 1064 nm and 1550 nm are other EXULUS models.
- **Power handling assumes the chiller is running.**
- **It is not a lithography writer.** Patterning resist is [photolithography](photolithography.md) or [nanoimprint](nanoimprint-lithography.md).

## The EXULUS-HD2HP at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a **Thorlabs EXULUS-HD2HP** spatial light modulator in Flagstaff, Arizona. The catalogue specifies reflective LCoS, phase-only modulation, 15.42 × 9.66 mm active area, fill factor greater than 92%, liquid-cooled head, and HDMI plus USB 2.0. Phase range on this model is 2π at 633 nm per Thorlabs.

The equipment catalogue currently lists the SLM as expected rather than available. Confirm live status on the [catalogue page](/About_Equipment/Spatial_Light_Modulator.html).

When the tool is in service it is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Technology | Reflective LCoS, phase-only |
| Operating wavelength | 400–850 nm |
| Resolution | 1920 × 1200 |
| Active area | 15.42 × 9.66 mm |
| Fill factor | >92% |
| Phase range | 2π at 633 nm |
| Pixel pitch | 8 µm |
| Cooling | Liquid-cooled head |
| Interfaces | HDMI-compatible, USB 2.0 |

Figures follow the [equipment catalogue](/About_Equipment/Spatial_Light_Modulator.html) and Thorlabs' EXULUS-HD2HP specification.

[Full EXULUS-HD2HP specifications and booking &rarr;](/About_Equipment/Spatial_Light_Modulator.html){ .md-button .md-button--primary }

## Sample requirements

This is an optical component, not a sample-in instrument. Bring:

- A beam in 400–850 nm, polarised for the panel
- HDMI pattern source and USB control from a lab PC
- Chiller connection
- Power estimate against the 200 W/cm² handling figure

## Frequently asked questions

### What is a spatial light modulator?

A spatial light modulator is a pixelated panel that changes the phase, and sometimes the amplitude, of light reflected from each pixel. The EXULUS-HD2HP is phase-only, reflective LCoS. A pattern written to the panel becomes a wavefront on the beam.

### What wavelength does the EXULUS-HD2HP cover?

Thorlabs specifies 400 to 850 nm, 2 pi phase at 633 nm, 1920 by 1200 pixels, 8 micrometre pitch, and an active area of 15.42 by 9.66 mm. The catalogue's "pi or 2 pi, model dependent" is the series language. This model is specified at 2 pi at 633 nm.

### Why does the high-power SLM need a chiller?

Phase stability. The HD2HP is the high-power, liquid-cooled head, specified for optical power handling up to 200 W per square centimetre and flickering below 0.01 percent RMS. Without cooling, absorbed power shifts the liquid-crystal phase. The chiller is part of the instrument, not an optional extra for this model.

### Can I use the SLM as a display or an intensity modulator?

Not as specified. This panel is phase-only. Amplitude modulation and colour display are different devices. You can convert phase into intensity with a downstream analyzer or a Fourier filter, but that is an optical setup, not a mode on the panel.

### Why is my reconstructed hologram dim or noisy?

Fill factor, bit depth, and incident polarisation. The panel is specified at greater than 92 percent fill factor and 8-bit drive over HDMI. Light that is not polarised for the liquid crystal, or a pattern that is not calibrated at the working wavelength, dumps power into the zeroth order. Calibrate phase versus grey level at the wavelength you actually use.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
