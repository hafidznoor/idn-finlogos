# Indonesia Fintech Logos — Flutter

Flutter package (`idn_finlogos`) for the [Indonesia Fintech Logos](https://github.com/hafidznoor/idn-finlogos) catalog — Indonesian fintech & financial institution logos: banks, e-wallets, payment gateways, switching networks, regulators, and more.

**572 logos · 25 categories · raw SVG assets · zero runtime dependencies**

[![Support on Lemon Squeezy](https://img.shields.io/badge/Support-Lemon%20Squeezy-FFC233?logo=lemonsqueezy&logoColor=white)](https://hafidznoor.lemonsqueezy.com/checkout/buy/f2b81ada-e8a9-4e29-b35c-7b7249b78404)

## Install

```bash
flutter pub add idn_finlogos flutter_svg
```

`flutter_svg` isn't a dependency of this package — pick your preferred SVG renderer.

## Render a logo

```dart
import 'package:flutter/material.dart';
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

## Browse the catalog

```dart
IdnFinLogos.all                          // all 572 logos
IdnFinLogos.categories                   // 25 categories
IdnFinLogos.byCategory('bank-logo')      // 160 banks
IdnFinLogos.get('gopay')                 // single lookup
IdnFinLogos.search('syariah')            // fuzzy match: name / slug / aliases
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

Use `IdnFinLogos.categories` to get the list at runtime, or `IdnFinLogos.byCategory('<slug>')` to filter.

## Design source (Figma)

The original artwork lives in three Figma community files. They're the canonical place to **browse, preview, and duplicate** the logos for design work. This Flutter package is the **code distribution** of the same set — use Figma when designing, use this package when shipping.

| Library | Figma community file |
|---|---|
| **Bank Logo Library — Indonesia** | https://www.figma.com/community/file/1246763677986037137/bank-logo-library-indonesia-in-svg-format |
| **Payment Channel Logo Library — Indonesia** | https://www.figma.com/community/file/1263416469504652135/payment-channel-logo-library-indonesia-in-svg-format |
| **Bill Payment Logo Library — Indonesia** | https://www.figma.com/community/file/1325472637345495839/bill-payment-logo-library-indonesia-in-svg-format |

Spot a discrepancy between a logo here and the corresponding Figma file? Please [open an issue](https://github.com/hafidznoor/idn-finlogos/issues) — the goal is to keep both in sync.

## Privacy

**This package contains no telemetry.** It ships SVG assets and a generated Dart
catalog — no network calls, no analytics, no identifiers. Rendering a logo sends
nothing, anywhere.

The `idn-finlogos` **CLI**, which is distributed only via npm and is not part of
this package, does collect anonymous usage stats (unmatched search terms, to
decide which logos to add next). It has no bearing on Flutter consumers. Details:
[PRIVACY.md](https://github.com/hafidznoor/idn-finlogos/blob/main/PRIVACY.md).

Per-logo popularity is measured from [jsDelivr's public CDN statistics](https://data.jsdelivr.com/v1/stats/packages/npm/idn-finlogos),
never from code running in your app.

## License

- Package code: MIT
- Logo SVGs: CC BY-NC 4.0

Commercial use of the SVG assets requires permission from the trademark holder of each respective logo. See [NOTICE](https://github.com/hafidznoor/idn-finlogos/blob/main/NOTICE).
