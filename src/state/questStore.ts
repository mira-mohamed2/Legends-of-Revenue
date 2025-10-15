import { create } from 'zustand';
import type { Quest } from '../types/quest';
import questData from '../data/quests.json';

interface QuestState {
  quests: Quest[];
  activeQuest: string | null;
  
  // Actions
  startQuest: (questId: string) => void;
  completeObjective: (questId: string, objectiveId: string) => void;
  advanceStage: (questId: string) => void;
  completeQuest: (questId: string) => void;
  getActiveQuests: () => Quest[];
  getCompletedQuests: () => Quest[];
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: (questData as Quest[]).map(q => ({ ...q })),
  activeQuest: null,
  
  startQuest: (questId) => {
    set((state) => ({
      quests: state.quests.map(quest =>
        quest.id === questId
          ? { ...quest, status: 'active' }
          : quest
      ),
      activeQuest: questId,
    }));
  },
  
  completeObjective: (questId, objectiveId) => {
    set((state) => ({
      quests: state.quests.map(quest => {
        if (quest.id !== questId) return quest;
        
        return {
          ...quest,
          stages: quest.stages.map((stage) => ({
            ...stage,
            objectives: stage.objectives.map((obj) =>
              obj.id === objectiveId
                ? { ...obj, completed: true }
                : obj
            ),
          })),
        };
      }),
    }));
  },
  
  advanceStage: (questId) => {
    set((state) => ({
      quests: state.quests.map(quest => {
        if (quest.id !== questId) return quest;
        // Logic for advancing to next stage would go here
        return quest;
      }),
    }));
  },
  
  completeQuest: (questId) => {
    set((state) => ({
      quests: state.quests.map(quest =>
        quest.id === questId
          ? { ...quest, status: 'completed' }
          : quest
      ),
    }));
  },
  
  getActiveQuests: () => {
    return get().quests.filter(q => q.status === 'active');
  },
  
  getCompletedQuests: () => {
    return get().quests.filter(q => q.status === 'completed');
  },
}));
