import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  DateTime? _startDate;
  DateTime? _endDate;

  final List<Map<String, dynamic>> _historyItems = [
    {
      'id': '1',
      'query': 'Headache treatment',
      'mode': 'both',
      'summary': 'Medically, headaches can be caused by tension... In herbal traditions, Peppermint oil is often used.',
      'timestamp': '2026-01-24T10:30:00',
    },
    {
      'id': '2',
      'query': 'Turmeric benefits',
      'mode': 'herbal',
      'summary': 'Extensive research highlights the potent anti-inflammatory properties...',
      'timestamp': '2026-01-23T15:45:00',
    },
    {
      'id': '3',
      'query': 'Lisinopril side effects',
      'mode': 'medical',
      'summary': 'Common side effects include a dry cough, dizziness, and fatigue...',
      'timestamp': '2026-01-20T09:12:00',
    },
  ];

  List<Map<String, dynamic>> get _filteredHistory {
    return _historyItems.where((item) {
      final date = DateTime.parse(item['timestamp']);
      if (_startDate != null && date.isBefore(_startDate!)) return false;
      if (_endDate != null && date.isAfter(_endDate!.add(const Duration(days: 1)))) return false;
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredHistory;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Search History', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(LucideIcons.calendar, color: _startDate != null ? Colors.blue : Colors.grey),
            onPressed: () async {
              final picked = await showDateRangePicker(
                context: context,
                firstDate: DateTime(2020),
                lastDate: DateTime.now(),
                initialDateRange: _startDate != null && _endDate != null 
                  ? DateTimeRange(start: _startDate!, end: _endDate!)
                  : null,
              );
              if (picked != null) {
                setState(() {
                  _startDate = picked.start;
                  _endDate = picked.end;
                });
              }
            },
          ),
          if (_startDate != null || _endDate != null)
            IconButton(
              icon: const Icon(LucideIcons.x, color: Colors.red),
              onPressed: () => setState(() {
                _startDate = null;
                _endDate = null;
              }),
            ),
        ],
      ),
      body: Column(
        children: [
          if (_startDate != null && _endDate != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              color: Colors.blue[50],
              width: double.infinity,
              child: Text(
                'Filter: ${DateFormat('MMM d').format(_startDate!)} - ${DateFormat('MMM d').format(_endDate!)}',
                style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 12),
              ),
            ),
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.history, size: 64, color: Colors.grey[300]),
                        const SizedBox(height: 16),
                        const Text(
                          'No history found',
                          style: TextStyle(fontSize: 18, color: Color(0xFFFAFAFA)),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey[200]!),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ListTile(
                              title: Text(
                                item['query']!,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              trailing: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: _getModeColor(item['mode']!).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  item['mode']!.toUpperCase(),
                                  style: TextStyle(
                                    color: _getModeColor(item['mode']!),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                            ),
                            if (item['summary'] != null)
                              Padding(
                                padding: const EdgeInsets.only(left: 16, right: 16, bottom: 8),
                                child: Text(
                                  item['summary']!,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(color: Colors.grey[600], fontSize: 14),
                                ),
                              ),
                            Padding(
                              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                              child: Text(
                                DateFormat('MMM d, yyyy • h:mm a').format(DateTime.parse(item['timestamp'])),
                                style: TextStyle(color: Colors.grey[400], fontSize: 12),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Color _getModeColor(String mode) {
    switch (mode) {
      case 'medical': return Colors.blue;
      case 'herbal': return Colors.green;
      default: return Colors.purple;
    }
  }
}
