# Copilot Instructions for `sustainability.md`

These instructions guide AI-assisted contributions in this repository.

## Repository purpose

This project defines and demonstrates practical sustainability governance for web projects, including:

- Policy and implementation guidance in Markdown
- Web Sustainability Guidelines (WSG) mappings in YAML
- A Jekyll-based documentation site

## Priorities

1. Accuracy over novelty
2. Minimal, focused diffs
3. Measurable sustainability impact
4. Accessibility and readability
5. Deterministic, low-compute approaches by default

## Required workflow for changes

- Read related files before editing to preserve tone and structure.
- Prefer updating existing docs over adding new files unless requested.
- Keep examples practical and implementation-ready.
- When adding links, prefer canonical project/organization sources.
- Validate syntax for changed Markdown/YAML files.

## Content style

Follow [`CONTENT-STYLE-GUIDE.md`](../CONTENT-STYLE-GUIDE.md) for all writing conventions. Key rules:

- List humans before AI agents or automated systems.
- Keep writing concise, concrete, and actionable.
- Use plain language and avoid hype.
- Prefer checklists, phased rollout steps, and measurable outcomes.
- Preserve existing section hierarchy and formatting conventions.

## Sustainability policy alignment

When proposing technical patterns:

- Prefer simpler/lighter solutions first.
- Avoid suggesting always-on AI workflows for routine tasks.
- Emphasize budgeting, regression gates, and trend tracking.
- Be explicit about assumptions and operational constraints.

## File-specific guidance

### `README.md`

- Keep it as the policy and implementation model overview.
- Add references only if they are credible and directly useful.

### `index.md`

- Keep homepage content short and practical.
- Avoid heavy client-side additions unless specifically requested.

### `action-playbook.md`

- Prioritize operational guidance (who, what, when, how measured).
- Use phased and repeatable workflows.

### `WSG_REFERENCES.yaml`

- Maintain valid YAML structure and stable keys.
- Keep names/descriptions concise and implementation-focused.
- Do not remove existing mappings without explicit request.

## Guardrails

- Do not add license headers unless asked.
- Do not reformat unrelated content.
- Do not introduce speculative claims or unverified metrics.
- Do not change CI thresholds or governance posture unless requested.

## Validation checklist

Before finalizing:

- Changed files are scoped to the request.
- Markdown/YAML diagnostics show no new errors.
- Links added are relevant and likely stable.
- Documentation remains consistent with repository tone.
