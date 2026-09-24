---
title: Gas Sorption and BET Surface Area
description: Gas sorption analysis measures BET surface area and pore size from 0.35 to 500 nm on a Microtrac BELSORP MAX X at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Characterization
  - Porous Materials
schema:
  - "@type": DefinedTerm
    name: Gas Sorption Analysis
    alternateName: BET Surface Area Analysis
    description: >-
      A characterization technique in which the quantity of a probe gas adsorbed by a solid is
      measured as a function of relative pressure at constant temperature, yielding specific
      surface area by the Brunauer-Emmett-Teller method and a pore size distribution.
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
    name: BET Surface Area and Pore Size Distribution Analysis
    serviceType: Materials characterization
    description: >-
      Nitrogen, argon, krypton, carbon dioxide, and vapour adsorption isotherms for specific
      surface area, micropore and mesopore size distribution, and hydrophilicity assessment of
      powders, molded bodies, and pellets.
    provider:
      "@id": https://nano.nau.edu/#organization
    areaServed:
      "@type": State
      name: Arizona
    availableChannel:
      "@type": ServiceChannel
      serviceUrl: https://nano.nau.edu/ServiceRequest.html

  - "@type": IndividualProduct
    name: Microtrac BELSORP MAX X
    category: BET Surface Area and Pore Size Distribution Analyzer
    url: https://nano.nau.edu/About_Equipment/BELSORP_MAX_X.html
    manufacturer:
      "@type": Organization
      name: Microtrac MRB
    additionalProperty:
      - "@type": PropertyValue
        name: Specific surface area range
        value: Down to 0.1 m2/g with nitrogen and 0.0005 m2/g with krypton
      - "@type": PropertyValue
        name: Pore size distribution
        value: 0.35 to 500 nm; from about 0.25 nm when carbon dioxide is used
      - "@type": PropertyValue
        name: Low-pressure isotherm
        value: Relative pressure down to 1e-8
      - "@type": PropertyValue
        name: Simultaneous measurements
        value: Up to 4 samples
      - "@type": PropertyValue
        name: Gas ports
        value: 3 standard, optional 6, 9 or 12
      - "@type": PropertyValue
        name: Pressure transducers
        value: 133 kPa (six), 1.33 kPa (four maximum), 0.0133 kPa (three maximum)
      - "@type": PropertyValue
        name: Free space correction
        value: Advanced Free Space Measurement, AFSM and helium-free AFSM2
      - "@type": PropertyValue
        name: Thermostatic air oven
        value: 50 degrees Celsius
      - "@type": PropertyValue
        name: Vapour adsorption
        value: To relative pressure of about 0.95 at 40 degrees Celsius
      - "@type": PropertyValue
        name: Software
        value: BELMaster analysis and BELControl operation, with BET, BJH, NLDFT and GCMC models

  - "@type": FAQPage
    mainEntity:
      - "@type": Question
        name: What is BET surface area?
        acceptedAnswer:
          "@type": Answer
          text: >-
            BET surface area is the total surface area of a solid per unit mass, including the
            interior surface of any pores, derived from a gas adsorption isotherm using the
            Brunauer-Emmett-Teller model. The model estimates how much gas forms a single
            molecular layer on the surface; multiplying that quantity by the cross-sectional
            area of one adsorbate molecule gives the area. It is reported in square metres per
            gram, and for microporous materials it can exceed a thousand.
      - "@type": Question
        name: How much sample does a BET measurement need?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Enough to present roughly a few square metres of total surface to the instrument,
            which is why the required mass depends on the material rather than being fixed.
            A high-area activated carbon may need only tens of milligrams; a low-area dense
            powder may need several grams. Low-area samples that cannot be supplied in
            quantity are measured with krypton instead of nitrogen, which extends the usable
            floor to about 0.0005 square metres per gram.
      - "@type": Question
        name: Why is my BET surface area lower than expected?
        acceptedAnswer:
          "@type": Answer
          text: >-
            The most common cause is incomplete degassing. Water and adsorbed gases left on
            the surface occupy sites the probe gas would otherwise fill, and the measured area
            comes out low. Raise the degassing temperature or extend the hold, within whatever
            limit the material tolerates. Two other causes are worth checking: pore mouths
            blocked by residue or binder, and micropores too narrow for nitrogen to enter at
            77 K, which argon at 87 K or carbon dioxide at 273 K will often reach.
      - "@type": Question
        name: Can gas sorption measure pores smaller than 1 nm?
        acceptedAnswer:
          "@type": Answer
          text: >-
            Yes. The BELSORP MAX X resolves pore size distributions from 0.35 nm, and from
            about 0.25 nm when carbon dioxide is used as the adsorptive. Reaching that range
            requires measuring the isotherm at very low relative pressure, down to about
            1e-9, and interpreting it with a density functional or Monte Carlo model rather
            than the classical BJH method, which is valid only for mesopores.
