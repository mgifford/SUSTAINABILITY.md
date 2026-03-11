---
layout: page
title: Machine-Readable Metadata
meta_title: Machine-Readable Metadata · SUSTAINABILITY.md
description: How to structure metadata using JSON-LD, RDFa, Microdata, and sitemap.xml to make web content discoverable by search engines, AI systems, and automated agents without requiring a page visit.
lede: Covers four complementary approaches — JSON-LD, RDFa, Microdata, and sitemap.xml — with implementation examples aligned with WSG 4.4 (Structure Metadata for Machine Readability). Includes guidance on optimizing for giving information directly to users, not just driving page visits.
---

> **WSG alignment:** This document implements the Web Sustainability Guidelines requirement to
> [Structure Your Metadata for Machine Readability](https://www.w3.org/TR/web-sustainability-guidelines/#structure-metadata-for-machine-readability)
> (WSG 4.4).
>
> **Sustainability relevance:** Well-structured machine-readable metadata allows search
> engines, AI assistants, and automated tools to answer user questions directly — without
> a round-trip page load. Every question answered without a page visit saves bandwidth,
> server compute, and client-side energy. Metadata is also typically a few hundred bytes
> versus tens of kilobytes for a rendered page. At scale, the savings are significant.

---

This document provides practical guidance for implementing machine-readable metadata.
It applies to human developers and to AI coding agents generating or reviewing HTML.

See [examples/MACHINE_READABLE_METADATA_DEMO.html](MACHINE_READABLE_METADATA_DEMO.html)
for a working reference page that puts these patterns into practice.

---

## 1. Why machine-readable metadata matters for sustainability

Search engines, AI assistants, and feed readers can extract structured data without
executing JavaScript or rendering a full page. When metadata is structured correctly:

- Users get answers in search result snippets, AI chat, or voice assistants
- Fewer page loads are needed to satisfy the same information demand
- Crawlers index content with fewer requests and less compute
- Content remains usable even when JavaScript is blocked or unavailable

### The discoverability principle

The goal is to **give information to users, not to get users to visit a page**. A well-formed
`<title>`, `<meta name="description">`, and a JSON-LD block can satisfy a large fraction of
queries without any additional network activity.

### Efficiency comparison

| Metadata format | Bytes (typical) | Parse cost | JS required |
| --------------- | --------------- | ---------- | ----------- |
| `<meta>` tags | < 500 B | Negligible | No |
| JSON-LD block | 1–5 KB | Negligible | No |
| Full page load | 100–3,000 KB | High | Often |

---

## 2. Format options

Four formats are in common use. They are complementary, not mutually exclusive.

### 2.1 JSON-LD (recommended)

[JSON-LD](https://json-ld.org/) embeds structured data as a `<script type="application/ld+json">`
block. It does not require modifying visible HTML attributes and is the format preferred by
Google, Bing, and the major AI crawlers.

**Advantages:**

- Decoupled from visible markup — no risk of breaking layout when updating metadata
- Easy to generate server-side from existing data models
- Readable and testable as a standalone JSON document
- Supported by all major search engines and the [Schema.org](https://schema.org/) vocabulary

**Basic page example:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Machine-Readable Metadata",
  "description": "How to structure metadata for discoverability and lower-impact crawling.",
  "url": "https://example.org/examples/machine-readable-metadata",
  "dateModified": "2026-03-11",
  "author": {
    "@type": "Organization",
    "name": "SUSTAINABILITY.md Project",
    "url": "https://mgifford.github.io/sustainability.md/"
  }
}
</script>
```

**Article example:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Reducing the Carbon Cost of Web Browsing",
  "datePublished": "2026-01-15",
  "dateModified": "2026-03-11",
  "author": {
    "@type": "Person",
    "name": "Example Author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SUSTAINABILITY.md Project",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.org/assets/logo.png"
    }
  },
  "description": "Practical steps to measure and reduce browser energy use.",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.org/articles/carbon-cost-web-browsing"
  }
}
</script>
```

**FAQ example** (enables rich results and AI direct answers):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a sustainability budget?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A sustainability budget sets measurable limits on page weight, request count, and carbon per page view. Budgets are enforced in CI to prevent regressions."
      }
    },
    {
      "@type": "Question",
      "name": "How do I measure web page carbon emissions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use tools like CO2.js, Website Carbon Calculator, or Ecograder. These estimate carbon based on data transfer, hosting energy mix, and device usage patterns."
      }
    }
  ]
}
</script>
```

### 2.2 RDFa

[RDFa](https://rdfa.info/) embeds structured metadata directly in HTML attributes. It uses
the same [Schema.org](https://schema.org/) vocabulary as JSON-LD but annotates visible
content in place.

**Advantages:**

- Metadata is tightly coupled to visible content — changes stay in sync automatically
- No separate block to maintain
- Supported by all major search engines

**Disadvantages:**

- Adds attributes to every annotated element, increasing HTML verbosity
- More disruptive to change than a standalone JSON-LD block
- Harder to test in isolation

**Example:**

```html
<article vocab="https://schema.org/" typeof="Article">
  <h1 property="headline">Reducing the Carbon Cost of Web Browsing</h1>
  <p>
    Published by
    <span property="author" typeof="Person">
      <span property="name">Example Author</span>
    </span>
    on
    <time property="datePublished" datetime="2026-01-15">15 January 2026</time>.
  </p>
  <p property="description">
    Practical steps to measure and reduce browser energy use.
  </p>
