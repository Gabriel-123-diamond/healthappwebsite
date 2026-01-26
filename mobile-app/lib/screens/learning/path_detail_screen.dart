import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../models/learning_path.dart';
import '../../services/learning_service.dart';

class PathDetailScreen extends StatefulWidget {
  final String pathId;
  const PathDetailScreen({super.key, required this.pathId});

  @override
  State<PathDetailScreen> createState() => _PathDetailScreenState();
}

class _PathDetailScreenState extends State<PathDetailScreen> {
  final LearningService _learningService = LearningService();
  late Future<LearningPath?> _pathFuture;
  bool _isOffline = false;

  @override
  void initState() {
    super.initState();
    _loadPath();
  }

  Future<void> _loadPath() async {
    final ids = await _learningService.getOfflinePathIds();
    setState(() {
      _pathFuture = _learningService.getPathById(widget.pathId);
      _isOffline = ids.contains(widget.pathId);
    });
  }

  Future<void> _downloadPath(LearningPath path) async {
    await _learningService.downloadPath(path);
    setState(() {
      _isOffline = true;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Course downloaded successfully!'))
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: FutureBuilder<LearningPath?>(
        future: _pathFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data == null) {
            return Scaffold(
              appBar: AppBar(),
              body: const Center(child: Text("Path not found")),
            );
          }

          final path = snapshot.data!;
          return CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 250.0,
                floating: false,
                pinned: true,
                backgroundColor: const Color(0xFF111827),
                actions: [
                  _isOffline 
                    ? const Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Icon(LucideIcons.checkCircle, color: Colors.green),
                      )
                    : IconButton(
                        onPressed: () => _downloadPath(path),
                        icon: const Icon(LucideIcons.download),
                      ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topRight,
                            end: Alignment.bottomLeft,
                            colors: [Color(0xFF1E3A8A), Color(0xFF111827)],
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        left: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(20),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Container(
                                width: 80,
                                height: 80,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Colors.white, width: 4),
                                ),
                                child: const Center(
                                  child: Icon(LucideIcons.graduationCap, size: 40, color: Colors.grey),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      path.title,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        const Icon(LucideIcons.bookOpen, color: Colors.white70, size: 14),
                                        const SizedBox(width: 4),
                                        Text(
                                          '${path.totalModules} Modules',
                                          style: const TextStyle(color: Colors.white70, fontSize: 12),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Type Badge
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.blue[50],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              path.category.toUpperCase(),
                              style: TextStyle(
                                color: Colors.blue[700],
                                fontWeight: FontWeight.bold,
                                fontSize: 10,
                              ),
                            ),
                          ),
                          if (_isOffline) ...[
                            const SizedBox(width: 8),
                            Row(
                              children: [
                                Icon(LucideIcons.check, size: 14, color: Colors.green[700]),
                                const SizedBox(width: 4),
                                Text(
                                  'Available Offline',
                                  style: TextStyle(color: Colors.green[700], fontWeight: FontWeight.bold, fontSize: 12),
                                ),
                              ],
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 24),
                      
                      // About
                      const Text('About this course', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(
                        path.description,
                        style: TextStyle(color: Colors.grey[600], height: 1.5),
                      ),
                      const SizedBox(height: 24),
                      
                      // Certificate Section
                      if (path.progress == 100) ...[
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(color: const Color(0xFFF59E0B).withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
                            ],
                          ),
                          child: Column(
                            children: [
                              const Icon(LucideIcons.award, size: 48, color: Colors.white),
                              const SizedBox(height: 12),
                              const Text(
                                'Congratulations!',
                                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                              const Text(
                                'You have completed this course.',
                                style: TextStyle(color: Colors.white70, fontSize: 14),
                              ),
                              const SizedBox(height: 20),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: () {
                                    showDialog(
                                      context: context,
                                      builder: (context) => AlertDialog(
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                        content: Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            const Icon(LucideIcons.checkCircle2, size: 64, color: Colors.green),
                                            const SizedBox(height: 16),
                                            const Text('Certificate Claimed', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                                            const SizedBox(height: 8),
                                            const Text(
                                              'Your CME certificate has been sent to your registered email.',
                                              textAlign: TextAlign.center,
                                              style: TextStyle(color: Colors.grey),
                                            ),
                                            const SizedBox(height: 24),
                                            ElevatedButton(
                                              onPressed: () => Navigator.pop(context),
                                              child: const Text('Great!'),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.white,
                                    foregroundColor: const Color(0xFFD97706),
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                  child: const Text('Claim CME Certificate', style: TextStyle(fontWeight: FontWeight.bold)),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                      
                      // Course Content
                      const Text('Course Content', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              if (path.modules.isEmpty)
                SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Column(
                        children: [
                          Icon(LucideIcons.lock, size: 48, color: Colors.grey[300]),
                          const SizedBox(height: 16),
                          Text(
                            'Modules coming soon',
                            style: TextStyle(color: Colors.grey[500]),
                          ),
                        ],
                      ),
                    ),
                  ),
                )
              else
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final module = path.modules[index];
                      return _ModuleItem(module: module, index: index);
                    },
                    childCount: path.modules.length,
                  ),
                ),
              const SliverPadding(padding: EdgeInsets.only(bottom: 32)),
            ],
          );
        },
      ),
    );
  }
}

class _ModuleItem extends StatelessWidget {
  final Module module;
  final int index;

  const _ModuleItem({required this.module, required this.index});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          initiallyExpanded: index == 0,
          leading: Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: Colors.blue[50],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(
                '${index + 1}',
                style: TextStyle(color: Colors.blue[700], fontWeight: FontWeight.bold),
              ),
            ),
          ),
          title: Text(
            module.title,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
          ),
          children: module.lessons.map((lesson) => _LessonItem(lesson: lesson)).toList(),
        ),
      ),
    );
  }
}

class _LessonItem extends StatelessWidget {
  final Lesson lesson;

  const _LessonItem({required this.lesson});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {},
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: Colors.grey[100]!)),
        ),
        child: Row(
          children: [
            Icon(
              lesson.type == 'video' ? LucideIcons.playCircle : LucideIcons.fileText,
              size: 20,
              color: Colors.grey[400],
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    lesson.title,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    lesson.duration,
                    style: TextStyle(fontSize: 12, color: Colors.grey[400]),
                  ),
                ],
              ),
            ),
            Icon(
              lesson.isCompleted ? LucideIcons.checkCircle : LucideIcons.circle,
              size: 20,
              color: lesson.isCompleted ? Colors.green : Colors.grey[300],
            ),
          ],
        ),
      ),
    );
  }
}
