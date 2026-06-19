# Changelog

All notable changes to this project will be documented in this file. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.4.0]

### Changed — slug cleanup, bare slug = newest logo

The bare brand slug now always resolves to the **newest** official logo. Previously the newest art hid behind a `-new` suffix, so `getLogo('bri')` or `<Logo slug="bri" />` silently returned the *old* BRI logo. The `-new` suffix is retired for good — superseded art now lives under `-old`.

39 slugs renamed:

| old slug | new slug | name |
|---|---|---|
| `bri-new` | `bri` | BRI |
| `bri` | `bri-old` | BRI (Old) |
| `btn-new` | `btn` | BTN |
| `btn` | `btn-old` | BTN (Old) |
| `btn-syariah-new` | `btn-syariah` | BTN Syariah |
| `btn-syariah` | `btn-syariah-old` | BTN Syariah (Old) |
| `bca-flazz-new` | `bca-flazz` | BCA Flazz |
| `bca-flazz` | `bca-flazz-old` | BCA Flazz (Old) |
| `bukalapak-new` | `bukalapak` | Bukalapak |
| `bukalapak` | `bukalapak-old` | Bukalapak (Old) |
| `mandiri-livin-new` | `mandiri-livin` | Mandiri Livin |
| `mandiri-livin` | `mandiri-livin-old` | Mandiri Livin (Old) |
| `mastercard-securecode-new` | `mastercard-securecode` | Mastercard SecureCode |
| `mastercard-securecode` | `mastercard-securecode-old` | Mastercard SecureCode (Old) |
| `paypal-new` | `paypal` | PayPal |
| `paypal` | `paypal-old` | PayPal (Old) |
| `simpati-new` | `simpati` | Simpati |
| `simpati` | `simpati-old` | Simpati (Old) |
| `verified-by-visa-new` | `verified-by-visa` | Verified by VISA |
| `verified-by-visa` | `verified-by-visa-old` | Verified by VISA (Old) |
| `verifone-new` | `verifone` | Verifone |
| `verifone` | `verifone-old` | Verifone (Old) |
| `2c2p-new` | `2c2p` | 2c2p |
| `2c2p-new-alt` | `2c2p-alt` | 2c2p (Alt) |
| `2c2p` | `2c2p-old` | 2c2p (Old) |
| `alipay-new` | `alipay` | Alipay |
| `indihome-new` | `indihome` | IndiHome |
| `kai-commuter-new` | `kai-commuter` | KAI Commuter |
| `ovo-new` | `ovo` | OVO |
| `ovo-new-alt` | `ovo-alt` | OVO (Alt) |
| `pam-jaya-new` | `pam-jaya` | PAM Jaya |
| `pos-indonesia-new` | `pos-indonesia` | Pos Indonesia |
| `transvision-new` | `transvision` | TransVision |
| `permata-bank-new` | `permata` | Permata Bank |
| `permata-bank-alt` | `permata-alt` | Permata Bank (Alt) |
| `permata` | `permata-old` | Permata Bank (Old) |
| `link-new` | `link` | Link |
| `link-new-alt` | `link-alt` | Link (Alt) |
| `link` | `atm-link` | ATM Link — distinct "ATM Link" badge lockup, not a rebrand generation |

**What changes:** bare slugs in the left column (`bri`, `btn`, `paypal`, `permata`, `link`, …) now render the **current** logo instead of the old one. If you deliberately want the superseded art, switch to the `-old` slug.

**What keeps working:**

- Every retired slug whose art still exists under a new name (`bri-new`, `ovo-new`, `permata-bank-alt`, …) is recorded in that entry's `aliases`. `getLogo()` / `getLogoUrl()` (JS), `IdnFinLogos.get()` (Swift / Kotlin / Dart), the framework `<Logo slug>` lookup, and `listLogos({ search })` all resolve aliases.
- `dist/icons/<retired-slug>.{svg,mjs,js,d.ts}` ship as deprecated shims re-exporting the canonical module, so per-icon imports and CDN URLs using e.g. `bri-new` keep working. These shims will be removed in the next major (v3).

