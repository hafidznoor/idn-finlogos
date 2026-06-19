/// Indonesian financial institution logos as bundled Flutter assets.
///
/// See [IdnFinLogos] for the catalog API.

library idn_finlogos;

import 'src/catalog.g.dart';
import 'src/category.dart';
import 'src/logo_meta.dart';

export 'src/category.dart';
export 'src/logo_meta.dart';

/// Public entry point for the idn_finlogos catalog.
///
/// All metadata is generated at build time from `data/logos.yml` in the
/// upstream repo. SVG bytes live as package assets; resolve their paths via
/// [LogoMeta.assetPath] and render with `flutter_svg`.
class IdnFinLogos {
  IdnFinLogos._();

  /// Package version, mirrors the npm package version.
  static const String version = catalogVersion;

  /// Every logo, sorted by slug.
  static const List<LogoMeta> all = catalogLogos;

  /// Every category with its display name and count.
  static const List<Category> categories = catalogCategories;

  /// Lookup by canonical kebab-case slug, falling back to `aliases`
  /// (retired slugs from past renames) and finally the brand name in any
  /// casing — `get('bri')`, `get('bri-new')`, `get('BRI')`, and
  /// `get('Bank Rakyat Indonesia')` all resolve to the same logo.
  /// Returns `null` if not found.
  static LogoMeta? get(String slug) {
    for (final logo in catalogLogos) {
      if (logo.slug == slug) return logo;
    }
    for (final logo in catalogLogos) {
      if (logo.aliases.contains(slug)) return logo;
    }
    final q = slug.trim().toLowerCase();
    for (final logo in catalogLogos) {
      if (logo.name.toLowerCase() == q) return logo;
    }
    final s = _slugified(slug);
    if (s.isEmpty) return null;
    for (final logo in catalogLogos) {
      if (logo.slug == s) return logo;
    }
    for (final logo in catalogLogos) {
      if (logo.aliases.contains(s)) return logo;
    }
    for (final logo in catalogLogos) {
      if (_slugified(logo.name) == s) return logo;
    }
    return null;
  }

  /// Mirrors `scripts/slugify.mjs` in the upstream repo — keep in sync.
  static String _slugified(String input) => input
      .toLowerCase()
      .replaceAll('&', ' and ')
      .replaceAll('+', ' plus ')
      .replaceAll(RegExp(r'[()]'), ' ')
      .replaceAll(RegExp("[‘’‛'`]"), '')
      .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
      .replaceAll(RegExp(r'^-+|-+$'), '');

  /// All logos in one category.
  static List<LogoMeta> byCategory(String category) =>
      catalogLogos.where((l) => l.category == category).toList(growable: false);

  /// Case-insensitive substring match across `name`, `slug`, and `aliases`.
  /// Returns an empty list if [query] is blank.
  static List<LogoMeta> search(String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return const <LogoMeta>[];
    return catalogLogos.where((logo) {
      if (logo.name.toLowerCase().contains(q)) return true;
      if (logo.slug.contains(q)) return true;
      for (final alias in logo.aliases) {
        if (alias.toLowerCase().contains(q)) return true;
      }
      return false;
    }).toList(growable: false);
  }
}
