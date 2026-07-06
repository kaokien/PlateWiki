'use client';
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { safeStorage } from '../utils/safeStorage';

interface StanceContextValue {
  stance: string;
  toggleStance: () => void;
  setStance: (stance: string) => void;
  isSouthpaw: boolean;
}

const StanceContext = createContext<StanceContextValue>({} as StanceContextValue);

export const useStance = () => useContext(StanceContext);

export const StanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [stance, setStance] = useState('orthodox'); // 'orthodox' or 'southpaw'

  // Load from storage on mount
  useEffect(() => {
    try {
      const saved = safeStorage.getItem('FoodWiki_stance');
      if (saved === 'southpaw') {
        setStance('southpaw');
      }
    } catch (e) {
      console.warn('Storage not available');
    }
  }, []);

  const toggleStance = useCallback(() => {
    setStance(prev => {
      const newStance = prev === 'orthodox' ? 'southpaw' : 'orthodox';
      try {
        safeStorage.setItem('FoodWiki_stance', newStance);
      } catch (e) {
        // ignore
      }
      return newStance;
    });
  }, []);

  const handleSetStance = useCallback((newStance: string) => {
    setStance(newStance);
    try {
      safeStorage.setItem('FoodWiki_stance', newStance);
    } catch (e) {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({
    stance,
    toggleStance,
    setStance: handleSetStance,
    isSouthpaw: stance === 'southpaw',
  }), [stance, toggleStance, handleSetStance]);

  return (
    <StanceContext.Provider value={value}>
      {children}
    </StanceContext.Provider>
  );
};
