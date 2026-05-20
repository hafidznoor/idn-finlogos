// One-shot: walk the v1 SVG/ tree (passed as --src) and the v2 data/logos.yml,
// emit MIGRATION.md with a full mapping table. Apply the same OVERRIDES that
// bootstrap.mjs used so dropped/aliased entries are labeled accurately.
//
// Usage: node scripts/generate-migration.mjs --src "/path/to/v1/SVG"

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';
import { slugify } from './slugify.mjs';

const REPO = path.resolve(import.meta.dirname, '..');

// Keep in sync with scripts/bootstrap.mjs OVERRIDES.
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
  const args = { src: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--src') args.src = argv[++i];
  }
  if (!args.src) {
    console.error('Usage: node scripts/generate-migration.mjs --src "/path/to/v1/SVG"');
    process.exit(2);
  }
  return args;
}

function main() {
  const { src } = parseArgs(process.argv.slice(2));

  const v2logos = yaml.load(fs.readFileSync(path.join(REPO, 'data', 'logos.yml'), 'utf8'));
  const v2slugs = new Set(v2logos.map((l) => l.slug));

  const rows = [];
  for (const category of fs.readdirSync(src).sort()) {
    const dir = path.join(src, category);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()) {
      const sourceKey = `${category}/${file}`;
      const displayName = path.basename(file, '.svg');
      let v2slug, status;
      if (OVERRIDES.drops.has(sourceKey)) {
        v2slug = '—';
        status = 'dropped (near-duplicate of canonical entry)';
      } else if (OVERRIDES.aliases[sourceKey]) {
        v2slug = OVERRIDES.aliases[sourceKey];
        status = 'aliased (collision-disambiguated)';
      } else {
        v2slug = slugify(displayName);
        status = v2slugs.has(v2slug) ? '' : 'MISSING — investigate';
      }
      rows.push({ category, file, displayName, v2slug, status });
    }
  }

  const dropCount = rows.filter((r) => r.status.startsWith('dropped')).length;
  const aliasCount = rows.filter((r) => r.status.startsWith('aliased')).length;
  const total = rows.length;
  const kept = total - dropCount;

  let md = `# Migration from v1 (\`indo-financial-logolibrary\`) to v2 (\`@hafidznoor/idn-finlogos\`)

## tl;dr

| | v1 | v2 |
|---|---|---|
| Registry | GitHub Packages (auth required) | Public npm (no auth) |
| Install | \`npm i indo-financial-logolibrary\` | \`npm i @hafidznoor/idn-finlogos\` |
| Browser bundlers | Broken (uses Node \`fs\` at runtime) | Works (per-logo ESM imports, tree-shakeable) |
| Filenames | Spaces, parens (\`BCA Digital.svg\`) | Kebab-case slugs (\`bca-digital\`) |
| Access pattern | \`bankLogo.SVG['Bank Logo']['BCA']\` → path | \`import bca from '@hafidznoor/idn-finlogos/icons/bca'\` → SVG string |
| Categories | Folders | Metadata (\`listLogos({ category })\`) |
| PNG variants | x1, x2, x3, x4, Large baked in | Dropped — use a CDN image transform or rasterize yourself |
| License | Conflicting (MIT vs CC-BY-NC-4.0) | Dual-licensed: MIT (code) + CC-BY-NC-4.0 (assets) |
| TypeScript | None | First-class \`.d.ts\` bundled |
| CDN | None | jsDelivr + unpkg |

## Code changes

**v1**
\`\`\`js
const bankLogo = require('indo-financial-logolibrary');
const path = bankLogo.SVG['Bank Logo']['BCA'];   // path string on disk
\`\`\`

**v2** — pick one:
\`\`\`js
// (a) Inline SVG string (recommended)
import bca from '@hafidznoor/idn-finlogos/icons/bca';
element.innerHTML = bca;

// (b) URL-style (your bundler hashes it)
import bcaUrl from '@hafidznoor/idn-finlogos/icons/bca.svg';
<img src={bcaUrl} />

// (c) Dynamic
import { getLogo } from '@hafidznoor/idn-finlogos';
const { svg } = await getLogo('bca');

// (d) CDN — no install
<img src="https://cdn.jsdelivr.net/npm/@hafidznoor/idn-finlogos@2/dist/icons/bca.svg" />
\`\`\`

## Categories: v1 → v2 slugs

| v1 folder | v2 category slug |
|---|---|
| \`Bank App\` | \`bank-app\` |
| \`Bank Logo\` | \`bank-logo\` |
| \`Card Payment\` | \`card-payment\` |
| \`Direct Debit\` | \`direct-debit\` |
| \`Donation\` | \`donation\` |
| \`E-Commerce\` | \`e-commerce\` |
| \`E-Wallet\` | \`e-wallet\` |
| \`Entertainment\` | \`entertainment\` |
| \`Financing\` | \`financing\` |
| \`Game\` | \`game\` |
| \`Government\` | \`government\` |
| \`ISP\` | \`isp\` |
| \`Logistic\` | \`logistic\` |
| \`Miscellaneous\` | \`miscellaneous\` |
| \`Mobile Telco\` | \`mobile-telco\` |
| \`Payment Gateway\` | \`payment-gateway\` |
| \`Prepaid Card\` | \`prepaid-card\` |
| \`Regulatory\` | \`regulatory\` |
| \`Remittance\` | \`remittance\` |
| \`Supermarket\` | \`supermarket\` |
| \`Switching\` | \`switching\` |
| \`Transportation\` | \`transportation\` |
| \`Utilities\` | \`utilities\` |

## Collisions: brands that appeared in multiple v1 categories

7 brands had the same name across multiple v1 folders. Resolved as:

| Brand | v1 sources | v2 outcome |
|---|---|---|
| Jago | Bank Logo + Bank App | Two slugs: \`jago\` (Bank Logo, wordmark) + \`jago-app\` (Bank App, icon) |
| Jenius | Bank Logo + Bank App | Two slugs: \`jenius\` + \`jenius-app\` |
| OCTO Clicks | Bank App + Direct Debit | Two slugs: \`octo-clicks\` + \`octo-clicks-direct-debit\` |
| QRIS | Government + Miscellaneous | One slug \`qris\` from \`Government/\`; \`Miscellaneous/\` dropped |
| DOKU | E-Wallet + Payment Gateway | One slug \`doku\` from \`E-Wallet/\`; \`Payment Gateway/\` dropped (near-duplicate) |
| PayPal | Misc + Remittance | One slug \`paypal\` from \`Remittance/\`; \`Miscellaneous/\` dropped |
| Western Union | Misc + Remittance | One slug \`western-union\` from \`Remittance/\`; \`Miscellaneous/\` dropped |

## PNG variants

v1 shipped raster versions at x1, x2, x3, x4, and Large. v2 ships SVG only.

If you need PNG:
- **CDN image transform** — jsDelivr supports \`?...&output=png\` for many SVGs.
- **Build-time rasterize** — pipe the SVG through [\`sharp\`](https://sharp.pixelplumbing.com/) in your own pipeline.
- **Runtime rasterize** — \`<canvas>\` with \`drawImage\` on an SVG \`<img>\`.

For most modern targets (web, React Native, Flutter, even most email clients), SVG renders correctly and is significantly smaller.

## Full v1 → v2 slug mapping

`;

  md += `${total} v1 entries · ${kept} kept (${aliasCount} aliased) · ${dropCount} dropped\n\n`;
  md += '| v1 path | v1 display name | v2 slug | notes |\n';
  md += '|---|---|---|---|\n';
  for (const r of rows) {
    md += `| \`${r.category}/${r.file}\` | ${r.displayName} | ${r.v2slug === '—' ? '—' : '`' + r.v2slug + '`'} | ${r.status} |\n`;
  }

  const out = path.join(REPO, 'MIGRATION.md');
  fs.writeFileSync(out, md);
  console.log(`Wrote ${out}`);
  console.log(`Total: ${total} v1 entries → ${kept} v2 (${aliasCount} aliased, ${dropCount} dropped)`);
}

main();
