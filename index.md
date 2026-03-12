---
layout: default
meta_title: SUSTAINABILITY.md · SUSTAINABILITY.md
description: The open standard for sustainability transparency, governance, and lower-impact engineering workflows.
hero_title: SUSTAINABILITY.md
hero_lede_1: A practical, open format for documenting sustainability commitments, engineering guardrails, and measurable progress.
hero_lede_2: Think of SUSTAINABILITY.md as a <strong>README for digital sustainability</strong> — a predictable place where contributors, maintainers, and AI agents can find your standards.
primary_cta_label: Explore Framework
primary_cta_url: "#framework"
notice_experimental: true
secondary_cta_label: View on GitHub
secondary_cta_url: https://github.com/mgifford/sustainability.md
code_card_title: Simple Sample SUSTAINABILITY.md
code_card_link_label: See full policy example
code_card_link_url: ./README.md
code_snippet: |
  # SUSTAINABILITY.md

  ## Commitment
  - Sustainability is part of our definition of done
  - We improve month over month, not once per year

  ## CI guardrails
  - Block on critical accessibility regressions
  - Block on page-weight and request-budget regressions

  ## AI policy
  - Prefer deterministic tools first
  - Keep prompts scoped, log usage, and avoid waste

  ## Ownership
  - Assign owners, baselines, targets, and review cadence
  - Publish trade-offs and exceptions with expiry dates
why_heading: Why SUSTAINABILITY.md?
framework_heading: The Framework
framework_cards:
  - title: Shared Commitment
    body: Make sustainability explicit in your repo so every contributor understands expectations before shipping code.
  - title: Measurable Operations
    body: Define budgets, owners, and review cadence so sustainability becomes trackable work, not an abstract aspiration.
  - title: Guardrails in CI
    body: Automate checks for accessibility, performance budgets, and risky additions to prevent regressions at merge time.
examples_heading: Reference Examples
reference_cards:
  - title: Full Template
    label: SUSTAINABILITY-template.md
    url: ./SUSTAINABILITY-template/
  - title: Action Playbook
    label: Team + AI implementation guide
    url: ./action-playbook/
  - title: Policy File
    label: README.md
    url: ./README/
  - title: GitHub Actions Guide
    label: API capabilities for carbon-aware computing
    url: ./github-actions-sustainability/
  - title: Measuring Energy
    label: Tools and techniques for web energy measurement
    url: ./measuring-energy/
  - title: Reporting Metrics
    label: Footer disclosures and CARBON.txt
    url: ./reporting-sustainability-metrics/
  - title: WSG Mapping
    label: WSG_REFERENCES.yaml
    url: ./wsg-references/
  - title: W3C WSG
    label: Web Sustainability Guidelines
    url: https://www.w3.org/TR/web-sustainability-guidelines/
  - title: WSG Resources
    label: Reference resources page
    url: ./resources/
  - title: Guidelines Data
    label: guidelines.json
    url: ./guidelines/
  - title: Sustainable Web Design
    label: External companion resource
    url: ./sustainablewebdesign/
  - title: Machine-Readable Metadata
    label: JSON-LD, RDFa, Microdata and sitemap guidance
    url: ./examples/MACHINE_READABLE_METADATA.md
adopt_heading: How to Adopt
adopt_steps:
  - title: 1. Publish a starter commitment
    body: Add a short SUSTAINABILITY.md with goals, ownership, and non-negotiable CI gates.
  - title: 2. Add required CI checks
    body: Gate pull requests with accessibility checks, Lighthouse scans, and budget regression checks.
  - title: 3. Adopt the full template
    body: Add governance, exception handling, metrics baselines, and monthly review process.
  - title: 4. Ratchet over time
    body: Raise thresholds progressively as your project stabilizes and contributors build confidence.
footer_title: SUSTAINABILITY.md
footer_text: is an open policy format for digital sustainability transparency and governance.
---

Most repositories have README, SECURITY, and CONTRIBUTING files.
SUSTAINABILITY.md fills an important gap: it states how your project reduces
digital waste, handles trade-offs, and enforces sustainability in daily work.

## Why teams adopt it

- It creates a clear public commitment that users and contributors can see.
- It helps maintainers align product, engineering, accessibility, and DevOps.
- It gives AI coding agents explicit constraints before they generate changes.
- It turns vague goals into measurable implementation steps.

## What makes this effective

- **Visible policy:** one predictable file in the repo root.
- **Operational ownership:** named owners, targets, and review cadence.
- **CI enforcement:** checks that prevent regression, not just aspirational text.
- **Continuous improvement:** a ratchet model that gets stricter over time.

## Start in under 30 minutes

1. Copy the [template](./SUSTAINABILITY-template.md).
2. Add project scope, owner, and 3-5 baseline metrics.
3. Link your SUSTAINABILITY.md from README.
4. Enable CI gates for accessibility + performance budgets + Lighthouse.
5. Schedule a monthly review and raise one threshold.

**Status:** Draft (work in progress).

**AI disclosure:** This project has been developed with AI-assisted drafting
and implementation support, with human review and editing.

Adopt this now, keep it lightweight, and iterate. Progress over perfection.
