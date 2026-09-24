---
title: Digital Microscopy
description: Digital microscopy inspects and measures device surfaces in 4K on a Keyence VHX-7000 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Inspection
schema:
  - "@type": DefinedTerm
    name: Digital Microscopy
    alternateName: 4K Digital Microscope
    description: >-
      An optical inspection method in which a camera-based microscope captures
      fully focused images of a surface, with on-screen 2D measurement and
      optional 3D reconstruction, without requiring the operator to look through
      eyepieces.
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
    name: Digital Microscopy
    serviceType: Optical inspection
    description: >-
      Camera-based inspection and on-screen measurement of surfaces, devices,
      and failure sites using a 4K digital microscope.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Keyence VHX-7000
    category: Digital microscope
    url: https://nano.nau.edu/About_Equipment/VHX7000_Digital_Microscope.html
    manufacturer:
      "@type": Organization
      name: Keyence
    additionalProperty:
      - "@type": PropertyValue
        name: Image sensor
        value: 1/1.8 inch CMOS
      - "@type": PropertyValue
        name: Effective pixels
        value: 2048 by 1536
      - "@type": PropertyValue
        name: Output image
        value: 3840 by 2160
      - "@type": PropertyValue
        name: Display
        value: 15 inch monitor
      - "@type": PropertyValue
        name: Output interface
        value: 4K output supported

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is digital microscopy?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Digital microscopy captures a magnified image of a surface on a
            camera and displays it on a monitor, rather than through eyepieces.
            Depth of field can be stacked so a tall feature is in focus from
            top to bottom, and 2D distances, angles, and radii can be measured
            on the image. It is inspection first, metrology second.
      - "@type": Question
        name: What is the difference between digital microscopy and optical profilometry?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Purpose. The VHX-7000 is for seeing and documenting a surface, with
            optional on-screen measurement. The Keyence VK-X3000 is a 3D surface
            profiler that reports calibrated roughness and step height over up
            to 50 by 50 millimetres. If the question is Ra or a step height,
            start with optical profilometry. If the question is "what does this
            defect look like", start here.
      - "@type": Question
        name: Can the VHX-7000 replace an SEM for inspection?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Not at SEM resolution, and not for composition. The VHX-7000 is an
            optical camera. Features smaller than the optical diffraction limit,
            and any elemental question, still belong on the JEOL JSM-IT710HR.
            Use the digital microscope when the defect is visible in light, the
            sample must not go into vacuum, or you need a colour image.
      - "@type": Question
        name: Does a digital microscope sample need to be coated or conductive?
        acceptedAnswer:
          "@type": Answer
          text: >-
            No. The instrument uses light. Insulators, polymers, and assembled
            boards can be imaged as they are. Coating is an SEM preparation, not
            a digital-microscope one.
      - "@type": Question
        name: Why is my digital microscope image only sharp in a thin band?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Optical depth of field shrinks as magnification rises. A tall solder
            joint or a fracture wall will be sharp on one plane and blurred
            above and below it unless the system stacks focus through the
            height. That stack is an image, not a calibrated height map; if you
            need the height as a number, move to the VK-X3000.
---

# Digital Microscopy

Digital microscopy is an optical inspection method that captures a magnified image of a surface on a camera and displays it on a monitor. Fully focused images, on-screen 2D measurement, and colour documentation are the usual outputs. It does not require eyepieces, a vacuum, or a conductive coating.

## How digital microscopy works

A CMOS camera sits at the image plane of a zoom or objective lens. The operator frames the region on a monitor. Illumination is built in. Because the detector is a camera rather than an eye:

- **Focus stacking** combines frames taken at different focus positions so a tall object is sharp from top to bottom.
- **2D measurement** uses the calibrated pixel scale of the current magnification to report distance, angle, radius, and area on the image.
- **4K output** records the image at 3840 × 2160 for reports and for sharing with someone who is not at the instrument.

