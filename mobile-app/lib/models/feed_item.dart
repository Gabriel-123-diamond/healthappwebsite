class FeedItem {
  final String id;
  final String title;
  final String excerpt;
  final String type; // 'article' or 'video'
  final String category; // 'Medical', 'Herbal', 'Lifestyle'
  final String? imageUrl;
  final String source;
  final String date;
  final bool isVerified;
  final String link;
  final String? evidenceGrade; // 'A', 'B', 'C', 'D'

  FeedItem({
    required this.id,
    required this.title,
    required this.excerpt,
    required this.type,
    required this.category,
    this.imageUrl,
    required this.source,
    required this.date,
    required this.isVerified,
    required this.link,
    this.evidenceGrade,
  });
}
