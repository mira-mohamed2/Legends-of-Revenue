import React, { useState, useEffect } from 'react';
import { getAllPlayers, exportToCSV, clearAllData, getStatistics, importFromJSONFiles, type Player } from '../utils/database';

export const AdminPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<Player[]>([]);
  const [stats, setStats] = useState({ totalPlayers: 0, winners: 0, totalGamesPlayed: 0, highestScore: 0 });

  const ADMIN_PASSWORD = 'MIRA2024'; // Change this for security!

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadData();
    }
  }, [isAuthenticated, isOpen]);

  const loadData = async () => {
    const players = await getAllPlayers();
    const statistics = await getStatistics();
    setRegistrations(players);
    setStats(statistics);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('❌ Incorrect password!');
    }
  };

  const handleClearData = async () => {
    if (confirm('⚠️ This will delete ALL player data permanently! Are you sure?')) {
      await clearAllData();
      await loadData(); // Refresh
      setIsOpen(false);
      setIsAuthenticated(false);
      setPassword('');
      alert('✅ All data cleared successfully!');
    }
  };

  const handleClearSessionData = () => {
    if (confirm('⚠️ This will logout the current user and return to login screen.\n\nPlayer data (JSON/Database) will NOT be deleted.\n\nContinue?')) {
      // Clear only the current session
      localStorage.removeItem('current_user');
      setIsOpen(false);
      setIsAuthenticated(false);
      setPassword('');
      alert('✅ Session cleared! Page will reload to login screen.');
      // Force reload to return to login
      window.location.reload();
    }
  };

  const handleExportJSON = async () => {
    try {
      await exportToCSV(); // Creates BOTH: expo_data.json + expo_data_TIMESTAMP.json
      alert('✅ TWO JSON files saved to Downloads!\n\n' +
            '1️⃣ expo_data.json (fixed name)\n' +
            '2️⃣ expo_data_TIMESTAMP.json (timestamped backup)\n\n' +
            '📌 IMPORTANT: To sync data across browsers/sessions:\n' +
            '   Copy expo_data.json to /public/ folder and refresh the app');
    } catch (error) {
      console.error('Failed to save JSON:', error);
      alert('❌ Failed to save JSON file. Please try again.');
    }
  };

  const handleImportJSON = async () => {
    try {
      // Create file input element with multiple file support
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.multiple = true; // Allow multiple file selection
      
      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) return;
        
        try {
          const result = await importFromJSONFiles(files);
          
          let message = `✅ Import Complete!\n\n`;
          message += `� Processed ${files.length} file(s)\n`;
          message += `✅ ${result.imported} new players imported\n`;
          message += `🔄 ${result.updated} players updated (higher scores)\n`;
          message += `⏭️ ${result.skipped} skipped (lower/same scores)\n`;
          
          if (result.errors.length > 0) {
            message += `\n❌ Errors:\n${result.errors.slice(0, 3).join('\n')}`;
            if (result.errors.length > 3) {
              message += `\n... and ${result.errors.length - 3} more`;
            }
          }
          
          alert(message);
          await loadData(); // Refresh the display
        } catch (error) {
          console.error('Failed to import JSON:', error);
          alert(`❌ Failed to import JSON file.\n\nError: ${error}`);
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Failed to create file input:', error);
      alert('❌ Failed to open file picker. Please try again.');
    }
  };

  const totalPlayers = stats.totalPlayers;
  const winners = stats.winners;
  const totalGamesPlayed = stats.totalGamesPlayed;
  const highestScore = stats.highestScore;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 text-sm z-50"
      >
        🔐 Admin
      </button>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">🔐 Admin Access</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded mb-4 focus:border-yellow-500 focus:outline-none border-2 border-gray-600"
            placeholder="Enter admin password"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-600"
            >
              Login
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">📊 Admin Panel</h2>

        {/* JSON Data Source Info */}
        <div className="bg-blue-900 border-2 border-blue-500 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-bold text-blue-200 mb-2">📂 Data Source</h3>
          <div className="space-y-1 text-sm">
            <p className="text-blue-100">
              <span className="font-semibold">JSON File:</span> /expo_data.json
            </p>
            <p className="text-blue-100">
              <span className="font-semibold">Status:</span>{' '}
              <span className="text-green-400 font-bold">✅ Loaded</span>
            </p>
            <p className="text-blue-100">
              <span className="font-semibold">In-Memory Database:</span> {totalPlayers} {totalPlayers === 1 ? 'player' : 'players'}
            </p>
            <p className="text-blue-300 text-xs mt-2">
              💡 All changes are saved to JSON on logout
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Players</p>
            <p className="text-3xl font-bold text-white">{totalPlayers}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Prize Winners</p>
            <p className="text-3xl font-bold text-yellow-400">{winners}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Games Played</p>
            <p className="text-3xl font-bold text-blue-400">{totalGamesPlayed}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Highest Score</p>
            <p className="text-3xl font-bold text-green-400">{highestScore}</p>
          </div>
        </div>

        {/* Data Sync Instructions */}
        <div className="bg-blue-900 border-2 border-blue-500 rounded-lg p-4 mb-4">
          <h3 className="text-blue-200 font-bold mb-2 flex items-center gap-2">
            <span>ℹ️</span> Data Import & Sync Workflow
          </h3>
          <div className="text-blue-100 text-sm space-y-2">
            <p><strong>📤 On Logout:</strong> Timestamped backup downloads to Downloads folder</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><code className="bg-blue-800 px-1 rounded">expo_data_YYYY-MM-DD_HH-MM-SS.json</code> - Timestamped backup</li>
            </ul>
            <p><strong>📥 Multi-File Import (Smart Merge):</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Select multiple JSON files at once</li>
              <li>Automatically deduplicates by username + phone</li>
              <li>Keeps highest score for duplicates</li>
              <li>Only updates database if imported score is higher</li>
            </ul>
            <p><strong>🔄 To Sync Across Browsers/Sessions:</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Collect timestamped backups from all browsers/sessions</li>
              <li>Use Import button to select all files at once</li>
              <li>System will merge and keep best scores automatically</li>
            </ul>
            <p className="text-blue-300 mt-2">💡 <strong>Tip:</strong> Import shows detailed stats (new, updated, skipped)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleExportJSON}
            disabled={totalPlayers === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📥 Export to JSON File - {totalPlayers} Records
          </button>
          
          <button
            onClick={handleImportJSON}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600"
          >
            📤 Import from JSON File
          </button>
          
          <button
            onClick={handleClearSessionData}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-amber-600"
          >
            🚪 Clear Session Data (Logout to Login Page)
          </button>
          
          <button
            onClick={handleClearData}
            disabled={totalPlayers === 0}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🗑️ Clear All Data (Danger!)
          </button>
        </div>

        {/* Player Data Table */}
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-bold text-white mb-3">📋 Player Data ({totalPlayers} {totalPlayers === 1 ? 'Player' : 'Players'})</h3>
          {totalPlayers === 0 ? (
            <p className="text-gray-400 text-center py-8">No player data</p>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-600 text-gray-300 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Username</th>
                    <th className="px-3 py-2">Full Name</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2 text-center">Games</th>
                    <th className="px-3 py-2 text-center">Best Score</th>
                    <th className="px-3 py-2 text-center">Gold</th>
                    <th className="px-3 py-2 text-center">Level</th>
                    <th className="px-3 py-2 text-center">Prize</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {registrations.map((reg) => (
                    <tr key={reg.registrationId} className="hover:bg-gray-600">
                      <td className="px-3 py-2 font-semibold text-white">@{reg.username}</td>
                      <td className="px-3 py-2 text-gray-300">{reg.fullName}</td>
                      <td className="px-3 py-2 text-gray-300">{reg.phoneNumber}</td>
                      <td className="px-3 py-2 text-gray-400 text-xs max-w-[150px] truncate" title={reg.email}>{reg.email}</td>
                      <td className="px-3 py-2 text-center text-blue-400 font-bold">{reg.totalGamesPlayed || 0}</td>
                      <td className="px-3 py-2 text-center text-green-400 font-bold">{reg.highestScore || 0}</td>
                      <td className="px-3 py-2 text-center text-yellow-400 font-bold">
                        {reg.characterData?.stats?.gold || 0}
                      </td>
                      <td className="px-3 py-2 text-center text-purple-400 font-bold">
                        {reg.characterData?.stats?.level || 1}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {reg.wonPrize ? (
                          <span className="text-yellow-400">🏆</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-bold text-white mb-3">📝 Recent Activity (Last 5)</h3>
          {totalPlayers === 0 ? (
            <p className="text-gray-400 text-center py-8">No registrations yet</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {registrations.slice(-5).reverse().map((reg) => (
                <div key={reg.registrationId} className="bg-gray-600 p-3 rounded text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-white font-semibold">{reg.fullName}</p>
                    {reg.wonPrize && (
                      <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                        🏆 WINNER
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300">@{reg.username} • {reg.phoneNumber}</p>
                  <p className="text-gray-400 text-xs">{reg.email}</p>
                  <div className="flex gap-4 mt-1 text-xs flex-wrap">
                    {reg.highestScore !== undefined && (
                      <p className="text-green-400 font-bold">Score: {reg.highestScore}</p>
                    )}
                    {reg.totalGamesPlayed > 0 && (
                      <p className="text-blue-400">Games: {reg.totalGamesPlayed}</p>
                    )}
                    {reg.characterData?.stats?.gold !== undefined && (
                      <p className="text-yellow-400 font-bold">Gold: {reg.characterData.stats.gold}</p>
                    )}
                    {reg.characterData?.stats?.level !== undefined && (
                      <p className="text-purple-400 font-bold">Lvl: {reg.characterData.stats.level}</p>
                    )}
                    {reg.lastPlayed && (
                      <p className="text-gray-400">Last: {new Date(reg.lastPlayed).toLocaleDateString()}</p>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Registered: {new Date(reg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            setIsAuthenticated(false);
            setPassword('');
          }}
          className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};
