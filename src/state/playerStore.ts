import { create } from 'zustand';
import type { PlayerStats, PlayerEquipment } from '../types/player';
import type { InventorySlot } from '../types/inventory';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { saveCharacter, loadCharacter } from '../utils/characterStorage';
import { useAchievementStore } from './achievementStore';
import itemsData from '../data/items.json';

interface PlayerState {
  stats: PlayerStats;
  equipment: PlayerEquipment;
  inventory: InventorySlot[];
  location: string;
  enemiesKilled: number;
  defeatedEnemyTypes: Set<string>; // Track which enemy types have been defeated at least once
  locationsVisited: Set<string>;
  avatar: string; // Avatar image path
  customAvatar: string | null; // Custom uploaded avatar URL
  
  // Actions
  updateStats: (newStats: Partial<PlayerStats>) => void;
  gainXP: (amount: number) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  handleDeath: () => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  useItem: (itemId: string) => boolean; // Returns true if item was successfully used
  equipItem: (itemId: string, slot: keyof PlayerEquipment) => void;
  unequipItem: (slot: keyof PlayerEquipment) => void;
  setLocation: (tileId: string) => void;
  incrementEnemiesKilled: () => void;
  recordEnemyDefeated: (enemyId: string) => void; // Track specific enemy type defeated
  checkAchievements: () => void;
  setAvatar: (avatarPath: string) => void;
  setCustomAvatar: (imageUrl: string | null) => void;
  initializePlayer: (username: string) => void;
  savePlayer: () => void;
  loadPlayer: (username: string) => boolean;
  resetPlayer: () => void;
}

const DEFAULT_STATS: PlayerStats = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  hp: 50,
  maxHp: 50,
  attack: 5,
  defense: 3,
  gold: 50,
};

