import React, { useState } from 'react';
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
  if (encounterRate === 0) return { text: 'Safe', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-600' };
  if (encounterRate <= 0.15) return { text: 'Low', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-600' };
  if (encounterRate <= 0.4) return { text: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-600' };
  if (encounterRate <= 0.6) return { text: 'High', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-600' };
  return { text: 'Very High', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-600' };
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
  
  const [showAllLocations, setShowAllLocations] = useState(false);
  
  const tile = getCurrentTile();
  const neighbors = tile?.neighbors || [];
  const danger = getDangerLevel(tile?.encounterRate || 0);
  const currentProgress = getLocationProgress(currentTile);
  const stepsRemaining = Math.max(0, 10 - currentProgress);
  const isFullyExplored = currentProgress >= 10;
  
  return (
    <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 animate-fade-in">
      {/* Current Location Header - Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-600 rounded-xl shadow-xl p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-3">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="text-4xl sm:text-5xl md:text-6xl flex-shrink-0">{getLocationIcon(tile?.type || '')}</div>
            <div className="flex-1 min-w-0">
              <h2 className="font-medieval text-2xl sm:text-3xl bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                {tile?.name || 'Unknown Location'}
              </h2>
              <p className="font-body text-sm sm:text-base text-brown-800 leading-relaxed">
                {tile?.description}
              </p>
            </div>
          </div>
          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${danger.bg} border-2 ${danger.border} shadow-md flex-shrink-0`}>
            <div className="text-center">
              <div className={`font-bold ${danger.color} text-xs sm:text-sm`}>Danger</div>
              <div className={`font-bold ${danger.color} text-base sm:text-lg`}>{danger.text}</div>
            </div>
          </div>
        </div>
        
        {/* Exploration Progress */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border-2 border-teal-600 p-3 sm:p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medieval text-sm sm:text-base text-teal-900 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🗺️</span>
              <span className="hidden sm:inline">Exploration Progress</span>
              <span className="sm:hidden">Progress</span>
            </span>
            <span className="font-bold text-teal-700 text-lg sm:text-xl">{currentProgress}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 border-2 border-teal-700 overflow-hidden shadow-inner mb-2">
            <div 
              className="h-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all duration-500 shadow-lg"
              style={{ width: `${(currentProgress / 10) * 100}%` }}
            />
          </div>
          {!isFullyExplored && (
            <p className="text-xs sm:text-sm text-teal-800 font-body">
              📍 Take {stepsRemaining} more step{stepsRemaining !== 1 ? 's' : ''} to unlock new locations!
            </p>
          )}
          {isFullyExplored && (
            <p className="text-xs sm:text-sm text-teal-800 font-body font-bold">
              ✅ Fully explored! All neighboring locations are now accessible.
            </p>
          )}
        </div>
        
        {/* Take Step Button */}
        <button
          onClick={takeStep}
          className="w-full mt-3 sm:mt-4 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg cursor-pointer border-2 border-teal-700 shadow-lg hover:shadow-xl transition-all text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
        >
          <span className="text-xl sm:text-2xl">🚶</span>
          <span>Explore This Area</span>
          {tile && tile.encounterRate > 0 && (
            <span className="bg-orange-500 px-3 py-1 rounded-full text-sm">
              {Math.round(tile.encounterRate * 100)}% encounter chance
            </span>
          )}
        </button>
      </div>
      
      {/* Travel Options - Card Grid */}
      <div>
        <h3 className="font-medieval text-xl sm:text-2xl bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent mb-2 sm:mb-3 flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🧭</span>
          <span>Travel to Nearby Locations</span>
        </h3>
        
        {neighbors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {neighbors.map((neighborId: string) => {
              const neighborTile = mapData.find(t => t.id === neighborId);
              const neighborDanger = getDangerLevel(neighborTile?.encounterRate || 0);
              const isUnlocked = isLocationUnlocked(neighborId);
              const neighborProgress = getLocationProgress(neighborId);
              
              return (
                <button
                  key={neighborId}
                  onClick={() => isUnlocked && moveTo(neighborId)}
                  disabled={!isUnlocked}
                  className={`text-left p-3 sm:p-5 rounded-xl border-2 transition-all shadow-lg ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-white to-orange-50 border-orange-600 hover:border-teal-600 hover:shadow-xl cursor-pointer transform hover:-translate-y-1' 
                      : 'bg-gray-200 border-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-5xl flex-shrink-0">{isUnlocked ? getLocationIcon(neighborTile?.type || '') : '🔒'}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medieval text-lg sm:text-xl text-brown-900 mb-1 flex items-center gap-2 flex-wrap">
                        {neighborTile?.name}
                        {isUnlocked && neighborProgress < 10 && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                            {neighborProgress}/10
                          </span>
                        )}
                      </h4>
                      {isUnlocked && neighborTile && (
                        <p className="font-body text-sm text-brown-700 mb-2 line-clamp-2">
                          {neighborTile.description}
                        </p>
                      )}
                      {!isUnlocked && (
                        <p className="font-body text-sm text-gray-600 italic">
                          🔒 Explore current area to unlock
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${neighborDanger.bg} ${neighborDanger.color} border ${neighborDanger.border}`}>
                          {neighborDanger.text} Danger
                        </span>
                        {isUnlocked && (
                          <span className="text-teal-600 font-bold">→ Click to travel</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-100 border-2 border-gray-400 rounded-xl p-8 text-center">
            <div className="text-6xl mb-3">🚫</div>
            <p className="font-body text-gray-600">No paths available from this location</p>
          </div>
        )}
      </div>
      
      {/* World Map Overview - Collapsible */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-600 rounded-xl shadow-xl p-5">
        <button
          onClick={() => setShowAllLocations(!showAllLocations)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="font-medieval text-2xl bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-3xl">🗺️</span>
            <span>Full World Map</span>
          </h3>
          <span className="text-3xl transform transition-transform" style={{ transform: showAllLocations ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ⬇️
          </span>
        </button>
        
        {showAllLocations && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
            {mapData.map((location) => {
              const isCurrentLocation = location.id === tile?.id;
              const isNeighbor = neighbors.includes(location.id);
              const locationDanger = getDangerLevel(location.encounterRate);
              const locationUnlocked = isLocationUnlocked(location.id);
              const locationSteps = getLocationProgress(location.id);
              
              return (
                <button
                  key={location.id}
                  onClick={() => locationUnlocked && !isCurrentLocation && moveTo(location.id)}
                  disabled={!locationUnlocked || isCurrentLocation}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isCurrentLocation 
                      ? 'bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-600 shadow-lg cursor-default' 
                      : isNeighbor && locationUnlocked
                      ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-400 hover:border-teal-600 hover:shadow-lg cursor-pointer transform hover:-translate-y-1'
                      : locationUnlocked
                      ? 'bg-white border-gray-300 hover:border-teal-600 hover:shadow-lg cursor-pointer transform hover:-translate-y-1'
                      : 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{locationUnlocked ? getLocationIcon(location.type) : '🔒'}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medieval text-sm font-bold text-brown-900 truncate flex items-center gap-1">
                        {location.name}
                        {isCurrentLocation && <span className="text-xs">⬅ You</span>}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${locationDanger.bg} ${locationDanger.color}`}>
                          {locationDanger.text}
                        </span>
                        {locationUnlocked && locationSteps < 10 && (
                          <span className="text-[10px] text-gray-600">
                            ({locationSteps}/10)
                          </span>
                        )}
                        {locationUnlocked && !isCurrentLocation && (
                          <span className="text-[10px] text-teal-600 font-bold">
                            Click to travel
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        
        <p className="text-sm text-purple-800 mt-4 text-center italic font-body">
          💡 Explore locations to discover new areas and unlock your journey
        </p>
      </div>
    </div>
  );
};
