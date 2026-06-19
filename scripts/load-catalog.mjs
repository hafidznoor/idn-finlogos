// Shared loader for data/logos.yml + data/categories.yml.
// Used by validate.mjs and build.mjs so they agree on the same source of truth.

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { slugify } from './slugify.mjs';

export function loadCatalog(repoRoot) {
  const logosPath = path.join(repoRoot, 'data', 'logos.yml');
  const categoriesPath = path.join(repoRoot, 'data', 'categories.yml');
  const iconsDir = path.join(repoRoot, 'icons');

  const logos = yaml.load(fs.readFileSync(logosPath, 'utf8'));
  const categories = yaml.load(fs.readFileSync(categoriesPath, 'utf8'));

  if (!Array.isArray(logos)) {
    throw new Error(`data/logos.yml must be a YAML list, got ${typeof logos}`);
  }
  if (!categories || typeof categories !== 'object') {
    throw new Error(`data/categories.yml must be a YAML map`);
  }

  return { logos, categories, iconsDir, logosPath, categoriesPath };
}

export function validateCatalog({ logos, categories, iconsDir }) {
  const errors = [];

  const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const seenSlugs = new Set();

  for (const [i, logo] of logos.entries()) {
    const where = `data/logos.yml[${i}] (slug=${logo?.slug ?? '?'})`;

    if (!logo || typeof logo !== 'object') {
      errors.push(`${where}: not an object`);
      continue;
    }
    if (typeof logo.slug !== 'string' || !logo.slug) {
      errors.push(`${where}: missing or empty 'slug'`);
      continue;
    }
    if (!slugRe.test(logo.slug)) {
      errors.push(`${where}: slug "${logo.slug}" doesn't match kebab-case rule [a-z0-9]+(-[a-z0-9]+)*`);
    }
    if (logo.slug !== slugify(logo.slug)) {
      errors.push(`${where}: slug "${logo.slug}" isn't canonical (slugify() rewrites it to "${slugify(logo.slug)}")`);
    }
    if (seenSlugs.has(logo.slug)) {
      errors.push(`${where}: duplicate slug "${logo.slug}"`);
      continue;
    }
    seenSlugs.add(logo.slug);

    if (typeof logo.name !== 'string' || !logo.name.trim()) {
      errors.push(`${where}: missing or empty 'name' (human display)`);
    }
    if (typeof logo.category !== 'string' || !logo.category) {
      errors.push(`${where}: missing 'category'`);
    } else if (!Object.prototype.hasOwnProperty.call(categories, logo.category)) {
      errors.push(`${where}: category "${logo.category}" not in data/categories.yml`);
    }

    const iconPath = path.join(iconsDir, `${logo.slug}.svg`);
    if (!fs.existsSync(iconPath)) {
      errors.push(`${where}: icons/${logo.slug}.svg does not exist`);
    }

    if (logo.aliases !== undefined && !Array.isArray(logo.aliases)) {
      errors.push(`${where}: 'aliases' must be an array of strings`);
    }
    if (logo.tags !== undefined && !Array.isArray(logo.tags)) {
      errors.push(`${where}: 'tags' must be an array of strings`);
    }
  }

  // Aliases are alternate lookup keys (e.g. retired slugs), so they share the
  // slug namespace: an alias must not collide with any slug or another alias.
  const seenAliases = new Map();
  for (const [i, logo] of logos.entries()) {
    for (const alias of (Array.isArray(logo?.aliases) ? logo.aliases : [])) {
      const where = `data/logos.yml[${i}] (slug=${logo.slug})`;
      if (typeof alias !== 'string' || !slugRe.test(alias)) {
        errors.push(`${where}: alias "${alias}" isn't a kebab-case slug`);
        continue;
      }
      if (seenSlugs.has(alias)) {
        errors.push(`${where}: alias "${alias}" collides with an existing slug`);
      }
      if (seenAliases.has(alias)) {
        errors.push(`${where}: alias "${alias}" already used by slug "${seenAliases.get(alias)}"`);
      }
      seenAliases.set(alias, logo.slug);
    }
  }

  // Orphan check: every icons/*.svg must have a matching data/logos.yml entry.
  if (fs.existsSync(iconsDir)) {
    const onDisk = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.svg'));
    for (const file of onDisk) {
      const slug = file.replace(/\.svg$/, '');
      if (!seenSlugs.has(slug)) {
        errors.push(`icons/${file}: orphan — no entry in data/logos.yml`);
      }
    }
  }

  // Category sanity.
  for (const [slug, meta] of Object.entries(categories)) {
    if (slug !== slugify(slug)) {
      errors.push(`data/categories.yml: key "${slug}" isn't a canonical slug`);
    }
    if (!meta || typeof meta.displayName !== 'string' || !meta.displayName.trim()) {
      errors.push(`data/categories.yml[${slug}]: missing 'displayName'`);
    }
  }

  return errors;
}
