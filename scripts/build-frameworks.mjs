// Generate framework-wrapper subpaths consumed via subpath exports:
//   idn-finlogos/react   — <Logo slug="bca" />
//   idn-finlogos/vue     — <Logo slug="bca" />
//   idn-finlogos/svelte  — <Logo slug="bca" />
//   idn-finlogos/vanilla — createLogo({ slug: 'bca' })
//
// Each wrapper resolves the SVG either from a `svg` prop (tree-shakable) or by
// looking up `slug` in dist/icons-map.{mjs,js}. The map re-exports the existing
// per-slug modules in dist/icons/<slug>.{mjs,js} — no SVG content is duplicated.
//
// Requires dist/ to already be populated by scripts/build.mjs (run first).

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { loadCatalog, validateCatalog } from './load-catalog.mjs';

const REPO = path.resolve(import.meta.dirname, '..');
const DIST = path.join(REPO, 'dist');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function jsIdent(slug) {
  // identifier-safe local name for an import binding
  return '_' + slug.replace(/[^a-zA-Z0-9_$]/g, '_');
}

function buildIconsMap(slugs) {
  // dist/icons-map.mjs — re-export every per-slug SVG string through one object
  const esmImports = slugs.map((s) => `import ${jsIdent(s)} from './icons/${s}.mjs';`).join('\n');
  const esmEntries = slugs.map((s) => `  '${s}': ${jsIdent(s)}`).join(',\n');
  const esm = `${esmImports}

const iconsMap = {
${esmEntries}
};

export default iconsMap;
`;
  fs.writeFileSync(path.join(DIST, 'icons-map.mjs'), esm);

  // CJS twin — each per-slug .js exports the string via module.exports.
  const cjsRequires = slugs.map((s) => `  '${s}': require('./icons/${s}.js')`).join(',\n');
  const cjs = `'use strict';
const iconsMap = {
${cjsRequires}
};
module.exports = iconsMap;
module.exports.default = iconsMap;
`;
  fs.writeFileSync(path.join(DIST, 'icons-map.js'), cjs);

  fs.writeFileSync(
    path.join(DIST, 'icons-map.d.ts'),
    `declare const iconsMap: Record<string, string>;\nexport default iconsMap;\n`
  );
}

// ──────────────────────────────── React ────────────────────────────────

function buildReact() {
  const dir = path.join(DIST, 'react');
  ensureDir(dir);

  fs.writeFileSync(
    path.join(dir, 'index.mjs'),
    `import { createElement } from 'react';
import iconsMap from '../icons-map.mjs';

export function Logo({ slug, svg, size, title, style, ...rest }) {
  const __html = svg !== undefined ? svg : (slug ? iconsMap[slug] : '');
  if (!__html) return null;
  const px = typeof size === 'number' ? size + 'px' : size;
  const mergedStyle = size != null
    ? { display: 'inline-block', width: px, height: px, ...style }
    : style;
  return createElement('span', {
    role: 'img',
    'aria-label': title,
    ...rest,
    style: mergedStyle,
    dangerouslySetInnerHTML: { __html }
  });
}

export default Logo;
`
  );

  fs.writeFileSync(
    path.join(dir, 'index.js'),
    `'use strict';
const { createElement } = require('react');
const iconsMap = require('../icons-map.js');

function Logo(props) {
  const { slug, svg, size, title, style } = props;
  const rest = Object.assign({}, props);
  delete rest.slug; delete rest.svg; delete rest.size; delete rest.title; delete rest.style;
  const __html = svg !== undefined ? svg : (slug ? iconsMap[slug] : '');
  if (!__html) return null;
  const px = typeof size === 'number' ? size + 'px' : size;
  const mergedStyle = size != null
    ? Object.assign({ display: 'inline-block', width: px, height: px }, style)
    : style;
  return createElement('span', Object.assign({
    role: 'img',
    'aria-label': title
  }, rest, {
    style: mergedStyle,
    dangerouslySetInnerHTML: { __html: __html }
  }));
}

module.exports = { Logo };
module.exports.default = Logo;
`
  );

  fs.writeFileSync(
    path.join(dir, 'index.d.ts'),
    `import type { HTMLAttributes, ReactElement } from 'react';

export interface LogoProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'dangerouslySetInnerHTML'> {
  /** Catalog slug, e.g. "bca". Bundles all icons if used; prefer \`svg\` for tree-shaking. */
  slug?: string;
  /** Pre-imported SVG string (tree-shake friendly). Takes precedence over \`slug\`. */
  svg?: string;
  /** Size in px (number) or any CSS length. Sets both width and height on the wrapper span. */
  size?: number | string;
  /** Accessible label. Sets role="img" + aria-label. */
  title?: string;
}

export declare function Logo(props: LogoProps): ReactElement | null;
export default Logo;
`
  );

  return dir;
}

