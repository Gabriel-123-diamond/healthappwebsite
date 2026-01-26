import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/journal_entry.dart';

class JournalService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  static const String collection = 'journals';

  Future<void> addEntry(JournalEntry entry) async {
    await _db.collection(collection).add(entry.toFirestore());
  }

  Stream<List<JournalEntry>> getEntries(String userId) {
    return _db.collection(collection)
        .where('userId', isEqualTo: userId)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => JournalEntry.fromFirestore(doc))
            .toList());
  }

  Future<void> deleteEntry(String entryId) async {
    await _db.collection(collection).doc(entryId).delete();
  }
}
