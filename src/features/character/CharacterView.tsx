import React from 'react';
import { usePlayerStore } from '../../state/playerStore';
import { useAchievementStore } from '../../state/achievementStore';
import itemsData from '../../data/items.json';
import { AvatarSelector } from '../../components/AvatarSelector';

// Rarity color helper
const getRarityColor = (rarity?: string) => {
  switch (rarity) {
    case 'legendary': return 'text-yellow-500 font-bold';
    case 'epic': return 'text-purple-500 font-bold';
    case 'rare': return 'text-blue-500 font-bold';
    case 'uncommon': return 'text-green-600 font-semibold';
    case 'common':
    default: return 'text-gray-600';
  }
};

export const CharacterView: React.FC = () => {
  const { stats, inventory, equipment, heal, removeItem, equipItem, unequipItem } = usePlayerStore();
  const { achievements } = useAchievementStore();
  
  // Calculate equipment bonuses
  const weaponBonus = equipment.weapon 
    ? itemsData.find(i => i.id === equipment.weapon)?.stats?.attack || 0 
    : 0;
  const armorBonus = equipment.armor 
    ? itemsData.find(i => i.id === equipment.armor)?.stats?.defense || 0 
    : 0;
  
  const totalAttack = stats.attack + weaponBonus;
  const totalDefense = stats.defense + armorBonus;
  
  const handleUseItem = (itemId: string) => {
    if (itemId === 'health-potion') {
      heal(20);
      removeItem(itemId, 1);
    }
  };
  
  const handleEquipItem = (itemId: string) => {
    const item = itemsData.find(i => i.id === itemId);
    if (!item) return;
    
    let slot: 'weapon' | 'armor' | 'accessory' | null = null;
    
    if (item.category === 'weapon') {
      slot = 'weapon';
    } else if (item.category === 'armor') {
      slot = 'armor';
    } else if (item.category === 'accessory') {
      slot = 'accessory';
    }
    
    if (slot) {
      equipItem(itemId, slot);
    }
  };
  
  const handleUnequipItem = (slot: 'weapon' | 'armor' | 'accessory') => {
    unequipItem(slot);
  };
  
  return (
    <div className="panel p-3">
      {/* Header with Avatar */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medieval text-xl text-gold">Character</h2>
        <AvatarSelector />
      </div>
      
      {/* Compact 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        
        {/* Left Column: Stats & Equipment */}
        <div className="space-y-3">
          
          {/* Stats - Compact */}
          <div className="bg-parchment-200 p-2 rounded border border-brown-600">
            <h3 className="font-medieval text-sm text-emerald-800 mb-1 border-b border-brown-400 pb-1">📊 Stats</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-body text-xs text-brown-800">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-bold">
                  {stats.level}{stats.level >= 10 && <span className="text-[10px] text-gold"> MAX</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Gold:</span>
                <span className="font-bold text-gold-dark">💰 {stats.gold}</span>
              </div>
              
              {/* HP with inline bar */}
              <div className="col-span-2">
                <div className="flex justify-between mb-0.5">
                  <span>HP:</span>
                  <span className="font-bold text-red-700">{stats.hp}/{stats.maxHp}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 border border-brown-600">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all"
                    style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* XP with inline bar */}
              {stats.level < 10 && (
                <div className="col-span-2">
                  <div className="flex justify-between mb-0.5">
                    <span>XP:</span>
                    <span className="font-bold">{stats.xp}/{stats.xpToNext}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2 border border-brown-600">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                      style={{ width: `${(stats.xp / stats.xpToNext) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Attack:</span>
                <span className="font-bold text-emerald-700">
                  ⚔️ {totalAttack}{weaponBonus > 0 && <span className="text-[10px] text-brown-600"> (+{weaponBonus})</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Defense:</span>
                <span className="font-bold text-emerald-700">
                  🛡️ {totalDefense}{armorBonus > 0 && <span className="text-[10px] text-brown-600"> (+{armorBonus})</span>}
                </span>
              </div>
            </div>
          </div>
          
          {/* Equipment - Ultra Compact */}
          <div className="bg-parchment-200 p-2 rounded border border-brown-600">
            <h3 className="font-medieval text-sm text-emerald-800 mb-1 border-b border-brown-400 pb-1">⚔️ Equipment</h3>
            <div className="space-y-1 text-xs font-body">
              {/* Weapon */}
              <div className="flex justify-between items-center p-1.5 bg-parchment-100 rounded">
                <div className="flex-1 min-w-0">
                  <span className="text-brown-600">⚔️ </span>
                  {equipment.weapon ? (
                    <span className="font-semibold truncate">
                      {itemsData.find(i => i.id === equipment.weapon)?.name}
                      <span className="text-emerald-700 ml-1">
                        +{itemsData.find(i => i.id === equipment.weapon)?.stats?.attack || 0}
                      </span>
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Empty</span>
                  )}
                </div>
                {equipment.weapon && (
                  <button
                    onClick={() => handleUnequipItem('weapon')}
                    className="text-[10px] px-1.5 py-0.5 bg-brown-600 text-parchment rounded hover:bg-brown-700 ml-1"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Armor */}
              <div className="flex justify-between items-center p-1.5 bg-parchment-100 rounded">
                <div className="flex-1 min-w-0">
                  <span className="text-brown-600">🛡️ </span>
                  {equipment.armor ? (
                    <span className="font-semibold truncate">
                      {itemsData.find(i => i.id === equipment.armor)?.name}
                      <span className="text-emerald-700 ml-1">
                        +{itemsData.find(i => i.id === equipment.armor)?.stats?.defense || 0}
                      </span>
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Empty</span>
                  )}
                </div>
                {equipment.armor && (
                  <button
                    onClick={() => handleUnequipItem('armor')}
                    className="text-[10px] px-1.5 py-0.5 bg-brown-600 text-parchment rounded hover:bg-brown-700 ml-1"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Accessory */}
              <div className="flex justify-between items-center p-1.5 bg-parchment-100 rounded">
                <div className="flex-1 min-w-0">
                  <span className="text-brown-600">💎 </span>
                  {equipment.accessory ? (
                    <span className="font-semibold truncate">
                      {itemsData.find(i => i.id === equipment.accessory)?.name}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Empty</span>
                  )}
                </div>
                {equipment.accessory && (
                  <button
                    onClick={() => handleUnequipItem('accessory')}
                    className="text-[10px] px-1.5 py-0.5 bg-brown-600 text-parchment rounded hover:bg-brown-700 ml-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Achievements - Compact */}
          <div className="bg-parchment-200 p-2 rounded border border-brown-600">
            <h3 className="font-medieval text-sm text-emerald-800 mb-1 border-b border-brown-400 pb-1">
              🏆 Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-1.5 rounded text-center ${
                    achievement.unlocked
                      ? 'bg-gold-light border border-gold'
                      : 'bg-gray-200 border border-gray-400 opacity-50'
                  }`}
                  title={achievement.description}
                >
                  <div className="text-lg leading-none">{achievement.icon}</div>
                  <div className={`text-[10px] font-medieval truncate ${
                    achievement.unlocked ? 'text-brown' : 'text-gray-600'
                  }`}>
                    {achievement.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column: Inventory */}
        <div className="bg-parchment-200 p-2 rounded border border-brown-600">
          <h3 className="font-medieval text-sm text-emerald-800 mb-1 border-b border-brown-400 pb-1">🎒 Inventory</h3>
          {inventory.length === 0 ? (
            <p className="font-body text-xs text-brown-600 italic text-center py-4">Empty</p>
          ) : (
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {inventory.map((slot, idx) => {
                const item = itemsData.find(i => i.id === slot.itemId);
                const isConsumable = item?.category === 'consumable';
                const isEquippable = item?.category === 'weapon' || item?.category === 'armor' || item?.category === 'accessory';
                const canUse = isConsumable && stats.hp < stats.maxHp;
                
                return (
                  <div key={idx} className="flex items-center gap-1.5 font-body text-xs p-1.5 bg-parchment-100 rounded hover:bg-parchment-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className={`font-semibold truncate ${getRarityColor(item?.rarity)}`}>
                          {item?.name || slot.itemId}
                        </span>
                        {item?.rarity === 'legendary' && <span className="text-xs">✨</span>}
                        {item?.rarity === 'epic' && <span className="text-xs">⭐</span>}
                        <span className="text-[10px] text-brown-600 ml-auto">x{slot.quantity}</span>
                      </div>
                      {item?.stats && (
                        <div className="flex gap-2 text-[10px] text-emerald-700">
                          {item.stats.attack && <span>⚔️+{item.stats.attack}</span>}
                          {item.stats.defense && <span>🛡️+{item.stats.defense}</span>}
                          {item.stats.critChance && <span>💥{Math.round(item.stats.critChance * 100)}%</span>}
                        </div>
                      )}
                      {item?.effect && (
                        <div className="text-[10px] text-blue-700">
                          {item.effect.type === 'heal' && `+${item.effect.value} HP`}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {isConsumable && (
                        <button
                          onClick={() => handleUseItem(slot.itemId)}
                          disabled={!canUse}
                          className={`text-[10px] px-2 py-1 rounded whitespace-nowrap ${
                            canUse 
                              ? 'bg-emerald text-white hover:bg-emerald-600' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Use
                        </button>
                      )}
                      {isEquippable && (
                        <button
                          onClick={() => handleEquipItem(slot.itemId)}
                          className="text-[10px] px-2 py-1 bg-gold text-brown rounded hover:bg-gold-light whitespace-nowrap"
                        >
                          Equip
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
