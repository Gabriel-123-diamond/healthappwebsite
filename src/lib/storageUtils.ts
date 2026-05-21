/**
 * Type-safe wrapper for localStorage/sessionStorage with expiration support (optional)
 */
export const storageUtils = {
  getStorage(useSession: boolean = false): Storage {
    if (typeof window === 'undefined') return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    } as any;
    return useSession ? sessionStorage : localStorage;
  },

  set<T>(key: string, value: T, useSession: boolean = false): void {
    try {
      this.getStorage(useSession).setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving to ${useSession ? 'session' : 'local'}Storage`, e);
    }
  },

  get<T>(key: string, useSession: boolean = false): T | null {
    try {
      const item = this.getStorage(useSession).getItem(key);
      return item ? JSON.parse(item) as T : null;
    } catch (e) {
      console.error(`Error reading from ${useSession ? 'session' : 'local'}Storage`, e);
      return null;
    }
  },

  remove(key: string, useSession: boolean = false): void {
    this.getStorage(useSession).removeItem(key);
  },

  /**
   * Helper for managing arrays in storage (e.g., bookmarks, history)
   */
  updateList<T extends { id: string | number }>(key: string, item: T, limit: number = 100, useSession: boolean = false): T[] {
    const list = this.get<T[]>(key, useSession) || [];
    const index = list.findIndex(i => i.id === item.id);
    
    if (index !== -1) {
      list[index] = item; // Update existing
    } else {
      list.unshift(item); // Add to start
    }

    const finalList = list.slice(0, limit);
    this.set(key, finalList, useSession);
    return finalList;
  },

  removeFromList<T extends { id: string | number }>(key: string, id: string | number, useSession: boolean = false): T[] {
    const list = this.get<T[]>(key, useSession) || [];
    const filtered = list.filter(i => i.id !== id);
    this.set(key, filtered, useSession);
    return filtered;
  }
};
