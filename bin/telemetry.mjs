// Anonymous usage telemetry for the idn-finlogos CLI.
//
// Purpose: learn which commands people actually use and — the signal we cannot
// get any other way — which brands they search for and DON'T find, so the
// catalog grows toward real demand.
//
// Downloads themselves are already visible in jsDelivr's public per-file stats
// (see scripts/stats.mjs), so this deliberately collects nothing about *which*
// logos succeeded beyond their public catalog slugs.
//
// Design rules, in priority order:
//   1. Never block the CLI. Sends are fire-and-forget with a hard time cap;
//      every failure is swallowed. No network, no problem.
//   2. Never transmit anything derived from the filesystem. --out is recorded
//      as a boolean, never as a path.
//   3. Free-text queries are transmitted only if they survive a strict
//      allowlist (see scrubQuery) that rejects anything path-, URL-, email-,
//      or secret-shaped. When in doubt the query is dropped, not sent.
//   4. Silent in CI and under DO_NOT_TRACK. Silent on first run, which only
//      prints the notice.
//
// Opt out permanently:  idn-finlogos telemetry off
// Opt out per-shell:    IDN_FINLOGOS_TELEMETRY=0
// See PRIVACY.md for the exact payload.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import process from 'node:process';

// PostHog-compatible capture endpoint. Project API keys ("phc_…") are designed
// to be public client-side identifiers — they can only write events, never read
// them — which is why shipping one in an npm package is safe.
const ENDPOINT = process.env.IDN_FINLOGOS_TELEMETRY_URL || 'https://us.i.posthog.com/i/v0/e/';
const API_KEY = process.env.IDN_FINLOGOS_TELEMETRY_KEY || '__POSTHOG_PROJECT_KEY__';
const EVENT = 'cli_command';
const SEND_CAP_MS = 400; // most we will ever delay process exit for a send

// ---------------------------------------------------------------------------
// config file — stores the opt-out flag and an anonymous, randomly generated id
// ---------------------------------------------------------------------------

function configDir() {
  const xdg = process.env.XDG_CONFIG_HOME;
  if (xdg) return path.join(xdg, 'idn-finlogos');
  return path.join(os.homedir(), '.config', 'idn-finlogos');
}

const CONFIG_PATH = path.join(configDir(), 'config.json');

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function writeConfig(patch) {
  const next = { ...readConfig(), ...patch };
  try {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2) + '\n');
  } catch {
    /* a read-only HOME must not break the CLI */
  }
  return next;
}

// Random per-install id. Deliberately NOT derived from hostname, MAC, username
// or any machine fingerprint — it exists only to separate "10 runs by one
// person" from "10 people", and deleting the config file resets it.
function installId(cfg) {
  if (cfg.installId) return cfg.installId;
  const id = crypto.randomUUID();
  writeConfig({ installId: id });
  return id;
}

// ---------------------------------------------------------------------------
// suppression
// ---------------------------------------------------------------------------

const CI_VARS = [
  'CI',
  'CONTINUOUS_INTEGRATION',
  'GITHUB_ACTIONS',
  'GITLAB_CI',
  'CIRCLECI',
  'TRAVIS',
  'JENKINS_URL',
  'BUILDKITE',
  'TF_BUILD'
];

function isCI() {
  return CI_VARS.some((v) => process.env[v] != null && process.env[v] !== '' && process.env[v] !== 'false');
}

const OFF_VALUES = new Set(['0', 'false', 'off', 'no']);

// Returns null when telemetry may run, or a short reason string when it may not.
export function suppressedBecause(cfg = readConfig()) {
  const flag = process.env.IDN_FINLOGOS_TELEMETRY;
  if (flag != null && flag !== '' && OFF_VALUES.has(flag.toLowerCase())) return 'env';
  const dnt = process.env.DO_NOT_TRACK;
  if (dnt != null && dnt !== '' && !OFF_VALUES.has(dnt.toLowerCase())) return 'do-not-track';
  if (cfg.telemetry === false) return 'config';
  if (isCI()) return 'ci';
  if (process.env.NODE_ENV === 'test') return 'test';
  if (!API_KEY || API_KEY.startsWith('__')) return 'unconfigured';
  return null;
}

// ---------------------------------------------------------------------------
// scrubbing
// ---------------------------------------------------------------------------

