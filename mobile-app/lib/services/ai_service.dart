import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/search_result.dart';

class AIResponse {
  final String answer;
  final List<SearchResult> results;
  final String disclaimer;
  final bool isEmergency;
  final Map<String, dynamic>? emergencyData;
  final Map<String, String>? regionalContext;
  final Map<String, String>? directoryMatch;
  final int? confidenceScore;
  final String? explanation;

  AIResponse({
    required this.answer,
    required this.results,
    required this.disclaimer,
    this.isEmergency = false,
    this.emergencyData,
    this.regionalContext,
    this.directoryMatch,
    this.confidenceScore,
    this.explanation,
  });
}

class AiService {
  static const String baseUrl = 'http://10.0.2.2:3000/api'; 

  static Future<AIResponse> searchHealthTopic(String query, String mode) async {
    try {
      await Future.delayed(const Duration(seconds: 1)); // Simulate latency
      return _getMockResponse(query, mode);
    } catch (e) {
      throw Exception('Failed to connect to AI service: $e');
    }
  }

  static AIResponse _getMockResponse(String query, String mode) {
    final isMedical = mode == 'medical' || mode == 'both';
    final isHerbal = mode == 'herbal' || mode == 'both';
    
    String answer = '';
    List<SearchResult> results = [];
    Map<String, String>? regionalContext;
    Map<String, String>? directoryMatch;

    if (query.toLowerCase().contains('sarah') || query.toLowerCase().contains('cardio')) {
      directoryMatch = {
        'id': 'exp1',
        'name': 'Dr. Sarah Johnson',
        'specialty': 'Cardiology'
      };
    }

    if (query.toLowerCase().contains('headache')) {
      if (isMedical) {
        answer += "**Medical Perspective:**\nMedically, headaches can be caused by tension, dehydration, or migraines. Common treatments include over-the-counter analgesics like acetaminophen or ibuprofen. Hydration and rest are also recommended.\n\n";
        results.add(SearchResult(
          id: 'm1',
          title: 'Tension Headache Overview',
          summary: 'Causes and treatments for common tension headaches.',
          source: 'Mayo Clinic',
          type: 'medical',
          evidenceGrade: 'A',
        ));
        results.add(SearchResult(
          id: 'm2',
          title: 'Migraine Triggers',
          summary: 'Understanding what triggers migraines and how to manage them.',
          source: 'WebMD',
          type: 'medical',
          evidenceGrade: 'B',
        ));
      }
      if (isHerbal) {
        answer += "**Herbal Perspective:**\nIn herbal traditions, headaches are often treated with Peppermint oil (applied topically), Feverfew, or Willow Bark. Ginger tea may also help if the headache is associated with nausea.";
        results.add(SearchResult(
          id: 'h1',
          title: 'Peppermint Oil for Headaches',
          summary: 'Studies on the efficacy of peppermint oil for tension headaches.',
          source: 'NIH / PubMed',
          type: 'herbal',
          evidenceGrade: 'B',
        ));
        results.add(SearchResult(
          id: 'h2',
          title: 'Feverfew: Traditional Uses',
          summary: 'Historical use of feverfew for migraine relief.',
          source: 'Botanical Safety Handbook',
          type: 'herbal',
          evidenceGrade: 'C',
        ));
      }
      regionalContext = {
        'region': 'East Asia',
        'insight': 'In Traditional Chinese Medicine (TCM), headaches are often mapped to specific meridians. For example, a headache at the temples is associated with the Gallbladder meridian.'
      };
    } else {
      answer = "I can provide information on medical and herbal approaches for '$query'. Please consult a professional for diagnosis.";
      results.add(SearchResult(
        id: 'g1',
        title: 'General Health Info: $query',
        summary: 'General information regarding $query from verified sources.',
        source: 'Health Database',
        type: 'medical',
        evidenceGrade: 'B',
      ));
    }

    return AIResponse(
      answer: answer.trim(),
      results: results,
      disclaimer: "This information is for educational purposes only and does not constitute medical advice.",
      regionalContext: regionalContext,
      directoryMatch: directoryMatch,
      confidenceScore: 95,
      explanation: "Based on medical consensus and peer-reviewed journals.",
    );
  }
}
