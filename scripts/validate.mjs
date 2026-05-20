// CI guard: ensures icons/ ↔ data/logos.yml ↔ data/categories.yml are consistent.
// Exits non-zero if any orphan, slug-collision, bad slug, missing display name, or
// dangling category reference is found.

import path from 'node:path';
import process from 'node:process';
import { loadCatalog, validateCatalog } from './load-catalog.mjs';

const REPO = path.resolve(import.meta.dirname, '..');

const catalog = loadCatalog(REPO);
const errors = validateCatalog(catalog);

if (errors.length > 0) {
  console.error(`${errors.length} catalog error(s):\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log(`OK — ${catalog.logos.length} logos across ${Object.keys(catalog.categories).length} categories.`);
