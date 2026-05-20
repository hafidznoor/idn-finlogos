// One-time bootstrap: walk a v1 SVG/ tree organized as `<category>/<Name>.svg`,
// produce slug-named copies in `icons/`, and emit `data/logos.yml` +
// `data/categories.yml` as the new source of truth.
//
// Usage: node scripts/bootstrap.mjs --src "/path/to/v1/SVG" [--dry]
//
// Re-running is safe: existing icons/ files are overwritten; logos.yml is
// rewritten from scratch. Collisions abort with a non-zero exit.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';
import { slugify } from './slugify.mjs';

const REPO = path.resolve(import.meta.dirname, '..');

// Manual disambiguation for v1 source files where the default slug rule
// would produce a collision. Resolved with the user during bootstrap.
//
//   aliases: "<v1 category>/<v1 filename>" → forced slug
//   drops:   "<v1 category>/<v1 filename>" → skip entirely (near-duplicate of the kept one)
const OVERRIDES = {
  aliases: {
    'Bank App/Jago.svg': 'jago-app',
    'Bank App/Jenius.svg': 'jenius-app',
    'Direct Debit/OCTO Clicks.svg': 'octo-clicks-direct-debit'
  },
  drops: new Set([
    'Miscellaneous/QRIS.svg',
    'Payment Gateway/DOKU.svg',
    'Miscellaneous/PayPal.svg',
    'Miscellaneous/Western Union.svg'
  ])
};

function parseArgs(argv) {
  const args = { src: null, dry: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--src') args.src = argv[++i];
    else if (argv[i] === '--dry') args.dry = true;
  }
  if (!args.src) {
    console.error('Usage: node scripts/bootstrap.mjs --src "/path/to/v1/SVG" [--dry]');
    process.exit(2);
  }
  return args;
}

function walkCategories(srcRoot) {
  const entries = fs.readdirSync(srcRoot, { withFileTypes: true });
  const categories = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.')) continue;
    const dir = path.join(srcRoot, entry.name);
    const files = fs.readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith('.svg'))
      .sort();
    categories.push({ displayName: entry.name, dir, files });
  }
  return categories;
}

