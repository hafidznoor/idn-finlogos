// Per-logo access stats, harvested from jsDelivr's public CDN analytics.
//
//   node scripts/stats.mjs                        -> top logos, last month
//   node scripts/stats.mjs --period year --top 50
//   node scripts/stats.mjs --json > stats.json
//   node scripts/stats.mjs --zero                 -> logos nobody fetched
//
// jsDelivr counts every request it serves, per file, per version. Because the
// npm/CDN/README/CLI paths all resolve through jsDelivr, this is a real usage
// signal for the whole library — no telemetry, no code shipped to users, and
// it is retroactive across every published version.
//
// Stats are per *version*, so we fan out over all published versions and fold
// the counts back onto one row per logo slug. Hits are split by delivery shape:
//   /dist/icons/<slug>.svg      raw SVG        (CDN <img>, CLI download)
//   /dist/png/<slug>@Nx.png     raster         (CLI --format png)
//   /dist/icons/<slug>.mjs|.js  per-logo ESM   (bundler-resolved imports)

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { loadCatalog } from './load-catalog.mjs';

const REPO = path.resolve(import.meta.dirname, '..');
const PKG = 'idn-finlogos';
const API = 'https://data.jsdelivr.com/v1';
const PERIODS = new Set(['day', 'week', 'month', 'year', 's-month', 's-year']);

const { values } = parseArgs({
  options: {
    period: { type: 'string', default: 'month' },
    top: { type: 'string', default: '25' },
    json: { type: 'boolean' },
    zero: { type: 'boolean' },
    out: { type: 'string' }
  }
});

if (!PERIODS.has(values.period)) {
  console.error(`Unknown --period "${values.period}". Use: ${[...PERIODS].join(', ')}.`);
  process.exit(1);
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}

// Map a CDN file path back to (slug, delivery shape). Returns null for files
// that aren't a single logo — manifest.json, /+esm, framework bundles.
function classify(name) {
  let m = name.match(/^\/dist\/icons\/([a-z0-9-]+)\.svg$/);
  if (m) return { slug: m[1], kind: 'svg' };
  m = name.match(/^\/dist\/png\/([a-z0-9-]+)@\dx\.png$/);
  if (m) return { slug: m[1], kind: 'png' };
  m = name.match(/^\/dist\/icons\/([a-z0-9-]+)\.m?js$/);
  if (m) return { slug: m[1], kind: 'esm' };
  return null;
}

const { versions } = await getJson(`${API}/packages/npm/${PKG}`).then((p) => ({
  versions: p.versions.map((v) => v.version)
}));

const rows = new Map(); // slug -> { slug, svg, png, esm, total }
const bump = (slug, kind, hits) => {
  let r = rows.get(slug);
  if (!r) rows.set(slug, (r = { slug, svg: 0, png: 0, esm: 0, total: 0 }));
  r[kind] += hits;
  r.total += hits;
};

let scanned = 0;
const skipped = [];
for (const v of versions) {
  let files;
  try {
    files = await getJson(`${API}/stats/packages/npm/${PKG}@${v}/files?period=${values.period}`);
  } catch (err) {
    skipped.push(`${v} (${err.message})`);
    continue;
  }
  if (!Array.isArray(files)) continue;
  scanned++;
  for (const f of files) {
    const hit = classify(f.name);
    if (hit) bump(hit.slug, hit.kind, f.hits?.total ?? 0);
  }
}

// Cross-reference the live catalog so we can report coverage, not just traffic.
const catalog = loadCatalog(REPO);
const known = new Set(catalog.logos.map((l) => l.slug));
const named = new Map(catalog.logos.map((l) => [l.slug, l.name]));

const ranked = [...rows.values()].filter((r) => r.total > 0).sort((a, b) => b.total - a.total || a.slug.localeCompare(b.slug));
const hitSlugs = new Set(ranked.map((r) => r.slug));
// Retired slugs still served from older versions but no longer in the catalog.
const retired = ranked.filter((r) => !known.has(r.slug)).map((r) => r.slug);
const cold = catalog.logos.filter((l) => !hitSlugs.has(l.slug)).map((l) => l.slug);
const grand = ranked.reduce((n, r) => n + r.total, 0);

const report = {
  package: PKG,
  period: values.period,
  generatedAt: new Date().toISOString(),
  versionsScanned: scanned,
  catalogSize: catalog.logos.length,
  logosWithTraffic: ranked.length,
  coldLogos: cold.length,
  totalHits: grand,
  logos: ranked.map((r) => ({ ...r, name: named.get(r.slug) ?? null, inCatalog: known.has(r.slug) })),
  cold,
  retiredWithTraffic: retired
};

if (values.out) {
  fs.mkdirSync(path.dirname(path.resolve(values.out)), { recursive: true });
  fs.writeFileSync(path.resolve(values.out), JSON.stringify(report, null, 2) + '\n');
}
if (values.json) {
  if (!values.out) process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(0);
}

// --- human-readable report -------------------------------------------------

const n = (x) => x.toLocaleString('en-US');
console.log(
  `${PKG} — per-logo CDN hits (jsDelivr, period: ${values.period}, ${scanned}/${versions.length} versions)\n`
);
if (skipped.length) console.log(`  skipped versions: ${skipped.join(', ')}\n`);

if (values.zero) {
  console.log(`${cold.length} of ${catalog.logos.length} catalog logos had zero hits this ${values.period}:\n`);
  for (const slug of cold) console.log(`  ${slug}  ${named.get(slug) ?? ''}`);
  process.exit(0);
}

const top = ranked.slice(0, Number(values.top) || 25);
if (top.length === 0) {
  console.log('No traffic reported for this period.');
  process.exit(0);
}
const w = (key, head) => Math.max(head.length, ...top.map((r) => n(r[key]).length));
const slugW = Math.max(4, ...top.map((r) => r.slug.length));
const totalW = w('total', 'TOTAL');
const svgW = w('svg', 'SVG');
const pngW = w('png', 'PNG');
const esmW = w('esm', 'ESM');
console.log(
  `${'SLUG'.padEnd(slugW)}  ${'TOTAL'.padStart(totalW)}  ${'SVG'.padStart(svgW)}  ` +
    `${'PNG'.padStart(pngW)}  ${'ESM'.padStart(esmW)}  NAME`
);
for (const r of top) {
  const flag = known.has(r.slug) ? '' : '  (retired)';
  console.log(
    `${r.slug.padEnd(slugW)}  ${n(r.total).padStart(totalW)}  ${n(r.svg).padStart(svgW)}  ` +
      `${n(r.png).padStart(pngW)}  ${n(r.esm).padStart(esmW)}  ${named.get(r.slug) ?? '—'}${flag}`
  );
}
console.log(
  `\n${n(grand)} hits across ${ranked.length} logos. ` +
    `${cold.length}/${catalog.logos.length} catalog logos saw zero traffic (--zero to list them).`
);
if (retired.length) {
  console.log(`${retired.length} retired slug(s) still being fetched: ${retired.join(', ')}`);
}
