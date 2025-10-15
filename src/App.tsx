import { useEffect, useState } from 'react';
import { useSessionStore } from './state/sessionStore';
import { useWorldStore } from './state/worldStore';
import { AuthView } from './features/auth/AuthView';
import { HomeView } from './features/home/HomeView';
import { MapView } from './features/map/MapView';
import { CombatView } from './features/combat/CombatView';
import { CharacterView } from './features/character/CharacterView';
import { MarketView } from './features/market/MarketView';
import { PlayersView } from './features/players/PlayersView';
import { ClassesView } from './features/classes/ClassesView';
import { AchievementNotification } from './features/achievements/AchievementNotification';
import { MenuBar, type MenuOption } from './components/MenuBar';

function App() {
  const { isAuthenticated, loadSession } = useSessionStore();
  const { gameMode } = useWorldStore();
  const [activeView, setActiveView] = useState<MenuOption>('home');
  
  // Load session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);
  
  if (!isAuthenticated) {
    return <AuthView />;
  }
  
  // Render current view
  const renderView = () => {
    // Combat always takes priority when in combat mode
    if (gameMode === 'combat') {
      return <CombatView />;
    }
    
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'map':
        return <MapView />;
      case 'character':
        return <CharacterView />;
      case 'market':
        return <MarketView />;
      case 'players':
        return <PlayersView />;
      case 'classes':
        return <ClassesView />;
      default:
        return <MapView />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
      {/* Menu Bar - Sticky */}
      <MenuBar activeView={activeView} onNavigate={setActiveView} />
      
      {/* Main Content - Responsive padding and safe scrolling */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          {renderView()}
        </div>
      </main>
      
      {/* Achievement Notifications */}
      <AchievementNotification />
    </div>
  );
}

export default App;
