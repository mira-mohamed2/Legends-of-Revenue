import React from 'react';

export const PlayersView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="panel">
        <h1 className="font-medieval text-4xl text-gold mb-4">👥 Players</h1>
        
        <div className="bg-emerald-100 border-2 border-emerald-600 rounded p-8 text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h2 className="font-medieval text-3xl text-emerald-900 mb-4">Multiplayer Coming Soon!</h2>
          <p className="font-body text-emerald-800 text-lg mb-6">
            This feature is under development. In the future, you'll be able to:
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-white rounded p-4 shadow">
                <h3 className="font-medieval text-xl text-brown mb-2">👀 View Other Agents</h3>
                <p className="font-body text-brown-700 text-sm">
                  See other MIRA agents' levels, equipment, and achievements
                </p>
              </div>
              
              <div className="bg-white rounded p-4 shadow">
                <h3 className="font-medieval text-xl text-brown mb-2">⚔️ PvP Combat</h3>
                <p className="font-body text-brown-700 text-sm">
                  Challenge other players to duels and climb the leaderboard
                </p>
              </div>
              
              <div className="bg-white rounded p-4 shadow">
                <h3 className="font-medieval text-xl text-brown mb-2">🤝 Trading</h3>
                <p className="font-body text-brown-700 text-sm">
                  Trade items and gold with other players in real-time
                </p>
              </div>
              
              <div className="bg-white rounded p-4 shadow">
                <h3 className="font-medieval text-xl text-brown mb-2">🏆 Leaderboards</h3>
                <p className="font-body text-brown-700 text-sm">
                  Compete for top rankings in levels, gold, and achievements
                </p>
              </div>
              
              <div className="bg-white rounded p-4 shadow">
                <h3 className="font-medieval text-xl text-brown mb-2">👫 Guilds</h3>
                <p className="font-body text-brown-700 text-sm">
                  Form tax-evading guilds and complete group challenges
                </p>
              </div>
              
              <div className="bg-white rounded p-4 shadow">
                <h3 className="font-medieval text-xl text-brown mb-2">💬 Chat System</h3>
                <p className="font-body text-brown-700 text-sm">
                  Communicate with other players and coordinate strategies
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-100 border-2 border-yellow-600 rounded">
            <p className="font-body text-yellow-900">
              <strong>Note:</strong> Multiplayer features will require backend server infrastructure.
              This is planned for a future update!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
