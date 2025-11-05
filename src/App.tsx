import { useEffect, useState } from 'react';
import { useWorldStore } from './state/worldStore';
import { useQuestStore } from './state/questStore';
import { useAchievementStore } from './state/achievementStore';
import { HomeView } from './features/home/HomeView';
import { MapView } from './features/map/MapView';
import { CombatView } from './features/combat/CombatView';
import { CharacterView } from './features/character/CharacterView';
import { MarketView } from './features/market/MarketView';
import { PlayersView } from './features/players/PlayersView';
import { ClassesView } from './features/classes/ClassesView';
import { AchievementNotification } from './features/achievements/AchievementNotification';
import { MenuBar, type MenuOption } from './components/MenuBar';
import LoginRegistrationForm from './components/LoginRegistrationForm';
import { AdminPanel } from './components/AdminPanel';
import { Leaderboard } from './components/Leaderboard';
import { loadFromCSV, exportToCSV, updateCharacterData, type Player } from './utils/database';
import { usePlayerStore } from './state/playerStore';

function App() {
  const { gameMode } = useWorldStore();
  const [activeView, setActiveView] = useState<MenuOption>('home');
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load CSV data on app startup
  useEffect(() => {
    const initializeApp = async () => {
      console.log('📂 Loading data from JSON...');
      await loadFromCSV(); // Note: This now loads JSON internally
      
      // Check if user was logged in
      const userData = localStorage.getItem('current_user');
      if (userData) {
        try {
          const user = JSON.parse(userData) as Player;
          setCurrentUser(user);
          
          // Restore character data if available
          if (user.characterData) {
            usePlayerStore.setState({
              stats: user.characterData.stats,
              equipment: user.characterData.equipment,
              inventory: user.characterData.inventory,
              location: user.characterData.location,
              enemiesKilled: user.characterData.enemiesKilled,
              avatar: user.characterData.avatar,
              customAvatar: user.characterData.customAvatar,
            });
            
            // Restore world state
            if (user.characterData.worldState) {
              useWorldStore.setState(user.characterData.worldState);
              console.log(`🗺️ Restored world state for ${user.username}`);
            } else {
              // First time login or old data - start with defaults
              useWorldStore.getState().resetWorld();
              console.log(`🗺️ New world state for ${user.username}`);
            }
            
            // Restore quest state
            if (user.characterData.questState) {
              useQuestStore.setState(user.characterData.questState);
              console.log(`📜 Restored quest state for ${user.username}`);
            } else {
              // First time login or old data - quests will initialize from defaults
              console.log(`📜 New quest state for ${user.username}`);
            }
            
            // Restore achievements
            if (user.characterData.achievements) {
              const achievementStore = useAchievementStore.getState();
              achievementStore.loadAchievements(user.username);
              
              // Merge saved achievements with default list
              useAchievementStore.setState({
                achievements: achievementStore.achievements.map(achievement => {
                  const saved = user.characterData!.achievements!.find(a => a.id === achievement.id);
                  if (saved) {
                    return {
                      ...achievement,
                      unlocked: saved.unlocked,
                      unlockedAt: saved.unlockedAt,
                    };
                  }
                  return achievement;
                }),
              });
              console.log(`🏆 Restored achievements for ${user.username}`);
            } else {
              // Initialize username for saving later
              useAchievementStore.getState().loadAchievements(user.username);
              console.log(`🏆 New achievements for ${user.username}`);
            }
            
            // Restore question history to localStorage (for CombatView to load)
            if (user.characterData.questionHistory) {
              localStorage.setItem(
                `questionHistory:${user.username}`,
                JSON.stringify(user.characterData.questionHistory)
              );
              console.log(`📝 Restored question history for ${user.username} (${user.characterData.questionHistory.answeredQuestions.length} questions answered)`);
            }
            
            console.log(`✅ Restored character data for ${user.username}`);
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('current_user');
        }
      }
      
      setIsLoading(false);
    };
    
    initializeApp();
  }, []);
  
  // Handle new player (logout) - Save character data to Dexie and export to CSV
  const handleNewPlayer = async () => {
    if (currentUser) {
      console.log('💾 Saving character data before logout...');
      
      // Get latest stats from store
      const latestStats = usePlayerStore.getState();
      const worldState = useWorldStore.getState();
      const questState = useQuestStore.getState();
      const achievementState = useAchievementStore.getState();
      
      // Get question history from localStorage
      const questionHistoryData = localStorage.getItem(`questionHistory:${currentUser.username}`);
      let questionHistory = undefined;
      if (questionHistoryData) {
        try {
          questionHistory = JSON.parse(questionHistoryData);
        } catch (e) {
          console.error('Failed to parse question history:', e);
        }
      }
      
      // Save current character data to Dexie (including world, quest, achievement, and question state)
      await updateCharacterData(currentUser.username, {
        stats: latestStats.stats,
        equipment: latestStats.equipment,
        inventory: latestStats.inventory,
        location: latestStats.location,
        enemiesKilled: latestStats.enemiesKilled,
        avatar: latestStats.avatar,
        customAvatar: latestStats.customAvatar,
        worldState: {
          currentTile: worldState.currentTile,
          locationProgress: worldState.locationProgress,
          unlockedLocations: worldState.unlockedLocations,
        },
        questState: {
          quests: questState.quests,
          activeQuest: questState.activeQuest,
        },
        achievements: achievementState.achievements.map(a => ({
          id: a.id,
          unlocked: a.unlocked,
          unlockedAt: a.unlockedAt,
        })),
        questionHistory,
      });
      
      console.log('📤 Exporting to JSON...');
      // Export to JSON
      try {
        await exportToCSV(); // Note: This now exports JSON internally
        console.log('✅ Character data saved and exported successfully');
      } catch (error) {
        console.error('❌ Failed to export JSON:', error);
        alert('Warning: Failed to export JSON. Data saved to browser database.');
      }
      
      // Clear current session
      localStorage.removeItem('current_user');
      localStorage.removeItem(`questionHistory:${currentUser.username}`);
      setCurrentUser(null);
      
      // Reset all stores to defaults
      usePlayerStore.getState().resetPlayer();
      useWorldStore.getState().resetWorld();
      useAchievementStore.getState().resetAchievements();
      
      console.log('✅ Logged out successfully');
    }
  };
  
  // Show login/registration form if not logged in
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading expo data...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <>
        <LoginRegistrationForm 
          onSuccess={async (user) => {
            console.log('🎮 Login successful, loading character...');
            localStorage.setItem('current_user', JSON.stringify(user));
            
            // If user has character data, restore it
            if (user.characterData) {
              console.log('📦 Restoring character data...');
              usePlayerStore.setState({
                stats: user.characterData.stats,
                equipment: user.characterData.equipment,
                inventory: user.characterData.inventory,
                location: user.characterData.location,
                enemiesKilled: user.characterData.enemiesKilled,
                avatar: user.characterData.avatar,
                customAvatar: user.characterData.customAvatar,
              });
              
              // Restore world state
              if (user.characterData.worldState) {
                useWorldStore.setState(user.characterData.worldState);
                console.log('🗺️ Restored world state');
              } else {
                // First time login - reset to defaults
                useWorldStore.getState().resetWorld();
                console.log('🗺️ New world state (first login)');
              }
              
              // Restore quest state
              if (user.characterData.questState) {
                useQuestStore.setState(user.characterData.questState);
                console.log('📜 Restored quest state');
              } else {
                console.log('📜 New quest state (first login)');
              }
            } else {
              // New character - set defaults
              console.log('🆕 New character, setting defaults...');
              usePlayerStore.setState({
                stats: {
                  level: 1,
                  xp: 0,
                  xpToNext: 100,
                  hp: 100,
                  maxHp: 100,
                  attack: 10,
                  defense: 5,
                  gold: 1000
                },
                equipment: {
                  weapon: null,
                  armor: null,
                  accessory: null
                },
                inventory: [],
                location: 'Elaria (Starting Village)',
                enemiesKilled: 0,
                avatar: 'warrior',
                customAvatar: null
              });
              
              // Reset world and quest state for new character
              useWorldStore.getState().resetWorld();
              console.log('🗺️ New world state (new character)');
            }
            
            setCurrentUser(user);
          }}
        />
        <AdminPanel />
      </>
    );
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
      case 'leaderboard':
        return <Leaderboard />;
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
      <MenuBar 
        activeView={activeView} 
        onNavigate={setActiveView}
        onNewPlayer={handleNewPlayer}
        currentUser={currentUser}
      />
      
      {/* Main Content - Responsive padding and safe scrolling */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          {renderView()}
        </div>
      </main>
      
      {/* Achievement Notifications */}
      <AchievementNotification />
      
      {/* Admin Panel - Available on all screens */}
      <AdminPanel />
    </div>
  );
}

export default App;