</article>
```

### 2.3 Microdata

[Microdata](https://developer.mozilla.org/en-US/docs/Web/HTML/Microdata) is a W3C HTML
extension that annotates visible content using `itemscope`, `itemtype`, and `itemprop`
attributes. It uses the same [Schema.org](https://schema.org/) vocabulary.

**Advantages:**

- Native HTML — no extra vocabulary to import
- Supported by all major search engines

**Disadvantages:**

- Verbose: every annotated element requires `itemprop`
- Harder to read and maintain than JSON-LD
- Generally superseded by JSON-LD for new implementations

**Example:**

```html
<article itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">Reducing the Carbon Cost of Web Browsing</h1>
  <p>
    Published by
    <span itemprop="author" itemscope itemtype="https://schema.org/Person">
      <span itemprop="name">Example Author</span>
    </span>
    on
    <time itemprop="datePublished" datetime="2026-01-15">15 January 2026</time>.
  </p>
  <p itemprop="description">
    Practical steps to measure and reduce browser energy use.
  </p>
</article>
```

### 2.4 sitemap.xml

A [sitemap](https://www.sitemaps.org/protocol.html) tells crawlers which pages exist,
when they were last modified, and how often they change. This reduces unnecessary
re-crawling of unchanged content.

**Sustainability benefit:** Crawlers that respect `<lastmod>` skip pages that have not
changed, reducing both server load and wasted bandwidth. A well-maintained sitemap is
one of the cheapest ways to reduce crawler traffic.

**Minimal sitemap example:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.org/</loc>
    <lastmod>2026-03-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.org/examples/machine-readable-metadata</loc>
    <lastmod>2026-03-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Declare it in `robots.txt`:**

```text
User-agent: *
Disallow:

Sitemap: https://example.org/sitemap.xml
```

**Jekyll automation** — add to `_config.yml` with the
[jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap) plugin:

```yaml
plugins:
  - jekyll-sitemap
```

This generates `/sitemap.xml` automatically from your page front matter, including
accurate `<lastmod>` dates.

---

## 3. Essential `<head>` metadata

Every page should include these `<meta>` tags regardless of which structured data
format is used. They are read by browsers, social platforms, and AI crawlers.

```html
<head>
  <!-- Required -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page Title – Site Name</title>
  <meta name="description" content="One or two sentences describing this page's content." />

  <!-- Canonical URL — prevents duplicate content indexing -->
  <link rel="canonical" href="https://example.org/this-page" />

  <!-- Open Graph — social platforms and link previews -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="One or two sentences describing this page's content." />
  <meta property="og:url" content="https://example.org/this-page" />
  <meta property="og:image" content="https://example.org/assets/social-preview.png" />

  <!-- Humans.txt — credits and contact for human readers -->
  <link rel="author" href="/humans.txt" />
