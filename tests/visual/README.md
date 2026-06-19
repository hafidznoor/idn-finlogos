# Visual regression tests

Renders **every** logo in [`icons/`](../../icons/) into a normalized white canvas
(320×200, aspect preserved) with headless Chromium and pixel-diffs it against a
committed baseline image. Catches unintended appearance changes from re-exports,
SVGO config changes, or edits.

The **current working tree is the source of truth.** Baseline PNGs under
`icons.spec.ts-snapshots/` are the approved reference — one per logo — and are
committed to the repo. A failing test means a logo now renders differently than
the approved baseline.

## Usage

```bash
# Run the regression check (current icons vs committed baselines)
npm run test:visual

# Browse the HTML report — expected / actual / diff side by side
npm run test:visual:report

# Re-approve baselines after an INTENTIONAL logo change
# (review the diff first, then commit the updated PNGs)
npm run test:visual:update
```

## Workflow

1. Edit / add / re-export logos in `icons/`.
2. `npm run test:visual` — green means nothing changed unexpectedly.
3. If a test fails, open the report. If the change is **intended**, run
   `npm run test:visual:update` and commit the new baseline PNGs. If it's a
   **regression**, fix the SVG.
4. New icons added to `icons/` are picked up automatically; their baseline is
   created on the next `--update-snapshots` run.

## Notes

- Tolerance is set in `playwright.config.ts` (`maxDiffPixelRatio` / `threshold`)
  to ignore sub-pixel antialiasing while catching real shape/color changes.
- Baselines are platform-suffixed (`-chromium-darwin.png`). If CI runs on Linux,
  generate Linux baselines there (Playwright in Docker) or commit both.
