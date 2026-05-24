## 2.3.0

Added `korlantas-polri` (Government). Moved `qris` from `government` → `qr-payment`. Removed 3 duplicates (`octo-clicks-direct-debit`, `wirecard-1`, `wirecard-2`). Re-exported `ibk-bank` and `qris` to fix broken clip-path masks. Total: **572 logos across 25 categories**. No Flutter API changes.

(JS/TS consumers also get first-party React, React Native, Vue, and Svelte components in this release — see the [main CHANGELOG](https://github.com/hafidznoor/idn-finlogos/blob/main/CHANGELOG.md#230). The Flutter package is unaffected.)

## 2.2.1

Re-exported 5 logos with broken or missing clip-path masks: `alto`, `ibk-bank`, `netflix-alt`, `payoneer`, `visa-checkout`. Some viewBox dimensions changed where artwork was trimmed.

## 2.2.0

Added **Insurance** (29 logos) and **QR Payment** (10 logos) categories, plus 46 logos across existing categories — 574 logos across 25 categories total. Re-exported every SVG to fix clip-path / mask rendering issues that affected GitHub's viewer and some mobile SVG renderers. No API changes.

## 2.1.0

Initial release on pub.dev. 489 Indonesian financial institution logos across 23 categories as bundled Flutter SVG assets, with a typed Dart catalog API (`IdnFinLogos.all`, `get`, `byCategory`, `search`).

For the full release history see the [main CHANGELOG](https://github.com/hafidznoor/idn-finlogos/blob/main/CHANGELOG.md).