// ──────────────────────────────── Vue ────────────────────────────────

function buildVue() {
  const dir = path.join(DIST, 'vue');
  ensureDir(dir);

  fs.writeFileSync(
    path.join(dir, 'index.mjs'),
    `import { defineComponent, h, computed } from 'vue';
import iconsMap from '../icons-map.mjs';

export const Logo = defineComponent({
  name: 'IdnLogo',
  props: {
    slug: { type: String, default: undefined },
    svg: { type: String, default: undefined },
    size: { type: [Number, String], default: undefined },
    title: { type: String, default: undefined }
  },
  setup(props, { attrs }) {
    const html = computed(() =>
      props.svg !== undefined ? props.svg : (props.slug ? iconsMap[props.slug] : '')
    );
    return () => {
      if (!html.value) return null;
      const px = typeof props.size === 'number' ? props.size + 'px' : props.size;
      const style = props.size != null
        ? { display: 'inline-block', width: px, height: px }
        : undefined;
      return h('span', {
        role: 'img',
        'aria-label': props.title,
        ...attrs,
        style,
        innerHTML: html.value
      });
    };
  }
});

export default Logo;
`
  );

  fs.writeFileSync(
    path.join(dir, 'index.js'),
    `'use strict';
const { defineComponent, h, computed } = require('vue');
const iconsMap = require('../icons-map.js');

const Logo = defineComponent({
  name: 'IdnLogo',
  props: {
    slug: { type: String, default: undefined },
    svg: { type: String, default: undefined },
    size: { type: [Number, String], default: undefined },
    title: { type: String, default: undefined }
  },
  setup(props, ctx) {
    const html = computed(function () {
      return props.svg !== undefined ? props.svg : (props.slug ? iconsMap[props.slug] : '');
    });
    return function () {
      if (!html.value) return null;
      const px = typeof props.size === 'number' ? props.size + 'px' : props.size;
      const style = props.size != null
        ? { display: 'inline-block', width: px, height: px }
        : undefined;
      return h('span', Object.assign({
        role: 'img',
        'aria-label': props.title
      }, ctx.attrs, {
        style: style,
        innerHTML: html.value
      }));
    };
  }
});

module.exports = { Logo };
module.exports.default = Logo;
`
  );

  fs.writeFileSync(
    path.join(dir, 'index.d.ts'),
    `import type { DefineComponent } from 'vue';

export interface LogoProps {
  /** Catalog slug, e.g. "bca". Bundles all icons if used; prefer \`svg\` for tree-shaking. */
  slug?: string;
  /** Pre-imported SVG string (tree-shake friendly). Takes precedence over \`slug\`. */
  svg?: string;
  /** Size in px (number) or any CSS length. Sets both width and height on the wrapper span. */
  size?: number | string;
  /** Accessible label. Sets role="img" + aria-label. */
  title?: string;
}

export declare const Logo: DefineComponent<LogoProps>;
export default Logo;
`
  );

  return dir;
}

// ──────────────────────────────── Svelte ────────────────────────────────

