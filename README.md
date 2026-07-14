# Indonesia Fintech Logos

> The package **`idn-finlogos`** — **Indonesian fintech & financial institution logos**: banks, e-wallets, payment gateways, switching networks, regulators, and more, as **optimized SVGs** ready to drop into web, Android, iOS, and Flutter projects.

[![npm version](https://img.shields.io/npm/v/idn-finlogos?logo=npm&label=npm)](https://www.npmjs.com/package/idn-finlogos)
[![npm downloads](https://img.shields.io/npm/dm/idn-finlogos?logo=npm&label=downloads)](https://www.npmjs.com/package/idn-finlogos)
[![Maven Central](https://img.shields.io/maven-central/v/io.github.hafidznoor/idn-finlogos?logo=apachemaven&label=maven%20central)](https://central.sonatype.com/artifact/io.github.hafidznoor/idn-finlogos)
[![pub.dev](https://img.shields.io/pub/v/idn_finlogos?logo=dart&label=pub.dev)](https://pub.dev/packages/idn_finlogos)
[![CI](https://github.com/hafidznoor/idn-finlogos/actions/workflows/ci.yml/badge.svg)](https://github.com/hafidznoor/idn-finlogos/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT%20%2B%20CC%20BY--NC%204.0-blue)](#license)

[![Support on Lemon Squeezy](https://img.shields.io/badge/Support-Lemon%20Squeezy-FFC233?logo=lemonsqueezy&logoColor=white)](https://hafidznoor.lemonsqueezy.com/checkout/buy/f2b81ada-e8a9-4e29-b35c-7b7249b78404)

> **572 logos · 25 categories · SVG only · zero runtime dependencies · published to 4 registries · first-party React, React Native, Vue & Svelte components**

The single source of truth for Indonesian fintech and financial brand marks across **BCA, Mandiri, BRI, BNI, BSI, DANA, GoPay, OVO, ShopeePay, LinkAja, BI-FAST, QRIS, OJK, Bank Indonesia, LPS** and 555+ more — all hand-curated, SVGO-optimized, and shipped as native packages on **npm, Maven Central, Swift Package Manager, and pub.dev**.

> v2 of the original `indo-financial-logolibrary`. See [MIGRATION.md](./MIGRATION.md) if you're upgrading.

---

## Table of contents

- [Quick install](#quick-install)
- [Why idn-finlogos](#why-idn-finlogos)
- [Quick start](#quick-start)
- [Install](#install)
- [Usage](#usage)
  - [Web (npm)](#web-npm)
  - [Framework components — React, React Native, Vue, Svelte, vanilla](#framework-components--react-react-native-vue-svelte-vanilla)
  - [TypeScript](#typescript)
  - [Android](#android)
  - [iOS](#ios)
  - [Flutter](#flutter)
- [CLI](#cli)
- [Coverage](#coverage)
- [Complete logo catalog](#complete-logo-catalog)
- [Design source (Figma)](#design-source-figma)
- [FAQ](#faq)
- [License](#license)
- [Contributing](#contributing)
- [Support this project](#support-this-project)
- [Project activity](#project-activity)

---

## Quick install

| Platform | Install | Coordinate |
|---|---|---|
| **Web (npm)** | `npm install idn-finlogos` | `idn-finlogos` |
| **React / RN / Vue / Svelte** | `npm install idn-finlogos` + framework subpath | `idn-finlogos/{react,react-native,vue,svelte}` |
| **Android (Gradle)** | `implementation("io.github.hafidznoor:idn-finlogos:2.5.0")` | `io.github.hafidznoor:idn-finlogos` |
| **iOS (SPM)** | `.package(url: "https://github.com/hafidznoor/idn-finlogos", from: "2.5.0")` | `IdnFinLogos` |
| **Flutter** | `flutter pub add idn_finlogos` | `idn_finlogos` |
| **Web (CDN, zero install)** | `<img src="https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/bca.svg" />` | jsDelivr / unpkg |
| **CLI (zero install)** | `npx idn-finlogos download bca` | `idn-finlogos` |

All packages ship the same 572 SVGs from a single source of truth (`data/logos.yml` + `icons/`). Mobile packages bundle SVGs as platform-native resources; web packages ship them as both ESM modules and raw files.

---

## Why idn-finlogos

Building a fintech, payments, banking, or e-commerce product for the Indonesian market means rendering dozens of local brand marks: banks (BCA, Mandiri, BRI), e-wallets (DANA, GoPay, OVO), payment rails (BI-FAST, QRIS, PRIMA, ALTO), regulators (OJK, BI, LPS), telcos, utilities, and more. Until now you had three bad options: trace them in Figma yourself, hotlink PNGs from blogs, or maintain a private fork of someone else's incomplete set.

**idn-finlogos** replaces that with one curated, cross-platform asset library:

- **One catalog, four ecosystems.** A single YAML manifest (`data/logos.yml`) compiles to npm, Maven Central / JitPack (Android), Swift Package Manager (iOS), and pub.dev (Flutter). The same `bca` slug returns identical artwork on every platform.
- **Production-ready SVGs.** Every file is SVGO-optimized with a shared config, validated against the manifest in CI, and shipped both as raw `.svg` files and per-logo ESM modules (tree-shakeable bundles).
- **Catalog API on every platform.** Beyond raw files, every language target exposes the same shape: `all`, `byCategory(...)`, `get(slug)`, `search(query)` — for pickers, settings screens, and dynamic UIs without re-implementing the index.
- **Built for breadth.** 153 banks (national, regional BPDs, syariah, foreign branches), all major e-wallets, switching networks, card schemes (Visa, Mastercard, JCB, GPN), regulators, ISPs, utilities, logistics, and entertainment subscriptions you'll see on a typical Indonesian checkout page.
- **Honest licensing.** Build tooling is MIT; the SVG artwork is CC BY-NC 4.0; trademarks remain the property of their holders. Commercial use of any individual mark requires permission from that brand — see [License](#license).

**Who it's for:**

- **Fintech & banking apps** rendering account pickers, transfer destinations, transaction rows.
- **Payment gateways & PSPs** showing every supported issuer, wallet, and switching network in checkout.
- **Marketplaces & e-commerce** displaying accepted payment methods, logistics options, or telco top-ups.
- **Design systems & internal tools** that need a stable, versioned catalog instead of one-off Figma exports.

---

## Quick start

```bash
npm install idn-finlogos
```

```js
import bca from 'idn-finlogos/icons/bca';

document.getElementById('logo').innerHTML = bca;
```

That's it. `bca` is the SVG markup as a string. Same idea on Android, iOS, and Flutter — see [Usage](#usage) below.

---

## Install

### From canonical registries

The recommended install paths. Same artifact, same coordinates, no auth required.

| Platform | Command |
|---|---|
| **Web (npm)** | `npm install idn-finlogos` |
| **React / React Native / Vue / Svelte** | `npm install idn-finlogos` — components import from `idn-finlogos/{react,react-native,vue,svelte}`; React Native also needs `react-native-svg` |
| **Android (Maven Central)** | `implementation("io.github.hafidznoor:idn-finlogos:2.5.0")` |
| **Android (JitPack, no wait)** | Add `maven { url = uri("https://jitpack.io") }`, then `implementation("com.github.hafidznoor:idn-finlogos:2.5.0")` |
| **iOS (Swift Package Manager)** | `.package(url: "https://github.com/hafidznoor/idn-finlogos", from: "2.5.0")` |
| **Flutter (pub.dev)** | `flutter pub add idn_finlogos` |
| **Web (jsDelivr CDN)** | `https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/<slug>.svg` |
| **Web (unpkg CDN)** | `https://unpkg.com/idn-finlogos@2/dist/icons/<slug>.svg` |

### From GitHub Packages (mirror)

The npm and Android artifacts are also mirrored to **GitHub Packages** alongside the canonical releases. The canonical channels above remain recommended. GitHub Packages requires authentication even for public packages — generate a [Personal Access Token](https://github.com/settings/tokens) with the `read:packages` scope first.

**npm** — add to `~/.npmrc` (or a project-local `.npmrc`):

```
@hafidznoor:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

Then install the scoped mirror:

```bash
npm install @hafidznoor/idn-finlogos
```

**Android (Gradle)** — add the GHP Maven repo to `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/hafidznoor/idn-finlogos")
            credentials {
                username = System.getenv("GITHUB_ACTOR") ?: "your-github-username"
                password = System.getenv("GITHUB_TOKEN") ?: "YOUR_GITHUB_PAT"
            }
        }
    }
}
```

Then use the same coordinate as Maven Central:

```kotlin
implementation("io.github.hafidznoor:idn-finlogos:2.5.0")
```

---

## Usage

### Web (npm)

Four ways to consume logos on the web, depending on your bundler and rendering needs.

#### 1. Per-logo ESM import (recommended for app bundles)

Tree-shakeable. Only the logos you import end up in your bundle.

```js
import bca from 'idn-finlogos/icons/bca';
import gopay from 'idn-finlogos/icons/gopay';
import doku from 'idn-finlogos/icons/doku';

// Each import is the SVG markup as a string.
document.getElementById('logo').innerHTML = bca;
```

**In React / Vue / Svelte:** prefer the first-party components below — they handle the injection, sizing, and accessibility attributes for you.

#### 2. Raw SVG file as URL

For `<img src>`, asset pipelines, or framework loaders that hash and emit files.

```js
import bcaUrl from 'idn-finlogos/icons/bca.svg';
// → '/assets/bca-abc123.svg' (your bundler hashes it)

<img src={bcaUrl} alt="BCA" />
```

#### 3. Metadata helpers (for catalog pages, dynamic pickers)

```js
import { listLogos, getLogo, getLogoUrl, getCategories } from 'idn-finlogos';

listLogos();                                // → all 572
listLogos({ category: 'bank-logo' });       // → 160 banks
listLogos({ search: 'syariah' });           // → fuzzy match by name/slug/alias

getCategories();
// → [{ slug: 'bank-logo', displayName: 'Bank Logo', count: 160 }, ...]

await getLogo('bca');
// → { slug, name, category, svg: '<svg>...</svg>', ... }

// Slug, retired slug, or brand name in any casing — all resolve:
await getLogo('BRI');
await getLogo('Bank Rakyat Indonesia');
await getLogo('bri-new');                   // retired slug (alias)
// → same logo as getLogo('bri'); unknown input → null

// Banks also resolve by SWIFT/BIC and 3-digit kode bank:
await getLogo('CENAIDJA');                  // → bca (SWIFT, any casing)
await getLogo('014');                       // → bca (kode bank)
await getLogo('002');                       // → bri

getLogoUrl('bca');
// → 'https://cdn.jsdelivr.net/npm/idn-finlogos@2.5.0/dist/icons/bca.svg'
```

#### 4. CDN — no install, no build step

```html
<img src="https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/bca.svg" alt="BCA" />
<img src="https://unpkg.com/idn-finlogos@2/dist/icons/gopay.svg" alt="GoPay" />
```

Pin a major (`@2`), minor (`@2.5`), or exact version (`@2.5.0`). jsDelivr and unpkg both work.

#### 5. PNG fallbacks (for environments that can't render SVG)

Every logo also ships as pre-rendered PNGs at four pixel densities — `@1x` (80×80), `@2x` (160×160), `@3x` (240×240), and `@4x` (320×320). Each PNG is a square with the logo centered on transparent padding, so mixed aspect ratios line up in grids. Useful for emails, OG images, native apps without an SVG renderer, or legacy webviews.

```js
import bcaPng from 'idn-finlogos/png/bca@2x.png';

<img src={bcaPng} width="80" height="80" alt="BCA" />
```

```html
<!-- Or straight from the CDN, with a srcset for retina displays: -->
<img
  src="https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/png/bca@1x.png"
  srcset="https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/png/bca@2x.png 2x,
          https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/png/bca@3x.png 3x"
  width="80" height="80" alt="BCA"
/>
```

PNGs are available for canonical slugs only (not retired aliases) — prefer the SVGs everywhere SVG works; they're sharper and usually smaller.

---

### Framework components — React, React Native, Vue, Svelte, vanilla

The npm package ships first-party `<Logo>` components for the major web/native frameworks under subpath exports. They wrap the same SVG assets used everywhere else and accept either a `slug` (looks up via the bundled icons map) or a pre-imported `svg` string (tree-shake friendly).

Peer deps (`react`, `react-native`, `react-native-svg`, `vue`, `svelte`) are declared **optional** — `npm install idn-finlogos` won't pull them in. Install whichever you need alongside.

#### React

```jsx
import { Logo } from 'idn-finlogos/react';
import bcaSvg from 'idn-finlogos/icons/bca'; // tree-shake friendly

<Logo slug="bca" size={32} title="BCA" />          // by slug
<Logo svg={bcaSvg} size={32} className="..." />    // by pre-imported SVG
```

Forwards all standard `HTMLAttributes<HTMLSpanElement>` props (`style`, `className`, `aria-*`, click handlers, etc.).

#### React Native

```jsx
import { Logo } from 'idn-finlogos/react-native';

<Logo slug="bca" width={80} height={26} />
<Logo slug="mandiri" size={40} />                  // size shorthand for width+height
<Logo slug="bri" size={40} color="#fff" style={{ margin: 4 }} />
```

Wraps `react-native-svg`'s [`SvgXml`](https://github.com/software-mansion/react-native-svg#svgxml). Install the peer dep:

```bash
npm install react-native-svg
```

#### Vue

```vue
<script setup>
import { Logo } from 'idn-finlogos/vue';
import bcaSvg from 'idn-finlogos/icons/bca';
</script>

<template>
  <Logo slug="bca" :size="32" title="BCA" />
  <Logo :svg="bcaSvg" :size="32" />
</template>
```

Requires Vue 3+.

#### Svelte

```svelte
<script>
  import Logo from 'idn-finlogos/svelte';
  import bcaSvg from 'idn-finlogos/icons/bca';
</script>

<Logo slug="bca" size={32} title="BCA" />
<Logo svg={bcaSvg} size={32} />
```

Svelte 4 and Svelte 5 (legacy mode) both supported.

#### Vanilla JS

```js
import { createLogo, renderLogo, getLogoSvg } from 'idn-finlogos/vanilla';

document.body.appendChild(createLogo({ slug: 'bca', size: 32, title: 'BCA' }));
renderLogo('#mount', { slug: 'mandiri', size: 24, className: 'logo' });
const raw = getLogoSvg('bca'); // synchronous string, or null
```

#### Tree-shaking notes

- The `slug` prop conveniently looks up any icon by name, but pulls in the bundled `dist/icons-map.{mjs,js}` — which transitively imports **every** per-slug module. Use it for catalog pages or pickers where the slug is dynamic.
- For production app bundles where you only use a handful of logos, prefer the `svg` prop with pre-imported strings from `idn-finlogos/icons/<slug>` — modern bundlers will tree-shake away the rest.

---

### TypeScript

TypeScript types are bundled with the npm package. No `@types/` install required.

```ts
import { listLogos, type LogoMeta } from 'idn-finlogos';

const banks: LogoMeta[] = listLogos({ category: 'bank-logo' });
```

Each `LogoMeta` carries: `slug`, `name`, `category`, `aliases`, `tags`, plus accessors for SVG content and URLs.

---

### Android

`io.github.hafidznoor:idn-finlogos` ships SVGs as Android assets plus a typed Kotlin catalog. Pair it with **Coil** (recommended), **Glide**, or any SVG renderer.

```kotlin
// app/build.gradle.kts
dependencies {
    implementation("io.github.hafidznoor:idn-finlogos:2.5.0")
    // Recommended SVG renderer:
    implementation("io.coil-kt:coil-compose:2.6.0")
    implementation("io.coil-kt:coil-svg:2.6.0")
}
```

```kotlin
import com.hafidznoor.idnfinlogos.IdnFinLogos
import coil.ImageLoader
import coil.compose.AsyncImage
import coil.decode.SvgDecoder

@Composable
fun BcaLogo() {
    val ctx = LocalContext.current
    val loader = remember {
        ImageLoader.Builder(ctx).components { add(SvgDecoder.Factory()) }.build()
    }
    val bca = IdnFinLogos.get("bca") ?: return
    AsyncImage(
        model = "file:///android_asset/${bca.assetPath}",
        imageLoader = loader,
        contentDescription = bca.name,
    )
}
```

**Catalog API:** `IdnFinLogos.all`, `byCategory(...)`, `get(...)`, `search(...)`. Full Android-specific docs in [platforms/android/README.md](./platforms/android/README.md).

**Min SDK:** API 21 (Android 5.0). **Compile SDK:** 34.

---

### iOS

`IdnFinLogos` ships SVGs as bundle resources plus a typed Swift catalog. Pair with **SVGKit** or your preferred SVG renderer.

```swift
// Package.swift
.package(url: "https://github.com/hafidznoor/idn-finlogos", from: "2.5.0")
```

```swift
import SwiftUI
import SVGKit
import IdnFinLogos

struct BcaLogo: View {
    var body: some View {
        if let url = IdnFinLogos.get("bca")?.url,
           let img = SVGKImage(contentsOf: url)?.uiImage {
            Image(uiImage: img).resizable().scaledToFit()
        }
    }
}
```

**Catalog API:** `IdnFinLogos.all`, `byCategory(_:)`, `get(_:)`, `search(_:)`.

**Minimum platforms:** iOS 13, macOS 11, tvOS 13, watchOS 6.

---

### Flutter

`idn_finlogos` bundles SVGs as Flutter assets and exposes a Dart catalog. Pair with **flutter_svg**.

```bash
flutter pub add idn_finlogos flutter_svg
```

```dart
import 'package:flutter_svg/flutter_svg.dart';
import 'package:idn_finlogos/idn_finlogos.dart';

class BcaLogo extends StatelessWidget {
  const BcaLogo({super.key});

  @override
  Widget build(BuildContext context) {
    final bca = IdnFinLogos.get('bca');
    if (bca == null) return const SizedBox.shrink();
    return SvgPicture.asset(bca.assetPath, semanticsLabel: bca.name);
  }
}
```

**Catalog API:** `IdnFinLogos.all`, `byCategory(...)`, `get(...)`, `search(...)`. Full Flutter-specific docs in [platforms/flutter/README.md](./platforms/flutter/README.md).

**Min SDK:** Dart 3.0+, Flutter 3.0+.

---

## CLI

Download logos straight from your terminal — no project, no bundler, no install:

```bash
npx idn-finlogos download bca
# ✓ bca.svg (4.5 KB)
```

The CLI is bundled with the npm package and fetches artwork from the CDN, so it works anywhere Node 18+ runs. A network connection is required.

Running `idn-finlogos` with no arguments opens a dashboard with live library stats, the command menu, and quick-start examples:

```bash
npx idn-finlogos
```

**Download** one or more logos. Queries accept a slug, a retired slug, or the brand name in any casing (banks also resolve by SWIFT/BIC and 3-digit kode bank):

```bash
npx idn-finlogos download gopay ovo dana
npx idn-finlogos download "Bank Rakyat Indonesia" --out ./assets
npx idn-finlogos download bca --format png --scale 2      # -> bca@2x.png (160×160)
```

| Flag | Values | Default | Notes |
|---|---|---|---|
| `--format` | `svg`, `png` | `svg` | Downloaded SVGs include `xmlns`, so they open standalone. |
| `--scale` | `1`–`4` | `1` | PNG only (`@Nx`, 80–320 px). |
| `--out` | directory | current dir | Created if missing. |
| `--cdn` | `jsdelivr`, `unpkg` | `jsdelivr` | Which CDN to fetch from. |
| `--pkg-version` | version | this CLI's | Fetch a specific published version. |

**Browse** the catalog without downloading:

```bash
npx idn-finlogos list --category e-wallet     # tabular slug / name / category
npx idn-finlogos search mandiri               # filter by name, slug, or alias
npx idn-finlogos info "Bank Rakyat Indonesia" # metadata + CDN URLs
npx idn-finlogos categories                   # all categories with counts
```

Add `--json` to `list`, `search`, `info`, or `categories` for machine-readable output. Run `npx idn-finlogos --help` for the full reference.

---

## Coverage

**572 logos across 25 categories**, browseable via `getCategories()` or [`data/categories.yml`](./data/categories.yml).

| # | Category | Slug | Logos |
|---:|---|---|---:|
| 1 | Bank Logo | `bank-logo` | 160 |
| 2 | Card Payment | `card-payment` | 37 |
| 3 | Logistic | `logistic` | 33 |
| 4 | Insurance | `insurance` | 29 |
| 5 | E-Wallet | `e-wallet` | 27 |
| 6 | Financing | `financing` | 27 |
| 7 | Entertainment | `entertainment` | 26 |
| 8 | Supermarket | `supermarket` | 24 |
| 9 | Miscellaneous | `miscellaneous` | 21 |
| 10 | Mobile Telco | `mobile-telco` | 20 |
| 11 | Bank App | `bank-app` | 17 |
| 12 | Game | `game` | 15 |
| 13 | ISP | `isp` | 15 |
| 14 | Regulatory | `regulatory` | 15 |
| 15 | Remittance | `remittance` | 14 |
| 16 | Switching | `switching` | 13 |
| 17 | E-Commerce | `e-commerce` | 12 |
| 18 | Transportation | `transportation` | 12 |
| 19 | QR Payment | `qr-payment` | 11 |
| 20 | Payment Gateway | `payment-gateway` | 10 |
| 21 | Prepaid Card | `prepaid-card` | 9 |
| 22 | Donation | `donation` | 7 |
| 23 | Utilities | `utilities` | 7 |
| 24 | Direct Debit | `direct-debit` | 6 |
| 25 | Government | `government` | 5 |

**Notable brands covered:** BCA, Mandiri, BRI, BNI, BSI, BTN, CIMB Niaga, Danamon, Permata, OCBC NISP, UOB, HSBC, Standard Chartered, Citibank, DBS, Maybank, DANA, GoPay, OVO, ShopeePay, LinkAja, DOKU, Midtrans, Xendit, Stripe, 2c2p, ipay88, BI-FAST, QRIS, PRIMA, ALTO, Jalin, GPN, Visa, Mastercard, JCB, OJK, Bank Indonesia, LPS, AFPI, Korlantas Polri, Telkomsel, IndiHome, MyRepublic, JNE, J&T, SiCepat, Tokopedia, Shopee, Lazada, Bukalapak, Blibli, Pegadaian, PLN, PGN, KAI, TransJakarta, MRT Jakarta, Netflix, Spotify, Disney+ Hotstar, AIA, Prudential, Manulife, BPJS, DuitNow, SGQR — and 505+ more in the full catalog below.

---

## Complete logo catalog

All 572 logos, grouped by category and sorted by name. Click a section to expand. The `code` is the slug you pass to `getLogo()`, `IdnFinLogos.get(...)`, or use as a file name (`icons/<slug>.svg`). Both lookup functions also accept the brand name in any casing (`getLogo('Bank Rakyat Indonesia')` ≡ `getLogo('bri')`), and banks additionally resolve by their SWIFT/BIC code and 3-digit kode bank (`getLogo('CENAIDJA')` ≡ `getLogo('014')` ≡ `getLogo('bca')`).

**Slug convention:** the bare brand slug always carries the **newest** official logo (`bri` = current BRI logo). Superseded art from before a rebrand lives under `-old` (`bri-old`); alternate lockups of the current logo use `-alt`. Retired slugs from past renames (e.g. `bri-new`) keep resolving via aliases.

<details>
<summary><b>Bank Logo</b> · 160 logos · <code>bank-logo</code></summary>

`aladin` Aladin · `allo` Allo · `amar-bank` Amar Bank · `anz` ANZ · `bangkok-bank` Bangkok Bank · `bank-artha-graha-internasional` Bank Artha Graha Internasional · `bank-bengkulu` Bank Bengkulu · `bank-bjb` Bank BJB · `bank-bjb-syariah` Bank BJB Syariah · `bank-bpd-aceh` Bank BPD Aceh · `bank-bpd-bali` Bank BPD Bali · `bank-bpd-banten` Bank BPD Banten · `bank-bpd-diy` Bank BPD DIY · `bank-bpd-jambi` Bank BPD Jambi · `bank-bpd-jateng` Bank BPD Jateng · `bank-bpd-jatim` Bank BPD Jatim · `bank-bpd-kalbar` Bank BPD Kalbar · `bank-bpd-kalbar-alt` Bank BPD Kalbar (Alt) · `bank-bpd-kalimantan-timur` Bank BPD Kalimantan Timur · `bank-bpd-kalsel` Bank BPD Kalsel · `bank-bpd-kalteng` Bank BPD Kalteng · `bank-bpd-lampung` Bank BPD Lampung · `bank-bpd-maluku-malut` Bank BPD Maluku Malut · `bank-bpd-ntb-syariah` Bank BPD NTB Syariah · `bank-bpd-ntb-syariah-alt` Bank BPD NTB Syariah (Alt) · `bank-bpd-ntt` Bank BPD NTT · `bank-bpd-papua` Bank BPD Papua · `bank-bpd-riau-kepri` Bank BPD Riau Kepri · `bank-bpd-riau-kepri-syariah` Bank BPD Riau Kepri Syariah · `bank-bpd-sulselbar` Bank BPD Sulselbar · `bank-bpd-sulteng` Bank BPD Sulteng · `bank-bpd-sultra` Bank BPD Sultra · `bank-bpd-sulutgo` Bank BPD Sulutgo · `bank-bpd-sumsel-babel` Bank BPD Sumsel Babel · `bank-bpd-sumsel-babel-alt` Bank BPD Sumsel Babel (Alt) · `bank-bpd-sumsel-babel-alt-2` Bank BPD Sumsel Babel (Alt-2) · `bank-bpd-sumut` Bank BPD Sumut · `bank-bumi-artha` Bank Bumi Artha · `bank-capital` Bank Capital · `bank-capital-alt` Bank Capital (Alt) · `bank-dki-old` Bank DKI (Old) · `bank-ganesha` Bank Ganesha · `bank-ina` Bank INA · `bank-index-selindo` Bank Index Selindo · `bank-index-selindo-alt` Bank Index Selindo (Alt) · `bank-jakarta` Bank Jakarta · `bank-jasa-jakarta` Bank Jasa Jakarta · `bank-lampung` Bank Lampung · `bank-mas` Bank Mas · `bank-maspion` Bank Maspion · `bank-maspion-alt` Bank Maspion (Alt) · `bank-mayapada` Bank Mayapada · `bank-mayapada-alt` Bank Mayapada (Alt) · `bank-mayora` Bank Mayora · `bank-mestika-dharma` Bank Mestika Dharma · `bank-nagari` Bank Nagari · `bank-of-america` Bank of America · `bank-of-china` Bank of China · `bank-of-india` Bank of India · `bank-of-india-indonesia` Bank of India Indonesia · `bank-raya` Bank Raya · `bank-resona-perdania` Bank Resona Perdania · `bank-resona-perdania-alt` Bank Resona Perdania (Alt) · `bank-sahabat-sampoerna` Bank Sahabat Sampoerna · `bank-saqu` Bank Saqu · `bank-saqu-alt` Bank Saqu (Alt) · `bank-smbc-indonesia` Bank SMBC Indonesia · `bank-victoria` Bank Victoria · `bank-victoria-syariah` Bank Victoria Syariah · `bank-woori-saudara` Bank Woori Saudara · `bca` BCA · `bca-digital` BCA Digital · `bca-syariah` BCA Syariah · `blu-bca` blu by BCA Digital · `bnc` BNC · `bni` BNI · `bnp-paribas` BNP Paribas · `bri` BRI · `bri-alt` BRI (Alt) · `bri-old` BRI (Old) · `bri-vertical` BRI (Vertical) · `bsi` BSI · `bsn` BSN · `bsn-alt` BSN (Alt) · `btn` BTN · `btn-alt` BTN (Alt) · `btn-old` BTN (Old) · `btn-syariah` BTN Syariah · `btn-syariah-old` BTN Syariah (Old) · `btpn` BTPN · `btpn-syariah` BTPN Syariah · `ccb-indonesia` CCB Indonesia · `ccb-indonesia-alt` CCB Indonesia (Alt) · `cimb-niaga` CIMB Niaga · `cimb-niaga-syariah` CIMB Niaga Syariah · `citibank` Citibank · `citibank-alt` Citibank (Alt) · `commonwealth` Commonwealth · `credit-suisse` Credit Suisse · `ctbc-bank` CTBC Bank · `danamon` Danamon · `danamon-mufg` Danamon (MUFG) · `danamon-syariah` Danamon Syariah · `dbs` DBS · `deutsche-bank` Deutsche Bank · `hibank` hibank · `hsbc` HSBC · `ibk-bank` IBK Bank · `icbc` ICBC · `icbc-alt` ICBC (Alt) · `ing-bank` ING Bank · `j-trust-bank` J Trust Bank · `jago` Jago · `jenius` Jenius · `jp-morgan-chase` JP Morgan Chase · `kb-bukopin` KB Bukopin · `kb-bukopin-alt` KB Bukopin (Alt) · `kb-bukopin-syariah` KB Bukopin Syariah · `keb-hana-bank` KEB Hana Bank · `keb-hana-bank-alt` KEB Hana Bank (Alt) · `krom` Krom · `line-bank` LINE Bank · `line-bank-alt` LINE Bank (Alt) · `mandiri` Mandiri · `mandiri-taspen` Mandiri Taspen · `maybank` Maybank · `mega` Mega · `mega-syariah` Mega Syariah · `mizuho-bank` Mizuho Bank · `mnc` MNC · `mnc-bank` MNC Bank · `motion-banking` Motion Banking · `motion-banking-alt` Motion Banking (Alt) · `muamalat` Bank Muamalat · `mufg` MUFG · `mufg-alt` MUFG (Alt) · `nanobank-syariah` Nanobank Syariah · `nanobank-syariah-alt` Nanobank Syariah (Alt) · `nobu` NOBU · `ocbc-nisp` OCBC NISP · `ok-bank` OK Bank · `panin-dubai-syariah` Panin Dubai Syariah · `paninbank` PaninBank · `permata` Permata Bank · `permata-alt` Permata Bank (Alt) · `permata-old` Permata Bank (Old) · `prima-bank` PRIMA Bank · `qnb` QNB · `sbi-indonesia` SBI Indonesia · `seabank` SeaBank · `seabank-alt` SeaBank (Alt) · `shinhan-bank` Shinhan Bank · `shinhan-bank-alt` Shinhan Bank (Alt) · `sinarmas` Sinarmas · `sinarmas-syariah` Sinarmas Syariah · `standard-chartered` Standard Chartered · `superbank` Superbank · `superbank-alt` Superbank (Alt) · `uob` UOB · `welab-bank` Welab Bank

</details>

<details>
<summary><b>Card Payment</b> · 37 logos · <code>card-payment</code></summary>

`american-express` American Express · `american-express-alt` American Express (Alt) · `american-express-alt-2` American Express (Alt-2) · `apple-card` Apple Card · `cirrus` Cirrus · `contactless` Contactless · `contactless-alt` Contactless (Alt) · `discover` Discover · `discover-alt` Discover (Alt) · `gpn` GPN · `jcb` JCB · `maestro` Maestro · `mastercard` Mastercard · `mastercard-black` Mastercard Black · `mastercard-contactless` Mastercard Contactless · `mastercard-contactless-alt` Mastercard Contactless (Alt) · `mastercard-debit` Mastercard Debit · `mastercard-debit-alt` Mastercard Debit (Alt) · `mastercard-securecode` Mastercard SecureCode · `mastercard-securecode-old` Mastercard SecureCode (Old) · `masterpass` Masterpass · `masterpass-alt` Masterpass (Alt) · `samsung-card` Samsung Card · `union-pay` UnionPay · `union-pay-contactless` UnionPay Contactless · `union-pay-contactless-en` UnionPay Contactless (EN) · `union-pay-en` UnionPay (EN) · `verified-by-visa` Verified by VISA · `verified-by-visa-old` Verified by VISA (Old) · `visa` VISA · `visa-checkout` VISA Checkout · `visa-debit` VISA Debit · `visa-pay` VISA Pay · `visa-paywave` VISA PayWave · `visa-plus` VISA Plus · `visa-secure-3ds` VISA Secure (3DS) · `visa-signature` VISA Signature

</details>

<details>
<summary><b>Logistic</b> · 33 logos · <code>logistic</code></summary>

`anteraja` AnterAja · `assa` ASSA · `dakota-cargo` Dakota Cargo · `dakota-logistik` Dakota Logistik · `dhl-express` DHL Express · `ems` EMS · `esl-express` ESL Express · `fedex-express` FedEx Express · `first-logistic` First Logistic · `id-express` ID Express · `indah-cargo` Indah Cargo · `j-and-t-cargo` J&T Cargo · `j-and-t-express` J&T Express · `jne` JNE · `jne-alt` JNE (Alt) · `kai-logistik` KAI Logistik · `lalamove` Lalamove · `lazada-express` Lazada Express · `lion-parcel` Lion Parcel · `ncs` NCS · `ninja-xpress` Ninja Xpress · `pandu-logistics` Pandu Logistics · `pcp-express` PCP Express · `pos-indonesia` Pos Indonesia · `pos-indonesia-old` Pos Indonesia (Old) · `rex` REX · `rpx` RPX · `sap-express` SAP Express · `sicepat-ekspres` SiCepat Ekspres · `spx-express` SPX Express · `tiki` TIKI · `wahana-express` Wahana Express · `wahana-express-alt` Wahana Express (Alt)

</details>

<details>
<summary><b>Insurance</b> · 29 logos · <code>insurance</code></summary>

`aia` AIA · `allianz` Allianz · `allianz-alt` Allianz (Alt) · `astra-life` Astra Life · `astra-life-alt` Astra Life (Alt) · `asuransi-sinarmas-insurtech` Asuransi Sinarmas Insurtech · `axa` AXA · `bca-life` BCA Life · `bpjs` BPJS · `bpjs-alt` BPJS (Alt) · `bpjs-ketenagakerjaan` BPJS Ketenagakerjaan · `bri-insurance` BRI Insurance · `bri-life` BRI Life · `brins` BRINS · `bumiputera` Bumiputera · `chubb` CHUBB · `commonwealth-life` Commonwealth Life · `fwd` FWD · `generali` Generali · `mandiri-inhealth` Mandiri Inhealth · `manulife` Manulife · `manulife-alt` Manulife (Alt) · `prudential` Prudential · `qoala` Qoala · `sequis` Sequis · `sun-life` Sun Life · `taspen` Taspen · `zurich` Zurich · `zurich-alt` Zurich (Alt)

</details>

<details>
<summary><b>Financing</b> · 27 logos · <code>financing</code></summary>

`acc` ACC · `acc-alt` ACC (Alt) · `adakami` AdaKami · `adakami-alt` AdaKami (Alt) · `adira-finance` Adira Finance · `aeon-credit-service` AEON Credit Service · `akulaku` Akulaku · `akulaku-paylater` Akulaku Paylater · `bca-finance` BCA Finance · `bfi-finance` BFI Finance · `bri-finance` BRI Finance · `bussan-auto-finance` Bussan Auto Finance · `daihatsu-financial-service` Daihatsu Financial Service · `fif-astra` FIF Astra · `finmas` Finmas · `gopaylater` GoPay Later · `home-credit` Home Credit · `indodana` Indodana · `kredit-pintar` Kredit Pintar · `kreditplus` KreditPlus · `kredivo` Kredivo · `lexus-financial-service` Lexus Financial Service · `lexus-financial-service-alt` Lexus Financial Service (Alt) · `pegadaian` Pegadaian · `taf-toyota-astra-financial` TAF - Toyota Astra Financial · `toyota-financial-service` Toyota Financial Service · `wom-finance` WOM Finance

</details>

<details>
<summary><b>E-Wallet</b> · 27 logos · <code>e-wallet</code></summary>

`astra-pay` Astra Pay · `bluepay` Bluepay · `dana` DANA · `dipay` Dipay · `doku` DOKU · `dutamoney` Dutamoney · `gopay` GoPay · `gopay-alt` GoPay (Alt) · `i-saku` i.saku · `jakone-pay` JakOne Pay · `kaspro` Kaspro · `linkaja` LinkAja · `motion-pay` Motion Pay · `netzme` Netzme · `otto-pay` OTTO Pay · `ovo` OVO · `ovo-alt` OVO (Alt) · `ovo-old` OVO (Old) · `ovo-old-alt` OVO (Old Alt) · `paydia` Paydia · `paytren` Paytren · `pospay` Pospay · `shopee-pay` Shopee Pay · `speedcash` SpeedCash · `truemoney` TrueMoney · `uangku` Uangku · `yukk` Yukk

</details>

<details>
<summary><b>Entertainment</b> · 26 logos · <code>entertainment</code></summary>

`apple-music` Apple Music · `catchplay` Catchplay · `cgv` CGV · `cinepolis` Cinepolis · `disney-plus` Disney+ · `disney-plus-hotstar` Disney+ Hotstar · `hbo-go` HBO GO · `hoox` HOOX · `joox` JOOX · `langitmusik` Langitmusik · `maxstream` Maxstream · `mnc-vision` MNC Vision · `mtix` m.tix · `netflix` Netflix · `netflix-alt` Netflix (Alt) · `nex-parabola` Nex Parabola · `nickelodeon` Nickelodeon · `prime-video` Prime Video · `spotify` Spotify · `spotify-alt` Spotify (Alt) · `transvision` TransVision · `transvision-old` TransVision (Old) · `vidio` Vidio · `vision-plus` Vision+ · `viu` VIU · `xxi-21` XXI (21)

</details>

<details>
<summary><b>Supermarket</b> · 24 logos · <code>supermarket</code></summary>

`aeon` AEON · `alfa-express` Alfa Express · `alfamart` Alfamart · `alfamidi` Alfamidi · `alfamidi-super` Alfamidi Super · `bright` Bright · `circle-k` Circle K · `circle-k-alt` Circle K (Alt) · `dan-plus-dan` Dan+Dan · `family-mart` Family Mart · `giant` Giant · `hero` Hero · `hypermart` Hypermart · `indogrosir` Indogrosir · `indomaret` Indomaret · `lawson` Lawson · `lotte` Lotte · `lotte-grosir` Lotte Grosir · `lotte-mart` Lotte Mart · `super-indo` Super Indo · `the-foodhall` The Foodhall · `toserba-yogya` Toserba Yogya · `transmart` Transmart · `yomart` Yomart

</details>

<details>
<summary><b>Miscellaneous</b> · 21 logos · <code>miscellaneous</code></summary>

`alipay` Alipay · `alipay-old` Alipay (Old) · `alipay-plus` Alipay+ · `alipay-plus-old` Alipay+ (Old) · `alipay-plus-old-alt` Alipay+ (Old Alt) · `apple-pay` Apple Pay · `dbs-paylah` DBS Paylah · `google-pay` Google Pay · `grab-pay` Grab Pay · `interlink` Interlink · `line-pay` LINE Pay · `line-pay-alt` LINE Pay (Alt) · `nets` NETS · `ocbc-pay-anyone` OCBC Pay Anyone · `samsung-pay` Samsung Pay · `samsung-pay-alt` Samsung Pay (Alt) · `verifone` Verifone · `verifone-old` Verifone (Old) · `wechat-pay` WeChat Pay · `wechat-pay-alt` WeChat Pay (Alt) · `wirecard` Wirecard

</details>

<details>
<summary><b>Mobile Telco</b> · 20 logos · <code>mobile-telco</code></summary>

`axis` AXIS · `by-u` by.U · `im3` IM3 · `kartu-as` Kartu As · `kartu-halo` Kartu Halo · `live-on` Live.On · `mentari-ooredoo` Mentari Ooredoo · `simpati` simPATI · `simpati-old` simPATI (Old) · `smartfren` Smartfren · `smartfren-old` Smartfren (Old) · `telkomsel` Telkomsel · `telkomsel-alt` Telkomsel (Alt) · `telkomsel-halo` Telkomsel Halo · `telkomsel-prabayar` Telkomsel Prabayar · `tri` Tri · `xl` XL · `xl-prioritas` XL Prioritas · `xl-smart` XL Smart · `xl-smart-alt` XL SMART (Alt)

</details>

<details>
<summary><b>Bank App</b> · 17 logos · <code>bank-app</code></summary>

`bca-mobile` BCA Mobile · `bni-mobile-banking` BNI Mobile Banking · `brimo` BRImo · `bsi-mobile` BSI Mobile · `byond-bsi` BYOND by BSI · `byond-bsi-alt` BYOND by BSI (Alt) · `digibank` Digibank · `digibank-alt` Digibank (Alt) · `jago-app` Jago · `jakone-mobile` JakOne Mobile · `jenius-app` Jenius · `mandiri-livin` Livin' by Mandiri · `mandiri-livin-old` Livin' by Mandiri (Old) · `neobank` Neobank · `octo-clicks` OCTO Clicks · `uob-tmrw` UOB TMRW · `wondr-by-bni` Wondr by BNI

</details>

<details>
<summary><b>Regulatory</b> · 15 logos · <code>regulatory</code></summary>

`afpi` AFPI · `aspi` ASPI · `ayo-ke-bank` AYO ke Bank · `bank-indonesia` Bank Indonesia · `bappebti` BAPPEBTI · `bpd` BPD · `ekonomi-syariah` Ekonomi Syariah · `ekonomi-syariah-alt` Ekonomi Syariah (Alt) · `inklusi-keuangan` Inklusi Keuangan · `kominfo` KOMINFO · `lps` LPS · `ojk` OJK · `perbankan-syariah-ib` Perbankan Syariah (IB) · `world-bank` World Bank · `world-bank-alt` World Bank (Alt)

</details>

<details>
<summary><b>Game</b> · 15 logos · <code>game</code></summary>

`app-store` App Store · `apple-arcade` Apple Arcade · `ea-play` EA Play · `ea-play-alt` EA Play (Alt) · `epic-games` Epic Games · `epic-games-store` Epic Games Store · `google-play` Google Play · `google-play-alt` Google Play (Alt) · `my-nintendo` My Nintendo · `nintendo-online` Nintendo Online · `playstation-plus` PlayStation Plus · `playstation-store` PlayStation Store · `steam` Steam · `ubisoft-plus` UBISOFT+ · `xbox-game-pass` XBOX Game Pass

</details>

<details>
<summary><b>ISP</b> · 15 logos · <code>isp</code></summary>

`biznet` Biznet · `biznet-home` Biznet Home · `cbn` CBN · `first-media` First Media · `iconnet` Iconnet · `indihome` IndiHome · `indihome-old` IndiHome (Old) · `indosat-hifi` Indosat Hifi · `indosat-m2` Indosat M2 · `melsa` Melsa · `myrepublic` MyRepublic · `oxygen-id` Oxygen.id · `oxygen-id-home` Oxygen.id Home · `telkomsel-orbit` Telkomsel Orbit · `xl-satu` XL Satu

</details>

<details>
<summary><b>Remittance</b> · 14 logos · <code>remittance</code></summary>

`flip` Flip · `moneygram` MoneyGram · `payoneer` Payoneer · `paypal` PayPal · `paypal-old` PayPal (Old) · `ria-money` Ria Money · `skrill` Skrill · `swift` SWIFT · `swift-alt` SWIFT (Alt) · `topremit` Topremit · `topremit-alt` Topremit (Alt) · `transfez` Transfez · `western-union` Western Union · `wise` Wise

</details>

<details>
<summary><b>Switching</b> · 13 logos · <code>switching</code></summary>

`alto` ALTO · `atm-bersama` ATM Bersama · `atm-link` ATM Link · `bca-atm` BCA ATM · `bca-debit` BCA Debit · `bi-fast` BI-FAST · `jalin` Jalin · `link` Link · `link-alt` Link (Alt) · `link-old` Link (Old) · `meps` MEPS · `prima` PRIMA · `prima-debit` PRIMA Debit

</details>

<details>
<summary><b>E-Commerce</b> · 12 logos · <code>e-commerce</code></summary>

`bhinneka` Bhinneka · `blibli` Blibli · `bukalapak` Bukalapak · `bukalapak-alt` Bukalapak (Alt) · `bukalapak-old` Bukalapak (Old) · `lazada` Lazada · `shopee` Shopee · `shopee-alt` Shopee (Alt) · `tiktok-shop` TikTok Shop · `tokopedia` Tokopedia · `tokopedia-alt` Tokopedia (Alt) · `zalora` Zalora

</details>

<details>
<summary><b>Transportation</b> · 12 logos · <code>transportation</code></summary>

`cititrans` Cititrans · `damri` DAMRI · `daytrans` DayTrans · `jaklingko` JakLingko · `kai` KAI · `kai-bandara` KAI Bandara · `kai-commuter` KAI Commuter · `kai-commuter-old` KAI Commuter (Old) · `lrt-jakarta` LRT Jakarta · `mrt-jakarta` MRT Jakarta · `transjakarta` TransJakarta · `whoosh` Whoosh

</details>

<details>
<summary><b>Payment Gateway</b> · 10 logos · <code>payment-gateway</code></summary>

`2c2p` 2c2p · `2c2p-alt` 2c2p (Alt) · `2c2p-old` 2c2p (Old) · `espay` Espay · `finpay` Finpay · `ipay88` ipay88 · `midtrans` Midtrans · `prismalink` PrismaLink · `stripe` Stripe · `xendit` Xendit

</details>

<details>
<summary><b>QR Payment</b> · 11 logos · <code>qr-payment</code></summary>

`duitnow` DuitNow · `duitnow-qr` DuitNow QR · `khqr` KHQR · `lao-qr` LAO QR · `qr-ph` QR Ph · `qris` QRIS · `sgqr` SGQR · `sgqr-plus` SGQR+ · `thai-qr-payment` Thai QR Payment · `thai-qr-payment-alt` Thai QR Payment (Alt) · `vietqr` VietQR

</details>

<details>
<summary><b>Prepaid Card</b> · 9 logos · <code>prepaid-card</code></summary>

`bca-flazz` BCA Flazz · `bca-flazz-alt` BCA Flazz (Alt) · `bca-flazz-old` BCA Flazz (Old) · `bni-tapcash` BNI TapCash · `bri-brizzi` BRI BRIZZI · `bri-brizzi-alt` BRI BRIZZI (Alt) · `e-toll-card` e-Toll Card · `jakcard` Jakcard · `mandiri-e-money` Mandiri e-money

</details>

<details>
<summary><b>Direct Debit</b> · 6 logos · <code>direct-debit</code></summary>

`bca-klikpay` BCA KlikPay · `bri-direct-debit` BRI Direct Debit · `jenius-pay` Jenius Pay · `mandiri-e-cash` Mandiri E-Cash · `oneklik` OneKlik · `uob-ez-pay` UOB EZ Pay

</details>

<details>
<summary><b>Donation</b> · 7 logos · <code>donation</code></summary>

`baznas` BAZNAS · `dompet-dhuafa` Dompet Dhuafa · `dompet-dhuafa-alt` Dompet Dhuafa (Alt) · `kitabisa` Kitabisa · `kitabisa-alt` Kitabisa (Alt) · `rumah-zakat` Rumah Zakat · `rumah-zakat-alt` Rumah Zakat (Alt)

</details>

<details>
<summary><b>Utilities</b> · 7 logos · <code>utilities</code></summary>

`aetra-tangerang` Aetra Tangerang · `pam-jaya` PAM Jaya · `pam-jaya-old` PAM Jaya (Old) · `pdam` PDAM · `pdam-kota-surabaya` PDAM Kota Surabaya · `pgn` PGN · `pln` PLN

</details>

<details>
<summary><b>Government</b> · 5 logos · <code>government</code></summary>

`bea-cukai` Bea Cukai · `djp-online` DJP Online · `djp-online-alt` DJP Online (Alt) · `kemenkeu` Kemenkeu · `korlantas-polri` Korlantas Polri

</details>

> The list above is generated from [`data/logos.yml`](./data/logos.yml). Missing or wrong? That file is the source of truth — open an issue or PR against it.

---

## Design source (Figma)

The original artwork lives in three Figma community files. They're the canonical place to **browse, preview, and duplicate** the logos for design work. The packages here are the **code distribution** of the same set — use Figma when designing, use the packages when shipping.

| Library | Figma community file |
|---|---|
| **Bank Logo Library — Indonesia** | https://www.figma.com/community/file/1246763677986037137/bank-logo-library-indonesia-in-svg-format |
| **Payment Channel Logo Library — Indonesia** | https://www.figma.com/community/file/1263416469504652135/payment-channel-logo-library-indonesia-in-svg-format |
| **Bill Payment Logo Library — Indonesia** | https://www.figma.com/community/file/1325472637345495839/bill-payment-logo-library-indonesia-in-svg-format |

Spot a discrepancy between a logo here and the corresponding Figma file? Please [open an issue](https://github.com/hafidznoor/idn-finlogos/issues) — the goal is to keep both in sync.

---

## FAQ

**Q: Are the SVGs free to use commercially?**
The build tooling is MIT-licensed (free for any use). The SVG artwork is CC BY-NC 4.0 (non-commercial). The trademarks themselves belong to their holders — **commercial use of any individual brand mark requires permission from that brand**. See [License](#license).

**Q: Weren't some slugs misspelled (e.g. "amercian-express-alt", "mualamat")?**
They were, inherited from v1 (`indo-financial-logolibrary`). v2.4.0 fixed the spellings (`american-express-alt`, `muamalat`) and cleaned up numbered slugs (`bank-dki-1` → `bank-dki-alt`). The old slugs live on as **aliases**, so `getLogo('mualamat')` and `getLogo('bank-dki-1')` still resolve — nothing breaks. See [MIGRATION.md](./MIGRATION.md) for the full rename table.

**Q: A brand rebranded — which slug gets the new logo?**
The bare slug, always. When a brand refreshes its logo, the new art takes over the bare slug (`bri`) and the previous art moves to `<brand>-old` (`bri-old`). So pinning the bare slug in your code means you automatically get the current logo on every update. v2.4 cleaned up the legacy `-new` suffixes this way — see [MIGRATION.md](./MIGRATION.md).

**Q: Can I request a missing logo?**
Yes — open an issue at [github.com/hafidznoor/idn-finlogos/issues](https://github.com/hafidznoor/idn-finlogos/issues) with the brand name, your source for the vector, and the trademark holder. PRs against [`data/logos.yml`](./data/logos.yml) and `icons/<slug>.svg` welcome.

**Q: Why are mobile packages so big?**
Each platform bundles all 572 SVGs as native resources (~8.5 MB optimized). If you only need a few, the npm package is tree-shakeable — pick the per-logo ESM import path on the web. On mobile, the assets are stored as platform resources and lazily decoded.

**Q: Do I need a separate SVG renderer on Android, iOS, or Flutter?**
Yes — this package ships only the SVG files plus a catalog. Pair with **Coil** + `coil-svg` on Android, **SVGKit** on iOS, **flutter_svg** on Flutter (or any equivalent).

**Q: What's the difference between Maven Central and JitPack for Android?**
Same artifact, different repositories. Maven Central is canonical and recommended. JitPack is a fallback for when a new version hasn't propagated to Maven Central yet — useful for early adopters.

**Q: Is there a GitHub Packages mirror?**
Yes, for npm (`@hafidznoor/idn-finlogos`) and Android Maven (`io.github.hafidznoor:idn-finlogos`). See [GitHub Packages (mirror)](#from-github-packages-mirror). The canonical channels remain recommended.

**Q: What does the catalog API return?**
Every platform exposes `all`, `byCategory(slug)`, `get(slug)`, and `search(query)`. The shape is `{ slug, name, category, aliases, tags, ... }` plus a platform-appropriate way to get the SVG (string on web, asset path on Android/Flutter, URL on iOS).

---

## License

**Dual-licensed.** Read both — they cover different parts of this package.

- Build tooling, scripts, and module wrappers → **MIT** (see [LICENSE](./LICENSE))
- SVG logo assets → **CC BY-NC 4.0** (see [LICENSE-ASSETS](./LICENSE-ASSETS))

The underlying logo marks remain the property of their respective trademark holders. Inclusion here does not imply endorsement. See [NOTICE](./NOTICE) for the full disclaimer.

> **Commercial use of the SVG assets requires permission from the trademark holder of each respective logo.**

---

## Contributing

This is a curated collection. To request a logo add/remove/update, open an issue at [github.com/hafidznoor/idn-finlogos/issues](https://github.com/hafidznoor/idn-finlogos/issues) — include the brand name, your source for the vector, and the trademark holder.

For maintainers, the build pipeline is:

```bash
npm install
npm run validate    # check icons/ ↔ data/logos.yml consistency
npm run build       # produces dist/
npm run build:all   # produces dist/ + Android + iOS + Flutter assets
npm pack --dry-run  # inspect the publishable tarball
```

The source of truth is [`data/logos.yml`](./data/logos.yml). Edit display names, add `aliases`, or add `tags` there — the build re-emits the manifest.

---

## Support this project

Maintaining `idn-finlogos` means tracking every rebrand, new digital bank, fresh e-wallet, and OJK-licensed lender across Indonesia — then redrawing each mark as a clean, optimized SVG and shipping it to npm, Maven Central, and pub.dev. It's a one-person effort, kept free and open for the Indonesian developer community.

If this package saved you time on a checkout screen, payment UI, or fintech dashboard, please consider supporting future updates:

[![Support on Lemon Squeezy](https://img.shields.io/badge/☕%20Buy%20me%20a%20coffee-Lemon%20Squeezy-FFC233?logo=lemonsqueezy&logoColor=white&style=for-the-badge)](https://hafidznoor.lemonsqueezy.com/checkout/buy/f2b81ada-e8a9-4e29-b35c-7b7249b78404)

Every contribution directly funds new logos, faster turnaround on rebrand requests, and continued maintenance of the Android, iOS, Flutter, and web packages. Thank you. 🙏

---

## Project activity

**npm downloads** — interactive trends on [npmcharts](https://npmcharts.com/compare/idn-finlogos?interval=30):

[![npm downloads](https://img.shields.io/npm/dm/idn-finlogos?logo=npm&label=downloads%2Fmonth)](https://npmcharts.com/compare/idn-finlogos?interval=30)

**GitHub stars over time** — powered by [Star History](https://www.star-history.com/#hafidznoor/idn-finlogos&Date):

[![Star History Chart](https://api.star-history.com/svg?repos=hafidznoor/idn-finlogos&type=Date)](https://www.star-history.com/#hafidznoor/idn-finlogos&Date)

---

## Keywords

`indonesia fintech logos` · `indonesia` · `indonesian banks` · `bank logos` · `e-wallet icons` · `payment gateway logos` · `fintech` · `svg` · `icons` · `react` · `vue` · `svelte` · `nextjs` · `android` · `ios` · `swift` · `kotlin` · `flutter` · `dart` · `bca` · `mandiri` · `bri` · `bni` · `dana` · `gopay` · `ovo` · `shopeepay` · `bi-fast` · `qris` · `ojk` · `bank indonesia` · `npm package` · `maven central` · `pub.dev`
