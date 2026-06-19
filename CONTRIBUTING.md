# Contributing

This is a curated collection of Indonesian financial institution logos. Contributions are welcome but reviewed manually — please open an issue first if you're proposing more than a single logo update.

## Reporting a logo issue (most common)

Open an issue at https://github.com/hafidznoor/idn-finlogos/issues with:

- **Brand name** as it should display.
- **Category** (one of the slugs in [`data/categories.yml`](./data/categories.yml)).
- **Trademark holder** — the parent company.
- **Source** — where the vector came from (official press kit, brand guidelines page, etc.). The source matters because trademark holders may push back on unauthorized reproductions.
- **What's wrong** — outdated logo, wrong category, blurry export, etc.

If you're a trademark holder asking for a logo to be removed or updated, please say so explicitly in the issue. Removals are processed quickly.

## Adding a new logo (for maintainers)

1. Drop the SVG into [`icons/`](./icons/) named with the kebab-case slug rule (see [`scripts/slugify.mjs`](./scripts/slugify.mjs)). Examples: `bca-digital.svg`, `j-and-t-cargo.svg`.
2. Add an entry to [`data/logos.yml`](./data/logos.yml):
   ```yaml
   - slug: new-bank
     name: New Bank
     category: bank-logo
     aliases: ['Bank Baru']   # optional
     tags: ['digital-bank']    # optional
   ```
3. Run validation:
   ```bash
   npm run validate
   ```
4. **Regenerate every platform's output** — this is required for SPM and JitPack consumers, which clone the tagged commit directly and have no regeneration step of their own:
   ```bash
   npm run build:all
   git add platforms Sources/IdnFinLogos dist
   ```
5. Inspect the npm tarball:
   ```bash
   npm pack --dry-run
   ```

CI (`ci.yml`) runs `npm run build:all` on every PR and fails if the committed `platforms/` or `Sources/IdnFinLogos/` files don't match what the generators would emit — so the regeneration is enforced, not optional.

## SVG hygiene

- Keep `viewBox` on the root `<svg>`. Don't strip `width`/`height`.
- Don't mangle clip-path IDs (SVGO is configured to leave IDs alone).
- Don't inline raster `<image>` tags — this is a vector-only library.
- Preserve the brand's official colors. Don't recolor for "monochrome" variants.
- Reasonable file size: aim for under 30 KB raw. If a logo is much larger, simplify gradients/paths rather than over-detailing.

## Slug conventions

- **The bare brand slug always carries the newest official logo** (`bri` = current BRI logo). When a brand rebrands, the new art takes over the bare slug and the previous art moves to `<brand>-old`. Never add a `-new` suffix — "new" goes stale the moment the next rebrand lands.
- Superseded art gets `-old` (or `-old-alt` for its alternates). Alternate lockups of the current logo use `-alt`.
- When a slug is renamed, record the retired slug in that entry's `aliases` so `getLogo()`/`get()` lookups and search keep resolving it. An alias must never collide with a live slug (`npm run validate` enforces this).

### Aliases

Aliases are alternate lookup keys, kebab-case, sharing the slug namespace. Add only **genuine** keys a developer might actually type — no filler. `npm run validate` prints a coverage report (`N/471 canonical logos have ≥1 alias`) but never fails on gaps; a brand with no real alternate name (most global brands) is correctly left alias-less.

- **Banks** get their **SWIFT/BIC** code (lowercased, e.g. `cenaidja`) and **3-digit kode bank** (as a string with leading zeros, e.g. `'014'`). Numeric/SWIFT input resolves because `getLogo('CENAIDJA')`/`getLogo('014')` slugify to the alias. Verify both against ≥2 published sources (Bank Indonesia / SWIFT directory / reputable kode-bank lists); **skip when in doubt** rather than guess — wrong routing codes mislead. Regional banks (BPD) may also carry their common trade name (`bank-bpd-jateng` → `bank-jateng`). Attach codes only to the canonical `bank-logo` entry, not sibling app/card entries.
- **Other logos**: spelling/spacing variants (`shopee-pay` → `shopeepay`), Indonesian official long forms (`pln` → `perusahaan-listrik-negara`, `ojk` → `otoritas-jasa-keuangan`), or well-known abbreviations (`bca-flazz` → `flazz`).

