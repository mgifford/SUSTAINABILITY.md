---
title: CI/CD Sustainability Best Practices
---

# CI/CD Sustainability Best Practices

Integrating sustainability into your CI/CD pipeline ensures that every byte transferred and every CPU cycle burned is intentional. This guide focuses on a **"Zero-Waste" strategy**: achieving **100/100 scores** on all pages and minimizing carbon intensity through local-first auditing and carbon-aware execution.

-----

## 1\. The Strategy: Shared Audits & Carbon Awareness

To be truly sustainable, we must avoid redundant compute.

  * **The Shared Quality Gate:** Google Lighthouse audits both Accessibility and Performance in a single pass. We use this as a unified gate. A **100 score** in both categories is mandatory. This satisfies the requirements for both `ACCESSIBILITY.md` and `SUSTAINABILITY.md` without doubling the energy cost of the audit.
  * **Local-First Default:** We run the bulk of testing on the developer’s machine to leverage local energy (often renewable in home/office settings) and reduce the "embodied carbon" of cloud-provider runners.
  * **Carbon-Aware Execution:** The pipeline is configurable. If local energy consumption is higher (e.g., a gas-heavy local grid vs. a carbon-neutral data center), the audit can be offloaded to the server.

-----

## 2\. Local-First Setup

Testing should happen before code is pushed to GitHub to minimize "failed build" cycles on the server.

### Installation

```bash
npm install -g @lhci/cli
npm install -D @playwright/test @dgkanatsios/co2js husky
```

### Conditional Execution Script

Create a script (`scripts/check-carbon-env.js`) to decide where to run the audit based on your environment or local grid intensity.

```javascript
// scripts/check-carbon-env.js
const { execSync } = require('child_process');

const runOnServer = process.env.SUSTAINABILITY_SERVER_ONLY === 'true';

if (runOnServer) {
  console.log("Environment set to SERVER: Offloading audit to CI runner.");
} else {
  console.log("Environment set to LOCAL: Running sustainability audit locally.");
  try {
    execSync('lhci autorun && npx playwright test tests/carbon.spec.ts', { stdio: 'inherit' });
  } catch (error) {
    process.exit(1);
  }
}
```

### Pre-push Hook

Use **Husky** to ensure the audit runs before every push:

```bash
# .husky/pre-push
npm run test:sustainability
```

-----

## 3\. Google Lighthouse CI (The Unified Gate)

We enforce a strict **100% score** for **Performance** (to reduce client-side energy) and **Accessibility** (to ensure inclusive resilience).

**Configuration (`.lighthouserc.js`):**

```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      numberOfRuns: 1,
      settings: {
        emulatedFormFactor: 'mobile', // Mobile-first for maximum energy constraint
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'total-byte-weight': ['error', { maxNumericValue: 500000 }], // 500kb cap
        'unused-javascript': 'error',
        'unminified-images': 'error',
      },
    },
  },
};
```

-----

## 4\. Playwright + CO2.js (Carbon Deep Dive)

While Lighthouse provides the score, we use Playwright and **CO2.js** (by The Green Web Foundation) to calculate the actual carbon load per page view. This is our non-redundant "Sustainability Deep Dive."

**`tests/carbon.spec.ts`:**

```typescript
import { test, expect } from '@playwright/test';
import { co2 } from '@dgkanatsios/co2js';

const swd = new co2({ model: 'swd' }); // Sustainable Web Design model

test('Verify Page Carbon Budget', async ({ page }) => {
  let transferSize = 0;

  // Track every byte transferred over the wire
  page.on('response', async (res) => {
    const buffer = await res.body().catch(() => null);
    if (buffer) transferSize += buffer.length;
  });

  await page.goto('/');
  
  const co2Grams = swd.perByte(transferSize);
  console.log(`Carbon footprint: ${co2Grams.toFixed(4)}g CO2e`);

  // Target: Under 0.3g CO2 per initial page load
  expect(co2Grams).toBeLessThan(0.3);
});
```

-----

## 5\. GitHub Actions & External Audits

### Monthly Sustainability Snapshot

We run a full-site audit monthly to track long-term "Carbon Gravity."

```yaml
name: Monthly Sustainability Snapshot
on:
  schedule:
    - cron: '0 0 1 * *' 
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1 # Shallow clone to save energy
          
      - name: Eco-CI (Energy Measurement)
        uses: green-coding-berlin/eco-ci-action@v2
        with:
          task: start

      - name: Run Unified Audit
        run: |
          npm ci
          npm run build
          npm run test:sustainability # Runs LHCI and Playwright

      - name: Report CI Emissions
        uses: green-coding-berlin/eco-ci-action@v2
        with:
          task: display-results
```

### Measuring GitHub Actions Carbon Load

We use **Eco-CI** to estimate the CO2 load of the pipeline itself. This helps identify if our optimization efforts (like caching or shallow clones) are actually reducing the runner's footprint.

-----

## 6\. Governance & SLAs

  * **The 100/100 Rule:** Any page with a Lighthouse Accessibility or Performance score under **100** blocks the merge.
  * **Carbon Budget:** Any page exceeding **0.5g of CO2** (per CO2.js) triggers a manual "Weight Reduction" review.
  * **Triage:** Failures from scheduled scans are converted into GitHub Issues. Monthly snapshots are archived to monitor the site's environmental impact over time.
  * **External Audits:** Use [Open-Scans](https://github.com/mgifford/open-scans) for external, multi-engine validation of the live site.

-----

## References

  * [CO2.js Overview](https://developers.thegreenwebfoundation.org/co2js/overview/): The standard for calculating digital carbon footprints.
  * [Eco-CI Action](https://www.google.com/search?q=https://github.com/green-coding-berlin/eco-ci-action): Measuring energy in GitHub Actions.
  * [Open-Scans](https://github.com/mgifford/open-scans): External sustainability auditing.
  * [Green DevOps (Medium)](https://medium.com/@pranabpiitk2024/green-devops-measuring-and-reducing-carbon-emissions-in-ci-cd-pipelines-d91ce54adbe0): Measuring and reducing carbon in pipelines.
  * [Carbon-Aware CI/CD Strategies (BugFree.ai)](https://bugfree.ai/knowledge-hub/carbon-aware-ci-cd-deployment-strategies)
  * [Carbon Conscious Pipelines (DiverseDaily)](https://diversedaily.com/carbon-conscious-ci-cd-pipelines-optimizing-development-and-testing-environments-for-energy-efficiency/)
  * [Green DevOps (DZone)](https://dzone.com/articles/green-devops-sustainable-ci-cd-cloud)
  * [Sustainable Software Engineering (ArXiv)](https://arxiv.org/pdf/2310.18718)
  * [Sustainable CI/CD Practices (GraphApp)](https://www.graphapp.ai/blog/sustainable-ci-cd-practices-how-to-optimize-resource-usage-in-build-pipelines)
