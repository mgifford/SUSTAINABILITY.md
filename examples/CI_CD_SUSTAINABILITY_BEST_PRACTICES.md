---
title: CI/CD Sustainability Best Practices
---

# CI/CD Sustainability Best Practices

Digital sustainability in CI/CD is the practice of minimizing the carbon footprint of both the **software produced** and the **pipeline that builds it**. A sustainable pipeline is efficient, carbon-aware, and avoids "zombie" compute cycles.

## The "Carbon-First" Strategy

A sustainable digital resource must be lightweight and performant. Our strategy focuses on:

  * **Zero-Waste Performance:** Targeting 100% Lighthouse Performance scores to reduce client-side energy consumption.
  * **Data Minimization:** Using `CO2.js` to track the carbon intensity of every byte transferred.
  * **Carbon-Aware Pipelines:** Scheduling resource-heavy tasks when grid carbon intensity is lower.
  * **Resource Optimization:** Reducing CI runner time through aggressive caching and efficient build steps.

-----

## 1\. Lighthouse CI (The Efficiency Gate)

Performance is the best proxy for sustainability. A faster-loading site requires less energy from the user's device and the network.

**Configuration (`.lighthouserc.js`):**
We enforce a strict Performance budget. Any regression that slows the site increases its carbon footprint.

```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1 }],
        // High scores here ensure efficient asset delivery
        'resource-summary:document:size': ['warn', { maxNumericValue: 50000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 100000 }],
        'unminified-javascript': 'error',
      },
    },
  },
};
```

-----

## 2\. Playwright + CO2.js (Carbon Auditing)

While Lighthouse gives a score, `CO2.js` (by The Green Web Foundation) provides actual carbon estimates based on data transfer. We use Playwright to crawl the site and calculate the emissions per page view.

**Example Test (`tests/sustainability.spec.ts`):**

```typescript
import { test, expect } from '@playwright/test';
import { co2 } from '@dgkanatsios/co2js'; // Using the CO2.js library

const swd = new co2({ model: 'swd' }); // Sustainable Web Design model

test('Carbon footprint audit', async ({ page }) => {
  let totalBytes = 0;

  // Track every byte transferred over the wire
  page.on('response', async (response) => {
    const headers = response.headers();
    if (headers['content-length']) {
      totalBytes += parseInt(headers['content-length'], 10);
    }
  });

  await page.goto('/');
  
  // Calculate CO2 in grams
  const estimate = swd.perByte(totalBytes);
  console.log(`Total Bytes: ${totalBytes} | Estimated CO2: ${estimate.toFixed(4)}g`);

  // Set a carbon budget (e.g., less than 0.2g per initial page load)
  expect(estimate).toBeLessThan(0.2);
});
```

-----

## 3\. GitHub Actions: Green DevOps

The pipeline itself consumes energy. We must optimize the runner to minimize the "embodied carbon" of our builds.

### A. Carbon-Aware Scheduling

Instead of running full site crawls on every commit, we run them monthly or during off-peak hours for the local energy grid.

```yaml
name: Monthly Sustainability Audit
on:
  schedule:
    - cron: '0 0 1 * *' # 1st of every month at midnight
  workflow_dispatch: # Allow manual trigger

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and Audit
        run: |
          npm ci
          npm run build
          npm run test:sustainability
```

### B. Efficiency Checklist for Runners

  * **Aggressive Caching:** Use `actions/cache` for `node_modules` and build artifacts to prevent re-downloading and re-compiling.
  * **Shallow Clones:** Use `fetch-depth: 1` in `actions/checkout` to avoid pulling unnecessary git history.
  * **Avoid Redundancy:** Use `concurrency` groups to cancel in-progress builds when a new commit is pushed to the same branch.

-----

## 4\. Measuring the CI/CD Carbon Load

Measuring the actual CO2 cost of running GitHub Actions is complex because Cloud providers (Azure/GitHub) do not always expose real-time energy metrics per runner. However, we can use the following tools to estimate the load:

### Eco-CI (by Cloud\&Heat)

[Eco-CI](https://www.google.com/search?q=https://github.com/green-coding-berlin/eco-ci-action) is a specialized GitHub Action that estimates the energy consumption and CO2 emissions of your specific workflow.

**Implementation:**

```yaml
- name: Initialize Eco-CI
  uses: green-coding-berlin/eco-ci-action@v2
  with:
    task: start

# ... run your build/test steps here ...

- name: Calculate Eco-CI Results
  uses: green-coding-berlin/eco-ci-action@v2
  with:
    task: display-results
```

-----

## Governance & SLAs

  - **Performance Budget:** Any page with a Lighthouse Performance score under 100 blocks the build.
  - **Carbon Budget:** Any page exceeding **0.5g of CO2** (calculated via CO2.js) triggers a manual review.
  - **Artifact Retention:** Keep CI logs and artifacts for a maximum of 7 days to reduce storage energy on GitHub’s servers.
  - **Image Optimization:** All images must be processed through a compression step (e.g., WebP conversion) before being deployed to GitHub Pages.

-----

## References & Further Reading

  * [CO2.js Overview](https://developers.thegreenwebfoundation.org/co2js/overview/): The standard for calculating digital carbon footprints.
  * [Eco-CI Action](https://www.google.com/search?q=https://github.com/green-coding-berlin/eco-ci-action): Measuring energy in GitHub Actions.
  * [Open-Scans](https://github.com/mgifford/open-scans): Useful for multi-engine external sustainability audits.
  * [Green DevOps (Medium)](https://medium.com/@pranabpiitk2024/green-devops-measuring-and-reducing-carbon-emissions-in-ci-cd-pipelines-d91ce54adbe0): Strategies for reducing emissions in the pipeline.
  * [ArXiv: Sustainable Software Engineering](https://arxiv.org/pdf/2310.18718): A formal study on measuring and reducing software carbon intensity.
  * [Sustainable CI/CD Practices (GraphApp)](https://www.graphapp.ai/blog/sustainable-ci-cd-practices-how-to-optimize-resource-usage-in-build-pipelines): Focus on resource optimization and build efficiency.
