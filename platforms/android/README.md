# idn-finlogos (Android)

Android library for the [idn-finlogos](https://github.com/hafidznoor/idn-finlogos) catalog of Indonesian financial institution logos.

**572 logos · 25 categories · zero runtime dependencies · raw SVG assets**

[![Support on Lemon Squeezy](https://img.shields.io/badge/Support-Lemon%20Squeezy-FFC233?logo=lemonsqueezy&logoColor=white)](https://hafidznoor.lemonsqueezy.com/checkout/buy/f2b81ada-e8a9-4e29-b35c-7b7249b78404)

## Install

### Maven Central

```kotlin
dependencies {
    implementation("io.github.hafidznoor:idn-finlogos:2.3.0")
}
```

### JitPack (no Maven Central wait)

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}

// app/build.gradle.kts
dependencies {
    implementation("com.github.hafidznoor:idn-finlogos:2.3.0")
}
```

## Render a logo

The library ships raw SVGs as Android assets. The de-facto modern way to render SVG on Android is **Coil 2** with the SVG decoder:

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.coil-kt:coil-compose:2.6.0")
    implementation("io.coil-kt:coil-svg:2.6.0")
}
```

```kotlin
import androidx.compose.runtime.*
import coil.ImageLoader
import coil.compose.AsyncImage
import coil.decode.SvgDecoder
import com.hafidznoor.idnfinlogos.IdnFinLogos

@Composable
fun BcaLogo() {
    val context = LocalContext.current
    val loader = remember {
        ImageLoader.Builder(context)
            .components { add(SvgDecoder.Factory()) }
            .build()
    }
    val bca = IdnFinLogos.get("bca") ?: return

    AsyncImage(
        model = "file:///android_asset/${bca.assetPath}",
        imageLoader = loader,
        contentDescription = bca.name,
    )
}
```

For classic Views, [AndroidSVG](https://bigbadaboom.github.io/androidsvg/) works the same way — open the asset stream and parse.

## Browse the catalog

```kotlin
IdnFinLogos.all                          // all 572 logos
IdnFinLogos.categories                   // 25 categories
IdnFinLogos.byCategory("bank-logo")      // 160 banks
IdnFinLogos.get("gopay")                 // single lookup
IdnFinLogos.search("syariah")            // fuzzy match: name / slug / aliases
```

## Categories

572 logos across 25 categories.

| Category slug | Display name | Count | What's in it |
|---|---|---:|---|
| `bank-logo` | Bank Logo | 160 | Commercial, syariah, BPD, and digital banks (BCA, Mandiri, BRI, BNI, Jago, Seabank, etc.) |
| `card-payment` | Card Payment | 37 | Visa, Mastercard, JCB, UnionPay, AmEx, Discover, and co-branded card schemes |
| `logistic` | Logistic | 33 | Courier and last-mile delivery (JNE, J&T, SiCepat, Ninja Xpress, Anteraja, etc.) |
| `insurance` | Insurance | 29 | Life, general, and social insurers (AIA, Allianz, Prudential, Manulife, BPJS, etc.) |
| `e-wallet` | E-Wallet | 27 | GoPay, OVO, DANA, ShopeePay, LinkAja, and friends |
| `financing` | Financing | 27 | Multifinance, paylater, and consumer credit (Adira, FIF, BFI, Akulaku, Kredivo, etc.) |
| `entertainment` | Entertainment | 26 | Streaming and content services (Netflix, Disney+, Spotify, Vidio, etc.) |
| `supermarket` | Supermarket | 24 | Modern retail (Indomaret, Alfamart, Hypermart, Super Indo, AEON, etc.) |
| `miscellaneous` | Miscellaneous | 21 | Cross-category brand marks that don't fit a single bucket |
| `mobile-telco` | Mobile Telco | 20 | Telkomsel, Indosat, XL, Smartfren, by.U, and other operators |
| `bank-app` | Bank App | 17 | Mobile banking app marks distinct from the parent bank logo (Livin', BYOND, blu, etc.) |
| `isp` | ISP | 15 | Fixed-line broadband (IndiHome, Biznet, MyRepublic, Iconnet, etc.) |
| `regulatory` | Regulatory | 15 | OJK, BI, LPS, and other financial regulators |
| `game` | Game | 15 | Game publishers and storefronts commonly topped up via Indonesian channels |
| `remittance` | Remittance | 14 | Cross-border money movement (Western Union, PayPal, SWIFT, Topremit, etc.) |
| `switching` | Switching | 13 | Domestic switching networks (PRIMA, ALTO, ATM Bersama, QRIS, etc.) |
| `e-commerce` | E-Commerce | 12 | Tokopedia, Shopee, Bukalapak, Lazada, Blibli, TikTok Shop, etc. |
| `transportation` | Transportation | 12 | Ride-hailing and transit ticketing (Gojek, Grab, KAI, MRT Jakarta, etc.) |
| `payment-gateway` | Payment Gateway | 10 | DOKU, Midtrans, Xendit, iPaymu, 2C2P, etc. |
| `qr-payment` | QR Payment | 11 | QR payment standards including Indonesia's QRIS plus regional rails (DuitNow QR, SGQR, VietQR, Thai QR, KHQR, etc.) |
| `prepaid-card` | Prepaid Card | 9 | Closed-loop transit and toll cards (Flazz, e-Money, Brizzi, TapCash, etc.) |
| `direct-debit` | Direct Debit | 6 | Account-linked debit channels (BCA KlikPay, BCA OneKlik, BRI Direct Debit, Jenius Pay, etc.) |
| `donation` | Donation | 7 | Zakat, infaq, and charity platforms (Dompet Dhuafa, Kitabisa, Rumah Zakat, etc.) |
| `utilities` | Utilities | 7 | PLN, PDAM, PGN, and other public utility brands |
| `government` | Government | 5 | State agencies and government services (Bea Cukai, DJP Online, Kemenkeu, Korlantas Polri) |

Use `IdnFinLogos.categories` to get the list at runtime, or `IdnFinLogos.byCategory("<slug>")` to filter.

## Design source (Figma)

The original artwork lives in three Figma community files. They're the canonical place to **browse, preview, and duplicate** the logos for design work. This Android library is the **code distribution** of the same set — use Figma when designing, use this package when shipping.

| Library | Figma community file |
|---|---|
| **Bank Logo Library — Indonesia** | https://www.figma.com/community/file/1246763677986037137/bank-logo-library-indonesia-in-svg-format |
| **Payment Channel Logo Library — Indonesia** | https://www.figma.com/community/file/1263416469504652135/payment-channel-logo-library-indonesia-in-svg-format |
| **Bill Payment Logo Library — Indonesia** | https://www.figma.com/community/file/1325472637345495839/bill-payment-logo-library-indonesia-in-svg-format |

Spot a discrepancy between a logo here and the corresponding Figma file? Please [open an issue](https://github.com/hafidznoor/idn-finlogos/issues) — the goal is to keep both in sync.

## License

- Library code: MIT
- Logo SVGs: CC BY-NC 4.0

Commercial use of the SVG assets requires permission from the trademark holder of each respective logo. See [NOTICE](https://github.com/hafidznoor/idn-finlogos/blob/main/NOTICE).