### Changed — typo & convention slug fixes

Long-frozen misspellings and ad-hoc numbered slugs are corrected. The old slug is kept as an alias on each entry, so existing lookups (`getLogo('mualamat')`, `getLogo('bank-dki-1')`) keep resolving.

| old slug | new slug | name |
|---|---|---|
| `mualamat` | `muamalat` | Bank Muamalat |
| `amercian-express-alt` | `american-express-alt` | American Express (Alt) |
| `topremit-1` | `topremit-alt` | Topremit (Alt) |
| `lexus-financial-service-1` | `lexus-financial-service-alt` | Lexus Financial Service (Alt) |
| `bank-bpd-sumsel-babel-alt-1` | `bank-bpd-sumsel-babel-alt` | Bank BPD Sumsel Babel (Alt) |

**Bank DKI → Bank Jakarta rebrand.** Bank DKI rebranded to **Bank Jakarta**. The new logo becomes the canonical `bank-jakarta` entry and inherits the bank's identifiers (kode bank `111`, SWIFT `bdkiidj1`); the pre-rebrand mark moves to `bank-dki-old`. The retired slugs `bank-dki`, `bank-dki-alt`, and `bank-dki-1` all resolve to `bank-jakarta` as aliases, so `getLogo('bank-dki')` and `getLogo('111')` return the current Bank Jakarta logo.

Display names were also restyled to match official brand stylization (slugs unchanged): `Gopay` → `GoPay`, `Mandiri Livin` → `Livin' by Mandiri`, `Simpati` → `simPATI`, `Blu BCA` → `blu by BCA Digital`, `BYOND BSI` → `BYOND by BSI`, `Anteraja` → `AnterAja`, `Sicepat Ekspres` → `SiCepat Ekspres`, `Union Pay` → `UnionPay`, `I.Saku` → `i.saku`, `MTIX` → `m.tix`, `Playstation Plus`/`Store` → `PlayStation Plus`/`Store` (and their `(Alt)`/`(Old)`/`(EN)` variants).

### Added

- **PNG renders at 1x/2x/3x/4x** for environments that can't display SVG (emails, legacy webviews, native apps without an SVG renderer). Every canonical logo ships as `dist/png/<slug>@{1x,2x,3x,4x}.png` — square 80/160/240/320 px canvases with the logo centered on transparent padding. Importable via the new `idn-finlogos/png/<slug>@<scale>x.png` subpath export or fetched from the CDN. Generated by the new `npm run build:png` (wired into `build:all` and `prepublishOnly`).
- **Lookup by brand name** — `getLogo()` / `getLogoUrl()` (JS) and `IdnFinLogos.get()` (Swift / Kotlin / Dart) now accept the brand name in any casing, not just the slug: `getLogo('BRI')`, `getLogo('Bank Rakyat Indonesia')`, `getLogo('PayPal')`, and `getLogo('Alipay+')` all resolve. Resolution order: exact slug → alias (retired slug) → display name (case-insensitive) → slugified input. Unknown input still returns `null`.
- Official full company names added as aliases for major banks (`bank-rakyat-indonesia` → `bri`, `bank-central-asia` → `bca`, `bank-mandiri` → `mandiri`, `bank-muamalat` → `muamalat`, and 9 more).
- **SWIFT/BIC and kode-bank lookup** — banks carry their **SWIFT/BIC** (lowercased, e.g. `bca` → `cenaidja`) and **3-digit kode bank** (e.g. `bca` → `014`, `bri` → `002`) as aliases, so `getLogo('CENAIDJA')` and `getLogo('014')` both resolve to BCA. Codes are taken from Bank Indonesia's official **Tabel Sandi Bank (update 31 Maret 2026)**. Each bank also gets its official name and nickname (`getLogo('Panin Bank')`, `getLogo('bank-bni')`), and regional banks (BPD) their common trade name (`bank-bpd-jateng` → `bank-jateng`). 107 banks covered.
- **Genuine aliases across the catalog** — spelling/spacing variants (`shopee-pay` → `shopeepay`, `linkaja` → `link-aja`), Indonesian official long forms (`pln` → `perusahaan-listrik-negara`, `ojk` → `otoritas-jasa-keuangan`, `qris` → `quick-response-code-indonesian-standard`), and common abbreviations (`bca-flazz` → `flazz`, `american-express` → `amex`). 126 non-bank entries covered. Brands with no genuine alternate name are intentionally left alias-less.
- Slug conventions documented in CONTRIBUTING.md: bare slug = newest logo, `-old` for superseded art, never a `-new` suffix; renames must leave an alias behind; alias guidance (SWIFT/kode bank for banks, genuine keys only).
- `npm run validate` now rejects aliases that collide with a live slug or another alias, and prints a non-fatal alias-coverage report.

