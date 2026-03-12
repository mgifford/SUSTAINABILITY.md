---
layout: page
title: Reporting Digital Sustainability Metrics
meta_title: Reporting Digital Sustainability Metrics · SUSTAINABILITY.md
description: Best practices and code examples for how websites can transparently report CO2 emissions, energy usage, and page weight via website footers and the CARBON.txt standard.
lede: A practical guide to transparent sustainability disclosure — covering human-readable website footers, the machine-readable CARBON.txt standard, and the tools used to generate and validate both.
---

## Overview

Sustainability reporting closes the gap between internal commitments and external accountability.
This page covers two complementary layers of disclosure:

1. **Website footer** — human-readable, visible to every visitor.
2. **CARBON.txt** — machine-readable, discoverable by auditors and crawlers.

Together they satisfy the W3C Web Sustainability Guidelines call for organizational transparency.

WSG alignment: [WSG 5.x – Establish Sustainability Reporting Mechanisms](https://www.w3.org/TR/web-sustainability-guidelines/#establish-sustainability-reporting-mechanisms)

---

## Metric definitions

Report only what you can measure and substantiate. The four metrics below cover the
minimum meaningful disclosure for a web property.

| Metric            | Unit                | Definition                                                                     |
| :---------------- | :------------------ | :----------------------------------------------------------------------------- |
| CO₂ per page view | grams CO₂e          | Estimated carbon emitted per visit using a standard model such as SWD          |
| Page weight       | KB or MB            | Total transfer size of a page including HTML, CSS, JS, images, and fonts       |
| Energy intensity  | kWh per GB          | Estimated energy consumed to transfer one gigabyte of data to end users        |
| Hosting source    | renewable / unknown | Whether the hosting provider appears on the Green Web Foundation verified list |

Use the [Sustainable Web Design (SWD) model](https://sustainablewebdesign.org/estimating-digital-emissions/)
for CO₂ estimates unless you have access to more precise data. Document your methodology so
auditors can reproduce the number.

---

## Section 1: Website footer disclosures

The footer is the conventional place for sustainability disclosures on modern sustainable sites.
Visitors encounter it without a detour; crawlers index it with the rest of the page.

### Low-impact disclosure design

Prefer plain text over heavy badge images. A sustainability disclosure that is itself
resource-heavy undermines the message. Concrete guidance:

- Use text and a single small inline SVG at most — avoid external badge images.
- Link to the methodology or audit report, not just a tool's landing page.
- Keep the disclosure to one or two lines. Dense prose will not be read.
- Do not auto-play video or load third-party widgets to show the number.

### Minimal sustainability footer snippet

The HTML below follows the low-impact disclosure pattern. The inline SVG leaf icon is
approximately 500 bytes; the CSS adds no external resources.

```html
<footer class="sustainability-footer">
  <p class="sustainability-disclosure">
    <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24"
      fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8C8 10 5.9 16.17 3.82 22c1.95-1.8 4.6-3 7.68-3
               C16.5 19 21 14.5 21 9c0-.38-.03-.76-.07-1.13C20.12 8.3
               18.61 8 17 8z"/>
    </svg>
    This page transferred approximately <strong>0.24&nbsp;g CO₂e</strong>.
    <!-- Replace 0.24 with your measured value from a Lighthouse or WebPageTest audit. -->
    Hosted on <a href="https://www.thegreenwebfoundation.org/"
      rel="noopener">verified green energy</a>.
    <a href="/sustainability-report/">Methodology</a>.
  </p>
</footer>
```

```css
.sustainability-footer {
  border-top: 1px solid #e5e5e5;
  padding: 1rem 0;
  font-size: 0.85rem;
  color: #555;
}

.sustainability-disclosure {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
}
```

### Static vs. dynamic reporting

**Static baseline (recommended for most sites):** Run a Lighthouse or WebPageTest audit quarterly.
Record the result in your `SUSTAINABILITY.md` and render it as a static string in the footer.
No JavaScript is required at runtime.

**Dynamic calculation with CO2.js:** Appropriate for dashboards or pages where the page weight
varies significantly between loads. CO2.js calculates an estimate in the browser from the
Navigation Timing API.

```javascript
// Dynamic footer disclosure using CO2.js
// https://developers.thegreenwebfoundation.org/co2js/overview/
import { co2 } from "@tgwf/co2";

const swd = new co2({ model: "swd" });

window.addEventListener("load", () => {
  // Use the total transferred bytes from the browser's performance API
  const entries = performance.getEntriesByType("resource");
  const totalBytes = entries.reduce(
    (sum, entry) => sum + (entry.transferSize || 0),
    0,
  );

  // Pass true if your host is on the Green Web Foundation verified list.
  // Check: https://www.thegreenwebfoundation.org/
  // For a static site you can determine this once and hard-code the result.
  const greenHosted = true; // replace with false if not verified
  const gramsco2 = swd.perVisit(totalBytes, greenHosted);

  const el = document.getElementById("co2-estimate");
  if (el) {
    el.textContent = `${gramsco2.toFixed(2)} g CO₂e`;
  }
});
```

```html
<!-- Pair with the script above -->
<p class="sustainability-disclosure">
  This page transferred approximately
  <strong id="co2-estimate">calculating…</strong>.
</p>
```

**Trade-off:** Dynamic calculation adds JavaScript runtime cost. For a static site, the static
baseline is lower-impact and equally informative. Reserve dynamic calculation for cases where
the number is meaningfully different between page loads.

See [CO2JS\_FOOTER\_DEMO.html](examples/CO2JS_FOOTER_DEMO.html) for a fully working,
copy-paste example that also checks green-hosting status and formats transfer size — the same
pattern used on the SUSTAINABILITY.md project site.

---

## Section 2: The CARBON.txt standard

### Purpose and placement

`CARBON.txt` is a machine-readable sustainability disclosure file developed by the
[Green Web Foundation](https://www.thegreenwebfoundation.org/tools/carbon-txt/).
Place it at the root of your domain:

```text
https://yourdomain.com/carbon.txt
```

The file lets automated auditors, crawlers, and supply-chain tools verify:

- Which organization operates the site.
- Whether the hosting infrastructure uses renewable energy.
- Where to find the full sustainability report or CSRD disclosure.

It is analogous to `robots.txt` and `security.txt` — a well-known location that tools
can discover without a human in the loop.

### CARBON.txt file example

`CARBON.txt` uses [TOML](https://toml.io/) syntax. The minimum viable file includes
an organization block, a disclosures block, and an infrastructure block.

```toml
[org]
name = "Example Organisation"
url  = "https://example.com"

[disclosures]
# Link to your full sustainability report, CSRD document, or policy page
report = "https://example.com/sustainability-report-2025"

[infrastructure]
# List one entry per hosting provider
[[infrastructure.providers]]
name         = "Green Cloud Provider"
country      = "DE"
region       = "eu-west-1"
green_energy = true
# Optionally link to Green Web Foundation verification
gwf_verified = "https://www.thegreenwebfoundation.org/green-web-check/?url=example.com"
```

### Key fields

| Field                                     | Required | Description                                                       |
| :---------------------------------------- | :------- | :---------------------------------------------------------------- |
| `org.name`                                | Yes      | Legal or trading name of the organization running the site        |
| `org.url`                                 | Yes      | Canonical URL of the organization                                 |
| `disclosures.report`                      | Yes      | URL of the full sustainability report or CSRD disclosure document |
| `infrastructure.providers[].name`         | Yes      | Name of each hosting provider                                     |
| `infrastructure.providers[].green_energy` | No       | Whether this provider uses verified renewable energy              |
| `infrastructure.providers[].gwf_verified` | No       | Link to the Green Web Foundation verification page                |

### Serving CARBON.txt

For static sites (including GitHub Pages), place `carbon.txt` in the repository root.
Ensure the file is served with `Content-Type: text/plain`.

For sites with access to server configuration, add an explicit MIME type:

```nginx
# nginx
location = /carbon.txt {
    default_type text/plain;
}
```

```apache
# Apache .htaccess
<Files "carbon.txt">
    ForceType text/plain
</Files>
```

### Validating your CARBON.txt

Use the Green Web Foundation's validator to check your file before publishing:
[https://www.thegreenwebfoundation.org/tools/carbon-txt/](https://www.thegreenwebfoundation.org/tools/carbon-txt/)

---

## Section 3: Recommended tools

### CO2.js (Green Web Foundation)

[CO2.js](https://developers.thegreenwebfoundation.org/co2js/overview/) is the reference
JavaScript library for converting bytes transferred into a CO₂ estimate. It supports two
models: the Sustainable Web Design (SWD) model and the OneByte model.

Use it for:

- Generating the number shown in your footer disclosure.
- Running CO₂ regression checks in CI.
- Comparing page variants during design or code review.

```bash
npm install @tgwf/co2
```

### Website Carbon and Ecograder

These tools run a one-off audit and return a baseline CO₂ estimate and rating:

- [Website Carbon Calculator](https://www.websitecarbon.com/) — enter a URL and receive
  a grams-per-visit estimate, hosting check, and a shareable rating badge.
- [Ecograder](https://ecograder.com/) — scores a page against performance, green hosting,
  UX, and web standards criteria. Useful for identifying where to focus first.

Both tools are suitable for establishing a baseline before integrating CO2.js into CI.
Run them quarterly and record the output in your `SUSTAINABILITY.md` metrics table.

### W3C Web Sustainability Guidelines — Organizational Reporting

The WSG includes dedicated guidance on public reporting under
[Section 5: Business Strategy and Products](https://www.w3.org/TR/web-sustainability-guidelines/#business-strategy-and-products).
Specific guidelines relevant to this page:

- **5.19 – Establish Sustainability Reporting Mechanisms:** Publish regular
  sustainability reports and make them publicly accessible.
- **5.20 – Create a Stakeholder-Focused Sustainability Roadmap:** Commit to measurable
  targets with named owners and review cadences.

Aligning your footer and CARBON.txt disclosures with the WSG gives auditors a framework
for verifying your claims against an independent standard.

---

## Summary

| Disclosure method     | Audience        | Format              | Update cadence               |
| :-------------------- | :-------------- | :------------------ | :--------------------------- |
| Website footer        | All visitors    | HTML (static or JS) | Per release or quarterly     |
| CARBON.txt            | Automated tools | TOML at domain root | When hosting changes         |
| Sustainability report | Stakeholders    | PDF or web page     | Annually (CSRD) or quarterly |

Start with a static footer disclosure and a minimal `CARBON.txt`. Add dynamic calculation
and full organizational reporting as your measurement practice matures.

---

## Related resources

- [Green Web Foundation — carbon.txt](https://www.thegreenwebfoundation.org/tools/carbon-txt/)
- [CO2.js documentation](https://developers.thegreenwebfoundation.org/co2js/overview/)
- [Sustainable Web Design model](https://sustainablewebdesign.org/estimating-digital-emissions/)
- [Website Carbon Calculator](https://www.websitecarbon.com/)
- [Ecograder](https://ecograder.com/)
- [W3C Web Sustainability Guidelines — Business Strategy](https://www.w3.org/TR/web-sustainability-guidelines/#business-strategy-and-products)
- [Green Web Foundation — hosting check](https://www.thegreenwebfoundation.org/)
- [Measuring Web Energy Use](./measuring-energy/)
- [GitHub Actions sustainability guide](./github-actions-sustainability/)

---

**Last updated:** 2026-03-11
**Status:** Current as of carbon.txt specification and CO2.js v0.x; verify field names against the latest Green Web Foundation documentation.
