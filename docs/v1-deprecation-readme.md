# Template: proposed new Readme.md for the v1 repo

When you're ready to deprecate the old `indonesia-financialLogo` repo, replace its `Readme.md` with the content below, commit, and then archive the repo on GitHub (`Settings → General → Archive this repository`).

Archiving (not deleting) preserves every existing `npm install indo-financial-logolibrary` command for users on GitHub Packages.

---

```markdown
# ⚠️ DEPRECATED — use idn-finlogos instead

This package (`indo-financial-logolibrary`, v1) is **no longer maintained**.

## Why

v1 used a runtime `fs.readdirSync` to expose logo paths. That meant:

- It couldn't be used in browser bundlers (Vite, webpack, esbuild, Rollup).
- It was only published to GitHub Packages, not public npm — requiring `.npmrc` auth setup.
- Filenames contained spaces (`BCA Digital.svg`) — bad for URLs and JS identifiers.

## Use v2 instead

[**idn-finlogos**](https://github.com/hafidznoor/idn-finlogos) — public npm, jsDelivr/unpkg CDN, per-logo ESM imports, TypeScript types, ~10× smaller download.

\`\`\`bash
npm install idn-finlogos
\`\`\`

\`\`\`js
import bca from 'idn-finlogos/icons/bca';
\`\`\`

Or via CDN, no install:

\`\`\`html
<img src="https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/bca.svg">
\`\`\`

## Migrating

See [MIGRATION.md](https://github.com/hafidznoor/idn-finlogos/blob/main/MIGRATION.md) for a full v1 → v2 slug mapping table.

## License clarification

v1's `package.json` claimed `CC-BY-NC-4.0` while the `LICENSE` file was MIT — those were contradictory. v2 dual-licenses cleanly: **MIT for the code, CC-BY-NC-4.0 for the SVG assets**.

This repo is left online (archived) so any existing `npm install` commands keep working, but no further updates will land here.
```

---

## Deployment checklist

1. ☐ v2 published to public npm (`idn-finlogos@2.0.1`).
2. ☐ v2 repo public on GitHub at `hafidznoor/idn-finlogos`.
3. ☐ Replace v1 `Readme.md` with the template above.
4. ☐ Commit + push v1 deprecation banner.
5. ☐ GitHub: archive the v1 repo (Settings → General → Archive this repository).
6. ☐ Optional: deprecate the v1 npm package on GitHub Packages: `npm deprecate "indo-financial-logolibrary@*" "Use idn-finlogos instead. See README."` (requires being logged into GitHub Packages registry).
