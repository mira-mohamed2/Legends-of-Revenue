/**
 * Hybrid Storage System: Dexie (IndexedDB) + JSON
 * 
 * Flow:
 * 1. App starts → Load JSON from /dist/expo_data.json → Import to Dexie
 * 2. Runtime → All operations use Dexie (fast, automatic)
 * 3. Logout/Export → Export Dexie to JSON → Save to /dist folder
 * 
 * Benefits:
 * - Fast queries and updates (Dexie/IndexedDB)
 * - Automatic persistence (no manual saves during gameplay)
 * - Portable data (JSON file travels with app)
 * - Easy backup (JSON is human-readable and preserves structure)
 * - No CSV parsing issues with nested data
 */

import Dexie, { type Table } from 'dexie';
import type { PlayerStats, PlayerEquipment } from '../types/player';
import type { InventorySlot } from '../types/inventory';

// Player data interface
export interface Player {
  id?: number; // Auto-increment primary key
  registrationId: string; // EXPO-XXXXXXXXXX
  username: string; // Unique
  fullName: string;
  phoneNumber: string; // Unique
  email: string;
  timestamp: string; // ISO date
  lastPlayed?: string; // ISO date
  totalGamesPlayed: number;
  highestScore?: number;
  totalScore: number;
  wonPrize: boolean;
  
  // Character data
  characterData?: {
    stats: PlayerStats;
    equipment: PlayerEquipment;
    inventory: InventorySlot[];
    location: string;
    enemiesKilled: number;
    avatar: string;
    customAvatar: string | null;
    
    // World exploration state (per character)
    worldState?: {
      currentTile: string;
      locationProgress: Record<string, number>;
      unlockedLocations: string[];
    };
    
    // Quest progress (per character)
    questState?: {
      quests: any[]; // Quest status and progress
      activeQuest: string | null;
    };
    
    // Question tracking (per character)
    questionHistory?: {
      answeredQuestions: string[]; // Array of question IDs that have been answered
      totalPoints: number; // Points earned from questions
      correctAnswers: number;
      wrongAnswers: number;
    };
    
    // Achievements (per character)
    achievements?: Array<{
      id: string;
      unlocked: boolean;
      unlockedAt?: string;
    }>;
  };
}

// Dexie database class
class ExpoDatabase extends Dexie {
  players!: Table<Player, number>;

  constructor() {
    super('ExpoGameDB');
    
    // Define schema
    this.version(1).stores({
      players: '++id, username, phoneNumber, registrationId, wonPrize, highestScore'
    });
  }
}

// Create database instance
export const db = new ExpoDatabase();

/**
 * Load JSON and import to Dexie (BACKUP ONLY - does not clear existing data)
 * Only used for manual imports via Admin Panel
 */
export async function loadFromJSON(): Promise<boolean> {
  try {
    console.log('📂 Checking for backup JSON at /expo_data.json...');
    
    const response = await fetch('/expo_data.json');
    
    if (!response.ok) {
      console.log('ℹ️ No backup JSON file found - using Dexie database only');
      return true;
    }

    const data = await response.json();
    
    if (!data.players || !Array.isArray(data.players)) {
      console.log('ℹ️ Invalid JSON format in backup file');
      return true;
    }

    console.log(`ℹ️ Found backup JSON with ${data.players.length} players (not auto-importing)`);
    console.log('💡 Use Admin Panel Import to restore from backup if needed');

    return true;
  } catch (error) {
    console.error('❌ Failed to check backup JSON:', error);
    return false;
  }
}

// Backward compatibility - keep old function name
export const loadFromCSV = loadFromJSON;

/**
 * Export Dexie to JSON (with timestamp)
 */
export async function exportToJSON(): Promise<void> {
  try {
    console.log('💾 Exporting Dexie database to JSON...');
    
    const players = await db.players.toArray();
    const jsonData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      players: players.map(player => ({
        ...player,
        id: undefined, // Don't export auto-increment ID
      })),
    };
    
    const jsonString = JSON.stringify(jsonData, null, 2); // Pretty print with 2 spaces
    
    // Generate filename with timestamp
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/:/g, '-')  // Replace colons with dashes
      .replace(/\..+/, '') // Remove milliseconds
      .replace('T', '_');  // Replace T with underscore
    const filename = `expo_data_${timestamp}.json`;
    
    // Try File System Access API (Chrome/Edge)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
          }]
        });
        
        const writable = await handle.createWritable();
        await writable.write(jsonString);
        await writable.close();
        
        console.log(`✅ JSON saved successfully as ${filename}`);
        return;
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          console.error('File System Access API failed:', e);
        }
      }
    }
    
    // Fallback: Download to Downloads folder
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log(`✅ JSON downloaded to Downloads folder as ${filename}`);
  } catch (error) {
    console.error('❌ Failed to export JSON:', error);
    throw error;
  }
}

