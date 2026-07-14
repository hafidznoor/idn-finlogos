#!/usr/bin/env node
// idn-finlogos CLI — download Indonesian financial logos from the terminal.
//
//   idn-finlogos download bca                 -> ./bca.svg
//   idn-finlogos download gopay ovo dana       -> multiple SVGs
//   idn-finlogos download bca --format png --scale 2 --out ./assets
//   idn-finlogos list --category e-wallet
//   idn-finlogos search mandiri
//   idn-finlogos info "Bank Rakyat Indonesia"
//   idn-finlogos categories
//
// Thin CDN client: fetches dist/manifest.json and the logo bytes from
// jsdelivr/unpkg at runtime (Node's global fetch). No runtime dependencies.
// Only downloads logos present in a *published* version (defaults to this
// CLI's own version; override with --pkg-version).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// terminal styling — hand-rolled ANSI so we stay dependency-free.
// Colors switch off automatically when output isn't a TTY (piped) or when the
// standard NO_COLOR / TERM=dumb signals are set; FORCE_COLOR overrides.
// ---------------------------------------------------------------------------

const COLOR = (() => {
  if (process.env.NO_COLOR != null && process.env.NO_COLOR !== '') return false;
  if (process.env.FORCE_COLOR != null && process.env.FORCE_COLOR !== '') return true;
  return Boolean(process.stdout.isTTY) && process.env.TERM !== 'dumb';
})();

const wrap = (open, close) => (s) => (COLOR ? `\x1b[${open}m${s}\x1b[${close}m` : String(s));
const style = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  magenta: wrap(35, 39),
  cyan: wrap(36, 39)
};

// Visible length ignoring ANSI escape codes — needed to pad/align colored text.
const visibleLen = (s) => String(s).replace(/\x1b\[[0-9;]*m/g, '').length;

// ---------------------------------------------------------------------------
// small utilities
// ---------------------------------------------------------------------------

// Mirrors scripts/slugify.mjs — keep in sync.
function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[()]/g, ' ')
    .replace(/[‘’‛'`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readOwnVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'package.json'), 'utf8'));
    return pkg.version;
  } catch {
    return 'latest';
  }
}

const CDN_BASES = {
  jsdelivr: (v) => `https://cdn.jsdelivr.net/npm/idn-finlogos@${v}`,
  unpkg: (v) => `https://unpkg.com/idn-finlogos@${v}`
};

function cdnBase(cdn, version) {
  const base = CDN_BASES[cdn];
  if (!base) throw new UserError(`Unknown --cdn "${cdn}". Use 'jsdelivr' or 'unpkg'.`);
  return base(version);
}

// Add the SVG namespace back: dist SVGs are stripped of xmlns (browsers inline
// them fine), but a downloaded standalone .svg needs it to open on its own.
// Same fix as scripts/build-png.mjs.
function ensureXmlns(svg) {
  if (/<svg[^>]*\sxmlns=/.test(svg)) return svg;
  return svg.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// Prefer a short cwd-relative path, but fall back to absolute when the target
// sits outside the cwd (avoids an unreadable "../../../.." chain).
function displayPath(p) {
  const rel = path.relative(process.cwd(), p);
  return rel && !rel.startsWith('..') ? rel : p;
}

// Thrown for expected, user-facing errors (bad flags, unresolved logos, network
// failures) — printed without a stack trace.
class UserError extends Error {}

// ---------------------------------------------------------------------------
// manifest fetching (with a small tmp cache keyed by cdn+version)
// ---------------------------------------------------------------------------

function cachePath(cdn, version) {
  return path.join(os.tmpdir(), 'idn-finlogos-cli', `${cdn}-${version}.json`);
}

async function fetchManifest({ cdn, version }) {
  const cache = cachePath(cdn, version);
  // A pinned version's manifest is immutable, so any cached copy is reusable.
  // Skip the cache for floating tags like "latest".
  if (version !== 'latest') {
    try {
      return JSON.parse(fs.readFileSync(cache, 'utf8'));
    } catch {
      /* cache miss — fall through to network */
    }
  }

  const url = `${cdnBase(cdn, version)}/dist/manifest.json`;
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new UserError(`Could not reach ${cdn} (${url}).\n  ${err.message}\n  Check your network connection.`);
  }
  if (!res.ok) {
    throw new UserError(
      `Failed to fetch the logo manifest (HTTP ${res.status}) from:\n  ${url}\n` +
        `Is version "${version}" published? Try --pkg-version <a published version>.`
    );
  }
  const manifest = await res.json();

  if (version !== 'latest') {
    try {
      fs.mkdirSync(path.dirname(cache), { recursive: true });
      fs.writeFileSync(cache, JSON.stringify(manifest));
    } catch {
      /* caching is best-effort */
    }
  }
  return manifest;
}

