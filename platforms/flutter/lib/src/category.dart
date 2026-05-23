class Category {
  final String slug;
  final String displayName;
  final int count;

  const Category({
    required this.slug,
    required this.displayName,
    required this.count,
  });

  @override
  bool operator ==(Object other) =>
      other is Category && other.slug == slug;

  @override
  int get hashCode => slug.hashCode;

  @override
  String toString() => 'Category($slug, count: $count)';
}