## Slug collisions

If two logos would slugify to the same value (e.g. one brand appearing in multiple categories), see how the v1 → v2 migration handled this in [`scripts/bootstrap.mjs`](./scripts/bootstrap.mjs) under `OVERRIDES`. Same pattern applies:

- **Visually distinct** variants → keep both with a category suffix (`-app`, `-direct-debit`).
- **Near-duplicates** → keep one, drop the other; pick the more authoritative category.

## License obligations

- **Code contributions** are licensed MIT (see [LICENSE](./LICENSE)).
- **SVG contributions** are licensed CC-BY-NC-4.0 (see [LICENSE-ASSETS](./LICENSE-ASSETS)). By contributing, you confirm the SVG is yours to contribute or is publicly available, and the trademark holder has not objected.

## Release process (maintainers)

One git tag fans out to **four registries**: npm, Maven Central, JitPack, and pub.dev.

```bash
# 1. Bump version everywhere (npm version writes package.json + creates a tag).
npm version <major|minor|patch> --no-git-tag-version

# 2. Regenerate every platform's output with the new version baked in.
npm run build:all

# 3. Commit + tag + push.
git add package.json platforms Sources/IdnFinLogos dist
git commit -m "release: v$(node -p 'require(\"./package.json\").version')"
git tag "v$(node -p 'require(\"./package.json\").version')"
git push origin main --tags
```

The `release.yml` workflow then runs four publish jobs in parallel after a shared `generate` step:

| Job | Registry | Required secrets |
|---|---|---|
| `publish-npm` | npm | `NPM_TOKEN` (granular token scoped to `idn-finlogos`) |
| `publish-android` | Maven Central | `MAVEN_CENTRAL_USERNAME`, `MAVEN_CENTRAL_PASSWORD`, `SIGNING_KEY`, `SIGNING_PASSWORD` |
| `publish-flutter` | pub.dev | `PUB_CREDENTIALS_JSON` |
| `github-release` | GitHub Releases | (uses `GITHUB_TOKEN`) |

**JitPack** requires zero CI action — it lazily builds the Android AAR on first consumer request, using the [`jitpack.yml`](./jitpack.yml) at the repo root.

### One-time setup before the first release

1. **Sonatype Central Portal** ([central.sonatype.com](https://central.sonatype.com)) — register, verify the `io.github.hafidznoor` namespace by adding the assigned TXT record to your domain or via the GitHub-handle proof.
2. **GPG signing key** — generate (`gpg --gen-key`), publish to `keys.openpgp.org`, then export the private key as ASCII-armored (`gpg --armor --export-secret-keys <KEY_ID>`) and store its contents in the `SIGNING_KEY` secret. Store the key's passphrase in `SIGNING_PASSWORD`.
3. **pub.dev credentials** — run `dart pub token add https://pub.dev`, then copy the contents of `~/.config/dart/pub-credentials.json` into the `PUB_CREDENTIALS_JSON` secret.

Once these are in place, releases are fully automated.

## Why the platform files are committed

Generated platform sources (`platforms/android/.../Catalog.kt`, `Sources/IdnFinLogos/Catalog.generated.swift`, `platforms/flutter/lib/src/catalog.g.dart`) and the duplicated SVG assets are committed to the repo, *not* gitignored.

This is deliberate: **SPM and JitPack consumers clone the tagged commit and build directly** — they have no Node.js step that could regenerate. The committed files are the only way those ecosystems get a working package. CI enforces that the committed files match what the generators would emit, so they can never drift.
