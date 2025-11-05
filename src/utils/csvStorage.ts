/**
 * CSV-Based Storage System
 * 
 * Stores ALL game data in a CSV file in the dist folder:
 * - Registration data (username, phone, email)
 * - Session tracking (games played, scores)
 * - Character data (gold, items, inventory, level, etc.)
 * 
 * Flow:
 * 1. App loads → Read CSV from /dist/expo_data.csv
 * 2. Player plays → Data kept in memory (fast)
 * 3. Player logs out → Write all data back to CSV
 */

import type { PlayerRegistration } from './registrationUtils';
import type { PlayerStats, PlayerEquipment } from '../types/player';
import type { InventorySlot } from '../types/inventory';

export interface ExpoPlayerData extends PlayerRegistration {
  // Character game data
  characterData?: {
    stats: PlayerStats;
    equipment: PlayerEquipment;
    inventory: InventorySlot[];
    location: string;
    enemiesKilled: number;
    avatar: string;
    customAvatar: string | null;
  };
}

// In-memory cache of all player data
let playerDatabase: ExpoPlayerData[] = [];
let isLoaded = false;

const CSV_FILE_PATH = '/expo_data.csv';

/**
 * Load CSV data from dist folder
 */
export async function loadCSVData(): Promise<boolean> {
  try {
    const response = await fetch(CSV_FILE_PATH);
    
    if (!response.ok) {
      console.log('No existing CSV file found, will create new one');
      playerDatabase = [];
      isLoaded = true;
      return true;
    }

    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length <= 1) {
      // Empty or header-only file
      playerDatabase = [];
      isLoaded = true;
      return true;
    }

    // Parse CSV (skip header)
    playerDatabase = [];
    for (let i = 1; i < lines.length; i++) {
      const player = parseCSVLine(lines[i]);
      if (player) {
        playerDatabase.push(player);
      }
    }

    console.log(`✅ Loaded ${playerDatabase.length} players from CSV`);
    isLoaded = true;
    return true;
  } catch (error) {
    console.error('Failed to load CSV:', error);
    playerDatabase = [];
    isLoaded = true;
    return false;
  }
}

/**
 * Parse a single CSV line into player data
 */
function parseCSVLine(line: string): ExpoPlayerData | null {
  try {
    // CSV format: "field1","field2","field3",...
    const fields = line.match(/("(?:[^"]|"")*"|[^,]*)/g)?.map(field => 
      field.replace(/^"|"$/g, '').replace(/""/g, '"')
    ) || [];

    if (fields.length < 11) return null;

    const player: ExpoPlayerData = {
      registrationId: fields[0],
      username: fields[1],
      fullName: fields[2],
      phoneNumber: fields[3],
      email: fields[4],
      timestamp: fields[5],
      lastPlayed: fields[6] || undefined,
      totalGamesPlayed: parseInt(fields[7]) || 0,
      highestScore: parseInt(fields[8]) || undefined,
      totalScore: parseInt(fields[9]) || 0,
      wonPrize: fields[10] === 'YES',
    };

    // Parse character data if present (field 11)
    if (fields[11]) {
      try {
        player.characterData = JSON.parse(fields[11]);
      } catch {
        console.warn(`Failed to parse character data for ${player.username}`);
      }
    }

    return player;
  } catch (error) {
    console.error('Failed to parse CSV line:', error);
    return null;
  }
}

/**
 * Save all data back to CSV file in dist folder
 */
export async function saveCSVData(): Promise<boolean> {
  try {
    const csvContent = generateCSVContent();
    
    // Try to save using File System Access API (Chrome/Edge)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: 'expo_data.csv',
          startIn: 'downloads',
          types: [{
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] },
          }],
        });
        
        const writable = await handle.createWritable();
        await writable.write(csvContent);
        await writable.close();
        
        console.log('✅ CSV saved via File System Access API');
        alert('📁 Please save this file as "expo_data.csv" in your dist folder\n\nThen refresh the page.');
        return true;
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return false;
        }
        console.warn('File System Access API failed, falling back to download');
      }
    }

    // Fallback: Download to Downloads folder
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'expo_data.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📥 CSV downloaded - Please move to dist folder');
    alert('📁 CSV file downloaded!\n\n⚠️ IMPORTANT: Move "expo_data.csv" to your dist folder\nThen refresh the page.');
    
    return true;
  } catch (error) {
    console.error('Failed to save CSV:', error);
    return false;
  }
}

/**
 * Generate CSV content from player database
 */
