import React from 'react';

export const HowToPlayView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-medieval text-3xl sm:text-4xl text-teal-900 mb-2">
          📚 How to Play
        </h1>
        <p className="text-teal-700 text-sm sm:text-base">
          Learn tax knowledge while battling enemies!
        </p>
      </div>

      {/* Quick Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-3 border-blue-500 rounded-xl p-4 text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <h3 className="font-medieval text-lg text-blue-900 mb-2">1. Explore</h3>
          <p className="text-sm text-blue-800">Travel the map and find enemies</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-3 border-purple-500 rounded-xl p-4 text-center">
          <div className="text-4xl mb-2">❓</div>
          <h3 className="font-medieval text-lg text-purple-900 mb-2">2. Answer</h3>
          <p className="text-sm text-purple-800">Answer tax questions correctly</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-3 border-green-500 rounded-xl p-4 text-center">
          <div className="text-4xl mb-2">⚔️</div>
          <h3 className="font-medieval text-lg text-green-900 mb-2">3. Win!</h3>
          <p className="text-sm text-green-800">Defeat enemies & earn points</p>
        </div>
      </div>

      {/* Combat System */}
      <div className="bg-white border-3 border-amber-500 rounded-xl p-6 mb-4 shadow-lg">
        <h2 className="font-medieval text-2xl text-amber-900 mb-4 flex items-center gap-2">
          ⚔️ Combat System
        </h2>
        
        <div className="space-y-4">
          {/* Attack Types */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
            <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <span className="text-xl">✨</span> Special Attacks
            </h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✅</span>
                <span>Choose an attack → Answer a tax question</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✅</span>
                <span><strong>Correct answer:</strong> Attack hits! Gain points!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">❌</span>
                <span><strong>Wrong answer:</strong> You miss! Enemy attacks you! Lose points!</span>
              </li>
            </ul>
          </div>

          {/* Defense */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span className="text-xl">🛡️</span> Defense
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✅</span>
                <span><strong>Correct answer:</strong> Dodge the attack! No damage!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">❌</span>
                <span><strong>Wrong answer:</strong> Take full damage!</span>
              </li>
            </ul>
          </div>

          {/* Items */}
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
            <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <span className="text-xl">🧪</span> Items
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span>❤️</span>
                <span><strong>Health Potions:</strong> Restore HP during battle</span>
              </li>
              <li className="flex items-start gap-2">
                <span>⚔️</span>
                <span><strong>Weapons:</strong> Increase attack damage</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🛡️</span>
                <span><strong>Armor:</strong> Reduce damage taken</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scoring */}
      <div className="bg-white border-3 border-yellow-500 rounded-xl p-6 mb-4 shadow-lg">
        <h2 className="font-medieval text-2xl text-yellow-900 mb-4 flex items-center gap-2">
          🏆 Scoring System
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
            <div className="text-center mb-2">
              <div className="text-3xl">✅</div>
              <h3 className="font-bold text-green-900">Correct Answer</h3>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-700">+50 points</p>
              <p className="text-sm text-green-600 mt-1">(or more for harder questions)</p>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
            <div className="text-center mb-2">
              <div className="text-3xl">❌</div>
              <h3 className="font-bold text-red-900">Wrong Answer</h3>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-700">-12 points</p>
              <p className="text-sm text-red-600 mt-1">(25% penalty)</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-500 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-900">
            <strong>🎯 Goal:</strong> Answer correctly to maximize your score!
          </p>
          <p className="text-xs text-yellow-800 mt-1">
            Your total score is saved to the leaderboard
          </p>
        </div>
        
        <div className="mt-4 bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span> Important: Question Limits
          </h3>
          <ul className="space-y-2 text-sm text-red-800">
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">❌</span>
              <span><strong>Once all questions in a category are answered:</strong> That special attack becomes LOCKED and cannot be used anymore!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">❌</span>
              <span><strong>No more points can be earned</strong> from that category for the leaderboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✅</span>
              <span><strong>Strategy:</strong> Answer questions carefully to maximize points before they run out!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-3 border-indigo-500 rounded-xl p-6 shadow-lg">
        <h2 className="font-medieval text-2xl text-indigo-900 mb-4 flex items-center gap-2">
          💡 Quick Tips
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-bold text-indigo-900">Take Your Time</h3>
              <p className="text-sm text-indigo-700">Read questions carefully before answering</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <h3 className="font-bold text-indigo-900">Buy Equipment</h3>
              <p className="text-sm text-indigo-700">Visit the Market to upgrade weapons & armor</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">❤️</span>
            <div>
              <h3 className="font-bold text-indigo-900">Stock Potions</h3>
              <p className="text-sm text-indigo-700">Always carry health potions for tough battles</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-bold text-indigo-900">Check Leaderboard</h3>
              <p className="text-sm text-indigo-700">Compare your score with other players</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Play */}
      <div className="mt-6 text-center">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-xl">
          <h2 className="font-medieval text-2xl mb-2">🎮 Ready to Play?</h2>
          <p className="text-green-100 mb-4">Head to the Map and start your adventure!</p>
          <div className="text-4xl">⚔️ 💰 🏆</div>
        </div>
      </div>
    </div>
  );
};