</head>
```

---

## 4. Choosing the right format

| Use case | Recommended format |
| -------- | ------------------ |
| New implementation, any page type | JSON-LD |
| Content already in HTML, want metadata to stay in sync | RDFa |
| Legacy codebase using Microdata, low migration appetite | Keep Microdata |
| Telling crawlers what pages exist and when they changed | sitemap.xml |
| Rich results (FAQ, How-to, Breadcrumb, Event) | JSON-LD |
| Podcast, video, or product feeds | JSON-LD |

**Start with JSON-LD.** It is the lowest-friction option, easiest to test, and supported
everywhere. Add `sitemap.xml` generation early — it is nearly free with static site generators.

---

## 5. Validation and testing

Run these checks before deploying structured data changes.

### 5.1 Schema.org validation

Use the [Schema Markup Validator](https://validator.schema.org/) to check JSON-LD, RDFa,
and Microdata for structural errors. It is the canonical reference tool and works offline
via the CLI.

```bash
# Install the official Schema.org validator CLI
npm install -g schema-dts

# Or test via curl against the hosted API
curl -s "https://validator.schema.org/api/validate" \
  -H "Content-Type: application/json" \
  -d '{"content": "<script type=\"application/ld+json\">{...}</script>", "url": ""}'
```

### 5.2 Google Rich Results Test

[Google's Rich Results Test](https://search.google.com/test/rich-results) checks whether
a page is eligible for rich result types (FAQ, Article, How-to). Use it after schema
validation for production pages.

### 5.3 Sitemap validation

```bash
# Validate XML structure
xmllint --noout sitemap.xml

# Check all URLs return 200
while IFS= read -r url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  echo "$code $url"
done < <(grep -oP '(?<=<loc>)[^<]+' sitemap.xml)
```

### 5.4 Automated CI check

Add a lightweight validation step to your CI pipeline:

```yaml
structured-data-lint:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Validate sitemap XML
      run: xmllint --noout _site/sitemap.xml

    - name: Check JSON-LD blocks parse as valid JSON
      run: |
        grep -r 'application/ld+json' _site/ --include='*.html' -l | \
        while read -r file; do
          node -e "
            const fs = require('fs');
            const html = fs.readFileSync('$file', 'utf8');
            const match = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g) || [];
            match.forEach((m, i) => {
              const json = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
              try { JSON.parse(json); } catch (e) { process.exit(1); }
            });
          "
        done
```

---

## 6. Common Schema.org types

These are the most frequently used types for content sites. Use the most specific type
that accurately describes the content.

| Type | Use for |
| ---- | ------- |
| `WebPage` | Any generic page |
| `WebSite` | The site itself (usually on the homepage) |
| `Article` | Blog posts, news articles, documentation |
| `TechArticle` | Technical documentation, how-to guides |
| `FAQPage` | Pages structured as questions and answers |
| `HowTo` | Step-by-step guides |
| `BreadcrumbList` | Navigation breadcrumbs |
| `Organization` | Company or project identity pages |
| `SoftwareApplication` | Apps, tools, or open source projects |
| `Dataset` | Data files, CSV exports, YAML references |
| `Event` | Scheduled events, webinars, conferences |

For a sustainability disclosure or policy file, `TechArticle` or `WebPage` with
`about` pointing to an `Event` or `Thing` describing sustainability is appropriate.

---

## 7. Adoption checklist

Use this checklist when adding or auditing structured metadata:

- [ ] Every page has a unique `<title>` and `<meta name="description">`
- [ ] Every page has a `<link rel="canonical">` with the absolute URL
- [ ] Key pages have JSON-LD with an appropriate Schema.org type
- [ ] FAQs and how-to pages use `FAQPage` or `HowTo` for rich results eligibility
- [ ] `sitemap.xml` is generated and kept up to date, with accurate `<lastmod>` dates
- [ ] `sitemap.xml` is declared in `robots.txt`
- [ ] Structured data is validated with the Schema Markup Validator before each deploy
- [ ] Open Graph tags are present for social sharing and link previews
- [ ] CI includes a JSON-LD parse check and sitemap XML validation

---

## 8. Related resources

- [W3C WSG — Structure Your Metadata for Machine Readability (WSG 4.4)](https://www.w3.org/TR/web-sustainability-guidelines/#structure-metadata-for-machine-readability)
- [Schema.org full type hierarchy](https://schema.org/docs/full.html)
- [Schema Markup Validator](https://validator.schema.org/)
- [Google — Structured data documentation](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [JSON-LD specification](https://www.w3.org/TR/json-ld11/)
- [RDFa Primer (W3C)](https://www.w3.org/TR/rdfa-primer/)
- [Sitemaps protocol](https://www.sitemaps.org/protocol.html)
- [jekyll-sitemap plugin](https://github.com/jekyll/jekyll-sitemap)