function main() {
  const { src, dry } = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) {
    console.error(`Source not found or not a directory: ${src}`);
    process.exit(2);
  }

  const categories = walkCategories(src);
  if (categories.length === 0) {
    console.error(`No category subdirectories found under ${src}`);
    process.exit(2);
  }

  // Build category records (slug + displayName) and detect category-slug collisions.
  const categoryRecords = [];
  const seenCategorySlugs = new Map();
  for (const cat of categories) {
    const slug = slugify(cat.displayName);
    if (!slug) {
      console.error(`Empty category slug from "${cat.displayName}"`);
      process.exit(1);
    }
    if (seenCategorySlugs.has(slug)) {
      console.error(`Category slug collision: "${cat.displayName}" → "${slug}" already used by "${seenCategorySlugs.get(slug)}"`);
      process.exit(1);
    }
    seenCategorySlugs.set(slug, cat.displayName);
    categoryRecords.push({ slug, displayName: cat.displayName, count: cat.files.length });
  }

  // Build logo records, detect slug collisions.
  const logoRecords = [];
  const slugToFile = new Map(); // slug → "<displayName> (<category>)" — for collision reports
  const collisions = [];
  let dropped = 0;
  let aliased = 0;
  for (const cat of categories) {
    const categorySlug = slugify(cat.displayName);
    for (const file of cat.files) {
      const sourceKey = `${cat.displayName}/${file}`;
      if (OVERRIDES.drops.has(sourceKey)) {
        dropped++;
        continue;
      }
      const displayName = path.basename(file, path.extname(file));
      const defaultSlug = slugify(displayName);
      const slug = OVERRIDES.aliases[sourceKey] ?? defaultSlug;
      if (OVERRIDES.aliases[sourceKey]) aliased++;
      if (!slug) {
        console.error(`Empty slug from "${file}" in "${cat.displayName}"`);
        process.exit(1);
      }
      if (slugToFile.has(slug)) {
        collisions.push({
          slug,
          a: slugToFile.get(slug),
          b: `${displayName} (${cat.displayName})`
        });
        continue;
      }
      slugToFile.set(slug, `${displayName} (${cat.displayName})`);
      logoRecords.push({
        slug,
        name: displayName,
        category: categorySlug,
        sourcePath: path.join(cat.dir, file)
      });
    }
  }

  if (collisions.length > 0) {
    console.error(`\n${collisions.length} slug collision(s) found:\n`);
    for (const c of collisions) {
      console.error(`  ${c.slug}`);
      console.error(`    A: ${c.a}`);
      console.error(`    B: ${c.b}`);
    }
    console.error(`\nResolve by renaming one of the source files (or curating data/logos.yml after bootstrap) and re-run.`);
    process.exit(1);
  }

  logoRecords.sort((a, b) => a.slug.localeCompare(b.slug));

  // Print preview.
  console.log(`Source:     ${src}`);
  console.log(`Categories: ${categoryRecords.length}`);
  console.log(`Logos:      ${logoRecords.length}`);
  console.log(`Aliased:    ${aliased} (manually re-slugged via OVERRIDES.aliases)`);
  console.log(`Dropped:    ${dropped} (skipped via OVERRIDES.drops)`);
  console.log(`Dry run:    ${dry ? 'yes' : 'no'}`);
  console.log('');
  console.log('Categories by count:');
  for (const c of categoryRecords.sort((a, b) => b.count - a.count)) {
    console.log(`  ${c.slug.padEnd(20)} ${String(c.count).padStart(4)}  (${c.displayName})`);
  }

  if (dry) {
    console.log('\nDry run — no files written.');
    return;
  }

  // Copy SVGs to icons/<slug>.svg.
  const iconsDir = path.join(REPO, 'icons');
  fs.mkdirSync(iconsDir, { recursive: true });
  for (const logo of logoRecords) {
    const dest = path.join(iconsDir, `${logo.slug}.svg`);
    fs.copyFileSync(logo.sourcePath, dest);
  }

  // Emit data/logos.yml.
  const dataDir = path.join(REPO, 'data');
  fs.mkdirSync(dataDir, { recursive: true });

  const logosYaml = yaml.dump(
    logoRecords.map((l) => ({
      slug: l.slug,
      name: l.name,
      category: l.category
    })),
    { lineWidth: 120, noRefs: true }
  );
  fs.writeFileSync(
    path.join(dataDir, 'logos.yml'),
    `# Source of truth for the logo catalog.\n` +
      `# Each entry: { slug, name (display), category, aliases? (string[]), tags? (string[]) }\n` +
      `# Bootstrapped from v1 ${path.basename(src)} on ${new Date().toISOString().slice(0, 10)}.\n` +
      `# Hand-curate display names + add aliases as needed; CI validates icons/ ↔ this file.\n\n` +
      logosYaml
  );

  // Emit data/categories.yml.
  const categoriesYaml = yaml.dump(
    Object.fromEntries(
      categoryRecords
        .sort((a, b) => a.slug.localeCompare(b.slug))
        .map((c) => [c.slug, { displayName: c.displayName }])
    ),
    { lineWidth: 120, noRefs: true }
  );
  fs.writeFileSync(
    path.join(dataDir, 'categories.yml'),
    `# Category slug → display metadata.\n` +
      `# Bootstrapped on ${new Date().toISOString().slice(0, 10)}.\n\n` +
      categoriesYaml
  );

  console.log(`\nWrote ${logoRecords.length} SVGs to icons/`);
  console.log(`Wrote data/logos.yml (${logoRecords.length} entries)`);
  console.log(`Wrote data/categories.yml (${categoryRecords.length} entries)`);
}

main();
