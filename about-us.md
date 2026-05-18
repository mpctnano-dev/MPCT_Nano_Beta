---
tags:
  - Content Edit
  - HTML
  - CSS
  - JavaScript
---

# About Us Page Guide

**Target file:** `About_Us.html`

How to update stats, vision pipeline, affiliation cards, the publication acknowledgement, and CTA buttons.

## Content Management Reference

| What You're Changing | Search For (Ctrl+F) | Technical Name |
| --- | --- | --- |
| Stat number | `class="stat-value"` | `.stat-value div` |
| Stat label | `class="stat-title"` | `.stat-title div` |
| Pipeline stage title | `class="pipeline-stage` | `.pipeline-stage div` |
| Stage number badge | `class="stage-number"` | `.stage-number div` |
| Stage tag link | `class="stage-tag-link"` | `a.stage-tag-link span` |
| Affiliation card | `class="affiliation-card` | `.affiliation-card div` |
| Affiliation area item | `class="affiliation-areas"` | `.affiliation-areas li` |
| Ack text | `id="ackText"` | `#ackText p` |
| CTA buttons | `class="about-cta__actions"` | `.about-cta__actions div` |

## 1. Stats Strip

### Edit a Stat Number or Label

**Search for:** `<div class="stats-strip">`

```html
<div class="stat-item about-reveal about-delay-1">
  <div class="stat-value">$13<span class="stat-suffix">M</span></div>
  <div class="stat-title">Facility Investment</div>
</div>

<!-- stat-suffix renders the unit in smaller lighter text -->
<!-- Remove the <span> for a plain number with no suffix -->
```

!!! note

    The about-delay-1 through about-delay-4 classes stagger the animation. Keep them in order when adding a new stat or the reveal sequence will be uneven.

### Add a Stat

**Search for:** `<div class="stats-strip">`

```html
<!-- Paste before the closing </div> of stats-strip -->
<div class="stat-item about-reveal about-delay-5">
  <div class="stat-value">10<span class="stat-suffix">+</span></div>
  <div class="stat-title">Industry Partners</div>
</div>
```

!!! warning "Side Effect"

    The stats-strip uses flex layout with wrap. Five stats on a narrow screen (under 900px) will wrap to a second row instead of staying in one line. Test at 768px after adding.

## 2. Strategic Vision Pipeline

### Edit a Pipeline Stage Title or Description

**Search for:** `<div class="vision-pipeline">`

```html
<div class="pipeline-stage about-reveal about-delay-1">
  <div class="stage-icon"><i class="fas fa-flask"></i></div>
  <div class="stage-card">
    <div class="stage-number">01</div>
    <h3>Research Infrastructure</h3>  <!-- stage heading -->
    <p>Description text here...</p>  <!-- body paragraph -->
    <div class="stage-tags">
      <!-- tag links below -->
    </div>
  </div>
</div>
```

!!! note

    The stage-number badge (01, 02, 03) is plain text - it does not auto-increment. If you reorder stages, update the numbers manually.

### Edit a Stage Tag Link

Stage tags are anchor links to other pages. Change both the href and the visible text.

**Search for:** `class="stage-tag-link"`

```html
<a href="Equipment.html" class="stage-tag-link"><span>AFM & SEM</span></a>

<!-- Change href and the text inside <span> -->
<a href="services.html" class="stage-tag-link"><span>Contract Testing</span></a>
```

### Change a Stage Icon Color

The stage-icon div accepts a color modifier class. Three are defined: (default blue), gold, green.

**Search for:** `class="stage-icon"`

```html
<!-- Default (blue) -->
<div class="stage-icon"><i class="fas fa-flask"></i></div>

<!-- Gold -->
<div class="stage-icon gold"><i class="fas fa-graduation-cap"></i></div>

<!-- Green -->
<div class="stage-icon green"><i class="fas fa-handshake"></i></div>
```

## 3. Affiliation Cards

### Edit an Affiliation Card

**Search for:** `<div class="affiliations-grid">`

```html
<div class="affiliation-card about-reveal about-delay-1">
  <div class="affiliation-icon">
    <i class="fas fa-microchip"></i>   <!-- Font Awesome icon -->
  </div>
  <h3>College of Engineering, Informatics & Applied Sciences</h3>
  <ul class="affiliation-areas">
    <li>Semiconductor device fabrication</li>
    <li>MEMS & sensor prototyping</li>
    <li>Thin film process development</li>
  </ul>
</div>
```

!!! note

    Icon color classes available on affiliation-icon: (default blue), gold, green, purple. Match these to the card's thematic color if adding a new one.

### Add a Research Area to an Existing Card

**Search for:** `class="affiliation-areas"`

```html
<ul class="affiliation-areas">
  <li>Semiconductor device fabrication</li>
  <li>MEMS & sensor prototyping</li>
  <!-- Add new area: -->
  <li>Photonic device research</li>
</ul>
```

### Add a New Affiliation Card

**Search for:** `<div class="affiliations-grid">`

```html
<!-- Paste inside affiliations-grid -->
<div class="affiliation-card about-reveal about-delay-5">
  <div class="affiliation-icon purple">
    <i class="fas fa-satellite-dish"></i>
  </div>
  <h3>Department Name</h3>
  <ul class="affiliation-areas">
    <li>Research area 1</li>
    <li>Research area 2</li>
  </ul>
</div>
```

!!! warning "Side Effect"

    The affiliations grid is a 4-column CSS grid. A 5th card wraps to a second row. If you want a 5-card layout to stay in one row, the grid-template-columns value in `style.css` must be updated. Test at 1280px.

## 4. Publication Acknowledgement Text

### Update the Acknowledgement Wording

**Search for:** `id="ackText"`

```html
<p id="ackText">"This work was performed in part at the Microelectronics
  Processing and Characterization Testing Lab (MPaCT) at Northern Arizona
  University, Flagstaff, AZ."
</p>

<!-- Edit only the text inside the <p> tag -->
<!-- The Copy button on the page reads this element's text automatically -->
```

!!! note

    The Copy button is wired to getElementById("ackText") in `JS/about.js`. As long as the id stays as ackText, the button will copy whatever text you put inside this paragraph.

## 5. Closing CTA Buttons

### Change Button Text or Destination

**Search for:** `<div class="about-cta__actions">`

```html
<div class="about-cta__actions">
  <a href="Contact_Us.html?category=other" class="btn btn-primary">
    Request Lab Access
  </a>
  <a href="Equipment.html" class="btn btn-outline about-cta__outline">
    Browse Equipment
  </a>
</div>
```
