import { SavedItem, SavedSearch } from "@/services/bookmarkService";

export const contentFilters = {
  filterItems(items: SavedItem[], query: string, start: string, end: string): SavedItem[] {
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item => {
      // 1. Text Match
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.excerpt.toLowerCase().includes(lowerQuery);
      
      if (!matchesSearch) return false;

      // 2. Date Match
      if (!start && !end) return true;
      
      const itemDate = new Date(item.date === 'Recently' ? new Date() : item.date);
      const startDate = start ? new Date(start) : null;
      const endDate = end ? new Date(end) : null;
      if (endDate) endDate.setHours(23, 59, 59, 999);
      
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      
      return true;
    });
  },

  filterSearches(searches: SavedSearch[], query: string): SavedSearch[] {
    const lowerQuery = query.toLowerCase();
    return searches.filter(search => {
      return !query ||
        search.query.toLowerCase().includes(lowerQuery) ||
        (search.response?.answer || '').toLowerCase().includes(lowerQuery);
    });
  }
};
