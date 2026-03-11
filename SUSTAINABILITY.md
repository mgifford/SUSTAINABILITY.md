# SUSTAINABILITY.md

> Project policy for reducing digital emissions, resource use, and avoidable compute waste.

This file is designed to inform `AGENTS.md` and day-to-day engineering decisions.

## Scope

Applies to:
- Product design and UX decisions
- Front-end and back-end implementation
- Build/deploy workflows
- Third-party dependencies
- AI-assisted development and automation

## Ownership

- Sustainability lead: repository maintainer (@mgifford)
- Engineering owner: repository maintainer
- Design owner: community contributors
- Review cadence: quarterly

## Sustainability in early ideation

Aligned with [WSG 2.8 – Integrate Sustainability Into Every Stage of the Ideation Process](https://www.w3.org/TR/web-sustainability-guidelines/#integrate-sustainability-into-every-stage-of-the-ideation-process).

Consider the impact on the planet and all affected parties at every stage: from first idea through design, implementation, review, and deployment.

### Questions to ask before building

- Is this feature or change genuinely needed? What is the cost if we do not build it?
- Which users, communities, or systems are affected, including those not represented in the room?
- What is the expected data, compute, and bandwidth footprint of this change?
- Can a simpler, lower-footprint approach meet the same need?
- Does this add third-party dependencies? Are they justified?

### Questions to ask during design

- Does the design minimize unnecessary assets (images, fonts, scripts, animations)?
- Can the default experience be lightweight, with richer content as an explicit opt-in?
- Does the interaction model help users succeed quickly, reducing wasted page loads?
- Does the design avoid dark patterns, manipulative copy, and unnecessary interruptions?
  See [Sustainable UX Design Patterns](examples/SUSTAINABLE_UX_DESIGN_PATTERNS.md) for
  detailed guidance on minimizing non-essential content, navigation and wayfinding, assisting
  without distracting, and avoiding deceptive design.

### Questions to ask before merging

- Does this change regress page weight, request count, or CI compute time?
- Is AI assistance disclosed, and was it truly necessary?
- Are new third-party scripts reviewed and justified?

### For AI agents (WSG 2.8)

Before proposing any change, ask: is this change needed at all? If yes, what is the simplest implementation that meets the requirement? Note expected sustainability impact (improves / neutral / regresses) in every PR description.

## Core requirements

### 1) Sustainability as a release criterion
- Treat sustainability as a quality gate alongside reliability, security, accessibility, and performance.
- Avoid merging changes that significantly regress page weight, request count, or runtime efficiency without explicit approval.

### 2) Keep sites fast and lightweight
- Set and enforce page-weight and request-count budgets.
- Optimize images, video, fonts, and scripts.
- Remove unnecessary JavaScript and third-party tags.
- Prefer static generation, caching, and progressive enhancement.
- Honour `prefers-color-scheme` to reduce pixel-level energy use on OLED/AMOLED
  displays; see [Light/Dark Mode Accessibility Best Practices](examples/LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md).

### 3) Minimize AI usage by default

Apply this decision order before reaching for AI:

1. **Deterministic code first**: Can a script, linter, or static rule handle this? Write or configure it.
2. **Existing tooling**: Is there a CLI tool or library that already covers this accurately? Use it.
3. **Caching**: Can the result be precomputed and reused without re-running? Cache it.
4. **Reduced frequency**: Can this run less often or only when relevant inputs change? Limit it.
5. **Human action**: Is this infrequent enough that a person can handle it directly? Do it manually.
6. **AI, only when justified**: Use AI only if all the above are impractical and AI clearly reduces total lifecycle cost.

Additional requirements:

- Do not run a process unless its output will be consumed.
- Gate CI steps on relevant path filters to avoid unconditional always-on execution.
- Do not use AI for trivial formatting or deterministic transformations.
- Keep prompts small, scoped, and non-duplicative.
- Disclose meaningful AI assistance in pull requests.
- Do not activate browser built-in AI features automatically; require explicit user opt-in.

### 4) Shift processing in time and space
- Shift deferrable jobs to lower-carbon time windows when possible.
- Prefer lower-carbon regions/providers where architecture allows.
- Split heavy workloads into smaller jobs and prioritize the critical path.
- Move expensive non-user-facing computation out of request-time paths.

### 5) GitHub-specific constraints and practical approach
- `GitHub Pages`: serving region/CDN placement is managed by GitHub and is not directly pinable per project.
- `GitHub Actions` hosted runners: exact physical region and energy mix are not guaranteed/selectable in most workflows.
- Practical options:
  - Use self-hosted runners in known regions for deferrable or heavy jobs.
  - Gate non-urgent workflows using external carbon-intensity signals.
  - Use scheduled jobs with bounded delay windows to avoid delivery risk.

## Pull request checklist

Each PR should include:
- Sustainability impact (`improves` / `neutral` / `regresses`)
- Page weight/request impact summary
- Third-party impact summary
- AI usage disclosure (if used)

## Release gate criteria

All of the following must pass before any release ships:

- Page weight within budget
- Request count within budget
- No new third-party scripts without review
- CI sustainability checks pass
- AI usage disclosed if applicable

Temporary exceptions require an open issue with owner, rationale, and expiry date.

## Known limitations

Document active sustainability debt here. Each entry needs an owner and a target fix date.

| Issue | Status | Owner | Target date | Notes |
| :--- | :--- | :--- | :--- | :--- |
| [describe issue] | open | [owner] | [YYYY-MM-DD] | [mitigation plan] |

## Metrics to track

- Page weight on key templates
- Request counts and third-party requests
- CI minutes and heavy-job frequency
- AI calls per PR (trend should decrease)
- Deferrable jobs shifted to lower-carbon windows

## Trusted references

- https://sustainablewebdesign.org/
- https://www.w3.org/TR/web-sustainability-guidelines/
- https://w3c.github.io/sustainableweb-wsg/guidelines.json
- https://github.com/w3c/sustyweb
- https://w3c.github.io/sustainableweb-wsg/resources.html
- https://www.nicchan.me/blog/exploring-grid-aware-websites/
- https://app.electricitymaps.com/developer-hub/api/getting-started#geolocation
- https://www.thegreenwebfoundation.org/news/ending-this-month-the-best-chance-in-years-to-fix-the-rules-for-green-energy/
- https://rtl.chrisadams.me.uk/2026/01/how-i-think-of-decarbonising-the-energy-used-by-datacentres-on-the-grid/

## AI disclosure

This section documents actual AI usage in this project, separate from the AI usage policy in core requirements above.

### In building

- Documentation, policy text, and templates were drafted and edited with AI assistance (GitHub Copilot / GPT-4-class models), with human review before publishing.
- Code suggestions and CI workflow configuration used AI assistance with human oversight.

### In execution

- No AI runs at runtime. The site is a static Jekyll build served via GitHub Pages.
- No AI-powered browser features are activated automatically; any future AI features require explicit user opt-in.
- CI workflows do not include always-on AI generation steps.

### Models used

| Purpose | Model / tool | When used |
| :--- | :--- | :--- |
| Code assistance and PR support | GitHub Copilot (OpenAI Codex / GPT-4-class) | During development |
| Content drafting and policy editing | OpenAI GPT-4-class via Copilot Chat | During development |

## Agent instruction snippet

Add to `AGENTS.md` or system prompts:

> Read `SUSTAINABILITY.md` before planning or coding. At ideation, ask whether the change is needed and choose the simplest approach first.
> Prefer low-compute deterministic approaches, minimize AI calls, enforce budgets, and shift deferrable workloads to cleaner time/region options where feasible.
> Note sustainability impact (improves / neutral / regresses) in every PR.
