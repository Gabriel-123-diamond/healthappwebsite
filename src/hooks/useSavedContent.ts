import { useState, useEffect, useMemo } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { bookmarkService, SavedItem, SavedSearch } from '@/services/bookmarkService';
import { contentFilters } from '@/lib/contentFilters';

export function useSavedContent() {
  const [activeTab, setActiveTab] = useState<'items' | 'searches'>('items');
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    const [items, searches] = await Promise.all([
      bookmarkService.getBookmarkedItems(),
      bookmarkService.getSavedSearches()
    ]);
    setSavedItems(items);
    setSavedSearches(searches);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) loadData();
    });
    return () => unsubscribe();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await bookmarkService.syncBookmarks();
    await loadData();
    setSyncing(false);
  };

  const filteredItems = useMemo(() => 
    contentFilters.filterItems(savedItems, searchQuery, startDate, endDate),
    [savedItems, searchQuery, startDate, endDate]
  );

  const filteredSearches = useMemo(() => 
    contentFilters.filterSearches(savedSearches, searchQuery),
    [savedSearches, searchQuery]
  );

  const deleteItem = async (id: string) => {
    await bookmarkService.removeBookmark(id);
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const deleteSearch = async (id: string) => {
    await bookmarkService.removeSavedSearch(id);
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  };

  return {
    activeTab, setActiveTab,
    loading, syncing,
    startDate, setStartDate,
    endDate, setEndDate,
    searchQuery, setSearchQuery,
    filteredItems, filteredSearches,
    handleSync, deleteItem, deleteSearch
  };
}