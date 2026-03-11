# SUSTAINABILITY.md

> **Project instructions for reducing digital emissions, resource use, and waste across product, code, and operations.**

> **Status:** Draft (work in progress).
>
> **AI disclosure:** This repository has been developed with AI-assisted drafting and implementation support, with human review and editing.

Use this file like `SECURITY.md` or `AGENTS.md`: as an operational policy for humans and AI agents.

---

## Why this exists

- Set a single source of truth for web sustainability decisions.
- Build team habits that make sustainability part of day-to-day decisions.
- Incorporate practical best practices into how digital resources are designed, built, and maintained.
- Turn ideas from the Web Sustainability Guidelines into implementation choices teams can apply now.
- Make trade-offs explicit (performance, UX, business, and impact).
- Define hard rules for when AI is allowed, and when it is not.
- Serve as a reminder and call to action: be more sustainable today than yesterday, and prioritize progress over perfection.

---

## Core policy

### 1) Transparency and disclosure
- Publish scope: which pages, workflows, infrastructure, and third parties are measured.
- Publish baseline: page weight, request counts, build minutes, and hosting assumptions.
- Publish known gaps and remediation plans, with dates and owners.
- Map implementation choices to relevant WSG references.

### 2) Operational governance
- Use consistent issue labels (example: `sustainability`, `performance-budget`, `third-party-impact`, `ai-usage`, `grid-aware`).
- Do not merge when sustainability checks regress beyond agreed thresholds.
- Assign accountable owners for metrics, budget changes, and review cadence.

### 3) Automation and guardrails
- Enforce page-weight and request-count budgets in CI.
- Enforce third-party script review and justification.
- Enforce media optimization (images, video, fonts) and cache policy.
- Track changes over time; optimize regressions first, then net-new features.

### 4) Browser support guarantees (device longevity)
- Support baseline: latest major release plus previous 3 major releases for Chrome, Firefox, and Safari.
- Treat this as a sustainability requirement to reduce forced hardware/OS churn and extend device life.
- Core journeys must remain usable on older supported browsers through progressive enhancement.
- Avoid unnecessary polyfills or heavy bundles that increase transfer and runtime cost.

---

## AI usage policy (minimize by default)

### Default stance
- Prefer non-AI solutions first: static rules, deterministic scripts, templates, and cached results.
- Use AI only when it clearly reduces total lifecycle impact (time, compute, and rework).
- Treat every AI call as an energy and cost event that must be justified.

### Allowed uses
- Drafting and summarizing where equivalent deterministic automation does not exist.
- One-time migration support or refactoring discovery.
- Triage and analysis tasks that reduce repeated manual work.

### Disallowed or restricted uses
- No always-on AI generation in CI for routine checks.
- No repeated large-context prompts when smaller scoped prompts or local tooling suffice.
- No AI use for trivial formatting, boilerplate, or deterministic transformations.
- Do not activate browser built-in AI features automatically; they must always be opt-in by the user.

### AI controls
- Set prompt-size and request-rate limits.
- Prefer smaller models and fewer retries.
- Cache reusable outputs and avoid duplicate prompts.
- Log AI usage per task so teams can monitor and reduce over time.

---

## Shift processing in time and space

### Time shifting (when cleaner energy is available)
- Schedule non-urgent jobs (builds, batch updates, heavy reports) during lower-carbon windows.
- Use carbon-intensity signals (for example, Electricity Maps API) to gate deferrable workflows.
- Define maximum delay windows so delivery risk remains controlled.

### Space shifting (where cleaner energy is available)
- Prefer regions/providers with lower grid intensity when architecture allows.
- Keep region selection explicit in infrastructure config, not implicit defaults.
- Revisit region choices quarterly as grid mixes change.

### GitHub platform constraints
- **GitHub Pages:** deployment region is managed by GitHub/CDN and not user-pinable in a strict way.
- **GitHub Actions (hosted runners):** exact physical region and real-time energy mix are not guaranteed or directly selectable in most workflows.
- Practical workaround: use self-hosted runners in known regions for energy-aware jobs, and trigger only deferrable tasks there.
- For detailed analysis of GitHub's API capabilities and limitations, see [GitHub Actions and Sustainability](github-actions-sustainability.md).

---

## Break down load

- Split heavy work into smaller jobs with clear priorities (critical path vs deferrable).
- Precompute and cache expensive outputs; serve static artifacts where possible.
- Use incremental builds, partial deploys, and changed-files-only checks.
- Reduce data transfer first: smaller assets, fewer requests, fewer third-party calls.
- Move non-user-facing computation off request paths and into scheduled background tasks.

---

## Living metrics