---

# Gas Sorption and BET Surface Area

Gas sorption analysis measures how much of a probe gas a solid adsorbs as relative pressure rises at constant temperature. The resulting isotherm yields specific surface area by the Brunauer–Emmett–Teller method and a pore size distribution from roughly 0.35 to 500 nanometres, which makes it the standard technique for catalysts, zeolites, metal–organic frameworks, and activated carbons.

## How gas sorption analysis works

The sample is cooled to a fixed temperature - 77 K for nitrogen, 87 K for argon - and a known quantity of gas is admitted in steps. At each step the instrument waits for equilibrium and records the pressure. The difference between the gas admitted and the gas remaining in the free space is the gas adsorbed on the surface. Plotting that quantity against relative pressure P/P₀ produces the **adsorption isotherm**, and every result comes from it.

Three regions of the isotherm answer three different questions:

- **Very low relative pressure**, below about 10⁻⁵, is where gas fills micropores. Reaching this region requires low-range pressure transducers and long equilibration, and it is what distinguishes an instrument capable of micropore analysis from one that only measures surface area.
- **Low to intermediate pressure**, roughly 0.05 to 0.30, is where monolayer coverage is completed. This is the range the BET equation is fitted over, and it is where surface area comes from.
- **High relative pressure**, above about 0.4, is where capillary condensation fills mesopores. The pressure at which a pore fills relates to its diameter through the Kelvin equation, and the hysteresis between the adsorption and desorption branches carries information about pore shape and connectivity.

Accuracy hinges on knowing the **free space** - the volume in the sample cell not occupied by the sample. Free space drifts as the liquid nitrogen level falls and as ambient conditions change, and any error in it propagates directly into the amount adsorbed. Advanced Free Space Measurement tracks the drift in a reference cell during the run rather than measuring it once at the start.

## When to use gas sorption analysis

- Measuring specific surface area of a powder, pellet, or molded body
- Determining pore size distribution across micropores and mesopores
- Comparing catalyst supports, or tracking loss of area through a catalyst's service life
- Characterising metal–organic frameworks, zeolites, and other framework materials
- Assessing hydrophilicity or hydrophobicity through water vapour adsorption
- Screening activated carbons and adsorbents for capacity
- Quality control where surface area is the specified property

## What gas sorption analysis cannot do

- **It measures an average over the whole sample.** A gram of powder returns one number. It cannot say which particles carry the area, or locate a pore in space. For that, use electron microscopy.
- **It does not see closed porosity.** A pore the gas cannot enter does not exist as far as the measurement is concerned.
- **BET assumes multilayer physisorption on a flat surface.** In strongly microporous material the assumption is questionable, and the BET area becomes a comparative index rather than a true area. Report the pressure range fitted.
- **Nitrogen cannot enter the narrowest pores at 77 K.** Diffusion becomes impractically slow. Argon at 87 K or CO₂ at 273 K reaches further.
- **It is slow.** A full isotherm with micropore resolution runs for many hours, sometimes over a day.
- **Results are only as good as the degassing.** See [sample degassing](sample-degassing.md); this is the single largest source of error in practice.

## The BELSORP MAX X at MPaCT Lab, Flagstaff, Arizona

The MPaCT Lab at Northern Arizona University operates a **Microtrac BELSORP MAX X** surface area and pore size analyzer in Flagstaff, Arizona. Its low-range pressure transducers reach relative pressures down to P/P₀ = 10⁻⁸, which is what puts micropore analysis and krypton-based low-area measurement within reach rather than only conventional BET.

