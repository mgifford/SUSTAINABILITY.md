---
layout: page
title: Action Playbook
meta_title: Action Playbook · SUSTAINABILITY.md
description: A practical playbook for teams and AI agents to reduce digital footprint through measurable, repeatable actions.
lede: Use this page to turn sustainability principles into everyday engineering and content decisions. Start small, measure consistently, and improve every cycle.
source_url: https://github.com/mgifford/sustainability.md
---

## What this page is for

This playbook translates sustainability principles into repeatable actions for humans and AI coding agents.
It is intentionally practical: short checklists, clear ownership, and measurable outcomes.

## Operating principles

- Measure before and after changes.
- Prefer simpler, lower-compute solutions.
- Keep critical paths lean; move heavy work out of request paths.
- Treat sustainability as an operational quality, like reliability and security.
- Improve continuously rather than waiting for perfect data.

## Rollout approach

### Phase 1: Starter commitment + CI gates first

- Publish a short public commitment in `SUSTAINABILITY.md`.
- Enforce CI gates for accessibility and sustainability budgets on every PR.
- Run Lighthouse on every PR against the live site URL.
- Start with realistic thresholds (for example 90+) to stabilize signal quality.

### Phase 2: Full template adoption after ownership is clear

- Add full sections for ownership, scope, exceptions, and governance.
- Establish metric baselines and monthly targets per owner.
- Tighten CI and Lighthouse gates progressively toward 100/100/100/100.

## Weekly workflow (team)

### 1) Plan with impact in mind (WSG 2.8)

Apply [WSG 2.8](https://www.w3.org/TR/web-sustainability-guidelines/#integrate-sustainability-into-every-stage-of-the-ideation-process) at the very start:

- Ask first: is this feature or change genuinely needed? What is the cost of not building it?
- Consider planet and community impact, not only the immediate user need.
- Choose the simplest approach that meets the requirement before designing the implementation.
- Tag work items with sustainability impact labels (for example: `performance-budget`, `third-party-impact`, `ai-usage`, `grid-aware`).
- Identify one expected effect for each change (for example: fewer requests, smaller page weight, reduced CI minutes).
- Assign an owner for measurement and follow-up.

### 2) Build with low-footprint defaults

- Prefer static generation and caching where possible.
- Remove unused scripts, CSS, fonts, and images before adding new assets.
- Use efficient media formats and right-sized images.
- Keep third-party dependencies to a justified minimum.

### 3) Review with a sustainability gate

- Verify no budget regressions in CI for page weight, request count, or build overhead.
- Require explicit justification for new third-party scripts and AI-heavy workflows.
- Block merges when thresholds regress beyond agreed limits.
- Review Lighthouse trendlines each month and ratchet thresholds upward.

## Monthly cadence (team)

### 1) Baseline and trend review

- Review key metrics trend lines (not only single-point snapshots).
- Compare current values against targets and previous month.
- Document top regressions and top improvements.

### 2) Focused optimization sprint

- Pick the highest-impact bottleneck first (largest transfer, noisiest script, heaviest job).
- Ship one or two concrete fixes with before/after evidence.
- Update standards/checklists to prevent recurrence.

### 3) Policy and knowledge updates

- Update this policy and related docs as architecture and tools change.
- Share wins, misses, and trade-offs with the broader team.
- Keep training lightweight but recurring.

## AI agent playbook

### Default behavior

- Prefer deterministic scripts and templates over model calls.
- Use the smallest suitable model and shortest useful context.
- Reuse cached outputs and avoid duplicate prompts.

### Allowed high-value AI use

- Migration planning and scoped refactoring analysis.
- Summarization where no deterministic equivalent is available.
- Triage tasks that reduce repeated human effort.

### Restricted use

- No routine always-on AI generation in CI.
- No large-context repetition for trivial formatting work.
- No AI call when a local deterministic tool can produce the same result.
- No automatic use of browser built-in AI features; always require explicit user opt-in.

### AI logging and accountability

- Record AI-assisted tasks in PR descriptions when relevant.
- Track approximate AI call volume per PR or issue.
- Review usage trends monthly and target reductions.

## Carbon-aware operations

## CO2.js measurement guidance

Use CO2.js to keep carbon estimation consistent across teams and PRs.

- Use `perByte(bytes, green)` when you want emissions for a single transfer event (for example: an upload, API payload, or one asset request).
- Use `perVisit(bytes, green)` when you want an estimated emissions figure for one full page view based on total transfer bytes.
- If you need explainability for audits, use `perByteTrace` or `perVisitTrace` to capture the variables used in the estimate.

### Practical decision pattern

- Calculate transfer estimates with CO2.js from measured bytes.
- Fetch current/local grid signal via a grid-aware source.
- If grid intensity is higher than average, serve a lighter variant (fewer heavy assets, defer non-critical media).
- If grid intensity is lower than average, allow richer non-critical enhancements.

Reference implementations and docs:

- https://developers.thegreenwebfoundation.org/co2js/overview/
- https://observablehq.com/@greenweb/co2-js-playground
- https://gaw.greenweb.org/grid-intensity/
- https://github.com/thegreenwebfoundation/grid-intensity
- https://www.thegreenwebfoundation.org/news/a-new-api-for-grid-aware-websites-and-beyond/

### Time shift

- Schedule deferrable jobs in lower-carbon windows when practical.
- Define safe delay bounds to protect delivery commitments.

### Space shift

- Prefer lower-carbon hosting regions where architecture allows.
- Use self-hosted runners for region-aware background jobs when needed.

### Keep constraints explicit

- Document platform constraints clearly (for example, limited control over hosted runner location).
- Focus optimization efforts where control is real and measurable.

## Suggested scorecard

Track at least these indicators:

- Core template page weight.
- Third-party request count.
- Build and CI compute minutes.
- AI calls per PR (or per release).
- Number of deferrable jobs shifted in time or space.

## 30-day starter checklist

- Week 1: Define 3-5 metrics and establish baseline.
- Week 2: Add CI checks for budgets and regressions.
- Week 3: Remove one major source of avoidable transfer or compute.
- Week 4: Publish results and set next-month targets.

Progress over perfection: repeat the cycle and make each month lighter than the last.
