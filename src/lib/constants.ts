export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  FEED_ITEMS: 'feed_items',
  EXPERTS: 'experts',
  BOOKMARKS: 'bookmarks',
  HISTORY: 'searchHistory', // Matches mobile's unified name
  SAVED_SEARCHES: 'saved_searches',
  LEARNING_PATHS: 'learningPaths',
  LEARNING_PROGRESS: 'learning_progress',
} as const;

export const STORAGE_KEYS = {
  BOOKMARKS: 'ikike_bookmarks',
  SAVED_SEARCHES: 'ikike_saved_searches',
  SEARCH_HISTORY_PREFIX: 'ikike_search_',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
