import '../models/institution.dart';

class InstitutionService {
  final List<Institution> _mockInstitutions = [
    Institution(
      id: '1',
      name: 'Global Health University Hospital',
      type: 'Hospital',
      location: 'London, UK',
      description: 'A leading research and teaching hospital specializing in integrative medicine and advanced surgical procedures.',
      verified: true,
      specialties: ['Oncology', 'Integrative Medicine', 'Cardiology'],
      stats: {'experts': 120, 'publications': 450, 'followers': 15000},
      website: 'https://example.com',
      library: [
        InstitutionLibrary(
          id: 'lib1',
          title: 'Integrative Oncology Protocols',
          description: 'Standardized guidelines for combining chemotherapy with herbal support.',
          isPremium: true,
          resources: [
            LibraryResource(id: 'r1', title: 'Chemotherapy Support Guidelines 2026', type: 'Protocol', url: '#'),
            LibraryResource(id: 'r2', title: 'Patient Nutrition Handbook', type: 'PDF', url: '#'),
          ],
        ),
        InstitutionLibrary(
          id: 'lib2',
          title: 'Cardiology Research Archive',
          description: 'Open access research papers published by our department.',
          isPremium: false,
          resources: [
            LibraryResource(id: 'r3', title: 'Heart Health & Stress', type: 'PDF', url: '#'),
          ],
        ),
      ],
    ),
    Institution(
      id: '2',
      name: 'Nature Cures Institute',
      type: 'NGO',
      location: 'Kerala, India',
      description: 'Dedicated to preserving and validating traditional Ayurvedic practices through modern scientific research.',
      verified: true,
      specialties: ['Ayurveda', 'Herbal Research', 'Wellness'],
      stats: {'experts': 45, 'publications': 120, 'followers': 8500},
      website: 'https://example.com',
      library: [
        InstitutionLibrary(
          id: 'lib3',
          title: 'Ayurvedic Pharmacopoeia',
          description: 'Detailed monographs of 500+ medicinal plants.',
          isPremium: true,
          resources: [],
        ),
      ],
    ),
    Institution(
      id: '3',
      name: 'City Community Clinic',
      type: 'Clinic',
      location: 'New York, USA',
      description: 'Providing accessible healthcare and health education to underserved communities.',
      verified: true,
      specialties: ['Primary Care', 'Pediatrics', 'Community Health'],
      stats: {'experts': 12, 'publications': 15, 'followers': 2300},
      website: 'https://example.com',
      library: [],
    ),
  ];

  Future<List<Institution>> getInstitutions() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockInstitutions;
  }

  Future<Institution?> getInstitutionById(String id) async {
    await Future.delayed(const Duration(milliseconds: 400));
    try {
      return _mockInstitutions.firstWhere((i) => i.id == id);
    } catch (e) {
      return null;
    }
  }
}
