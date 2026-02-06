/**
 * Type-safe wrapper for localStorage with expiration support (optional)
 */
export const storageUtils = {
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  /**
   * Helper for managing arrays in localStorage (e.g., bookmarks, history)
   */
  updateList<T extends { id: string | number }>(key: string, item: T, limit: number = 100): T[] {
    const list = this.get<T[]>(key) || [];
    const index = list.findIndex(i => i.id === item.id);
    
    if (index !== -1) {
      list[index] = item; // Update existing
    } else {
      list.unshift(item); // Add to start
    }

    const finalList = list.slice(0, limit);
    this.set(key, finalList);
    return finalList;
  },

  removeFromList<T extends { id: string | number }>(key: string, id: string | number): T[] {
    const list = this.get<T[]>(key) || [];
    const filtered = list.filter(i => i.id !== id);
    this.set(key, filtered);
    return filtered;
  }
};
