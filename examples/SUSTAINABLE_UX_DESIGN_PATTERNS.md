---
layout: page
title: Sustainable UX Design Patterns
meta_title: Sustainable UX Design Patterns · SUSTAINABILITY.md
description: Practical UX design guidance aligned with the Web Sustainability Guidelines (WSG) to minimize non-essential content, improve navigation, eliminate distracting patterns, and avoid manipulative design.
lede: Covers four WSG UX design guidelines — minimizing non-essential content and journeys, well-structured navigation, design that assists rather than distracts, and avoiding manipulative or deceptive patterns. Applies to human designers, developers, and AI coding agents.
---

> **WSG alignment:** These patterns implement four UX Design guidelines from the
> [Web Sustainability Guidelines (WSG)](https://www.w3.org/TR/web-sustainability-guidelines/):
>
> - [Minimize Non-Essential Content, Interactivity, or Journeys](https://www.w3.org/TR/web-sustainability-guidelines/#minimize-non-essential-content-interactivity-or-journeys)
> - [Ensure That Navigation and Wayfinding Are Well-Structured](https://www.w3.org/TR/web-sustainability-guidelines/#ensure-that-navigation-and-wayfinding-are-well-structured)
> - [Design to Assist and Not to Distract](https://www.w3.org/TR/web-sustainability-guidelines/#design-to-assist-and-not-to-distract)
> - [Avoid Being Manipulative or Deceptive](https://www.w3.org/TR/web-sustainability-guidelines/#avoid-being-manipulative-or-deceptive)
>
> **Sustainability relevance:** Reducing non-essential content and journeys directly lowers
> page weight, server requests, and wasted compute. Clear navigation reduces the number of
> page loads needed for users to complete tasks. Eliminating distracting and deceptive
> patterns reduces unintended interactions, lowers support cost, and respects users' time
> and attention. These patterns benefit both accessibility and sustainability.

---

This document provides practical, implementation-ready guidance for applying sustainable UX
design principles. It applies to human designers and developers, and to AI coding agents
making UI changes.

---

## 1. Minimize Non-Essential Content, Interactivity, or Journeys

Reduce the footprint of every page and flow by removing what users do not need to achieve
their goal.

### 1.1 Content audit checklist

Before shipping or updating a page, ask:

- Does each content block serve an identified user need?
- Are there banners, carousels, or promotional blocks that can be removed or made opt-in?
- Is embedded video or audio loaded eagerly when it could be deferred or replaced with a
  static preview?
- Are there duplicate sections, redundant calls to action, or repeated cross-links?
- Can any step in a multi-step flow be eliminated or combined?

### 1.2 Prefer progressive disclosure

Show the minimum needed by default. Reveal additional detail only when the user asks.

**Preferred pattern:**

```html
<!-- Static summary shown by default; full content disclosed on demand -->
<section>
  <h2>Shipping policy</h2>
  <p>We ship to over 30 countries. Standard delivery is 3–5 business days.</p>
  <details>
    <summary>View full shipping details</summary>
    <p>Express options, regional rates, and restrictions are listed below…</p>
    <!-- Additional content loaded or rendered here -->
  </details>
</section>
```

**Avoid:**

- Auto-expanding accordions that load all content on page render
- Loading full-resolution media on page load when a thumbnail is sufficient
- Inline modals or panels that open automatically without user action

### 1.3 Reduce journey length

- Design task flows to the minimum number of steps to reach the goal.
- Combine steps that ask for logically related information (for example, combine name and
  contact details into one form screen rather than two separate screens).
- Provide sensible defaults so users do not need to interact with fields that apply to most.
- Preserve user input across navigation so users do not need to re-enter data after a
  back-navigation or session restore.

### 1.4 For AI agents

Before generating or proposing UI content, ask:

- Is this content block required to fulfill the user's task?
- Does adding this feature increase request count or page weight beyond the current budget?
- Can an existing component or pattern cover the need without adding new markup or scripts?

---

## 2. Ensure Navigation and Wayfinding Are Well-Structured

Good navigation reduces wasted page loads and helps users reach their goal in fewer steps.

### 2.1 Navigation structure principles

- Limit the top-level navigation to the items users need most. Remove low-traffic or
  redundant items.
- Use clear, descriptive labels. Avoid jargon, marketing phrases, or ambiguous terms
  (for example, prefer "Pricing" over "Plans & Solutions").
- Make the current page location visible in the navigation (active state).
- Provide a consistent navigation order across all pages. Do not reorder navigation based
  on inferred user preferences without an explicit user action.
- Ensure every navigation item leads to a page that delivers on the label's promise.

### 2.2 Breadcrumbs and wayfinding

Use breadcrumbs for sites with more than two levels of hierarchy:

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/products/widgets">Widgets</a></li>
    <li aria-current="page">Blue Widget</li>
  </ol>
</nav>
```

- Use an ordered list (`<ol>`) to convey hierarchy to screen readers.
- Mark the current page with `aria-current="page"`, not a disabled link.
- Keep breadcrumb labels consistent with the heading and page title of each level.

### 2.3 Search and skip navigation

- Provide a site search for content-heavy sites to reduce the number of navigation steps.
- Provide a visible skip-to-content link as the first keyboard-focusable element:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
  .skip-link {
    position: absolute;
    top: -3rem;
    left: 0;
    background: #000;
    color: #fff;
    padding: 0.5rem 1rem;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }
</style>
```

### 2.4 Mobile and small-screen navigation

- Use a single consistent navigation entry point on small screens (for example, a hamburger
  menu or bottom navigation bar). Do not provide two separate navigation systems.
- Ensure the mobile menu is keyboard accessible and dismissible with the Escape key.
- Avoid navigation menus that require hover to reveal sub-items on touch devices.

### 2.5 Avoid navigation anti-patterns

| Anti-pattern | Problem | Preferred alternative |
| :--- | :--- | :--- |
| Mega-menus with dozens of links | Cognitive load, poor mobile experience | Group into fewer top-level categories |
| Navigation that changes order between pages | Disorientation, wasted interactions | Fixed, predictable order |
| Links that open in new tabs without notice | Breaks expected Back button behavior | Open in same tab; warn if opening in new tab |
| Infinite scroll with no pagination | Cannot deep-link or return to position | Paginate or provide a "load more" control |

---

## 3. Design to Assist and Not to Distract

Remove UI patterns that draw attention away from users' goals without adding value.

### 3.1 Motion and animation

Prefer no motion or minimal motion. Every animation adds render cost and can interrupt focus.

```css
/* Default: no motion */
.notification-badge {
  /* static */
}

/* Only animate when the user has not requested reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .notification-badge--new {
    animation: pulse 1s ease-in-out;
    animation-iteration-count: 2;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

Requirements:

- Respect `prefers-reduced-motion: reduce` — disable or replace all decorative animations.
- Limit animations to a single play when communicating state change (not looping).
- Do not use animated advertisements or auto-playing video in the main content flow.
- Do not flash content more than three times per second (WCAG 2.3.1).

### 3.2 Notifications and interruptions

- Do not show unsolicited modal dialogs on page load (cookie banners excepted where legally
  required — and even then, keep them minimal).
- Limit push notification prompts to contexts where the user has demonstrated intent (for
  example, after completing a task where notifications are relevant).
- Batch in-page notifications rather than showing multiple sequential toasts.
- Set a maximum on-screen duration for non-critical notifications (for example, 5 seconds)
  and ensure they do not shift layout.

### 3.3 Focus management

Do not steal or reset keyboard focus without user intent:

```javascript
// AVOID: moving focus on page load to a non-primary element
// document.getElementById('newsletter-signup').focus(); // on DOMContentLoaded

// PREFERRED: move focus only after a user-triggered navigation or state change
function openDialog(dialogEl) {
  dialogEl.removeAttribute('hidden');
  const focusTarget = dialogEl.querySelector('[autofocus], h2, [tabindex="-1"]');
  if (focusTarget) focusTarget.focus();
}

function closeDialog(dialogEl, triggerEl) {
  dialogEl.setAttribute('hidden', '');
  triggerEl.focus(); // Return focus to the element that opened the dialog
}
```

### 3.4 Advertising and promotional content

- Mark promotional content visually and semantically so users can distinguish it from
  editorial content.
- Do not place promotional content in a position that mimics the primary content flow
  (for example, a sponsored card that looks identical to an organic result without a label).
- Lazy-load ads below the fold. Do not block the critical rendering path for advertisement
  scripts.

### 3.5 For AI agents

Do not generate UI that:

- Introduces animations unless the design system's documented animation pattern applies.
- Adds modals, banners, or notification prompts that were not explicitly requested.
- Places marketing or promotional copy inside functional UI components.

---

## 4. Avoid Being Manipulative or Deceptive

Dark patterns waste users' time, erode trust, generate support load, and may cause legal
exposure. Remove them from design systems and review them in pull requests.

### 4.1 Common dark patterns to avoid

| Pattern | Description | Compliant alternative |
| :--- | :--- | :--- |
| Confirm-shaming | Labelling the reject option with guilt ("No thanks, I hate savings") | Use neutral labels: "No thank you" or "Close" |
| Hidden costs | Revealing fees only at the final checkout step | Display all costs as early as possible, ideally on the product page |
| Disguised ads | Formatting sponsored content to look like organic results | Label all sponsored or promoted content clearly |
| Roach motel | Easy to subscribe, very hard to cancel | Provide a self-service cancellation path equivalent to the sign-up path |
| Trick questions | Pre-checked consent boxes or double-negative opt-out wording | Use unchecked opt-in boxes with plain-language labels |
| False urgency | Fake countdown timers or artificially limited stock indicators | Only display real-time data; remove counters that reset |
| Misdirection | Highlighting a preferred option by making alternatives hard to find | Give all options equal visual weight and proximity |

### 4.2 Form and consent requirements

- All opt-in checkboxes must be **unchecked by default**.
- Consent language must describe what the user is agreeing to in plain language.
- Do not bundle unrelated consents into a single checkbox.
- Provide a clear and equally prominent way to withdraw consent.

```html
<!-- AVOID -->
<label>
  <input type="checkbox" name="marketing" checked>
  Keep me informed (and share my data with partners)
</label>

<!-- PREFERRED -->
<fieldset>
  <legend>Email preferences</legend>
  <label>
    <input type="checkbox" name="product-updates">
    Send me product updates and release notes
  </label>
  <label>
    <input type="checkbox" name="marketing">
    Send me promotional offers from our partners
  </label>
</fieldset>
```

### 4.3 Pricing and offers

- Do not use countdown timers that reset on page reload or per-session.
- Do not show a struck-out "original price" that was never the actual selling price.
- Display the total price inclusive of mandatory fees before the user reaches checkout.

### 4.4 Copy and labelling

- Use plain, accurate language for buttons and links. The label must match what happens
  when the user activates the control.
- Do not use the word "free" unless there is no cost at any stage.
- If a "free trial" converts to a paid subscription automatically, state the conversion
  date and price in the sign-up flow, not only in the terms.

### 4.5 For AI agents

Do not generate:

- Pre-checked consent or opt-in checkboxes.
- Countdown timers that do not reflect real data.
- Button or link labels that obscure the outcome of the action.
- Dismiss buttons labelled with shame or guilt language.
- Any pattern listed in the dark patterns table above.

Review all generated form markup for consent and opt-in compliance before proposing changes.

---

## Agent instruction snippet

Add to `AGENTS.md` or system prompts:

> Before generating or modifying UI, read `examples/SUSTAINABLE_UX_DESIGN_PATTERNS.md`.
> Do not add non-essential content, modals, animations, or promotional blocks without
> explicit request. Use clear, neutral labels on all interactive controls. Never generate
> pre-checked consent boxes, confirm-shaming copy, or countdown timers without real data.
> Flag any proposed change that increases page weight or request count.

---

## Trusted references

- [WSG: Minimize Non-Essential Content, Interactivity, or Journeys](https://www.w3.org/TR/web-sustainability-guidelines/#minimize-non-essential-content-interactivity-or-journeys)
- [WSG: Ensure That Navigation and Wayfinding Are Well-Structured](https://www.w3.org/TR/web-sustainability-guidelines/#ensure-that-navigation-and-wayfinding-are-well-structured)
- [WSG: Design to Assist and Not to Distract](https://www.w3.org/TR/web-sustainability-guidelines/#design-to-assist-and-not-to-distract)
- [WSG: Avoid Being Manipulative or Deceptive](https://www.w3.org/TR/web-sustainability-guidelines/#avoid-being-manipulative-or-deceptive)
- [Deceptive Design (formerly darkpatterns.org)](https://www.deceptive.design/)
- [Nielsen Norman Group: Dark Patterns in UX](https://www.nngroup.com/articles/dark-patterns/)
- [W3C: WCAG 2.2 Success Criterion 2.3.1 – Three Flashes or Below Threshold](https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold)
