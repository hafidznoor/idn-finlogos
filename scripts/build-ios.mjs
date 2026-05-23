// Generates the iOS Swift Package sources from dist/manifest.json + dist/icons/.
// Must run AFTER scripts/build.mjs has produced dist/.
//
//   Sources/IdnFinLogos/Icons/<slug>.svg                (copied)
//   Sources/IdnFinLogos/Catalog.generated.swift         (generated)

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const REPO = path.resolve(import.meta.dirname, '..');
const DIST = path.join(REPO, 'dist');
const MANIFEST_PATH = path.join(DIST, 'manifest.json');
const TARGET_DIR = path.join(REPO, 'Sources', 'IdnFinLogos');
const ICONS_DIR = path.join(TARGET_DIR, 'Icons');
const CATALOG_FILE = path.join(TARGET_DIR, 'Catalog.generated.swift');

function rimrafSync(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

// Swift string literal: escape backslash, double-quote, and parenthesis-following-backslash (interpolation).
function sw(s) {
  return '"' + String(s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t') + '"';
}

function swArr(items) {
  if (items.length === 0) return '[]';
  return '[' + items.map(sw).join(', ') + ']';
}

function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Missing ${MANIFEST_PATH}. Run \`npm run build\` first.`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  rimrafSync(ICONS_DIR);
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  fs.mkdirSync(TARGET_DIR, { recursive: true });

  for (const logo of manifest.logos) {
    fs.copyFileSync(
      path.join(DIST, 'icons', `${logo.slug}.svg`),
      path.join(ICONS_DIR, `${logo.slug}.svg`)
    );
  }

  const categoriesSorted = Object.entries(manifest.categories)
    .map(([slug, meta]) => ({ slug, displayName: meta.displayName, count: meta.count }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const lines = [];
  lines.push('// Generated file — do not edit by hand.');
  lines.push('// Source: data/logos.yml. Regenerate via `npm run build:ios`.');
  lines.push('//');
  lines.push('// Logo SVGs are licensed CC-BY-NC-4.0 (see LICENSE-ASSETS at repo root).');
  lines.push('// This Swift code is licensed MIT (see LICENSE at repo root).');
  lines.push('');
  lines.push('import Foundation');
  lines.push('');
  lines.push('internal enum Catalog {');
  lines.push(`    static let version: String = ${sw(manifest.version)}`);
  lines.push('');
  lines.push('    static let logos: [LogoMeta] = [');
  for (const logo of manifest.logos) {
    const aliases = swArr(logo.aliases ?? []);
    const tags = swArr(logo.tags ?? []);
    lines.push(
      `        LogoMeta(slug: ${sw(logo.slug)}, name: ${sw(logo.name)}, ` +
      `category: ${sw(logo.category)}, aliases: ${aliases}, tags: ${tags}),`
    );
  }
  lines.push('    ]');
  lines.push('');
  lines.push('    static let categories: [Category] = [');
  for (const c of categoriesSorted) {
    lines.push(`        Category(slug: ${sw(c.slug)}, displayName: ${sw(c.displayName)}, count: ${c.count}),`);
  }
  lines.push('    ]');
  lines.push('}');
  lines.push('');

  fs.writeFileSync(CATALOG_FILE, lines.join('\n'));

  console.log(`Built iOS Swift Package`);
  console.log(`  logos copied:    ${manifest.logos.length}`);
  console.log(`  Catalog.swift:   ${path.relative(REPO, CATALOG_FILE)}`);
  console.log(`  resources:       ${path.relative(REPO, ICONS_DIR)}`);
  console.log(`  version:         ${manifest.version}`);
}

main();