// Brand names only. Letters, digits, spaces and the handful of separators that
// show up in real Indonesian financial brands ("Bank BJB", "BRI-Syariah",
// "OVO & friends"). Anything containing a slash, dot, colon, tilde, @, or shell
// metacharacter is dropped outright — that is what a path, URL, email, or
// secret looks like, and no legitimate brand query needs one.
const SAFE_QUERY = /^[\p{L}\p{N}][\p{L}\p{N} &'+-]{0,47}$/u;

// Prefixes used by common credential formats. A brand query never starts with
// one of these, so matching is reason enough to drop the value.
const SECRET_PREFIX = /^(?:sk|pk|rk|ak)[-_]|^(?:phc_|ghp_|gho_|ghs_|github_pat_|xox[abprs]-|AKIA|ASIA|AIza|ya29\.|eyJ|Bearer|glpat-|npm_|dop_v1_|sbp_)/i;

// A long unbroken run that mixes letters and digits is token-shaped. Real brand
// names either stay short ("2c2p") or don't mix the two across 16+ characters
// ("bank-rakyat-indonesia" is long but has no digits).
function looksLikeSecret(q) {
  if (SECRET_PREFIX.test(q)) return true;
  return q
    .split(/[\s-]+/)
    .some((run) => run.length >= 16 && /[A-Za-z]/.test(run) && /\d/.test(run));
}

export function scrubQuery(raw) {
  if (raw == null) return null;
  const q = String(raw).trim();
  if (!q || q.length > 48) return null;
  if (!SAFE_QUERY.test(q)) return null;
  if (looksLikeSecret(q)) return null;
  return q.toLowerCase();
}

// Flag *values* are only ever sent from a fixed enum; anything unrecognized
// becomes 'other' rather than being passed through.
const oneOf = (value, allowed) => (value == null ? null : allowed.includes(String(value)) ? String(value) : 'other');

export function buildProperties({ command, opts = {}, cliVersion, resolved = 0, unresolved = [] }) {
  return {
    command,
    cli_version: cliVersion,
    node_major: Number(process.versions.node.split('.')[0]),
    os: process.platform,
    // flags: names and safe enumerated values only
    flag_format: oneOf(opts.format, ['svg', 'png']),
    flag_scale: oneOf(opts.scale, ['1', '2', '3', '4']),
    flag_cdn: oneOf(opts.cdn, ['jsdelivr', 'unpkg']),
    flag_json: Boolean(opts.json),
    flag_category: Boolean(opts.category),
    // the path itself is never transmitted — only whether one was given
    flag_out: opts.out != null,
    flag_pkg_version: opts.pkgVersionExplicit === true,
    resolved_count: resolved,
    unresolved_count: unresolved.length,
    // the point of the exercise: brands people want that we don't carry
    unresolved_queries: unresolved.map(scrubQuery).filter(Boolean).slice(0, 5)
  };
}

// ---------------------------------------------------------------------------
// first-run notice
// ---------------------------------------------------------------------------

// Printed once, to stderr so it never pollutes piped stdout (--json stays
// machine-readable). The run that prints it sends nothing.
export function noticeIfFirstRun(cfg = readConfig()) {
  if (cfg.noticeShownAt) return false;
  writeConfig({ noticeShownAt: new Date().toISOString() });
  process.stderr.write(
    '\n' +
      '  ℹ idn-finlogos collects anonymous usage stats (command name, flags, and\n' +
      '    unmatched search terms) to decide which logos to add next. No file paths,\n' +
      '    no personal data. Opt out any time:\n' +
      '\n' +
      '        idn-finlogos telemetry off      # permanent\n' +
      '        export IDN_FINLOGOS_TELEMETRY=0 # this shell only\n' +
      '\n' +
      '    Details: https://github.com/hafidznoor/idn-finlogos/blob/main/PRIVACY.md\n' +
      '\n'
  );
  return true;
}

// ---------------------------------------------------------------------------
// send
// ---------------------------------------------------------------------------

let inflight = null;

// Fire-and-forget. Returns immediately; call flush() before exit to give the
// request a bounded chance to land.
export function track(payload) {
  const cfg = readConfig();
  if (noticeIfFirstRun(cfg)) return;
  if (suppressedBecause(cfg)) return;

  const body = JSON.stringify({
    api_key: API_KEY,
    event: EVENT,
    distinct_id: installId(cfg),
    properties: buildProperties(payload),
    timestamp: new Date().toISOString()
  });

  try {
    inflight = fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      signal: AbortSignal.timeout(SEND_CAP_MS * 3)
    }).catch(() => {});
  } catch {
    inflight = null;
  }
}

// Wait for a pending send, but never longer than SEND_CAP_MS.
export async function flush() {
  if (!inflight) return;
  const timer = new Promise((r) => setTimeout(r, SEND_CAP_MS).unref?.());
  await Promise.race([inflight, timer]);
}

// ---------------------------------------------------------------------------
// `idn-finlogos telemetry [on|off]`
// ---------------------------------------------------------------------------

export function telemetryCommand(action) {
  if (action === 'off' || action === 'disable') {
    writeConfig({ telemetry: false });
    process.stdout.write(`Telemetry disabled. Nothing will be sent.\n  ${CONFIG_PATH}\n`);
    return;
  }
  if (action === 'on' || action === 'enable') {
    writeConfig({ telemetry: true });
    process.stdout.write(`Telemetry enabled.\n  ${CONFIG_PATH}\n`);
    return;
  }
  if (action != null) {
    process.stderr.write(`Unknown argument "${action}". Use: idn-finlogos telemetry [on|off]\n`);
    process.exitCode = 1;
    return;
  }
  const cfg = readConfig();
  const why = suppressedBecause(cfg);
  const reason = {
    env: 'disabled by IDN_FINLOGOS_TELEMETRY',
    'do-not-track': 'disabled by DO_NOT_TRACK',
    config: 'disabled by `idn-finlogos telemetry off`',
    ci: 'suppressed — CI environment detected',
    test: 'suppressed — NODE_ENV=test',
    unconfigured: 'inactive — no collection endpoint is configured in this build'
  };
  process.stdout.write(
    `Telemetry: ${why ? `OFF (${reason[why] ?? why})` : 'ON'}\n` +
      `Config:    ${CONFIG_PATH}\n\n` +
      `Collected: command name, flag names, CLI/Node version, OS, and search\n` +
      `           terms that matched no logo.\n` +
      `Never:     file paths, --out values, usernames, IP-linked identifiers.\n\n` +
      // 'unconfigured' is a property of the build, not a user setting —
      // telling them to switch it on would be misleading.
      (why === 'unconfigured' ? '' : `Turn ${why ? 'on' : 'off'}:  idn-finlogos telemetry ${why ? 'on' : 'off'}\n`) +
      `Details:   https://github.com/hafidznoor/idn-finlogos/blob/main/PRIVACY.md\n`
  );
}

export const _internal = { CONFIG_PATH, readConfig, writeConfig, isCI };
