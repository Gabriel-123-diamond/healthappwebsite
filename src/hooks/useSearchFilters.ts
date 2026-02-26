import { useState } from 'react';

export type SearchMode = 'medical' | 'herbal' | 'both';
export type FilterFormat = 'all' | 'article' | 'video';

export function useSearchFilters() {
  const [searchMode, setSearchMode] = useState<SearchMode>('both');
  const [executedMode, setExecutedMode] = useState<SearchMode>('both');
  const [displayMode, setDisplayMode] = useState<SearchMode>('both');
  const [filterFormat, setFilterFormat] = useState<FilterFormat>('all');

  const handleSearchComplete = (mode: SearchMode) => {
    setExecutedMode(mode);
    setDisplayMode(mode);
  };

  return {
    searchMode,
    setSearchMode,
    executedMode,
    displayMode,
    setDisplayMode,
    filterFormat,
    setFilterFormat,
    handleSearchComplete
  };
}
