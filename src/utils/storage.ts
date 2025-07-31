import { AppData } from '../App';

// IndexedDB wrapper for Family Flow data
class FamilyFlowStorage {
  private dbName = 'FamilyFlowDB';
  private dbVersion = 1;
  private storeName = 'familyData';
  private db: IDBDatabase | null = null;

  // Initialize IndexedDB
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store for family data
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  // Get family data (async version of localStorage.getItem)
  async getFamilyData(): Promise<AppData | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get('familyFlowData');

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Save family data (async version of localStorage.setItem)
  async saveFamilyData(data: AppData): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const familyDataRecord = {
        id: 'familyFlowData',
        type: 'appData',
        data: data,
        lastUpdated: new Date().toISOString()
      };

      const request = store.put(familyDataRecord);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Migrate data from localStorage to IndexedDB
  async migrateFromLocalStorage(): Promise<void> {
    const localStorageData = localStorage.getItem('familyFlowData');
    
    if (localStorageData) {
      try {
        const parsedData = JSON.parse(localStorageData);
        await this.saveFamilyData(parsedData);
        
        console.log('✅ Successfully migrated family data from localStorage to IndexedDB');
        
        // Keep localStorage data for safety during transition
        // Can be removed later after migration is confirmed stable
      } catch (error) {
        console.error('❌ Failed to migrate localStorage data:', error);
        throw error;
      }
    }
  }

  // Clear all family data
  async clearFamilyData(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Fallback to localStorage if IndexedDB fails
  getFallbackData(): AppData | null {
    const localData = localStorage.getItem('familyFlowData');
    return localData ? JSON.parse(localData) : null;
  }

  saveFallbackData(data: AppData): void {
    localStorage.setItem('familyFlowData', JSON.stringify(data));
  }
}

// Export singleton instance
export const familyFlowStorage = new FamilyFlowStorage();