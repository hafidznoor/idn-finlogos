# Privacy

`idn-finlogos` is a static asset library. **The packages you install — npm, Maven,
SPM, pub.dev — contain no telemetry, no network calls, and no tracking of any
kind.** Importing a logo in your app sends nothing, anywhere, ever.

This document covers the two places usage data does exist: the **CLI** and the
**CDN**.

---

## 1. The CLI (`npx idn-finlogos`)

The command-line tool reports each invocation anonymously to **Google
Analytics 4**. It exists to answer one question we cannot answer any other way:
**which Indonesian brands are people looking for that the catalog doesn't carry
yet?**

Each run sends one `cli_command` event, plus one `logo_not_found` event for each
search term that matched nothing (at most five).

### What is sent

| Field | Example | Why |
|---|---|---|
| `command`, `result` | `download`, `ok` / `error` | Which commands are worth maintaining, and how often they fail |
| `flag_format`, `flag_scale`, `flag_cdn` | `png`, `2`, `jsdelivr` | Which output formats matter |
| `flag_json`, `flag_category`, `flag_out`, `flag_pkg_version` | `true` / `false` | **Booleans only** — never the values |
| `cli_version`, `node_major`, `os` | `2.5.1`, `22`, `darwin` | Which platforms to support |
| `resolved_count`, `unresolved_count` | `3`, `1` | How often lookups fail |
| `query` (on `logo_not_found`) | `bank tidak ada` | **The point of all this** — missing brands |
| `client_id` | random UUID | Separates "10 runs by one person" from "10 people" |
| `session_id`, `engagement_time_msec` | timestamp of the run, `1` | Required by Google Analytics to count the event; the session id is never stored |

### Where it goes

Events are sent over HTTPS to Google Analytics 4 (`www.google-analytics.com`),
into a property owned by the maintainer, and are processed by Google under its
[privacy policy](https://policies.google.com/privacy). Every request marks ad
use as denied (`ad_user_data` and `ad_personalization`), so the data is not
used for advertising or ad personalization. No cookies are involved — a CLI has
none.

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
- **Your IP address or location**, beyond what any HTTPS request necessarily
  exposes in transit. The CLI sends no location fields, and Google Analytics 4
  does not log or store IP addresses.

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

Sends are fire-and-forget with a hard 400 ms cap on process exit; a request
still pending at that point is cancelled. Every failure is swallowed silently. **If the collector is
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
