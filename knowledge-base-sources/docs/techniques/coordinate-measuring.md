---
title: Wide-Area Coordinate Measurement
description: Portable wide-area CMM measurement of large parts and assemblies on a Keyence WM-6000 at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Metrology
  - Inspection
schema:
  - "@type": DefinedTerm
    name: Wide-Area Coordinate Measurement
    alternateName: Portable CMM
    description: >-
      A dimensional metrology method in which a tracked handheld probe records
      3D coordinates of a part that is too large, or too awkward, to place on a
      fixed coordinate measuring machine, reporting distances, GD&T, and optional
      laser-scanned shape.
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
    name: Wide-Area Coordinate Measurement
    serviceType: Dimensional metrology
    description: >-
      Portable contact probing and optional laser scanning of large parts,
      assemblies, and fixtures that will not fit a benchtop CMM.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Keyence WM-6000
    category: Wide-area coordinate measuring machine
    url: https://nano.nau.edu/About_Equipment/Keyence_WM6000.html
    manufacturer:
      "@type": Organization
      name: Keyence
    additionalProperty:
      - "@type": PropertyValue
        name: Series measurement range
        value: Up to 25 m wide, series capability
      - "@type": PropertyValue
        name: Example measurement range
        value: 10000 by 3500 by 5000 mm (WM-6210), model dependent
      - "@type": PropertyValue
        name: Camera rotation
        value: Horizontal plus or minus 120 degrees, vertical plus or minus 30 degrees
      - "@type": PropertyValue
        name: Laser probe scan speed
        value: Up to 2.4 million points per second
      - "@type": PropertyValue
        name: Laser probe working distance
        value: 300 mm with plus or minus 100 mm depth of field
      - "@type": PropertyValue
        name: Laser probe scanning accuracy
        value: Plus or minus (50 + 5L/1000) micrometres

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is a wide-area CMM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            A wide-area coordinate measuring machine tracks a handheld probe in
            three dimensions over a volume of metres, not millimetres, so a
            large part can be measured where it sits. Contact probing reports
            GD&T. An optional laser-scanning probe captures shape. It is the
            opposite of a granite-table CMM that the part has to be brought to.
      - "@type": Question
        name: What is the difference between the WM-6000 and a fixed CMM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Portability and volume. A fixed CMM is more accurate inside a
            climate-controlled envelope the size of its granite. The WM-6000
            series is specified up to 25 m wide, sets up on a tripod, and
            measures the part in place. Accuracy is lower than a lab CMM; the
            laser-scanning probe is specified at plus or minus (50 + 5L/1000)
            micrometres. Use a lab CMM when the part fits one. Use this when it
            does not.
      - "@type": Question
        name: How large a part can the WM-6000 measure?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The series is specified up to 25 m wide. The catalogue quotes an
            example envelope of 10,000 by 3,500 by 5,000 mm for the WM-6210.
            Which head is on the floor is not asserted here; confirm the
            installed model on the catalogue page if the part is near those
            limits.
      - "@type": Question
        name: How accurate is the laser-scanning probe?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Keyence specifies the WM-P6200 laser-scanning probe at plus or minus
            (50 + 5L/1000) micrometres, with L the measurement length in
            millimetres, under VDI/VDE 2634 Part 3 at 20 C plus or minus 1 C.
            Scan speed is up to 2.4 million points per second; working distance
            is 300 mm with plus or minus 100 mm depth of field. Contact-probe
            accuracy is a tighter figure on a different probe and is not
            substituted here.
      - "@type": Question
        name: Can I measure a chip or a thin film with a wide-area CMM?
        acceptedAnswer:
          "@type": Answer
          text: >-
            No. This instrument is for large parts and assemblies. A die, a
            wafer feature, or a film thickness is [digital microscopy](digital-microscopy.md),
            [optical profilometry](optical-profilometry.md), [AFM](atomic-force-microscopy.md),
            or [ellipsometry](spectroscopic-ellipsometry.md).
---

# Wide-Area Coordinate Measurement

Wide-area coordinate measurement is a dimensional metrology method in which a tracked handheld probe records 3D coordinates of a part that is too large, or too awkward, to place on a fixed coordinate measuring machine. Distances, GD&T, and optional laser-scanned shape are the outputs. The part stays where it is.

## How wide-area CMM measurement works

A camera unit on a tripod tracks near-infrared markers on a handheld probe. The operator touches or scans the part. Software reports coordinates relative to a user-defined datum.

Two probes appear in the catalogue:

- **Contact probe.** Touches a point. GD&T, holes, edges, and CAD comparison.
- **Laser-scanning probe.** Returns a point cloud. Shape and form. Keyence specifies the WM-P6200 at up to 2.4 million points per second, 300 mm working distance, ±100 mm depth of field, and scanning accuracy ±(50 + 5L/1000) µm.

