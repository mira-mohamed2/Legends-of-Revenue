export interface QuestObjective {
  id: string;
  type: 'talk' | 'collect' | 'defeat' | 'visit';
  targetId: string;
  targetQuantity?: number;
  currentProgress?: number;
  completed: boolean;
}

export interface QuestStage {
  id: string;
  type: 'dialogue' | 'combat' | 'exploration';
  description: string;
  objectives: QuestObjective[];
  rewards: {
    xp: number;
    gold: number;
    items?: Array<{ id: string; quantity: number }>;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  stages: QuestStage[];
  status: 'available' | 'active' | 'completed';
  isMainQuest: boolean;
}
