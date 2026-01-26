import 'dart:convert';

class Lesson {
  final String id;
  final String title;
  final String duration;
  final String type; // 'video', 'article', 'quiz'
  final bool isCompleted;

  Lesson({
    required this.id,
    required this.title,
    required this.duration,
    required this.type,
    this.isCompleted = false,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id'],
      title: json['title'],
      duration: json['duration'],
      type: json['type'],
      isCompleted: json['isCompleted'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'duration': duration,
      'type': type,
      'isCompleted': isCompleted,
    };
  }
}

class Module {
  final String id;
  final String title;
  final List<Lesson> lessons;

  Module({
    required this.id,
    required this.title,
    required this.lessons,
  });

  factory Module.fromJson(Map<String, dynamic> json) {
    return Module(
      id: json['id'],
      title: json['title'],
      lessons: (json['lessons'] as List).map((l) => Lesson.fromJson(l)).toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'lessons': lessons.map((l) => l.toJson()).toList(),
    };
  }
}

class LearningPath {
  final String id;
  final String title;
  final String description;
  final String category; // 'Medical', 'Herbal', 'Lifestyle'
  final String icon;
  final int progress;
  final int totalModules;
  final List<Module> modules;

  LearningPath({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.icon,
    required this.progress,
    required this.totalModules,
    this.modules = const [],
  });

  factory LearningPath.fromJson(Map<String, dynamic> json) {
    return LearningPath(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      icon: json['icon'],
      progress: json['progress'],
      totalModules: json['totalModules'],
      modules: (json['modules'] as List).map((m) => Module.fromJson(m)).toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'icon': icon,
      'progress': progress,
      'totalModules': totalModules,
      'modules': modules.map((m) => m.toJson()).toList(),
    };
  }
}
