import Foundation

/// Metadata for a single logo bundled in the IdnFinLogos package.
///
/// The raw SVG file is shipped as a package resource under `Icons/<slug>.svg`.
/// Resolve its file URL via ``url`` and render with a SVG library
/// (e.g. SVGKit, SDWebImageSVGCoder).
public struct LogoMeta: Sendable, Equatable, Hashable {
    public let slug: String
    public let name: String
    public let category: String
    public let aliases: [String]
    public let tags: [String]

    public init(
        slug: String,
        name: String,
        category: String,
        aliases: [String],
        tags: [String]
    ) {
        self.slug = slug
        self.name = name
        self.category = category
        self.aliases = aliases
        self.tags = tags
    }

    /// File URL of the bundled SVG. `nil` only if the package resource is missing.
    public var url: URL? {
        Bundle.module.url(forResource: slug, withExtension: "svg", subdirectory: "Icons")
    }

    /// SVG markup as a UTF-8 string. `nil` if the resource can't be read.
    public var svgString: String? {
        guard let url else { return nil }
        return try? String(contentsOf: url, encoding: .utf8)
    }
}