The camera rotates ±120° horizontally and ±30° vertically so the operator is not locked to one viewing angle.

Which WM-6000-series head is installed is not asserted here. The catalogue quotes the series range (up to 25 m) and an example envelope for the WM-6210 (10,000 × 3,500 × 5,000 mm). Confirm the installed model if the part is near those limits.

## When to use wide-area CMM measurement

- A fixture, frame, or assembly that will not fit a benchtop metrology instrument
- GD&T on a large part that cannot be moved to a granite CMM
- On-site measurement of a part that is still in a build
- Capturing shape with the laser probe when contact points are not enough
- Comparing a large as-built part to CAD

## What wide-area CMM measurement cannot do

- **It is not a lab CMM.** Scanning accuracy of ±(50 + 5L/1000) µm is not a micrometre-class granite machine. Do not use it for a 10 µm hole on a small coupon.
- **It does not measure chips, films, or roughness.** Those are microscopy and profilometry questions.
- **Temperature moves the number.** Keyence documents temperature compensation. A shop floor that is not 20 °C is not the specification condition.
- **The installed model is not published as a single envelope.** The 25 m figure is series capability. Ask which head is on the floor.

## The WM-6000 at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University holds a **Keyence WM-6000** wide-area CMM in Flagstaff, Arizona. The catalogue specifies series measurement range up to 25 m, an example envelope of 10,000 × 3,500 × 5,000 mm (WM-6210), camera rotation ±120° / ±30°, WLAN / Bluetooth 5.0 / USB 3.0 / IR connectivity, laser-probe scan speed up to 2.4 million points per second, 300 mm working distance with ±100 mm depth of field, and laser-probe scanning accuracy ±(50 + 5L/1000) µm.

The equipment catalogue currently lists the WM-6000 as expected rather than available. Confirm live status on the [catalogue page](/About_Equipment/Keyence_WM6000.html) before planning a measurement.

When the tool is in service it is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Series measurement range | Up to 25 m wide (series capability) |
| Example envelope | 10,000 × 3,500 × 5,000 mm (WM-6210), model dependent |
| Camera rotation | Horizontal ±120°, vertical ±30° |
| Laser probe scan speed | Up to 2.4 million points per second |
| Laser probe working distance | 300 mm, ±100 mm depth of field |
| Laser probe scanning accuracy | ±(50 + 5L/1000) µm |

Figures follow the [equipment catalogue](/About_Equipment/Keyence_WM6000.html) and Keyence's published WM-P6200 laser-probe specification.

[Full WM-6000 specifications and booking &rarr;](/About_Equipment/Keyence_WM6000.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** A part, assembly, or fixture that can be seen by the tracking camera. Say the longest dimension.
- **Access.** The probe has to reach the features. A cavity the camera cannot see cannot be measured.
- **Datum.** Bring a drawing or a CAD file if comparison is the point.
- **Environment.** Note if the measurement cannot be done at ~20 °C.

## Frequently asked questions

### What is a wide-area CMM?

A wide-area coordinate measuring machine tracks a handheld probe in three dimensions over a volume of metres, not millimetres, so a large part can be measured where it sits. Contact probing reports GD&T. An optional laser-scanning probe captures shape. It is the opposite of a granite-table CMM that the part has to be brought to.

### What is the difference between the WM-6000 and a fixed CMM?

Portability and volume. A fixed CMM is more accurate inside a climate-controlled envelope the size of its granite. The WM-6000 series is specified up to 25 m wide, sets up on a tripod, and measures the part in place. Accuracy is lower than a lab CMM; the laser-scanning probe is specified at plus or minus (50 + 5L/1000) micrometres. Use a lab CMM when the part fits one. Use this when it does not.

### How large a part can the WM-6000 measure?

The series is specified up to 25 m wide. The catalogue quotes an example envelope of 10,000 by 3,500 by 5,000 mm for the WM-6210. Which head is on the floor is not asserted here; confirm the installed model on the catalogue page if the part is near those limits.

### How accurate is the laser-scanning probe?

Keyence specifies the WM-P6200 laser-scanning probe at plus or minus (50 + 5L/1000) micrometres, with L the measurement length in millimetres, under VDI/VDE 2634 Part 3 at 20 C plus or minus 1 C. Scan speed is up to 2.4 million points per second; working distance is 300 mm with plus or minus 100 mm depth of field. Contact-probe accuracy is a tighter figure on a different probe and is not substituted here.

### Can I measure a chip or a thin film with a wide-area CMM?

No. This instrument is for large parts and assemblies. A die, a wafer feature, or a film thickness is [digital microscopy](digital-microscopy.md), [optical profilometry](optical-profilometry.md), [AFM](atomic-force-microscopy.md), or [ellipsometry](spectroscopic-ellipsometry.md).

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
