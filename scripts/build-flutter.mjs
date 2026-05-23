// Generates the Flutter package sources from dist/manifest.json + dist/icons/.
// Must run AFTER scripts/build.mjs has produced dist/.
//
//   platforms/flutter/assets/idn-finlogos/<slug>.svg            (copied)
//   platforms/flutter/lib/src/catalog.g.dart                    (generated)
//   platforms/flutter/pubspec.yaml                              (version + flutter.assets block updated)

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const REPO = path.resolve(import.meta.dirname, '..');
const DIST = path.join(REPO, 'dist');
const MANIFEST_PATH = path.join(DIST, 'manifest.json');
const PKG_ROOT = path.join(REPO, 'platforms', 'flutter');
const ASSETS_DIR = path.join(PKG_ROOT, 'assets', 'idn-finlogos');
const LIB_SRC = path.join(PKG_ROOT, 'lib', 'src');
const CATALOG_FILE = path.join(LIB_SRC, 'catalog.g.dart');
const PUBSPEC = path.join(PKG_ROOT, 'pubspec.yaml');

function rimrafSync(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

// Dart string literal — single-quoted, escape backslash, single-quote, dollar (interpolation).
function dt(s) {
  return "'" + String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\$/g, '\\$')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t') + "'";
}

function dtList(items) {
  if (items.length === 0) return 'const <String>[]';
  return 'const <String>[' + items.map(dt).join(', ') + ']';
}

function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Missing ${MANIFEST_PATH}. Run \`npm run build\` first.`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  rimrafSync(ASSETS_DIR);
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  fs.mkdirSync(LIB_SRC, { recursive: true });

  for (const logo of manifest.logos) {
    fs.copyFileSync(
      path.join(DIST, 'icons', `${logo.slug}.svg`),
      path.join(ASSETS_DIR, `${logo.slug}.svg`)
    );
  }

  const categoriesSorted = Object.entries(manifest.categories)
    .map(([slug, meta]) => ({ slug, displayName: meta.displayName, count: meta.count }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  // Generate catalog.g.dart
  const lines = [];
  lines.push('// Generated file — do not edit by hand.');
  lines.push('// Source: data/logos.yml. Regenerate via `npm run build:flutter`.');
  lines.push('//');
  lines.push('// Logo SVGs are licensed CC-BY-NC-4.0 (see LICENSE-ASSETS at repo root).');
  lines.push('// This Dart code is licensed MIT (see LICENSE at repo root).');
  lines.push('');
  lines.push("import 'logo_meta.dart';");
  lines.push("import 'category.dart';");
  lines.push('');
  lines.push(`const String catalogVersion = ${dt(manifest.version)};`);
  lines.push('');
  lines.push('const List<LogoMeta> catalogLogos = <LogoMeta>[');
  for (const logo of manifest.logos) {
    const aliases = dtList(logo.aliases ?? []);
    const tags = dtList(logo.tags ?? []);
    lines.push(
      `  LogoMeta(slug: ${dt(logo.slug)}, name: ${dt(logo.name)}, ` +
      `category: ${dt(logo.category)}, aliases: ${aliases}, tags: ${tags}),`
    );
  }
  lines.push('];');
  lines.push('');
  lines.push('const List<Category> catalogCategories = <Category>[');
  for (const c of categoriesSorted) {
    lines.push(`  Category(slug: ${dt(c.slug)}, displayName: ${dt(c.displayName)}, count: ${c.count}),`);
  }
  lines.push('];');
  lines.push('');

  fs.writeFileSync(CATALOG_FILE, lines.join('\n'));

  // Rewrite pubspec.yaml — update version and the flutter.assets block.
  // The pubspec is hand-maintained except for those two regions, which sit between sentinel markers.
  if (!fs.existsSync(PUBSPEC)) {
    console.error(`Missing ${PUBSPEC}. Bootstrap the Flutter package skeleton first.`);
    process.exit(1);
  }
  let pubspec = fs.readFileSync(PUBSPEC, 'utf8');

  // Bump top-level `version:` to match npm.
  pubspec = pubspec.replace(/^version:\s.*$/m, `version: ${manifest.version}`);

  // Replace assets between sentinel comments.
  const assetEntries = manifest.logos
    .map((l) => `    - assets/idn-finlogos/${l.slug}.svg`)
    .join('\n');

  const startMarker = '# >>> generated:assets';
  const endMarker = '# <<< generated:assets';
  const block = `${startMarker}\n${assetEntries}\n  ${endMarker}`;

  const re = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'm');
  if (!re.test(pubspec)) {
    console.error(`pubspec.yaml is missing the assets sentinel markers (${startMarker} / ${endMarker}). Restore the skeleton.`);
    process.exit(1);
  }
  pubspec = pubspec.replace(re, block);
  fs.writeFileSync(PUBSPEC, pubspec);

  console.log(`Built Flutter package`);
  console.log(`  logos copied:    ${manifest.logos.length}`);
  console.log(`  catalog.g.dart:  ${path.relative(REPO, CATALOG_FILE)}`);
  console.log(`  assets:          ${path.relative(REPO, ASSETS_DIR)}`);
  console.log(`  version:         ${manifest.version}`);
}

main();