The catalogue camera is a 1/1.8 in CMOS with 2048 × 1536 effective pixels and a 15 in monitor. Manufacturer pages for the VHX-7000 series also list a higher-pixel fully integrated head; this page follows the catalogue sensor, not the optional head.

## When to use digital microscopy

- Incoming inspection of a die, a package, a board, or a machined coupon
- Colour documentation of a failure site before anything is coated or put in vacuum
- Measuring a pad, a trace, a scratch, or a bond wire on the image
- Teaching and demonstration, where a room can see the same field
- Samples that cannot go into an SEM: large boards, wet residues, or parts that must remain uncoated

## What digital microscopy cannot do

- **It is not a 3D profiler.** A focus stack looks three-dimensional. Calibrated roughness and step height over millimetres belong on the [VK-X3000](optical-profilometry.md).
- **It does not resolve SEM-scale features.** Optical diffraction sets the floor. Morphology below that, and any chemistry, is [SEM](scanning-electron-microscopy.md) or [SEM-EDS](scanning-electron-microscopy.md).
- **A measurement on the image is only as good as the calibration at that magnification.** Zoom, then measure. Do not measure a feature on a wide field and treat the last digit as real.
- **It does not see through an opaque package.** Closed parts stay closed.

## The VHX-7000 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Keyence VHX-7000** digital microscope in Flagstaff, Arizona. The catalogue specifies a 1/1.8 in CMOS image sensor, 2048 × 1536 effective pixels, 3840 × 2160 output, a 15 in monitor, and 4K output. The instrument is listed as available. It is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Image sensor | 1/1.8 in CMOS |
| Effective pixels | 2048 × 1536 |
| Output image | 3840 × 2160 |
| Display | 15 in monitor |
| Output interface | 4K output supported |

Figures follow the [equipment catalogue](/About_Equipment/VHX7000_Digital_Microscope.html). Keyence publishes the matching 1/1.8 in, 2048 × 1536 camera as the VHX-7020 head in the VHX-7000 series.

[Full VHX-7000 specifications and booking &rarr;](/About_Equipment/VHX7000_Digital_Microscope.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** A part, coupon, board, or device that sits under the lens. Say if it is taller than a few centimetres so the working distance can be checked.
- **Surface.** Clean enough that the colour you care about is the material, not a fingerprint.
- **Return.** The measurement is optical. The sample leaves as it arrived.

## Frequently asked questions

### What is digital microscopy?

Digital microscopy captures a magnified image of a surface on a camera and displays it on a monitor, rather than through eyepieces. Depth of field can be stacked so a tall feature is in focus from top to bottom, and 2D distances, angles, and radii can be measured on the image. It is inspection first, metrology second.

### What is the difference between digital microscopy and optical profilometry?

Purpose. The VHX-7000 is for seeing and documenting a surface, with optional on-screen measurement. The Keyence VK-X3000 is a 3D surface profiler that reports calibrated roughness and step height over up to 50 by 50 millimetres. If the question is Ra or a step height, start with optical profilometry. If the question is "what does this defect look like", start here.

### Can the VHX-7000 replace an SEM for inspection?

Not at SEM resolution, and not for composition. The VHX-7000 is an optical camera. Features smaller than the optical diffraction limit, and any elemental question, still belong on the JEOL JSM-IT710HR. Use the digital microscope when the defect is visible in light, the sample must not go into vacuum, or you need a colour image.

### Does a digital microscope sample need to be coated or conductive?

No. The instrument uses light. Insulators, polymers, and assembled boards can be imaged as they are. Coating is an SEM preparation, not a digital-microscope one.

### Why is my digital microscope image only sharp in a thin band?

Optical depth of field shrinks as magnification rises. A tall solder joint or a fracture wall will be sharp on one plane and blurred above and below it unless the system stacks focus through the height. That stack is an image, not a calibrated height map; if you need the height as a number, move to the VK-X3000.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
