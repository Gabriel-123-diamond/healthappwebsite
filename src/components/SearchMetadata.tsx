'use client';

import React from 'react';
import { ConfidenceScore } from './search/ConfidenceScore';
import { RegionalContext } from './search/RegionalContext';
import { AIResponse } from '@/services/aiService';

interface SearchMetadataProps {
  response: AIResponse;
}

export const SearchMetadata: React.FC<SearchMetadataProps> = ({ response }) => {
  return (
    <>
      {response.confidenceScore && (
        <div className="p-5 sm:p-8 pb-0">
          <ConfidenceScore score={response.confidenceScore} explanation={response.explanation} />
        </div>
      )}

      {response.regionalContext && (
        <RegionalContext 
          region={response.regionalContext.region} 
          insight={response.regionalContext.insight} 
        />
      )}
    </>
  );
};
