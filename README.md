# idn-finlogos

Indonesian financial institution logos — banks, e-wallets, payment gateways, switching, regulatory, and 18 more categories — as optimized SVGs, available on **npm, Maven Central, Swift Package Manager, and pub.dev**.

**489 logos · 23 categories · SVG only · zero runtime dependencies**

> v2 of the original `indo-financial-logolibrary`. See [MIGRATION.md](./MIGRATION.md) if you're upgrading.

---

## Install

| Platform | Install |
|---|---|
| **Web (npm)** | `npm install idn-finlogos` |
| **Android (Gradle / Maven Central)** | `implementation("io.github.hafidznoor:idn-finlogos:2.0.1")` |
| **iOS (Swift Package Manager)** | `.package(url: "https://github.com/hafidznoor/idn-finlogos", from: "2.0.1")` |
| **Flutter (pub.dev)** | `flutter pub add idn_finlogos` |
| **Web (CDN)** | `https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/<slug>.svg` |

Each package ships the same 489 SVGs generated from a single source of truth (`data/logos.yml` + `icons/`). Mobile packages bundle the SVGs as platform-native resources; web packages ship them as ESM modules and raw files.

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
// → 'https://cdn.jsdelivr.net/npm/idn-finlogos@2.0.1/dist/icons/bca.svg'
```

### 4. CDN — no install, no build step

```html
<img src="https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/bca.svg" />
<img src="https://unpkg.com/idn-finlogos@2/dist/icons/gopay.svg" />
```

Pin a major (`@2`), minor (`@2.0`), or exact version (`@2.0.0`).

---

## Android

```kotlin
// app/build.gradle.kts
dependencies {
    implementation("io.github.hafidznoor:idn-finlogos:2.0.1")
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

JitPack also works without waiting on Maven Central — add `maven { url = uri("https://jitpack.io") }` to your repositories and use `com.github.hafidznoor:idn-finlogos:2.0.1`.

---

## iOS

```swift
// Package.swift
.package(url: "https://github.com/hafidznoor/idn-finlogos", from: "2.0.1")
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