// ---------------------------------------------------------------------------
// resolution — mirrors resolveMeta() in the generated dist/index.mjs
// ---------------------------------------------------------------------------

// Accepts a slug, a retired slug (alias), or a brand name in any casing —
// e.g. 'bri', 'bri-new', 'BRI', 'Bank Rakyat Indonesia'.
function resolveMeta(manifest, input) {
  if (input == null) return null;
  const raw = String(input);
  const logos = manifest.logos;
  const direct =
    logos.find((l) => l.slug === raw) ||
    logos.find((l) => (l.aliases || []).includes(raw));
  if (direct) return direct;
  const q = raw.trim().toLowerCase();
  const byName = logos.find((l) => l.name.toLowerCase() === q);
  if (byName) return byName;
  const s = slugify(raw);
  if (!s) return null;
  return (
    logos.find((l) => l.slug === s) ||
    logos.find((l) => (l.aliases || []).includes(s)) ||
    logos.find((l) => slugify(l.name) === s) ||
    null
  );
}

// Fuzzy substring matches to suggest when a query doesn't resolve.
function suggest(manifest, input, limit = 8) {
  const q = String(input).trim().toLowerCase();
  if (!q) return [];
  const matches = manifest.logos.filter((l) => {
    const hay = `${l.name} ${l.slug} ${(l.aliases || []).join(' ')}`.toLowerCase();
    return hay.includes(q);
  });
  return matches.slice(0, limit);
}

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------

const HELP = `idn-finlogos — download Indonesian financial logos from the terminal

Usage:
  idn-finlogos download <query...> [options]   Download logo file(s)
  idn-finlogos list [options]                  List logos
  idn-finlogos search <query>                  Search logos by name/slug/alias
  idn-finlogos info <query>                    Show a logo's metadata and URLs
  idn-finlogos categories                      List categories with counts

Download options:
  --format <svg|png>   Output format (default: svg)
  --scale <1|2|3|4>    PNG scale, @Nx (default: 1; ignored for svg)
  --out <dir>          Output directory (default: current directory)

Common options:
  --cdn <jsdelivr|unpkg>   CDN to fetch from (default: jsdelivr)
  --pkg-version <version>  idn-finlogos version to fetch (default: this CLI's)
  --category <slug>        Filter (list only)
  --search <query>         Filter (list only)
  --json                   Machine-readable output (list/search/info/categories)
  -h, --help               Show this help
  -V, --version            Show the CLI version

Queries accept a slug, a retired slug, or the brand name in any casing:
  idn-finlogos download bca
  idn-finlogos download "Bank Rakyat Indonesia" gopay ovo
  idn-finlogos download dana --format png --scale 3 --out ./assets

Logos are fetched from the CDN, so a network connection is required and only
published logos are available.`;

