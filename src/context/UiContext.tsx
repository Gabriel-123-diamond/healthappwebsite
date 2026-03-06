'use client';

import React, { createContext, useContext, useState } from 'react';

interface UiContextType {
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <UiContext.Provider value={{ isChatbotOpen, setIsChatbotOpen }}>
      {children}
    </UiContext.Provider>
  );
}

export function useUi() {
  const context = useContext(UiContext);
  if (context === undefined) {
    throw new Error('useUi must be used within a UiProvider');
  }
  return context;
}
