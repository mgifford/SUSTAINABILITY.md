---
layout: page
title: Measuring Web Energy Use
meta_title: Measuring Web Energy Use · SUSTAINABILITY.md
description: Practical guidance on measuring the energy impact of web projects across server, transmission, storage, execution, and engagement layers, including current tools and their known limitations.
lede: A practical guide to measuring the energy footprint of web projects, aligned with WSG 4.x. Covers the five layers of digital energy use, available tools, and what each can and cannot tell you.
---

## Overview

Measuring energy use in web systems is genuinely difficult. There is no single metric, no single tool,
and no single moment in the lifecycle where all costs are visible. This page maps the five major cost
layers, lists the best available tools for each, and is honest about what each approach cannot tell you.

WSG alignment: [WSG 4.x – Set Goals Based on Performance and Energy Impact](https://www.w3.org/TR/web-sustainability-guidelines/#set-goals-based-on-performance-and-energy-impact)

The W3C Web Sustainability Guidelines specifically call for measuring and setting goals based on
performance and energy impact. The sections below help you decide where to measure and what tools to use.

---

## The five layers of web energy use

Energy costs in a web project span five layers. Each layer has different measurement approaches,
different owners, and different tooling.

| Layer        | What it covers                                                      | Who typically owns it     |
| :----------- | :------------------------------------------------------------------ | :------------------------ |
| Server       | Compute power for request handling, APIs, build pipelines           | Ops / backend engineering |
| Transmission | Network transfer: bytes × grid carbon intensity of the path         | Front-end / infra         |
| Storage      | Databases, object storage, caches, CDN edge storage                 | Ops / data engineering    |
| Execution    | Client-side CPU/GPU: JavaScript, rendering, layout, compositing     | Front-end engineering     |
| Engagement   | Time on device, idle timers, autoplay, infinite scroll, push energy | Product / UX              |

No single tool covers all five. Treat any measurement as a partial proxy, not a complete account.

---

## Server layer

### Server: what to measure

- CPU utilization and wall-clock time per request or job
- Memory and I/O throughput
- Energy per unit of useful work (requests served, jobs completed)
- Idle overhead between requests

### Server: tools

#### Cloud provider dashboards

- [AWS Carbon Footprint Tool](https://aws.amazon.com/aws-cost-management/aws-customer-carbon-footprint-tool/) – organization-level estimate; not per-request
- [Google Cloud Carbon Footprint](https://cloud.google.com/carbon-footprint) – project-level; monthly granularity
- [Microsoft Emissions Impact Dashboard](https://www.microsoft.com/en-us/sustainability) – Azure and M365 level; not per-job

#### Profiling and APM

- Server-side profiling tools (e.g., `perf`, `pyspy`, language-level profilers) – identify CPU-heavy paths that drive energy up
- APM platforms (Datadog, New Relic, Grafana) – request duration and throughput trends

#### Open source

- [Scaphandre](https://github.com/hubblo-org/scaphandre) – power consumption metrics exposed via eBPF; works on bare-metal and some VMs
- [Kepler (CNCF)](https://github.com/sustainable-computing-io/kepler) – Kubernetes pod-level energy estimation using hardware counters

### Server: limitations

- Cloud provider dashboards use spending-based allocation models, not direct energy meters. Numbers are approximations tied to billing, not physics.
- Most shared hosting and managed platforms give no energy visibility at all.
- Cold-start costs and idle-time overhead are rarely captured by request-scoped metrics.

---

## Transmission layer

### Transmission: what to measure

- Total bytes transferred per page load or API call (compressed and uncompressed)
- Number of requests (reduces overhead from headers and connection setup)
- Use of efficient protocols (HTTP/2, HTTP/3, Brotli/gzip compression)
- Cache hit rate (cached responses skip network and upstream compute)

### Transmission: tools

#### Browser-based

- [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) – page weight audit, unused JavaScript, render-blocking resources, image optimization
- Browser DevTools Network panel – waterfall, transfer sizes, cache status per request
- [WebPageTest](https://www.webpagetest.org/) – multi-location testing, byte breakdown, core web vitals, video filmstrip

#### Estimation

- [CO2.js](https://developers.thegreenwebfoundation.org/co2js/overview/) – converts bytes transferred to an estimated CO₂ equivalent using the Sustainable Web Design (SWD) model or the OneByte model
  - [CO2.js playground on Observable](https://observablehq.com/@greenweb/co2-js-playground) – interactive exploration without setup
  - [CO2.js GitHub repository](https://github.com/thegreenwebfoundation/co2.js/)

#### CI integration

- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) – run Lighthouse in CI and block on regressions
- [bundlesize](https://github.com/siddharthkp/bundlesize) / [size-limit](https://github.com/ai/size-limit) – enforce per-bundle weight budgets in CI
- [Eco CI Energy Estimation](https://github.com/marketplace/actions/eco-ci-energy-estimation) – estimate energy and CO₂ for GitHub Actions jobs using CPU utilization and hardware power curves; works on hosted runners

### Transmission: limitations

- CO2.js uses system-level averages for the full stack; it does not observe your specific server or network path. Treat outputs as directional, not precise.
- Lighthouse and WebPageTest measure a single synthetic load. Real user conditions (connection speed, location, device) vary significantly.
- Transmission estimates do not capture the renewable versus fossil mix of the specific network path at the time of transfer.
- Cache behavior on repeat visits is difficult to model in synthetic tests; real user monitoring (RUM) is needed to see real cache rates.

---

## Storage layer

### Storage: what to measure

- Total data volume stored (databases, object storage, backups, logs, CDN edge caches)
- Data growth rate and time-to-deletion policy
- Read/write patterns (hot vs. cold storage; frequent access drives more energy than archival)
- Redundancy overhead (replication factor × base energy)

### Storage: tools

- Cloud provider consoles and billing dashboards – storage volume trends and access patterns
- Database profiling tools – query frequency and data volume scanned per query
- Logging and observability stacks (Loki, Elasticsearch, Splunk) – log volume growth and retention costs

### Storage: limitations

- Storage energy is largely invisible without cloud provider disclosure; most providers do not report it at resource level.
- Replication and geographic redundancy multiply energy costs but are often not disaggregated in billing.
- Data retention policies have a large impact but are rarely surfaced in sustainability tooling.

---

## Execution layer

### Execution: what to measure

- JavaScript parse, compile, and execution time
- Main-thread blocking time (Total Blocking Time / TBT)
- Layout and style recalculation cost
- GPU compositing cost (animations, transforms, paint layers)
- Frame rate stability (especially on low-power devices)

### Execution: tools

#### Browser profiling

- Chrome DevTools Performance panel – flame charts showing JS execution, layout, paint, and compositing
- [Firefox Profiler](https://profiler.firefox.com/) – flame chart with a dedicated **Power** track that shows real CPU power draw (watts); useful for cross-browser comparison and the only mainstream browser profiler with built-in energy data
- [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals) – Interaction to Next Paint (INP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS)

##### Using Firefox Profiler to measure execution energy

Firefox Profiler exposes a **Power** track when running on supported hardware (macOS with Apple Silicon or Intel, and Linux with `perf` support). This is the closest a browser comes to reporting actual device energy use.

**Steps:**

1. Open [profiler.firefox.com](https://profiler.firefox.com/) in Firefox, or enable the profiler toolbar button via `about:profiling`.
2. In the profiler settings, ensure **Power** is checked under the available tracks.
3. Click **Start Recording**, then perform the interaction you want to measure (a page load, a scroll, a button click, a form submit).
4. Click **Capture Recording**. The profile opens in the Firefox Profiler UI.
5. In the timeline at the top, locate the **Power** track. It shows power consumption in milliwatts over time.
6. Select a time range in the Power track to zoom into a specific interaction. The flame chart below updates to show which functions ran during that window.
7. Look for:
   - **Sustained high power** during an interaction that should be fast — indicates unnecessary JS execution, layout thrashing, or expensive paint.
   - **Power spikes during idle** — indicates timers, polling, or background tasks keeping the CPU awake.
   - **Disproportionate power for a small interaction** — a sign the cost can be reduced.

**Sharing a profile for review:**

Use **Upload Local Profile** in the profiler UI to share a profile URL without uploading any source code. Profiles can be reviewed asynchronously by teammates or filed alongside issues.

**Pairing with transmission-layer estimates:**

The Power track covers execution energy (CPU/GPU). To pair it with a transmission-layer CO₂ estimate,
note the total transfer size from the Network panel DevTools (or the page emissions line in the site
footer), then cross-reference using [CO2.js](https://developers.thegreenwebfoundation.org/co2js/overview/)
or the [CO2.js playground on Observable](https://observablehq.com/@greenweb/co2-js-playground).

**Hardware and platform notes:**

| Platform | Power track availability |
| :--- | :--- |
| macOS (Apple Silicon) | Available; uses Apple Energy Model |
| macOS (Intel) | Available; uses Intel RAPL via IOKit |
| Linux | Available when `perf` is installed and has access to hardware counters |
| Windows | Not available in Firefox Profiler |
| Android (Firefox for Android) | Not available |

If the Power track does not appear, execution time (Total Blocking Time, main-thread duration) is still a useful proxy: reducing execution time reliably reduces energy use.

#### Synthetic auditing

- [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) – Total Blocking Time, Speed Index, JavaScript execution time audit
- [WebPageTest](https://www.webpagetest.org/) – CPU utilization traces and Web Vitals across devices and locations

#### Real user monitoring

- [Chrome User Experience Report (CrUX)](https://developer.chrome.com/docs/crux/) – field data for Core Web Vitals on real user hardware
- RUM libraries (web-vitals.js, etc.) – capture INP and LCP in production

### Execution: limitations

- Browser DevTools and Lighthouse use a single (usually fast) machine. Energy cost on older or lower-power devices is much higher and rarely tested.
- Firefox Profiler's Power track requires supported hardware (macOS or Linux with `perf`); it is not available on Windows or Android. When unavailable, execution time (Total Blocking Time, main-thread duration) remains a reliable proxy.
- There is no direct watt-hour reading available in most browsers; execution time and CPU utilization are proxies for energy.
- Third-party scripts are often the largest source of execution cost but hardest to control.

---

## Engagement layer

### Engagement: what to measure

- Time on page / session duration for sessions where engagement is not the goal (e.g., loading spinners, blocked users)
- Autoplay media (video/audio) – high device energy cost
- Infinite scroll and polling intervals – continuous CPU and network wake-ups
- Push notifications and background sync – wake device radio on each delivery
- Idle timer behavior (does the page sleep or keep polling?)

### Engagement: tools

- Web analytics platforms (Plausible, Matomo, GA4) – session duration, bounce rate, engagement rate
- Browser DevTools Application panel – Service Worker, background sync, push subscriptions
- [Lighthouse Performance audit](https://developer.chrome.com/docs/lighthouse/performance/) – flags autoplay and resource hints

### Engagement: limitations

- Engagement energy is almost entirely absent from current tooling. There are no standard metrics for energy per session or energy per user task completion.
- Behavioral patterns (dark patterns that extend sessions, push notification abuse) have real energy costs that no tool currently surfaces.
- This layer is the least instrumented and the most dependent on product decisions rather than engineering optimization.

---

## Recommended measurement approach

No single tool covers everything. A practical minimum-viable approach:

### 1. Measure page weight in CI (transmission + execution proxy)

Run Lighthouse CI on every pull request. Set budgets and block regressions:

```yaml
# .lighthouserc.json (simplified)
{
  "ci": {
    "assert": {
      "assertions": {
        "total-byte-weight": ["error", { "maxNumericValue": 500000 }],
        "unused-javascript": ["warn", { "maxNumericValue": 50000 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }]
      }
    }
  }
}
```

### 2. Estimate CO₂ per page load (transmission layer)

Use CO2.js to convert your page weight to a rough CO₂ estimate:

```javascript
import { co2 } from "@tgwf/co2";

const swd = new co2({ model: "swd" });
const bytes = 450_000; // your page weight in bytes
const greenHosted = false; // is your host on the Green Web Foundation list?

const estimate = swd.perVisit(bytes, greenHosted);
console.log(`Estimated CO2 per visit: ${estimate.toFixed(4)} grams`);
```

Track this number in your `SUSTAINABILITY.md` metrics table and set a budget.
Regression in page weight drives regression in this estimate.

### 3. Track server compute trends (server layer)

Even if you cannot get watt-level data, track:

- Build time and CI minutes per week
- API response time trends
- CPU utilization trends on your hosting platform

Sustained increases in these metrics usually mean increased energy.

### 4. Review engagement patterns quarterly (engagement layer)

Review your analytics for:

- Sessions with unusually long durations but low task completion (may indicate friction, not value)
- Autoplay media usage
- Push notification delivery rates and opt-out rates

---

## Tool summary

| Tool                      | Layer(s)                | What it gives you                                             | Limitations                                                              |
| :------------------------ | :---------------------- | :------------------------------------------------------------ | :----------------------------------------------------------------------- |
| Google Lighthouse         | Transmission, Execution | Page weight, JS cost, blocking time audits                    | Synthetic only; one device and network                                   |
| CO2.js                    | Transmission            | Bytes to CO₂ estimate (SWD or OneByte model)                  | System average; not path-specific                                        |
| WebPageTest               | Transmission, Execution | Multi-location, filmstrip, CPU traces                         | Synthetic; free tier limited                                             |
| Chrome DevTools           | Execution               | Flame charts, paint, layout, compositing                      | No watt reading; fast hardware only                                      |
| Firefox Profiler          | Execution               | Flame chart + Power track (milliwatts) on supported hardware  | Power track requires macOS or Linux with `perf`; unavailable on Windows  |
| Lighthouse CI             | Transmission, Execution | CI regression gates on performance budgets                    | Synthetic; needs baseline to be useful                                   |
| Eco CI Energy Estimation  | Server (CI/CD)          | Energy (Joules) and CO₂ estimate per CI job                   | Model-based estimate; not a physical measurement                         |
| CrUX / RUM                | Execution               | Real user Core Web Vitals                                     | No direct energy signal                                                  |
| Scaphandre / Kepler       | Server                  | Power draw on bare-metal/Kubernetes                           | Requires infra access; not on shared hosting                             |
| Cloud providers dashboard | Server, Storage         | Org/project-level carbon estimates                            | Spending-based allocation; not per-request                               |
| Web analytics             | Engagement              | Session duration, bounce rate                                 | No energy signal; behavioral proxy only                                  |

---

## Honest summary of limitations

- **There is no complete web energy meter.** Every tool above measures a proxy or a subset of the full lifecycle.
- **CO2.js is a useful approximation**, not a measurement. Use it for trend tracking and goal-setting, not for precise reporting.
- **Lighthouse scores do not equal energy scores.** A fast, lightweight page uses less energy than a slow, heavy one, but the relationship is not linear and depends on device, network, and caching.
- **The engagement and storage layers are the least instrumented** and often the largest source of avoidable cost at scale. Product and data decisions matter as much as code optimization.
- **Green hosting reduces grid carbon intensity** but does not eliminate energy use. Verify your host using the [Green Web Foundation](https://www.thegreenwebfoundation.org/) check, and pass `greenHosted: true` to CO2.js for a more accurate estimate.

---

## Related resources

- [W3C WSG – Set Goals Based on Performance and Energy Impact](https://www.w3.org/TR/web-sustainability-guidelines/#set-goals-based-on-performance-and-energy-impact)
- [CO2.js documentation](https://developers.thegreenwebfoundation.org/co2js/overview/)
- [Sustainable Web Design model (SWD)](https://sustainablewebdesign.org/estimating-digital-emissions/)
- [Firefox Profiler](https://profiler.firefox.com/) – flame chart profiler with Power track for CPU energy measurement
- [Firefox Profiler – Power profiling documentation](https://profiler.firefox.com/docs/#/./guide-power-profiling)
- [Google Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://www.webpagetest.org/)
- [Eco CI Energy Estimation](https://github.com/marketplace/actions/eco-ci-energy-estimation)
- [Scaphandre power monitoring](https://github.com/hubblo-org/scaphandre)
- [Kepler – Kubernetes energy monitoring (CNCF)](https://github.com/sustainable-computing-io/kepler)
- [Green Web Foundation – hosting check](https://www.thegreenwebfoundation.org/)
- [Chrome User Experience Report (CrUX)](https://developer.chrome.com/docs/crux/)
- [GitHub Actions sustainability guide](./github-actions-sustainability/)

---

**Last updated:** 2026-04-04
**Status:** Current as of tooling review; update tool versions and model references as the field evolves.