async function cmdDownload(queries, opts) {
  if (queries.length === 0) {
    throw new UserError('download needs at least one logo, e.g. `idn-finlogos download bca`.');
  }

  const format = opts.format ?? 'svg';
  if (format !== 'svg' && format !== 'png') {
    throw new UserError(`Unknown --format "${format}". Use 'svg' or 'png'.`);
  }
  const scale = opts.scale ?? '1';
  if (format === 'png' && !['1', '2', '3', '4'].includes(String(scale))) {
    throw new UserError(`Unknown --scale "${scale}". Use 1, 2, 3, or 4.`);
  }

  const outDir = path.resolve(opts.out ?? process.cwd());
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = await fetchManifest(opts);
  const base = cdnBase(opts.cdn, opts.version);

  let failures = 0;
  for (const query of queries) {
    const meta = resolveMeta(manifest, query);
    if (!meta) {
      failures++;
      process.stderr.write(`✗ "${query}" — no matching logo.\n`);
      const hints = suggest(manifest, query);
      if (hints.length) {
        process.stderr.write(
          `  Did you mean: ${hints.map((h) => h.slug).join(', ')}\n`
        );
      }
      continue;
    }

    const isPng = format === 'png';
    const fileName = isPng ? `${meta.slug}@${scale}x.png` : `${meta.slug}.svg`;
    const url = isPng
      ? `${base}/dist/png/${meta.slug}@${scale}x.png`
      : `${base}/dist/icons/${meta.slug}.svg`;

    let res;
    try {
      res = await fetch(url);
    } catch (err) {
      failures++;
      process.stderr.write(`✗ "${query}" — network error: ${err.message}\n`);
      continue;
    }
    if (!res.ok) {
      failures++;
      process.stderr.write(
        `✗ "${query}" (${meta.slug}) — HTTP ${res.status} fetching ${url}\n` +
          `  This format may not exist for version "${opts.version}".\n`
      );
      continue;
    }

    const outPath = path.join(outDir, fileName);
    let bytes;
    if (isPng) {
      bytes = Buffer.from(await res.arrayBuffer());
    } else {
      bytes = Buffer.from(ensureXmlns(await res.text()), 'utf8');
    }
    fs.writeFileSync(outPath, bytes);
    process.stdout.write(`✓ ${displayPath(outPath)} (${humanSize(bytes.length)})\n`);
  }

  if (failures > 0) process.exitCode = 1;
}

