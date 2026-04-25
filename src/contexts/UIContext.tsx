'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type NavType = 'bottom' | 'side';

interface UIContextType {
  navType: NavType;
  setNavType: (type: NavType) => void;
  isSideExpanded: boolean;
  setIsSideExpanded: (expanded: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [navType, setNavTypeState] = useState<NavType>('bottom');
  const [isSideExpanded, setIsSideExpanded] = useState(true);

  useEffect(() => {
    const savedNavType = localStorage.getItem('learnwave-nav-type') as NavType;
    if (savedNavType && (savedNavType === 'bottom' || savedNavType === 'side')) {
      setNavTypeState(savedNavType);
    }
  }, []);

  const setNavType = (type: NavType) => {
    setNavTypeState(type);
    localStorage.setItem('learnwave-nav-type', type);
  };

  return (
    <UIContext.Provider value={{ navType, setNavType, isSideExpanded, setIsSideExpanded }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
