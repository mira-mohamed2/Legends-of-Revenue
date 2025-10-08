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
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => {
          setShowManager(!showManager);
          if (!showManager) refreshCharacters();
        }}
        className="bg-parchment-300 hover:bg-parchment-400 border-2 border-medieval-800 px-3 py-2 rounded-lg shadow-lg transition-colors"
        title="Character Manager"
      >
        <span className="text-xl">💾</span>
        <span className="ml-2 text-sm font-semibold">Characters</span>
      </button>

      {/* Manager Panel */}
      {showManager && (
        <div className="absolute top-12 right-0 bg-parchment-100 border-2 border-medieval-800 rounded-lg shadow-2xl w-96 p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-medieval-300">
            <h3 className="text-lg font-bold text-medieval-900">Character Manager</h3>
            <button
              onClick={() => setShowManager(false)}
              className="text-medieval-600 hover:text-medieval-900 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Current Character */}
          {currentUser && (
            <div className="mb-4 p-3 bg-gold-light border border-gold-dark rounded">
              <div className="text-xs text-medieval-700 mb-1">Current Character</div>
              <div className="font-bold text-medieval-900">{currentUser}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={handleExportCurrent}
              disabled={!currentUser}
              className="bg-blue-100 hover:bg-blue-200 disabled:bg-gray-200 border border-blue-600 px-3 py-2 rounded text-sm transition-colors disabled:cursor-not-allowed"
            >
              📥 Export Current
            </button>
            <button
              onClick={handleImport}
              className="bg-green-100 hover:bg-green-200 border border-green-600 px-3 py-2 rounded text-sm transition-colors"
            >
              📤 Import Character
            </button>
            <button
              onClick={handleExportAll}
              className="col-span-2 bg-purple-100 hover:bg-purple-200 border border-purple-600 px-3 py-2 rounded text-sm transition-colors"
            >
              📦 Export All Characters
            </button>
          </div>

          {/* Character List */}
          <div className="border-t-2 border-medieval-300 pt-3">
            <div className="text-xs text-medieval-700 mb-2 font-semibold">
              Saved Characters ({characters.length})
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {characters.length === 0 ? (
                <div className="text-xs text-medieval-600 italic text-center py-4">
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
