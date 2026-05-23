// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "IdnFinLogos",
    platforms: [
        .iOS(.v13),
        .macOS(.v11),
        .tvOS(.v13),
        .watchOS(.v6),
    ],
    products: [
        .library(
            name: "IdnFinLogos",
            targets: ["IdnFinLogos"]
        ),
    ],
    targets: [
        .target(
            name: "IdnFinLogos",
            path: "Sources/IdnFinLogos",
            // .copy preserves the "Icons/" subdirectory in the resource bundle
            // so Bundle.module.url(forResource:withExtension:subdirectory:) can
            // resolve files under "Icons".
            resources: [
                .copy("Icons"),
            ]
        ),
    ]
)
