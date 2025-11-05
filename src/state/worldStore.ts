import { create } from 'zustand';
import type { MapTile } from '../types/map';
import type { Enemy, EncounterState } from '../types/combat';
import type { GameMode } from '../types/ui';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { generateEnemyStats, calculateRewardMultiplier } from '../utils/enemyStats';
import mapData from '../data/maps.json';
import enemyData from '../data/enemies.json';

interface WorldState {
  currentTile: string;
  mapData: MapTile[];
  encounterState: EncounterState | null;
  gameMode: GameMode;
  combatLog: string[];
  locationProgress: Record<string, number>; // Track steps per location
  unlockedLocations: string[]; // Locations that can be visited
  
  // Actions
  moveTo: (tileId: string) => void;
  takeStep: () => void;
  rollEncounter: () => void;
  startEncounter: (enemyId: string) => void;
  endEncounter: (victory: boolean) => void;
  setGameMode: (mode: GameMode) => void;
  addCombatLog: (message: string) => void;
  clearCombatLog: () => void;
  getCurrentTile: () => MapTile | undefined;
  getLocationProgress: (tileId: string) => number;
  isLocationUnlocked: (tileId: string) => boolean;
  saveWorld: () => void;
  loadWorld: (username: string) => boolean;
  resetWorld: () => void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  currentTile: 'guild-hall', // Start at Guild Hall
  mapData: mapData as MapTile[],
  encounterState: null,
  gameMode: 'explore',
  combatLog: [],
  locationProgress: { 'guild-hall': 100 }, // MIRA HQ starts fully explored
  unlockedLocations: ['guild-hall', 'merchants-row', 'city-gates', 'miras-palace'], // Business District unlocked as MIRA HQ is fully explored
  
  moveTo: (tileId) => {
    const tile = get().mapData.find(t => t.id === tileId);
    
    if (!tile) {
      console.error(`Tile ${tileId} not found`);
      return;
    }
    
    set({ currentTile: tileId });
    
    // Add to unlocked locations if not already there
    const { unlockedLocations } = get();
    if (!unlockedLocations.includes(tileId)) {
      set({ unlockedLocations: [...unlockedLocations, tileId] });
    }
    
    get().saveWorld();
  },
  
  takeStep: () => {
    const { currentTile, locationProgress } = get();
    const currentProgress = locationProgress[currentTile] || 0;
    
    // Increment progress
    const newProgress = currentProgress + 1;
    set({
      locationProgress: {
        ...locationProgress,
        [currentTile]: newProgress,
      },
    });
    
    // Unlock neighbors if reached 10 steps
    if (newProgress >= 10) {
      const tile = get().getCurrentTile();
      if (tile) {
        const { unlockedLocations } = get();
        const newUnlocked = [...unlockedLocations];
        
        tile.neighbors.forEach((neighborId: string) => {
          if (!newUnlocked.includes(neighborId)) {
            newUnlocked.push(neighborId);
          }
        });
        
        set({ unlockedLocations: newUnlocked });
      }
    }
    
    get().saveWorld();
    
    // Roll for encounter after taking step
    get().rollEncounter();
  },
  
  rollEncounter: () => {
    const { currentTile, mapData } = get();
    const tile = mapData.find(t => t.id === currentTile);
    
    if (!tile || tile.encounterRate === 0) return;
    
    // Random roll
    if (Math.random() < tile.encounterRate) {
      // Select enemy from encounter table
      const totalWeight = tile.encounterTable.reduce((sum: number, entry) => sum + entry.weight, 0);
      let roll = Math.random() * totalWeight;
      
      for (const entry of tile.encounterTable) {
        roll -= entry.weight;
        if (roll <= 0) {
          get().startEncounter(entry.enemyId);
          break;
        }
      }
    }
  },
  
  startEncounter: (enemyId) => {
    const enemyTemplate = (enemyData as any[]).find(e => e.id === enemyId);
    
    if (!enemyTemplate) {
      console.error(`Enemy ${enemyId} not found`);
      return;
    }

    // Generate random stats from stat ranges
    const stats = enemyTemplate.statRanges 
      ? generateEnemyStats(enemyTemplate.statRanges)
      : enemyTemplate.stats; // Fallback to fixed stats if no ranges defined

    // Calculate reward multiplier based on generated stats
    const rewardMultiplier = enemyTemplate.statRanges
      ? calculateRewardMultiplier(stats, enemyTemplate.statRanges)
      : 1.0;

    // Create enemy with generated stats
    const enemy: Enemy = {
      ...enemyTemplate,
      stats,
      statRanges: enemyTemplate.statRanges, // Keep ranges for UI display
    };
    
    const encounterState: EncounterState = {
      enemy,
      playerTurn: true,
      turnCount: 0,
      rewardMultiplier,
    };
    
    set({
      encounterState,
      gameMode: 'combat',
      combatLog: [`You encountered a ${enemy.name}!`],
    });
  },
  
  endEncounter: (victory) => {
    if (victory) {
      get().addCombatLog('Victory!');
    } else {
      get().addCombatLog('Defeat...');
    }
    
    setTimeout(() => {
      set({
        encounterState: null,
        gameMode: 'explore',
      });
    }, 2000);
  },
  
  setGameMode: (mode) => {
    set({ gameMode: mode });
  },
  
  addCombatLog: (message) => {
    set((state) => ({
      combatLog: [...state.combatLog, message],
    }));
  },
  
  clearCombatLog: () => {
    set({ combatLog: [] });
  },
  
  getCurrentTile: () => {
    const { currentTile, mapData } = get();
    return mapData.find(t => t.id === currentTile);
  },
  
  getLocationProgress: (tileId) => {
    const { locationProgress } = get();
    return locationProgress[tileId] || 0;
  },
  
  isLocationUnlocked: (tileId) => {
    const { unlockedLocations } = get();
    return unlockedLocations.includes(tileId);
  },
  
  saveWorld: () => {
    const { currentTile, locationProgress, unlockedLocations } = get();
    const username = (window as any).__currentUsername;
    
    if (!username) return;
    
    saveToStorage(`world:${username}`, {
      currentTile,
      locationProgress,
      unlockedLocations,
    });
  },
  
  loadWorld: (username) => {
    const data = loadFromStorage<{
      currentTile?: string;
      locationProgress?: Record<string, number>;
      unlockedLocations?: string[];
    }>(`world:${username}`);
    
    if (!data) {
      return false;
    }
    
    set({
      currentTile: data.currentTile || 'guild-hall',
      locationProgress: data.locationProgress || { 'guild-hall': 100 },
      unlockedLocations: data.unlockedLocations || ['guild-hall', 'merchants-row', 'city-gates', 'miras-palace'],
    });
    
    return true;
  },
  
  resetWorld: () => {
    set({
      currentTile: 'guild-hall',
      locationProgress: { 'guild-hall': 100 },
      unlockedLocations: ['guild-hall', 'merchants-row', 'city-gates', 'miras-palace'],
      encounterState: null,
      gameMode: 'explore',
      combatLog: [],
    });
  },
}));
