'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState('Bengaluru Urban');
  const [language, setLanguage] = useState('English');

  const value = {
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    language,
    setLanguage,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
