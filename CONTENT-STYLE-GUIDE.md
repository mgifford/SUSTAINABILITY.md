---
layout: page
title: Content Style Guide
meta_title: Content Style Guide · SUSTAINABILITY.md
description: Writing conventions for contributors and AI agents working in this repository.
lede: Practical rules for clear, human-first documentation.
---

> Writing conventions for all documentation in this repository. Applies to contributors and AI agents.

## Scope

Applies to:

- Markdown documentation and policy files
- Jekyll page content and front matter
- YAML comments and descriptions
- PR descriptions and commit messages

## Core principle: humans first

When listing any combination of humans and automated systems, list humans first.

- Write primarily for human readers. Automated tools are secondary audiences.
- When listing audiences or actors, place humans before AI agents, bots, or automated systems.
- When callouts address both humans and agents, address humans first.

**Examples:**

| Avoid | Prefer |
| :--- | :--- |
| AI agents and reviewers | Reviewers and AI agents |
| For AI agents and code review | For code reviewers and AI agents |
| Bots and contributors | Contributors and automated tools |

Listing humans first aids adoption, reflects the project's values, and makes documents welcoming to the people who matter most.

## Writing conventions

- Use plain language. Avoid jargon, marketing language, and vague qualifiers.
- Be concrete and actionable: prefer "run Lighthouse on every PR" over "consider performance".
- Use active voice and imperative mood for instructions.
- Keep sentences and sections short. Split rather than grow.

## Structure conventions

- Place the most important, human-relevant information first.
- Use numbered lists when sequence matters; bullet lists when items are equivalent.
- Use headings that describe an action or outcome, not just a topic.
- Use tables for metrics, comparisons, and accountability entries.

## AI and automation references

- Describe AI as a tool, not an actor: "AI-assisted drafting" not "AI wrote this".
- Use "AI agents" or "AI coding agents", not "bots" or "robots".
- When content addresses both humans and AI, humans come first (see [humans first](#core-principle-humans-first)).

## Terminology

- Use "sustainability" not "green" for resource efficiency and digital impact.
- Link standards by full name: W3C Web Sustainability Guidelines (WSG), WCAG 2.2 AA.
- Use "contributors" for people making changes; "maintainers" for people with review or merge authority.

## Agent instruction snippet

Add to `AGENTS.md` or system prompts:

> Read `CONTENT-STYLE-GUIDE.md` before writing or editing documentation. List humans before AI agents. Use plain, actionable language and address human readers first.
