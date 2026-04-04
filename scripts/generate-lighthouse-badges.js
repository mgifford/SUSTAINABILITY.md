#!/usr/bin/env node
/**
 * generate-lighthouse-badges.js
 *
 * Reads Lighthouse CI output from .lighthouseci/ and writes SVG score badges
 * to the badges/ directory for each scored category.
 *
 * Usage (run after lhci collect):
 *   node scripts/generate-lighthouse-badges.js
 *
 * Output files:
 *   badges/lighthouse-performance.svg
 *   badges/lighthouse-accessibility.svg
 *   badges/lighthouse-best-practices.svg
 *   badges/lighthouse-seo.svg
 */

'use strict';

const fs = require('fs');
const path = require('path');

const LHR_DIR = path.join(process.cwd(), '.lighthouseci');
const BADGES_DIR = path.join(process.cwd(), 'badges');

const BADGE_DEFS = [
  { key: 'performance',    file: 'lighthouse-performance.svg',    label: 'Performance' },
  { key: 'accessibility',  file: 'lighthouse-accessibility.svg',  label: 'Accessibility' },
  { key: 'best-practices', file: 'lighthouse-best-practices.svg', label: 'Best Practices' },
  { key: 'seo',            file: 'lighthouse-seo.svg',            label: 'SEO' },
];

/** Lighthouse color thresholds (matches official UI). */
function scoreColor(score) {
  if (score >= 0.9) return '#0cce6b';
  if (score >= 0.5) return '#ffa400';
  return '#ff4e42';
}

/**
 * Estimate rendered text width in pixels for DejaVu Sans at font-size 11.
 * Approximation: average 6.5 px/char plus 10 px padding on each side.
 */
function textWidth(str) {
  return Math.round(str.length * 6.5) + 20;
}

function generateSVG(label, score) {
  const pct = Math.round(score * 100);
  const color = scoreColor(score);
  const ariaLabel = `Lighthouse ${label}: ${pct}`;

  const lw = textWidth(label);
  const vw = textWidth(String(pct));
  const total = lw + vw;

  // Text x-centres
  const lx = Math.round(lw / 2);
  const vx = lw + Math.round(vw / 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20" role="img" aria-label="${ariaLabel}">
  <title>${ariaLabel}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${total}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${lw}" height="20" fill="#555"/>
    <rect x="${lw}" width="${vw}" height="20" fill="${color}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${lx}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${lx}" y="14">${label}</text>
    <text x="${vx}" y="15" fill="#010101" fill-opacity=".3">${pct}</text>
    <text x="${vx}" y="14">${pct}</text>
  </g>
</svg>
`;
}

function findLatestLHR() {
  if (!fs.existsSync(LHR_DIR)) {
    throw new Error(`Lighthouse CI output directory not found: ${LHR_DIR}`);
  }
  const files = fs.readdirSync(LHR_DIR)
    .filter(f => f.startsWith('lhr-') && f.endsWith('.json'))
    .sort();
  if (files.length === 0) {
    throw new Error(`No lhr-*.json files found in ${LHR_DIR}`);
  }
  // Use the last file (most recent by sorted name which includes timestamp)
  return path.join(LHR_DIR, files[files.length - 1]);
}

function main() {
  const lhrPath = findLatestLHR();
  console.log(`Reading LHR from: ${lhrPath}`);
  const lhr = JSON.parse(fs.readFileSync(lhrPath, 'utf8'));

  fs.mkdirSync(BADGES_DIR, { recursive: true });

  for (const { key, file, label } of BADGE_DEFS) {
    const category = lhr.categories[key];
    if (!category || typeof category.score !== 'number') {
      console.warn(`  Skipping ${key}: category not found or score missing`);
      continue;
    }
    const svg = generateSVG(label, category.score);
    const outPath = path.join(BADGES_DIR, file);
    fs.writeFileSync(outPath, svg, 'utf8');
    console.log(`  Written: ${outPath} (score: ${Math.round(category.score * 100)})`);
  }
  console.log('Badge generation complete.');
}

main();
