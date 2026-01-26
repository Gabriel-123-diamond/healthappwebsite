import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../models/learning_path.dart';
import '../../services/learning_service.dart';
import 'path_detail_screen.dart';

class LearningScreen extends StatefulWidget {
  const LearningScreen({super.key});

  @override
  State<LearningScreen> createState() => _LearningScreenState();
}

class _LearningScreenState extends State<LearningScreen> {
  final LearningService _learningService = LearningService();
  late Future<List<LearningPath>> _pathsFuture;
  late Future<List<String>> _offlineIdsFuture;
  
  @override
  void initState() {
    super.initState();
    _pathsFuture = _learningService.getPaths();
    _offlineIdsFuture = _learningService.getOfflinePathIds();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Learning Paths', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: FutureBuilder(
        future: Future.wait([_pathsFuture, _offlineIdsFuture]),
        builder: (context, AsyncSnapshot<List<dynamic>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          
          if (!snapshot.hasData || (snapshot.data![0] as List).isEmpty) {
            return const Center(child: Text("No courses available yet."));
          }

          final paths = snapshot.data![0] as List<LearningPath>;
          final offlineIds = snapshot.data![1] as List<String>;
          
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: paths.length,
            itemBuilder: (context, index) {
              final path = paths[index];
              return _LearningPathCard(
                path: path,
                isOffline: offlineIds.contains(path.id),
              );
            },
          );
        },
      ),
    );
  }
}

class _LearningPathCard extends StatelessWidget {
  final LearningPath path;
  final bool isOffline;
  
  const _LearningPathCard({required this.path, required this.isOffline});

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'Medical': return Colors.blue;
      case 'Herbal': return Colors.green;
      case 'Lifestyle': return Colors.purple;
      default: return Colors.grey;
    }
  }

  IconData _getIcon(String iconName) {
    switch (iconName) {
      case 'Activity': return LucideIcons.activity;
      case 'Leaf': return LucideIcons.leaf;
      case 'Moon': return LucideIcons.moon;
      default: return LucideIcons.bookOpen;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getCategoryColor(path.category);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey[200]!),
      ),
      elevation: 0,
      color: Colors.white,
      child: InkWell(
        onTap: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => PathDetailScreen(pathId: path.id),
            ),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(_getIcon(path.icon), color: color),
                  ),
                  Row(
                    children: [
                      if (isOffline) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.green[50],
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            children: [
                              Icon(LucideIcons.check, size: 12, color: Colors.green[700]),
                              const SizedBox(width: 4),
                              Text(
                                'OFFLINE',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green[700],
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                      ],
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          path.category.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10, 
                            fontWeight: FontWeight.bold,
                            color: color,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                path.title,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                path.description,
                style: TextStyle(color: Colors.grey[600], fontSize: 14),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${path.totalModules} Modules',
                    style: TextStyle(color: Colors.grey[500], fontSize: 12),
                  ),
                  if (path.progress > 0)
                    Text(
                      '${path.progress}% Complete',
                      style: TextStyle(
                        color: Colors.blue[600],
                        fontWeight: FontWeight.bold,
                        fontSize: 12
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: path.progress / 100,
                  backgroundColor: Colors.grey[100],
                  valueColor: AlwaysStoppedAnimation<Color>(color),
                  minHeight: 4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
