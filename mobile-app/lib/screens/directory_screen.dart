import 'package:flutter/material.dart';
import 'package:ikike_health_ai/services/directory_service.dart';
import 'package:ikike_health_ai/services/institution_service.dart';
import 'package:ikike_health_ai/widgets/directory/expert_list_item.dart';
import 'package:ikike_health_ai/widgets/directory/institution_list_item.dart';
import 'package:ikike_health_ai/models/institution.dart';

class DirectoryScreen extends StatefulWidget {
  const DirectoryScreen({super.key});

  @override
  State<DirectoryScreen> createState() => _DirectoryScreenState();
}

class _DirectoryScreenState extends State<DirectoryScreen> {
  final InstitutionService _institutionService = InstitutionService();

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          title: const Text('Directory', style: TextStyle(fontWeight: FontWeight.bold)),
          bottom: const TabBar(
            labelColor: Color(0xFF2563EB),
            unselectedLabelColor: Colors.grey,
            indicatorColor: Color(0xFF2563EB),
            tabs: [
              Tab(text: 'Experts'),
              Tab(text: 'Institutions'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Experts Tab
            FutureBuilder<List<Expert>>(
              future: DirectoryService.getExperts(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                
                final experts = snapshot.data ?? [];
                
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: experts.length,
                  itemBuilder: (context, index) {
                    return ExpertListItem(expert: experts[index]);
                  },
                );
              },
            ),

            // Institutions Tab
            FutureBuilder<List<Institution>>(
              future: _institutionService.getInstitutions(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                final institutions = snapshot.data ?? [];

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: institutions.length,
                  itemBuilder: (context, index) {
                    return InstitutionListItem(institution: institutions[index]);
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