function buildSvelte() {
  const dir = path.join(DIST, 'svelte');
  ensureDir(dir);

  // Single-source .svelte component. Works in Svelte 4 and 5 (no runes).
  fs.writeFileSync(
    path.join(dir, 'Logo.svelte'),
    `<script>
  import iconsMap from '../icons-map.mjs';
  export let slug = undefined;
  export let svg = undefined;
  export let size = undefined;
  export let title = undefined;
  $: html = svg !== undefined ? svg : (slug ? iconsMap[slug] : '');
  $: px = typeof size === 'number' ? size + 'px' : size;
</script>

{#if html}
  <span
    role="img"
    aria-label={title}
    style:display={size != null ? 'inline-block' : undefined}
    style:width={px}
    style:height={px}
    {...$$restProps}
  >{@html html}</span>
{/if}
`
  );

  // Tiny .d.ts shim — Svelte component class signature compatible with v3/v4 typing.
  fs.writeFileSync(
    path.join(dir, 'Logo.svelte.d.ts'),
    `import { SvelteComponentTyped } from 'svelte';

export interface LogoProps {
  /** Catalog slug, e.g. "bca". Bundles all icons if used; prefer \`svg\` for tree-shaking. */
  slug?: string;
  /** Pre-imported SVG string (tree-shake friendly). Takes precedence over \`slug\`. */
  svg?: string;
  /** Size in px (number) or any CSS length. */
  size?: number | string;
  /** Accessible label. Sets role="img" + aria-label. */
  title?: string;
}

export default class Logo extends SvelteComponentTyped<LogoProps> {}
`
  );

  return dir;
}

// ──────────────────────────────── React Native ────────────────────────────────

function buildReactNative() {
  const dir = path.join(DIST, 'react-native');
  ensureDir(dir);

  fs.writeFileSync(
    path.join(dir, 'index.mjs'),
    `import { createElement } from 'react';
import { SvgXml } from 'react-native-svg';
import iconsMap from '../icons-map.mjs';

export function Logo({ slug, svg, size, width, height, ...rest }) {
  const xml = svg !== undefined ? svg : (slug ? iconsMap[slug] : '');
  if (!xml) return null;
  const w = width ?? size;
  const h = height ?? size;
  return createElement(SvgXml, { xml, width: w, height: h, ...rest });
}

export default Logo;
`
  );

  fs.writeFileSync(
    path.join(dir, 'index.js'),
    `'use strict';
const { createElement } = require('react');
const { SvgXml } = require('react-native-svg');
const iconsMap = require('../icons-map.js');

function Logo(props) {
  const { slug, svg, size, width, height } = props;
  const rest = Object.assign({}, props);
  delete rest.slug; delete rest.svg; delete rest.size; delete rest.width; delete rest.height;
  const xml = svg !== undefined ? svg : (slug ? iconsMap[slug] : '');
  if (!xml) return null;
  const w = width != null ? width : size;
  const h = height != null ? height : size;
  return createElement(SvgXml, Object.assign({ xml: xml, width: w, height: h }, rest));
}

module.exports = { Logo };
module.exports.default = Logo;
`
  );

  fs.writeFileSync(
    path.join(dir, 'index.d.ts'),
    `import type { ReactElement } from 'react';
import type { SvgProps } from 'react-native-svg';

export interface LogoProps extends Omit<SvgProps, 'xml'> {
  /** Catalog slug, e.g. "bca". Bundles all icons if used; prefer \`svg\` for tree-shaking. */
  slug?: string;
  /** Pre-imported SVG string (tree-shake friendly). Takes precedence over \`slug\`. */
  svg?: string;
  /** Shorthand: sets both width and height when neither is provided. */
  size?: number | string;
}

export declare function Logo(props: LogoProps): ReactElement | null;
export default Logo;
`
  );

  return dir;
}

// ──────────────────────────────── Vanilla ────────────────────────────────

