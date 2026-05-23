import Foundation

/// Public entry point for the idn-finlogos catalog.
///
/// All metadata is generated at build time from `data/logos.yml`.
/// SVG bytes live as package resources; resolve them via ``LogoMeta/url``.
public enum IdnFinLogos {

    /// Package version, mirrors the npm package version.
    public static let version: String = Catalog.version

    /// Every logo, sorted by slug.
    public static let all: [LogoMeta] = Catalog.logos

    /// Every category with its display name and count.
    public static let categories: [Category] = Catalog.categories

    /// Lookup by canonical kebab-case slug.
    public static func get(_ slug: String) -> LogoMeta? {
        Catalog.logos.first { $0.slug == slug }
    }

    /// All logos in one category.
    public static func byCategory(_ category: String) -> [LogoMeta] {
        Catalog.logos.filter { $0.category == category }
    }

    /// Case-insensitive substring match across `name`, `slug`, and `aliases`.
    /// Returns an empty array if `query` is blank.
    public static func search(_ query: String) -> [LogoMeta] {
        let q = query.trimmingCharacters(in: .whitespaces).lowercased()
        guard !q.isEmpty else { return [] }
        return Catalog.logos.filter { logo in
            logo.name.lowercased().contains(q) ||
                logo.slug.contains(q) ||
                logo.aliases.contains(where: { $0.lowercased().contains(q) })
        }
    }
}
