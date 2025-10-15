export interface EnemyStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
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
  rewards: EnemyRewards;
  description?: string;
  abilities?: EnemyAbility[];
}

export interface EncounterState {
  enemy: Enemy;
  turnCount: number;
  playerTurn?: boolean;
}
