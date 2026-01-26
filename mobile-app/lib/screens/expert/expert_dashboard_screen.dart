import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../widgets/expert/expert_stat_card.dart';
import '../../widgets/expert/expert_content_item.dart';
import '../../widgets/expert/expert_question_item.dart';

class ExpertDashboardScreen extends StatelessWidget {
  const ExpertDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Expert Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.5,
              children: const [
                ExpertStatCard(icon: LucideIcons.eye, label: 'Total Views', value: '12.5k', color: Colors.blue),
                ExpertStatCard(icon: LucideIcons.messageSquare, label: 'Answers', value: '45', color: Colors.green),
                ExpertStatCard(icon: LucideIcons.fileText, label: 'Articles', value: '8', color: Colors.purple),
                ExpertStatCard(icon: LucideIcons.star, label: 'Rating', value: '4.8', color: Colors.orange),
              ],
            ),
            const SizedBox(height: 24),

            // Content Section
            const Text(
              'Your Content',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            const ExpertContentItem(
              title: 'Managing Diabetes with Diet',
              type: 'Article',
              views: '5.4k',
              status: 'Published',
              color: Colors.green,
            ),
            const ExpertContentItem(
              title: 'Yoga for Back Pain',
              type: 'Video',
              views: '3.2k',
              status: 'Published',
              color: Colors.green,
            ),
            const ExpertContentItem(
              title: 'Understanding Herbal Teas',
              type: 'Article',
              views: '0',
              status: 'Draft',
              color: Colors.grey,
            ),

            const SizedBox(height: 24),
            
            // Pending Actions
             const Text(
              'Pending Questions',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).cardTheme.color ?? Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.withOpacity(0.2)),
              ),
              child: Column(
                children: [
                  const ExpertQuestionItem(
                    title: 'Is Ashwagandha safe to take with anti-depressants?',
                    tag: 'Herbal',
                    time: '2 hours ago',
                  ),
                  const Divider(height: 24),
                  const ExpertQuestionItem(
                    title: 'Best recovery stretches after ACL surgery?',
                    tag: 'Medical',
                    time: '5 hours ago',
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () {},
                      child: const Text('View All Questions'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Colors.blue[600],
        child: const Icon(LucideIcons.plus, color: Colors.white),
      ),
    );
  }
}
