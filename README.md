---
layout: page
title: Policy File
meta_title: Policy File · SUSTAINABILITY.md
description: Project instructions for reducing digital emissions, resource use, and waste across product, code, and operations.
lede: A reference SUSTAINABILITY.md policy — use as-is or adapt for your own project.
source_url: https://raw.githubusercontent.com/mgifford/sustainability.md/main/README.md
---

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

### 5) Third-party assessment (WSG 4.10)

Apply the same sustainability scrutiny to third-party services and CDNs as to first-party code ([WSG 4.10](https://www.w3.org/TR/web-sustainability-guidelines/#give-third-parties-the-same-priority-as-first-parties-during-assessment)).

When a dependency, CDN, analytics service, social embed, or other external resource is added or reviewed, require explicit answers to:

- **Is it necessary?** Can the need be met with first-party or self-hosted code?
- **What is the transfer weight?** How many additional kilobytes does it add per page view?
- **Where does it run?** Is the host region, energy mix, or renewable credential known and acceptable?
- **What data does it send?** Are privacy and data-residency implications acceptable?
- **What is the fallback?** Does the page degrade gracefully if the third-party resource fails or is slow?
- **Is the provider aligned?** Does the vendor have a published sustainability or renewable energy commitment?

For code reviewers and AI agents: flag any new `<script src="...">`, `import ... from "cdn..."`, stylesheet `@import` from an external host, or `<iframe>` embed as requiring the above checklist before merge.

### 6) Browser support guarantees (device longevity)
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

### Code-first decision ladder

Before reaching for AI, work through this sequence and stop at the first step that fits:

1. **Deterministic code**: Can a script, rule, linter, or static transformation handle this reliably? Write or configure it.
2. **Existing tooling**: Is there a CLI tool, library, or workflow step that already covers this accurately? Use it.
3. **Caching or precomputation**: Can the result be computed once and reused without re-running? Cache it.
4. **Reduced frequency**: Can this run less often, or only when a relevant file or condition changes? Limit it.
5. **Human action**: Is this infrequent or one-off enough that a person can handle it directly? Do it manually.
6. **AI — justified only**: Use AI only when all the above are impractical and AI demonstrably reduces total lifecycle cost.

Each lower step increases reproducibility, reduces energy use, and shrinks the blast radius of failures.

### Lazy execution: only run what will be used

- Do not run a process unless its output will be consumed.
- Gate CI steps on changed paths: run image checks only when images change, run link checks only when Markdown changes.
- Avoid unconditional always-on checks that fire on every push regardless of what changed.
- Cache expensive outputs and skip recomputation when inputs have not changed.
- Skip or defer background jobs when a lightweight heuristic confirms no relevant change occurred.

### Component energy intensity

Not all web components carry the same computational cost. Per [WSG energy intensity](https://www.w3.org/TR/web-sustainability-guidelines/#energy-intensity), the relative cost increases across technology layers:

1. **Unstyled text**: minimal render cost.
2. **Styled text / CSS**: moderate layout and paint cost.
3. **JavaScript**: runtime CPU cost for parsing, compiling, and execution.
4. **WebGL / 4K video**: high GPU, memory, and decode cost.

When choosing or generating code, prefer the lightest technology that delivers the required outcome. For example: use a CSS transform instead of a JavaScript animation, a static image instead of video, a styled element instead of a canvas or WebGL effect.
Apply this principle to AI-generated code: do not reach for a heavier technology layer unless a lighter one cannot meet the need.

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

How to establish baselines: run Lighthouse CI against the production URL, record output, and set initial budget thresholds at or below the measured baseline. Re-measure after each significant change.

| Metric | Target | Current | Owner |
| :--- | :--- | :--- | :--- |
| Page weight (core templates) | <= measured baseline | Not yet established — run Lighthouse to set initial baseline | Web team |
| Third-party requests | 0 unjustified; justify all | Audit via DevTools Network panel | Platform |
| AI calls per PR | Downward trend | Log in PR descriptions; review monthly | Engineering |
| Deferrable jobs shifted | Increase over time | Track in CI logs; report monthly | DevOps |
| Carbon-intensity-aware runs | Increase over time | Track in CI logs; report monthly | DevOps |

## Known limitations

Active sustainability debt for this project. Each entry has an owner and a target date.

| Issue | Status | Owner | Target date | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Green hosting status unknown — GitHub Pages CDN energy mix not published | open | @mgifford | 2026-06-30 | Monitor GitHub/Azure sustainability disclosures |
| No formal carbon budget established for page weight or CI compute | open | @mgifford | 2026-06-30 | Run baseline Lighthouse measurement; set initial CI budget thresholds |
| AI call volume per PR tracked informally | open | @mgifford | 2026-09-30 | Add structured field to PR template; review monthly |
| Grid-aware serving not implemented | open | @mgifford | 2026-12-31 | Evaluate feasibility; document constraints in github-actions-sustainability.md |

---

## Trusted references

The trusted references for this project are maintained in machine-readable format:

- **Machine-readable:** [`examples/TRUSTED_SOURCES.yaml`](examples/TRUSTED_SOURCES.yaml)
- **Human-readable:** [WSG Resources (W3C editor draft)](https://w3c.github.io/sustainableweb-wsg/resources.html)

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
- `CONTENT-STYLE-GUIDE.md`: writing conventions for documentation contributors and AI agents.
- `carbon.txt`: machine-readable sustainability data and disclosure information following the [carbon.txt standard](https://www.thegreenwebfoundation.org/tools/carbon-txt/).
- `examples/SUSTAINABILITY_PROMPT_STARTER.html`: LLM prompt starter for drafting project-specific sustainability policy.
- `action-playbook.md`: action-oriented checklist for teams and AI agents.
- `github-actions-sustainability.md`: detailed guide to GitHub API capabilities and limitations for carbon-aware computing.
- `WSG_REFERENCES.yaml`: machine-readable WSG and STAR mapping.
- `examples/TRUSTED_SOURCES.yaml`: machine-readable list of trusted sustainability references (see also [WSG Resources](https://w3c.github.io/sustainableweb-wsg/resources.html)).
- `CONTRIBUTING.md`: participation guide for contributors.

## Automation

- GitHub Pages build fetches the latest `guidelines.json` from the WSG source at build time.
- The repository intentionally does not track a committed local copy of `guidelines.json`.
- CI checks run on pushes and pull requests for Markdown linting, YAML linting/validation, workflow linting, local link checking, and Jekyll build verification.
- Lighthouse CI runs on every non-draft pull request against `https://mgifford.github.io/sustainability.md/` with category score gates (starter thresholds), and should be tightened over time toward 100 in all categories.

## Contributing

- Submit PRs that improve measurability, reduce compute, or strengthen guardrails.
- Include before/after impact notes for significant changes.
