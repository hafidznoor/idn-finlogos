package com.hafidznoor.idnfinlogos

/**
 * Metadata for a single logo bundled in the library.
 *
 * The raw SVG file is shipped as an Android asset. Open it with:
 *   `context.assets.open(logo.assetPath)`
 * Or load it directly into an image view via Coil 2's SVG decoder:
 *   `AsyncImage(model = "file:///android_asset/${logo.assetPath}", imageLoader = svgLoader, ...)`
 */
public data class LogoMeta(
    val slug: String,
    val name: String,
    val category: String,
    val aliases: List<String>,
    val tags: List<String>,
    val assetPath: String,
)
