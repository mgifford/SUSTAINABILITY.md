# AGENTS.md

This repository supports AI coding agents.

## Canonical instructions

The canonical, repo-specific instructions for AI contributors live in:

- `.github/copilot-instructions.md`
- `ACCESSIBILITY.md`
- `CONTENT-STYLE-GUIDE.md`
- `SUSTAINABILITY.md`

All agents (Copilot and non-Copilot) should treat these files as the primary source of truth for contribution behavior, scope, and quality standards.

Before proposing, generating, or modifying code/content:

1. Read `ACCESSIBILITY.md` for inclusion and usability requirements.
2. Read `CONTENT-STYLE-GUIDE.md` for writing conventions, including the humans-first ordering rule.
3. Read `SUSTAINABILITY.md` for performance, resource efficiency, and AI-usage limits.
4. Apply the stricter rule if there is tension between speed and quality.

## Fallback behavior

If any instruction source conflicts, follow this precedence:

1. Direct human maintainer instruction
2. `.github/copilot-instructions.md`
3. `ACCESSIBILITY.md`
4. `CONTENT-STYLE-GUIDE.md`
5. `SUSTAINABILITY.md`
6. Local file conventions and existing project style

## Notes

- Keep changes minimal and request-scoped.
- Validate Markdown/YAML after edits.
- Prefer deterministic, low-compute solutions where feasible.
- Minimize AI usage and keep prompts/task context as small as practical.

For AGENTS.md background and interoperability context, see:

- https://agents.md/