/**
 * Export to timestamped JSON file (used for logout backups)
 */
export async function exportBothJSONFiles(): Promise<void> {
  try {
    console.log('💾 Exporting timestamped JSON backup...');
    
    const players = await db.players.toArray();
    const jsonData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      players: players.map(player => ({
        ...player,
        id: undefined, // Don't export auto-increment ID
      })),
    };
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Generate timestamp for backup file
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '')
      .replace('T', '_');
    
    // Download timestamped backup to Downloads folder
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expo_data_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`✅ Timestamped backup saved: expo_data_${timestamp}.json`);
  } catch (error) {
    console.error('❌ Failed to export JSON:', error);
    throw error;
  }
}

// Backward compatibility - keep old function name
export const exportToCSV = exportBothJSONFiles;

/**
 * Import multiple JSON files and merge with existing database
 * Smart merging: keeps highest score for each username + phone combination
 */
export async function importFromJSONFiles(files: FileList): Promise<{ imported: number; updated: number; skipped: number; errors: string[] }> {
  try {
    console.log(`📥 Importing ${files.length} JSON file(s)...`);
    
    const errors: string[] = [];
    let imported = 0;
    let updated = 0;
    let skipped = 0;
    
    // Collect all players from all files
    const allPlayers: any[] = [];
    
    // Read all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const fileText = await file.text();
        const jsonData = JSON.parse(fileText);
        
        if (!jsonData.players || !Array.isArray(jsonData.players)) {
          errors.push(`${file.name}: Invalid JSON format - missing players array`);
          continue;
        }
        
        allPlayers.push(...jsonData.players);
        console.log(`✅ Read ${jsonData.players.length} players from ${file.name}`);
      } catch (error) {
        errors.push(`${file.name}: Failed to parse - ${error}`);
        console.error(`❌ Error reading ${file.name}:`, error);
      }
    }
    
    // Group players by username+phone (to find duplicates and keep highest score)
    const playerMap = new Map<string, any>();
    
    for (const playerData of allPlayers) {
      const key = `${playerData.username.toLowerCase()}|${playerData.phoneNumber}`;
      const existing = playerMap.get(key);
      
      if (existing) {
        // Keep the one with highest score
        const existingScore = existing.totalScore || 0;
        const newScore = playerData.totalScore || 0;
        
        if (newScore > existingScore) {
          playerMap.set(key, playerData);
          console.log(`🔄 Replacing ${playerData.username} - higher score: ${newScore} > ${existingScore}`);
        } else {
          console.log(`⏭️ Keeping existing ${playerData.username} - higher score: ${existingScore} >= ${newScore}`);
        }
      } else {
        playerMap.set(key, playerData);
      }
    }
    
    console.log(`📊 Merged down to ${playerMap.size} unique players (by username + phone)`);
    
    // Now process each unique player
    for (const playerData of playerMap.values()) {
      try {
        // Check if player already exists in database by username AND phone
        const cleanPhone = playerData.phoneNumber.replace(/\s+/g, '');
        const existing = await db.players
          .where('username')
          .equalsIgnoreCase(playerData.username)
          .and(p => p.phoneNumber.replace(/\s+/g, '') === cleanPhone)
          .first();
        
        if (existing) {
          // Compare scores - only update if imported score is higher
          const existingScore = existing.totalScore || 0;
          const importScore = playerData.totalScore || 0;
          
          if (importScore > existingScore) {
            await db.players.update(existing.id!, {
              ...playerData,
              id: existing.id, // Keep the existing ID
            });
            updated++;
            console.log(`✅ Updated ${playerData.username} - new score: ${importScore} (was ${existingScore})`);
          } else {
            skipped++;
            console.log(`⏭️ Skipped ${playerData.username} - current score ${existingScore} >= import score ${importScore}`);
          }
        } else {
          // New player - add to database
          await db.players.add({
            ...playerData,
            id: undefined, // Let Dexie auto-generate ID
          });
          imported++;
          console.log(`✅ Imported new player: ${playerData.username} (score: ${playerData.totalScore || 0})`);
        }
      } catch (error) {
        skipped++;
        errors.push(`Failed to process ${playerData.username}: ${error}`);
        console.error(`❌ Error processing ${playerData.username}:`, error);
      }
    }
    
    console.log(`✅ Import complete: ${imported} new, ${updated} updated, ${skipped} skipped`);
    return { imported, updated, skipped, errors };
  } catch (error) {
    console.error('❌ Failed to import JSON files:', error);
    throw error;
  }
}

/**
 * Import single JSON file (for backward compatibility)
 */
