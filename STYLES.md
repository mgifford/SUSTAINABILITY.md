---
layout: page
title: Style Guide
meta_title: Style Guide · SUSTAINABILITY.md
description: Unified design and content standards for the SUSTAINABILITY.md GitHub Pages site and repository documentation.
lede: Design tokens, typography, layout patterns, and content conventions for contributors and AI agents.
source_url: https://raw.githubusercontent.com/mgifford/sustainability.md/main/STYLES.md
---

## Scope: documentation files vs. the website

This guide covers two distinct surfaces that share the same project:

| Surface | Files | Audience |
| :--- | :--- | :--- |
| **GitHub Pages site** | `index.md`, `_layouts/`, `assets/`, pages with front matter | Public visitors browsing the site |
| **Repository documentation** | `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `ACCESSIBILITY.md`, `SUSTAINABILITY.md`, `CONTENT-STYLE-GUIDE.md`, `examples/*.md` | Contributors, adopters, and AI agents reading files directly on GitHub |

**What applies everywhere (documentation and website):**

- Section 2 — Content and voice standards (plain language, active voice, sentence-case headings, American English)
- Section 4 — Accessibility and semantic logic (heading hierarchy, alt text)
- Section 5 — Instructions for AI agents

**What applies to the website only:**

- Section 3 — Design foundations (CSS tokens, typography, breakpoints, page layout patterns)

Even though documentation files are rendered as plain Markdown rather than styled HTML, they share the same voice, tone, and heading conventions as the site. This keeps the project a unified whole for every reader, regardless of which surface they encounter first.

---

## 1. Core philosophy

We design for the reader, not the repository. Our goal is to communicate sustainability practice clearly — to engineers, maintainers, contributors, and AI agents — with minimum overhead.

1. **Reader-First:** Start with what the reader needs to act, not what the project wants to say.
2. **Plain Language:** If a 12-year-old cannot understand it, it creates a barrier.
3. **Sustainability by Default:** Prefer lighter, simpler, and more durable solutions. See `SUSTAINABILITY.md` for resource and AI-usage limits.
4. **Accessibility by Default:** Refer to `ACCESSIBILITY.md` for all interaction and visual standards.
5. **Consistency is Trust:** Contributors and AI agents must use the same tokens, patterns, and vocabulary.

---

## 2. Content and voice standards

For full content conventions, see `CONTENT-STYLE-GUIDE.md`. Key rules are summarized here.

### 2.1 Voice and tone

We use an **Authoritative Peer** tone: professional and knowledgeable, but accessible and supportive.

| Context | Tone | Strategy |
| :--- | :--- | :--- |
| **Onboarding** | Encouraging | Focus on the benefit to the reader. |
| **Technical/Policy** | Precise | Be unambiguous; explain "why" if a rule is complex. |
| **Error states** | Calm/helpful | Do not blame the user. Provide a clear path to resolution. |

### 2.2 Plain language and word choice

Avoid bureaucratic or marketing language. AI agents must prioritize these substitutions:

| Avoid | Use instead |
| :--- | :--- |
| Utilize / Leverage | Use |
| Facilitate / Implement | Help / Carry out |
| At this point in time | Now |
| In order to | To |
| Notwithstanding | Despite / Even though |
| Sustainability journey | Sustainability work |
| Green / eco-friendly | Sustainable / lower-impact |

### 2.3 Grammar and mechanics

- **Active voice:** "The team tracks page weight" not "Page weight is tracked by the team."
- **Sentence case:** Use sentence case for all headings and button labels (e.g., "Save and continue," not "Save and Continue").
- **Lists:** Use bullets for unordered items. Use numbered lists only for sequential steps.
- **Humans first:** When listing humans and automated systems together, list humans first. See `CONTENT-STYLE-GUIDE.md`.

### 2.4 Spelling convention

This project uses **American English** as its default spelling standard.

| Variant | Example spellings | When to use |
| :--- | :--- | :--- |
| **American English** (default) | color, center, optimize, behavior | All documentation in this project unless overridden |
| **British English** | colour, centre, optimise, behaviour | Specify `lang: en-GB` in `_config.yml` |
| **Canadian English** | colour, centre, optimize, behaviour | Specify `lang: en-CA` in `_config.yml` |

To change the spelling variant for a derived project, update the `lang` attribute in `_config.yml` and the `<html lang="…">` tag in `_layouts/default.html`.

> **AI agents:** When generating or reviewing content, always check the `lang` attribute at the top of `_config.yml` and apply the corresponding spelling rules consistently throughout the document.

---

## 3. Design foundations (tokens and UI)

### 3.1 Design tokens (CSS variables)

Use these tokens to maintain a single source of truth. The canonical values live in `assets/css/site.css` and are the authoritative source; this table documents the design intent.

**Light mode (`:root` defaults) — dark overrides via `prefers-color-scheme: dark`**

| Category | Token name | Light value | Dark value | Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **Background** | `--bg` | `#ffffff` | `#0b0d10` | Base page background |
| **Surface** | `--bg-soft` | `#f7f7f8` | `#12161d` | Hero, footer, subtle backgrounds |
| **Text** | `--text` | `#121212` | `#f3f4f6` | 4.5:1 contrast on `--bg` required |
| **Muted text** | `--muted` | `#4b5563` | `#c5cad3` | Supporting copy; 3:1 min on `--bg` |
| **Border/Divider** | `--line` | `#e5e7eb` | `#2a2f3a` | Cards, section separators |
| **Card surface** | `--card` | `#ffffff` | `#0f1319` | Card backgrounds |
| **Code block** | `--code` | `#f3f4f6` | `#0c1016` | `<pre>` and inline code |
| **Button fill** | `--button` | `#111111` | `#f3f4f6` | Primary CTA background |
| **Button label** | `--button-text` | `#ffffff` | `#111111` | Text on `--button` fill |
| **Spacing unit** | `--space-unit` | `8px` | — | Use multiples: `calc(var(--space-unit) * N)` |

Both light and dark values are defined via a single `@media (prefers-color-scheme: dark)` override block — no extra class is needed.

### 3.2 Typography and readability

- **Font stack:** `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif` — system fonts are the fallback; no external font load is required.
- **Font scaling:** Use `rem` units to respect user browser settings. Never use `px` for font sizes.
- **Fluid type:** Use `clamp()` for headings so they scale smoothly: e.g. `clamp(2.1rem, 5vw, 3.8rem)`.
- **Line length:** Keep body text between 45–75 characters per line (`max-width: 760px` for `.prose` blocks).
- **Line height:** Minimum `1.6` for body text; `1.2` or lower for display headings.

### 3.3 Responsive design: mobile-first

Write base CSS for the smallest screen first, then progressively enhance with `min-width` media queries.

#### Breakpoint ladder

| Layer | Breakpoint | Intent |
| :--- | :--- | :--- |
| **Mobile** | `0` – `599px` (base, no query) | Single-column, touch targets ≥ 44×44 px |
| **Tablet** | `min-width: 600px` | Two-column layouts where content benefits |
| **Desktop** | `min-width: 900px` | Multi-column grids, wider prose, side panels |

> **Note:** The current `site.css` uses a single `max-width: 900px` fallback query (desktop-first collapse) for historical reasons.
>
> - **When adding new CSS to `site.css`:** Write mobile-first using `min-width` queries.
> - **When adapting this guide for a derived project:** Always use the mobile-first pattern from the start.

#### Layout token

```css
/* Content wrapper — scales from 92% of viewport to a 1100px cap */
.wrap {
  width: min(1100px, 92vw);
  margin: 0 auto;
}
```

#### Mobile-first example skeleton

```css
/* Base (mobile) */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 600px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 900px) {
  .cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

### 3.4 User preferences

Always honor CSS media query preferences before adding JavaScript-driven controls.

| Media query | Behavior to implement | Status in `site.css` |
| :--- | :--- | :--- |
| `prefers-color-scheme: dark` | Switch to dark palette via CSS custom properties | ✅ Implemented |
| `prefers-reduced-motion: reduce` | Remove or reduce transitions and animations | ✅ Implemented (`.card` transitions) |
| `prefers-contrast: more` | Increase border weight, darken muted text | ⬜ Recommended |
| `forced-colors: active` | Use `ButtonText`, `LinkText`, etc. system colors | ⬜ Recommended |
| `prefers-reduced-transparency` | Replace semi-transparent surfaces with opaque fallbacks | ⬜ Recommended |

#### Implementation pattern for new components

```css
/* 1. Design for light mode and full motion first */
.component {
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

/* 2. Dark mode override */
@media (prefers-color-scheme: dark) {
  .component { /* dark overrides */ }
}

/* 3. Strip motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .component { transition: none; }
}

/* 4. Higher contrast enhancement */
@media (prefers-contrast: more) {
  .component { outline: 2px solid currentColor; }
}
```

---

## 3.5 Page layout patterns

The site uses two layout templates defined in `_layouts/`:

| Layout | File | Use for |
| :--- | :--- | :--- |
| `default` | `_layouts/default.html` | Home page — custom full-width HTML sections (hero, cards, steps) |
| `page` | `_layouts/page.html` | All Markdown-rendered content pages (guides, reference docs) |

### Page layout

Apply `layout: page` in front matter to any page whose content is rendered from Markdown. The `page` layout:

- Adds a **Back to Home** button so readers can navigate back to the index.
- Optionally adds a **View Source** button when `source_url` is provided in front matter.
- Wraps content in `.wrap` (max-width `1100px`, centered) and `.prose` (max-width `760px`).
- Provides consistent typography for all standard Markdown elements: headings, lists, code blocks, blockquotes, tables.

**Required front matter for `page` layout:**

```yaml
---
layout: page
title: Page Title
meta_title: Page Title · SUSTAINABILITY.md
description: One-sentence description for SEO and social sharing.
lede: Short subtitle displayed beneath the hero heading.
---
```

**Optional front matter:**

```yaml
source_url: https://raw.githubusercontent.com/mgifford/sustainability.md/main/FILENAME.md
```

### Code-card pattern

The `.code-card` component on the home page follows this padding convention:

```css
.code-card h2   { padding: 0.75rem 1rem; }   /* title bar */
.code-card p    { padding: 0.5rem 1rem; }    /* subtitle / link line */
.code-card pre  { padding: 1rem; }           /* code block */
```

All three children share horizontal padding of `1rem` to keep text flush with the card interior — never touching the card border.

---

## 4. Accessibility and semantic logic

This section implements the mandates in `ACCESSIBILITY.md`.

- **Heading hierarchy:** Must be logical. H1 → H2 → H3. Never skip levels for visual styling.
- **Alt text:** Must describe the _intent_ of the image, not just the pixels. Decorative images use `alt=""`.
- **Interactive elements:** Every button or link must have a focus state that is visually distinct (e.g., a high-contrast 3px outline).
- **Color alone:** Never use color as the only means of conveying information.
- **Link text:** Link text must be descriptive. Avoid "click here" or "read more" without context.

---

## 5. Instructions for AI agents

When generating or reviewing content or code in this repository, agents must:

1. **Verify tokens:** Only use the CSS variables defined in Section 3.1. Do not introduce hardcoded hex values.
2. **Apply plain language:** Before finalizing text, check word choices against the substitution table in Section 2.2.
3. **Check accessibility:** Before outputting a UI component, check `ACCESSIBILITY.md` for ARIA and keyboard navigation requirements.
4. **Use semantic Markdown:** Use GFM (GitHub Flavored Markdown) callouts (`> [!NOTE]`) for emphasis in documentation.
5. **Follow front matter conventions:** All new `page`-layout pages must include `layout`, `title`, `meta_title`, `description`, and `lede`.
6. **Humans first:** When listing humans alongside AI agents or automated systems, list humans first. See `CONTENT-STYLE-GUIDE.md`.
7. **Sustainability first:** Prefer static, deterministic, and lower-compute approaches. See `SUSTAINABILITY.md` for AI-usage limits.

Also see: `AGENTS.md`, `CONTENT-STYLE-GUIDE.md`, `ACCESSIBILITY.md`.

---

## 6. References and inspiration

- [UK GDS Style Guide](https://www.gov.uk/guidance/style-guide/a-to-z)
- [18F Content Guide](https://content-guide.18f.gov/)
- [W3C Web Sustainability Guidelines (WSG)](https://www.w3.org/TR/web-sustainability-guidelines/)
- [California Design System](https://designsystem.webstandards.ca.gov/)
- [Harvard Accessibility and Readability](https://accessibility.huit.harvard.edu/design-readability)
- [ACCESSIBILITY.md STYLE.md](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/STYLE.md)

---

_This document is a living file. Submit a PR for updates._