function generateCSVContent(): string {
  const headers = [
    'Registration ID',
    'Username',
    'Full Name',
    'Phone Number',
    'Email',
    'Registration Time',
    'Last Played',
    'Games Played',
    'Highest Score',
    'Total Score',
    'Won Prize',
    'Character Data (JSON)'
  ];

  const rows = playerDatabase.map(player => [
    player.registrationId,
    player.username,
    player.fullName,
    player.phoneNumber,
    player.email,
    player.timestamp,
    player.lastPlayed || '',
    player.totalGamesPlayed.toString(),
    (player.highestScore || 0).toString(),
    player.totalScore.toString(),
    player.wonPrize ? 'YES' : 'NO',
    player.characterData ? JSON.stringify(player.characterData) : ''
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}

/**
 * Get all players
 */
export function getAllPlayers(): ExpoPlayerData[] {
  return [...playerDatabase];
}

/**
 * Find player by username and phone (login)
 */
export function findPlayer(username: string, phoneNumber: string): ExpoPlayerData | null {
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  return playerDatabase.find(
    p => 
      p.username.toLowerCase() === username.toLowerCase() &&
      p.phoneNumber.replace(/\s+/g, '') === cleanPhone
  ) || null;
}

/**
 * Find player by phone
 */
export function findPlayerByPhone(phoneNumber: string): ExpoPlayerData | null {
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  return playerDatabase.find(
    p => p.phoneNumber.replace(/\s+/g, '') === cleanPhone
  ) || null;
}

/**
 * Check if username is taken
 */
export function isUsernameTaken(username: string, excludePhone?: string): boolean {
  return playerDatabase.some(p => {
    const isMatch = p.username.toLowerCase() === username.toLowerCase();
    if (excludePhone) {
      return isMatch && p.phoneNumber.replace(/\s+/g, '') !== excludePhone.replace(/\s+/g, '');
    }
    return isMatch;
  });
}

/**
 * Add new player
 */
export function addPlayer(player: ExpoPlayerData): boolean {
  try {
    playerDatabase.push(player);
    console.log(`✅ Added player: ${player.username}`);
    return true;
  } catch (error) {
    console.error('Failed to add player:', error);
    return false;
  }
}

/**
 * Update existing player
 */
export function updatePlayer(username: string, updates: Partial<ExpoPlayerData>): boolean {
  try {
    const index = playerDatabase.findIndex(
      p => p.username.toLowerCase() === username.toLowerCase()
    );
    
    if (index === -1) {
      console.error(`Player not found: ${username}`);
      return false;
    }
    
    playerDatabase[index] = { ...playerDatabase[index], ...updates };
    console.log(`✅ Updated player: ${username}`);
    return true;
  } catch (error) {
    console.error('Failed to update player:', error);
    return false;
  }
}

/**
 * Update player's character data (gold, items, etc.)
 */
export function updateCharacterData(
  username: string, 
  characterData: ExpoPlayerData['characterData']
): boolean {
  return updatePlayer(username, { characterData });
}

/**
 * Record game session
 */
export function recordSession(username: string, score: number, wonPrize: boolean): boolean {
  const player = playerDatabase.find(p => p.username.toLowerCase() === username.toLowerCase());
  
  if (!player) return false;
  
  player.lastPlayed = new Date().toISOString();
  player.totalGamesPlayed = (player.totalGamesPlayed || 0) + 1;
  player.totalScore = (player.totalScore || 0) + score;
  player.highestScore = Math.max(player.highestScore || 0, score);
  
  if (wonPrize) {
    player.wonPrize = true;
  }
  
  console.log(`✅ Session recorded for ${username}: Score ${score}, Games: ${player.totalGamesPlayed}`);
  return true;
}

/**
 * Clear all data (admin only)
 */
export function clearAllData(): boolean {
  if (confirm('⚠️ WARNING: This will delete ALL player data!\n\nAre you sure?')) {
    if (confirm('⚠️ FINAL WARNING: This cannot be undone!\n\nContinue?')) {
      playerDatabase = [];
      console.log('🗑️ All data cleared');
      return true;
    }
  }
  return false;
}

/**
 * Check if data is loaded
 */
export function isDataLoaded(): boolean {
  return isLoaded;
}

/**
 * Get statistics
 */
export function getStatistics() {
  return {
    totalPlayers: playerDatabase.length,
    winners: playerDatabase.filter(p => p.wonPrize).length,
    totalGamesPlayed: playerDatabase.reduce((sum, p) => sum + (p.totalGamesPlayed || 0), 0),
    highestScore: playerDatabase.reduce((max, p) => Math.max(max, p.highestScore || 0), 0),
  };
}
