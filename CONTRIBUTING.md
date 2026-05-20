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
4. Build and inspect:
   ```bash
   npm run build
   npm pack --dry-run
   ```

## SVG hygiene

- Keep `viewBox` on the root `<svg>`. Don't strip `width`/`height`.
- Don't mangle clip-path IDs (SVGO is configured to leave IDs alone).
- Don't inline raster `<image>` tags — this is a vector-only library.
- Preserve the brand's official colors. Don't recolor for "monochrome" variants.
- Reasonable file size: aim for under 30 KB raw. If a logo is much larger, simplify gradients/paths rather than over-detailing.

## Slug collisions

If two logos would slugify to the same value (e.g. one brand appearing in multiple categories), see how the v1 → v2 migration handled this in [`scripts/bootstrap.mjs`](./scripts/bootstrap.mjs) under `OVERRIDES`. Same pattern applies:

- **Visually distinct** variants → keep both with a category suffix (`-app`, `-direct-debit`).
- **Near-duplicates** → keep one, drop the other; pick the more authoritative category.

## License obligations

- **Code contributions** are licensed MIT (see [LICENSE](./LICENSE)).
- **SVG contributions** are licensed CC-BY-NC-4.0 (see [LICENSE-ASSETS](./LICENSE-ASSETS)). By contributing, you confirm the SVG is yours to contribute or is publicly available, and the trademark holder has not objected.

## Release process (maintainers)

1. `npm version <major|minor|patch>` — bumps version and tags.
2. `git push origin main --tags`
3. The `release.yml` workflow publishes to npm with provenance and creates a GitHub Release with the SVG zip attached.

The `NPM_TOKEN` repo secret needs to be set for publish. Use a granular access token scoped to `@hafidznoor/idn-finlogos` only.
