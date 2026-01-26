import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:ikike_health_ai/services/safety_service.dart';
import 'package:ikike_health_ai/services/ai_service.dart';
import 'package:ikike_health_ai/services/feed_service.dart';
import 'package:ikike_health_ai/models/feed_item.dart';
import 'package:ikike_health_ai/widgets/feed_card.dart';
import 'package:ikike_health_ai/widgets/home/home_hero.dart';
import 'package:ikike_health_ai/widgets/home/search_results_view.dart';
import 'package:ikike_health_ai/widgets/home/feature_item.dart';
import 'package:ikike_health_ai/screens/expert/register_expert_screen.dart';
import 'package:ikike_health_ai/widgets/global_disclaimer_dialog.dart';
import 'package:ikike_health_ai/screens/auth/signin_screen.dart';
import 'package:ikike_health_ai/screens/notifications_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  final FeedService _feedService = FeedService();
  
  String _searchMode = 'both';
  SafetyCheckResult? _safetyResult;
  AIResponse? _aiResponse;
  bool _isSearching = false;
  List<FeedItem> _feedItems = [];
  bool _isLoadingFeed = true;

  // For staggered animations
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    
    WidgetsBinding.instance.addPostFrameCallback((_) {
      GlobalDisclaimerDialog.show(context);
    });

    _loadFeed();
  }

  Future<void> _loadFeed() async {
    try {
      final items = await _feedService.getFeedItems();
      if (mounted) {
        setState(() {
          _feedItems = items;
          _isLoadingFeed = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingFeed = false);
      }
    }
  }

  Future<bool> _checkAuth() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      await Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const SignInScreen()),
      );
      return false;
    }
    return true;
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _checkRedFlags(String value) {
    if (value.isEmpty) {
      setState(() {
        _safetyResult = null;
      });
      return;
    }
    setState(() {
      _safetyResult = SafetyService.checkSafety(value);
    });
  }

  Future<void> _performSearch() async {
    // Auth Check
    if (!await _checkAuth()) return;

    final query = _searchController.text.trim();
    if (query.isEmpty || _safetyResult?.hasRedFlag == true) return;

    setState(() {
      _isSearching = true;
      _aiResponse = null;
    });

    try {
      final response = await AiService.searchHealthTopic(query, _searchMode);
      if (mounted) {
        setState(() {
          _aiResponse = response;
        });
        _animationController.forward(from: 0);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Search failed: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSearching = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Row(
          children: [
            Hero(
              tag: 'app_logo',
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'H',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
                          const Text(
                            'Ikiké Health AI',              style: TextStyle(
                fontWeight: FontWeight.bold,
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const NotificationsScreen()),
              );
            },
            icon: const Icon(LucideIcons.bell),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Home Hero (Search & Safety)
            AnimatedSize(
              duration: const Duration(milliseconds: 300),
              child: _aiResponse == null 
                ? HomeHero(
                    searchController: _searchController,
                    isSearching: _isSearching,
                    searchMode: _searchMode,
                    safetyResult: _safetyResult,
                    onSearch: _performSearch,
                    onModeChanged: (mode) => setState(() => _searchMode = mode),
                    onQueryChanged: _checkRedFlags,
                    onAuthCheck: () => _checkAuth(),
                  )
                : const SizedBox.shrink(),
            ),

            // Results Section
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 500),
              child: _aiResponse != null
                ? SearchResultsView(
                    key: const ValueKey('results'),
                    aiResponse: _aiResponse!,
                    animationController: _animationController,
                  )
                : Column(
                    key: const ValueKey('content'),
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Feed Section
                      Padding(
                        padding: const EdgeInsets.only(left: 24.0, bottom: 16.0),
                        child: Text(
                          'Recommended for You',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey[900],
                          ),
                        ),
                      ),
                      
                      SizedBox(
                        height: 300,
                        child: _isLoadingFeed 
                          ? Center(child: CircularProgressIndicator(color: Colors.blue[100]))
                          : ListView.builder(
                              padding: const EdgeInsets.only(left: 24, right: 8),
                              scrollDirection: Axis.horizontal,
                              itemCount: _feedItems.length,
                              itemBuilder: (context, index) {
                                return FeedCard(item: _feedItems[index]);
                              },
                            ),
                      ),

                      const SizedBox(height: 32),

                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Explore Features',
                              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 16),
                            _FeatureItem(
                              icon: LucideIcons.shieldCheck,
                              color: Colors.blue,
                              title: 'Verified Information',
                              subtitle: 'AI-backed medical and herbal data.',
                            ),
                            _FeatureItem(
                              icon: LucideIcons.users,
                              color: Colors.green,
                              title: 'Expert Directory',
                              subtitle: 'Find doctors and herbalists.',
                            ),
                            _FeatureItem(
                              icon: LucideIcons.video,
                              color: Colors.red,
                              title: 'Educational Videos',
                              subtitle: 'Curated health content.',
                            ),
                            const SizedBox(height: 24),
                            
                            // Expert Registration Banner
                            GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) => const RegisterExpertScreen()),
                                );
                              },
                              child: Container(
                                padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(12),
                          ),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          const Text(
                                            'Are you a Health Expert?',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 18,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            'Join our network of verified doctors and herbalists.',
                                            style: TextStyle(
                                              color: Colors.grey[400],
                                              fontSize: 13,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: Colors.blue[600],
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: const Text(
                                        'Join Now',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),
                    ],
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

