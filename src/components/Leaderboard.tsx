import { useState, useEffect } from 'react';
import { getAllPlayers } from '../utils/database';

interface LeaderboardEntry {
  username: string;
  fullName: string;
  level: number;
  gold: number;
  highestScore: number; // Changed from totalScore to match Admin panel
  gamesPlayed: number;
  wonPrize: boolean;
}

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'gold' | 'level' | 'score' | 'games'>('score'); // Default to score
  const [isLoading, setIsLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<string>('');

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem('current_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUsername(user.username);
      } catch (error) {
        console.error('Failed to parse current user:', error);
      }
    }
    
    // Load leaderboard immediately when component mounts
    loadLeaderboard();
    
    // Set up an interval to refresh every 5 seconds while viewing
    const refreshInterval = setInterval(() => {
      loadLeaderboard();
    }, 5000);
    
    // Listen for custom event when scores are updated
    const handleScoreUpdate = () => {
      console.log('Score updated - refreshing leaderboard');
      loadLeaderboard();
    };
    
    window.addEventListener('scoreUpdated', handleScoreUpdate);
    
    // Cleanup interval and listener on unmount
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('scoreUpdated', handleScoreUpdate);
    };
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      // Refresh current username from localStorage
      const userData = localStorage.getItem('current_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUsername(user.username);
        } catch (error) {
          console.error('Failed to parse current user:', error);
        }
      }
      
      const players = await getAllPlayers();
      
      console.log('📊 Leaderboard: Retrieved players from Dexie:', players.length);
      
      // Log a sample player to debug
      if (players.length > 0) {
        const samplePlayer = players[0];
        console.log('Sample player data:', {
          username: samplePlayer.username,
          totalScore: samplePlayer.totalScore,
          highestScore: samplePlayer.highestScore,
          characterData: samplePlayer.characterData
        });
      }
      
      // Convert players to leaderboard entries
      const leaderboardData: LeaderboardEntry[] = players
        .filter(p => p.characterData) // Only players who have played
        .map(p => {
          const entry = {
            username: p.username,
            fullName: p.fullName,
            level: p.characterData?.stats?.level || 1,
            gold: p.characterData?.stats?.gold || 0,
            highestScore: p.highestScore || 0, // Use highestScore like Admin panel
            gamesPlayed: p.totalGamesPlayed || 0,
            wonPrize: p.wonPrize || false,
          };
          
          // Log each player's score for debugging
          console.log(`Player ${p.username}: highestScore in Dexie = ${p.highestScore}, shown in leaderboard = ${entry.highestScore}`);
          
          return entry;
        });

      setEntries(leaderboardData);
      
      // Log current user's score for debugging
      const currentUserEntry = leaderboardData.find(e => e.username === currentUsername);
      if (currentUserEntry) {
        console.log(`Leaderboard refreshed - Current user (${currentUsername}) score: ${currentUserEntry.highestScore}`);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedEntries = () => {
    return [...entries].sort((a, b) => {
      switch (sortBy) {
        case 'gold':
          return b.gold - a.gold;
        case 'level':
          return b.level - a.level;
        case 'score':
          return b.highestScore - a.highestScore; // Use highestScore
        case 'games':
          return b.gamesPlayed - a.gamesPlayed;
        default:
          return 0;
      }
    });
  };

  const sortedEntries = getSortedEntries();
  const currentUserEntry = sortedEntries.find(e => e.username === currentUsername);
  const currentUserRank = currentUserEntry ? sortedEntries.indexOf(currentUserEntry) + 1 : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400 text-lg">No players have started their journey yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current User Stats Card */}
      {currentUserEntry && (
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-2xl overflow-hidden border-2 border-blue-400">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-blue-200 flex items-center gap-2">
                <span className="text-3xl">👤</span>
                Your Performance
              </h3>
              <span className="text-4xl font-bold text-yellow-300">#{currentUserRank}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 text-center">
                <p className="text-blue-300 text-sm mb-1">Highest Score</p>
                <p className="text-green-300 text-2xl font-bold">{currentUserEntry.highestScore.toLocaleString()}</p>
              </div>
              <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4 text-center">
                <p className="text-purple-300 text-sm mb-1">Level</p>
                <p className="text-white text-2xl font-bold">Lv. {currentUserEntry.level}</p>
              </div>
              <div className="bg-yellow-800 bg-opacity-50 rounded-lg p-4 text-center">
                <p className="text-yellow-300 text-sm mb-1">Gold</p>
                <p className="text-yellow-200 text-2xl font-bold">{currentUserEntry.gold.toLocaleString()}</p>
              </div>
              <div className="bg-cyan-800 bg-opacity-50 rounded-lg p-4 text-center">
                <p className="text-cyan-300 text-sm mb-1">Games Played</p>
                <p className="text-cyan-200 text-2xl font-bold">{currentUserEntry.gamesPlayed}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h2>
        <p className="text-yellow-100">Top players in the realm</p>
      </div>

      {/* Sort Controls */}
      <div className="bg-gray-700 p-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setSortBy('gold')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            sortBy === 'gold'
              ? 'bg-yellow-500 text-gray-900'
              : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          }`}
        >
          💰 Gold
        </button>
        <button
          onClick={() => setSortBy('level')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            sortBy === 'level'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          }`}
        >
          ⭐ Level
        </button>
        <button
          onClick={() => setSortBy('score')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            sortBy === 'score'
              ? 'bg-green-500 text-white'
              : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          }`}
        >
          🎯 Total Score
        </button>
        <button
          onClick={() => setSortBy('games')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            sortBy === 'games'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          }`}
        >
          🎮 Games Played
        </button>
        <button
          onClick={loadLeaderboard}
          className="ml-auto px-4 py-2 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-500 font-semibold transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700 text-gray-300 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-center">Rank</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-center">Level</th>
              <th className="px-4 py-3 text-center">Gold</th>
              <th className="px-4 py-3 text-center">Highest Score</th>
              <th className="px-4 py-3 text-center">Games</th>
              <th className="px-4 py-3 text-center">Prize</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedEntries.map((entry, index) => {
              const isCurrentUser = entry.username === currentUsername;
              return (
                <tr
                  key={entry.username}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-2 border-blue-400 hover:from-blue-800 hover:to-purple-800'
                      : index < 3
                      ? 'bg-gray-750 hover:bg-gray-700'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0
                          ? 'bg-yellow-500 text-gray-900'
                          : index === 1
                          ? 'bg-gray-400 text-gray-900'
                          : index === 2
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isCurrentUser && <span className="text-xl">👤</span>}
                      <div>
                        <p className={`font-semibold ${isCurrentUser ? 'text-blue-200' : 'text-white'}`}>
                          {entry.fullName} {isCurrentUser && <span className="text-xs bg-blue-500 px-2 py-1 rounded">YOU</span>}
                        </p>
                        <p className={`text-sm ${isCurrentUser ? 'text-blue-300' : 'text-gray-400'}`}>
                          @{entry.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold ${
                      isCurrentUser ? 'bg-purple-700 text-purple-100' : 'bg-purple-900 text-purple-200'
                    }`}>
                      Lv. {entry.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold text-lg ${
                      isCurrentUser ? 'text-yellow-300' : 'text-yellow-400'
                    }`}>
                      {entry.gold.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${
                      isCurrentUser ? 'text-green-300 text-xl' : 'text-green-400'
                    }`}>
                      {entry.highestScore.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${
                      isCurrentUser ? 'text-blue-300' : 'text-blue-400'
                    }`}>
                      {entry.gamesPlayed}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.wonPrize ? (
                      <span className="text-2xl">🏆</span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-700 p-4 flex justify-around text-center">
        <div>
          <p className="text-gray-400 text-sm">Total Players</p>
          <p className="text-white text-2xl font-bold">{entries.length}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Total Games</p>
          <p className="text-blue-400 text-2xl font-bold">
            {entries.reduce((sum, e) => sum + e.gamesPlayed, 0)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Prize Winners</p>
          <p className="text-yellow-400 text-2xl font-bold">
            {entries.filter(e => e.wonPrize).length}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};
