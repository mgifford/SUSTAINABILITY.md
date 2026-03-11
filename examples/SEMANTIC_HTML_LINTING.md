---
layout: page
title: Semantic HTML Linting
meta_title: Semantic HTML Linting · SUSTAINABILITY.md
description: How to use HTML linters to enforce semantic markup practices, aligned with the Web Sustainability Guidelines (WSG) and WCAG accessibility standards.
lede: Covers three complementary tools — html-validate, HTMLHint, and the W3C Nu Checker — with example code showing correct semantic patterns and GitHub Actions integration for automated enforcement.
---

> **WSG alignment:** This document implements the Web Sustainability Guidelines requirement to
> [Ensure Your Code Follows Good Semantic Practices](https://www.w3.org/TR/web-sustainability-guidelines/#ensure-code-follows-good-semantic-practices)
> (WSG 3.7 — Use HTML Elements Correctly).
>
> **Sustainability relevance:** Semantic HTML reduces browser work: the layout engine can
> resolve element roles without additional JavaScript, skip redundant ARIA overrides, and
> apply native focus management at zero extra cost. Pages written with correct semantics are
> also smaller — `<nav>` does the job of `<div role="navigation" aria-label="…">` in
> one token. Fewer bytes transferred, fewer parse cycles, and less script all reduce
> energy consumption per page view. These benefits compound at scale.

---

This document provides practical guidance for enforcing semantic HTML automatically. It
applies to human developers and to AI coding agents generating or reviewing markup.

See [examples/SEMANTIC_HTML_DEMO.html](SEMANTIC_HTML_DEMO.html) for a working reference
page that puts these patterns into practice.

---

## 1. Why semantic HTML matters for sustainability

Semantic HTML uses the right element for the right purpose:

- `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` instead of generic `<div>` wrappers
- `<button>` for interactive controls instead of `<div onclick>`
- `<h1>`–`<h6>` in document order instead of styled `<span>` elements
- `<label>` correctly associated with its `<input>` instead of adjacent plain text

Each of these choices gives browsers, assistive technologies, and search crawlers
unambiguous signals about structure and intent without requiring extra script or markup.

### Efficiency gains

| Pattern | Semantic approach | Non-semantic cost |
| ------- | ----------------- | ----------------- |
| Landmark regions | Native HTML element | Extra `role` + `aria-label` attributes |
| Interactive controls | `<button>` | `<div>` + `tabindex` + keyboard handler JS |
| Form labels | `<label for="…">` | Wrapper `<div>` + extra ARIA + JS focus shim |
| Heading hierarchy | `<h1>`–`<h6>` | Styled `<span>` + no outline in reader mode |

---

## 2. Tool options

Three complementary tools cover different parts of the semantic HTML problem. Use them
together for full coverage.

### 2.1 html-validate

[html-validate](https://html-validate.org/) is an offline, rule-based validator focused on
correct use of HTML elements. It enforces semantic practices at development time and in CI
without network access.

Key rules for semantic compliance:

| Rule | What it catches |
| ---- | --------------- |
| `aria-label-misuse` | `aria-label` on elements that do not accept it |
| `deprecated` | Presentational elements like `<center>`, `<font>`, `<b>` used as styling |
| `doctype-style` | `<!DOCTYPE html>` vs `<!doctype html>` style mismatch |
| `element-required-content` | `<ul>` without `<li>` children, `<table>` without `<tbody>` |
| `heading-level` | Heading levels that skip ranks (e.g. `<h1>` → `<h4>`) |
| `no-redundant-role` | `<nav role="navigation">` (role already implied) |
| `script-type` | `<script type="text/javascript">` (redundant attribute) |
| `void-content` | Content inside void elements like `<br>`, `<img>`, `<input>` |
| `void-style` | Self-closing vs. omitted end tag style inconsistency |

**Install:**

```bash
npm install --save-dev html-validate
```

**Configure** (`.htmlvalidate.json` in project root):

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "aria-label-misuse": "error",
    "doctype-style": ["error", {"style": "lowercase"}],
    "heading-level": "error",
    "no-redundant-role": "error",
    "void-style": ["error", {"style": "selfclosing"}],
    "long-title": "off"
  }
}
```

**Run:**

```bash
npx html-validate "**/*.html"
```

### 2.2 HTMLHint

[HTMLHint](https://htmlhint.com/) is a lighter linter focused on common authoring errors.
It is a good first pass for teams new to HTML linting.

Key rules for semantic compliance:

| Rule | What it catches |
| ---- | --------------- |
| `alt-require` | `<img>` elements missing `alt` attribute |
| `doctype-first` | Missing or misplaced `<!DOCTYPE html>` |
| `head-script-disabled` | Render-blocking `<script>` in `<head>` |
| `id-unique` | Duplicate `id` attributes on the same page |
| `spec-char-escape` | Unescaped `&`, `<`, `>` in text content |
| `tagname-lowercase` | Mixed-case tag names |
| `title-require` | Page missing a `<title>` element |

**Install:**

```bash
npm install --save-dev htmlhint
```

**Configure** (`.htmlhintrc` in project root):

```json
{
  "doctype-first": true,
  "title-require": true,
  "alt-require": true,
  "id-unique": true,
  "spec-char-escape": true,
  "tagname-lowercase": true
}
```

**Run:**

```bash
npx htmlhint "**/*.html"
```

### 2.3 W3C Nu HTML Checker

The [W3C Nu HTML Checker](https://validator.w3.org/nu/) (`vnu`) is the normative HTML5
validator. It catches spec violations that rule-based linters miss. Run it locally via the
`validator/validator` Docker image or the `vnu-jar` npm package.

**Run via Docker:**

```bash
docker run --rm -v "$PWD:/src" ghcr.io/validator/validator:latest \
  vnu --format json /src/examples/*.html
```

**Run via npm wrapper:**

```bash
npm install --save-dev vnu-jar
npx vnu --format json examples/*.html
```

---

## 3. Example: semantic vs. non-semantic markup

The following contrasts show exactly what linters flag and the preferred alternative.

### 3.1 Landmark regions

**Avoid:**

```html
<!-- ❌ Generic wrappers require redundant ARIA -->
<div id="header" role="banner">…</div>
<div id="nav" role="navigation" aria-label="Main">…</div>
<div id="content" role="main">…</div>
<div id="footer" role="contentinfo">…</div>
```

**Prefer:**

```html
<!-- ✅ Native elements carry implicit roles -->
<header>…</header>
<nav aria-label="Main">…</nav>
<main>…</main>
<footer>…</footer>
```

html-validate rule triggered: `no-redundant-role`

### 3.2 Interactive controls

**Avoid:**

```html
<!-- ❌ div-based button requires tabindex + keyboard JS + ARIA -->
<div class="btn" onclick="submit()" role="button" tabindex="0">Submit</div>
```

**Prefer:**

```html
<!-- ✅ Native button is keyboard accessible with zero extra code -->
<button type="submit">Submit</button>
```

html-validate rule triggered: `element-required-attributes` (missing `type` on `<button>` if omitted),
`no-redundant-role` (if `role="button"` is added to a native `<button>`)

### 3.3 Heading hierarchy

**Avoid:**

```html
<!-- ❌ Skipping from h1 to h4 breaks document outline and screen readers -->
<h1>Page title</h1>
<h4>First subsection</h4>
```

**Prefer:**

```html
<!-- ✅ Sequential levels preserve document outline -->
<h1>Page title</h1>
<h2>First subsection</h2>
```

html-validate rule triggered: `heading-level`

### 3.4 Form labels

**Avoid:**

```html
<!-- ❌ Placeholder alone is not an accessible label -->
<input type="email" placeholder="Enter email" />
```

**Prefer:**

```html
<!-- ✅ Explicit label association works with all assistive technologies -->
<label for="email">Email address</label>
<input type="email" id="email" autocomplete="email" />
```

HTMLHint rule triggered: no matching label (custom rule); html-validate: `label-missing`

### 3.5 Images

**Avoid:**

```html
<!-- ❌ Missing alt leaves screen reader users without context -->
<img src="logo.png" />
```

**Prefer:**

```html
<!-- ✅ Descriptive alt for informative images; empty alt for decorative images -->
<img src="logo.png" alt="SUSTAINABILITY.md project logo" />
<img src="divider.png" alt="" role="presentation" />
```

HTMLHint rule triggered: `alt-require`

---

## 4. GitHub Actions integration

### 4.1 html-validate in CI

This repository runs html-validate in `.github/workflows/ci.yml`. The job validates
all static HTML files in the `examples/` directory. Jekyll layout templates in `_layouts/`
are excluded because they contain Liquid syntax and are not valid standalone HTML.

Equivalent job for your own project:

```yaml
html-lint:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'

    - name: Install html-validate
      run: npm install --save-dev html-validate

    - name: Validate HTML
      run: npx html-validate "examples/**/*.html"
