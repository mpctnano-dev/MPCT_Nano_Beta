---
title: Optical Profilometry (3D Surface Profiling)
description: Optical profilometry maps 3D roughness and step height without contact on a Keyence VK-X3000 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Surface Metrology
  - Thin Films
schema:
  - "@type": DefinedTerm
    name: Optical Profilometry
    alternateName: 3D Surface Profiling
    description: >-
      A non-contact surface metrology technique that reconstructs a three-dimensional
      height map from optical signals, reporting roughness, step height, and topography
      over fields from micrometres to tens of millimetres.
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
    name: Optical Profilometry and 3D Surface Profiling
    serviceType: Surface metrology
    description: >-
      Non-contact three-dimensional surface measurement of roughness, step height, and
      topography by laser confocal, focus variation, and interferometric methods on
      parts, films, and microstructures.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Keyence VK-X3000
    category: 3D laser scanning confocal microscope
    url: https://nano.nau.edu/About_Equipment/VKX3000_3D_Surface_Profiler.html
    manufacturer:
      "@type": Organization
      name: Keyence
    additionalProperty:
      - "@type": PropertyValue
        name: Height resolution
        value: 0.01 nm
      - "@type": PropertyValue
        name: Scan area
        value: Up to 50 by 50 millimetres
      - "@type": PropertyValue
        name: Magnification
        value: 42x to 28800x total
      - "@type": PropertyValue
        name: Field of view
        value: 11 micrometres to 7398 micrometres
      - "@type": PropertyValue
        name: Measurement principles
        value: Laser confocal, focus variation, white light interferometry, spectral interference
      - "@type": PropertyValue
        name: Laser wavelength
        value: 404 nm or 661 nm, head dependent
      - "@type": PropertyValue
        name: Maximum measurement speed
        value: Surface 125 Hz, line 7900 Hz

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is optical profilometry?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Optical profilometry reconstructs a three-dimensional height map from light
            rather than from a contacting stylus or an AFM tip. The VK-X3000 combines
            laser confocal scanning, focus variation, white-light interferometry, and
            spectral interference in one instrument so the same part can be measured
            whether the surface is smooth, rough, or mixed. The output is topography,
            step height, and roughness parameters such as Ra and Rq.
      - "@type": Question
        name: What is the difference between optical profilometry and AFM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Scale and contact. The AFM Workshop B-2 scans 50 by 50 micrometres with a
            17 micrometre vertical range and a physical tip. The VK-X3000 is specified
            up to 50 by 50 millimetres, does not touch the surface, and can measure
            features taller than the AFM scanner. Use AFM when you need a calibrated
            nanometre patch, mechanical contrast, or the smallest lateral features.
            Use optical profilometry when the question is a millimetre-scale survey,
            a tall step, or a part the tip would damage or never finish scanning.
      - "@type": Question
        name: How large an area can the VK-X3000 measure?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Up to 50 by 50 millimetres, as listed on the catalogue page. A single field
            of view is 11 micrometres to 7398 micrometres depending on magnification
            (42x to 28800x total). The 50 mm figure is the stitched working envelope,
            not one camera frame. That is a thousand times the AFM's 50 by 50 micrometre
            scan, which is why wafer surveys and machined parts start here.
      - "@type": Question
        name: Can optical profilometry report Ra and Rq?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The catalogue lists surface roughness, including Ra and Rq, as a
            primary application, along with step height on trenches and microstructures.
            The number you get is only as meaningful as the field you measured: a 50 mm
            map and a 50 micrometre AFM image of the same coupon will not match, because
            they average different wavelengths of roughness. Say the evaluation length
            you care about.
      - "@type": Question
        name: Why is my optical profile missing data on a steep or transparent surface?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The beam has to return. A steep wall, a mirror at the wrong angle, or a
            transparent film that the confocal pinhole cannot localise will drop points.
            Focus variation is the catalogue mode for rough or steep surfaces. Spectral
            interference is listed for thin films and smooth surfaces. Switching mode
            is the first fix; coating a transparent sample is a last resort because it
            changes the surface you came to measure.
---

# Optical Profilometry (3D Surface Profiling)

Optical profilometry is a non-contact surface metrology technique that reconstructs a three-dimensional height map from optical signals. It reports roughness, step height, and topography over fields from micrometres to tens of millimetres, without a stylus and without an AFM tip.

## How optical profilometry works

A microscope collects height from how light interacts with the surface. The VK-X3000 puts four optical principles in one head so the method can follow the surface rather than the other way around:

- **Laser confocal.** A pinhole rejects out-of-focus light. Height is the focus position that maximises the returned laser. This is the high-resolution profiling mode on smooth-to-moderate surfaces.
- **Focus variation.** Height is stacked from the focus position of texture. The catalogue assigns this mode to rough or steep surfaces that confocal drops.
- **White-light interferometry.** Interference fringes give height with interferometric sensitivity on surfaces that return a coherent signal.
- **Spectral interference.** The catalogue lists this for thin films and smooth surfaces, where a single-wavelength confocal spot is a poor localiser.

The instrument does not touch the sample. There is no tip convolution of the AFM kind. There is optical diffraction instead: lateral width is limited by the objective, not by a few-nanometre tip. Vertical numbers can still be useful on features whose plan-view width is not.

A field of view at one magnification is 11 µm to 7398 µm. Larger maps are built by moving the stage. The catalogue's scan area is up to 50 × 50 mm.

