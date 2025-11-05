/**
 * LocalStorage utility functions with quota management
 * for GitHub Pages deployment
 */

export const getStorageUsage = () => {
  let totalSize = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  
  return {
    used: totalSize,
    usedKB: Math.round(totalSize / 1024),
    usedMB: (totalSize / 1024 / 1024).toFixed(2),
    percentOfQuota: Math.round((totalSize / (5 * 1024 * 1024)) * 100), // Assuming 5MB quota (Safari)
  };
};

export const canStoreData = (dataSize: number): boolean => {
  const current = getStorageUsage();
  const safariQuota = 5 * 1024 * 1024; // 5MB (Safari's stricter limit)
  
  // Use 90% threshold for safety
  return (current.used + dataSize) < (safariQuota * 0.9);
};

export const clearOldSaveData = () => {
  // Keep only essential data, clear custom avatar if needed
  const essentialKeys = ['legends-player', 'legends-world', 'legends-achievements', 'legends-quests', 'legends-session'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!essentialKeys.some(essential => key.includes(essential))) {
      localStorage.removeItem(key);
      console.log(`Cleared ${key} to free storage space`);
    }
  });
};

export const safeLocalStorageSet = (key: string, value: any): boolean => {
  try {
    const dataString = JSON.stringify(value);
    
    // Check if we have enough space
    if (!canStoreData(dataString.length)) {
      console.warn('Storage quota warning. Attempting cleanup...');
      clearOldSaveData();
      
      // Try again after cleanup
      if (!canStoreData(dataString.length)) {
        console.error('Unable to save. Storage quota exceeded even after cleanup.');
        return false;
      }
    }
    
    localStorage.setItem(key, dataString);
    return true;
  } catch (error: any) {
    if (error.name === 'QuotaExceededError' || error.code === 22 || error.code === 1014) {
      console.error('Storage quota exceeded:', getStorageUsage());
      // Try one last cleanup
      clearOldSaveData();
      
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (retryError) {
        console.error('Failed to save even after cleanup:', retryError);
        return false;
      }
    }
    console.error('LocalStorage error:', error);
    return false;
  }
};

export const safeLocalStorageGet = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};
