import React from 'react';
import { useWorldStore } from '../../state/worldStore';

// Location type icons and danger levels
const getLocationIcon = (type: string) => {
  switch (type) {
    case 'hub': return '🏰';
    case 'town': return '🏘️';
    case 'wilderness': return '🌲';
    case 'dungeon': return '⚔️';
    default: return '📍';
  }
};

const getDangerLevel = (encounterRate: number) => {
  if (encounterRate === 0) return { text: 'Safe', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  if (encounterRate <= 0.15) return { text: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
  if (encounterRate <= 0.4) return { text: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  if (encounterRate <= 0.6) return { text: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
  return { text: 'Very High', color: 'text-red-600', bg: 'bg-red-100' };
};

export const MapView: React.FC = () => {
  const { 
    currentTile, 
    mapData, 
    moveTo, 
    takeStep, 
    getCurrentTile, 
    getLocationProgress, 
    isLocationUnlocked 
  } = useWorldStore();
  
  const tile = getCurrentTile();
  const neighbors = tile?.neighbors || [];
  const danger = getDangerLevel(tile?.encounterRate || 0);
  const currentProgress = getLocationProgress(currentTile);
  const stepsRemaining = Math.max(0, 10 - currentProgress);
  const isFullyExplored = currentProgress >= 10;
  
  return (
    <div className="panel p-3">
      {/* Current Location - Compact Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-medieval text-lg text-gold flex items-center gap-1.5">
            <span className="text-2xl">{getLocationIcon(tile?.type || '')}</span>
            {tile?.name || 'Unknown Location'}
          </h2>
          <div className={`px-2 py-0.5 rounded-full text-xs ${danger.bg} border ${danger.color.replace('text-', 'border-')}`}>
            <span className={`font-bold ${danger.color}`}>
              {danger.text}
            </span>
          </div>
        </div>
        
        <p className="font-body text-xs text-brown-800 mb-2">
          {tile?.description}
        </p>
        
        {/* Exploration Progress - Compact */}
        <div className="mb-2 p-2 bg-emerald-100 rounded border border-emerald-600">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-emerald-900">
              🗺️ Exploration:
            </span>
            <span className="text-xs font-bold text-emerald-700">
              {currentProgress}/10
            </span>
          </div>
          <div className="w-full bg-parchment-200 rounded-full h-2 border border-emerald-700 overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all"
              style={{ width: `${(currentProgress / 10) * 100}%` }}
            />
          </div>
          {!isFullyExplored && (
            <p className="text-[10px] text-emerald-800 mt-1">
              {stepsRemaining} more step{stepsRemaining !== 1 ? 's' : ''} to unlock neighbors
            </p>
          )}
          {isFullyExplored && (
            <p className="text-[10px] text-emerald-800 mt-1">
              ✅ Fully explored!
            </p>
          )}
        </div>
        
        {/* Take Step Button - Compact */}
        {!isFullyExplored && (
          <button
            onClick={takeStep}
            className="btn-primary w-full py-1.5 text-sm mb-2"
          >
            🚶 Take a Step {tile && tile.encounterRate > 0 && `(${Math.round(tile.encounterRate * 100)}%)`}
          </button>
        )}
        
        {/* Encounter Rate Display - Compact */}
        {tile && tile.encounterRate > 0 && (
          <div className="flex items-center gap-2 text-xs font-body text-brown-700">
            <span>⚠️</span>
            <div className="flex-1 bg-parchment-200 rounded-full h-2 border border-brown-600 overflow-hidden">
              <div 
                className={`h-full ${danger.color.replace('text-', 'bg-')} transition-all`}
                style={{ width: `${tile.encounterRate * 100}%` }}
              />
            </div>
            <span className="font-bold text-xs">{Math.round(tile.encounterRate * 100)}%</span>
          </div>
        )}
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        
        {/* Left: Navigation Options */}
        <div>
          <h3 className="font-medieval text-sm text-emerald-800 mb-1 border-b border-brown-400 pb-1">
            🧭 Available Paths
          </h3>
          
          <div className="space-y-1">
            {neighbors.map((neighborId: string) => {
              const neighborTile = mapData.find(t => t.id === neighborId);
              const neighborDanger = getDangerLevel(neighborTile?.encounterRate || 0);
              const isUnlocked = isLocationUnlocked(neighborId);
              
              return (
                <button
                  key={neighborId}
                  onClick={() => isUnlocked && moveTo(neighborId)}
                  disabled={!isUnlocked}
                  className={`w-full text-left flex items-center justify-between group px-2 py-1.5 rounded transition-all text-xs ${
                    isUnlocked 
                      ? 'bg-parchment-200 hover:bg-parchment-300 border border-brown-600 hover:border-gold' 
                      : 'bg-gray-200 text-gray-500 border border-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-base">{getLocationIcon(neighborTile?.type || '')}</span>
                    <span className="truncate font-semibold">{isUnlocked ? '→' : '🔒'} {neighborTile?.name}</span>
                  </span>
                  {isUnlocked && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${neighborDanger.bg} ${neighborDanger.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      {neighborDanger.text}
                    </span>
                  )}
                </button>
              );
            })}
            
            {neighbors.length === 0 && (
              <p className="text-xs text-brown-600 italic text-center py-2">
                No paths available
              </p>
            )}
          </div>
        </div>
        
        {/* Right: World Map Overview */}
        <div>
          <h3 className="font-medieval text-sm text-emerald-800 mb-1 border-b border-brown-400 pb-1">
            📜 World Map
          </h3>
          
          <div className="space-y-0.5 text-[10px] font-body max-h-[500px] overflow-y-auto pr-1">
            {mapData.map((location) => {
              const isCurrentLocation = location.id === tile?.id;
              const isNeighbor = neighbors.includes(location.id);
              const locationDanger = getDangerLevel(location.encounterRate);
              const locationUnlocked = isLocationUnlocked(location.id);
              const locationSteps = getLocationProgress(location.id);
              
              return (
                <div
                  key={location.id}
                  className={`p-1.5 rounded flex items-center justify-between ${
                    isCurrentLocation 
                      ? 'bg-gold text-brown-900 font-bold border border-emerald-700' 
                      : isNeighbor
                      ? locationUnlocked
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-600'
                        : 'bg-gray-200 text-gray-600 border border-gray-400'
                      : locationUnlocked
                      ? 'bg-parchment-100 text-brown-700 opacity-60'
                      : 'bg-gray-100 text-gray-500 opacity-40'
                  }`}
                >
                  <span className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-sm">{locationUnlocked ? getLocationIcon(location.type) : '🔒'}</span>
                    <span className="truncate">{location.name}</span>
                    {isCurrentLocation && <span className="text-[9px]">⬅ Here</span>}
                    {locationUnlocked && locationSteps < 10 && (
                      <span className="text-[9px]">({locationSteps}/10)</span>
                    )}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${locationDanger.bg} ${locationDanger.color}`}>
                    {locationDanger.text}
                  </span>
                </div>
              );
            })}
          </div>
          
          <p className="text-[10px] text-brown-600 mt-2 text-center italic">
            Explore to discover new locations
          </p>
        </div>
      </div>
    </div>
  );
};
