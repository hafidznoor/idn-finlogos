// Build the publishable dist/ tarball from icons/ + data/.
//
//   dist/icons/<slug>.svg     optimized vector
//   dist/icons/<slug>.mjs     ESM default export: SVG string
//   dist/icons/<slug>.js      CJS module.exports: SVG string
//   dist/icons/<slug>.d.ts    TypeScript declaration
//   dist/manifest.json        { version, license, count, categories, logos[] }
//   dist/categories.json
//   dist/index.mjs            ESM: listLogos / getLogo / getLogoUrl / getCategories / VERSION
//   dist/index.js             CJS equivalent
//   dist/index.d.ts           types

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { optimize } from 'svgo';
import { loadCatalog, validateCatalog } from './load-catalog.mjs';

const REPO = path.resolve(import.meta.dirname, '..');
const DIST = path.join(REPO, 'dist');
const PKG = JSON.parse(fs.readFileSync(path.join(REPO, 'package.json'), 'utf8'));

async function loadSvgoConfig() {
  const mod = await import(path.join(REPO, '.svgo.config.mjs'));
  return mod.default ?? mod;
}

function rimrafSync(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

function jsStringLiteral(s) {
  // Single-quoted string with backslash-escaping; safer than JSON.stringify for SVG.
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

async function main() {
  const catalog = loadCatalog(REPO);
  const errors = validateCatalog(catalog);
  if (errors.length > 0) {
    console.error(`Refusing to build — ${errors.length} catalog error(s):\n`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }

  const svgoConfig = await loadSvgoConfig();

  rimrafSync(DIST);
  fs.mkdirSync(path.join(DIST, 'icons'), { recursive: true });

  // Mark dist/ as CommonJS so the `.js` twins resolve `require()` correctly,
  // even though the root package.json declares `"type": "module"`. `.mjs`
  // files in this dir remain ESM regardless.
  fs.writeFileSync(
    path.join(DIST, 'package.json'),
    JSON.stringify({ type: 'commonjs' }, null, 2) + '\n'
  );

  let totalRawBytes = 0;
  let totalOptBytes = 0;

  const manifestLogos = [];

  for (const logo of catalog.logos) {
    const src = path.join(catalog.iconsDir, `${logo.slug}.svg`);
    const raw = fs.readFileSync(src, 'utf8');
    totalRawBytes += Buffer.byteLength(raw, 'utf8');

    const result = optimize(raw, { ...svgoConfig, path: src });
    if (result.error) {
      console.error(`SVGO failed for ${logo.slug}: ${result.error}`);
      process.exit(1);
    }
    const optimized = result.data;
    totalOptBytes += Buffer.byteLength(optimized, 'utf8');

    // dist/icons/<slug>.svg
    fs.writeFileSync(path.join(DIST, 'icons', `${logo.slug}.svg`), optimized);

    // dist/icons/<slug>.mjs (ESM)
    fs.writeFileSync(
      path.join(DIST, 'icons', `${logo.slug}.mjs`),
      `export default ${jsStringLiteral(optimized)};\n`
    );

    // dist/icons/<slug>.js (CJS)
    fs.writeFileSync(
      path.join(DIST, 'icons', `${logo.slug}.js`),
      `'use strict';\nmodule.exports = ${jsStringLiteral(optimized)};\n`
    );

    // dist/icons/<slug>.d.ts
    fs.writeFileSync(
      path.join(DIST, 'icons', `${logo.slug}.d.ts`),
      `declare const svg: string;\nexport default svg;\n`
    );

    manifestLogos.push({
      slug: logo.slug,
      name: logo.name,
      category: logo.category,
      aliases: logo.aliases ?? [],
      tags: logo.tags ?? [],
      formats: ['svg'],
      path: `icons/${logo.slug}.svg`
    });
  }

  manifestLogos.sort((a, b) => a.slug.localeCompare(b.slug));

  // Aggregate category counts.
  const categoriesOut = {};
  for (const [slug, meta] of Object.entries(catalog.categories)) {
    categoriesOut[slug] = {
      displayName: meta.displayName,
      count: manifestLogos.filter((l) => l.category === slug).length
    };
  }

  const manifest = {
    name: PKG.name,
    version: PKG.version,
    license: 'CC-BY-NC-4.0 (assets); MIT (code)',
    count: manifestLogos.length,
    generatedAt: new Date().toISOString(),
    categories: categoriesOut,
    logos: manifestLogos
  };

  fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(DIST, 'categories.json'), JSON.stringify(categoriesOut, null, 2));

  // Inline manifest as a JS literal so the helper modules don't depend on
  // JSON-import syntax (which differs across Node versions and bundlers).
  const inlineManifest = `const manifest = ${JSON.stringify(manifest)};`;

  // dist/index.mjs — public ESM helper surface.
  fs.writeFileSync(
    path.join(DIST, 'index.mjs'),
    `${inlineManifest}

export const VERSION = manifest.version;
export const PACKAGE_NAME = manifest.name;

export function listLogos(filter = {}) {
  const { category, search } = filter;
  const q = search ? String(search).toLowerCase() : null;
  return manifest.logos.filter((l) => {
    if (category && l.category !== category) return false;
    if (q) {
      const hay = (l.name + ' ' + l.slug + ' ' + (l.aliases || []).join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function getCategories() {
  return Object.entries(manifest.categories).map(([slug, meta]) => ({ slug, ...meta }));
}

export async function getLogo(slug) {
  const meta = manifest.logos.find((l) => l.slug === slug);
  if (!meta) return null;
  const { default: svg } = await import(\`./icons/\${slug}.mjs\`);
  return { ...meta, svg };
}

const CDN_BASES = {
  jsdelivr: (v) => \`https://cdn.jsdelivr.net/npm/\${manifest.name}@\${v}\`,
  unpkg: (v) => \`https://unpkg.com/\${manifest.name}@\${v}\`
};

export function getLogoUrl(slug, opts = {}) {
  const { cdn = 'jsdelivr', version = manifest.version } = opts;
  const base = CDN_BASES[cdn];
  if (!base) throw new Error(\`Unknown cdn "\${cdn}". Use 'jsdelivr' or 'unpkg'.\`);
  return \`\${base(version)}/dist/icons/\${slug}.svg\`;
}

export default { VERSION, PACKAGE_NAME, listLogos, getCategories, getLogo, getLogoUrl };
`
  );

  // dist/index.js — CJS twin.
  fs.writeFileSync(
    path.join(DIST, 'index.js'),
    `'use strict';
${inlineManifest}

const VERSION = manifest.version;
const PACKAGE_NAME = manifest.name;

function listLogos(filter = {}) {
  const { category, search } = filter;
  const q = search ? String(search).toLowerCase() : null;
  return manifest.logos.filter((l) => {
    if (category && l.category !== category) return false;
    if (q) {
      const hay = (l.name + ' ' + l.slug + ' ' + (l.aliases || []).join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function getCategories() {
  return Object.entries(manifest.categories).map(([slug, meta]) => Object.assign({ slug }, meta));
}

function getLogo(slug) {
  const meta = manifest.logos.find((l) => l.slug === slug);
  if (!meta) return null;
  const svg = require('./icons/' + slug + '.js');
  return Object.assign({}, meta, { svg });
}

const CDN_BASES = {
  jsdelivr: (v) => 'https://cdn.jsdelivr.net/npm/' + manifest.name + '@' + v,
  unpkg: (v) => 'https://unpkg.com/' + manifest.name + '@' + v
};

function getLogoUrl(slug, opts) {
  opts = opts || {};
  const cdn = opts.cdn || 'jsdelivr';
  const version = opts.version || manifest.version;
  const base = CDN_BASES[cdn];
  if (!base) throw new Error('Unknown cdn "' + cdn + '". Use \\'jsdelivr\\' or \\'unpkg\\'.');
  return base(version) + '/dist/icons/' + slug + '.svg';
}

module.exports = { VERSION, PACKAGE_NAME, listLogos, getCategories, getLogo, getLogoUrl };
`
  );

  // dist/index.d.ts — types.
  fs.writeFileSync(
    path.join(DIST, 'index.d.ts'),
    `export type LogoMeta = {
  slug: string;
  name: string;
  category: string;
  aliases: string[];
  tags: string[];
  formats: Array<'svg'>;
  path: string;
};

export type Category = {
  slug: string;
  displayName: string;
  count: number;
};

export type ListLogosFilter = {
  category?: string;
  search?: string;
};

export type Cdn = 'jsdelivr' | 'unpkg';

export type GetLogoUrlOpts = {
  cdn?: Cdn;
  version?: string;
};

export declare const VERSION: string;
export declare const PACKAGE_NAME: string;

export declare function listLogos(filter?: ListLogosFilter): LogoMeta[];
export declare function getCategories(): Category[];
export declare function getLogo(slug: string): Promise<(LogoMeta & { svg: string }) | null>;
export declare function getLogoUrl(slug: string, opts?: GetLogoUrlOpts): string;

declare const _default: {
  VERSION: typeof VERSION;
  PACKAGE_NAME: typeof PACKAGE_NAME;
  listLogos: typeof listLogos;
  getCategories: typeof getCategories;
  getLogo: typeof getLogo;
  getLogoUrl: typeof getLogoUrl;
};
export default _default;
`
  );

  const fmt = (n) => (n / 1024).toFixed(1) + ' KB';
  console.log(`Built ${manifestLogos.length} logos`);
  console.log(`  raw SVG total:        ${fmt(totalRawBytes)}`);
  console.log(`  optimized SVG total:  ${fmt(totalOptBytes)}  (${((totalOptBytes / totalRawBytes) * 100).toFixed(1)}% of raw)`);
  console.log(`  output:               ${DIST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
