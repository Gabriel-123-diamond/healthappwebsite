import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:ikike_health_ai/screens/home_screen.dart';
import 'package:ikike_health_ai/screens/learning/learning_screen.dart';
import 'package:ikike_health_ai/screens/community/community_screen.dart';
import 'package:ikike_health_ai/screens/directory_screen.dart';
import 'package:ikike_health_ai/screens/journal_screen.dart';
import 'package:ikike_health_ai/screens/profile_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    const HomeScreen(),
    const LearningScreen(),
    const CommunityScreen(),
    const JournalScreen(),
    const DirectoryScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: Colors.grey[200]!)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Colors.white,
          selectedItemColor: Theme.of(context).primaryColor,
          unselectedItemColor: Colors.grey[400],
          showSelectedLabels: true,
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.search),
              label: 'Search',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.graduationCap),
              label: 'Learn',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.messageSquare),
              label: 'Community',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.calendar),
              label: 'Journal',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.users),
              label: 'Directory',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.user),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
