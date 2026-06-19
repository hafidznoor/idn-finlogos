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

// Non-fatal alias coverage report. "Canonical" = entries that aren't an -alt/-old/
// -new/-vertical/numbered variant (those reuse the canonical entry's aliases).
const variantRe = /-(?:alt|alt-\d+|old|new|vertical|\d+)$/;
const canonical = catalog.logos.filter((l) => !variantRe.test(l.slug));
const withAlias = canonical.filter((l) => (l.aliases?.length ?? 0) >= 1);
const withTwo = canonical.filter((l) => (l.aliases?.length ?? 0) >= 2);
const gaps = canonical.filter((l) => !(l.aliases?.length)).map((l) => l.slug);
const gapPreview = gaps.slice(0, 25).join(', ') + (gaps.length > 25 ? `, …(+${gaps.length - 25} more)` : '');
console.log(
  `Alias coverage: ${withAlias.length}/${canonical.length} canonical logos have ≥1 alias; ` +
  `${withTwo.length} have ≥2; ${gaps.length} have none.`,
);
if (gaps.length) console.log(`  gaps: ${gapPreview}`);
