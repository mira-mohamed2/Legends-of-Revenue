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
      {/* Character Manager - Floating Button */}
      <CharacterManager />
      
      <div className="bg-parchment-dark border-b-4 border-brown shadow-lg">
        <div className="container mx-auto px-4">
        {/* Top Row: Logo and Player Stats */}
        <div className="flex items-center justify-between py-2 border-b border-brown-400">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h1 className="font-medieval text-lg text-gold hidden md:block">
              Legends of Revenue
            </h1>
          </div>
          
          {/* Player Stats */}
          <div className="flex items-center gap-3 text-xs font-body">
            <div className="flex items-center gap-1 bg-parchment-200 px-2 py-1 rounded border border-brown-600">
              <span className="text-brown-600">👤</span>
              <span className="font-bold text-brown-900">{currentUser || 'Agent'}</span>
            </div>
            <div className="flex items-center gap-1 bg-parchment-200 px-2 py-1 rounded border border-brown-600">
              <span className="text-brown-600">⭐</span>
              <span className="font-bold text-brown-900">Lv {stats.level}</span>
            </div>
            <div className="flex items-center gap-1 bg-gold-light px-2 py-1 rounded border border-gold">
              <span>💰</span>
              <span className="font-bold text-brown-900">{stats.gold}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-red-100 px-2 py-1 rounded border border-red-600">
              <span>❤️</span>
              <span className="font-bold text-red-700">{stats.hp}/{stats.maxHp}</span>
            </div>
          </div>
          
          {/* Logout */}
          <button
            className="px-2 py-1 rounded bg-red-700 text-white hover:bg-red-800 font-body text-xs"
            onClick={() => {
              if (confirm('Logout? Your progress is saved.')) {
                window.location.reload();
              }
            }}
          >
            Logout
          </button>
        </div>
        
        {/* Bottom Row: Menu Navigation */}
        <div className="flex items-center justify-center py-2">
          <nav className="flex gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.available && onNavigate(item.id)}
                disabled={!item.available}
                className={`
                  px-3 py-1.5 rounded font-medieval transition-all text-sm
                  ${activeView === item.id
                    ? 'bg-gold text-brown shadow-md'
                    : item.available
                      ? 'bg-parchment-200 text-brown hover:bg-parchment-300 hover:shadow'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
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