```

### 4.2 Interpretation

- Any `error`-level rule violation exits with a non-zero code and fails the check.
- `warning`-level violations are reported but do not block merges by default.
- Promote rules from `warning` to `error` incrementally as the codebase is cleaned up.

### 4.3 Excluding generated output

Do not lint the `_site/` Jekyll build output or `_layouts/` Liquid templates. Pass
only directories of static HTML files to the CLI. For example:

```bash
npx html-validate "examples/**/*.html"
```

---

## 5. Adoption checklist

Use this checklist when introducing HTML linting to an existing project:

- [ ] Run html-validate with `html-validate:recommended` and record the initial violation count
- [ ] Create a `.htmlvalidate.json` that sets all current violations to `warn` so CI passes
- [ ] Promote one rule at a time to `error` as each category of violation is resolved
- [ ] Add the CI job to enforce the current error set on every pull request
- [ ] Add `.htmlhintrc` for lightweight authoring-time feedback in editors
- [ ] Schedule a quarterly review to promote additional rules to `error`

---

## 6. Related resources

- [Web Sustainability Guidelines — Use HTML Elements Correctly (WSG 3.7)](https://w3c.github.io/sustyweb/#WSG-3.7)
- [W3C — Ensure Your Code Follows Good Semantic Practices](https://www.w3.org/TR/web-sustainability-guidelines/#ensure-code-follows-good-semantic-practices)
- [html-validate documentation](https://html-validate.org/rules/)
- [HTMLHint rules reference](https://htmlhint.com/docs/user-guide/list-rules)
- [W3C Nu HTML Checker](https://validator.w3.org/nu/)
- [WHATWG HTML Living Standard — Semantics](https://html.spec.whatwg.org/multipage/semantics.html)