## When to use optical profilometry

- Roughness (Ra, Rq, and related parameters) over a millimetre-scale patch, not a 50 µm AFM frame
- Step height on MEMS, trenches, and patterned films taller than the AFM's 17 µm Z range
- Surveying a wafer, a coupon, or a machined part before deciding whether [AFM](atomic-force-microscopy.md) is worth a zoom
- Surfaces that must not be touched: soft polymers, freshly coated films, parts that continue to a process step
- Mixed surfaces (smooth and rough on the same part) where one optical mode will not cover the whole field

## What optical profilometry cannot do

- **Height resolution is not a noise floor on your sample.** The catalogue lists 0.01 nm. That is the instrument's stated vertical resolution, not the roughness of a given coupon, and not a measured noise floor at MPaCT.
- **It does not replace AFM at the smallest scale.** 50 × 50 µm with a physical tip, phase contrast, and sub-nanometre work on a flat film still belong on the [B-2](atomic-force-microscopy.md).
- **It does not measure a buried interface.** Thickness of a uniform transparent film without a step is [ellipsometry](spectroscopic-ellipsometry.md) or [X-ray reflectivity](x-ray-diffraction.md). A profilometer needs a surface, or a step, that light can localise.
- **It reports no chemistry.** Shape only. Composition is SEM-EDS or SIMS.
- **Steep, transparent, or mirror-like regions drop data** until the matching mode is used. Missing pixels are an optical problem, not a broken laser.

## The VK-X3000 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Keyence VK-X3000** 3D surface profiler in Flagstaff, Arizona. The catalogue specifies laser confocal, focus variation, white-light interferometry, and spectral interference; height resolution of 0.01 nm; scan area up to 50 × 50 mm; total magnification 42× to 28800×; field of view 11 µm to 7398 µm; and maximum measurement speed of 125 Hz (surface) and 7900 Hz (line).

Laser wavelength is listed as 404 nm (VK-X3100) or 661 nm (VK-X3050), depending on the installed head. This page does not pick which head is on the floor; confirm on the catalogue page or with staff if the wavelength matters for your material.

The instrument is listed as available. It is open to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Measurement principles | Laser confocal, focus variation, white-light interferometry, spectral interference |
| Height resolution | 0.01 nm |
| Scan area | Up to 50 × 50 mm |
| Magnification | 42× to 28800× (total) |
| Field of view | 11 µm to 7398 µm |
| Laser wavelength | 404 nm or 661 nm, head dependent |
| Max measurement speed | Surface 125 Hz; line 7900 Hz |

Figures follow the [equipment catalogue](/About_Equipment/VKX3000_3D_Surface_Profiler.html).

[Full VK-X3000 specifications and booking &rarr;](/About_Equipment/VKX3000_3D_Surface_Profiler.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** A part, coupon, wafer fragment, or device that sits under the objective. The working envelope is 50 × 50 mm; say if you need a stitched map or a single field.
- **Surface.** Clean enough that the beam sees the material you care about. A fingerprint is a topography.
- **Optical access.** The instrument looks at light. A cavity the objective cannot see, or a surface that returns nothing, will not profile.
- **What you already know.** Whether the question is Ra over a specified length, a step height, or a 3D map. Bring a step if thickness is the question and the film is opaque.
- **Return.** The measurement is non-contact. The sample leaves as it arrived unless you asked for a coating to kill a transparent-film problem.

## Frequently asked questions

### What is optical profilometry?

Optical profilometry reconstructs a three-dimensional height map from light rather than from a contacting stylus or an AFM tip. The VK-X3000 combines laser confocal scanning, focus variation, white-light interferometry, and spectral interference in one instrument so the same part can be measured whether the surface is smooth, rough, or mixed. The output is topography, step height, and roughness parameters such as Ra and Rq.

### What is the difference between optical profilometry and AFM?

Scale and contact. The AFM Workshop B-2 scans 50 by 50 micrometres with a 17 micrometre vertical range and a physical tip. The VK-X3000 is specified up to 50 by 50 millimetres, does not touch the surface, and can measure features taller than the AFM scanner. Use AFM when you need a calibrated nanometre patch, mechanical contrast, or the smallest lateral features. Use optical profilometry when the question is a millimetre-scale survey, a tall step, or a part the tip would damage or never finish scanning.

### How large an area can the VK-X3000 measure?

Up to 50 by 50 millimetres, as listed on the catalogue page. A single field of view is 11 micrometres to 7398 micrometres depending on magnification (42x to 28800x total). The 50 mm figure is the stitched working envelope, not one camera frame. That is a thousand times the AFM's 50 by 50 micrometre scan, which is why wafer surveys and machined parts start here.

### Can optical profilometry report Ra and Rq?

Yes. The catalogue lists surface roughness, including Ra and Rq, as a primary application, along with step height on trenches and microstructures. The number you get is only as meaningful as the field you measured: a 50 mm map and a 50 micrometre AFM image of the same coupon will not match, because they average different wavelengths of roughness. Say the evaluation length you care about.

### Why is my optical profile missing data on a steep or transparent surface?

The beam has to return. A steep wall, a mirror at the wrong angle, or a transparent film that the confocal pinhole cannot localise will drop points. Focus variation is the catalogue mode for rough or steep surfaces. Spectral interference is listed for thin films and smooth surfaces. Switching mode is the first fix; coating a transparent sample is a last resort because it changes the surface you came to measure.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
