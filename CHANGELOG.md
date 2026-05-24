# Changelog

All notable changes to this project will be documented in this file. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.1]

### Fixed

- Re-exported 5 logos with broken or missing clip-path masks: `alto`, `ibk-bank`, `netflix-alt`, `payoneer`, `visa-checkout`. Some `viewBox` dimensions changed where the source artwork was trimmed (`alto` 80×118 → 80×54 dropped the wordmark below the badge; `ibk-bank` 80×78 → 74×72; `visa-checkout` no longer has a leading black background rect). Consumers respecting `viewBox` will render correctly; pixel-locked layouts may need adjustment.

## [2.2.0]

### Added

- **Insurance** category (`insurance`) — 29 logos: AIA, AXA, Allianz, Astra Life, BPJS, BPJS Ketenagakerjaan, BCA Life, BRI Insurance, BRI Life, BRINS, Bumiputera, CHUBB, Commonwealth Life, FWD, Generali, Mandiri Inhealth, Manulife, Prudential, Qoala, Sequis, Sun Life, Taspen, Zurich, and more.
- **QR Payment** category (`qr-payment`) — 10 logos: DuitNow, DuitNow QR, KHQR, LAO QR, QR Ph, SGQR, SGQR+, Thai QR Payment, Thai QR Payment (Alt), VietQR.
- 46 logos across existing categories: Bank Logo (+7: Bank DKI-1, Bank Saqu, Bank Saqu (Alt), BSN, BSN (Alt), BRI (New), SeaBank (Alt)), Supermarket (+6: AEON, Alfa Express, Alfamidi Super, Indogrosir, Super Indo, The Foodhall), Miscellaneous (+7: Alipay+, Alipay+ (Old), Alipay+ (Old Alt), DBS Paylah, OCBC Pay Anyone, Verifone, Verifone (New)), Remittance (+5: PayPal (New), SWIFT, SWIFT (Alt), Topremit, Topremit-1), ISP (+4: Iconnet, Oxygen.id, Oxygen.id Home, XL Satu), Bank App (+3: BYOND BSI, BYOND BSI (Alt), Mandiri Livin (New)), E-Commerce (+3: Bukalapak (Alt), TikTok Shop, Tokopedia (Alt)), Mobile Telco (+3: Simpati (New), XL Smart, XL SMART (Alt)), Payment Gateway (+2: 2c2p (New), 2c2p (New-Alt)), Logistic (+1: Indah Cargo), Financing (+1: BFI Finance), Regulatory (+1: AYO ke Bank), Prepaid Card (+1: BCA Flazz (New)).

### Fixed

- Re-exported SVG artwork across the full 574-logo catalog to resolve clip-path and mask rendering issues that caused logos to display incorrectly on GitHub's SVG viewer and certain mobile SVG renderers.

## [2.1.6]

### Fixed

- Skipped GPG signing when publishing Android artifacts to GitHub Packages (the global `signAllPublications()` hook was attaching the `signMavenPublication` task to the GHP job; GHP does not require signatures).

## [2.1.5]

### Fixed

- Used `publishAllPublicationsToGitHubPackagesRepository` Gradle task for Android GitHub Packages publishing — the per-publication task name guessed in 2.1.4 was invalid for `com.android.library` projects using the vanniktech plugin.

## [2.1.4]

### Added

- **GitHub Packages mirror** — npm package published as `@hafidznoor/idn-finlogos` (scoped, GHP requires a scoped name) and Android AAR published alongside the canonical npmjs.org and Maven Central releases.

## [2.1.3]

### Fixed

- pub.dev publish workflow: replaced `--stdin` flag (which does not exist) with `--env-var` for passing the secret token. The v2.1.2 tag was created but all registry publishes failed before completing; 2.1.3 is the effective successor to 2.1.1.

## [2.1.1]

### Fixed

- Added `LICENSE` file to the Flutter package (required by pub.dev).
- Fixed pub.dev release workflow to use the correct `PUB_DEV_TOKEN` secret format.

## [2.1.0]

### Added

- **Android** library (`io.github.hafidznoor:idn-finlogos`) — 489 SVGs shipped as `assets/idn-finlogos/*.svg` with a Kotlin API (`IdnFinLogos.all`, `IdnFinLogos.get`, `IdnFinLogos.search`). Publishes to Maven Central and JitPack.
- **iOS** Swift Package — `Package.swift` at repo root; SVGs as `Bundle.module` resources; iOS 13+ / macOS 11+ / tvOS 13+ / watchOS 6+.
- **Flutter** package (`idn_finlogos` on pub.dev) — `const` logo catalog with `assetPath` values compatible with `flutter_svg`.
- Generator scripts `build-android.mjs`, `build-ios.mjs`, `build-flutter.mjs`, `build-all.mjs` — all driven by the same `data/*.yml` source of truth.
- Release workflow fans out to all four registries (npm, Maven Central, SPM, pub.dev) on tag push; GitHub Release runs even if a registry job fails.
- CI check enforces that generated platform files (`Catalog.kt`, `Catalog.generated.swift`, `catalog.g.dart`) stay in sync with `data/*.yml`.

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

[Unreleased]: https://github.com/hafidznoor/idn-finlogos/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/hafidznoor/idn-finlogos/compare/v2.1.6...v2.2.0
[2.1.6]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.1.6
[2.1.5]: https://github.com/hafidznoor/idn-finlogos/compare/v2.1.4...v2.1.5
[2.1.4]: https://github.com/hafidznoor/idn-finlogos/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.1.3
[2.1.1]: https://github.com/hafidznoor/idn-finlogos/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/hafidznoor/idn-finlogos/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.0.1
[2.0.0]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.0.0
