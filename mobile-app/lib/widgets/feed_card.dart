import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/feed_item.dart';
import '../screens/article_detail_screen.dart';

class FeedCard extends StatelessWidget {
  final FeedItem item;

  const FeedCard({super.key, required this.item});

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'Herbal': return Colors.green;
      case 'Medical': return Colors.blue;
      case 'Lifestyle': return Colors.orange;
      case 'News': return Colors.red;
      default: return Colors.blueGrey;
    }
  }

  Color _getGradeColor(String? grade) {
    switch (grade) {
      case 'A': return Colors.green;
      case 'B': return Colors.blue;
      case 'C': return Colors.amber;
      case 'D': return Colors.red;
      default: return Colors.grey;
    }
  }

  void _handleTap(BuildContext context) {
    if (item.link.startsWith('/article/')) {
      // Mock content for internal articles
      String mockContent = "";
      String mockAuthor = "Dr. Sarah Smith";
      
      if (item.id == '1') {
        mockContent = """
          <h2>Introduction</h2>
          <p>Curcumin is the primary bioactive substance in turmeric. It has been used for centuries in traditional medicine and is now being extensively studied in modern clinical trials.</p>
          <h2>Clinical Evidence</h2>
          <p>A meta-analysis of randomized controlled trials suggests that curcumin supplementation can significantly reduce C-reactive protein levels.</p>
        """;
      } else {
        mockContent = """
          <h2>Guidelines 2026</h2>
          <p>The standard of care for hypertension remains a combination of pharmacological intervention and lifestyle modification.</p>
        """;
        mockAuthor = "HealthAI Editorial";
      }

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ArticleDetailScreen(
            title: item.title,
            category: item.category,
            content: mockContent,
            author: mockAuthor,
            date: item.date,
            evidenceGrade: item.evidenceGrade ?? 'B',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getCategoryColor(item.category);

    return InkWell(
      onTap: () => _handleTap(context),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: 280,
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey[200]!),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header / Image Placeholder
            Container(
              height: 120,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            item.category.toUpperCase(),
                            style: TextStyle(
                              fontSize: 10, 
                              fontWeight: FontWeight.bold,
                              color: color,
                            ),
                          ),
                        ),
                        if (item.evidenceGrade != null) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: _getGradeColor(item.evidenceGrade).withOpacity(0.3)),
                            ),
                            child: Row(
                              children: [
                                Icon(LucideIcons.shieldCheck, size: 10, color: _getGradeColor(item.evidenceGrade)),
                                const SizedBox(width: 4),
                                Text(
                                  'Grade ${item.evidenceGrade}',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: _getGradeColor(item.evidenceGrade),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  Center(
                    child: Icon(
                      item.type == 'video' ? LucideIcons.playCircle : LucideIcons.fileText,
                      size: 48,
                      color: color.withOpacity(0.5),
                    ),
                  ),
                ],
              ),
            ),
            
            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        item.source,
                        style: TextStyle(fontSize: 10, color: Colors.grey[500], fontWeight: FontWeight.bold),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Icon(Icons.circle, size: 4, color: Colors.grey[300]),
                      ),
                      Text(
                        item.date,
                        style: TextStyle(fontSize: 10, color: Colors.grey[500]),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.title,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, height: 1.2),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.excerpt,
                    style: TextStyle(color: Colors.grey[600], fontSize: 12, height: 1.4),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      if (item.isVerified) ...[
                        const Icon(LucideIcons.checkCircle, size: 14, color: Colors.green),
                        const SizedBox(width: 4),
                        const Text(
                          'Verified',
                          style: TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ] else
                        Text(
                          'Community',
                          style: TextStyle(color: Colors.grey[400], fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
