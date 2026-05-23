// Runs every generator in order:
//   1. scripts/build.mjs        — npm dist (also produces dist/manifest.json which others consume)
//   2. scripts/build-android.mjs
//   3. scripts/build-ios.mjs
//   4. scripts/build-flutter.mjs

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const REPO = path.resolve(import.meta.dirname, '..');

const steps = [
  ['build.mjs', 'npm distribution (dist/)'],
  ['build-android.mjs', 'Android library'],
  ['build-ios.mjs', 'iOS Swift Package'],
  ['build-flutter.mjs', 'Flutter package']
];

for (const [script, label] of steps) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync('node', [path.join('scripts', script)], { cwd: REPO, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`\nFailed at: scripts/${script}`);
    process.exit(r.status ?? 1);
  }
}

console.log('\nAll platforms built.');
