/// Metadata for a single logo bundled in the idn_finlogos package.
///
/// The raw SVG file ships as a Flutter asset under
/// `packages/idn_finlogos/assets/idn-finlogos/<slug>.svg`. Render it with
/// `flutter_svg`:
///
/// ```dart
/// import 'package:flutter_svg/flutter_svg.dart';
/// SvgPicture.asset(logo.assetPath);
/// ```
class LogoMeta {
  final String slug;
  final String name;
  final String category;
  final List<String> aliases;
  final List<String> tags;

  const LogoMeta({
    required this.slug,
    required this.name,
    required this.category,
    required this.aliases,
    required this.tags,
  });

  /// Asset path resolvable by Flutter's asset bundle (and `flutter_svg`).
  String get assetPath => 'packages/idn_finlogos/assets/idn-finlogos/$slug.svg';

  @override
  bool operator ==(Object other) =>
      other is LogoMeta && other.slug == slug;

  @override
  int get hashCode => slug.hashCode;

  @override
  String toString() => 'LogoMeta(slug: $slug, category: $category)';
}
