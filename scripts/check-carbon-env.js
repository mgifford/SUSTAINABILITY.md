#!/usr/bin/env node
/**
 * check-carbon-env.js
 *
 * Decides where to run the sustainability audit based on the local environment.
 *
 * Usage:
 *   node scripts/check-carbon-env.js
 *
 * Environment variables:
 *   SUSTAINABILITY_SERVER_ONLY=true  — skip local audit; let CI runner handle it instead.
 *
 * Requires @lhci/cli to be installed globally:
 *   npm install -g @lhci/cli
 *
 * Aligned with the local-first principle in SUSTAINABILITY.md §7:
 * run audits on developer machines before pushing to reduce failed-build cycles.
 */

'use strict';

const { execSync } = require('child_process');

const runOnServer = process.env.SUSTAINABILITY_SERVER_ONLY === 'true';

if (runOnServer) {
  console.log('SUSTAINABILITY_SERVER_ONLY is set: skipping local audit; CI runner will handle it.');
  process.exit(0);
}

console.log('Running sustainability audit locally (local-first default)...');

try {
  execSync('lhci autorun', { stdio: 'inherit' });
  console.log('Local sustainability audit passed.');
} catch (err) {
  console.error('Local sustainability audit failed:', err.message || err);
  console.error('Fix issues before pushing.');
  process.exit(1);
}
