---
layout: page
title: WSG Guidelines Data
meta_title: WSG Guidelines Data · SUSTAINABILITY.md
description: A human-readable view of the W3C Web Sustainability Guidelines data, sourced from the official W3C guidelines.json.
lede: A browsable index of W3C Web Sustainability Guidelines. The canonical machine-readable source is guidelines.json, fetched at build time from the W3C.
source_url: https://w3c.github.io/sustainableweb-wsg/guidelines.json
---

> **Machine-readable source:** The authoritative version of this data is
> [`guidelines.json`](../guidelines.json) — a JSON file fetched at build time
> directly from the [W3C Web Sustainability Guidelines repository](https://github.com/w3c/sustainableweb-wsg).
> It is intended for programmatic use by tools and AI agents.
> This page presents the same data in a human-friendly format.

---

The W3C Web Sustainability Guidelines (WSG) provide a framework for building
more sustainable digital products and services. The guidelines are organized
into four main areas:

- **User Experience Design** — how interfaces affect energy use and user behavior
- **Web Development** — code and asset choices that reduce environmental impact
- **Hosting, Infrastructure, and Systems** — server and infrastructure decisions
- **Business Strategy and Product Management** — organizational and policy levers

## View or download the data

The `guidelines.json` file is automatically fetched from the W3C at build time
and served alongside this site. It contains the full structured guideline data
including IDs, titles, descriptions, success criteria, and technique references.

- [Download guidelines.json](../guidelines.json) — machine-readable, intended for tools and AI agents
- [W3C Web Sustainability Guidelines](https://www.w3.org/TR/web-sustainability-guidelines/) — official specification
- [W3C sustainableweb-wsg repository](https://github.com/w3c/sustainableweb-wsg) — source of the JSON data

## How this project uses the guidelines

This project maps WSG guidelines to practical implementation patterns.
See the [WSG Reference Mapping](../wsg-references/) for the curated subset
used in this project, with descriptions and technique mappings.

## Using guidelines.json in your project

The `guidelines.json` file follows the W3C data format and can be used to:

- Build automated checks against specific guideline IDs
- Generate reports mapping your project's practices to WSG criteria
- Power AI prompts with structured sustainability guidance
- Create custom dashboards or compliance trackers

To fetch the latest version:

```sh
curl -fsSL "https://w3c.github.io/sustainableweb-wsg/guidelines.json" -o guidelines.json
```
