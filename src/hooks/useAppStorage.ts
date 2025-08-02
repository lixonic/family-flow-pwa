import { useEffect, useState, useCallback } from 'react';
import { AppData } from '../App';
import { familyFlowStorage } from '../utils/storage';

interface UseAppStorageReturn {
  isStorageReady: boolean;
  loadData: () => Promise<AppData | null>;
  saveData: (data: AppData) => Promise<void>;
  clearData: () => Promise<void>;
  storageError: string | null;
  isLoading: boolean;
}

export function useAppStorage(): UseAppStorageReturn {
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize storage on mount
  useEffect(() => {
    const initStorage = async () => {
      try {
        await familyFlowStorage.init();
        
        // Migrate any existing localStorage data
        await familyFlowStorage.migrateFromLocalStorage();
        
        setIsStorageReady(true);
        setStorageError(null);
      } catch (error) {
        console.error('Storage initialization failed:', error);
        setStorageError('Storage initialization failed - using fallback');
        setIsStorageReady(true); // Still allow app to work with localStorage fallback
      }
    };

    initStorage();
  }, []);

  const loadData = useCallback(async (): Promise<AppData | null> => {
    setIsLoading(true);
    try {
      // Try IndexedDB first
      const data = await familyFlowStorage.getFamilyData();
      return data;
    } catch (error) {
      console.warn('IndexedDB load failed, using localStorage fallback:', error);
      // Fallback to localStorage
      return familyFlowStorage.getFallbackData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveData = useCallback(async (data: AppData): Promise<void> => {
    try {
      // Save to IndexedDB (async, non-blocking)
      await familyFlowStorage.saveFamilyData(data);
      
      // Also save to localStorage as backup during transition period
      familyFlowStorage.saveFallbackData(data);
    } catch (error) {
      console.warn('IndexedDB save failed, using localStorage fallback:', error);
      // Fallback to localStorage only
      familyFlowStorage.saveFallbackData(data);
    }
  }, []);

  const clearData = useCallback(async (): Promise<void> => {
    try {
      // Clear IndexedDB
      await familyFlowStorage.clearFamilyData();
      
      // Also clear localStorage
      localStorage.removeItem('familyFlowData');
      localStorage.removeItem('familyFlowWelcomeShown');
      localStorage.removeItem('familyFlowStartDate');
    } catch (error) {
      console.warn('IndexedDB clear failed, clearing localStorage only:', error);
      // Fallback to localStorage clear
      localStorage.removeItem('familyFlowData');
      localStorage.removeItem('familyFlowWelcomeShown');
      localStorage.removeItem('familyFlowStartDate');
    }
  }, []);

  return {
    isStorageReady,
    loadData,
    saveData,
    clearData,
    storageError,
    isLoading
  };
}