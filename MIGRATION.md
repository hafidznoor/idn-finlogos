# Migration guides

## v2.3 → v2.4: slug cleanup (bare slug = newest logo)

v2.4 retires the `-new` suffix: the bare brand slug (`bri`, `paypal`, `ovo`, …) now always resolves to the newest official logo, and superseded art moved to `-old`. 39 slugs were renamed — the full old → new table is in [CHANGELOG.md under 2.4.0](./CHANGELOG.md#240).

Rules of thumb:

- You used the bare slug (`bri`) and want the **current** logo → no change needed; you now get the new art automatically.
- You used a `-new` slug (`bri-new`) → it still resolves everywhere (alias + deprecated `dist/icons/` shims), but switch to the bare slug (`bri`) before v3.
- You used the bare slug and deliberately wanted the **old** art → switch to `<brand>-old` (e.g. `bri-old`).

v2.4 also fixed long-frozen misspellings and ad-hoc numbered slugs. Each old slug stays as an alias, so lookups keep resolving — but switch to the new slug before v3:

| old slug | new slug | name |
|---|---|---|
| `mualamat` | `muamalat` | Bank Muamalat |
| `amercian-express-alt` | `american-express-alt` | American Express (Alt) |
| `topremit-1` | `topremit-alt` | Topremit (Alt) |
| `lexus-financial-service-1` | `lexus-financial-service-alt` | Lexus Financial Service (Alt) |
| `bank-bpd-sumsel-babel-alt-1` | `bank-bpd-sumsel-babel-alt` | Bank BPD Sumsel Babel (Alt) |

**Bank DKI → Bank Jakarta.** Bank DKI rebranded to Bank Jakarta. The current logo is now `bank-jakarta` (with kode bank `111` and SWIFT `bdkiidj1`); the old mark is `bank-dki-old`. `bank-dki`, `bank-dki-alt`, and `bank-dki-1` all resolve to `bank-jakarta` as aliases — switch to `bank-jakarta` before v3.

New in v2.4: banks resolve by **SWIFT/BIC** and **3-digit kode bank** (`getLogo('CENAIDJA')` ≡ `getLogo('014')` ≡ `getLogo('bca')`). See [CHANGELOG.md under 2.4.0](./CHANGELOG.md#240).

Some v2 slugs in the table below have since been renamed by v2.4 — cross-check the 2.4.0 table when migrating directly from v1.

# Migration from v1 (`indo-financial-logolibrary`) to v2 (`idn-finlogos`)

## tl;dr

| | v1 | v2 |
|---|---|---|
| Registry | GitHub Packages (auth required) | Public npm (no auth) |
| Install | `npm i indo-financial-logolibrary` | `npm i idn-finlogos` |
| Browser bundlers | Broken (uses Node `fs` at runtime) | Works (per-logo ESM imports, tree-shakeable) |
| Filenames | Spaces, parens (`BCA Digital.svg`) | Kebab-case slugs (`bca-digital`) |
| Access pattern | `bankLogo.SVG['Bank Logo']['BCA']` → path | `import bca from 'idn-finlogos/icons/bca'` → SVG string |
| Categories | Folders | Metadata (`listLogos({ category })`) |
| PNG variants | x1, x2, x3, x4, Large baked in | Dropped — use a CDN image transform or rasterize yourself |
| License | Conflicting (MIT vs CC-BY-NC-4.0) | Dual-licensed: MIT (code) + CC-BY-NC-4.0 (assets) |
| TypeScript | None | First-class `.d.ts` bundled |
| CDN | None | jsDelivr + unpkg |

## Code changes

**v1**
```js
const bankLogo = require('indo-financial-logolibrary');
const path = bankLogo.SVG['Bank Logo']['BCA'];   // path string on disk
```

**v2** — pick one:
```js
// (a) Inline SVG string (recommended)
import bca from 'idn-finlogos/icons/bca';
element.innerHTML = bca;

// (b) URL-style (your bundler hashes it)
import bcaUrl from 'idn-finlogos/icons/bca.svg';
<img src={bcaUrl} />

// (c) Dynamic
import { getLogo } from 'idn-finlogos';
const { svg } = await getLogo('bca');

// (d) CDN — no install
<img src="https://cdn.jsdelivr.net/npm/idn-finlogos@2/dist/icons/bca.svg" />
```

## Categories: v1 → v2 slugs

| v1 folder | v2 category slug |
|---|---|
| `Bank App` | `bank-app` |
| `Bank Logo` | `bank-logo` |
| `Card Payment` | `card-payment` |
| `Direct Debit` | `direct-debit` |
| `Donation` | `donation` |
| `E-Commerce` | `e-commerce` |
| `E-Wallet` | `e-wallet` |
| `Entertainment` | `entertainment` |
| `Financing` | `financing` |
| `Game` | `game` |
| `Government` | `government` |
| `ISP` | `isp` |
| `Logistic` | `logistic` |
| `Miscellaneous` | `miscellaneous` |
| `Mobile Telco` | `mobile-telco` |
| `Payment Gateway` | `payment-gateway` |
| `Prepaid Card` | `prepaid-card` |
| `Regulatory` | `regulatory` |
| `Remittance` | `remittance` |
| `Supermarket` | `supermarket` |
| `Switching` | `switching` |
| `Transportation` | `transportation` |
| `Utilities` | `utilities` |

## Collisions: brands that appeared in multiple v1 categories

7 brands had the same name across multiple v1 folders. Resolved as:

| Brand | v1 sources | v2 outcome |
|---|---|---|
| Jago | Bank Logo + Bank App | Two slugs: `jago` (Bank Logo, wordmark) + `jago-app` (Bank App, icon) |
| Jenius | Bank Logo + Bank App | Two slugs: `jenius` + `jenius-app` |
| OCTO Clicks | Bank App + Direct Debit | Two slugs: `octo-clicks` + `octo-clicks-direct-debit` |
| QRIS | Government + Miscellaneous | One slug `qris` from `Government/`; `Miscellaneous/` dropped |
| DOKU | E-Wallet + Payment Gateway | One slug `doku` from `E-Wallet/`; `Payment Gateway/` dropped (near-duplicate) |
| PayPal | Misc + Remittance | One slug `paypal` from `Remittance/`; `Miscellaneous/` dropped |
| Western Union | Misc + Remittance | One slug `western-union` from `Remittance/`; `Miscellaneous/` dropped |

## PNG variants

v1 shipped raster versions at x1, x2, x3, x4, and Large. v2 ships SVG only.

If you need PNG:
- **CDN image transform** — jsDelivr supports `?...&output=png` for many SVGs.
- **Build-time rasterize** — pipe the SVG through [`sharp`](https://sharp.pixelplumbing.com/) in your own pipeline.
- **Runtime rasterize** — `<canvas>` with `drawImage` on an SVG `<img>`.

For most modern targets (web, React Native, Flutter, even most email clients), SVG renders correctly and is significantly smaller.

## Full v1 → v2 slug mapping

493 v1 entries · 489 kept (3 aliased) · 4 dropped

| v1 path | v1 display name | v2 slug | notes |
|---|---|---|---|
| `Bank App/BCA Mobile.svg` | BCA Mobile | `bca-mobile` |  |
| `Bank App/BNI Mobile Banking.svg` | BNI Mobile Banking | `bni-mobile-banking` |  |
| `Bank App/BRImo.svg` | BRImo | `brimo` |  |
| `Bank App/BSI Mobile.svg` | BSI Mobile | `bsi-mobile` |  |
| `Bank App/Digibank (Alt).svg` | Digibank (Alt) | `digibank-alt` |  |
| `Bank App/Digibank.svg` | Digibank | `digibank` |  |
| `Bank App/Jago.svg` | Jago | `jago-app` | aliased (collision-disambiguated) |
| `Bank App/JakOne Mobile.svg` | JakOne Mobile | `jakone-mobile` |  |
| `Bank App/Jenius.svg` | Jenius | `jenius-app` | aliased (collision-disambiguated) |
| `Bank App/Mandiri Livin.svg` | Mandiri Livin | `mandiri-livin` |  |
| `Bank App/Neobank.svg` | Neobank | `neobank` |  |
| `Bank App/OCTO Clicks.svg` | OCTO Clicks | `octo-clicks` |  |
| `Bank App/UOB TMRW.svg` | UOB TMRW | `uob-tmrw` |  |
| `Bank App/Wondr by BNI.svg` | Wondr by BNI | `wondr-by-bni` |  |
| `Bank Logo/ANZ.svg` | ANZ | `anz` |  |
| `Bank Logo/Aladin.svg` | Aladin | `aladin` |  |
| `Bank Logo/Allo.svg` | Allo | `allo` |  |
| `Bank Logo/Amar Bank.svg` | Amar Bank | `amar-bank` |  |
| `Bank Logo/BCA Digital.svg` | BCA Digital | `bca-digital` |  |
| `Bank Logo/BCA Syariah.svg` | BCA Syariah | `bca-syariah` |  |
| `Bank Logo/BCA.svg` | BCA | `bca` |  |
| `Bank Logo/BNC.svg` | BNC | `bnc` |  |
| `Bank Logo/BNI.svg` | BNI | `bni` |  |
| `Bank Logo/BNP Paribas.svg` | BNP Paribas | `bnp-paribas` |  |
| `Bank Logo/BRI (Alt).svg` | BRI (Alt) | `bri-alt` |  |
| `Bank Logo/BRI (Vertical).svg` | BRI (Vertical) | `bri-vertical` |  |
| `Bank Logo/BRI.svg` | BRI | `bri` |  |
| `Bank Logo/BSI.svg` | BSI | `bsi` |  |
| `Bank Logo/BTN (Alt).svg` | BTN (Alt) | `btn-alt` |  |
| `Bank Logo/BTN (New).svg` | BTN (New) | `btn-new` |  |
| `Bank Logo/BTN Syariah (New).svg` | BTN Syariah (New) | `btn-syariah-new` |  |
| `Bank Logo/BTN Syariah.svg` | BTN Syariah | `btn-syariah` |  |
| `Bank Logo/BTN.svg` | BTN | `btn` |  |
| `Bank Logo/BTPN Syariah.svg` | BTPN Syariah | `btpn-syariah` |  |
| `Bank Logo/BTPN.svg` | BTPN | `btpn` |  |
| `Bank Logo/Bangkok Bank.svg` | Bangkok Bank | `bangkok-bank` |  |
| `Bank Logo/Bank Artha Graha Internasional.svg` | Bank Artha Graha Internasional | `bank-artha-graha-internasional` |  |
| `Bank Logo/Bank BJB Syariah.svg` | Bank BJB Syariah | `bank-bjb-syariah` |  |
| `Bank Logo/Bank BJB.svg` | Bank BJB | `bank-bjb` |  |
| `Bank Logo/Bank BPD Aceh.svg` | Bank BPD Aceh | `bank-bpd-aceh` |  |
| `Bank Logo/Bank BPD Bali.svg` | Bank BPD Bali | `bank-bpd-bali` |  |
| `Bank Logo/Bank BPD Banten.svg` | Bank BPD Banten | `bank-bpd-banten` |  |
| `Bank Logo/Bank BPD DIY.svg` | Bank BPD DIY | `bank-bpd-diy` |  |
| `Bank Logo/Bank BPD Jambi.svg` | Bank BPD Jambi | `bank-bpd-jambi` |  |
| `Bank Logo/Bank BPD Jateng.svg` | Bank BPD Jateng | `bank-bpd-jateng` |  |
| `Bank Logo/Bank BPD Jatim.svg` | Bank BPD Jatim | `bank-bpd-jatim` |  |
| `Bank Logo/Bank BPD Kalbar (Alt).svg` | Bank BPD Kalbar (Alt) | `bank-bpd-kalbar-alt` |  |
| `Bank Logo/Bank BPD Kalbar.svg` | Bank BPD Kalbar | `bank-bpd-kalbar` |  |
| `Bank Logo/Bank BPD Kalimantan Timur.svg` | Bank BPD Kalimantan Timur | `bank-bpd-kalimantan-timur` |  |
| `Bank Logo/Bank BPD Kalsel.svg` | Bank BPD Kalsel | `bank-bpd-kalsel` |  |
| `Bank Logo/Bank BPD Kalteng.svg` | Bank BPD Kalteng | `bank-bpd-kalteng` |  |
| `Bank Logo/Bank BPD Lampung.svg` | Bank BPD Lampung | `bank-bpd-lampung` |  |
| `Bank Logo/Bank BPD Maluku Malut.svg` | Bank BPD Maluku Malut | `bank-bpd-maluku-malut` |  |
| `Bank Logo/Bank BPD NTB Syariah (Alt).svg` | Bank BPD NTB Syariah (Alt) | `bank-bpd-ntb-syariah-alt` |  |
| `Bank Logo/Bank BPD NTB Syariah.svg` | Bank BPD NTB Syariah | `bank-bpd-ntb-syariah` |  |
| `Bank Logo/Bank BPD NTT.svg` | Bank BPD NTT | `bank-bpd-ntt` |  |
| `Bank Logo/Bank BPD Papua.svg` | Bank BPD Papua | `bank-bpd-papua` |  |
| `Bank Logo/Bank BPD Riau Kepri Syariah.svg` | Bank BPD Riau Kepri Syariah | `bank-bpd-riau-kepri-syariah` |  |
| `Bank Logo/Bank BPD Riau Kepri.svg` | Bank BPD Riau Kepri | `bank-bpd-riau-kepri` |  |
| `Bank Logo/Bank BPD Sulselbar.svg` | Bank BPD Sulselbar | `bank-bpd-sulselbar` |  |
| `Bank Logo/Bank BPD Sulteng.svg` | Bank BPD Sulteng | `bank-bpd-sulteng` |  |
| `Bank Logo/Bank BPD Sultra.svg` | Bank BPD Sultra | `bank-bpd-sultra` |  |
| `Bank Logo/Bank BPD Sulutgo.svg` | Bank BPD Sulutgo | `bank-bpd-sulutgo` |  |
| `Bank Logo/Bank BPD Sumsel Babel (Alt-1).svg` | Bank BPD Sumsel Babel (Alt-1) | `bank-bpd-sumsel-babel-alt-1` |  |
| `Bank Logo/Bank BPD Sumsel Babel (Alt-2).svg` | Bank BPD Sumsel Babel (Alt-2) | `bank-bpd-sumsel-babel-alt-2` |  |
| `Bank Logo/Bank BPD Sumsel Babel.svg` | Bank BPD Sumsel Babel | `bank-bpd-sumsel-babel` |  |
| `Bank Logo/Bank BPD Sumut.svg` | Bank BPD Sumut | `bank-bpd-sumut` |  |
| `Bank Logo/Bank Bengkulu.svg` | Bank Bengkulu | `bank-bengkulu` |  |
| `Bank Logo/Bank Bumi Artha.svg` | Bank Bumi Artha | `bank-bumi-artha` |  |
| `Bank Logo/Bank Capital (Alt).svg` | Bank Capital (Alt) | `bank-capital-alt` |  |
| `Bank Logo/Bank Capital.svg` | Bank Capital | `bank-capital` |  |
| `Bank Logo/Bank DKI.svg` | Bank DKI | `bank-dki` |  |
| `Bank Logo/Bank Ganesha.svg` | Bank Ganesha | `bank-ganesha` |  |
| `Bank Logo/Bank INA.svg` | Bank INA | `bank-ina` |  |
| `Bank Logo/Bank Index Selindo (Alt).svg` | Bank Index Selindo (Alt) | `bank-index-selindo-alt` |  |
| `Bank Logo/Bank Index Selindo.svg` | Bank Index Selindo | `bank-index-selindo` |  |
| `Bank Logo/Bank Jasa Jakarta.svg` | Bank Jasa Jakarta | `bank-jasa-jakarta` |  |
| `Bank Logo/Bank Lampung.svg` | Bank Lampung | `bank-lampung` |  |
| `Bank Logo/Bank Mas.svg` | Bank Mas | `bank-mas` |  |
| `Bank Logo/Bank Maspion (Alt).svg` | Bank Maspion (Alt) | `bank-maspion-alt` |  |
| `Bank Logo/Bank Maspion.svg` | Bank Maspion | `bank-maspion` |  |
| `Bank Logo/Bank Mayapada (Alt).svg` | Bank Mayapada (Alt) | `bank-mayapada-alt` |  |
| `Bank Logo/Bank Mayapada.svg` | Bank Mayapada | `bank-mayapada` |  |
| `Bank Logo/Bank Mayora.svg` | Bank Mayora | `bank-mayora` |  |
| `Bank Logo/Bank Mestika Dharma.svg` | Bank Mestika Dharma | `bank-mestika-dharma` |  |
| `Bank Logo/Bank Nagari.svg` | Bank Nagari | `bank-nagari` |  |
| `Bank Logo/Bank Raya.svg` | Bank Raya | `bank-raya` |  |
| `Bank Logo/Bank Resona Perdania (Alt).svg` | Bank Resona Perdania (Alt) | `bank-resona-perdania-alt` |  |
| `Bank Logo/Bank Resona Perdania.svg` | Bank Resona Perdania | `bank-resona-perdania` |  |
| `Bank Logo/Bank SMBC Indonesia.svg` | Bank SMBC Indonesia | `bank-smbc-indonesia` |  |
| `Bank Logo/Bank Sahabat Sampoerna.svg` | Bank Sahabat Sampoerna | `bank-sahabat-sampoerna` |  |
| `Bank Logo/Bank Victoria Syariah.svg` | Bank Victoria Syariah | `bank-victoria-syariah` |  |
| `Bank Logo/Bank Victoria.svg` | Bank Victoria | `bank-victoria` |  |
| `Bank Logo/Bank Woori Saudara.svg` | Bank Woori Saudara | `bank-woori-saudara` |  |
| `Bank Logo/Bank of America.svg` | Bank of America | `bank-of-america` |  |
| `Bank Logo/Bank of China.svg` | Bank of China | `bank-of-china` |  |
| `Bank Logo/Bank of India Indonesia.svg` | Bank of India Indonesia | `bank-of-india-indonesia` |  |
| `Bank Logo/Bank of India.svg` | Bank of India | `bank-of-india` |  |
| `Bank Logo/Blu BCA.svg` | Blu BCA | `blu-bca` |  |
| `Bank Logo/CCB Indonesia (Alt).svg` | CCB Indonesia (Alt) | `ccb-indonesia-alt` |  |
| `Bank Logo/CCB Indonesia.svg` | CCB Indonesia | `ccb-indonesia` |  |
| `Bank Logo/CIMB Niaga Syariah.svg` | CIMB Niaga Syariah | `cimb-niaga-syariah` |  |
| `Bank Logo/CIMB Niaga.svg` | CIMB Niaga | `cimb-niaga` |  |
| `Bank Logo/CTBC Bank.svg` | CTBC Bank | `ctbc-bank` |  |
| `Bank Logo/Citibank (Alt).svg` | Citibank (Alt) | `citibank-alt` |  |
| `Bank Logo/Citibank.svg` | Citibank | `citibank` |  |
| `Bank Logo/Commonwealth.svg` | Commonwealth | `commonwealth` |  |
| `Bank Logo/Credit Suisse.svg` | Credit Suisse | `credit-suisse` |  |
| `Bank Logo/DBS.svg` | DBS | `dbs` |  |
| `Bank Logo/Danamon (MUFG).svg` | Danamon (MUFG) | `danamon-mufg` |  |
| `Bank Logo/Danamon Syariah.svg` | Danamon Syariah | `danamon-syariah` |  |
| `Bank Logo/Danamon.svg` | Danamon | `danamon` |  |
| `Bank Logo/Deutsche Bank.svg` | Deutsche Bank | `deutsche-bank` |  |
| `Bank Logo/HSBC.svg` | HSBC | `hsbc` |  |
| `Bank Logo/IBK Bank.svg` | IBK Bank | `ibk-bank` |  |
| `Bank Logo/ICBC (Alt).svg` | ICBC (Alt) | `icbc-alt` |  |
| `Bank Logo/ICBC.svg` | ICBC | `icbc` |  |
| `Bank Logo/ING Bank.svg` | ING Bank | `ing-bank` |  |
| `Bank Logo/J Trust Bank.svg` | J Trust Bank | `j-trust-bank` |  |
| `Bank Logo/JP Morgan Chase.svg` | JP Morgan Chase | `jp-morgan-chase` |  |
| `Bank Logo/Jago.svg` | Jago | `jago` |  |
| `Bank Logo/Jenius.svg` | Jenius | `jenius` |  |
| `Bank Logo/KB Bukopin (Alt).svg` | KB Bukopin (Alt) | `kb-bukopin-alt` |  |
| `Bank Logo/KB Bukopin Syariah.svg` | KB Bukopin Syariah | `kb-bukopin-syariah` |  |
| `Bank Logo/KB Bukopin.svg` | KB Bukopin | `kb-bukopin` |  |
| `Bank Logo/KEB Hana Bank (Alt).svg` | KEB Hana Bank (Alt) | `keb-hana-bank-alt` |  |
| `Bank Logo/KEB Hana Bank.svg` | KEB Hana Bank | `keb-hana-bank` |  |
| `Bank Logo/Krom.svg` | Krom | `krom` |  |
| `Bank Logo/LINE Bank (Alt).svg` | LINE Bank (Alt) | `line-bank-alt` |  |
| `Bank Logo/LINE Bank.svg` | LINE Bank | `line-bank` |  |
| `Bank Logo/MNC Bank.svg` | MNC Bank | `mnc-bank` |  |
| `Bank Logo/MNC.svg` | MNC | `mnc` |  |
| `Bank Logo/MUFG (Alt).svg` | MUFG (Alt) | `mufg-alt` |  |
| `Bank Logo/MUFG.svg` | MUFG | `mufg` |  |
| `Bank Logo/Mandiri Taspen.svg` | Mandiri Taspen | `mandiri-taspen` |  |
| `Bank Logo/Mandiri.svg` | Mandiri | `mandiri` |  |
| `Bank Logo/Maybank.svg` | Maybank | `maybank` |  |
| `Bank Logo/Mega Syariah.svg` | Mega Syariah | `mega-syariah` |  |
| `Bank Logo/Mega.svg` | Mega | `mega` |  |
| `Bank Logo/Mizuho Bank.svg` | Mizuho Bank | `mizuho-bank` |  |
| `Bank Logo/Motion Banking (Alt).svg` | Motion Banking (Alt) | `motion-banking-alt` |  |
| `Bank Logo/Motion Banking.svg` | Motion Banking | `motion-banking` |  |
| `Bank Logo/Mualamat.svg` | Mualamat | `mualamat` |  |
| `Bank Logo/NOBU.svg` | NOBU | `nobu` |  |
| `Bank Logo/Nanobank Syariah (Alt).svg` | Nanobank Syariah (Alt) | `nanobank-syariah-alt` |  |
| `Bank Logo/Nanobank Syariah.svg` | Nanobank Syariah | `nanobank-syariah` |  |
| `Bank Logo/OCBC NISP.svg` | OCBC NISP | `ocbc-nisp` |  |
| `Bank Logo/OK Bank.svg` | OK Bank | `ok-bank` |  |
| `Bank Logo/PRIMA Bank.svg` | PRIMA Bank | `prima-bank` |  |
| `Bank Logo/Panin Dubai Syariah.svg` | Panin Dubai Syariah | `panin-dubai-syariah` |  |
| `Bank Logo/PaninBank.svg` | PaninBank | `paninbank` |  |
| `Bank Logo/Permata Bank (Alt).svg` | Permata Bank (Alt) | `permata-bank-alt` |  |
| `Bank Logo/Permata Bank (New).svg` | Permata Bank (New) | `permata-bank-new` |  |
| `Bank Logo/Permata.svg` | Permata | `permata` |  |
| `Bank Logo/QNB.svg` | QNB | `qnb` |  |
| `Bank Logo/SBI Indonesia.svg` | SBI Indonesia | `sbi-indonesia` |  |
| `Bank Logo/SeaBank.svg` | SeaBank | `seabank` |  |
| `Bank Logo/Shinhan Bank (Alt).svg` | Shinhan Bank (Alt) | `shinhan-bank-alt` |  |
| `Bank Logo/Shinhan Bank.svg` | Shinhan Bank | `shinhan-bank` |  |
| `Bank Logo/Sinarmas Syariah.svg` | Sinarmas Syariah | `sinarmas-syariah` |  |
| `Bank Logo/Sinarmas.svg` | Sinarmas | `sinarmas` |  |
| `Bank Logo/Standard Chartered.svg` | Standard Chartered | `standard-chartered` |  |
| `Bank Logo/Superbank (Alt).svg` | Superbank (Alt) | `superbank-alt` |  |
| `Bank Logo/Superbank.svg` | Superbank | `superbank` |  |
| `Bank Logo/UOB.svg` | UOB | `uob` |  |
| `Bank Logo/Welab Bank.svg` | Welab Bank | `welab-bank` |  |
| `Bank Logo/hibank.svg` | hibank | `hibank` |  |
| `Card Payment/Amercian Express (Alt).svg` | Amercian Express (Alt) | `amercian-express-alt` |  |
| `Card Payment/American Express (Alt-2).svg` | American Express (Alt-2) | `american-express-alt-2` |  |
| `Card Payment/American Express.svg` | American Express | `american-express` |  |
| `Card Payment/Apple Card.svg` | Apple Card | `apple-card` |  |
| `Card Payment/Cirrus.svg` | Cirrus | `cirrus` |  |
| `Card Payment/Contactless (Alt).svg` | Contactless (Alt) | `contactless-alt` |  |
| `Card Payment/Contactless.svg` | Contactless | `contactless` |  |
| `Card Payment/Discover (Alt).svg` | Discover (Alt) | `discover-alt` |  |
| `Card Payment/Discover.svg` | Discover | `discover` |  |
| `Card Payment/GPN.svg` | GPN | `gpn` |  |
| `Card Payment/JCB.svg` | JCB | `jcb` |  |
| `Card Payment/Maestro.svg` | Maestro | `maestro` |  |
| `Card Payment/Mastercard Black.svg` | Mastercard Black | `mastercard-black` |  |
| `Card Payment/Mastercard Contactless (Alt).svg` | Mastercard Contactless (Alt) | `mastercard-contactless-alt` |  |
| `Card Payment/Mastercard Contactless.svg` | Mastercard Contactless | `mastercard-contactless` |  |
| `Card Payment/Mastercard Debit (Alt).svg` | Mastercard Debit (Alt) | `mastercard-debit-alt` |  |
| `Card Payment/Mastercard Debit.svg` | Mastercard Debit | `mastercard-debit` |  |
| `Card Payment/Mastercard SecureCode (New).svg` | Mastercard SecureCode (New) | `mastercard-securecode-new` |  |
| `Card Payment/Mastercard SecureCode.svg` | Mastercard SecureCode | `mastercard-securecode` |  |
| `Card Payment/Mastercard.svg` | Mastercard | `mastercard` |  |
| `Card Payment/Masterpass (Alt).svg` | Masterpass (Alt) | `masterpass-alt` |  |
| `Card Payment/Masterpass.svg` | Masterpass | `masterpass` |  |
| `Card Payment/Samsung Card.svg` | Samsung Card | `samsung-card` |  |
| `Card Payment/Union Pay (EN).svg` | Union Pay (EN) | `union-pay-en` |  |
| `Card Payment/Union Pay Contactless (EN).svg` | Union Pay Contactless (EN) | `union-pay-contactless-en` |  |
| `Card Payment/Union Pay Contactless.svg` | Union Pay Contactless | `union-pay-contactless` |  |
| `Card Payment/Union Pay.svg` | Union Pay | `union-pay` |  |
| `Card Payment/VISA Checkout.svg` | VISA Checkout | `visa-checkout` |  |
| `Card Payment/VISA Debit.svg` | VISA Debit | `visa-debit` |  |
| `Card Payment/VISA Pay.svg` | VISA Pay | `visa-pay` |  |
| `Card Payment/VISA PayWave.svg` | VISA PayWave | `visa-paywave` |  |
| `Card Payment/VISA Plus.svg` | VISA Plus | `visa-plus` |  |
| `Card Payment/VISA Secure (3DS).svg` | VISA Secure (3DS) | `visa-secure-3ds` |  |
| `Card Payment/VISA Signature.svg` | VISA Signature | `visa-signature` |  |
| `Card Payment/VISA.svg` | VISA | `visa` |  |
| `Card Payment/Verified by VISA (New).svg` | Verified by VISA (New) | `verified-by-visa-new` |  |
| `Card Payment/Verified by VISA.svg` | Verified by VISA | `verified-by-visa` |  |
| `Direct Debit/BCA KlikPay.svg` | BCA KlikPay | `bca-klikpay` |  |
| `Direct Debit/BRI Direct Debit.svg` | BRI Direct Debit | `bri-direct-debit` |  |
| `Direct Debit/Jenius Pay.svg` | Jenius Pay | `jenius-pay` |  |
| `Direct Debit/Mandiri E-Cash.svg` | Mandiri E-Cash | `mandiri-e-cash` |  |
| `Direct Debit/OCTO Clicks.svg` | OCTO Clicks | `octo-clicks-direct-debit` | aliased (collision-disambiguated) |
| `Direct Debit/OneKlik.svg` | OneKlik | `oneklik` |  |
| `Direct Debit/UOB EZ Pay.svg` | UOB EZ Pay | `uob-ez-pay` |  |
| `Donation/BAZNAS.svg` | BAZNAS | `baznas` |  |
| `Donation/Dompet Dhuafa (Alt).svg` | Dompet Dhuafa (Alt) | `dompet-dhuafa-alt` |  |
| `Donation/Dompet Dhuafa.svg` | Dompet Dhuafa | `dompet-dhuafa` |  |
| `Donation/Kitabisa (Alt).svg` | Kitabisa (Alt) | `kitabisa-alt` |  |
| `Donation/Kitabisa.svg` | Kitabisa | `kitabisa` |  |
| `Donation/Rumah Zakat (Alt).svg` | Rumah Zakat (Alt) | `rumah-zakat-alt` |  |
| `Donation/Rumah Zakat.svg` | Rumah Zakat | `rumah-zakat` |  |
| `E-Commerce/Bhinneka.svg` | Bhinneka | `bhinneka` |  |
| `E-Commerce/Blibli.svg` | Blibli | `blibli` |  |
| `E-Commerce/Bukalapak (New).svg` | Bukalapak (New) | `bukalapak-new` |  |
| `E-Commerce/Bukalapak.svg` | Bukalapak | `bukalapak` |  |
| `E-Commerce/Lazada.svg` | Lazada | `lazada` |  |
| `E-Commerce/Shopee (Alt).svg` | Shopee (Alt) | `shopee-alt` |  |
| `E-Commerce/Shopee.svg` | Shopee | `shopee` |  |
| `E-Commerce/Tokopedia.svg` | Tokopedia | `tokopedia` |  |
| `E-Commerce/Zalora.svg` | Zalora | `zalora` |  |
| `E-Wallet/Astra Pay.svg` | Astra Pay | `astra-pay` |  |
| `E-Wallet/Bluepay.svg` | Bluepay | `bluepay` |  |
| `E-Wallet/DANA.svg` | DANA | `dana` |  |
| `E-Wallet/DOKU.svg` | DOKU | `doku` |  |
| `E-Wallet/Dipay.svg` | Dipay | `dipay` |  |
| `E-Wallet/Dutamoney.svg` | Dutamoney | `dutamoney` |  |
| `E-Wallet/Gopay (Alt).svg` | Gopay (Alt) | `gopay-alt` |  |
| `E-Wallet/Gopay.svg` | Gopay | `gopay` |  |
| `E-Wallet/I.Saku.svg` | I.Saku | `i-saku` |  |
| `E-Wallet/JakOne Pay.svg` | JakOne Pay | `jakone-pay` |  |
| `E-Wallet/Kaspro.svg` | Kaspro | `kaspro` |  |
| `E-Wallet/LinkAja.svg` | LinkAja | `linkaja` |  |
| `E-Wallet/Motion Pay.svg` | Motion Pay | `motion-pay` |  |
| `E-Wallet/Netzme.svg` | Netzme | `netzme` |  |
| `E-Wallet/OTTO Pay.svg` | OTTO Pay | `otto-pay` |  |
| `E-Wallet/OVO (New Alt).svg` | OVO (New Alt) | `ovo-new-alt` |  |
| `E-Wallet/OVO (New).svg` | OVO (New) | `ovo-new` |  |
| `E-Wallet/OVO (Old Alt).svg` | OVO (Old Alt) | `ovo-old-alt` |  |
| `E-Wallet/OVO (Old).svg` | OVO (Old) | `ovo-old` |  |
| `E-Wallet/Paydia.svg` | Paydia | `paydia` |  |
| `E-Wallet/Paytren.svg` | Paytren | `paytren` |  |
| `E-Wallet/Pospay.svg` | Pospay | `pospay` |  |
| `E-Wallet/Shopee Pay.svg` | Shopee Pay | `shopee-pay` |  |
| `E-Wallet/SpeedCash.svg` | SpeedCash | `speedcash` |  |
| `E-Wallet/TrueMoney.svg` | TrueMoney | `truemoney` |  |
| `E-Wallet/Uangku.svg` | Uangku | `uangku` |  |
| `E-Wallet/Yukk.svg` | Yukk | `yukk` |  |
| `Entertainment/Apple Music.svg` | Apple Music | `apple-music` |  |
| `Entertainment/CGV.svg` | CGV | `cgv` |  |
| `Entertainment/Catchplay.svg` | Catchplay | `catchplay` |  |
| `Entertainment/Cinepolis.svg` | Cinepolis | `cinepolis` |  |
| `Entertainment/Disney+ Hotstar.svg` | Disney+ Hotstar | `disney-plus-hotstar` |  |
| `Entertainment/Disney+.svg` | Disney+ | `disney-plus` |  |
| `Entertainment/HBO GO.svg` | HBO GO | `hbo-go` |  |
| `Entertainment/HOOX.svg` | HOOX | `hoox` |  |
| `Entertainment/JOOX.svg` | JOOX | `joox` |  |
| `Entertainment/Langitmusik.svg` | Langitmusik | `langitmusik` |  |
| `Entertainment/MNC Vision.svg` | MNC Vision | `mnc-vision` |  |
| `Entertainment/MTIX.svg` | MTIX | `mtix` |  |
| `Entertainment/Maxstream.svg` | Maxstream | `maxstream` |  |
| `Entertainment/Netflix (Alt).svg` | Netflix (Alt) | `netflix-alt` |  |
| `Entertainment/Netflix.svg` | Netflix | `netflix` |  |
| `Entertainment/Nex Parabola.svg` | Nex Parabola | `nex-parabola` |  |
| `Entertainment/Nickelodeon.svg` | Nickelodeon | `nickelodeon` |  |
| `Entertainment/Prime Video.svg` | Prime Video | `prime-video` |  |
| `Entertainment/Spotify (Alt).svg` | Spotify (Alt) | `spotify-alt` |  |
| `Entertainment/Spotify.svg` | Spotify | `spotify` |  |
| `Entertainment/TransVision (New).svg` | TransVision (New) | `transvision-new` |  |
| `Entertainment/TransVision (Old).svg` | TransVision (Old) | `transvision-old` |  |
| `Entertainment/VIU.svg` | VIU | `viu` |  |
| `Entertainment/Vidio.svg` | Vidio | `vidio` |  |
| `Entertainment/Vision+.svg` | Vision+ | `vision-plus` |  |
| `Entertainment/XXI (21).svg` | XXI (21) | `xxi-21` |  |
| `Financing/ACC (Alt).svg` | ACC (Alt) | `acc-alt` |  |
| `Financing/ACC.svg` | ACC | `acc` |  |
| `Financing/AEON Credit Service.svg` | AEON Credit Service | `aeon-credit-service` |  |
| `Financing/AdaKami (Alt).svg` | AdaKami (Alt) | `adakami-alt` |  |
| `Financing/AdaKami.svg` | AdaKami | `adakami` |  |
| `Financing/Adira Finance.svg` | Adira Finance | `adira-finance` |  |
| `Financing/Akulaku Paylater.svg` | Akulaku Paylater | `akulaku-paylater` |  |
| `Financing/Akulaku.svg` | Akulaku | `akulaku` |  |
| `Financing/BCA Finance.svg` | BCA Finance | `bca-finance` |  |
| `Financing/BRI Finance.svg` | BRI Finance | `bri-finance` |  |
| `Financing/Bussan Auto Finance.svg` | Bussan Auto Finance | `bussan-auto-finance` |  |
| `Financing/Daihatsu Financial Service.svg` | Daihatsu Financial Service | `daihatsu-financial-service` |  |
| `Financing/FIF Astra.svg` | FIF Astra | `fif-astra` |  |
| `Financing/Finmas.svg` | Finmas | `finmas` |  |
| `Financing/Gopaylater.svg` | Gopaylater | `gopaylater` |  |
| `Financing/Home Credit.svg` | Home Credit | `home-credit` |  |
| `Financing/Indodana.svg` | Indodana | `indodana` |  |
| `Financing/Kredit Pintar.svg` | Kredit Pintar | `kredit-pintar` |  |
| `Financing/KreditPlus.svg` | KreditPlus | `kreditplus` |  |
| `Financing/Kredivo.svg` | Kredivo | `kredivo` |  |
| `Financing/Lexus Financial Service-1.svg` | Lexus Financial Service-1 | `lexus-financial-service-1` |  |
| `Financing/Lexus Financial Service.svg` | Lexus Financial Service | `lexus-financial-service` |  |
| `Financing/Pegadaian.svg` | Pegadaian | `pegadaian` |  |
| `Financing/TAF - Toyota Astra Financial.svg` | TAF - Toyota Astra Financial | `taf-toyota-astra-financial` |  |
| `Financing/Toyota Financial Service.svg` | Toyota Financial Service | `toyota-financial-service` |  |
| `Financing/WOM Finance.svg` | WOM Finance | `wom-finance` |  |
| `Game/App Store.svg` | App Store | `app-store` |  |
| `Game/Apple Arcade.svg` | Apple Arcade | `apple-arcade` |  |
| `Game/EA Play (Alt).svg` | EA Play (Alt) | `ea-play-alt` |  |
| `Game/EA Play.svg` | EA Play | `ea-play` |  |
| `Game/Epic Games Store.svg` | Epic Games Store | `epic-games-store` |  |
| `Game/Epic Games.svg` | Epic Games | `epic-games` |  |
| `Game/Google Play (Alt).svg` | Google Play (Alt) | `google-play-alt` |  |
| `Game/Google Play.svg` | Google Play | `google-play` |  |
| `Game/My Nintendo.svg` | My Nintendo | `my-nintendo` |  |
| `Game/Nintendo Online.svg` | Nintendo Online | `nintendo-online` |  |
| `Game/Playstation Plus.svg` | Playstation Plus | `playstation-plus` |  |
| `Game/Playstation Store.svg` | Playstation Store | `playstation-store` |  |
| `Game/Steam.svg` | Steam | `steam` |  |
| `Game/UBISOFT+.svg` | UBISOFT+ | `ubisoft-plus` |  |
| `Game/XBOX Game Pass.svg` | XBOX Game Pass | `xbox-game-pass` |  |
| `Government/Bea Cukai.svg` | Bea Cukai | `bea-cukai` |  |
| `Government/DJP Online (Alt).svg` | DJP Online (Alt) | `djp-online-alt` |  |
| `Government/DJP Online.svg` | DJP Online | `djp-online` |  |
| `Government/Kemenkeu.svg` | Kemenkeu | `kemenkeu` |  |
| `Government/QRIS.svg` | QRIS | `qris` |  |
| `ISP/Biznet Home.svg` | Biznet Home | `biznet-home` |  |
| `ISP/Biznet.svg` | Biznet | `biznet` |  |
| `ISP/CBN.svg` | CBN | `cbn` |  |
| `ISP/First Media.svg` | First Media | `first-media` |  |
| `ISP/IndiHome (New).svg` | IndiHome (New) | `indihome-new` |  |
| `ISP/IndiHome (Old).svg` | IndiHome (Old) | `indihome-old` |  |
| `ISP/Indosat Hifi.svg` | Indosat Hifi | `indosat-hifi` |  |
| `ISP/Indosat M2.svg` | Indosat M2 | `indosat-m2` |  |
| `ISP/Melsa.svg` | Melsa | `melsa` |  |
| `ISP/MyRepublic.svg` | MyRepublic | `myrepublic` |  |
| `ISP/Telkomsel Orbit.svg` | Telkomsel Orbit | `telkomsel-orbit` |  |
| `Logistic/ASSA.svg` | ASSA | `assa` |  |
| `Logistic/Anteraja.svg` | Anteraja | `anteraja` |  |
| `Logistic/DHL Express.svg` | DHL Express | `dhl-express` |  |
| `Logistic/Dakota Cargo.svg` | Dakota Cargo | `dakota-cargo` |  |
| `Logistic/Dakota Logistik.svg` | Dakota Logistik | `dakota-logistik` |  |
| `Logistic/EMS.svg` | EMS | `ems` |  |
| `Logistic/ESL Express.svg` | ESL Express | `esl-express` |  |
| `Logistic/FedEx Express.svg` | FedEx Express | `fedex-express` |  |
| `Logistic/First Logistic.svg` | First Logistic | `first-logistic` |  |
| `Logistic/ID Express.svg` | ID Express | `id-express` |  |
| `Logistic/J&T Cargo.svg` | J&T Cargo | `j-and-t-cargo` |  |
| `Logistic/J&T Express.svg` | J&T Express | `j-and-t-express` |  |
| `Logistic/JNE (Alt).svg` | JNE (Alt) | `jne-alt` |  |
| `Logistic/JNE.svg` | JNE | `jne` |  |
| `Logistic/KAI Logistik.svg` | KAI Logistik | `kai-logistik` |  |
| `Logistic/Lalamove.svg` | Lalamove | `lalamove` |  |
| `Logistic/Lazada Express.svg` | Lazada Express | `lazada-express` |  |
| `Logistic/Lion Parcel.svg` | Lion Parcel | `lion-parcel` |  |
| `Logistic/NCS.svg` | NCS | `ncs` |  |
| `Logistic/Ninja Xpress.svg` | Ninja Xpress | `ninja-xpress` |  |
| `Logistic/PCP Express.svg` | PCP Express | `pcp-express` |  |
| `Logistic/Pandu Logistics.svg` | Pandu Logistics | `pandu-logistics` |  |
| `Logistic/Pos Indonesia (New).svg` | Pos Indonesia (New) | `pos-indonesia-new` |  |
| `Logistic/Pos Indonesia (Old).svg` | Pos Indonesia (Old) | `pos-indonesia-old` |  |
| `Logistic/REX.svg` | REX | `rex` |  |
| `Logistic/RPX.svg` | RPX | `rpx` |  |
| `Logistic/SAP Express.svg` | SAP Express | `sap-express` |  |
| `Logistic/SPX Express.svg` | SPX Express | `spx-express` |  |
| `Logistic/Sicepat Ekspres.svg` | Sicepat Ekspres | `sicepat-ekspres` |  |
| `Logistic/TIKI.svg` | TIKI | `tiki` |  |
| `Logistic/Wahana Express (Alt).svg` | Wahana Express (Alt) | `wahana-express-alt` |  |
| `Logistic/Wahana Express.svg` | Wahana Express | `wahana-express` |  |
| `Miscellaneous/Alipay (New).svg` | Alipay (New) | `alipay-new` |  |
| `Miscellaneous/Alipay (Old).svg` | Alipay (Old) | `alipay-old` |  |
| `Miscellaneous/Apple Pay.svg` | Apple Pay | `apple-pay` |  |
| `Miscellaneous/Google Pay.svg` | Google Pay | `google-pay` |  |
| `Miscellaneous/Grab Pay.svg` | Grab Pay | `grab-pay` |  |
| `Miscellaneous/Interlink.svg` | Interlink | `interlink` |  |
| `Miscellaneous/LINE Pay (Alt).svg` | LINE Pay (Alt) | `line-pay-alt` |  |
| `Miscellaneous/LINE Pay.svg` | LINE Pay | `line-pay` |  |
| `Miscellaneous/NETS.svg` | NETS | `nets` |  |
| `Miscellaneous/PayPal.svg` | PayPal | — | dropped (near-duplicate of canonical entry) |
| `Miscellaneous/QRIS.svg` | QRIS | — | dropped (near-duplicate of canonical entry) |
| `Miscellaneous/Samsung Pay (Alt).svg` | Samsung Pay (Alt) | `samsung-pay-alt` |  |
| `Miscellaneous/Samsung Pay.svg` | Samsung Pay | `samsung-pay` |  |
| `Miscellaneous/Western Union.svg` | Western Union | — | dropped (near-duplicate of canonical entry) |
| `Miscellaneous/Wirecard-1.svg` | Wirecard-1 | `wirecard-1` |  |
| `Miscellaneous/Wirecard-2.svg` | Wirecard-2 | `wirecard-2` |  |
| `Miscellaneous/Wirecard.svg` | Wirecard | `wirecard` |  |
| `Mobile Telco/AXIS.svg` | AXIS | `axis` |  |
| `Mobile Telco/IM3.svg` | IM3 | `im3` |  |
| `Mobile Telco/Kartu As.svg` | Kartu As | `kartu-as` |  |
| `Mobile Telco/Kartu Halo.svg` | Kartu Halo | `kartu-halo` |  |
| `Mobile Telco/Live.On.svg` | Live.On | `live-on` |  |
| `Mobile Telco/Mentari Ooredoo.svg` | Mentari Ooredoo | `mentari-ooredoo` |  |
| `Mobile Telco/Simpati.svg` | Simpati | `simpati` |  |
| `Mobile Telco/Smartfren (Old).svg` | Smartfren (Old) | `smartfren-old` |  |
| `Mobile Telco/Smartfren.svg` | Smartfren | `smartfren` |  |
| `Mobile Telco/Telkomsel (Alt).svg` | Telkomsel (Alt) | `telkomsel-alt` |  |
| `Mobile Telco/Telkomsel Halo.svg` | Telkomsel Halo | `telkomsel-halo` |  |
| `Mobile Telco/Telkomsel Prabayar.svg` | Telkomsel Prabayar | `telkomsel-prabayar` |  |
| `Mobile Telco/Telkomsel.svg` | Telkomsel | `telkomsel` |  |
| `Mobile Telco/Tri.svg` | Tri | `tri` |  |
| `Mobile Telco/XL Prioritas.svg` | XL Prioritas | `xl-prioritas` |  |
| `Mobile Telco/XL.svg` | XL | `xl` |  |
| `Mobile Telco/by.U.svg` | by.U | `by-u` |  |
| `Payment Gateway/2c2p.svg` | 2c2p | `2c2p` |  |
| `Payment Gateway/DOKU.svg` | DOKU | — | dropped (near-duplicate of canonical entry) |
| `Payment Gateway/Espay.svg` | Espay | `espay` |  |
| `Payment Gateway/Finpay.svg` | Finpay | `finpay` |  |
| `Payment Gateway/Midtrans.svg` | Midtrans | `midtrans` |  |
| `Payment Gateway/PrismaLink.svg` | PrismaLink | `prismalink` |  |
| `Payment Gateway/Stripe.svg` | Stripe | `stripe` |  |
| `Payment Gateway/Xendit.svg` | Xendit | `xendit` |  |
| `Payment Gateway/ipay88.svg` | ipay88 | `ipay88` |  |
| `Prepaid Card/BCA Flazz (Alt).svg` | BCA Flazz (Alt) | `bca-flazz-alt` |  |
| `Prepaid Card/BCA Flazz.svg` | BCA Flazz | `bca-flazz` |  |
| `Prepaid Card/BNI TapCash.svg` | BNI TapCash | `bni-tapcash` |  |
| `Prepaid Card/BRI BRIZZI (Alt).svg` | BRI BRIZZI (Alt) | `bri-brizzi-alt` |  |
| `Prepaid Card/BRI BRIZZI.svg` | BRI BRIZZI | `bri-brizzi` |  |
| `Prepaid Card/Jakcard.svg` | Jakcard | `jakcard` |  |
| `Prepaid Card/Mandiri e-money.svg` | Mandiri e-money | `mandiri-e-money` |  |
| `Prepaid Card/e-Toll Card.svg` | e-Toll Card | `e-toll-card` |  |
| `Regulatory/AFPI.svg` | AFPI | `afpi` |  |
| `Regulatory/ASPI.svg` | ASPI | `aspi` |  |
| `Regulatory/BAPPEBTI.svg` | BAPPEBTI | `bappebti` |  |
| `Regulatory/BPD.svg` | BPD | `bpd` |  |
| `Regulatory/Bank Indonesia.svg` | Bank Indonesia | `bank-indonesia` |  |
| `Regulatory/Ekonomi Syariah (Alt).svg` | Ekonomi Syariah (Alt) | `ekonomi-syariah-alt` |  |
| `Regulatory/Ekonomi Syariah.svg` | Ekonomi Syariah | `ekonomi-syariah` |  |
| `Regulatory/Inklusi Keuangan.svg` | Inklusi Keuangan | `inklusi-keuangan` |  |
| `Regulatory/KOMINFO.svg` | KOMINFO | `kominfo` |  |
| `Regulatory/LPS.svg` | LPS | `lps` |  |
| `Regulatory/OJK.svg` | OJK | `ojk` |  |
| `Regulatory/Perbankan Syariah (IB).svg` | Perbankan Syariah (IB) | `perbankan-syariah-ib` |  |
| `Regulatory/World Bank (Alt).svg` | World Bank (Alt) | `world-bank-alt` |  |
| `Regulatory/World Bank.svg` | World Bank | `world-bank` |  |
| `Remittance/Flip.svg` | Flip | `flip` |  |
| `Remittance/MoneyGram.svg` | MoneyGram | `moneygram` |  |
| `Remittance/PayPal.svg` | PayPal | `paypal` |  |
| `Remittance/Payoneer.svg` | Payoneer | `payoneer` |  |
| `Remittance/Ria Money.svg` | Ria Money | `ria-money` |  |
| `Remittance/Skrill.svg` | Skrill | `skrill` |  |
| `Remittance/Transfez.svg` | Transfez | `transfez` |  |
| `Remittance/Western Union.svg` | Western Union | `western-union` |  |
| `Remittance/Wise.svg` | Wise | `wise` |  |
| `Supermarket/Alfamart.svg` | Alfamart | `alfamart` |  |
| `Supermarket/Alfamidi.svg` | Alfamidi | `alfamidi` |  |
| `Supermarket/Bright.svg` | Bright | `bright` |  |
| `Supermarket/Circle K (Alt).svg` | Circle K (Alt) | `circle-k-alt` |  |
| `Supermarket/Circle K.svg` | Circle K | `circle-k` |  |
| `Supermarket/Dan+Dan.svg` | Dan+Dan | `dan-plus-dan` |  |
| `Supermarket/Family Mart.svg` | Family Mart | `family-mart` |  |
| `Supermarket/Giant.svg` | Giant | `giant` |  |
| `Supermarket/Hero.svg` | Hero | `hero` |  |
| `Supermarket/Hypermart.svg` | Hypermart | `hypermart` |  |
| `Supermarket/Indomaret.svg` | Indomaret | `indomaret` |  |
| `Supermarket/Lawson.svg` | Lawson | `lawson` |  |
| `Supermarket/Lotte Grosir.svg` | Lotte Grosir | `lotte-grosir` |  |
| `Supermarket/Lotte Mart.svg` | Lotte Mart | `lotte-mart` |  |
| `Supermarket/Lotte.svg` | Lotte | `lotte` |  |
| `Supermarket/Toserba Yogya.svg` | Toserba Yogya | `toserba-yogya` |  |
| `Supermarket/Transmart.svg` | Transmart | `transmart` |  |
| `Supermarket/Yomart.svg` | Yomart | `yomart` |  |
| `Switching/ALTO.svg` | ALTO | `alto` |  |
| `Switching/ATM Bersama.svg` | ATM Bersama | `atm-bersama` |  |
| `Switching/BCA ATM.svg` | BCA ATM | `bca-atm` |  |
| `Switching/BCA Debit.svg` | BCA Debit | `bca-debit` |  |
| `Switching/BI-FAST.svg` | BI-FAST | `bi-fast` |  |
| `Switching/Jalin.svg` | Jalin | `jalin` |  |
| `Switching/Link (New Alt).svg` | Link (New Alt) | `link-new-alt` |  |
| `Switching/Link (New).svg` | Link (New) | `link-new` |  |
| `Switching/Link (Old).svg` | Link (Old) | `link-old` |  |
| `Switching/Link.svg` | Link | `link` |  |
| `Switching/MEPS.svg` | MEPS | `meps` |  |
| `Switching/PRIMA Debit.svg` | PRIMA Debit | `prima-debit` |  |
| `Switching/PRIMA.svg` | PRIMA | `prima` |  |
| `Transportation/Cititrans.svg` | Cititrans | `cititrans` |  |
| `Transportation/DAMRI.svg` | DAMRI | `damri` |  |
| `Transportation/DayTrans.svg` | DayTrans | `daytrans` |  |
| `Transportation/JakLingko.svg` | JakLingko | `jaklingko` |  |
| `Transportation/KAI Bandara.svg` | KAI Bandara | `kai-bandara` |  |
| `Transportation/KAI Commuter (New).svg` | KAI Commuter (New) | `kai-commuter-new` |  |
| `Transportation/KAI Commuter (Old).svg` | KAI Commuter (Old) | `kai-commuter-old` |  |
| `Transportation/KAI.svg` | KAI | `kai` |  |
| `Transportation/LRT Jakarta.svg` | LRT Jakarta | `lrt-jakarta` |  |
| `Transportation/MRT Jakarta.svg` | MRT Jakarta | `mrt-jakarta` |  |
| `Transportation/TransJakarta.svg` | TransJakarta | `transjakarta` |  |
| `Transportation/Whoosh.svg` | Whoosh | `whoosh` |  |
| `Utilities/Aetra Tangerang.svg` | Aetra Tangerang | `aetra-tangerang` |  |
| `Utilities/PAM Jaya (New).svg` | PAM Jaya (New) | `pam-jaya-new` |  |
| `Utilities/PAM Jaya (Old).svg` | PAM Jaya (Old) | `pam-jaya-old` |  |
| `Utilities/PDAM Kota Surabaya.svg` | PDAM Kota Surabaya | `pdam-kota-surabaya` |  |
| `Utilities/PDAM.svg` | PDAM | `pdam` |  |
| `Utilities/PGN.svg` | PGN | `pgn` |  |
| `Utilities/PLN.svg` | PLN | `pln` |  |
