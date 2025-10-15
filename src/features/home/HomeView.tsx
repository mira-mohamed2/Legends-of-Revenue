import React, { useState } from 'react';
import { usePlayerStore } from '../../state/playerStore';
import enemiesData from '../../data/enemies.json';

export const HomeView: React.FC = () => {
  const { stats, defeatedEnemyTypes } = usePlayerStore();
  const [selectedEnemy, setSelectedEnemy] = useState<string | null>(null);

  const selectedEnemyData = selectedEnemy 
    ? enemiesData.find(e => e.id === selectedEnemy)
    : null;

  // Calculate unlocked enemies count
  const unlockedCount = enemiesData.filter(e => defeatedEnemyTypes.has(e.id)).length;
  const totalCount = enemiesData.length;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="font-medieval text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent mb-2 sm:mb-3">
          🏛️ MIRA Headquarters
        </h1>
        <p className="font-body text-base sm:text-lg text-brown-800">
          Welcome back, <span className="font-bold text-teal-700">Tax Officer</span>
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-600 rounded-lg p-3 sm:p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">⚔️</div>
            <div className="font-medieval text-xl sm:text-2xl text-purple-900">{stats.level}</div>
            <div className="font-body text-xs sm:text-sm text-purple-700">Level</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-600 rounded-lg p-3 sm:p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">💰</div>
            <div className="font-medieval text-xl sm:text-2xl text-amber-900">{stats.gold}</div>
            <div className="font-body text-xs sm:text-sm text-amber-700">Gold</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-600 rounded-lg p-3 sm:p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">📖</div>
            <div className="font-medieval text-xl sm:text-2xl text-emerald-900">
              {unlockedCount}/{totalCount}
            </div>
            <div className="font-body text-xs sm:text-sm text-emerald-700">Codex</div>
          </div>
        </div>
      </div>

      {/* Game Lore Section */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-600 rounded-xl p-4 sm:p-6 shadow-lg">
        <h2 className="font-medieval text-xl sm:text-2xl text-teal-900 mb-3 sm:mb-4 flex items-center gap-2">
          📜 The Legend of MIRA
        </h2>
        <div className="font-body text-sm sm:text-base text-brown-800 space-y-2 sm:space-y-3 leading-relaxed">
          <p>
            In a world drowning in greed, where tax evaders flourish and economic justice withers, 
            <span className="font-bold text-teal-700"> MIRA</span> (Maldives Inland Revenue Authority) 
            stands as the last bastion of order.
          </p>
          <p>
            You are a <span className="font-bold">MIRA Agent</span>—sworn to uphold revenue law, 
            trained to combat financial crime, and empowered to bring evaders to justice. 
            Every coin you recover builds hospitals. Every evader you apprehend protects schools. 
            Every victory strengthens the nation.
          </p>
          <p className="italic text-teal-800">
            "For every coin they hide is a hospital bed unfunded, a school unmaintained, a future stolen."
          </p>
        </div>
      </div>

      {/* Enemy Codex */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-600 rounded-xl p-4 sm:p-6 shadow-lg">
        <h2 className="font-medieval text-xl sm:text-2xl text-orange-900 mb-3 sm:mb-4 flex items-center gap-2">
          📚 Enemy Codex
        </h2>
        <p className="font-body text-xs sm:text-sm text-brown-700 mb-3 sm:mb-4 italic">
          Defeat enemies in combat to unlock their entries and learn their secrets.
        </p>

        {/* Enemy Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {enemiesData.map((enemy) => {
            const isUnlocked = defeatedEnemyTypes.has(enemy.id);
            const isSelected = selectedEnemy === enemy.id;

            return (
              <button
                key={enemy.id}
                onClick={() => isUnlocked && setSelectedEnemy(enemy.id)}
                disabled={!isUnlocked}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                  isUnlocked
                    ? isSelected
                      ? 'bg-teal-100 border-teal-600 shadow-lg'
                      : 'bg-white border-orange-400 hover:border-teal-500 hover:shadow-md cursor-pointer'
                    : 'bg-gray-200 border-gray-400 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-1">
                  {isUnlocked ? '👹' : '❓'}
                </div>
                <div className={`font-medieval text-xs ${
                  isUnlocked ? 'text-brown-900' : 'text-gray-600'
                }`}>
                  {isUnlocked ? enemy.name : '???'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Enemy Details */}
        {selectedEnemyData && (
          <div className="bg-white border-2 border-teal-600 rounded-lg p-3 sm:p-5 shadow-lg">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="text-3xl sm:text-5xl flex-shrink-0">👹</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medieval text-lg sm:text-2xl text-orange-900 mb-1">
                  {selectedEnemyData.name}
                </h3>
                <p className="font-body text-xs sm:text-sm text-brown-700 italic">
                  {selectedEnemyData.description}
                </p>
              </div>
            </div>

            {/* Combat Stats - Show Ranges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-red-50 border border-red-300 rounded p-2 text-center">
                <div className="font-body text-xs text-red-700">HP Range</div>
                <div className="font-medieval text-lg text-red-900">
                  {(selectedEnemyData as any).statRanges?.hp ? 
                    `${(selectedEnemyData as any).statRanges.hp.min}-${(selectedEnemyData as any).statRanges.hp.max}` :
                    'Unknown'
                  }
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-300 rounded p-2 text-center">
                <div className="font-body text-xs text-orange-700">Attack Range</div>
                <div className="font-medieval text-lg text-orange-900">
                  {(selectedEnemyData as any).statRanges?.attack ? 
                    `${(selectedEnemyData as any).statRanges.attack.min}-${(selectedEnemyData as any).statRanges.attack.max}` :
                    'Unknown'
                  }
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-300 rounded p-2 text-center">
                <div className="font-body text-xs text-amber-700">Defense Range</div>
                <div className="font-medieval text-lg text-amber-900">
                  {(selectedEnemyData as any).statRanges?.defense ? 
                    `${(selectedEnemyData as any).statRanges.defense.min}-${(selectedEnemyData as any).statRanges.defense.max}` :
                    'Unknown'
                  }
                </div>
              </div>
            </div>

            {/* Randomization Note */}
            <div className="bg-teal-50 border border-teal-300 rounded-lg p-2 mb-4">
              <p className="font-body text-xs text-teal-800 text-center italic">
                ⚠️ Stats are randomized within the ranges shown above for each encounter
              </p>
            </div>

            {/* Lore */}
            {(selectedEnemyData as any).lore && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-500 rounded-lg p-4">
                <h4 className="font-medieval text-sm text-amber-900 mb-2 flex items-center gap-2">
                  📜 Lore
                </h4>
                <p className="font-body text-xs text-brown-800 leading-relaxed italic">
                  {(selectedEnemyData as any).lore}
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedEnemy && defeatedEnemyTypes.size > 0 && (
          <div className="text-center py-8 text-brown-600 font-body italic">
            Select an enemy from the codex to view their details
          </div>
        )}

        {defeatedEnemyTypes.size === 0 && (
          <div className="text-center py-8 text-brown-600 font-body">
            <div className="text-5xl mb-3">🗡️</div>
            <p>No enemies defeated yet. Begin your journey to unlock the codex!</p>
          </div>
        )}
      </div>

      {/* Sacred Oath */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-600 rounded-xl p-6 shadow-lg">
        <h2 className="font-medieval text-xl text-purple-900 mb-3 text-center">
          📜 Sacred Oath of MIRA Agents
        </h2>
        <div className="font-body text-sm text-purple-900 italic text-center leading-relaxed space-y-2">
          <p>"I swear upon my honor to uphold the revenue laws of the Maldives."</p>
          <p>"To pursue evaders with relentless determination."</p>
          <p>"To recover every hidden coin, dismantle every shell company."</p>
          <p>"I am the shield that protects public revenue."</p>
          <p className="font-bold text-purple-800">"I am a MIRA Agent—and I will not rest until justice prevails."</p>
        </div>
      </div>
    </div>
  );
};
