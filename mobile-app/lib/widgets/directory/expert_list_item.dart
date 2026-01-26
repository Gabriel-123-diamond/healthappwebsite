import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../screens/expert_details_screen.dart';
import '../../services/directory_service.dart';

class ExpertListItem extends StatelessWidget {
  final Expert expert;

  const ExpertListItem({super.key, required this.expert});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.withOpacity(0.2)),
      ),
      elevation: 0,
      color: Theme.of(context).cardTheme.color ?? Colors.white,
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ExpertDetailsScreen(expert: expert),
            ),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(12),
                  image: expert.imageUrl != null 
                      ? DecorationImage(image: NetworkImage(expert.imageUrl!), fit: BoxFit.cover)
                      : null,
                ),
                child: expert.imageUrl == null 
                    ? const Icon(LucideIcons.user, color: Colors.grey) 
                    : null,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          expert.name,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        if (expert.verified) ...[
                          const SizedBox(width: 4),
                          const Icon(LucideIcons.checkCircle, size: 14, color: Colors.blue),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      expert.specialty,
                      style: const TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.w500),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(LucideIcons.mapPin, size: 12, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          expert.location,
                          style: TextStyle(color: Colors.grey[600], fontSize: 12),
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
    );
  }
}
