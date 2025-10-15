export interface EnemyStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

export interface StatRange {
  min: number;
  max: number;
}

export interface EnemyStatRanges {
  hp: StatRange;
  attack: StatRange;
  defense: StatRange;
}

export interface EnemyRewardItem {
  id: string;
  chance?: number;
}

export interface EnemyRewards {
  xp: number;
  gold: number;
  items: EnemyRewardItem[];
}

export interface EnemyAbility {
  id: string;
  name: string;
  trigger: string;
  effect: {
    type: string;
    value: number;
  };
}

export interface Enemy {
  id: string;
  name: string;
  image?: string;
  stats: EnemyStats;
  statRanges?: EnemyStatRanges; // For displaying possible stat ranges
  rewards: EnemyRewards;
  description?: string;
  abilities?: EnemyAbility[];
}

export interface EncounterState {
  enemy: Enemy;
  turnCount: number;
  playerTurn?: boolean;
  rewardMultiplier?: number; // Based on enemy's randomized strength
}