const DEFAULT_EQUIPMENT: PlayerEquipment = {
  weapon: null,
  armor: null,
  accessory: null,
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  stats: {
    ...DEFAULT_STATS,
    hp: 300,
    maxHp: 300,
  },
  equipment: DEFAULT_EQUIPMENT,
  inventory: [],
  location: 'guild-hall', // Start at Guild Hall
  enemiesKilled: 0,
  defeatedEnemyTypes: new Set<string>(),
  locationsVisited: new Set(['guild-hall']),
  avatar: '/images/avatars/male-ta-default.jpg', // Default avatar - Male MIRA Agent
  customAvatar: null,
  
  updateStats: (newStats) => {
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    }));
    get().savePlayer();
  },
  
  gainXP: (amount) => {
    set((state) => {
      const newXP = state.stats.xp + amount;
      let { level, xpToNext, maxHp, attack, defense, hp } = state.stats;
      
      // Level cap check
      if (level >= 10) {
        return {
          stats: { 
            ...state.stats, 
            xp: state.stats.xpToNext, // Cap XP at max for level 10
          },
        };
      }
      
      // Level up logic
      if (newXP >= xpToNext) {
        level += 1;
        const overflow = newXP - xpToNext;
        xpToNext = Math.floor(xpToNext * 1.5);
        
        // Stat increases
        maxHp += 10;
        attack += 2;
        defense += 1;
        hp = maxHp; // Full heal on level up
        
        // If we just hit level 10, cap the XP
        const finalXP = level >= 10 ? xpToNext : overflow;
        
        return {
          stats: {
            ...state.stats,
            level,
            xp: finalXP,
            xpToNext,
            maxHp,
            attack,
            defense,
            hp,
          },
        };
      }
      
      return {
        stats: { ...state.stats, xp: newXP },
      };
    });
    get().checkAchievements();
    get().savePlayer();
  },
  
  takeDamage: (amount) => {
    set((state) => ({
      stats: {
        ...state.stats,
        hp: Math.max(0, state.stats.hp - amount),
      },
    }));
    get().savePlayer();
  },
  
  heal: (amount) => {
    set((state) => ({
      stats: {
        ...state.stats,
        hp: Math.min(state.stats.maxHp, state.stats.hp + amount),
      },
    }));
    get().savePlayer();
  },
  
  handleDeath: () => {
    set((state) => {
      const { level, xp } = state.stats;
      
      // Calculate XP loss: 10% of current level's XP requirement
      const xpLoss = Math.floor(state.stats.xpToNext * 0.1 * level);
      const newXP = Math.max(0, xp - xpLoss);
      
      return {
        stats: {
          ...state.stats,
          hp: state.stats.maxHp, // Restore full HP
          xp: newXP,
        },
        location: 'guild-hall', // Return to Guild Hall
      };
    });
    get().savePlayer();
  },
  
  addGold: (amount) => {
    set((state) => ({
      stats: {
        ...state.stats,
        gold: state.stats.gold + amount,
      },
    }));
    get().checkAchievements();
    get().savePlayer();
  },
  
  spendGold: (amount) => {
    const { stats } = get();
    if (stats.gold < amount) {
      return false;
    }
    
    set((state) => ({
      stats: {
        ...state.stats,
        gold: state.stats.gold - amount,
      },
    }));
    get().savePlayer();
    return true;
  },
  
  addItem: (itemId, quantity = 1) => {
    set((state) => {
      const existing = state.inventory.find(slot => slot.itemId === itemId);
      
      if (existing) {
        return {
          inventory: state.inventory.map(slot =>
            slot.itemId === itemId
              ? { ...slot, quantity: slot.quantity + quantity }
              : slot
          ),
        };
      }
      
      return {
        inventory: [...state.inventory, { itemId, quantity }],
      };
    });
    get().checkAchievements();
    get().savePlayer();
  },
  
  removeItem: (itemId, quantity = 1) => {
    set((state) => {
      const existing = state.inventory.find(slot => slot.itemId === itemId);
      
      if (!existing) return state;
      
      if (existing.quantity <= quantity) {
        return {
          inventory: state.inventory.filter(slot => slot.itemId !== itemId),
        };
      }
      
      return {
        inventory: state.inventory.map(slot =>
          slot.itemId === itemId
            ? { ...slot, quantity: slot.quantity - quantity }
            : slot
        ),
      };
    });
    get().savePlayer();
  },
  
  useItem: (itemId) => {
    const state = get();
    const itemSlot = state.inventory.find(slot => slot.itemId === itemId);
    
    if (!itemSlot) return false; // Item not in inventory
    
    // Find item data
    const itemData = itemsData.find((i: any) => i.id === itemId);
    
    if (!itemData || itemData.category !== 'consumable') return false;
    
    // Apply item effect
    if (itemData.effect) {
      switch (itemData.effect.type) {
        case 'heal':
          const currentHp = state.stats.hp;
          const maxHp = state.stats.maxHp;
          
          if (currentHp >= maxHp) return false; // Already at full HP
          
          const healAmount = Math.min(itemData.effect.value, maxHp - currentHp);
          get().heal(healAmount);
          break;
          
        case 'damage':
          // For future attack scrolls/bombs
          // This would need to be handled in combat
          break;
          
        case 'buff':
          // For future buff potions
          break;
          
        default:
          return false;
      }
    }
    
    // Remove one of the item from inventory
    get().removeItem(itemId, 1);
    return true;
  },
  
  equipItem: (itemId, slot) => {
    set((state) => {
      // Unequip current item if any
      const currentItem = state.equipment[slot];
      let newInventory = state.inventory;
      
      if (currentItem) {
        newInventory = [...newInventory, { itemId: currentItem, quantity: 1 }];
      }
      
      // Remove from inventory
      newInventory = newInventory.filter(item => item.itemId !== itemId);
      
      return {
        equipment: { ...state.equipment, [slot]: itemId },
        inventory: newInventory,
      };
    });
    get().checkAchievements();
    get().savePlayer();
  },
  
  unequipItem: (slot) => {
    set((state) => {
      const itemId = state.equipment[slot];
      if (!itemId) return state;
      
      return {
        equipment: { ...state.equipment, [slot]: null },
        inventory: [...state.inventory, { itemId, quantity: 1 }],
      };
    });
    get().savePlayer();
  },
  
  setLocation: (tileId) => {
    set((state) => ({
      location: tileId,
      locationsVisited: new Set([...state.locationsVisited, tileId]),
    }));
    get().checkAchievements();
    get().savePlayer();
  },
  
  incrementEnemiesKilled: () => {
    set((state) => ({ enemiesKilled: state.enemiesKilled + 1 }));
    get().checkAchievements();
    get().savePlayer();
  },
  
  recordEnemyDefeated: (enemyId: string) => {
    set((state) => ({
      defeatedEnemyTypes: new Set([...state.defeatedEnemyTypes, enemyId]),
    }));
    get().savePlayer();
  },
  
  checkAchievements: () => {
    const state = get();
    useAchievementStore.getState().checkAchievements(
      state.stats,
      state.inventory,
      state.enemiesKilled,
      state.locationsVisited.size,
      state.equipment
    );
  },
  
  setAvatar: (avatarPath) => {
    set({ avatar: avatarPath, customAvatar: null });
    get().savePlayer();
  },
  
  setCustomAvatar: (imageUrl) => {
    set({ customAvatar: imageUrl });
    get().savePlayer();
  },
  
  initializePlayer: (_username: string) => {
    set({
      stats: {
        ...DEFAULT_STATS,
        hp: 300,
        maxHp: 300,
      },
      equipment: DEFAULT_EQUIPMENT,
      inventory: [
        { itemId: 'health-potion', quantity: 2 },
      ],
      location: 'guild-hall',
      enemiesKilled: 0,
      locationsVisited: new Set(['guild-hall']),
      avatar: '/images/avatars/male-ta-default.jpg',
      customAvatar: null,
    });
    get().savePlayer();
  },
  
  savePlayer: () => {
    const { stats, equipment, inventory, location, enemiesKilled, defeatedEnemyTypes, locationsVisited, avatar, customAvatar } = get();
    const username = (window as any).__currentUsername; // Temporary solution
    
    if (!username) return;
    
    // Get unlocked achievement IDs
    const unlockedAchievements = useAchievementStore.getState()
      .achievements
      .filter(a => a.unlocked)
      .map(a => a.id);
    
    // Save to new character storage system (Documents/Legends of Revenue/Characters/)
    saveCharacter({
      username,
      stats,
      equipment,
      inventory,
      location,
      enemiesKilled,
      defeatedEnemyTypes: Array.from(defeatedEnemyTypes),
      locationsVisited: Array.from(locationsVisited),
      avatar,
      customAvatar,
      achievements: unlockedAchievements,
    });
    
    // Also keep localStorage backup for compatibility
    saveToStorage(`player:${username}`, {
      stats,
      equipment,
      inventory,
      location,
      enemiesKilled,
      defeatedEnemyTypes: Array.from(defeatedEnemyTypes),
      locationsVisited: Array.from(locationsVisited), // Convert Set to Array for JSON
      avatar,
      customAvatar,
    });
  },
  
  loadPlayer: (username) => {
    // Try loading from new character storage first
    const characterData = loadCharacter(username);
    
    if (characterData) {
      set({
        stats: characterData.stats,
        equipment: characterData.equipment,
        inventory: characterData.inventory,
        location: characterData.location,
        enemiesKilled: characterData.enemiesKilled || 0,
        defeatedEnemyTypes: new Set(characterData.defeatedEnemyTypes || []),
        locationsVisited: new Set(characterData.locationsVisited || ['miras-palace']),
        avatar: characterData.avatar || '/images/avatars/male-ta-default.jpg',
        customAvatar: characterData.customAvatar || null,
      });
      
      // Restore achievements if present
      if (characterData.achievements && characterData.achievements.length > 0) {
        const achievementStore = useAchievementStore.getState();
        characterData.achievements.forEach(achievementId => {
          achievementStore.unlockAchievement(achievementId);
        });
      }
      
      (window as any).__currentUsername = username;
      return true;
    }
    
    // Fallback to old localStorage method
    const data = loadFromStorage<{
      stats: PlayerStats;
      equipment: PlayerEquipment;
      inventory: InventorySlot[];
      location: string;
      enemiesKilled?: number;
      defeatedEnemyTypes?: string[];
      locationsVisited?: string[];
      avatar?: string;
      customAvatar?: string | null;
    }>(`player:${username}`);
    
    if (!data) {
      return false;
    }
    
    set({
      stats: data.stats,
      equipment: data.equipment,
      inventory: data.inventory,
      location: data.location,
      enemiesKilled: data.enemiesKilled || 0,
      defeatedEnemyTypes: new Set(data.defeatedEnemyTypes || []),
      locationsVisited: new Set(data.locationsVisited || ['miras-palace']),
      avatar: data.avatar || '/images/avatars/male-ta-default.jpg',
      customAvatar: data.customAvatar || null,
    });
    
    (window as any).__currentUsername = username; // Temporary solution
    return true;
  },
  
  resetPlayer: () => {
    set({
      stats: {
        ...DEFAULT_STATS,
        hp: 300,
        maxHp: 300,
      },
      equipment: DEFAULT_EQUIPMENT,
      inventory: [],
      location: 'guild-hall',
      enemiesKilled: 0,
      defeatedEnemyTypes: new Set<string>(),
      locationsVisited: new Set(['guild-hall']),
      avatar: '/images/avatars/male-ta-default.jpg',
      customAvatar: null,
    });
  },
}));
