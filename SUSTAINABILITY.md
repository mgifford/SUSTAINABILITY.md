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
- Prefer deterministic/local tools first.
- Use AI only when it clearly reduces total lifecycle effort, rework, or risk.
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

## Agent instruction snippet

Add to `AGENTS.md` or system prompts:

> Read `SUSTAINABILITY.md` before planning or coding. Prefer low-compute deterministic approaches, minimize AI calls, enforce budgets, and shift deferrable workloads to cleaner time/region options where feasible.
