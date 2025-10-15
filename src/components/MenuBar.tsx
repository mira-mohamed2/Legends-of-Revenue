import React from 'react';
import { usePlayerStore } from '../state/playerStore';
import { useSessionStore } from '../state/sessionStore';
import { useWorldStore } from '../state/worldStore';
import CharacterManager from './CharacterManager';

export type MenuOption = 'home' | 'map' | 'character' | 'market' | 'players' | 'classes';

interface MenuBarProps {
  activeView: MenuOption;
  onNavigate: (view: MenuOption) => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ activeView, onNavigate }) => {
  const { stats, savePlayer } = usePlayerStore();
  const { currentUser, logout } = useSessionStore();
  const { saveWorld } = useWorldStore();
  
  const menuItems = [
    { id: 'home' as MenuOption, label: 'Home', icon: '🏛️', available: true },
    { id: 'map' as MenuOption, label: 'Map', icon: '🗺️', available: true },
    { id: 'character' as MenuOption, label: 'Character', icon: '👤', available: true },
    { id: 'market' as MenuOption, label: 'Market', icon: '🏪', available: true },
    { id: 'players' as MenuOption, label: 'Players', icon: '👥', available: false }, // Coming soon
    { id: 'classes' as MenuOption, label: 'Classes', icon: '⚔️', available: false }, // Coming soon
  ];
  
  return (
    <>
      <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-b-4 border-amber-700 shadow-xl animate-fade-in">
        <div className="w-full">
        {/* Logo Row - Separate on mobile */}
        <div className="flex items-center justify-center py-1.5 border-b border-amber-300 min-[480px]:hidden px-2">
          <div className="flex items-center gap-1">
            <span className="text-lg">💰</span>
            <h1 className="font-medieval text-sm text-amber-900">
              Legends of Revenue
            </h1>
          </div>
        </div>
        
        {/* Top Row: Logo, Stats, and Actions */}
        <div className="flex items-center justify-between py-2 sm:py-3 border-b-2 border-amber-400 gap-1.5 sm:gap-2 px-2 sm:px-4">
          {/* Logo - Hidden on mobile (shown above), visible on larger screens */}
          <div className="hidden min-[480px]:flex items-center gap-1 flex-shrink-0">
            <span className="text-lg sm:text-2xl">💰</span>
            <h1 className="font-medieval text-xs sm:text-base md:text-lg text-amber-900">
              Legends of Revenue
            </h1>
          </div>
          
          {/* Player Stats - Centered, Scrollable on tiny screens */}
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-body flex-1 justify-center overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-0.5 bg-white px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md border-2 border-teal-600 shadow-sm flex-shrink-0 min-h-[36px]">
              <span className="text-teal-700 hidden min-[480px]:inline text-sm">👤</span>
              <span className="font-bold text-teal-900 truncate max-w-[50px] min-[480px]:max-w-[80px] sm:max-w-none">
                {currentUser || 'Agent'}
              </span>
            </div>
            <div className="flex items-center gap-0.5 bg-white px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md border-2 border-purple-600 shadow-sm flex-shrink-0 min-h-[36px]">
              <span className="text-purple-600 hidden min-[480px]:inline text-sm">⭐</span>
              <span className="font-bold text-purple-900">Lv{stats.level}</span>
            </div>
            <div className="flex items-center gap-0.5 bg-gradient-to-br from-yellow-200 to-orange-300 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md border-2 border-orange-500 shadow-sm flex-shrink-0 min-h-[36px]">
              <span className="text-xs sm:text-base">💰</span>
              <span className="font-bold text-orange-900">{stats.gold}</span>
            </div>
            <div className="hidden md:flex items-center gap-1 bg-gradient-to-br from-red-100 to-pink-100 px-2.5 py-1.5 rounded-md border-2 border-red-500 shadow-sm flex-shrink-0 min-h-[36px]">
              <span>❤️</span>
              <span className="font-bold text-red-700">{stats.hp}/{stats.maxHp}</span>
            </div>
          </div>
          
          {/* Actions - Right Side */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Character Manager Button */}
            <CharacterManager />
            
            {/* Logout - Icon only on mobile */}
            <button
              className="px-2 sm:px-3 py-2 rounded-md bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 font-body text-xs font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 border-2 border-red-700 min-h-[36px] min-w-[36px]"
              onClick={() => {
                if (confirm('Logout? Your progress will be saved automatically.')) {
                  // Save player data and world state before logout
                  savePlayer();
                  saveWorld();
                  
                  // Clear session
                  logout();
                  
                  // Reload to show login screen
                  window.location.reload();
                }
              }}
              title="Logout"
            >
              <span className="hidden min-[480px]:inline">Logout</span>
              <span className="min-[480px]:hidden text-sm">🚪</span>
            </button>
          </div>
        </div>
        
        {/* Bottom Row: Menu Navigation - Improved for mobile */}
        <div className="flex items-center justify-start sm:justify-center py-2 sm:py-2.5 bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 overflow-x-auto scrollbar-hide px-2 sm:px-4">
          <nav className="flex gap-1.5 sm:gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.available && onNavigate(item.id)}
                disabled={!item.available}
                className={`
                  px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medieval transition-all duration-200 text-xs sm:text-sm font-semibold border-2 whitespace-nowrap flex-shrink-0 min-h-[40px] flex items-center justify-center
                  ${activeView === item.id
                    ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg scale-105 border-teal-700'
                    : item.available
                      ? 'bg-white text-teal-900 hover:bg-teal-50 hover:shadow-md active:scale-95 border-teal-500'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50 border-gray-300'
                  }
                `}
                title={!item.available ? 'Coming Soon!' : item.label}
              >
                <span className="text-sm sm:text-base">{item.icon}</span>
                <span className="hidden min-[380px]:inline ml-1">{item.label}</span>
                {!item.available && (
                  <span className="hidden sm:inline ml-1 text-[9px]">(Soon)</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        </div>
      </div>
    </>
  );
};
