// hooks/useTranslation.ts
'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/context/app-state-provider';
import en from '@/locales/en.json';
import ta from '@/locales/ta.json';
import hi from '@/locales/hi.json';
import te from '@/locales/te.json';
import ml from '@/locales/ml.json';

const translations: Record<string, Record<string, string>> = {
  English: en,
  Tamil: ta,
  Hindi: hi,
  Telugu: te,
  Malayalam: ml,
};

export function useTranslation() {
  const { language } = useAppState();
  const [t, setT] = useState(() => (key: string) => {
    const langFile = translations[language] || en;
    return langFile[key] || key;
  });

  useEffect(() => {
    const langFile = translations[language] || en;
    setT(() => (key: string) => langFile[key] || key);
  }, [language]);

  return { t };
}
