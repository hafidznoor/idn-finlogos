// Generates the Android library sources from dist/manifest.json + dist/icons/.
// Must run AFTER scripts/build.mjs has produced dist/.
//
//   platforms/android/library/src/main/assets/idn-finlogos/<slug>.svg   (copied)
//   platforms/android/library/src/main/kotlin/.../Catalog.kt            (generated)
//   platforms/android/gradle.properties                                 (VERSION updated)

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const REPO = path.resolve(import.meta.dirname, '..');
const DIST = path.join(REPO, 'dist');
const MANIFEST_PATH = path.join(DIST, 'manifest.json');
const ANDROID_ROOT = path.join(REPO, 'platforms', 'android');
const LIB_ROOT = path.join(ANDROID_ROOT, 'library');
const ASSETS_DIR = path.join(LIB_ROOT, 'src', 'main', 'assets', 'idn-finlogos');
const KOTLIN_DIR = path.join(LIB_ROOT, 'src', 'main', 'kotlin', 'com', 'hafidznoor', 'idnfinlogos');
const GRADLE_PROPS = path.join(ANDROID_ROOT, 'gradle.properties');

function rimrafSync(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

// Kotlin/Java string escape. Strings in source: backslash, double-quote, dollar (template), control chars.
function kt(s) {
  return '"' + String(s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t') + '"';
}

function ktList(items) {
  if (items.length === 0) return 'emptyList()';
  return 'listOf(' + items.map(kt).join(', ') + ')';
}

function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Missing ${MANIFEST_PATH}. Run \`npm run build\` first.`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  // Reset asset directory to drop any stale files.
  rimrafSync(ASSETS_DIR);
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  fs.mkdirSync(KOTLIN_DIR, { recursive: true });

  // Copy all SVGs from dist/icons/.
  for (const logo of manifest.logos) {
    fs.copyFileSync(
      path.join(DIST, 'icons', `${logo.slug}.svg`),
      path.join(ASSETS_DIR, `${logo.slug}.svg`)
    );
  }

  // Generate Catalog.kt — the data, immutable.
  const categoriesSorted = Object.entries(manifest.categories)
    .map(([slug, meta]) => ({ slug, displayName: meta.displayName, count: meta.count }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const lines = [];
  lines.push('// Generated file — do not edit by hand.');
  lines.push('// Source: data/logos.yml. Regenerate via `npm run build:android`.');
  lines.push('//');
  lines.push('// Logo SVGs are licensed CC-BY-NC-4.0 (see LICENSE-ASSETS at repo root).');
  lines.push('// This Kotlin code is licensed MIT (see LICENSE at repo root).');
  lines.push('');
  lines.push('package com.hafidznoor.idnfinlogos');
  lines.push('');
  lines.push('internal object Catalog {');
  lines.push(`    const val VERSION: String = ${kt(manifest.version)}`);
  lines.push('');
  lines.push('    val LOGOS: List<LogoMeta> = listOf(');
  for (const logo of manifest.logos) {
    const aliases = ktList(logo.aliases ?? []);
    const tags = ktList(logo.tags ?? []);
    lines.push(
      `        LogoMeta(slug=${kt(logo.slug)}, name=${kt(logo.name)}, ` +
      `category=${kt(logo.category)}, aliases=${aliases}, tags=${tags}, ` +
      `assetPath=${kt(`idn-finlogos/${logo.slug}.svg`)}),`
    );
  }
  lines.push('    )');
  lines.push('');
  lines.push('    val CATEGORIES: List<Category> = listOf(');
  for (const c of categoriesSorted) {
    lines.push(`        Category(slug=${kt(c.slug)}, displayName=${kt(c.displayName)}, count=${c.count}),`);
  }
  lines.push('    )');
  lines.push('}');
  lines.push('');

  fs.writeFileSync(path.join(KOTLIN_DIR, 'Catalog.kt'), lines.join('\n'));

  // Update gradle.properties VERSION_NAME to match npm version.
  let gradleProps = fs.existsSync(GRADLE_PROPS)
    ? fs.readFileSync(GRADLE_PROPS, 'utf8')
    : '';

  const versionLine = `VERSION_NAME=${manifest.version}`;
  if (/^VERSION_NAME=.*/m.test(gradleProps)) {
    gradleProps = gradleProps.replace(/^VERSION_NAME=.*$/m, versionLine);
  } else {
    gradleProps = (gradleProps.trim() + '\n' + versionLine + '\n').replace(/^\n+/, '');
  }
  fs.writeFileSync(GRADLE_PROPS, gradleProps);

  console.log(`Built Android library`);
  console.log(`  logos copied:    ${manifest.logos.length}`);
  console.log(`  Catalog.kt:      ${path.relative(REPO, path.join(KOTLIN_DIR, 'Catalog.kt'))}`);
  console.log(`  assets:          ${path.relative(REPO, ASSETS_DIR)}`);
  console.log(`  version:         ${manifest.version}`);
}

main();
