---
layout: page
title: GitHub Actions and Sustainability
meta_title: GitHub Actions and Sustainability · SUSTAINABILITY.md
description: Understanding GitHub's API capabilities and limitations for sustainability-aware compute scheduling.
lede: A practical guide to what GitHub's API provides (and doesn't provide) for carbon-aware computing, with actionable recommendations for time and region shifting.
---

## Overview

This document addresses a common question: **Does GitHub's API provide sustainability information that could be used to define better times to compute?**

**Short answer:** No, GitHub's public API does not currently expose carbon intensity, energy mix, datacenter location, or real-time grid data for hosted runners.

## What GitHub's API provides

### Available through GitHub Actions API

The [GitHub Actions REST API](https://docs.github.com/en/rest/actions) provides:

- Workflow run status and logs
- Job execution times and outcomes
- Runner usage statistics (minutes consumed)
- Artifact management
- Self-hosted runner registration and management

### Not available through GitHub's API

The following sustainability-related data is **not exposed** via GitHub's public API:

- Physical datacenter location for hosted runners
- Real-time carbon intensity of the grid powering the runner
- Energy mix (renewable vs. fossil fuel) for specific workflow runs
- Per-job energy consumption or carbon emissions estimates
- Regional availability or ability to select specific Azure regions for hosted runners

## GitHub-hosted runner infrastructure

### Current constraints

1. **Hosting platform:** GitHub-hosted runners run on Microsoft Azure virtual machines
2. **Region control:** Users cannot select or pin specific Azure regions for standard hosted runners
3. **Datacenter opacity:** The exact physical location of runners is not exposed or guaranteed
4. **No real-time energy signals:** GitHub does not provide APIs to query grid carbon intensity or renewable energy percentage at run time

Source: [About GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners)

### What this means for time and region shifting

**For hosted runners:**
- ❌ **Region shifting is not possible** with standard hosted runners (you cannot choose or switch regions)
- ❌ **Real-time grid-aware scheduling is not supported** (no API access to carbon intensity data)
- ⚠️ **Time shifting is partially possible** (you can defer non-urgent jobs, but you don't know the carbon impact of the shift)

**For self-hosted runners:**
- ✅ **Region shifting is possible** (you control where runners are deployed)
- ✅ **Time shifting is possible** (you can integrate with carbon intensity APIs)
- ✅ **Full control** over infrastructure and energy-aware scheduling decisions

## Microsoft's sustainability tools

While GitHub's API doesn't provide job-level sustainability data, Microsoft offers some related tools:

### Emissions Impact Dashboard

Microsoft provides [Emissions Impact Dashboard](https://www.microsoft.com/en-us/sustainability) for:
- Azure cloud resource consumption estimates
- Microsoft 365 usage carbon footprint
- Organization-level reporting

**Limitations for GitHub Actions:**
- Not granular to individual workflow runs or jobs
- Not accessible via API for real-time decision-making
- Requires enterprise-level Azure or M365 subscriptions

## Practical recommendations

### 1. Use self-hosted runners for carbon-aware workloads

If region and time shifting are priorities:

```yaml
jobs:
  carbon-aware-build:
    runs-on: self-hosted
    # Deploy your self-hosted runner in a low-carbon region
    # Integrate with carbon intensity APIs before triggering
```

**Implementation steps:**
1. Deploy self-hosted runners in regions with cleaner energy grids
2. Use [Electricity Maps API](https://app.electricitymaps.com/developer-hub/api/getting-started) or [Grid Intensity CLI](https://github.com/thegreenwebfoundation/grid-intensity) to check current carbon intensity
3. Schedule deferrable jobs during low-carbon windows
4. Set maximum delay bounds to protect delivery commitments

### 2. Time-shift deferrable workloads

For non-urgent jobs (nightly builds, batch processing, reports):

```yaml
on:
  schedule:
    # Run during typical low-demand hours
    # (actual carbon impact depends on grid and location)
    - cron: '0 2 * * *'  # 2 AM UTC
```

**Limitations:**
- You won't know the actual carbon intensity without external data
- GitHub-hosted runners may run in different datacenters even at the same time
- This is a best-effort approach without real-time carbon feedback

### 3. Minimize compute overhead

Focus on what you can control directly:

- **Reduce job runtime:** Faster jobs consume less energy
- **Use caching aggressively:** Avoid redundant computation
- **Right-size runner resources:** Don't over-provision
- **Remove unused workflows:** Dead code still consumes CI minutes
- **Use incremental builds:** Only rebuild what changed

### 4. Monitor and measure

Track metrics you can influence:

```yaml
# Example: Track CI minutes per month
# Report in your SUSTAINABILITY.md metrics table
```

Key metrics:
- Total Actions minutes consumed per month
- Average job duration trends
- Cache hit rates
- Failed job retry overhead

### 5. Estimate CI energy with Eco CI

[Eco CI Energy Estimation](https://github.com/marketplace/actions/eco-ci-energy-estimation) by Green Coding Solutions estimates energy consumption of GitHub Actions jobs using CPU
utilization data and pre-calculated power curves from real hardware models. It works on GitHub-hosted runners without requiring physical hardware access.

Add it to any job to measure energy and optional CO₂ estimates:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Start energy measurement
        uses: green-coding-solutions/eco-ci-energy-estimation@v5
        with:
          task: start-measurement
        continue-on-error: true

      # ... your build steps ...

      - name: Display energy results
        uses: green-coding-solutions/eco-ci-energy-estimation@v5
        with:
          task: display-results
        continue-on-error: true
```

**What it provides:**
- Energy estimate in Joules per job
- CO₂ estimate in grams (using a configurable grid intensity constant or a live API)
- Results can be posted as a PR comment (requires `pull-requests: write` permission) and optionally sent to [metrics.green-coding.io](https://metrics.green-coding.io/ci-index.html)

**Trade-offs and limitations:**
- Uses `continue-on-error: true` because the action can fail on some hosted runner configurations; this is the recommended production setting
- Energy values are model-based estimates, not physical measurements — treat them as directional proxies and track trends rather than absolute values
- By default, data is sent to `metrics.green-coding.io`; set `send-data: false` to keep results local
- Requires at minimum `contents: read` permission; posting PR comments requires `pull-requests: write`

## Alternative approaches

### Carbon-aware workflow control (experimental)

You could implement external carbon-aware gating:

```yaml
jobs:
  check-carbon-intensity:
    runs-on: ubuntu-latest
    outputs:
      should-run: ${{ steps.carbon-check.outputs.run }}
    steps:
      - name: Check carbon intensity
        id: carbon-check
        run: |
          # Call external carbon API
          # Return 'true' if intensity is below threshold
          echo "run=true" >> $GITHUB_OUTPUT

  heavy-job:
    needs: check-carbon-intensity
    if: needs.check-carbon-intensity.outputs.should-run == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Run heavy computation
        run: npm run build
```

**Trade-offs:**
- Adds complexity and a dependency on external APIs
- The check job itself consumes compute
- Still doesn't solve the region selection problem
- May delay delivery unpredictably

## Future possibilities

### What would help from GitHub

The sustainability community would benefit if GitHub provided:

1. **Runner location transparency:** Expose which Azure region a job ran in
2. **Carbon intensity API:** Real-time or historical carbon data per runner
3. **Region selection:** Allow users to prefer or pin regions for hosted runners (especially for larger runners)
4. **Energy consumption metrics:** Per-job energy use estimates in Actions telemetry
5. **Green runner pools:** Pre-configured runner groups in regions with cleaner grids

### Advocacy and feedback

If these capabilities are important to you:

- Submit feedback via [GitHub Community Discussions](https://github.com/orgs/community/discussions)
- Mention sustainability as a use case in feature requests
- Share this document and use cases with GitHub support

## Summary

| Capability               | GitHub-hosted runners    | Self-hosted runners          |
|:-------------------------|:-------------------------|:-----------------------------|
| Region selection         | ❌ Not available         | ✅ Full control              |
| Carbon intensity API     | ❌ Not available         | ✅ Via external APIs         |
| Time shifting            | ⚠️ Partial (no feedback) | ✅ With carbon awareness     |
| Energy consumption data  | ⚠️ Estimation via Eco CI | ⚠️ Requires custom tooling   |

**Bottom line:** For sustainability-aware compute scheduling, self-hosted runners with external carbon intensity APIs are currently the only practical option. GitHub-hosted runners do not expose the data needed for informed region or time-shifting decisions.

## Related resources

- [About self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Eco CI Energy Estimation (GitHub Marketplace)](https://github.com/marketplace/actions/eco-ci-energy-estimation)
- [Eco CI source repository](https://github.com/green-coding-solutions/eco-ci-energy-estimation)
- [Electricity Maps API](https://app.electricitymaps.com/developer-hub/api/getting-started)
- [Grid Intensity CLI](https://github.com/thegreenwebfoundation/grid-intensity)
- [CO2.js for carbon estimation](https://developers.thegreenwebfoundation.org/co2js/overview/)
- [Microsoft Emissions Impact Dashboard](https://www.microsoft.com/en-us/sustainability)

---

**Last updated:** 2026-02-22  
**Status:** Current as of GitHub Actions API and documentation review
