class InstitutionLibrary {
  final String id;
  final String title;
  final String description;
  final bool isPremium;
  final List<LibraryResource> resources;

  InstitutionLibrary({
    required this.id,
    required this.title,
    required this.description,
    required this.isPremium,
    required this.resources,
  });
}

class LibraryResource {
  final String id;
  final String title;
  final String type; // 'PDF', 'Video', 'Protocol'
  final String url;

  LibraryResource({
    required this.id,
    required this.title,
    required this.type,
    required this.url,
  });
}

class Institution {
  final String id;
  final String name;
  final String type; // 'Hospital', 'University', 'NGO', 'Clinic'
  final String location;
  final String description;
  final String? logoUrl;
  final String? coverUrl;
  final String? website;
  final bool verified;
  final List<String> specialties;
  final Map<String, int> stats;
  final List<InstitutionLibrary> library;

  Institution({
    required this.id,
    required this.name,
    required this.type,
    required this.location,
    required this.description,
    this.logoUrl,
    this.coverUrl,
    this.website,
    required this.verified,
    required this.specialties,
    required this.stats,
    this.library = const [],
  });
}