| Metric | Target | Current | Owner |
| :--- | :--- | :--- | :--- |
| Page weight (core templates) | <= defined budget | Track in CI | Web team |
| Third-party requests | Minimize + justify | Track in CI | Platform |
| AI calls per PR | Downward trend | Track in logs | Engineering |
| Deferrable jobs shifted | Increase over time | Monthly report | DevOps |
| Carbon-intensity-aware runs | Increase over time | Monthly report | DevOps |

---

## Trusted references

- https://sustainablewebdesign.org/
- https://www.w3.org/TR/web-sustainability-guidelines/
- https://w3c.github.io/sustainableweb-wsg/guidelines.json
- https://github.com/w3c/sustyweb
- https://w3c.github.io/sustainableweb-wsg/resources.html
- https://www.thegreenwebfoundation.org/
- https://developers.thegreenwebfoundation.org/co2js/overview/
- https://github.com/thegreenwebfoundation/co2.js/
- https://observablehq.com/@greenweb/co2-js-playground
- https://gaw.greenweb.org/grid-intensity/
- https://github.com/thegreenwebfoundation/grid-intensity
- https://www.thegreenwebfoundation.org/news/a-new-api-for-grid-aware-websites-and-beyond/
- https://www.thegreenwebfoundation.org/news/how-do-we-work-out-the-environmental-savings-from-accessibility/
- https://www.nicchan.me/blog/exploring-grid-aware-websites/
- https://app.electricitymaps.com/developer-hub/api/getting-started#geolocation
- https://www.thegreenwebfoundation.org/news/ending-this-month-the-best-chance-in-years-to-fix-the-rules-for-green-energy/
- https://rtl.chrisadams.me.uk/2026/01/how-i-think-of-decarbonising-the-energy-used-by-datacentres-on-the-grid/

---

## AI agent instruction snippet

Add this to `.cursorrules`, `AGENTS.md`, or your system prompt:

> Before generating code or content, check `SUSTAINABILITY.md`. Prefer deterministic, low-compute approaches. Use AI only when justified, keep prompts minimal, and route deferrable heavy tasks to lower-carbon windows or known lower-carbon regions when possible.

---

## AI Disclosure

This section documents actual AI usage in this project, distinct from the [AI usage policy](#ai-usage-policy-minimize-by-default) above.

### In building

- Content drafting, structural editing, and documentation were assisted by AI (GitHub Copilot / GPT-4-class models).
- Code suggestions, refactoring, and CI workflow generation used AI assistance with human review and editing.
- Policy templates and examples were co-drafted with AI and reviewed by human maintainers before publishing.

### In execution

- No AI runs automatically at runtime or page load. The site is a static Jekyll build served via GitHub Pages.
- No AI-powered features are activated in the browser automatically; any future AI features must be explicitly opt-in by the user (per policy in the [AI usage policy](#ai-usage-policy-minimize-by-default) section).
- GitHub Actions CI workflows do not include always-on AI generation steps.

### Models used

| Purpose | Model / tool | When used |
| :--- | :--- | :--- |
| Code assistance and PR support | GitHub Copilot (OpenAI Codex / GPT-4-class) | During development |
| Content drafting and editing | OpenAI GPT-4-class via Copilot Chat | During development |
| Policy review and improvement | OpenAI GPT-4-class via Copilot Chat | During development |

---

## Repo contents

- `README.md`: policy and implementation model.
- `SUSTAINABILITY-template.md`: full reusable policy template for other teams.
- `carbon.txt`: machine-readable sustainability data and disclosure information following the [carbon.txt standard](https://www.thegreenwebfoundation.org/tools/carbon-txt/).
- `examples/SUSTAINABILITY_PROMPT_STARTER.html`: LLM prompt starter for drafting project-specific sustainability policy.
- `action-playbook.md`: action-oriented checklist for teams and AI agents.
- `github-actions-sustainability.md`: detailed guide to GitHub API capabilities and limitations for carbon-aware computing.
- `WSG_REFERENCES.yaml`: machine-readable WSG and STAR mapping.
- `CONTRIBUTING.md`: participation guide for contributors.

## Automation

- GitHub Pages build fetches the latest `guidelines.json` from the WSG source at build time.
- The repository intentionally does not track a committed local copy of `guidelines.json`.
- CI checks run on pushes and pull requests for Markdown linting, YAML linting/validation, workflow linting, local link checking, and Jekyll build verification.
- Lighthouse CI runs on every non-draft pull request against `https://mgifford.github.io/sustainability.md/` with category score gates (starter thresholds), and should be tightened over time toward 100 in all categories.

## Contributing

- Submit PRs that improve measurability, reduce compute, or strengthen guardrails.
- Include before/after impact notes for significant changes.
