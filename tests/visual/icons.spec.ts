import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Repo root is two levels up from tests/visual.
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const ICONS_DIR = resolve(ROOT, "icons");

// Fixed canvas so every render is the same size regardless of the SVG's own
// viewBox/dimensions. Aspect ratio is preserved (the SVG is scaled to fit).
const CANVAS = { width: 320, height: 200 };

/** Every authored logo. The working tree is the source of truth / approved baseline. */
function allIcons(): string[] {
  return readdirSync(ICONS_DIR)
    .filter((f) => f.endsWith(".svg"))
    .sort();
}

function pageHtml(svg: string): string {
  // White background, centered, aspect-preserved within the fixed canvas.
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{background:#fff}
    .stage{width:${CANVAS.width}px;height:${CANVAS.height}px;display:flex;align-items:center;justify-content:center;background:#fff}
    .stage svg{max-width:90%;max-height:90%;width:auto;height:auto;display:block}
  </style></head><body><div class="stage">${svg}</div></body></html>`;
}

const icons = allIcons();

test.describe("SVG logo rendering", () => {
  test("found logos to check", () => {
    expect(icons.length, "no SVGs found in icons/").toBeGreaterThan(0);
  });

  for (const file of icons) {
    const name = file.replace(/\.svg$/, "");
    test(name, async ({ page }) => {
      const svg = readFileSync(resolve(ICONS_DIR, file), "utf8");
      await page.setViewportSize(CANVAS);
      await page.setContent(pageHtml(svg), { waitUntil: "networkidle" });
      const stage = page.locator(".stage");
      await expect(stage).toHaveScreenshot(`${name}.png`, {
        animations: "disabled",
      });
    });
  }
});
