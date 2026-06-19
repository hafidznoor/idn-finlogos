import { defineConfig, devices } from "@playwright/test";

// Visual regression for the SVG logo set.
// Baselines live next to the spec under __snapshots__/ and are generated
// from the committed (HEAD) version of each icon (see render-mode in the spec).
export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "report", open: "never" }]],
  expect: {
    // Per-pixel + ratio tolerance. SVG rasterization is deterministic in
    // headless Chromium, so keep this tight to catch real shape/color changes
    // while ignoring sub-pixel antialiasing noise.
    toMatchSnapshot: { maxDiffPixelRatio: 0.002, threshold: 0.15 },
  },
  use: {
    ...devices["Desktop Chrome"],
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