function buildVanilla() {
  const dir = path.join(DIST, 'vanilla');
  ensureDir(dir);

  fs.writeFileSync(
    path.join(dir, 'index.mjs'),
    `import iconsMap from '../icons-map.mjs';

function buildSpan(html, { size, title, className } = {}) {
  if (typeof document === 'undefined') {
    throw new Error('idn-finlogos/vanilla requires a DOM');
  }
  const span = document.createElement('span');
  span.setAttribute('role', 'img');
  if (title) span.setAttribute('aria-label', title);
  if (className) span.className = className;
  span.innerHTML = html;
  if (size != null) {
    const px = typeof size === 'number' ? size + 'px' : size;
    span.style.display = 'inline-block';
    span.style.width = px;
    span.style.height = px;
    const inner = span.querySelector('svg');
    if (inner) {
      inner.setAttribute('width', String(size));
      inner.setAttribute('height', String(size));
    }
  }
  return span;
}

export function createLogo(options = {}) {
  const { slug, svg } = options;
  const html = svg !== undefined ? svg : (slug ? iconsMap[slug] : '');
  if (!html) return null;
  return buildSpan(html, options);
}

export function renderLogo(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;
  const node = createLogo(options);
  if (node) {
    el.replaceChildren(node);
  }
  return node;
}

export function getLogoSvg(slug) {
  return iconsMap[slug] ?? null;
}

export default { createLogo, renderLogo, getLogoSvg };
`
  );

  fs.writeFileSync(
    path.join(dir, 'index.js'),
    `'use strict';
const iconsMap = require('../icons-map.js');

function buildSpan(html, opts) {
  opts = opts || {};
  if (typeof document === 'undefined') {
    throw new Error('idn-finlogos/vanilla requires a DOM');
  }
  const span = document.createElement('span');
  span.setAttribute('role', 'img');
  if (opts.title) span.setAttribute('aria-label', opts.title);
  if (opts.className) span.className = opts.className;
  span.innerHTML = html;
  if (opts.size != null) {
    const px = typeof opts.size === 'number' ? opts.size + 'px' : opts.size;
    span.style.display = 'inline-block';
    span.style.width = px;
    span.style.height = px;
    const inner = span.querySelector('svg');
    if (inner) {
      inner.setAttribute('width', String(opts.size));
      inner.setAttribute('height', String(opts.size));
    }
  }
  return span;
}

function createLogo(options) {
  options = options || {};
  const html = options.svg !== undefined ? options.svg : (options.slug ? iconsMap[options.slug] : '');
  if (!html) return null;
  return buildSpan(html, options);
}

function renderLogo(target, options) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;
  const node = createLogo(options || {});
  if (node) {
    el.replaceChildren(node);
  }
  return node;
}

function getLogoSvg(slug) {
  return iconsMap[slug] || null;
}

module.exports = { createLogo, renderLogo, getLogoSvg };
module.exports.default = { createLogo, renderLogo, getLogoSvg };
`
  );

  fs.writeFileSync(
    path.join(dir, 'index.d.ts'),
    `export interface LogoOptions {
  /** Catalog slug, e.g. "bca". */
  slug?: string;
  /** Pre-imported SVG string. Takes precedence over \`slug\`. */
  svg?: string;
  /** Size in px (number) or any CSS length. */
  size?: number | string;
  /** Accessible label. */
  title?: string;
  /** CSS class on the wrapper span. */
  className?: string;
}

export declare function createLogo(options?: LogoOptions): HTMLSpanElement | null;
export declare function renderLogo(
  target: string | Element,
  options?: LogoOptions
): HTMLSpanElement | null;
export declare function getLogoSvg(slug: string): string | null;

declare const _default: {
  createLogo: typeof createLogo;
  renderLogo: typeof renderLogo;
  getLogoSvg: typeof getLogoSvg;
};
export default _default;
`
  );

  return dir;
}

// ──────────────────────────────── main ────────────────────────────────

function main() {
  if (!fs.existsSync(DIST) || !fs.existsSync(path.join(DIST, 'icons'))) {
    console.error('dist/icons not found — run `npm run build` first.');
    process.exit(1);
  }

  const catalog = loadCatalog(REPO);
  const errors = validateCatalog(catalog);
  if (errors.length > 0) {
    console.error(`Refusing to build frameworks — ${errors.length} catalog error(s).`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }

  const slugs = catalog.logos.map((l) => l.slug).sort();

  buildIconsMap(slugs);
  const dirs = [buildReact(), buildReactNative(), buildVue(), buildSvelte(), buildVanilla()];

  console.log(`Built framework wrappers for ${slugs.length} logos`);
  console.log('  shared map:     dist/icons-map.{mjs,js,d.ts}');
  for (const d of dirs) console.log(`  wrapper:        ${path.relative(REPO, d)}`);
}

main();
