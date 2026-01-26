import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/learning_path.dart';

class LearningService {
  // Mock Data
  final List<LearningPath> _mockPaths = [
    LearningPath(
      id: '1',
      title: 'Managing Hypertension',
      description: 'Learn the basics of high blood pressure, medication management, and lifestyle changes.',
      category: 'Medical',
      icon: 'Activity',
      progress: 35,
      totalModules: 3,
      modules: [
        Module(
          id: 'm1',
          title: 'Understanding Blood Pressure',
          lessons: [
            Lesson(id: 'l1', title: 'What is Systolic vs Diastolic?', duration: '3 min', type: 'video', isCompleted: true),
            Lesson(id: 'l2', title: 'The Silent Killer: Symptoms', duration: '5 min', type: 'article', isCompleted: false),
          ],
        ),
        Module(
          id: 'm2',
          title: 'Dietary Changes',
          lessons: [
            Lesson(id: 'l3', title: 'The DASH Diet Explained', duration: '10 min', type: 'article', isCompleted: false),
            Lesson(id: 'l4', title: 'Reducing Sodium Intake', duration: '4 min', type: 'video', isCompleted: false),
          ],
        ),
      ],
    ),
    LearningPath(
      id: '2',
      title: 'Herbal Remedies 101',
      description: 'A beginner’s guide to safe and effective herbal teas, tinctures, and salves.',
      category: 'Herbal',
      icon: 'Leaf',
      progress: 0,
      totalModules: 4,
    ),
    LearningPath(
      id: '3',
      title: 'Sleep Hygiene Masterclass',
      description: 'Practical steps to improve your sleep quality naturally.',
      category: 'Lifestyle',
      icon: 'Moon',
      progress: 80,
      totalModules: 2,
    ),
  ];

  Future<List<LearningPath>> getPaths() async {
    await Future.delayed(const Duration(milliseconds: 500)); // Simulate delay
    return _mockPaths;
  }

  Future<LearningPath?> getPathById(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final String? offlineData = prefs.getString('learning-path-$id');

    if (offlineData != null) {
      final json = jsonDecode(offlineData);
      return LearningPath.fromJson(json);
    }

    await Future.delayed(const Duration(milliseconds: 500));
    try {
      return _mockPaths.firstWhere((p) => p.id == id);
    } catch (e) {
      return null;
    }
  }

  Future<void> downloadPath(LearningPath path) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('learning-path-${path.id}', jsonEncode(path.toJson()));
  }

  Future<List<String>> getOfflinePathIds() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getKeys().where((k) => k.startsWith('learning-path-')).map((k) => k.replaceAll('learning-path-', '')).toList();
  }
}
