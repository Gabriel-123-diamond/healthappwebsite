import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../../services/ai_service.dart';
import '../../screens/expert_details_screen.dart';
import '../../services/directory_service.dart';

class SearchResultsView extends StatelessWidget {
  final AIResponse aiResponse;
  final AnimationController animationController;

  const SearchResultsView({
    super.key,
    required this.aiResponse,
    required this.animationController,
  });

  Color _getGradeColor(String grade) {
    switch (grade) {
      case 'A': return Colors.green;
      case 'B': return Colors.blue;
      case 'C': return Colors.orange;
      case 'D': return Colors.red;
      default: return Colors.grey;
    }
  }

  Widget _buildFadeIn({required int delay, required Widget child}) {
    return AnimatedBuilder(
      animation: animationController,
      builder: (context, child) {
        final double start = delay / 1000;
        final double end = (delay + 300) / 1000;
        
        final curve = CurvedAnimation(
          parent: animationController,
          curve: Interval(start, end > 1.0 ? 1.0 : end, curve: Curves.easeOut),
        );

        return Opacity(
          opacity: curve.value,
          child: Transform.translate(
            offset: Offset(0, 20 * (1 - curve.value)),
            child: child,
          ),
        );
      },
      child: child,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (aiResponse.confidenceScore != null) ...[
            _buildFadeIn(
              delay: 0,
              child: Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: (aiResponse.confidenceScore! > 90) ? Colors.green[50] : Colors.amber[50],
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: (aiResponse.confidenceScore! > 90) ? Colors.green[100]! : Colors.amber[100]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(LucideIcons.activity, size: 16, color: (aiResponse.confidenceScore! > 90) ? Colors.green : Colors.amber),
                            const SizedBox(width: 8),
                            const Text('AI Confidence Score', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          ],
                        ),
                        Text(
                          '${aiResponse.confidenceScore}%',
                          style: TextStyle(
                            fontWeight: FontWeight.w900, 
                            color: (aiResponse.confidenceScore! > 90) ? Colors.green : Colors.amber,
                            fontSize: 14
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: aiResponse.confidenceScore! / 100,
                        backgroundColor: Colors.white,
                        valueColor: AlwaysStoppedAnimation<Color>((aiResponse.confidenceScore! > 90) ? Colors.green : Colors.amber),
                        minHeight: 6,
                      ),
                    ),
                    if (aiResponse.explanation != null) ...[
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(LucideIcons.info, size: 12, color: Colors.grey),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              aiResponse.explanation!,
                              style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w500),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],

          _buildFadeIn(
            delay: 100,
            child: Container(
              padding: const EdgeInsets.all(20),
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
                  const Row(
                    children: [
                      Icon(LucideIcons.sparkles, size: 20, color: Colors.blue),
                      SizedBox(width: 8),
                      Text(
                        'AI Summary',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  MarkdownBody(
                    data: aiResponse.answer,
                    styleSheet: MarkdownStyleSheet(
                      p: const TextStyle(fontSize: 16, height: 1.5, color: Colors.black87),
                      strong: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          if (aiResponse.regionalContext != null) ...[
            const SizedBox(height: 16),
            _buildFadeIn(
              delay: 150,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.indigo[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.indigo[100]!),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(LucideIcons.globe, color: Colors.indigo),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Cultural Context: ${aiResponse.regionalContext!['region']}',
                            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo, fontSize: 14),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            aiResponse.regionalContext!['insight']!,
                            style: TextStyle(color: Colors.indigo[900], fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],

          if (aiResponse.directoryMatch != null) ...[
            const SizedBox(height: 16),
            _buildFadeIn(
              delay: 200,
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.blue[600],
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: Colors.blue.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(LucideIcons.users, color: Colors.white, size: 20),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'Matching Expert Found',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '${aiResponse.directoryMatch!['name']} specializes in ${aiResponse.directoryMatch!['specialty']}.',
                      style: const TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          final match = aiResponse.directoryMatch!;
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ExpertDetailsScreen(
                                expert: Expert(
                                  id: match['id'] ?? '',
                                  name: match['name'] ?? '',
                                  type: match['type'] ?? 'doctor',
                                  specialty: match['specialty'] ?? '',
                                  location: match['location'] ?? 'Unknown',
                                  rating: (match['rating'] as num?)?.toDouble() ?? 5.0,
                                  verified: true,
                                ),
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.blue[600],
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('View Profile', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],

          const SizedBox(height: 24),
          
          _buildFadeIn(
            delay: 300,
            child: const Text(
              'Trusted Sources',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
                letterSpacing: 1,
              ),
            ),
          ),
          const SizedBox(height: 12),
          
          ...aiResponse.results.asMap().entries.map((entry) => _buildFadeIn(
            delay: 400 + (entry.key * 100),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.value.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    entry.value.summary,
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: entry.value.type == 'medical' ? Colors.blue[50] : Colors.green[50],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          entry.value.type == 'medical' ? 'Medical' : 'Herbal',
                          style: TextStyle(
                            color: entry.value.type == 'medical' ? Colors.blue : Colors.green,
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      ),
                      if (entry.value.evidenceGrade != null) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: _getGradeColor(entry.value.evidenceGrade!).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: _getGradeColor(entry.value.evidenceGrade!).withOpacity(0.3)),
                          ),
                          child: Row(
                            children: [
                              Icon(LucideIcons.shieldCheck, size: 10, color: _getGradeColor(entry.value.evidenceGrade!)),
                              const SizedBox(width: 4),
                              Text(
                                'Grade ${entry.value.evidenceGrade}',
                                style: TextStyle(
                                  color: _getGradeColor(entry.value.evidenceGrade!),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      const SizedBox(width: 8),
                      Text(
                        '• ${entry.value.source}',
                        style: TextStyle(color: Colors.grey[400], fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          )),
          
          const SizedBox(height: 16),
          _buildFadeIn(
            delay: 800,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.amber[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.amber[100]!),
              ),
              child: Text(
                aiResponse.disclaimer,
                style: TextStyle(
                  color: Colors.brown[800],
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
