import { useState, useEffect } from 'react';
import { getAllPlayers } from '../utils/database';

interface LeaderboardEntry {
  username: string;
  fullName: string;
  level: number;
  gold: number;
  totalScore: number;
  gamesPlayed: number;
  wonPrize: boolean;
}

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'gold' | 'level' | 'score' | 'games'>('gold');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const players = await getAllPlayers();
      
      // Convert players to leaderboard entries
      const leaderboardData: LeaderboardEntry[] = players
        .filter(p => p.characterData) // Only players who have played
        .map(p => ({
          username: p.username,
          fullName: p.fullName,
          level: p.characterData?.stats?.level || 1,
          gold: p.characterData?.stats?.gold || 0,
          totalScore: p.totalScore || 0,
          gamesPlayed: p.totalGamesPlayed || 0,
          wonPrize: p.wonPrize || false,
        }));

      setEntries(leaderboardData);
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
          return b.totalScore - a.totalScore;
        case 'games':
          return b.gamesPlayed - a.gamesPlayed;
        default:
          return 0;
      }
    });
  };

  const sortedEntries = getSortedEntries();

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
              <th className="px-4 py-3 text-center">Total Score</th>
              <th className="px-4 py-3 text-center">Games</th>
              <th className="px-4 py-3 text-center">Prize</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedEntries.map((entry, index) => (
              <tr
                key={entry.username}
                className={`hover:bg-gray-700 transition-colors ${
                  index < 3 ? 'bg-gray-750' : ''
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
                  <div>
                    <p className="font-semibold text-white">{entry.fullName}</p>
                    <p className="text-sm text-gray-400">@{entry.username}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900 text-purple-200 font-bold">
                    Lv. {entry.level}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-yellow-400 font-bold text-lg">
                    {entry.gold.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-green-400 font-bold">
                    {entry.totalScore.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-blue-400 font-semibold">{entry.gamesPlayed}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  {entry.wonPrize ? (
                    <span className="text-2xl">🏆</span>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
              </tr>
            ))}
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
  );
};
