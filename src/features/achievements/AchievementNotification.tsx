import React from 'react';
import { useAchievementStore } from '../../state/achievementStore';

export const AchievementNotification: React.FC = () => {
  const { recentUnlock, clearRecentUnlock } = useAchievementStore();
  
  if (!recentUnlock) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-gold to-yellow-600 border-4 border-yellow-400 rounded-lg shadow-2xl p-4 min-w-[300px]">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{recentUnlock.icon}</div>
          <div className="flex-1">
            <div className="text-xs font-bold text-brown-900 uppercase tracking-wide">
              Achievement Unlocked!
            </div>
            <div className="font-medieval text-lg text-brown-900 font-bold">
              {recentUnlock.name}
            </div>
            <div className="text-xs text-brown-800 font-body">
              {recentUnlock.description}
            </div>
          </div>
          <button
            onClick={clearRecentUnlock}
            className="text-brown-900 hover:text-brown-700 font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