async function cmdList(opts) {
  const manifest = await fetchManifest(opts);
  let logos = manifest.logos;
  if (opts.category) {
    logos = logos.filter((l) => l.category === opts.category);
  }
  if (opts.search) {
    const q = String(opts.search).toLowerCase();
    logos = logos.filter((l) => {
      const hay = `${l.name} ${l.slug} ${(l.aliases || []).join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }

  if (opts.json) {
    process.stdout.write(JSON.stringify(logos, null, 2) + '\n');
    return;
  }

  if (logos.length === 0) {
    process.stdout.write('No logos match.\n');
    return;
  }

  const slugW = Math.max(...logos.map((l) => l.slug.length), 4);
  const nameW = Math.max(...logos.map((l) => l.name.length), 4);
  const pad = (s, w) => String(s).padEnd(w);
  process.stdout.write(`${pad('SLUG', slugW)}  ${pad('NAME', nameW)}  CATEGORY\n`);
  for (const l of logos) {
    process.stdout.write(`${pad(l.slug, slugW)}  ${pad(l.name, nameW)}  ${l.category}\n`);
  }
  process.stdout.write(`\n${logos.length} logo${logos.length === 1 ? '' : 's'}.\n`);
}

async function cmdCategories(opts) {
  const manifest = await fetchManifest(opts);
  const entries = Object.entries(manifest.categories).map(([slug, meta]) => ({
    slug,
    displayName: meta.displayName,
    count: meta.count
  }));
  entries.sort((a, b) => a.slug.localeCompare(b.slug));

  if (opts.json) {
    process.stdout.write(JSON.stringify(entries, null, 2) + '\n');
    return;
  }

  const slugW = Math.max(...entries.map((e) => e.slug.length), 4);
  const nameW = Math.max(...entries.map((e) => e.displayName.length), 12);
  const pad = (s, w) => String(s).padEnd(w);
  process.stdout.write(`${pad('SLUG', slugW)}  ${pad('DISPLAY NAME', nameW)}  COUNT\n`);
  for (const e of entries) {
    process.stdout.write(`${pad(e.slug, slugW)}  ${pad(e.displayName, nameW)}  ${e.count}\n`);
  }
}

async function cmdInfo(query, opts) {
  if (!query) throw new UserError('info needs a logo, e.g. `idn-finlogos info bca`.');
  const manifest = await fetchManifest(opts);
  const meta = resolveMeta(manifest, query);
  if (!meta) {
    const hints = suggest(manifest, query);
    let msg = `No matching logo for "${query}".`;
    if (hints.length) msg += `\nDid you mean: ${hints.map((h) => h.slug).join(', ')}`;
    throw new UserError(msg);
  }

  const v = opts.version;
  const urls = {
    svg: {
      jsdelivr: `${CDN_BASES.jsdelivr(v)}/dist/icons/${meta.slug}.svg`,
      unpkg: `${CDN_BASES.unpkg(v)}/dist/icons/${meta.slug}.svg`
    },
    png: {
      jsdelivr: `${CDN_BASES.jsdelivr(v)}/dist/png/${meta.slug}@2x.png`,
      unpkg: `${CDN_BASES.unpkg(v)}/dist/png/${meta.slug}@2x.png`
    }
  };

  if (opts.json) {
    process.stdout.write(JSON.stringify({ ...meta, urls }, null, 2) + '\n');
    return;
  }

  const cat = manifest.categories[meta.category];
  process.stdout.write(`${meta.name}\n`);
  process.stdout.write(`  slug:      ${meta.slug}\n`);
  process.stdout.write(`  category:  ${meta.category}${cat ? ` (${cat.displayName})` : ''}\n`);
  if (meta.aliases && meta.aliases.length) {
    process.stdout.write(`  aliases:   ${meta.aliases.join(', ')}\n`);
  }
  if (meta.tags && meta.tags.length) {
    process.stdout.write(`  tags:      ${meta.tags.join(', ')}\n`);
  }
  process.stdout.write(`  svg:       ${urls.svg.jsdelivr}\n`);
  process.stdout.write(`  png @2x:   ${urls.png.jsdelivr}\n`);
  process.stdout.write(`\nDownload it:\n  idn-finlogos download ${meta.slug}\n`);
}

// ASCII wordmark for the welcome banner (figlet "Standard" font, 58 cols wide).
// Static so it carries no dependency; backslashes are escaped for the string.
const BANNER = [
  '  _     _              __ _       _',
  ' (_) __| |_ __        / _(_)_ __ | | ___   __ _  ___  ___',
  " | |/ _` | '_ \\ _____| |_| | '_ \\| |/ _ \\ / _` |/ _ \\/ __|",
  ' | | (_| | | | |_____|  _| | | | | | (_) | (_| | (_) \\__ \\',
  ' |_|\\__,_|_| |_|     |_| |_|_| |_|_|\\___/ \\__, |\\___/|___/',
  '                                          |___/'
];

// Welcome dashboard shown on a bare `idn-finlogos` invocation: banner, live
// library stats, the command menu, and quick-start examples.
async function cmdWelcome(opts) {
  const out = [];
  const line = (s = '') => out.push(s);

  // --- banner box (ASCII-only content so width math stays exact) ---
  const IW = 60; // inner content width
  const border = (chars) => style.dim(chars);
  const bline = (content) => {
    const gap = Math.max(0, IW - visibleLen(content));
    return `${border('│')} ${content}${' '.repeat(gap)} ${border('│')}`;
  };
  line();
  line(border('╭' + '─'.repeat(IW + 2) + '╮'));
  for (const b of BANNER) {
    line(bline(style.bold(style.cyan(b))));
  }
  line(bline(''));
  const tagline = style.dim('Indonesian financial logos, right in your terminal.');
  const ver = style.dim(`v${opts.version}`);
  const taglineGap = ' '.repeat(Math.max(1, IW - visibleLen(tagline) - visibleLen(ver)));
  line(bline(tagline + taglineGap + ver));
  line(border('╰' + '─'.repeat(IW + 2) + '╯'));

  // --- library stats (falls back gracefully when offline) ---
  let manifest = null;
  try {
    manifest = await fetchManifest(opts);
  } catch {
    /* offline — render the rest without live stats */
  }

  line();
  line(`  📊  ${style.bold('LIBRARY')}`);
  line();
  if (manifest) {
    const cats = Object.entries(manifest.categories)
      .map(([slug, m]) => ({ slug, displayName: m.displayName, count: m.count }))
      .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
    const totalCats = cats.length;

    line(
      `      ${style.bold(String(manifest.count))} logos   ${style.dim('·')}   ` +
        `${style.bold(String(totalCats))} categories   ${style.dim('·')}   ` +
        `SVG ${style.dim('+')} PNG ${style.dim('(@1x–4x)')}`
    );
    line();

    const top = cats.slice(0, 6);
    const nameW = Math.max(...top.map((c) => c.displayName.length));
    const maxCount = top[0].count || 1;
    const BARW = 22;
    for (const c of top) {
      const filled = Math.max(1, Math.round((c.count / maxCount) * BARW));
      const bar = style.cyan('█'.repeat(filled)) + style.dim('░'.repeat(BARW - filled));
      line(`      ${c.displayName.padEnd(nameW)}  ${bar}  ${style.bold(String(c.count))}`);
    }
    if (totalCats > top.length) {
      line(`      ${style.dim(`+ ${totalCats - top.length} more categories`)}`);
    }
  } else {
    line(`      ${style.yellow('Stats unavailable')} ${style.dim('— could not reach the CDN. Check your connection.')}`);
  }

  // --- command menu ---
  line();
  line(`  ⚡  ${style.bold('COMMANDS')}`);
  line();
  const cmds = [
    ['download <query…>', 'Save logo file(s) as SVG or PNG'],
    ['list', 'Browse the full catalog'],
    ['search <query>', 'Find logos by name, slug, or alias'],
    ['info <query>', "Show a logo's metadata and CDN URLs"],
    ['categories', 'List all categories with counts']
  ];
  const cmdW = Math.max(...cmds.map((c) => c[0].length));
  for (const [name, desc] of cmds) {
    line(`      ${style.green(name.padEnd(cmdW))}   ${style.dim(desc)}`);
  }

  // --- quick start ---
  line();
  line(`  🚀  ${style.bold('GET STARTED')}`);
  line();
  const examples = [
    'idn-finlogos download bca',
    'idn-finlogos download gopay ovo dana --format png --scale 2',
    'idn-finlogos search mandiri'
  ];
  for (const ex of examples) {
    line(`      ${style.dim('$')} ${style.cyan(ex)}`);
  }

  line();
  line(
    `  ${style.dim('Run')} ${style.bold('idn-finlogos --help')} ${style.dim('for all options')}   ${style.dim('·')}   ` +
      `${style.dim('github.com/hafidznoor/idn-finlogos')}`
  );
  line();

  process.stdout.write(out.join('\n') + '\n');
}

// ---------------------------------------------------------------------------
// arg parsing + dispatch
// ---------------------------------------------------------------------------

const COMMANDS = new Set(['download', 'list', 'search', 'info', 'categories']);

async function main(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'V' },
      format: { type: 'string' },
      scale: { type: 'string' },
      out: { type: 'string' },
      cdn: { type: 'string', default: 'jsdelivr' },
      'pkg-version': { type: 'string' },
      category: { type: 'string' },
      search: { type: 'string' },
      json: { type: 'boolean' }
    }
  });

  if (values.version && positionals.length === 0) {
    process.stdout.write(`${readOwnVersion()}\n`);
    return;
  }
  if (values.help) {
    process.stdout.write(HELP + '\n');
    return;
  }

  const welcomeOpts = {
    cdn: values.cdn,
    version: values['pkg-version'] ?? readOwnVersion()
  };
  if (positionals.length === 0) {
    await cmdWelcome(welcomeOpts);
    return;
  }

  const [command, ...rest] = positionals;

  // Bare `idn-finlogos bca` is treated as `download bca`.
  const isKnown = COMMANDS.has(command);
  const cmd = isKnown ? command : 'download';
  const args = isKnown ? rest : positionals;

  const opts = {
    format: values.format,
    scale: values.scale,
    out: values.out,
    cdn: values.cdn,
    version: values['pkg-version'] ?? readOwnVersion(),
    category: values.category,
    search: values.search,
    json: values.json
  };

  switch (cmd) {
    case 'download':
      await cmdDownload(args, opts);
      break;
    case 'list':
      await cmdList(opts);
      break;
    case 'search':
      if (args.length === 0) throw new UserError('search needs a query, e.g. `idn-finlogos search bca`.');
      await cmdList({ ...opts, search: args.join(' ') });
      break;
    case 'info':
      await cmdInfo(args[0], opts);
      break;
    case 'categories':
      await cmdCategories(opts);
      break;
    default:
      process.stderr.write(`Unknown command "${command}".\n\n${HELP}\n`);
      process.exitCode = 1;
  }
}

main(process.argv.slice(2)).catch((err) => {
  if (err instanceof UserError) {
    process.stderr.write(`${err.message}\n`);
    process.exitCode = 1;
  } else {
    process.stderr.write(`Unexpected error: ${err && err.stack ? err.stack : err}\n`);
    process.exitCode = 1;
  }
});
