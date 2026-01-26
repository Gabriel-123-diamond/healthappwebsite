import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:ikike_health_ai/screens/main_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:flutter/services.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' as auth;
import 'package:ikike_health_ai/data/countries.dart' as data;
import 'package:ikike_health_ai/models/country.dart';
import 'package:ikike_health_ai/i18n/translations.g.dart';

class ProfileCompletionScreen extends StatefulWidget {
  const ProfileCompletionScreen({super.key});

  @override
  State<ProfileCompletionScreen> createState() => _ProfileCompletionScreenState();
}

class _ProfileCompletionScreenState extends State<ProfileCompletionScreen> {
  int _currentStep = 0;
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _countryController = TextEditingController();
  
  String _selectedAgeRange = '';
  String _selectedRole = 'user';
  String _selectedCountryCode = '+234';
  String _usernameStatus = ''; // 'available', 'taken', 'checking', ''
  String _phoneStatus = ''; 
  String _nameStatus = '';
  final List<String> _selectedInterests = [];
  bool _isLoading = false;

  final List<String> _ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
  
  final List<Map<String, dynamic>> _roleOptions = [
    { 'id': 'user', 'label': 'General User', 'icon': LucideIcons.user, 'desc': 'I am looking for health information.' },
    { 'id': 'doctor', 'label': 'Doctor', 'icon': LucideIcons.stethoscope, 'desc': 'I am a verified medical professional.' },
    { 'id': 'herbalist', 'label': 'Herbalist', 'icon': LucideIcons.leaf, 'desc': 'I am a traditional medicine practitioner.' },
    { 'id': 'hospital', 'label': 'Hospital', 'icon': LucideIcons.building2, 'desc': 'I represent a healthcare facility.' },
  ];

