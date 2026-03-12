---
layout: page
title: Sustainable User Preference Media Queries
meta_title: Sustainable User Preference Media Queries · SUSTAINABILITY.md
description: Practical CSS media query guidance aligned with the Web Sustainability Guidelines (WSG) to honour user preferences, reduce unnecessary rendering work, and lower energy use.
lede: Covers sustainability-beneficial user preference media queries — prefers-color-scheme, prefers-reduced-motion, prefers-reduced-data, prefers-contrast, prefers-reduced-transparency, monochrome, print, and scripting — with implementation patterns for human developers and AI coding agents.
---

> **WSG alignment:** These patterns implement the Web Sustainability Guidelines guideline:
>
> - [Use Sustainability-Beneficial User Preference Media Queries](https://www.w3.org/TR/web-sustainability-guidelines/#use-sustainability-beneficial-user-preference-media-queries)
>
> **Sustainability relevance:** Responding to user preferences through CSS media queries
> reduces unnecessary rendering work, lowers pixel-level power consumption on OLED and
> AMOLED displays, reduces data transfer for constrained users, and avoids wasted compute
> from loading assets or running scripts the user has opted out of. These patterns benefit
> both sustainability and accessibility.

---

This document provides practical, implementation-ready guidance for applying CSS user
preference media queries. It applies to human developers and to AI coding agents making
front-end changes.

For light/dark mode implementation detail, see
[Light/Dark Mode Accessibility Best Practices](LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md).

For broader user personalization guidance, see the
[User Personalization Accessibility Best Practices](https://mgifford.github.io/ACCESSIBILITY.md/examples/USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.html).

---

## 1. prefers-color-scheme

Honour the operating-system or browser color-scheme preference to reduce pixel-level power
consumption on OLED and AMOLED displays. Dark pixels draw less power; serving a dark theme
to users who prefer it reduces energy use on every page view.

```css
:root {
  --color-text:       #1a1a1a;
  --color-background: #ffffff;
  --color-link:       #0066cc;
  --color-border:     #cccccc;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text:       #e8e8e8;
    --color-background: #1a1a1a;
    --color-link:       #66aaff;
    --color-border:     #444444;
  }
}

body {
  color: var(--color-text);
  background-color: var(--color-background);
}
```

Requirements:

- Always define light-mode values as the default (no media query required).
- Override with `prefers-color-scheme: dark` for dark mode.
- Use CSS custom properties so all theme tokens update together.
- Validate WCAG 2.2 AA contrast ratios in **both** light and dark mode.

See [Light/Dark Mode Accessibility Best Practices](LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md)
for full implementation detail including forced-colors support, zebra-stripe tables, and
manual theme toggle patterns.

---

## 2. prefers-reduced-motion

Disable or minimise decorative animation and transitions for users who have requested
reduced motion. Animation has a real render cost; removing it when the user does not want
it reduces GPU load and battery drain.

```css
/* Default: subtle transition */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Effectively disable all transitions and animations when the user requests reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Alternatively, opt in to motion only when the user has not requested reduced motion:

```css
/* Default: no motion */
.notification-badge {
  /* static */
}

/* Animate only when the user has not requested reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .notification-badge--new {
    animation: pulse 1s ease-in-out 2;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.1); }
}
```

Requirements:

- Never loop decorative animations indefinitely; limit to 1–2 plays for state changes.
- Do not auto-play video or audio in the main content flow.
- Respect `prefers-reduced-motion` for scroll-linked effects and parallax.
- Do not flash content more than three times per second (WCAG 2.3.1).

---

## 3. prefers-reduced-data

Users on metered or slow connections have opted into a reduced-data experience. Honour this
preference by deferring or skipping non-essential assets. This directly lowers data
transfer and the associated energy cost on both client and server.

```css
/* Default: load decorative background image */
.hero {
  background-image: url('/images/hero.jpg');
}

/* Skip decorative background image when the user prefers reduced data */
@media (prefers-reduced-data: reduce) {
  .hero {
    background-image: none;
    background-color: var(--color-background-alt);
  }
}
```

Defer non-critical fonts:

```css
/* Skip web font loading when the user prefers reduced data */
@media (prefers-reduced-data: no-preference) {
  @import url('https://fonts.example.com/myFont.css');
}
```

> **Browser support note:** `prefers-reduced-data` has limited browser support as of 2026.
> Implement it as progressive enhancement — it improves the experience where supported
> without breaking it elsewhere. Monitor
> [MDN browser compatibility data](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-data)
> for adoption updates.

Requirements:

- Skip or defer decorative images, non-critical fonts, and auto-loading video.
- Keep essential content (text, structure, critical images) intact.
- Treat this as a progressive-enhancement layer; do not make it the only code path.

---

## 4. prefers-contrast

Some users require higher contrast due to low vision or display conditions. Others prefer
lower contrast to reduce visual fatigue. Responding to this preference avoids a one-size
approach that works poorly for both groups.

```css
:root {
  --color-text:   #1a1a1a;
  --color-border: #cccccc;
}

@media (prefers-contrast: more) {
  :root {
    --color-text:   #000000;
    --color-border: #000000;
  }

  a {
    text-decoration: underline; /* Reinforce link affordance beyond color */
  }

  button {
    border: 2px solid currentColor;
  }
}

@media (prefers-contrast: less) {
  :root {
    --color-text:   #444444;
    --color-border: #e0e0e0;
  }
}
```

Requirements:

- The `more` variant must still meet WCAG 2.2 AA contrast minimums (4.5:1 for text, 3:1
  for UI components).
- Do not use `prefers-contrast: less` to drop below WCAG minimums.
- Test in both `more` and `less` states alongside standard contrast.

---

## 5. prefers-reduced-transparency

Transparency and blur effects require compositing work from the GPU. Removing them when
the user has opted in to reduced transparency lowers render cost and can improve
readability on lower-end devices.

```css
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

@media (prefers-reduced-transparency: reduce) {
  .modal-overlay {
    background-color: rgba(0, 0, 0, 0.85); /* Solid enough to avoid compositing cost */
    backdrop-filter: none;
  }
}
```

```css
.frosted-panel {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
}

@media (prefers-reduced-transparency: reduce) {
  .frosted-panel {
    background-color: var(--color-background);
    backdrop-filter: none;
  }
}
```

Requirements:

- Remove `backdrop-filter` and heavy compositing when transparency is reduced.
- Replace semi-transparent backgrounds with an opaque fallback.
- Maintain sufficient contrast for all text and UI elements in the opaque state.

---

## 6. monochrome

Monochrome media describes devices that render in grayscale or single-color output,
including e-ink displays and certain accessibility tools. Respond to this query to remove
color-dependent UI and improve legibility on low-power display hardware.

```css
/* Default: colored status indicators */
.status-badge {
  background-color: var(--color-status);
  color: #ffffff;
}

/* On monochrome displays: use borders and labels instead of color fills */
@media (monochrome) {
  .status-badge {
    background-color: transparent;
    color: currentColor;
    border: 2px solid currentColor;
  }

  /* Ensure icons convey meaning without color */
  .icon-success::after { content: " ✓"; }
  .icon-error::after   { content: " ✗"; }
}
```

Requirements:

- Do not convey status, category, or alert level through color alone on any device
  (WCAG 1.4.1), but especially ensure fallback patterns exist for monochrome rendering.
- Test with DevTools forced grayscale simulation or on a physical e-ink or grayscale device.

---

## 7. print

Optimizing for print reduces ink consumption and avoids printing non-essential elements
(navigation, ads, cookie banners). Print styles are a low-effort, high-impact sustainability
improvement that most sites do not implement.

```css
@media print {
  /* Remove non-content elements */
  nav,
  aside,
  footer,
  .cookie-banner,
  .skip-link,
  .no-print {
    display: none !important;
  }

  /* Remove decorative backgrounds and shadows */
  *,
  *::before,
  *::after {
    background: transparent !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  /* Ensure readable black-on-white text */
  body {
    color: #000;
    background: #fff;
    font-size: 12pt;
    line-height: 1.5;
  }

  /* Expand links to show URLs */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    word-break: break-all;
  }

  /* Do not expand internal anchor links or JavaScript links */
  a[href^="#"]::after,
  a[href^="javascript:"]::after {
    content: "";
  }

  /* Avoid page breaks inside key content blocks */
  h2, h3, h4, h5, h6 {
    page-break-after: avoid;
    break-after: avoid;
  }

  pre, blockquote, table, figure {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Use full page width */
  body, main, article {
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
}
```

Requirements:

- Hide all navigation, header chrome, and decorative elements.
- Remove background colors and images to reduce ink use.
- Expand links to show the full URL.
- Test with browser print preview before shipping pages with significant written content.

---

## 8. scripting

The `scripting` media query allows CSS to detect whether JavaScript is enabled. Use it to
provide a functional no-script baseline without requiring a separate `<noscript>` branch
for every component. This improves sustainability by avoiding loading assets that depend
on JavaScript when JavaScript is unavailable or has been disabled.

```css
/* Default: show the enhanced, JavaScript-dependent component */
.js-accordion .accordion-panel {
  display: none; /* JavaScript will manage open/closed state */
}

/* When scripting is not available, show all panels statically */
@media (scripting: none) {
  .js-accordion .accordion-panel {
    display: block;
  }

  .js-accordion .accordion-toggle {
    display: none; /* Remove toggle controls that do nothing without JS */
  }
}
```

Defer non-critical scripts in CSS:

```css
/* Load background animation script only if scripting is enabled */
@media (scripting: enabled) {
  .animated-canvas {
    /* Safe to reference canvas-dependent styles */
    contain: strict;
    will-change: contents;
  }
}
```

> **Browser support note:** `scripting` has broad support in modern browsers as of early 2026.
> See [MDN browser compatibility data](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting).

Requirements:

- Provide a fully usable, readable no-JavaScript experience for all primary content.
- Use `scripting: none` to reveal content that would otherwise be hidden by JS-driven
  components.
- Remove or disable JavaScript-dependent interactive controls when scripting is unavailable.

---

## 9. Combining multiple queries

Apply multiple preference queries together for the highest sustainability impact. A user on
a metered connection who also prefers reduced motion and dark mode benefits from all three
applied simultaneously.

```css
/* Minimal experience: dark + reduced-data + reduced-motion */
@media (prefers-color-scheme: dark)
    and (prefers-reduced-data: reduce)
    and (prefers-reduced-motion: reduce) {
  .hero {
    background-image: none;
    background-color: #111;
  }

  .animated-feature {
    animation: none;
    transition: none;
  }
}
```

Prefer layering queries independently so they compose:

```css
/* Each query applies individually and they stack */
@media (prefers-color-scheme: dark) {
  :root { --color-background: #1a1a1a; }
}

@media (prefers-reduced-data: reduce) {
  .decorative-image { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none; transition: none; }
}
```

---

## 10. Implementation checklist

Before shipping any new page or component, verify:

- [ ] `prefers-color-scheme` is implemented for dark mode; all colors meet WCAG AA in both modes.
- [ ] `prefers-reduced-motion` disables or removes all decorative animations and transitions.
- [ ] Decorative images and non-critical assets are skipped when `prefers-reduced-data: reduce`.
- [ ] Contrast adjustments are in place for `prefers-contrast: more`.
- [ ] Transparency and blur effects are removed when `prefers-reduced-transparency: reduce`.
- [ ] Print styles hide navigation and decorative content and remove ink-heavy backgrounds.
- [ ] Content that depends on JavaScript is visible in the `scripting: none` state.
- [ ] Monochrome fallback patterns use borders and text labels rather than color-only cues.

---

## 11. For AI agents

Before generating or modifying CSS, check:

- Does the component use color, animation, or transparency that should respond to user
  preference media queries?
- Is there a print style for any page with substantial written content?
- Does the component degrade gracefully when scripting is unavailable?
- Are data-heavy assets (images, fonts, video) gated on `prefers-reduced-data`?

Do not generate CSS that:

- Removes all content in print mode.
- Loops animations without a `prefers-reduced-motion` override.
- Uses color alone to convey meaning without a monochrome fallback.
- Requires JavaScript to access primary content without a `scripting: none` fallback.

---

## Trusted references

- [WSG: Use Sustainability-Beneficial User Preference Media Queries](https://www.w3.org/TR/web-sustainability-guidelines/#use-sustainability-beneficial-user-preference-media-queries)
- [Light/Dark Mode Accessibility Best Practices](LIGHT_DARK_MODE_ACCESSIBILITY_BEST_PRACTICES.md)
- [User Personalization Accessibility Best Practices](https://mgifford.github.io/ACCESSIBILITY.md/examples/USER_PERSONALIZATION_ACCESSIBILITY_BEST_PRACTICES.html)
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN: prefers-reduced-data](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-data)
- [MDN: prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [MDN: prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency)
- [MDN: monochrome](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome)
- [MDN: print media type](https://developer.mozilla.org/en-US/docs/Web/CSS/@media#media_types)
- [MDN: scripting](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting)
- [W3C: WCAG 2.2 Success Criterion 1.4.1 – Use of Color](https://www.w3.org/TR/WCAG22/#use-of-color)
- [W3C: WCAG 2.2 Success Criterion 2.3.1 – Three Flashes or Below Threshold](https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold)
