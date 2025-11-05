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
 * Load JSON and import to Dexie
 */
export async function loadFromJSON(): Promise<boolean> {
  try {
    console.log('📂 Loading JSON from /expo_data.json...');
    
    const response = await fetch('/expo_data.json');
    
    if (!response.ok) {
      console.log('ℹ️ No existing JSON file, starting fresh');
      return true;
    }

    const data = await response.json();
    
    if (!data.players || !Array.isArray(data.players)) {
      console.log('ℹ️ Invalid JSON format, starting fresh');
      return true;
    }

    // Clear existing data
    await db.players.clear();

    // Import to Dexie
    if (data.players.length > 0) {
      await db.players.bulkAdd(data.players);
      console.log(`✅ Imported ${data.players.length} players from JSON to Dexie`);
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to load JSON:', error);
    return false;
  }
}

// Backward compatibility - keep old function name
export const loadFromCSV = loadFromJSON;

/**
 * Export Dexie to JSON
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
    
    // Try File System Access API (Chrome/Edge)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: 'expo_data.json',
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
          }]
        });
        
        const writable = await handle.createWritable();
        await writable.write(jsonString);
        await writable.close();
        
        console.log('✅ JSON saved successfully');
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
    a.download = 'expo_data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ JSON downloaded to Downloads folder');
  } catch (error) {
    console.error('❌ Failed to export JSON:', error);
    throw error;
  }
}

// Backward compatibility - keep old function name
export const exportToCSV = exportToJSON;

/**
 * Import JSON file and merge with existing database
 */
export async function importFromJSONFile(file: File): Promise<{ imported: number; skipped: number; errors: string[] }> {
  try {
    console.log('📥 Importing JSON file...');
    
    const fileText = await file.text();
    const jsonData = JSON.parse(fileText);
    
    if (!jsonData.players || !Array.isArray(jsonData.players)) {
      throw new Error('Invalid JSON format: missing players array');
    }
    
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;
    
    // Process each player
    for (const playerData of jsonData.players) {
      try {
        // Check if player already exists by username
        const existing = await db.players
          .where('username')
          .equalsIgnoreCase(playerData.username)
          .first();
        
        if (existing) {
          // Update existing player
          await db.players.update(existing.id!, {
            ...playerData,
            id: existing.id, // Keep the existing ID
          });
          imported++;
          console.log(`✅ Updated player: ${playerData.username}`);
        } else {
          // Add new player
          await db.players.add({
            ...playerData,
            id: undefined, // Let Dexie auto-generate ID
          });
          imported++;
          console.log(`✅ Imported new player: ${playerData.username}`);
        }
      } catch (error) {
        skipped++;
        errors.push(`Failed to import ${playerData.username}: ${error}`);
        console.error(`❌ Error importing ${playerData.username}:`, error);
      }
    }
    
    console.log(`✅ Import complete: ${imported} imported, ${skipped} skipped`);
    return { imported, skipped, errors };
  } catch (error) {
    console.error('❌ Failed to import JSON:', error);
    throw error;
  }
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
