# idn-finlogos

Indonesian financial institution logos — banks, e-wallets, payment gateways, switching, regulatory, and 18 more categories — as optimized SVGs with per-logo ESM imports.

**489 logos · 23 categories · SVG only · zero runtime dependencies**

> v2 of the original `indo-financial-logolibrary`. See [MIGRATION.md](./MIGRATION.md) if you're upgrading.

---

## Install

```bash
npm install idn-finlogos
```

Or use directly from a CDN — no install required.

---

## Four ways to use it

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
