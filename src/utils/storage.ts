/**
 * LocalStorage utility functions with versioning and error handling
 */

export const STORAGE_VERSION = 1;
export const STORAGE_KEY_PREFIX = 'tribute-of-grafton:';

export interface StorageData {
  version: number;
  timestamp: string;
  data: any;
}

/**
 * Save data to localStorage with versioning
 */
export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    const storageData: StorageData = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      data,
    };
    
    const fullKey = STORAGE_KEY_PREFIX + key;
    localStorage.setItem(fullKey, JSON.stringify(storageData));
    return true;
  } catch (error) {
    console.error(`Failed to save to storage (key: ${key}):`, error);
    return false;
  }
}

/**
 * Load data from localStorage with version checking
 */
export function loadFromStorage<T>(key: string): T | null {
  try {
    const fullKey = STORAGE_KEY_PREFIX + key;
    const raw = localStorage.getItem(fullKey);
    
    if (!raw) {
      return null;
    }
    
    const storageData: StorageData = JSON.parse(raw);
    
    // Version mismatch handling
    if (storageData.version !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch for ${key}. Expected ${STORAGE_VERSION}, got ${storageData.version}`);
      // In future, call migration function here
      return null;
    }
    
    return storageData.data as T;
  } catch (error) {
    console.error(`Failed to load from storage (key: ${key}):`, error);
    return null;
  }
}

/**
 * Clear specific key from localStorage
 */
export function clearStorage(key: string): void {
  try {
    const fullKey = STORAGE_KEY_PREFIX + key;
    localStorage.removeItem(fullKey);
  } catch (error) {
    console.error(`Failed to clear storage (key: ${key}):`, error);
  }
}

/**
 * Clear all game data from localStorage
 */
export function clearAllStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear all storage:', error);
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = STORAGE_KEY_PREFIX + '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
