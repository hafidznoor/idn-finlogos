# Privacy

`idn-finlogos` is a static asset library. **The packages you install — npm, Maven,
SPM, pub.dev — contain no telemetry, no network calls, and no tracking of any
kind.** Importing a logo in your app sends nothing, anywhere, ever.

This document covers the two places usage data does exist: the **CLI** and the
**CDN**.

---

## 1. The CLI (`npx idn-finlogos`)

The command-line tool sends an anonymous event per invocation. It exists to
answer one question we cannot answer any other way: **which Indonesian brands
are people looking for that the catalog doesn't carry yet?** Every logo added
since v2.6 came from that signal.

### What is sent

| Field | Example | Why |
|---|---|---|
| `command` | `download` | Which commands are worth maintaining |
| `flag_format`, `flag_scale`, `flag_cdn` | `png`, `2`, `jsdelivr` | Which output formats matter |
| `flag_json`, `flag_category`, `flag_out` | `true` / `false` | **Booleans only** — never the values |
| `cli_version`, `node_major`, `os` | `2.5.0`, `22`, `darwin` | Which platforms to support |
| `resolved_count`, `unresolved_count` | `3`, `1` | How often lookups fail |
| `unresolved_queries` | `["bank tidak ada"]` | **The point of all this** — missing brands |
| `distinct_id` | random UUID | Separates "10 runs by one person" from "10 people" |

### What is never sent

- **File paths.** `--out ./my-client/assets` is recorded as `flag_out: true`. The
  path itself never leaves your machine.
- **Successful queries.** Only searches that matched *nothing* are transmitted.
- **Anything that isn't brand-shaped.** Unresolved queries pass a strict
  allowlist before transmission: letters, digits, spaces, and `& ' + -`, up to
  48 characters. Anything containing a slash, dot, colon, `@`, `~`, `$`, or a
  shell metacharacter is **dropped, not sanitized**. Credential-shaped strings
  (`sk-…`, `ghp_…`, `AKIA…`, JWTs, long letter+digit runs) are dropped too.
- **Identity.** No username, hostname, MAC address, directory name, email, or
  machine fingerprint. `distinct_id` is a random UUID generated on first run; it
  is not derived from anything about your machine. Delete the config file and
  you are a new, unrelated user.
- **Your IP address**, beyond what any HTTPS request necessarily exposes in
  transit. It is not stored as an identifier.

### When nothing is sent at all

Telemetry is silent — no request is made — in every one of these cases:

- **The first run.** It prints the notice and sends nothing.
- **CI.** `CI`, `GITHUB_ACTIONS`, `GITLAB_CI`, `CIRCLECI`, `TRAVIS`,
  `JENKINS_URL`, `BUILDKITE`, `TF_BUILD`, `CONTINUOUS_INTEGRATION`.
- **`DO_NOT_TRACK=1`** — the [consortium standard](https://consoledonottrack.com/).
- **`IDN_FINLOGOS_TELEMETRY=0`** (also `false`, `off`, `no`).
- **`NODE_ENV=test`.**
- **After `idn-finlogos telemetry off`.**

### Opting out

```bash
idn-finlogos telemetry off        # permanent, writes to your config file
```

```bash
export IDN_FINLOGOS_TELEMETRY=0   # this shell only
```

Check your current status at any time:

```bash
idn-finlogos telemetry
```

Config lives at `$XDG_CONFIG_HOME/idn-finlogos/config.json`, defaulting to
`~/.config/idn-finlogos/config.json`. Deleting it resets both your opt-out and
your anonymous id.

### Reliability

Sends are fire-and-forget with a hard 400 ms cap on process exit and a 1.2 s
request timeout. Every failure is swallowed silently. **If the collector is
down, offline, or blocked by your firewall, the CLI behaves exactly the same.**

---

## 2. The CDN (jsDelivr)

Loading a logo from `cdn.jsdelivr.net` is a normal HTTP request, logged by
jsDelivr the way any CDN logs traffic. We don't operate it and receive no
personal data from it — only the public, aggregate per-file hit counts that
[jsDelivr publishes for every package](https://data.jsdelivr.com/v1/stats/packages/npm/idn-finlogos).

`scripts/stats.mjs` in this repo reads exactly that public API to produce
`data/stats.json`. You can run it yourself:

```bash
npm run stats
```

To avoid the CDN entirely, install the package and serve the SVGs from your own
origin — the files are identical.

---

## Questions

Open an issue at
[github.com/hafidznoor/idn-finlogos/issues](https://github.com/hafidznoor/idn-finlogos/issues).
