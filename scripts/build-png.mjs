// Render PNG fallbacks for environments that can't display SVG.
//
//   dist/png/<slug>@1x.png    80×80, logo centered on transparent padding
//   dist/png/<slug>@2x.png    160×160
//   dist/png/<slug>@3x.png    240×240
//   dist/png/<slug>@4x.png    320×320
//
// Reads the optimized SVGs from dist/icons/, so `npm run build` must run
// first (build-all.mjs already orders them correctly). Aliases (retired
// slugs) are skipped — PNG is a new surface with no back-compat to keep.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { Resvg } from '@resvg/resvg-js';

const REPO = path.resolve(import.meta.dirname, '..');
const DIST = path.join(REPO, 'dist');
const OUT = path.join(DIST, 'png');

const BASE_SIZE = 80;
const SCALES = [1, 2, 3, 4];

// Re-root the SVG on a square viewBox centered over the original one, so
// every render comes out 1:1 with the artwork letterboxed in transparency.
function squareViewBox(svg, slug) {
  const m = svg.match(/viewBox="([^"]+)"/);
  if (!m) throw new Error(`${slug}: missing viewBox`);
  const [x, y, w, h] = m[1].trim().split(/[\s,]+/).map(Number);
  if (![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) {
    throw new Error(`${slug}: unparseable viewBox "${m[1]}"`);
  }
  const side = Math.max(w, h);
  const vb = `${x - (side - w) / 2} ${y - (side - h) / 2} ${side} ${side}`;
  let out = svg.replace(m[0], `viewBox="${vb}"`);
  // dist SVGs are written without xmlns (browsers inline them fine), but
  // resvg's XML parser requires the namespace on the root element.
  if (!/<svg[^>]*\sxmlns=/.test(out)) {
    out = out.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return out;
}

function main() {
  const manifestPath = path.join(DIST, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('dist/manifest.json not found — run `npm run build` first.');
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  let files = 0;
  let totalBytes = 0;

  for (const logo of manifest.logos) {
    const svgRaw = fs.readFileSync(path.join(DIST, 'icons', `${logo.slug}.svg`), 'utf8');
    const svg = squareViewBox(svgRaw, logo.slug);

    for (const scale of SCALES) {
      const png = new Resvg(svg, {
        fitTo: { mode: 'width', value: BASE_SIZE * scale }
      })
        .render()
        .asPng();
      fs.writeFileSync(path.join(OUT, `${logo.slug}@${scale}x.png`), png);
      files += 1;
      totalBytes += png.length;
    }
  }

  console.log(`Rendered ${files} PNGs for ${manifest.logos.length} logos`);
  console.log(`  sizes:  ${SCALES.map((s) => `${BASE_SIZE * s}×${BASE_SIZE * s}`).join(', ')}`);
  console.log(`  total:  ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  output: ${OUT}`);
}

main();
