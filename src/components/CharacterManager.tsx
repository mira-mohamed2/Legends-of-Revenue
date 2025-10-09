import { useState } from 'react';
import { 
  exportCharacter, 
  importCharacter, 
  listCharacters,
  deleteCharacter,
  getCharacterInfo,
  exportAllCharacters,
  type CharacterInfo 
} from '../utils/characterStorage';
import { useSessionStore } from '../state/sessionStore';
import { usePlayerStore } from '../state/playerStore';

export default function CharacterManager() {
  const { currentUser } = useSessionStore();
  const { loadPlayer } = usePlayerStore();
  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  const [showManager, setShowManager] = useState(false);

  const refreshCharacters = () => {
    const charNames = listCharacters();
    const charInfos = charNames
      .map(name => getCharacterInfo(name))
      .filter(Boolean) as CharacterInfo[];
    setCharacters(charInfos);
  };

  const handleExportCurrent = () => {
    if (!currentUser) {
      alert('No character loaded');
      return;
    }
    exportCharacter(currentUser);
  };

  const handleExportAll = () => {
    exportAllCharacters();
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const imported = await importCharacter(file);
        if (imported) {
          alert(`✅ Character "${imported.username}" imported successfully!`);
          refreshCharacters();
          
          // Ask if user wants to switch to imported character
          if (confirm(`Switch to "${imported.username}"?`)) {
            loadPlayer(imported.username);
          }
        }
      } catch (error) {
        alert(`❌ Failed to import character: ${error}`);
      }
    };
    
    input.click();
  };

  const handleDelete = (username: string) => {
    if (username === currentUser) {
      alert('Cannot delete currently active character');
      return;
    }
    
    if (confirm(`⚠️ Delete character "${username}"? This cannot be undone!`)) {
      if (deleteCharacter(username)) {
        alert(`✅ Character "${username}" deleted`);
        refreshCharacters();
      }
    }
  };

  const handleLoad = (username: string) => {
    if (username === currentUser) {
      alert('This character is already loaded');
      return;
    }
    
    if (confirm(`Switch to character "${username}"?`)) {
      if (loadPlayer(username)) {
        alert(`✅ Loaded character "${username}"`);
        setShowManager(false);
      } else {
        alert('❌ Failed to load character');
      }
    }
  };

  return (
    <div className="relative inline-block">
      {/* Toggle Button */}
      <button
        onClick={() => {
          setShowManager(!showManager);
          if (!showManager) refreshCharacters();
        }}
        className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-2 border-teal-700 px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        title="Character Manager"
      >
        <span className="text-base">💾</span>
        <span className="ml-1.5 text-xs font-semibold">Chars</span>
      </button>

      {/* Manager Panel */}
      {showManager && (
        <div className="absolute top-14 right-0 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-teal-600 rounded-lg shadow-2xl w-96 p-5 animate-scale-in z-50">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-teal-300">
            <h3 className="text-lg font-bold text-teal-900">Character Manager</h3>
            <button
              onClick={() => setShowManager(false)}
              className="text-teal-600 hover:text-teal-900 text-xl transition-all duration-300 hover:scale-110"
            >
              ✕
            </button>
          </div>

          {/* Current Character */}
          {currentUser && (
            <div className="mb-4 p-3 bg-gradient-to-br from-orange-200 to-amber-200 border-2 border-orange-500 rounded-lg hover-lift">
              <div className="text-xs text-orange-800 mb-1 font-semibold">Current Character</div>
              <div className="font-bold text-orange-900">{currentUser}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={handleExportCurrent}
              disabled={!currentUser}
              className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white border-2 border-teal-700 disabled:border-gray-500 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
            >
              📥 Export Current
            </button>
            <button
              onClick={handleImport}
              className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-2 border-orange-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              📤 Import Character
            </button>
            <button
              onClick={handleExportAll}
              className="col-span-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-2 border-purple-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              📦 Export All Characters
            </button>
          </div>

          {/* Character List */}
          <div className="border-t-2 border-teal-300 pt-4">
            <div className="text-xs text-teal-700 mb-2 font-semibold">
              Saved Characters ({characters.length})
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {characters.length === 0 ? (
                <div className="text-xs text-teal-600 italic text-center py-4">
                  No characters found. Create a new character or import one.
                </div>
              ) : (
                characters.map((char) => (
                  <div
                    key={char.username}
                    className={`p-2 rounded border ${
                      char.username === currentUser
                        ? 'bg-gold-light border-gold-dark'
                        : 'bg-parchment-200 border-medieval-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-medieval-900">
                          {char.username}
                          {char.username === currentUser && (
                            <span className="ml-2 text-xs text-gold-dark">● Active</span>
                          )}
                        </div>
                        <div className="text-xs text-medieval-700 mt-1 space-y-0.5">
                          <div>⭐ Level {char.level} | 💰 {char.gold} gold</div>
                          <div>📍 {char.location}</div>
                          <div className="text-[10px] text-medieval-600">
                            Last saved: {new Date(char.lastSaved).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 ml-2">
                        {char.username !== currentUser && (
                          <button
                            onClick={() => handleLoad(char.username)}
                            className="bg-blue-100 hover:bg-blue-200 border border-blue-600 px-2 py-1 rounded text-xs"
                            title="Load this character"
                          >
                            Load
                          </button>
                        )}
                        <button
                          onClick={() => exportCharacter(char.username)}
                          className="bg-green-100 hover:bg-green-200 border border-green-600 px-2 py-1 rounded text-xs"
                          title="Export this character"
                        >
                          Export
                        </button>
                        {char.username !== currentUser && (
                          <button
                            onClick={() => handleDelete(char.username)}
                            className="bg-red-100 hover:bg-red-200 border border-red-600 px-2 py-1 rounded text-xs"
                            title="Delete this character"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Storage Info */}
          <div className="mt-3 pt-3 border-t border-medieval-300">
            <div className="text-[10px] text-medieval-600 text-center">
              💾 Characters saved to:<br />
              <span className="font-mono">Documents/Legends of Revenue/Characters/</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
