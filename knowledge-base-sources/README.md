# MPaCT Lab Knowledge Base

This folder is the **only place you edit** the public knowledge-base (techniques, samples, instruments, comparisons).

It is not the nano.nau.edu website, and it is not the internal website-editing docs in `kb/`. You write Markdown here. MkDocs turns it into HTML in `site/`. Later, in the **website folder**, someone copies that generated `site/` folder onto the server as `knowledge-base/`.

```text
This folder (edit here)          Website folder (later)
------------------------         ----------------------
knowledge-base/                  nano.nau.edu files
  docs/*.md       you edit         knowledge-base/   <-- paste site/ here
  mkdocs.yml      already set
  docs/assets/extra.css
  overrides/      already set
  site/           generated
```

Theme, extra CSS, header, footer, and plugins are already wired. You do not restyle anything to add a page.

---

## One-time setup

You need Python 3 and a terminal. In VS Code: **Terminal → New Terminal**. Then:

```bash
cd knowledge-base
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`knowledge-base` is this folder — the one that contains `mkdocs.yml`. If you opened it from somewhere else, `cd` into it first.

Confirm you are in this folder:

```bash
pwd
ls mkdocs.yml
```

Every command below is run from this folder, with the virtual environment activated (`source .venv/bin/activate`).

---

## Everyday loop

1. Add or edit a Markdown file in `docs/`.
2. If it is a **new** file, add one line to that folder’s `.pages` file (the menu).
3. Build with strict checking.
4. Preview in a browser.

```bash
mkdocs build --strict
```

`--strict` is required. A normal `mkdocs build` can hide broken links and missing files. If strict fails, read the `ERROR` line, fix that file, and run it again until it passes.

Preview:

```bash
mkdocs serve -a 127.0.0.1:8000
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in a browser. Save a Markdown file and the preview reloads. Stop the preview with `Ctrl + C`.

The NAU site header and footer are included, but they load CSS and images from the main website (`/CSS/style.css`, `/Images/...`). Local preview is for the **docs content**. The chrome looks complete after `site/` is copied next to the website’s `CSS/` and `Images/` folders.

---

## Where pages go

| If the page is about… | Put the file in |
|---|---|
| A method (TEM, XRD, 3D printing, …) | `docs/techniques/` |
| A sample you already have | `docs/samples/` |
| Choosing between two methods | `docs/compare/` |
| A machine people search by make/model | `docs/instruments/` |
| A definition | `docs/concepts/` |
| The landing page | `docs/index.md` |

File names: lowercase words and hyphens, no spaces. Example: `x-ray-diffraction.md`.

---

## Add a new page (full example)

**Example:** a new technique page for “plasma cleaning”.

### 1. Create the Markdown file

In VS Code, right-click `docs/techniques/` → **New File**. Name it:

```text
plasma-cleaning.md
```

Open a similar page in the same folder (for example `x-ray-diffraction.md`) and copy its header block at the top, then write the page. The header is the YAML between `---` lines. Keep `title` and `description`. Copy the rest from a neighbour so search markup stays consistent.

```markdown
---
title: Plasma Cleaning
description: Plasma cleaning of samples at NAU's MPaCT Lab in Flagstaff, Arizona.
tags:
  - Sample Preparation
---

# Plasma Cleaning

Write the guide here. Link to other pages like this:
[X-ray Diffraction](x-ray-diffraction.md)
```

### 2. Put it in the menu (the YAML you change)

Each folder has a hidden file named `.pages`. That file **is** the menu. You usually do **not** edit `mkdocs.yml` to add a page. `mkdocs.yml` is already set (theme, plugins, extra CSS).

`.pages` is hidden in Finder. In VS Code it shows in the file list.

Open `docs/techniques/.pages` and add one line next to the other technique names. Use spaces, never tabs:

```yaml
nav:
  - Overview: index.md
  - TEM: transmission-electron-microscopy.md
  - Plasma cleaning: plasma-cleaning.md
```

The label on the left is what appears in the sidebar. The path on the right is the file name in that folder.

| New page lives in | Menu file to edit |
|---|---|
| `docs/techniques/` | `docs/techniques/.pages` |
| `docs/samples/` | `docs/samples/.pages` |
| `docs/compare/` | `docs/compare/.pages` |
| `docs/instruments/` | `docs/instruments/.pages` |
| `docs/concepts/` | `docs/concepts/.pages` |
| A brand-new top-level section | `docs/.pages` **and** `mkdocs.yml` only if you are changing site-wide settings |

### 3. Link it from the section hub (recommended)

Open that folder’s `index.md` (for techniques, `docs/techniques/index.md`) and add a row to the table so people can find it from the overview. If you skip this, the page still exists in the sidebar after step 2.

If the page should appear in the machine-readable index, add one line to `docs/llms.txt` as well.

### 4. Build strict, then preview

```bash
mkdocs build --strict
mkdocs serve -a 127.0.0.1:8000
```

If strict fails, the usual causes are:

| Message contains | What to do |
|---|---|
| `Doc file not found` | The `.pages` path does not match the file name |
| `Config value error` / YAML | You used a tab instead of spaces in `.pages` or `mkdocs.yml` |
| Broken link / `contains a link` | A `[text](file.md)` path is wrong |

Fix it, run `mkdocs build --strict` again, then preview.

---

## What is already done (do not redo)

These files are ready. Leave them alone unless you are changing site-wide look or the NAU header/footer.

| File | Role |
|---|---|
| `mkdocs.yml` | Site name, URL, Material theme, plugins |
| `docs/assets/extra.css` | Knowledge-base styling (loaded last on purpose) |
| `docs/assets/NAU.png` | Logo |
| `docs/assets/NAU_Nano_favicon.png` | Favicon |
| `overrides/` | NAU header, footer, and extra CSS load order |
| `docs/llms.txt` | Machine-readable index of the live pages |

`mkdocs.yml` must keep `site_url: https://nano.nau.edu/knowledge-base/` so canonical URLs and the sitemap stay correct.

---

## Generate the site for the website (later)

When `mkdocs build --strict` succeeds, HTML is in `site/`.

**Do not edit files inside `site/`.** The next build replaces that folder.

**Do not copy this whole project onto the server.** Copy only the generated site:

```bash
mkdocs build --strict
```

Then, in the website folder (a separate step, not in this project):

```text
Copy the contents of knowledge-base/site/
into the website's knowledge-base/ folder.
```

The website already has `CSS/`, `Images/`, `includes/`, and the rest of nano.nau.edu. This folder stays the docs source. The website folder stays the website.

---

## Rules that keep this easy

- Edit Markdown in `docs/` only.
- New page → add a line to that folder’s `.pages` → `mkdocs build --strict`.
- Do not put website PHP, `Equipment.html`, or `beta/` files in this folder.
- Do not commit or hand-edit `site/`.
- Spaces in YAML, never tabs.
