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

    /// Lookup by canonical kebab-case slug, falling back to `aliases`
    /// (retired slugs from past renames) and finally the brand name in any
    /// casing — `get("bri")`, `get("bri-new")`, `get("BRI")`, and
    /// `get("Bank Rakyat Indonesia")` all resolve to the same logo.
    public static func get(_ slug: String) -> LogoMeta? {
        if let direct = Catalog.logos.first(where: { $0.slug == slug })
            ?? Catalog.logos.first(where: { $0.aliases.contains(slug) }) {
            return direct
        }
        let q = slug.trimmingCharacters(in: .whitespaces).lowercased()
        if let byName = Catalog.logos.first(where: { $0.name.lowercased() == q }) {
            return byName
        }
        let s = slugified(slug)
        guard !s.isEmpty else { return nil }
        return Catalog.logos.first { $0.slug == s }
            ?? Catalog.logos.first { $0.aliases.contains(s) }
            ?? Catalog.logos.first { slugified($0.name) == s }
    }

    /// Mirrors `scripts/slugify.mjs` in the upstream repo — keep in sync.
    private static func slugified(_ input: String) -> String {
        input.lowercased()
            .replacingOccurrences(of: "&", with: " and ")
            .replacingOccurrences(of: "+", with: " plus ")
            .replacingOccurrences(of: "[()]", with: " ", options: .regularExpression)
            .replacingOccurrences(of: "[\u{2018}\u{2019}\u{201B}'`]", with: "", options: .regularExpression)
            .replacingOccurrences(of: "[^a-z0-9]+", with: "-", options: .regularExpression)
            .replacingOccurrences(of: "^-+|-+$", with: "", options: .regularExpression)
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
