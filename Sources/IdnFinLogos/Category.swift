import Foundation

public struct Category: Sendable, Equatable, Hashable {
    public let slug: String
    public let displayName: String
    public let count: Int

    public init(slug: String, displayName: String, count: Int) {
        self.slug = slug
        self.displayName = displayName
        self.count = count
    }
}
