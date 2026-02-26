export interface SearchHistoryItem {
  id: string;
  query: string;
  mode: string;
  summary?: string;
  timestamp: Date;
}