export async function importFromJSONFile(file: File): Promise<{ imported: number; skipped: number; errors: string[] }> {
  // Create a proper FileList-like array
  const files = [file];
  const fileList = {
    ...files,
    length: 1,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () { yield* files; }
  } as unknown as FileList;
  
  const result = await importFromJSONFiles(fileList);
  return {
    imported: result.imported + result.updated,
    skipped: result.skipped,
    errors: result.errors
  };
}

/**
 * Find player by username and phone (login)
 */
export async function findPlayer(username: string, phoneNumber: string): Promise<Player | undefined> {
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  return await db.players
    .where('username').equalsIgnoreCase(username)
    .and(p => p.phoneNumber.replace(/\s+/g, '') === cleanPhone)
    .first();
}

/**
 * Find player by phone number
 */
export async function findPlayerByPhone(phoneNumber: string): Promise<Player | undefined> {
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  return await db.players
    .where('phoneNumber').equals(cleanPhone)
    .first();
}

/**
 * Check if username is taken
 */
export async function isUsernameTaken(username: string): Promise<boolean> {
  const count = await db.players
    .where('username').equalsIgnoreCase(username)
    .count();
  return count > 0;
}

/**
 * Add new player
 */
export async function addPlayer(player: Omit<Player, 'id'>): Promise<number> {
  try {
    const id = await db.players.add(player);
    console.log(`✅ Added player: ${player.username} (ID: ${id})`);
    return id;
  } catch (error) {
    console.error('Failed to add player:', error);
    throw error;
  }
}

/**
 * Update player by username
 */
export async function updatePlayer(username: string, updates: Partial<Player>): Promise<boolean> {
  try {
    const player = await db.players.where('username').equalsIgnoreCase(username).first();
    if (!player || !player.id) return false;
    
    await db.players.update(player.id, updates);
    console.log(`✅ Updated player: ${username}`);
    return true;
  } catch (error) {
    console.error('Failed to update player:', error);
    return false;
  }
}

/**
 * Update character data for a player
 */
export async function updateCharacterData(
  username: string,
  characterData: Player['characterData']
): Promise<boolean> {
  return await updatePlayer(username, { characterData });
}

/**
 * Record game session
 */
export async function recordSession(
  username: string,
  _score: number, // Not used - kept for API compatibility
  wonPrize: boolean
): Promise<void> {
  const player = await db.players.where('username').equalsIgnoreCase(username).first();
  if (!player || !player.id) return;

  // Use question points as the score (from questionHistory)
  const questionPoints = player.characterData?.questionHistory?.totalPoints || 0;

  const updates: Partial<Player> = {
    lastPlayed: new Date().toISOString(),
    totalGamesPlayed: (player.totalGamesPlayed || 0) + 1,
    totalScore: questionPoints, // Changed: Use question points instead of combat score
  };

  if (!player.highestScore || questionPoints > player.highestScore) {
    updates.highestScore = questionPoints; // Changed: Use question points
  }

  if (wonPrize) {
    updates.wonPrize = true;
  }

  await db.players.update(player.id, updates);
}

/**
 * Update question history for a character
 */
export async function updateQuestionHistory(
  username: string,
  questionHistory: {
    answeredQuestions: string[];
    totalPoints: number;
    correctAnswers: number;
    wrongAnswers: number;
  }
): Promise<void> {
  const player = await db.players.where('username').equalsIgnoreCase(username).first();
  if (!player || !player.id || !player.characterData) return;

  // Simply replace with the provided history (no merging, to avoid race conditions)
  await db.players.update(player.id, {
    characterData: {
      ...player.characterData,
      questionHistory,
    },
  });
}

/**
 * Update achievements for a character
 */
export async function updateAchievements(
  username: string,
  achievements: Array<{ id: string; unlocked: boolean; unlockedAt?: string }>
): Promise<void> {
  const player = await db.players.where('username').equalsIgnoreCase(username).first();
  if (!player || !player.id || !player.characterData) return;

  await db.players.update(player.id, {
    characterData: {
      ...player.characterData,
      achievements,
    },
  });
}

/**
 * Get all players
 */
export async function getAllPlayers(): Promise<Player[]> {
  return await db.players.toArray();
}

/**
 * Get statistics
 */
export async function getStatistics() {
  const players = await db.players.toArray();
  
  return {
    totalPlayers: players.length,
    winners: players.filter(p => p.wonPrize).length,
    totalGamesPlayed: players.reduce((sum, p) => sum + (p.totalGamesPlayed || 0), 0),
    highestScore: players.reduce((max, p) => Math.max(max, p.highestScore || 0), 0),
  };
}

/**
 * Clear all data
 */
export async function clearAllData(): Promise<void> {
  await db.players.clear();
  console.log('✅ All data cleared from Dexie');
}

/**
 * Auto-export to CSV (call this periodically or on logout)
 */
export async function autoExportCSV(): Promise<void> {
  try {
    await exportToCSV();
  } catch (error) {
    console.error('Auto-export failed:', error);
  }
}
