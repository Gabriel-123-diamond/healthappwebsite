import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:ikike_health_ai/providers/language_provider.dart';
import 'package:ikike_health_ai/providers/theme_provider.dart';
import 'package:ikike_health_ai/screens/expert/expert_dashboard_screen.dart';
import 'package:ikike_health_ai/screens/saved_screen.dart';
import 'package:ikike_health_ai/screens/support_screen.dart';
import 'package:ikike_health_ai/screens/settings_screen.dart';
import 'package:ikike_health_ai/widgets/profile/profile_header.dart';
import 'package:ikike_health_ai/widgets/profile/referral_card.dart';
import 'package:ikike_health_ai/widgets/profile/profile_menu_item.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final TextEditingController _nameController = TextEditingController(text: 'John Doe');
  final TextEditingController _phoneController = TextEditingController(text: '+234 801 234 5678');

  void _showLanguageDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Language'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: const Text('English'),
              onTap: () {
                Provider.of<LanguageProvider>(context, listen: false).setLocale(const Locale('en'));
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: const Text('Español'),
              onTap: () {
                Provider.of<LanguageProvider>(context, listen: false).setLocale(const Locale('es'));
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: const Text('Français'),
              onTap: () {
                Provider.of<LanguageProvider>(context, listen: false).setLocale(const Locale('fr'));
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showEditDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Edit Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Full Name',
                prefixIcon: const Icon(LucideIcons.user),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _phoneController,
              decoration: InputDecoration(
                labelText: 'Phone Number',
                prefixIcon: const Icon(LucideIcons.phone),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Profile updated successfully!')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('My Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.edit3),
            onPressed: _showEditDialog,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 32),
            const ProfileHeader(),
            const SizedBox(height: 32),
            
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: ReferralCard(),
            ),
            
            const SizedBox(height: 24),

            // Settings Section
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Theme.of(context).cardTheme.color ?? Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.withOpacity(0.2)),
              ),
              child: Column(
                children: [
                  ProfileMenuItem(
                    icon: LucideIcons.bookmark,
                    title: 'Saved Items',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SavedScreen()),
                      );
                    },
                  ),
                  ProfileMenuItem(
                    icon: LucideIcons.languages,
                    title: 'Language / Idioma',
                    onTap: () => _showLanguageDialog(context),
                  ),
                  
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.grey.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            themeProvider.themeMode == ThemeMode.dark ? LucideIcons.moon : LucideIcons.sun, 
                            size: 20, 
                            color: Colors.grey[700]
                          ),
                        ),
                        const SizedBox(width: 16),
                        const Expanded(
                          child: Text(
                            'Dark Mode',
                            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                          ),
                        ),
                        Switch(
                          value: themeProvider.themeMode == ThemeMode.dark,
                          onChanged: (value) {
                            themeProvider.setThemeMode(value ? ThemeMode.dark : ThemeMode.light);
                          },
                          activeColor: Colors.blue,
                        ),
                      ],
                    ),
                  ),
                  Divider(height: 1, color: Colors.grey.withOpacity(0.1), indent: 60),

                  ProfileMenuItem(
                    icon: LucideIcons.layoutDashboard,
                    title: 'Expert Dashboard',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const ExpertDashboardScreen()),
                      );
                    },
                  ),
                  ProfileMenuItem(
                    icon: LucideIcons.helpCircle,
                    title: 'Help & Support',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SupportScreen()),
                      );
                    },
                  ),
                  ProfileMenuItem(
                    icon: LucideIcons.settings,
                    title: 'Settings',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SettingsScreen()),
                      );
                    },
                    showDivider: false,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
