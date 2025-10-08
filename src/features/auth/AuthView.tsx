import React, { useState } from 'react';
import { useSessionStore } from '../../state/sessionStore';
import { usePlayerStore } from '../../state/playerStore';
import { useWorldStore } from '../../state/worldStore';
import { useAchievementStore } from '../../state/achievementStore';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  
  const { register, login } = useSessionStore();
  const { initializePlayer, loadPlayer } = usePlayerStore();
  const { loadWorld } = useWorldStore();
  const { loadAchievements } = useAchievementStore();
  
  // MIRA agent themed character suggestions (fantasy names)
  const characterSuggestions = [
    "Agent Enforcer",
    "Revenue Hawk",
    "Tax Guardian",
    "Audit Phantom Hunter",
    "MIRA Sentinel",
    "Compliance Knight",
    "Justice Collector",
    "Asset Tracker",
    "Fraud Buster",
    "Revenue Paladin"
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }
    
    if (isLogin) {
      const success = login(username, password);
      if (success) {
        const loaded = loadPlayer(username);
        if (!loaded) {
          // New player, initialize
          initializePlayer(username);
        }
        // Always try to load world state and achievements
        loadWorld(username);
        loadAchievements(username);
        (window as any).__currentUsername = username;
      }
    } else {
      const success = register(username, password);
      if (success) {
        alert('Registration successful! Please login.');
        setIsLogin(true);
        setPassword('');
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-900 to-emerald-950">
      <div className="panel max-w-md w-full p-8">
        <h1 className="font-medieval text-4xl text-center text-gold mb-2">
          Legends of Revenue
        </h1>
        <p className="text-center text-parchment-700 mb-8 font-body">
          MIRA Chronicles
        </p>
        
        {!isLogin && (
          <div className="mb-6 p-4 bg-emerald-100 border-2 border-emerald-600 rounded">
            <p className="text-sm font-body text-emerald-900 mb-2">
              <strong>⚖️ Join MIRA!</strong>
            </p>
            <p className="text-xs font-body text-emerald-800 mb-2">
              Create a Revenue Agent and fight tax evasion across the Maldives. Recover hidden assets and bring criminals to justice!
            </p>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-xs text-emerald-700 hover:text-gold underline"
              >
                {showHelp ? 'Hide' : 'Show'} Character Ideas
              </button>
            </div>
            {showHelp && (
              <div className="mt-2 text-xs font-body text-emerald-800 space-y-1">
                {characterSuggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gold">•</span>
                    <button
                      type="button"
                      onClick={() => setUsername(suggestion)}
                      className="hover:text-gold hover:underline text-left"
                    >
                      {suggestion}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-brown-800 font-body mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border-2 border-brown-600 rounded bg-parchment-100 text-brown-900 font-body focus:outline-none focus:border-gold"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-brown-800 font-body mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-brown-600 rounded bg-parchment-100 text-brown-900 font-body focus:outline-none focus:border-gold"
              placeholder="Enter password"
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-700 hover:text-gold font-body underline"
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
