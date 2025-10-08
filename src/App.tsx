import { useEffect, useState } from 'react';
import { useSessionStore } from './state/sessionStore';
import { useWorldStore } from './state/worldStore';
import { AuthView } from './features/auth/AuthView';
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
  const [activeView, setActiveView] = useState<MenuOption>('map');
  
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950">
      {/* Menu Bar */}
      <MenuBar activeView={activeView} onNavigate={setActiveView} />
      
      {/* Main Content */}
      <div className="container mx-auto">
        {renderView()}
      </div>
      
      {/* Achievement Notifications */}
      <AchievementNotification />
    </div>
  );
}

export default App;
