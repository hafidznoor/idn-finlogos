# idn-finlogos

Indonesian financial institution logos — banks, e-wallets, payment gateways, switching, regulatory, and 18 more categories — as optimized SVGs, available on **npm, Maven Central, Swift Package Manager, and pub.dev**.

**489 logos · 23 categories · SVG only · zero runtime dependencies**

> v2 of the original `indo-financial-logolibrary`. See [MIGRATION.md](./MIGRATION.md) if you're upgrading.

---

## About this project

`idn-finlogos` is a curated, cross-platform asset library that solves a recurring problem for anyone shipping a product that touches Indonesian money flows: there is no single, reliable place to get clean SVGs for the local banks, e-wallets, payment rails, switching networks, regulators, and adjacent brands you need to render in your UI. Designers re-trace them from screenshots, engineers paste hotlinked PNGs from blog posts, and every team ends up maintaining a slightly-different fork of the same handful of marks.

This package replaces that with one source of truth:

- **One catalog, four package ecosystems.** A single YAML manifest (`data/logos.yml`) plus the SVGs in `icons/` are compiled into native packages for **Web (npm)**, **Android (Maven Central / JitPack)**, **iOS (Swift Package Manager)**, and **Flutter (pub.dev)** — so the same `bca` slug returns the same artwork on every platform.
- **Optimized for production use.** Every SVG is run through SVGO with a shared config, validated against the manifest in CI, and shipped as raw files (for `<img>` / asset pipelines), per-logo ESM modules (for tree-shaking on the web), and platform-native resources (`assets/` on Android & Flutter, bundle resources on iOS).
- **Catalog API on every platform.** Beyond raw files, every language target exposes the same shape: `all`, `byCategory(...)`, `get(slug)`, `search(query)` — so you can build pickers, settings pages, and dynamic UIs without re-implementing the index.
- **Designed for breadth, not just the top 10.** The set spans 153 banks (national, regional BPDs, syariah, foreign branches), all major e-wallets and switching networks (DANA, GoPay, OVO, BI-FAST, PRIMA, ALTO, Jalin), card schemes, regulators (OJK, BI, LPS, AFPI), telcos, ISPs, utilities, logistics, and entertainment subscriptions you'll see on a typical Indonesian checkout page.
- **Honest about licensing.** Build tooling is MIT; the SVG artwork is **CC BY-NC 4.0**, and the trademarks themselves remain the property of their respective holders. Commercial use of any individual mark needs permission from that brand — see [License](#license) below.

### Who it's for

- **Fintech & banking apps** rendering account/source pickers, payment method lists, transfer destination autocomplete, or transaction history rows.
- **Payment gateways & PSPs** building checkout UIs that need to show every supported issuer, wallet, and switching network.
- **Marketplaces & e-commerce** showing accepted payment methods, logistics options, or telco operators on a top-up page.
- **Design systems & internal tools** that need a stable, versioned catalog instead of one-off Figma exports per team.

### Where the assets come from

The artwork is hand-curated from the public Figma community libraries linked in [Design source (Figma)](#design-source-figma) below. The npm/Maven/SPM/pub.dev packages are the production-grade, optimized, code-callable distribution of those Figma files — same artwork, redistributed in formats your build system can consume directly.

---

## Install

| Platform | Install |
|---|---|
| **Web (npm)** | `npm install idn-finlogos` |
| **Android (Gradle / Maven Central)** | `implementation("io.github.hafidznoor:idn-finlogos:2.1.3")` |
| **iOS (Swift Package Manager)** | `.package(url: "https://github.com/hafidznoor/idn-finlogos", from: "2.1.3")` |
| **Flutter (pub.dev)** | `flutter pub add idn_finlogos` |
| **Web (CDN)** | `https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/<slug>.svg` |

Each package ships the same 489 SVGs generated from a single source of truth (`data/logos.yml` + `icons/`). Mobile packages bundle the SVGs as platform-native resources; web packages ship them as ESM modules and raw files.

### GitHub Packages (mirror)

The npm and Android artifacts are also mirrored to GitHub Packages alongside the canonical npmjs.org / Maven Central releases. The canonical channels above remain the recommended install paths. GitHub Packages requires authentication even for public packages — generate a [Personal Access Token](https://github.com/settings/tokens) with the `read:packages` scope first.

**npm** — add to `~/.npmrc` (or a project-local `.npmrc`):

```
@hafidznoor:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

Then install the scoped mirror:

```
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
implementation("io.github.hafidznoor:idn-finlogos:2.1.3")
```

---

## Design source (Figma)

The original artwork lives in three Figma community files. They are the canonical place to **browse, preview, and duplicate** the logos for design work. The packages on this repo are the **code distribution** of the same set — use Figma when designing, use the packages when shipping.

| Library | Figma community file |
|---|---|
| **Bank Logo Library — Indonesia** | https://www.figma.com/community/file/1246763677986037137/bank-logo-library-indonesia-in-svg-format |
| **Payment Channel Logo Library — Indonesia** | https://www.figma.com/community/file/1263416469504652135/payment-channel-logo-library-indonesia-in-svg-format |
| **Bill Payment Logo Library — Indonesia** | https://www.figma.com/community/file/1325472637345495839/bill-payment-logo-library-indonesia-in-svg-format |

If you notice a discrepancy between a logo here and the corresponding Figma file (an updated brand mark, a missing variant), please [open an issue](https://github.com/hafidznoor/idn-finlogos/issues) — the goal is to keep both in sync.

---

## Web (npm) — four ways to use it

### 1. Per-logo ESM import (recommended for app bundles)

Tree-shakeable. Only the logos you import end up in your bundle.

```js
import bca from 'idn-finlogos/icons/bca';
import gopay from 'idn-finlogos/icons/gopay';
import doku from 'idn-finlogos/icons/doku';

// Each import is the SVG markup as a string.
document.getElementById('logo').innerHTML = bca;
```

In React:
```jsx
import bca from 'idn-finlogos/icons/bca';

function BcaLogo() {
  return <span dangerouslySetInnerHTML={{ __html: bca }} />;
}
```

### 2. Raw SVG file as URL (for `<img src>`, asset pipelines)

```js
import bcaUrl from 'idn-finlogos/icons/bca.svg';
// → '/assets/bca-abc123.svg' (your bundler hashes it)

<img src={bcaUrl} alt="BCA" />
```

### 3. Metadata helpers (for catalog pages, dynamic pickers)

```js
import { listLogos, getLogo, getLogoUrl, getCategories } from 'idn-finlogos';

listLogos();                                // → all 489
listLogos({ category: 'bank-logo' });       // → 153 banks
listLogos({ search: 'syariah' });           // → fuzzy match by name/slug/alias

getCategories();
// → [{ slug: 'bank-logo', displayName: 'Bank Logo', count: 153 }, ...]

await getLogo('bca');
// → { slug, name, category, svg: '<svg>...</svg>', ... }

getLogoUrl('bca');
// → 'https://cdn.jsdelivr.net/npm/idn-finlogos@2.1.3/dist/icons/bca.svg'
```

### 4. CDN — no install, no build step

```html
<img src="https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/bca.svg" />
<img src="https://unpkg.com/idn-finlogos@2/dist/icons/gopay.svg" />
```

Pin a major (`@2`), minor (`@2.1`), or exact version (`@2.1.3`).

---

## Android

```kotlin
// app/build.gradle.kts
dependencies {
    implementation("io.github.hafidznoor:idn-finlogos:2.1.3")
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

Catalog API: `IdnFinLogos.all`, `byCategory(...)`, `get(...)`, `search(...)`. See [platforms/android/README.md](./platforms/android/README.md).

JitPack also works without waiting on Maven Central — add `maven { url = uri("https://jitpack.io") }` to your repositories and use `com.github.hafidznoor:idn-finlogos:2.1.3`.

---

## iOS

```swift
// Package.swift
.package(url: "https://github.com/hafidznoor/idn-finlogos", from: "2.1.3")
```

Add **SVGKit** (or your preferred SVG renderer) separately:

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

Catalog API: `IdnFinLogos.all`, `byCategory(_:)`, `get(_:)`, `search(_:)`. Minimum platforms: iOS 13, macOS 11, tvOS 13, watchOS 6.

---

## Flutter

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

Catalog API: `IdnFinLogos.all`, `byCategory(...)`, `get(...)`, `search(...)`. See [platforms/flutter/README.md](./platforms/flutter/README.md).

---

## Categories

23 categories, browseable via `getCategories()` or `data/categories.yml`:

`bank-logo` · `bank-app` · `card-payment` · `direct-debit` · `donation` · `e-commerce` · `e-wallet` · `entertainment` · `financing` · `game` · `government` · `isp` · `logistic` · `miscellaneous` · `mobile-telco` · `payment-gateway` · `prepaid-card` · `regulatory` · `remittance` · `supermarket` · `switching` · `transportation` · `utilities`

---

## Logo list

All 489 logos, grouped by category and sorted by name. Click a section to expand. The `code` is the slug you pass to `getLogo()`, `IdnFinLogos.get(...)`, or use as a file name (`icons/<slug>.svg`).

<details>
<summary><b>Bank Logo</b> · 153 logos · <code>bank-logo</code></summary>

`aladin` Aladin · `allo` Allo · `amar-bank` Amar Bank · `anz` ANZ · `bangkok-bank` Bangkok Bank · `bank-artha-graha-internasional` Bank Artha Graha Internasional · `bank-bengkulu` Bank Bengkulu · `bank-bjb` Bank BJB · `bank-bjb-syariah` Bank BJB Syariah · `bank-bpd-aceh` Bank BPD Aceh · `bank-bpd-bali` Bank BPD Bali · `bank-bpd-banten` Bank BPD Banten · `bank-bpd-diy` Bank BPD DIY · `bank-bpd-jambi` Bank BPD Jambi · `bank-bpd-jateng` Bank BPD Jateng · `bank-bpd-jatim` Bank BPD Jatim · `bank-bpd-kalbar` Bank BPD Kalbar · `bank-bpd-kalbar-alt` Bank BPD Kalbar (Alt) · `bank-bpd-kalimantan-timur` Bank BPD Kalimantan Timur · `bank-bpd-kalsel` Bank BPD Kalsel · `bank-bpd-kalteng` Bank BPD Kalteng · `bank-bpd-lampung` Bank BPD Lampung · `bank-bpd-maluku-malut` Bank BPD Maluku Malut · `bank-bpd-ntb-syariah` Bank BPD NTB Syariah · `bank-bpd-ntb-syariah-alt` Bank BPD NTB Syariah (Alt) · `bank-bpd-ntt` Bank BPD NTT · `bank-bpd-papua` Bank BPD Papua · `bank-bpd-riau-kepri` Bank BPD Riau Kepri · `bank-bpd-riau-kepri-syariah` Bank BPD Riau Kepri Syariah · `bank-bpd-sulselbar` Bank BPD Sulselbar · `bank-bpd-sulteng` Bank BPD Sulteng · `bank-bpd-sultra` Bank BPD Sultra · `bank-bpd-sulutgo` Bank BPD Sulutgo · `bank-bpd-sumsel-babel` Bank BPD Sumsel Babel · `bank-bpd-sumsel-babel-alt-1` Bank BPD Sumsel Babel (Alt-1) · `bank-bpd-sumsel-babel-alt-2` Bank BPD Sumsel Babel (Alt-2) · `bank-bpd-sumut` Bank BPD Sumut · `bank-bumi-artha` Bank Bumi Artha · `bank-capital` Bank Capital · `bank-capital-alt` Bank Capital (Alt) · `bank-dki` Bank DKI · `bank-ganesha` Bank Ganesha · `bank-ina` Bank INA · `bank-index-selindo` Bank Index Selindo · `bank-index-selindo-alt` Bank Index Selindo (Alt) · `bank-jasa-jakarta` Bank Jasa Jakarta · `bank-lampung` Bank Lampung · `bank-mas` Bank Mas · `bank-maspion` Bank Maspion · `bank-maspion-alt` Bank Maspion (Alt) · `bank-mayapada` Bank Mayapada · `bank-mayapada-alt` Bank Mayapada (Alt) · `bank-mayora` Bank Mayora · `bank-mestika-dharma` Bank Mestika Dharma · `bank-nagari` Bank Nagari · `bank-of-america` Bank of America · `bank-of-china` Bank of China · `bank-of-india` Bank of India · `bank-of-india-indonesia` Bank of India Indonesia · `bank-raya` Bank Raya · `bank-resona-perdania` Bank Resona Perdania · `bank-resona-perdania-alt` Bank Resona Perdania (Alt) · `bank-sahabat-sampoerna` Bank Sahabat Sampoerna · `bank-smbc-indonesia` Bank SMBC Indonesia · `bank-victoria` Bank Victoria · `bank-victoria-syariah` Bank Victoria Syariah · `bank-woori-saudara` Bank Woori Saudara · `bca` BCA · `bca-digital` BCA Digital · `bca-syariah` BCA Syariah · `blu-bca` Blu BCA · `bnc` BNC · `bni` BNI · `bnp-paribas` BNP Paribas · `bri` BRI · `bri-alt` BRI (Alt) · `bri-vertical` BRI (Vertical) · `bsi` BSI · `btn` BTN · `btn-alt` BTN (Alt) · `btn-new` BTN (New) · `btn-syariah` BTN Syariah · `btn-syariah-new` BTN Syariah (New) · `btpn` BTPN · `btpn-syariah` BTPN Syariah · `ccb-indonesia` CCB Indonesia · `ccb-indonesia-alt` CCB Indonesia (Alt) · `cimb-niaga` CIMB Niaga · `cimb-niaga-syariah` CIMB Niaga Syariah · `citibank` Citibank · `citibank-alt` Citibank (Alt) · `commonwealth` Commonwealth · `credit-suisse` Credit Suisse · `ctbc-bank` CTBC Bank · `danamon` Danamon · `danamon-mufg` Danamon (MUFG) · `danamon-syariah` Danamon Syariah · `dbs` DBS · `deutsche-bank` Deutsche Bank · `hibank` hibank · `hsbc` HSBC · `ibk-bank` IBK Bank · `icbc` ICBC · `icbc-alt` ICBC (Alt) · `ing-bank` ING Bank · `j-trust-bank` J Trust Bank · `jago` Jago · `jenius` Jenius · `jp-morgan-chase` JP Morgan Chase · `kb-bukopin` KB Bukopin · `kb-bukopin-alt` KB Bukopin (Alt) · `kb-bukopin-syariah` KB Bukopin Syariah · `keb-hana-bank` KEB Hana Bank · `keb-hana-bank-alt` KEB Hana Bank (Alt) · `krom` Krom · `line-bank` LINE Bank · `line-bank-alt` LINE Bank (Alt) · `mandiri` Mandiri · `mandiri-taspen` Mandiri Taspen · `maybank` Maybank · `mega` Mega · `mega-syariah` Mega Syariah · `mizuho-bank` Mizuho Bank · `mnc` MNC · `mnc-bank` MNC Bank · `motion-banking` Motion Banking · `motion-banking-alt` Motion Banking (Alt) · `mualamat` Mualamat · `mufg` MUFG · `mufg-alt` MUFG (Alt) · `nanobank-syariah` Nanobank Syariah · `nanobank-syariah-alt` Nanobank Syariah (Alt) · `nobu` NOBU · `ocbc-nisp` OCBC NISP · `ok-bank` OK Bank · `panin-dubai-syariah` Panin Dubai Syariah · `paninbank` PaninBank · `permata` Permata · `permata-bank-alt` Permata Bank (Alt) · `permata-bank-new` Permata Bank (New) · `prima-bank` PRIMA Bank · `qnb` QNB · `sbi-indonesia` SBI Indonesia · `seabank` SeaBank · `shinhan-bank` Shinhan Bank · `shinhan-bank-alt` Shinhan Bank (Alt) · `sinarmas` Sinarmas · `sinarmas-syariah` Sinarmas Syariah · `standard-chartered` Standard Chartered · `superbank` Superbank · `superbank-alt` Superbank (Alt) · `uob` UOB · `welab-bank` Welab Bank

</details>

<details>
<summary><b>Card Payment</b> · 37 logos · <code>card-payment</code></summary>

`amercian-express-alt` Amercian Express (Alt) · `american-express` American Express · `american-express-alt-2` American Express (Alt-2) · `apple-card` Apple Card · `cirrus` Cirrus · `contactless` Contactless · `contactless-alt` Contactless (Alt) · `discover` Discover · `discover-alt` Discover (Alt) · `gpn` GPN · `jcb` JCB · `maestro` Maestro · `mastercard` Mastercard · `mastercard-black` Mastercard Black · `mastercard-contactless` Mastercard Contactless · `mastercard-contactless-alt` Mastercard Contactless (Alt) · `mastercard-debit` Mastercard Debit · `mastercard-debit-alt` Mastercard Debit (Alt) · `mastercard-securecode` Mastercard SecureCode · `mastercard-securecode-new` Mastercard SecureCode (New) · `masterpass` Masterpass · `masterpass-alt` Masterpass (Alt) · `samsung-card` Samsung Card · `union-pay` Union Pay · `union-pay-en` Union Pay (EN) · `union-pay-contactless` Union Pay Contactless · `union-pay-contactless-en` Union Pay Contactless (EN) · `verified-by-visa` Verified by VISA · `verified-by-visa-new` Verified by VISA (New) · `visa` VISA · `visa-checkout` VISA Checkout · `visa-debit` VISA Debit · `visa-pay` VISA Pay · `visa-paywave` VISA PayWave · `visa-plus` VISA Plus · `visa-secure-3ds` VISA Secure (3DS) · `visa-signature` VISA Signature

</details>

<details>
<summary><b>Logistic</b> · 32 logos · <code>logistic</code></summary>

`anteraja` Anteraja · `assa` ASSA · `dakota-cargo` Dakota Cargo · `dakota-logistik` Dakota Logistik · `dhl-express` DHL Express · `ems` EMS · `esl-express` ESL Express · `fedex-express` FedEx Express · `first-logistic` First Logistic · `id-express` ID Express · `j-and-t-cargo` J&T Cargo · `j-and-t-express` J&T Express · `jne` JNE · `jne-alt` JNE (Alt) · `kai-logistik` KAI Logistik · `lalamove` Lalamove · `lazada-express` Lazada Express · `lion-parcel` Lion Parcel · `ncs` NCS · `ninja-xpress` Ninja Xpress · `pandu-logistics` Pandu Logistics · `pcp-express` PCP Express · `pos-indonesia-new` Pos Indonesia (New) · `pos-indonesia-old` Pos Indonesia (Old) · `rex` REX · `rpx` RPX · `sap-express` SAP Express · `sicepat-ekspres` Sicepat Ekspres · `spx-express` SPX Express · `tiki` TIKI · `wahana-express` Wahana Express · `wahana-express-alt` Wahana Express (Alt)

</details>

<details>
<summary><b>E-Wallet</b> · 27 logos · <code>e-wallet</code></summary>

`astra-pay` Astra Pay · `bluepay` Bluepay · `dana` DANA · `dipay` Dipay · `doku` DOKU · `dutamoney` Dutamoney · `gopay` Gopay · `gopay-alt` Gopay (Alt) · `i-saku` I.Saku · `jakone-pay` JakOne Pay · `kaspro` Kaspro · `linkaja` LinkAja · `motion-pay` Motion Pay · `netzme` Netzme · `otto-pay` OTTO Pay · `ovo-new-alt` OVO (New Alt) · `ovo-new` OVO (New) · `ovo-old-alt` OVO (Old Alt) · `ovo-old` OVO (Old) · `paydia` Paydia · `paytren` Paytren · `pospay` Pospay · `shopee-pay` Shopee Pay · `speedcash` SpeedCash · `truemoney` TrueMoney · `uangku` Uangku · `yukk` Yukk

</details>

<details>
<summary><b>Entertainment</b> · 26 logos · <code>entertainment</code></summary>

`apple-music` Apple Music · `catchplay` Catchplay · `cgv` CGV · `cinepolis` Cinepolis · `disney-plus` Disney+ · `disney-plus-hotstar` Disney+ Hotstar · `hbo-go` HBO GO · `hoox` HOOX · `joox` JOOX · `langitmusik` Langitmusik · `maxstream` Maxstream · `mnc-vision` MNC Vision · `mtix` MTIX · `netflix` Netflix · `netflix-alt` Netflix (Alt) · `nex-parabola` Nex Parabola · `nickelodeon` Nickelodeon · `prime-video` Prime Video · `spotify` Spotify · `spotify-alt` Spotify (Alt) · `transvision-new` TransVision (New) · `transvision-old` TransVision (Old) · `vidio` Vidio · `vision-plus` Vision+ · `viu` VIU · `xxi-21` XXI (21)

</details>

<details>
<summary><b>Financing</b> · 26 logos · <code>financing</code></summary>

`acc` ACC · `acc-alt` ACC (Alt) · `adakami` AdaKami · `adakami-alt` AdaKami (Alt) · `adira-finance` Adira Finance · `aeon-credit-service` AEON Credit Service · `akulaku` Akulaku · `akulaku-paylater` Akulaku Paylater · `bca-finance` BCA Finance · `bri-finance` BRI Finance · `bussan-auto-finance` Bussan Auto Finance · `daihatsu-financial-service` Daihatsu Financial Service · `fif-astra` FIF Astra · `finmas` Finmas · `gopaylater` Gopaylater · `home-credit` Home Credit · `indodana` Indodana · `kredit-pintar` Kredit Pintar · `kreditplus` KreditPlus · `kredivo` Kredivo · `lexus-financial-service` Lexus Financial Service · `lexus-financial-service-1` Lexus Financial Service-1 · `pegadaian` Pegadaian · `taf-toyota-astra-financial` TAF - Toyota Astra Financial · `toyota-financial-service` Toyota Financial Service · `wom-finance` WOM Finance

</details>

<details>
<summary><b>Supermarket</b> · 18 logos · <code>supermarket</code></summary>

`alfamart` Alfamart · `alfamidi` Alfamidi · `bright` Bright · `circle-k` Circle K · `circle-k-alt` Circle K (Alt) · `dan-plus-dan` Dan+Dan · `family-mart` Family Mart · `giant` Giant · `hero` Hero · `hypermart` Hypermart · `indomaret` Indomaret · `lawson` Lawson · `lotte` Lotte · `lotte-grosir` Lotte Grosir · `lotte-mart` Lotte Mart · `toserba-yogya` Toserba Yogya · `transmart` Transmart · `yomart` Yomart

</details>

<details>
<summary><b>Mobile Telco</b> · 17 logos · <code>mobile-telco</code></summary>

`axis` AXIS · `by-u` by.U · `im3` IM3 · `kartu-as` Kartu As · `kartu-halo` Kartu Halo · `live-on` Live.On · `mentari-ooredoo` Mentari Ooredoo · `simpati` Simpati · `smartfren` Smartfren · `smartfren-old` Smartfren (Old) · `telkomsel` Telkomsel · `telkomsel-alt` Telkomsel (Alt) · `telkomsel-halo` Telkomsel Halo · `telkomsel-prabayar` Telkomsel Prabayar · `tri` Tri · `xl` XL · `xl-prioritas` XL Prioritas

</details>

<details>
<summary><b>Game</b> · 15 logos · <code>game</code></summary>

`app-store` App Store · `apple-arcade` Apple Arcade · `ea-play` EA Play · `ea-play-alt` EA Play (Alt) · `epic-games` Epic Games · `epic-games-store` Epic Games Store · `google-play` Google Play · `google-play-alt` Google Play (Alt) · `my-nintendo` My Nintendo · `nintendo-online` Nintendo Online · `playstation-plus` Playstation Plus · `playstation-store` Playstation Store · `steam` Steam · `ubisoft-plus` UBISOFT+ · `xbox-game-pass` XBOX Game Pass

</details>

<details>
<summary><b>Bank App</b> · 14 logos · <code>bank-app</code></summary>

`bca-mobile` BCA Mobile · `bni-mobile-banking` BNI Mobile Banking · `brimo` BRImo · `bsi-mobile` BSI Mobile · `digibank` Digibank · `digibank-alt` Digibank (Alt) · `jago-app` Jago · `jakone-mobile` JakOne Mobile · `jenius-app` Jenius · `mandiri-livin` Mandiri Livin · `neobank` Neobank · `octo-clicks` OCTO Clicks · `uob-tmrw` UOB TMRW · `wondr-by-bni` Wondr by BNI

</details>

<details>
<summary><b>Miscellaneous</b> · 14 logos · <code>miscellaneous</code></summary>

`alipay-new` Alipay (New) · `alipay-old` Alipay (Old) · `apple-pay` Apple Pay · `google-pay` Google Pay · `grab-pay` Grab Pay · `interlink` Interlink · `line-pay` LINE Pay · `line-pay-alt` LINE Pay (Alt) · `nets` NETS · `samsung-pay` Samsung Pay · `samsung-pay-alt` Samsung Pay (Alt) · `wirecard` Wirecard · `wirecard-1` Wirecard-1 · `wirecard-2` Wirecard-2

</details>

<details>
<summary><b>Regulatory</b> · 14 logos · <code>regulatory</code></summary>

`afpi` AFPI · `aspi` ASPI · `bank-indonesia` Bank Indonesia · `bappebti` BAPPEBTI · `bpd` BPD · `ekonomi-syariah` Ekonomi Syariah · `ekonomi-syariah-alt` Ekonomi Syariah (Alt) · `inklusi-keuangan` Inklusi Keuangan · `kominfo` KOMINFO · `lps` LPS · `ojk` OJK · `perbankan-syariah-ib` Perbankan Syariah (IB) · `world-bank` World Bank · `world-bank-alt` World Bank (Alt)

</details>

<details>
<summary><b>Switching</b> · 13 logos · <code>switching</code></summary>

`alto` ALTO · `atm-bersama` ATM Bersama · `bca-atm` BCA ATM · `bca-debit` BCA Debit · `bi-fast` BI-FAST · `jalin` Jalin · `link` Link · `link-new-alt` Link (New Alt) · `link-new` Link (New) · `link-old` Link (Old) · `meps` MEPS · `prima` PRIMA · `prima-debit` PRIMA Debit

</details>

<details>
<summary><b>Transportation</b> · 12 logos · <code>transportation</code></summary>

`cititrans` Cititrans · `damri` DAMRI · `daytrans` DayTrans · `jaklingko` JakLingko · `kai` KAI · `kai-bandara` KAI Bandara · `kai-commuter-new` KAI Commuter (New) · `kai-commuter-old` KAI Commuter (Old) · `lrt-jakarta` LRT Jakarta · `mrt-jakarta` MRT Jakarta · `transjakarta` TransJakarta · `whoosh` Whoosh

</details>

<details>
<summary><b>ISP</b> · 11 logos · <code>isp</code></summary>

`biznet` Biznet · `biznet-home` Biznet Home · `cbn` CBN · `first-media` First Media · `indihome-new` IndiHome (New) · `indihome-old` IndiHome (Old) · `indosat-hifi` Indosat Hifi · `indosat-m2` Indosat M2 · `melsa` Melsa · `myrepublic` MyRepublic · `telkomsel-orbit` Telkomsel Orbit

</details>

<details>
<summary><b>E-Commerce</b> · 9 logos · <code>e-commerce</code></summary>

`bhinneka` Bhinneka · `blibli` Blibli · `bukalapak` Bukalapak · `bukalapak-new` Bukalapak (New) · `lazada` Lazada · `shopee` Shopee · `shopee-alt` Shopee (Alt) · `tokopedia` Tokopedia · `zalora` Zalora

</details>

<details>
<summary><b>Remittance</b> · 9 logos · <code>remittance</code></summary>

`flip` Flip · `moneygram` MoneyGram · `payoneer` Payoneer · `paypal` PayPal · `ria-money` Ria Money · `skrill` Skrill · `transfez` Transfez · `western-union` Western Union · `wise` Wise

</details>

<details>
<summary><b>Payment Gateway</b> · 8 logos · <code>payment-gateway</code></summary>

`2c2p` 2c2p · `espay` Espay · `finpay` Finpay · `ipay88` ipay88 · `midtrans` Midtrans · `prismalink` PrismaLink · `stripe` Stripe · `xendit` Xendit

</details>

<details>
<summary><b>Prepaid Card</b> · 8 logos · <code>prepaid-card</code></summary>

`bca-flazz` BCA Flazz · `bca-flazz-alt` BCA Flazz (Alt) · `bni-tapcash` BNI TapCash · `bri-brizzi` BRI BRIZZI · `bri-brizzi-alt` BRI BRIZZI (Alt) · `e-toll-card` e-Toll Card · `jakcard` Jakcard · `mandiri-e-money` Mandiri e-money

</details>

<details>
<summary><b>Direct Debit</b> · 7 logos · <code>direct-debit</code></summary>

`bca-klikpay` BCA KlikPay · `bri-direct-debit` BRI Direct Debit · `jenius-pay` Jenius Pay · `mandiri-e-cash` Mandiri E-Cash · `octo-clicks-direct-debit` OCTO Clicks · `oneklik` OneKlik · `uob-ez-pay` UOB EZ Pay

</details>

<details>
<summary><b>Donation</b> · 7 logos · <code>donation</code></summary>

`baznas` BAZNAS · `dompet-dhuafa` Dompet Dhuafa · `dompet-dhuafa-alt` Dompet Dhuafa (Alt) · `kitabisa` Kitabisa · `kitabisa-alt` Kitabisa (Alt) · `rumah-zakat` Rumah Zakat · `rumah-zakat-alt` Rumah Zakat (Alt)

</details>

<details>
<summary><b>Utilities</b> · 7 logos · <code>utilities</code></summary>

`aetra-tangerang` Aetra Tangerang · `pam-jaya-new` PAM Jaya (New) · `pam-jaya-old` PAM Jaya (Old) · `pdam` PDAM · `pdam-kota-surabaya` PDAM Kota Surabaya · `pgn` PGN · `pln` PLN

</details>

<details>
<summary><b>Government</b> · 5 logos · <code>government</code></summary>

`bea-cukai` Bea Cukai · `djp-online` DJP Online · `djp-online-alt` DJP Online (Alt) · `kemenkeu` Kemenkeu · `qris` QRIS

</details>

> The list above is generated from [`data/logos.yml`](./data/logos.yml). If you spot something missing or wrong, that file is the source of truth — open an issue or PR against it and the build will re-emit the manifest.

---

## TypeScript

Types are bundled. No `@types/` install required.

```ts
import { listLogos, type LogoMeta } from 'idn-finlogos';

const banks: LogoMeta[] = listLogos({ category: 'bank-logo' });
```

---

## License

**Dual-licensed.** Read both — they cover different parts of this package.

- Build tooling, scripts, and module wrappers: **MIT** (see [LICENSE](./LICENSE))
- SVG logo assets: **CC BY-NC 4.0** (see [LICENSE-ASSETS](./LICENSE-ASSETS))

The underlying logo marks remain the property of their respective trademark holders. Inclusion here does not imply endorsement. See [NOTICE](./NOTICE) for the full disclaimer.

**Commercial use of the SVG assets requires permission from the trademark holder of each respective logo.**

---

## Contributing

This is a curated collection. To request a logo add/remove/update, open an issue at https://github.com/hafidznoor/idn-finlogos/issues — include the brand name, your source for the vector, and the trademark holder.

For maintainers, the build pipeline is:

```bash
npm install
npm run validate    # check icons/ ↔ data/logos.yml consistency
npm run build       # produces dist/
npm pack --dry-run  # inspect the publishable tarball
```

The source of truth is [`data/logos.yml`](./data/logos.yml). Edit display names, add `aliases`, or add `tags` there — the build re-emits the manifest.