  final List<String> _interestOptions = [
    'Herbal Medicine', 'Cardiology', 'Mental Health', 'Nutrition', 'Yoga', 'Diabetes', 'Fitness', 'Sleep'
  ];

  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _currentStep = prefs.getInt('onboarding_step') ?? 0;
      _firstNameController.text = prefs.getString('firstName') ?? '';
      _lastNameController.text = prefs.getString('lastName') ?? '';
      _usernameController.text = prefs.getString('username') ?? '';
      _phoneController.text = prefs.getString('phone') ?? '';
      _cityController.text = prefs.getString('city') ?? '';
      _countryController.text = prefs.getString('country') ?? '';
      _selectedRole = prefs.getString('role') ?? 'user';
    });
  }

  Future<void> _saveProgress() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('onboarding_step', _currentStep);
    await prefs.setString('firstName', _firstNameController.text);
    await prefs.setString('lastName', _lastNameController.text);
    await prefs.setString('username', _usernameController.text);
    await prefs.setString('phone', _phoneController.text);
    await prefs.setString('city', _cityController.text);
    await prefs.setString('country', _countryController.text);
    await prefs.setString('role', _selectedRole);
  }

  Future<void> _requestLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Location services are disabled.')));
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Location permissions are denied')));
        return;
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Location permissions are permanently denied')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      Position position = await Geolocator.getCurrentPosition();
      
      // Get address from coordinates
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude, 
        position.longitude
      );

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        setState(() {
          _cityController.text = place.locality ?? place.subAdministrativeArea ?? '';
          _countryController.text = place.country ?? '';
        });
      } else {
        setState(() {
          _cityController.text = "Lat: ${position.latitude.toStringAsFixed(2)}"; 
          _countryController.text = "Long: ${position.longitude.toStringAsFixed(2)}";
        });
      }
      _saveProgress();
    } catch (e) {
      print(e);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _checkUsername(String val) {
    if (val.length < 3) {
      setState(() => _usernameStatus = '');
      return;
    }
    setState(() => _usernameStatus = 'checking');
    
    // Real check against Firestore
    FirebaseFirestore.instance
      .collection('users')
      .where('username', '==', val.toLowerCase().trim())
      .limit(1)
      .get()
      .then((snapshot) {
        if (mounted) {
          setState(() {
            _usernameStatus = snapshot.docs.isNotEmpty ? 'taken' : 'available';
          });
        }
      });
  }

  void _checkName() {
    if (_firstNameController.text.length < 2 || _lastNameController.text.length < 2) {
      setState(() => _nameStatus = '');
      return;
    }
    setState(() => _nameStatus = 'checking');
    
    final fullName = "${_firstNameController.text} ${_lastNameController.text}".toLowerCase().trim();
    
    FirebaseFirestore.instance
      .collection('users')
      .where('fullName', '==', fullName)
      .limit(1)
      .get()
      .then((snapshot) {
        if (mounted) {
          setState(() {
            _nameStatus = snapshot.docs.isNotEmpty ? 'taken' : 'available';
          });
        }
      });
  }

  int _getMinPhoneLength() {
    final country = data.countries.firstWhere((c) => c.code == _selectedCountryCode, orElse: () => data.countries[0]);
    return country.min;
  }

  int _getMaxPhoneLength() {
    final country = data.countries.firstWhere((c) => c.code == _selectedCountryCode, orElse: () => data.countries[0]);
    return country.max;
  }

  void _checkPhone(String val) {
    if (val.length < _getMinPhoneLength()) {
      setState(() => _phoneStatus = 'invalid');
      return;
    }
    setState(() => _phoneStatus = 'checking');
    
    final fullPhone = "$_selectedCountryCode${val.trim()}";
    
    FirebaseFirestore.instance
      .collection('users')
      .where('phone', '==', fullPhone)
      .limit(1)
      .get()
      .then((snapshot) {
        if (mounted) {
          setState(() {
            _phoneStatus = snapshot.docs.isNotEmpty ? 'taken' : 'available';
          });
        }
      });
  }

  void _nextStep() async {
    if (_currentStep == 0) {
      if (_usernameStatus != 'available' || _phoneStatus != 'available' || _nameStatus != 'available') return;
      if (_firstNameController.text.isEmpty || _lastNameController.text.isEmpty || _usernameController.text.isEmpty || _phoneController.text.isEmpty || _selectedAgeRange.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields correctly')));
        return;
      }
    }
    await _saveProgress();
    if (_currentStep < 3) {
      setState(() => _currentStep++);
    } else {
      await _submitProfile();
    }
  }

  Future<void> _submitProfile() async {
    setState(() => _isLoading = true);
    try {
      final currentUser = auth.FirebaseAuth.instance.currentUser;
      if (currentUser != null) {
        final fullName = "${_firstNameController.text} ${_lastNameController.text}".toLowerCase().trim();
        
        await FirebaseFirestore.instance.collection('users').doc(currentUser.uid).set({
          'firstName': _firstNameController.text.trim(),
          'lastName': _lastNameController.text.trim(),
          'fullName': fullName,
          'username': _usernameController.text.trim().toLowerCase(),
          'phone': "$_selectedCountryCode${_phoneController.text.trim()}",
          'ageRange': _selectedAgeRange,
          'role': _selectedRole,
          'city': _cityController.text.trim(),
          'country': _countryController.text.trim(),
          'interests': _selectedInterests,
          'onboardingComplete': true,
          'updatedAt': FieldValue.serverTimestamp(),
        }, SetOptions(merge: true));

        final prefs = await SharedPreferences.getInstance();
        await prefs.clear(); // Clear onboarding local data
        
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const MainScreen()),
          );
        }
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to save profile: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSelectionSheet({
    required String title,
    required List<Map<String, String>> options,
    required Function(String) onSelect,
  }) {
    String searchTerm = "";
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      backgroundColor: Colors.white,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          final filteredOptions = options.where((o) => 
            o['label']!.toLowerCase().contains(searchTerm.toLowerCase()) || 
            o['value']!.toLowerCase().contains(searchTerm.toLowerCase())
          ).toList();

          return Container(
            height: MediaQuery.of(context).size.height * 0.7,
            padding: const EdgeInsets.symmetric(vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Search...',
                      prefixIcon: const Icon(LucideIcons.search, size: 20),
                      filled: true,
                      fillColor: Colors.grey[100],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onChanged: (val) {
                      setModalState(() => searchTerm = val);
                    },
                  ),
                ),
                const Divider(),
                Expanded(
                  child: ListView.builder(
                    itemCount: filteredOptions.length,
                    itemBuilder: (context, index) {
                      final option = filteredOptions[index];
                      return ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 24),
                        title: Text(option['label']!, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                        onTap: () {
                          onSelect(option['value']!);
                          Navigator.pop(context);
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            LinearProgressIndicator(
              value: (_currentStep + 1) / 4,
              backgroundColor: Colors.grey[100],
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF2563EB)),
            ),
            
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getHeaderText(),
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _getSubheaderText(),
                      style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                    ),
                    const SizedBox(height: 32),

                    Expanded(
                      child: SingleChildScrollView(
                        child: _buildStepContent(),
                      ),
                    ),

                    Row(
                      children: [
                        TextButton(
                          onPressed: () {
                            if (_currentStep > 0) {
                              setState(() => _currentStep--);
                            } else {
                              Navigator.pop(context);
                            }
                          },
                          child: Text(
                            _currentStep == 0 ? 'Back to Sign Up' : 'Back',
                            style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const Spacer(),
                        SizedBox(
                          width: 180,
                          height: 56,
                          child: ElevatedButton(
                            onPressed: _isLoading || (_currentStep == 0 && (_usernameStatus == 'taken' || _phoneStatus == 'taken' || _nameStatus == 'taken')) ? null : _nextStep,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF2563EB),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 0,
                            ),
                            child: _isLoading 
                              ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                              : Text(
                                  _currentStep == 3 ? 'Get Started' : 'Continue',
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getHeaderText() {
    switch (_currentStep) {
      case 0: return "Identity";
      case 1: return "Professional Role";
      case 2: return "Location";
      case 3: return "Health Interests";
      default: return "";
    }
  }

  String _getSubheaderText() {
    switch (_currentStep) {
      case 0: return "Tell us who you are.";
      case 1: return "Are you joining as a patient or a professional?";
      case 2: return "Click the pin icon to auto-fill your city and country.";
      case 3: return "Select topics you'd like to see in your feed.";
      default: return "";
    }
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: TextField(
                    controller: _firstNameController,
                    onChanged: (_) => _checkName(),
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black87),
                    decoration: InputDecoration(
                      labelText: 'First Name',
                      fillColor: Colors.white,
                      filled: true,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Colors.grey[200]!)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2563EB), width: 2)),
                      errorText: _nameStatus == 'taken' ? 'Taken' : null,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _lastNameController,
                    onChanged: (_) => _checkName(),
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black87),
                    decoration: InputDecoration(
                      labelText: 'Last Name',
                      fillColor: Colors.white,
                      filled: true,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Colors.grey[200]!)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2563EB), width: 2)),
                      suffixIcon: _nameStatus == 'checking' 
                        ? const SizedBox(width: 16, height: 16, child: Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator(strokeWidth: 2)))
                        : _nameStatus == 'available' ? const Icon(LucideIcons.check, color: Colors.green, size: 18) : null,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _usernameController,
              onChanged: _checkUsername,
              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black87),
              decoration: InputDecoration(
                labelText: 'Username',
                prefixIcon: const Icon(LucideIcons.atSign),
                fillColor: Colors.white,
                filled: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Colors.grey[200]!)),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2563EB), width: 2)),
                suffixIcon: _usernameStatus == 'checking' 
                  ? const SizedBox(width: 20, height: 20, child: Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator(strokeWidth: 2)))
                  : _usernameStatus == 'available' 
                    ? const Icon(LucideIcons.check, color: Colors.green)
                    : _usernameStatus == 'taken' 
                      ? const Icon(LucideIcons.alertCircle, color: Colors.red)
                      : null,
                helperText: _usernameStatus == 'available' ? 'Username is available!' : 
                            _usernameStatus == 'taken' ? 'Username is already taken' : null,
                helperStyle: TextStyle(color: _usernameStatus == 'available' ? Colors.green : Colors.red, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GestureDetector(
                  onTap: () {
                    _showSelectionSheet(
                      title: 'Select Country Code',
                      options: data.countries.map((c) => {
                        'label': '${c.flag} ${t['countries.${c.name}']} (${c.code}) [${c.min}-${c.max}]', 
                        'value': c.code
                      }).toList(),
                      onSelect: (val) => setState(() => _selectedCountryCode = val),
                    );
                  },
                  child: Container(
                    height: 60,
                    width: 100,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.grey[200]!),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(_selectedCountryCode, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.black87)),
                        const Icon(LucideIcons.chevronDown, size: 16, color: Colors.grey),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(_getMaxPhoneLength()),
                    ],
                    onChanged: _checkPhone,
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black87),
                    decoration: InputDecoration(
                      labelText: 'Phone Number',
                      prefixIcon: const Icon(LucideIcons.phone),
                      fillColor: Colors.white,
                      filled: true,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Colors.grey[200]!)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2563EB), width: 2)),
                      suffixIcon: _phoneStatus == 'checking' 
                        ? const SizedBox(width: 20, height: 20, child: Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator(strokeWidth: 2)))
                        : _phoneStatus == 'available' 
                          ? const Icon(LucideIcons.check, color: Colors.green)
                          : _phoneStatus == 'taken' 
                            ? const Icon(LucideIcons.alertCircle, color: Colors.red)
                            : _phoneStatus == 'invalid' && _phoneController.text.isNotEmpty
                              ? Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  child: const Text('NOT VALID YET', style: TextStyle(color: Colors.amber, fontSize: 8, fontWeight: FontWeight.bold)),
                                )
                              : null,
                      helperText: _phoneStatus == 'taken' ? 'Phone number already registered' : null,
                      helperStyle: const TextStyle(color: Colors.red),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            GestureDetector(
              onTap: () {
                _showSelectionSheet(
                  title: 'Select Age Range',
                  options: _ageRanges.map((a) => {'label': a, 'value': a}).toList(),
                  onSelect: (val) => setState(() => _selectedAgeRange = val),
                );
              },
              child: Container(
                height: 60,
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: Colors.grey[200]!),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _selectedAgeRange.isEmpty ? 'Select Age Range' : _selectedAgeRange,
                      style: TextStyle(
                        fontWeight: _selectedAgeRange.isEmpty ? FontWeight.normal : FontWeight.bold,
                        color: _selectedAgeRange.isEmpty ? Colors.grey[600] : Colors.black87,
                        fontSize: 16
                      ),
                    ),
                    const Icon(LucideIcons.chevronDown, size: 20, color: Colors.grey),
                  ],
                ),
              ),
            ),
          ],
        );
      case 1:
        return Column(
          children: _roleOptions.map((role) {
            final isSelected = _selectedRole == role['id'];
            return GestureDetector(
              onTap: () => setState(() => _selectedRole = role['id']),
              child: Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isSelected ? Colors.blue[50] : Colors.white,
                  border: Border.all(
                    color: isSelected ? Colors.blue : Colors.grey[200]!,
                    width: 2,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.blue : Colors.grey[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(role['icon'], color: isSelected ? Colors.white : Colors.grey),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(role['label'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          Text(role['desc'], style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                        ],
                      ),
                    ),
                    if (isSelected) const Icon(LucideIcons.check, color: Colors.blue),
                  ],
                ),
              ),
            );
          }).toList(),
        );
      case 2:
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Auto-detect location', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1E40AF))),
                        Text('Tap the icon to find your city', style: TextStyle(fontSize: 12, color: Color(0xFF1E40AF))),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: _requestLocation,
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: Color(0xFF2563EB),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(LucideIcons.mapPin, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _cityController,
              decoration: InputDecoration(
                labelText: 'City',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _countryController,
              decoration: InputDecoration(
                labelText: 'Country',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        );
      case 3:
        return Wrap(
          spacing: 12,
          runSpacing: 12,
          children: _interestOptions.map((topic) {
            final isSelected = _selectedInterests.contains(topic);
            return FilterChip(
              label: Text(topic),
              selected: isSelected,
              onSelected: (val) {
                setState(() {
                  val ? _selectedInterests.add(topic) : _selectedInterests.remove(topic);
                });
              },
              backgroundColor: Colors.white,
              selectedColor: Colors.blue[50],
              labelStyle: TextStyle(color: isSelected ? Colors.blue : Colors.black87, fontWeight: FontWeight.bold),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: isSelected ? Colors.blue : Colors.grey[300]!)),
              showCheckmark: false,
            );
          }).toList(),
        );
      default:
        return const SizedBox.shrink();
    }
  }
}
