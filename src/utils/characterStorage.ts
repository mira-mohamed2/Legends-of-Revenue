/**
 * Character Storage Utility
 * 
 * Handles saving/loading player character data to/from:
 * Documents/Legends of Revenue/Characters/
 * 
 * Supports:
 * - Auto-save to local file system
 * - Export character to JSON file
 * - Import character from JSON file
 * - Multiple character profiles per user
 */

import type { PlayerStats, PlayerEquipment } from '../types/player';
import type { InventorySlot } from '../types/inventory';

export interface CharacterData {
  version: string; // Format version for future compatibility
  username: string;
  lastSaved: string; // ISO timestamp
  stats: PlayerStats;
  equipment: PlayerEquipment;
  inventory: InventorySlot[];
  location: string;
  enemiesKilled: number;
  defeatedEnemyTypes?: string[]; // Track which enemy types have been defeated
  locationsVisited: string[];
  avatar: string;
  customAvatar: string | null;
  achievements: string[]; // Achievement IDs
}

const STORAGE_VERSION = '1.0.0';
const CHARACTERS_FOLDER = 'Legends of Revenue/Characters';

/**
 * Get the full path to the characters folder
 */
function getCharactersPath(): string {
  // For browser environment, we'll use localStorage with a specific prefix
  // In Electron or similar, this could be the actual Documents folder
  return CHARACTERS_FOLDER;
}

/**
 * Generate a safe filename from username
 */
function getSafeFilename(username: string): string {
  return username.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

/**
 * Get the storage key for a character
 */
function getCharacterKey(username: string): string {
  return `character_${getSafeFilename(username)}`;
}

/**
 * Save character data to storage
 */
export function saveCharacter(data: Omit<CharacterData, 'version' | 'lastSaved'>): boolean {
  try {
    const characterData: CharacterData = {
      version: STORAGE_VERSION,
      lastSaved: new Date().toISOString(),
      ...data,
    };

    const key = getCharacterKey(data.username);
    localStorage.setItem(key, JSON.stringify(characterData, null, 2));
    
    console.log(`✅ Character saved: ${data.username} (${getCharactersPath()}/${getSafeFilename(data.username)}.json)`);
    return true;
  } catch (error) {
    console.error('Failed to save character:', error);
    return false;
  }
}

/**
 * Load character data from storage
 */
export function loadCharacter(username: string): CharacterData | null {
  try {
    const key = getCharacterKey(username);
    const data = localStorage.getItem(key);
    
    if (!data) {
      console.log(`No saved character found for: ${username}`);
      return null;
    }

    const characterData: CharacterData = JSON.parse(data);
    
    // Version compatibility check
    if (characterData.version !== STORAGE_VERSION) {
      console.warn(`Character version mismatch: ${characterData.version} (expected ${STORAGE_VERSION})`);
      // Future: Add migration logic here
    }

    console.log(`✅ Character loaded: ${username} (last saved: ${characterData.lastSaved})`);
    return characterData;
  } catch (error) {
    console.error('Failed to load character:', error);
    return null;
  }
}

/**
 * Delete a character from storage
 */
export function deleteCharacter(username: string): boolean {
  try {
    const key = getCharacterKey(username);
    localStorage.removeItem(key);
    console.log(`🗑️ Character deleted: ${username}`);
    return true;
  } catch (error) {
    console.error('Failed to delete character:', error);
    return false;
  }
}

/**
 * List all saved characters
 */
export function listCharacters(): string[] {
  const characters: string[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('character_')) {
        const data = localStorage.getItem(key);
        if (data) {
          const characterData: CharacterData = JSON.parse(data);
          characters.push(characterData.username);
        }
      }
    }
  } catch (error) {
    console.error('Failed to list characters:', error);
  }

  return characters;
}

/**
 * Export character to downloadable JSON file
 */
export function exportCharacter(username: string): void {
  const characterData = loadCharacter(username);
  
  if (!characterData) {
    alert(`Character not found: ${username}`);
    return;
  }

  try {
    const jsonString = JSON.stringify(characterData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getSafeFilename(username)}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log(`📥 Character exported: ${username}`);
  } catch (error) {
    console.error('Failed to export character:', error);
    alert('Failed to export character');
  }
}

/**
 * Import character from JSON file
 * Returns the imported character data or null if failed
 */
export function importCharacter(file: File): Promise<CharacterData | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const characterData: CharacterData = JSON.parse(content);
        
        // Validate required fields
        if (!characterData.username || !characterData.stats || !characterData.inventory) {
          throw new Error('Invalid character file format');
        }
        
        // Check if character already exists
        const existing = loadCharacter(characterData.username);
        if (existing) {
          const overwrite = confirm(
            `Character "${characterData.username}" already exists.\n` +
            `Existing: Level ${existing.stats.level}, Last saved: ${new Date(existing.lastSaved).toLocaleString()}\n` +
            `Import: Level ${characterData.stats.level}, Last saved: ${new Date(characterData.lastSaved).toLocaleString()}\n\n` +
            `Overwrite existing character?`
          );
          
          if (!overwrite) {
            resolve(null);
            return;
          }
        }
        
        // Save the imported character
        const saved = saveCharacter({
          username: characterData.username,
          stats: characterData.stats,
          equipment: characterData.equipment,
          inventory: characterData.inventory,
          location: characterData.location,
          enemiesKilled: characterData.enemiesKilled,
          locationsVisited: characterData.locationsVisited,
          avatar: characterData.avatar,
          customAvatar: characterData.customAvatar,
          achievements: characterData.achievements,
        });
        
        if (saved) {
          console.log(`📤 Character imported: ${characterData.username}`);
          resolve(characterData);
        } else {
          reject(new Error('Failed to save imported character'));
        }
      } catch (error) {
        console.error('Failed to import character:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Get character info without loading full data
 */
export interface CharacterInfo {
  username: string;
  level: number;
  gold: number;
  lastSaved: string;
  location: string;
}

export function getCharacterInfo(username: string): CharacterInfo | null {
  const data = loadCharacter(username);
  if (!data) return null;
  
  return {
    username: data.username,
    level: data.stats.level,
    gold: data.stats.gold,
    lastSaved: data.lastSaved,
    location: data.location,
  };
}

/**
 * Backup all characters to a single file
 */
export function exportAllCharacters(): void {
  const characters = listCharacters();
  
  if (characters.length === 0) {
    alert('No characters to export');
    return;
  }

  try {
    const allData = characters.map(username => loadCharacter(username)).filter(Boolean);
    const jsonString = JSON.stringify({
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      characters: allData,
    }, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `legends_of_revenue_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log(`📥 All characters exported (${characters.length} characters)`);
  } catch (error) {
    console.error('Failed to export all characters:', error);
    alert('Failed to export characters');
  }
}
