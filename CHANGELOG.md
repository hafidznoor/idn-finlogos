# Changelog

All notable changes to this project will be documented in this file. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1]

### Changed

- **Renamed** the npm package from `@hafidznoor/idn-finlogos` (scoped) to `idn-finlogos` (unscoped). The scoped name is deprecated on npm with a pointer to the new one. All public API, file layout, and CDN paths are identical — only the package name (and therefore the install command + import specifier prefix) changed.

### Migration

```diff
- npm install @hafidznoor/idn-finlogos
+ npm install idn-finlogos
```

```diff
- import bca from '@hafidznoor/idn-finlogos/icons/bca';
+ import bca from 'idn-finlogos/icons/bca';
```

CDN URLs:
```diff
- https://cdn.jsdelivr.net/npm/@hafidznoor/idn-finlogos@2/...
+ https://cdn.jsdelivr.net/npm/idn-finlogos@2/...
```

## [2.0.0]

First release. Initially published as `@hafidznoor/idn-finlogos`; renamed to `idn-finlogos` in 2.0.1. Complete rewrite of the v1 `indo-financial-logolibrary` package. See [MIGRATION.md](./MIGRATION.md) for the v1 → v2 mapping.

### Added

- 489 SVG logos across 23 categories, source-of-truth in [`data/logos.yml`](./data/logos.yml).
- Per-logo ESM and CJS subpath imports: `import bca from 'idn-finlogos/icons/bca'`.
- Raw SVG-file subpath: `import bcaUrl from 'idn-finlogos/icons/bca.svg'`.
- Metadata helpers: `listLogos`, `getLogo`, `getLogoUrl`, `getCategories`, `VERSION`.
- TypeScript declarations bundled (`.d.ts` per logo + `dist/index.d.ts`).
- jsDelivr + unpkg CDN distribution.
- Build pipeline with SVGO optimization (~53% size reduction).
- CI workflow validating catalog + building on every PR.
- Release workflow publishing to public npm with provenance + creating GitHub Releases with SVG zip attached.
- Dual licensing: MIT for code, CC-BY-NC-4.0 for SVG assets.

### Changed (vs v1)

- **Registry**: GitHub Packages → public npm (`idn-finlogos`).
- **Filenames**: spaces/parens → kebab-case slugs (`BCA Digital.svg` → `bca-digital.svg`).
- **API**: runtime `fs.readdirSync` path lookups → static per-logo modules.
- **Categories**: filesystem folders → metadata in `data/logos.yml`.
- **License**: resolved v1's MIT-vs-CC-BY-NC-4.0 inconsistency by dual-licensing cleanly.

### Removed

- PNG variants (x1, x2, x3, x4, Large). Use a CDN image transform or `sharp` if you need raster. See [MIGRATION.md](./MIGRATION.md#png-variants).
- The runtime `index.js` that read the filesystem.

### Collision resolutions (v1 → v2)

7 brands appeared under multiple v1 categories. Resolved as:

- `jago` (Bank Logo) + `jago-app` (Bank App) — visually distinct.
- `jenius` (Bank Logo) + `jenius-app` (Bank App) — visually distinct.
- `octo-clicks` (Bank App) + `octo-clicks-direct-debit` (Direct Debit) — visually distinct.
- `qris` (Government); Misc copy dropped.
- `doku` (E-Wallet); Payment Gateway copy dropped (near-duplicate).
- `paypal` (Remittance); Misc copy dropped.
- `western-union` (Remittance); Misc copy dropped.

[Unreleased]: https://github.com/hafidznoor/idn-finlogos/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.0.1
[2.0.0]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.0.0