## [2.3.0]

### Added

- **Framework wrappers** — first-party `<Logo>` components for **React**, **React Native**, **Vue**, and **Svelte**, plus a vanilla DOM helper. All ship under subpath exports of the same `idn-finlogos` package; peer deps (`react`, `react-native`, `react-native-svg`, `vue`, `svelte`) are declared optional so consumers only install what they use.
  - `idn-finlogos/react` — `<Logo slug="bca" size={32} />`
  - `idn-finlogos/react-native` — `<Logo slug="bca" width={80} height={26} />` (wraps `react-native-svg`'s `SvgXml`)
  - `idn-finlogos/vue` — `<Logo slug="bca" :size="32" />`
  - `idn-finlogos/svelte` — `<Logo slug="bca" size={32} />` (Svelte 4/5 compatible)
  - `idn-finlogos/vanilla` — `createLogo({ slug, size })`, `renderLogo(target, options)`, `getLogoSvg(slug)`
- Each component accepts either `slug` (looks up via the bundled icons map — convenient) or `svg` (a pre-imported per-icon string from `idn-finlogos/icons/<slug>` — tree-shake friendly).
- New `dist/icons-map.{mjs,js,d.ts}` shared by all wrappers — re-exports the existing per-slug modules, so no SVG content is duplicated on disk.
- New build script: `npm run build:frameworks` (also runs as part of `build:all` and `prepublishOnly`).
- `Korlantas Polri` logo added under the **Government** category.

### Changed

- **QRIS** moved from `government` → `qr-payment` to match its actual function and group it with KHQR, SGQR, VietQR, and other QR-payment standards.
- **Total logos: 574 → 572** (see Removed below).

### Removed

- 3 duplicate logos: `octo-clicks-direct-debit` (visually identical to `octo-clicks` for our purposes), `wirecard-1`, and `wirecard-2` (both visually identical to `wirecard`).

### Fixed

- Re-exported `ibk-bank` and `qris` from source — the previous exports had broken clip-path masks (same class of bug fixed in 2.2.1 for `alto`, `netflix-alt`, `payoneer`, `visa-checkout`).

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

[Unreleased]: https://github.com/hafidznoor/idn-finlogos/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/hafidznoor/idn-finlogos/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/hafidznoor/idn-finlogos/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/hafidznoor/idn-finlogos/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/hafidznoor/idn-finlogos/compare/v2.1.6...v2.2.0
[2.1.6]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.1.6
[2.1.5]: https://github.com/hafidznoor/idn-finlogos/compare/v2.1.4...v2.1.5
[2.1.4]: https://github.com/hafidznoor/idn-finlogos/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.1.3
[2.1.1]: https://github.com/hafidznoor/idn-finlogos/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/hafidznoor/idn-finlogos/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.0.1
[2.0.0]: https://github.com/hafidznoor/idn-finlogos/releases/tag/v2.0.0
