---
sustainability:
  standard: WSG 1.0

  applies_to:
    - web_application
    - design_system_components
  excludes:
    - legacy_modules
    - third_party_integrations

  ownership:
    sustainability_lead: TBD
    engineering_owner: TBD
    design_owner: TBD

  automated_tools:
    - lighthouse
    - co2.js
    - bundlewatch
  ci_pipeline: .github/workflows/ci.yml

  budgets:
    page_weight_budget_kb: 200
    request_count: 50

  release_gates:
    - page weight within budget
    - ci sustainability checks pass
    - third-party scripts reviewed and justified
    - no new critical sustainability regressions

  known_limitations: docs/sustainability/exceptions.md

  carbon_txt: carbon.txt
---

# SUSTAINABILITY.md

> Template for teams that want a practical, measurable sustainability policy for engineering, accessibility, and AI usage.

## Status and ownership

- Status: Draft | Active | Archived
- Sustainability lead: [name or role]
- Engineering owner: [name or role]
- Design owner: [name or role]
- Last updated: [YYYY-MM-DD]
- Review cadence: [monthly/quarterly]

## Team commitment

We commit to reducing digital waste and emissions by making sustainability part
of normal delivery work. We optimize for measurable improvement over perfection,
and we treat sustainability as a quality attribute alongside reliability,
security, performance, and accessibility.

## Scope

This policy applies to:

- Repositories: [list]
- Products/services: [list]
- Build and deployment workflows: [list]
- Third-party services and scripts: [list]

Out of scope for now:

- [list known exclusions]

## Baseline metrics

| Metric | Baseline | Target | Owner | Check cadence |
| :--- | :--- | :--- | :--- | :--- |
| Core page weight | [value] | [value] | [owner] | [cadence] |
| Request count | [value] | [value] | [owner] | [cadence] |
| CI compute minutes | [value] | [value] | [owner] | [cadence] |
| Third-party scripts | [value] | [value] | [owner] | [cadence] |
| Accessibility violations (critical) | [value] | [value] | [owner] | [cadence] |
| AI calls per PR | [value] | [value] | [owner] | [cadence] |

## Pull request requirements

All pull requests should include:

- Expected sustainability impact (increase/decrease/no change)
- Accessibility impact summary
- Third-party impact summary
- AI assistance disclosure when used

PR template fields:

- Sustainability impact:
- Accessibility checks run:
- AI tools used (if any):

## Accessibility as code (required checks)

Minimum required CI checks for each pull request:

- Linting for accessibility rules in markup/components
- Automated accessibility testing for changed pages/components
- Keyboard and focus-state checks for interactive elements
- Color contrast checks for text and controls
- Regression gating on critical accessibility failures

Suggested workflow policy:

- Block merge when new critical accessibility violations are introduced.
- Allow temporary exceptions only with issue link, owner, and expiry date.

## Sustainability as code (required checks)

Minimum required CI checks for each pull request:

- Page-weight budget checks
- Request-count budget checks
- Third-party script inventory and diff checks
- Media optimization checks
- Build footprint checks (for example CI minutes or job count)

Suggested workflow policy:

- Block merge when budgets regress beyond agreed thresholds.
- Require explicit approval for threshold changes.

## AI usage policy

### Default behavior

- Prefer deterministic tools first.
- Use AI only when it materially reduces rework or delivery risk.
- Keep prompts small and task-scoped.

### Allowed uses

- Refactoring analysis
- Drafting and summarization where deterministic automation is unavailable
- Migration planning and triage

### Restricted uses

- No always-on AI generation in CI for routine tasks
- No large-context prompts for trivial formatting or deterministic transforms
- No AI calls when local tooling can produce equivalent output
- No automatic activation of browser built-in AI features; require explicit user opt-in

### AI controls

- Limit model size and retries where practical
- Cache reusable outputs
- Track approximate AI call volume per issue/PR
- Review monthly and set reduction goals

## Time and space shifting

### Time shift

- Run deferrable jobs during lower-carbon windows where practical.
- Define maximum delay bounds for each job type.

### Space shift

- Prefer lower-carbon regions/providers when architecture allows.
- Use self-hosted runners for region-aware workloads when needed.

## Governance and exceptions

- Labels: `sustainability`, `accessibility`, `performance-budget`, `ai-usage`, `third-party-impact`
- Decision owners: [team]
- Exception process:
  1. Open issue with rationale
  2. Define owner and expiry date
  3. Add mitigation plan
  4. Revalidate before expiry

## Release gate criteria

All of the following must pass before any release ships:

- [ ] Page weight is within the agreed budget
- [ ] Request count is within the agreed budget
- [ ] No new third-party scripts introduced without review and justification
- [ ] CI sustainability checks pass
- [ ] Media assets are optimized (images, video, fonts)
- [ ] AI usage disclosed if applicable
- [ ] No new critical accessibility regressions (see [Accessibility as code](#accessibility-as-code-required-checks))

Temporary exceptions require an open issue with owner, rationale, and expiry date.

## Known limitations

Document active sustainability debt here. Each entry needs an owner and a target fix date.

| Issue | Status | Owner | Target date | Notes |
| :--- | :--- | :--- | :--- | :--- |
| [describe issue] | open | [owner] | [YYYY-MM-DD] | [mitigation plan] |

Review this table at each governance checkpoint. Close resolved entries and escalate overdue ones.

## References

- Web Sustainability Guidelines: https://www.w3.org/TR/web-sustainability-guidelines/
- Sustainable Web Design: https://sustainablewebdesign.org/
- Green Web Foundation CO2.js: https://github.com/thegreenwebfoundation/co2.js
- Carbon.txt standard: https://www.thegreenwebfoundation.org/tools/carbon-txt/

## Disclosure practices

Consider creating a `carbon.txt` file in your project root to provide machine-readable sustainability data and disclosure information.
This follows the [carbon.txt standard](https://www.thegreenwebfoundation.org/tools/carbon-txt/) developed by the Green Web Foundation,
making it easier for tools and services to discover and use your sustainability information.

## AI agent instruction block

Use in AGENTS.md, .cursorrules, or system prompts:

> Check SUSTAINABILITY.md before proposing or writing changes. Prefer low-compute deterministic solutions. Run required accessibility and sustainability checks in CI. If AI is used, keep context minimal, avoid duplicate calls, and disclose usage in the PR.