Gas lines and gauges sit in a thermostatic air oven held at 50 °C, so manifold temperature does not drift through a run that may last more than a day. Up to four samples are measured simultaneously.

The instrument is available to NAU researchers, external academic users, and industry partners, on a fee-for-service basis or as a trained hands-on user.

| Specification | Value |
|---|---|
| Specific surface area | Down to 0.1 m²/g with N₂; 0.0005 m²/g with Kr |
| Pore size distribution | 0.35–500 nm |
| Low-pressure isotherm | P/P₀ down to 10⁻⁸ |
| Simultaneous measurements | Up to 4 samples |
| Pressure transducers | 133 kPa, 1.33 kPa, and 0.0133 kPa ranges |
| Free space correction | AFSM (Advanced Free Space Measurement) |
| Adsorptives | N₂, water vapor, and others upon request (Ar, Kr, organic vapor with method development) |
| Software | BELMaster analysis, BELControl operation; BET, BJH, NLDFT, GCMC |

Surface-area floor, low-pressure limit, capacity, and sorbates follow the [equipment catalogue](/About_Equipment/BELSORP_MAX_X.html).

[Full BELSORP MAX X specifications and booking &rarr;](/About_Equipment/BELSORP_MAX_X.html){ .md-button .md-button--primary }

## Sample requirements

- **Form.** Powders, pellets, granules, molded bodies, and fibres. The sample must fit the cell and must not be drawn into the manifold, so very fine powders are retained with glass wool or a filter rod.
- **Mass.** Enough to present a few square metres of total surface. High-area materials need tens of milligrams; low-area materials need grams. Bring more than you think, and tell us the expected order of magnitude.
- **Dryness.** The sample is degassed on a [BELPREP VAC](sample-degassing.md) before analysis. Tell us the highest temperature the material tolerates without decomposing, sintering, or losing structure.
- **Stability.** Material that decomposes, melts, or outgasses continuously under vacuum is not measurable.
- **Hazards.** Declare anything toxic, pyrophoric, or reactive before submission. Corrosive, combustible, and poisonous gases are not permitted in the pretreatment unit.

## Frequently asked questions

### What is BET surface area?

BET surface area is the total surface area of a solid per unit mass, including the interior surface of any pores, derived from a gas adsorption isotherm using the Brunauer–Emmett–Teller model. The model estimates how much gas forms a single molecular layer on the surface; multiplying that quantity by the cross-sectional area of one adsorbate molecule gives the area. It is reported in square metres per gram, and for microporous materials it can exceed a thousand.

### How much sample does a BET measurement need?

Enough to present roughly a few square metres of total surface to the instrument, which is why the required mass depends on the material rather than being fixed. A high-area activated carbon may need only tens of milligrams; a low-area dense powder may need several grams. Low-area samples that cannot be supplied in quantity are measured with krypton instead of nitrogen, which extends the usable floor to about 0.0005 square metres per gram.

### Why is my BET surface area lower than expected?

The most common cause is incomplete degassing. Water and adsorbed gases left on the surface occupy sites the probe gas would otherwise fill, and the measured area comes out low. Raise the degassing temperature or extend the hold, within whatever limit the material tolerates. Two other causes are worth checking: pore mouths blocked by residue or binder, and micropores too narrow for nitrogen to enter at 77 K, which argon at 87 K or carbon dioxide at 273 K will often reach.

### Can gas sorption measure pores smaller than 1 nm?

Yes. The BELSORP MAX X resolves pore size distributions from 0.35 nm, and from about 0.25 nm when carbon dioxide is used as the adsorptive. Reaching that range requires measuring the isotherm at very low relative pressure, down to P/P₀ = 10⁻⁸, and interpreting it with a density functional or Monte Carlo model rather than the classical BJH method, which is valid only for mesopores.

## Request time on this instrument

**MPaCT Lab** - Building 98E, South Engineering Lab<br>
561 E Pine Knoll Dr, Flagstaff, AZ 86001<br>
Phone: [928-523-2343](tel:+19285232343) &middot; Email: [mpct.nano@nau.edu](mailto:mpct.nano@nau.edu)

[Submit a service request](/ServiceRequest.html){ .md-button } [Reserve the instrument](/Reserve_Equipment.html){ .md-button }
