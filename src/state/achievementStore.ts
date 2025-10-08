import { create } from 'zustand';
import { saveToStorage, loadFromStorage } from '../utils/storage';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementState {
  achievements: Achievement[];
  recentUnlock: Achievement | null;
  
  // Actions
  checkAchievements: (
    stats: any, 
    inventory: any[], 
    enemiesKilled: number, 
    locationsVisited: number, 
    equipment: any
  ) => void;
  unlockAchievement: (id: string) => void;
  clearRecentUnlock: () => void;
  saveAchievements: () => void;
  loadAchievements: (username: string) => boolean;
  resetAchievements: () => void;
}

const ACHIEVEMENT_LIST: Achievement[] = [
  {
    id: 'first-blood',
    name: 'First Apprehension',
    description: 'Apprehend your first tax evader',
    icon: '⚔️',
    unlocked: false,
  },
  {
    id: 'tax-rebel',
    name: 'MIRA Agent',
    description: 'Reach Level 5',
    icon: '🎖️',
    unlocked: false,
  },
  {
    id: 'revenue-master',
    name: 'Revenue Master',
    description: 'Reach Level 10 (MAX)',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'wealthy-evader',
    name: 'Asset Recovery Specialist',
    description: 'Recover 1000 gold in evaded taxes',
    icon: '💰',
    unlocked: false,
  },
  {
    id: 'tax-slayer',
    name: 'Tax Enforcer',
    description: 'Apprehend 50 tax evaders',
    icon: '💀',
    unlocked: false,
  },
  {
    id: 'legendary-collector',
    name: 'Legendary Collector',
    description: 'Obtain a Legendary item',
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'explorer',
    name: 'Field Agent',
    description: 'Visit 10 different locations',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'fully-equipped',
    name: 'Fully Equipped',
    description: 'Equip weapon and armor',
    icon: '🛡️',
    unlocked: false,
  },
];

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: ACHIEVEMENT_LIST,
  recentUnlock: null,
  
  checkAchievements: (stats, inventory, enemiesKilled, locationsVisited, equipment) => {
    const { achievements } = get();
    
    // Level achievements
    if (stats.level >= 5 && !achievements.find(a => a.id === 'tax-rebel')?.unlocked) {
      get().unlockAchievement('tax-rebel');
    }
    if (stats.level >= 10 && !achievements.find(a => a.id === 'revenue-master')?.unlocked) {
      get().unlockAchievement('revenue-master');
    }
    
    // Gold achievement
    if (stats.gold >= 1000 && !achievements.find(a => a.id === 'wealthy-evader')?.unlocked) {
      get().unlockAchievement('wealthy-evader');
    }
    
    // Enemy kills
    if (enemiesKilled >= 1 && !achievements.find(a => a.id === 'first-blood')?.unlocked) {
      get().unlockAchievement('first-blood');
    }
    if (enemiesKilled >= 50 && !achievements.find(a => a.id === 'tax-slayer')?.unlocked) {
      get().unlockAchievement('tax-slayer');
    }
    
    // Legendary item check
    const hasLegendary = inventory.some((slot: any) => {
      const itemId = slot.itemId;
      return itemId === 'plate-armor' || itemId === 'assassins-dagger';
    });
    if (hasLegendary && !achievements.find(a => a.id === 'legendary-collector')?.unlocked) {
      get().unlockAchievement('legendary-collector');
    }
    
    // Locations visited
    if (locationsVisited >= 10 && !achievements.find(a => a.id === 'explorer')?.unlocked) {
      get().unlockAchievement('explorer');
    }
    
    // Equipment check
    if (equipment.weapon && equipment.armor && !achievements.find(a => a.id === 'fully-equipped')?.unlocked) {
      get().unlockAchievement('fully-equipped');
    }
  },
  
  unlockAchievement: (id) => {
    set((state) => {
      const updated = state.achievements.map(a => 
        a.id === id 
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      );
      
      const unlockedAchievement = updated.find(a => a.id === id);
      
      return {
        achievements: updated,
        recentUnlock: unlockedAchievement || null,
      };
    });
    
    get().saveAchievements();
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      get().clearRecentUnlock();
    }, 5000);
  },
  
  clearRecentUnlock: () => {
    set({ recentUnlock: null });
  },
  
  saveAchievements: () => {
    const { achievements } = get();
    const username = (window as any).__currentUsername;
    
    if (!username) return;
    
    saveToStorage(`achievements:${username}`, {
      achievements: achievements.map(a => ({
        id: a.id,
        unlocked: a.unlocked,
        unlockedAt: a.unlockedAt,
      })),
    });
  },
  
  loadAchievements: (username) => {
    const data = loadFromStorage<{
      achievements?: Array<{ id: string; unlocked: boolean; unlockedAt?: string }>;
    }>(`achievements:${username}`);
    
    if (!data || !data.achievements) {
      return false;
    }
    
    // Merge saved data with default achievement list
    set((state) => ({
      achievements: state.achievements.map(achievement => {
        const saved = data.achievements!.find(a => a.id === achievement.id);
        if (saved) {
          return {
            ...achievement,
            unlocked: saved.unlocked,
            unlockedAt: saved.unlockedAt,
          };
        }
        return achievement;
      }),
    }));
    
    return true;
  },
  
  resetAchievements: () => {
    set({
      achievements: ACHIEVEMENT_LIST,
      recentUnlock: null,
    });
  },
}));
