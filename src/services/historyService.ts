export interface SearchHistoryItem {
  id: string;
  query: string;
  mode: string;
  summary?: string;
  timestamp: Date;
}

const MOCK_HISTORY: SearchHistoryItem[] = [
  { id: '1', query: 'headache relief', mode: 'both', summary: 'Combined medical and herbal approaches...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '2', query: 'insomnia', mode: 'herbal', summary: 'Chamomile and Valerian root...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '3', query: 'hypertension diet', mode: 'medical', summary: 'DASH diet and sodium reduction...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
];

export async function getSearchHistory(userId: string, start?: Date, end?: Date): Promise<SearchHistoryItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [...MOCK_HISTORY];
      if (start) data = data.filter(item => item.timestamp >= start);
      if (end) data = data.filter(item => item.timestamp <= end);
      resolve(data);
    }, 500);
  });
}
