package com.hafidznoor.idnfinlogos

/**
 * Public entry point for the idn-finlogos catalog.
 *
 * Logos are exposed as immutable metadata. The raw SVG bytes live in the
 * library's `assets/idn-finlogos/<slug>.svg`; consumers open them via
 * `AssetManager` or a vector loader like Coil 2.
 */
public object IdnFinLogos {

    public const val VERSION: String = Catalog.VERSION

    /** Every logo, sorted by slug. */
    public val all: List<LogoMeta>
        get() = Catalog.LOGOS

    /** Every category with its display name and count. */
    public val categories: List<Category>
        get() = Catalog.CATEGORIES

    /**
     * Lookup by canonical kebab-case slug, falling back to `aliases`
     * (retired slugs from past renames) and finally the brand name in any
     * casing — `get("bri")`, `get("bri-new")`, `get("BRI")`, and
     * `get("Bank Rakyat Indonesia")` all resolve to the same logo.
     */
    public fun get(slug: String): LogoMeta? {
        val direct = Catalog.LOGOS.firstOrNull { it.slug == slug }
            ?: Catalog.LOGOS.firstOrNull { slug in it.aliases }
        if (direct != null) return direct
        val q = slug.trim().lowercase()
        Catalog.LOGOS.firstOrNull { it.name.lowercase() == q }?.let { return it }
        val s = slugified(slug)
        if (s.isEmpty()) return null
        return Catalog.LOGOS.firstOrNull { it.slug == s }
            ?: Catalog.LOGOS.firstOrNull { s in it.aliases }
            ?: Catalog.LOGOS.firstOrNull { slugified(it.name) == s }
    }

    /** Mirrors `scripts/slugify.mjs` in the upstream repo — keep in sync. */
    private fun slugified(input: String): String =
        input.lowercase()
            .replace("&", " and ")
            .replace("+", " plus ")
            .replace(Regex("[()]"), " ")
            .replace(Regex("[‘’‛'`]"), "")
            .replace(Regex("[^a-z0-9]+"), "-")
            .trim('-')

    /** All logos in one category. */
    public fun byCategory(category: String): List<LogoMeta> =
        Catalog.LOGOS.filter { it.category == category }

    /**
     * Case-insensitive substring match across `name`, `slug`, and `aliases`.
     * Returns empty list if `query` is blank.
     */
    public fun search(query: String): List<LogoMeta> {
        val q = query.trim().lowercase()
        if (q.isEmpty()) return emptyList()
        return Catalog.LOGOS.filter { logo ->
            logo.name.lowercase().contains(q) ||
                logo.slug.contains(q) ||
                logo.aliases.any { it.lowercase().contains(q) }
        }
    }
}
