import React from 'react';
import { usePlayerStore } from '../state/playerStore';
import { useSessionStore } from '../state/sessionStore';
import CharacterManager from './CharacterManager';

export type MenuOption = 'map' | 'character' | 'market' | 'players' | 'classes';

interface MenuBarProps {
  activeView: MenuOption;
  onNavigate: (view: MenuOption) => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ activeView, onNavigate }) => {
  const { stats } = usePlayerStore();
  const { currentUser } = useSessionStore();
  
  const menuItems = [
    { id: 'map' as MenuOption, label: 'Map', icon: '🗺️', available: true },
    { id: 'character' as MenuOption, label: 'Character', icon: '👤', available: true },
    { id: 'market' as MenuOption, label: 'Market', icon: '🏪', available: true },
    { id: 'players' as MenuOption, label: 'Players', icon: '👥', available: false }, // Coming soon
    { id: 'classes' as MenuOption, label: 'Classes', icon: '⚔️', available: false }, // Coming soon
  ];
  
  return (
    <>
      <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b-4 border-amber-800 shadow-xl animate-fade-in">
        <div className="container mx-auto px-4">
        {/* Top Row: Logo, Stats, and Actions */}
        <div className="flex items-center justify-between py-3 border-b-2 border-amber-300">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-2xl">💰</span>
            <h1 className="font-medieval text-lg text-amber-900 hidden md:block">
              Legends of Revenue
            </h1>
          </div>
          
          {/* Player Stats - Centered */}
          <div className="flex items-center gap-2 text-xs font-body flex-1 justify-center">
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border-2 border-amber-600 shadow-sm hover-lift">
              <span className="text-amber-700">👤</span>
              <span className="font-bold text-amber-900">{currentUser || 'Agent'}</span>
            </div>
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border-2 border-purple-600 shadow-sm hover-lift">
              <span className="text-purple-600">⭐</span>
              <span className="font-bold text-purple-900">Lv {stats.level}</span>
            </div>
            <div className="flex items-center gap-1 bg-gradient-to-br from-yellow-200 to-amber-300 px-3 py-1.5 rounded-lg border-2 border-yellow-600 shadow-sm hover-lift">
              <span>💰</span>
              <span className="font-bold text-amber-900">{stats.gold}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-gradient-to-br from-red-100 to-pink-100 px-3 py-1.5 rounded-lg border-2 border-red-600 shadow-sm hover-lift">
              <span>❤️</span>
              <span className="font-bold text-red-700">{stats.hp}/{stats.maxHp}</span>
            </div>
          </div>
          
          {/* Actions - Right Side */}
          <div className="flex items-center gap-2 min-w-[200px] justify-end">
            {/* Character Manager Button */}
            <CharacterManager />
            
            {/* Logout */}
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 font-body text-xs font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-red-800"
              onClick={() => {
                if (confirm('Logout? Your progress is saved.')) {
                  window.location.reload();
                }
              }}
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Bottom Row: Menu Navigation */}
        <div className="flex items-center justify-center py-3 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100">
          <nav className="flex gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.available && onNavigate(item.id)}
                disabled={!item.available}
                className={`
                  px-4 py-2 rounded-lg font-medieval transition-all duration-300 text-sm font-semibold border-2
                  ${activeView === item.id
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg transform scale-105 border-emerald-700'
                    : item.available
                      ? 'bg-white text-amber-900 hover:bg-amber-50 hover:shadow-md hover:-translate-y-0.5 border-amber-400'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50 border-gray-300'
                  }
                `}
                title={!item.available ? 'Coming Soon!' : ''}
              >
                <span className="mr-1">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
                {!item.available && (
                  <span className="ml-1 text-[10px]">(Soon)</span>
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
