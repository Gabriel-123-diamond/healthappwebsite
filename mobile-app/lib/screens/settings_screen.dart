import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';
import '../services/biometric_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final BiometricService _biometricService = BiometricService();
  bool _emailNotifications = true;
  bool _pushNotifications = true;
  bool _dataCollection = false;
  bool _biometricsEnabled = false;
  bool _isBiometricHardwareAvailable = false;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final enabled = await _biometricService.isEnabled();
    final available = await _biometricService.isBiometricAvailable();
    setState(() {
      _biometricsEnabled = enabled;
      _isBiometricHardwareAvailable = available;
    });
  }

  Future<void> _toggleBiometrics(bool value) async {
    if (value) {
      final success = await _biometricService.authenticate();
      if (success) {
        await _biometricService.setEnabled(true);
        setState(() => _biometricsEnabled = true);
      }
    } else {
      await _biometricService.setEnabled(false);
      setState(() => _biometricsEnabled = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Settings', style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
      ),
      body: ListView(
        children: [
          const _SectionHeader(title: 'General'),
          SwitchListTile(
            title: const Text('Dark Mode'),
            secondary: Icon(LucideIcons.moon, color: Colors.grey[700]),
            value: themeProvider.themeMode == ThemeMode.dark,
            onChanged: (value) {
              themeProvider.setThemeMode(value ? ThemeMode.dark : ThemeMode.light);
            },
            activeColor: Colors.blue,
          ),
          
          const _SectionHeader(title: 'Notifications'),
          SwitchListTile(
            title: const Text('Push Notifications'),
            subtitle: const Text('Receive updates about your health journey'),
            secondary: Icon(LucideIcons.bell, color: Colors.grey[700]),
            value: _pushNotifications,
            onChanged: (val) => setState(() => _pushNotifications = val),
            activeColor: Colors.blue,
          ),
          SwitchListTile(
            title: const Text('Email Newsletters'),
            subtitle: const Text('Weekly health tips and summaries'),
            secondary: Icon(LucideIcons.mail, color: Colors.grey[700]),
            value: _emailNotifications,
            onChanged: (val) => setState(() => _emailNotifications = val),
            activeColor: Colors.blue,
          ),

          const _SectionHeader(title: 'Privacy & Security'),
          if (_isBiometricHardwareAvailable)
            SwitchListTile(
              title: const Text('Biometric Login'),
              subtitle: const Text('Use fingerprint or face ID to unlock'),
              secondary: Icon(LucideIcons.fingerprint, color: Colors.grey[700]),
              value: _biometricsEnabled,
              onChanged: _toggleBiometrics,
              activeColor: Colors.blue,
            ),
          SwitchListTile(
            title: const Text('Usage Analytics'),
            subtitle: const Text('Share anonymous data to help us improve'),
            secondary: Icon(LucideIcons.barChart2, color: Colors.grey[700]),
            value: _dataCollection,
            onChanged: (val) => setState(() => _dataCollection = val),
            activeColor: Colors.blue,
          ),
          ListTile(
            leading: Icon(LucideIcons.trash2, color: Colors.red[400]),
            title: Text('Clear Cache', style: TextStyle(color: Colors.red[400])),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cache cleared successfully')),
              );
            },
          ),

          const _SectionHeader(title: 'About'),
          ListTile(
            leading: Icon(LucideIcons.info, color: Colors.grey[700]),
            title: const Text('Version'),
            trailing: const Text('1.0.0 (Beta)', style: TextStyle(color: Colors.grey)),
          ),
          ListTile(
            leading: Icon(LucideIcons.fileText, color: Colors.grey[700]),
            title: const Text('Privacy Policy'),
            trailing: const Icon(LucideIcons.chevronRight, size: 16),
            onTap: () {},
          ),
          ListTile(
            leading: Icon(LucideIcons.fileText, color: Colors.grey[700]),
            title: const Text('Terms of Service'),
            trailing: const Icon(LucideIcons.chevronRight, size: 16),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          color: Theme.of(context).primaryColor,
          fontSize: 12,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}
