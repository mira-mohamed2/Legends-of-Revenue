import React from 'react';
import { usePlayerStore } from '../../state/playerStore';
import { useWorldStore } from '../../state/worldStore';
import itemsData from '../../data/items.json';

export const CombatView: React.FC = () => {
  const { stats, equipment, inventory, gainXP, takeDamage, addGold, addItem, heal, handleDeath, incrementEnemiesKilled, useItem } = usePlayerStore();
  const { encounterState, combatLog, addCombatLog, endEncounter } = useWorldStore();
  
  if (!encounterState) return null;
  
  const { enemy } = encounterState;
  
  // Calculate total stats with equipment bonuses
  const weaponBonus = equipment.weapon 
    ? itemsData.find(i => i.id === equipment.weapon)?.stats?.attack || 0 
    : 0;
  const armorBonus = equipment.armor 
    ? itemsData.find(i => i.id === equipment.armor)?.stats?.defense || 0 
    : 0;
  const critChance = equipment.weapon
    ? itemsData.find(i => i.id === equipment.weapon)?.stats?.critChance || 0
    : 0;
  
  const totalAttack = stats.attack + weaponBonus;
  const totalDefense = stats.defense + armorBonus;
  
  const handleAttack = () => {
    // Check for critical hit
    const isCritical = Math.random() < critChance;
    const critMultiplier = isCritical ? 2.0 : 1.0;
    
    // Player attacks with equipment bonuses
    const playerDamage = Math.max(1, totalAttack - enemy.stats.defense);
    const variance = 0.9 + Math.random() * 0.2;
    const actualDamage = Math.floor(playerDamage * variance * critMultiplier);
    
    enemy.stats.hp -= actualDamage;
    
    if (isCritical) {
      addCombatLog(`💥 CRITICAL HIT! You deal ${actualDamage} damage to ${enemy.name}!`);
    } else {
      addCombatLog(`You deal ${actualDamage} damage to ${enemy.name}!`);
    }
    
    // Check if enemy defeated
    if (enemy.stats.hp <= 0) {
      addCombatLog(`${enemy.name} defeated!`);
      
      // Increment enemies killed for achievements
      incrementEnemiesKilled();
      
      // Check if at max level before gaining XP
      if (stats.level >= 10) {
        addCombatLog(`You are at MAX LEVEL (10)! No more XP can be gained.`);
        addCombatLog(`You gained ${enemy.rewards.gold} gold!`);
      } else {
        addCombatLog(`You gained ${enemy.rewards.xp} XP and ${enemy.rewards.gold} gold!`);
      }
      
      gainXP(enemy.rewards.xp);
      addGold(enemy.rewards.gold);
      
      // Full heal after victory
      const healAmount = stats.maxHp - stats.hp;
      if (healAmount > 0) {
        heal(healAmount);
        addCombatLog(`You recovered ${healAmount} HP!`);
      }
      
      // Loot items
      enemy.rewards.items.forEach((loot: any) => {
        if (Math.random() < (loot.chance || 1)) {
          const itemData = itemsData.find(i => i.id === loot.id);
          const itemName = itemData?.name || loot.id;
          const rarity = itemData?.rarity;
          
          addItem(loot.id, 1);
          
          // Special messages for rare items
          if (rarity === 'legendary') {
            addCombatLog(`✨ LEGENDARY! You received ${itemName}! ✨`);
          } else if (rarity === 'epic') {
            addCombatLog(`⭐ EPIC! You received ${itemName}!`);
          } else if (rarity === 'rare') {
            addCombatLog(`💎 RARE! You received ${itemName}!`);
          } else {
            addCombatLog(`You received ${itemName}!`);
          }
        }
      });
      
      endEncounter(true);
      return;
    }
    
    // Enemy attacks
    setTimeout(() => {
      const enemyDamage = Math.max(1, enemy.stats.attack - totalDefense);
      const actualEnemyDamage = Math.floor(enemyDamage * (0.9 + Math.random() * 0.2));
      
      takeDamage(actualEnemyDamage);
      addCombatLog(`${enemy.name} deals ${actualEnemyDamage} damage to you!`);
      
      // Check if player defeated
      if (stats.hp - actualEnemyDamage <= 0) {
        addCombatLog('💀 You have been defeated!');
        
        const xpLoss = Math.floor(stats.xpToNext * 0.1 * stats.level);
        addCombatLog(`You lost ${xpLoss} XP and were returned to the Guild Hall.`);
        
        setTimeout(() => {
          handleDeath();
          endEncounter(false);
        }, 1500);
      }
    }, 800);
  };
  
  const handleFlee = () => {
    if (Math.random() < 0.6) {
      addCombatLog('You successfully fled!');
      endEncounter(false);
    } else {
      addCombatLog('Failed to flee!');
      
      // Enemy gets a free attack
      setTimeout(() => {
        const enemyDamage = Math.max(1, enemy.stats.attack - totalDefense);
        const actualDamage = Math.floor(enemyDamage * (0.9 + Math.random() * 0.2));
        
        takeDamage(actualDamage);
        addCombatLog(`${enemy.name} deals ${actualDamage} damage while you flee!`);
        
        // Check if player defeated
        if (stats.hp - actualDamage <= 0) {
          addCombatLog('💀 You have been defeated!');
          
          const xpLoss = Math.floor(stats.xpToNext * 0.1 * stats.level);
          addCombatLog(`You lost ${xpLoss} XP and were returned to the Guild Hall.`);
          
          setTimeout(() => {
            handleDeath();
            endEncounter(false);
          }, 1500);
        }
      }, 500);
    }
  };
  
  return (
    <div className="panel">
      <h2 className="font-medieval text-3xl text-center text-gold mb-6">
        ⚔️ Combat!
      </h2>
      
      {/* Avatar Display Row */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* Enemy Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-parchment-200 border-4 border-brown-600 rounded-lg overflow-hidden shadow-lg mb-2">
            <img 
              src={(enemy as any).image || '/images/enemies/tax-collector.svg'} 
              alt={enemy.name}
              className="w-full h-full object-contain p-2"
            />
          </div>
          <h3 className="font-medieval text-2xl text-emerald-800 text-center">
            {enemy.name}
          </h3>
        </div>
        
        {/* Player Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-parchment-200 border-4 border-gold rounded-lg overflow-hidden shadow-lg mb-2">
            <img 
              src={(usePlayerStore.getState().customAvatar || usePlayerStore.getState().avatar)}
              alt="Your Character"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <h3 className="font-medieval text-2xl text-gold text-center">
            You
          </h3>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Enemy Stats */}
        <div className="bg-parchment-200 p-4 rounded border-2 border-brown-600">
          <h3 className="font-medieval text-xl text-center text-emerald-800 mb-2">
            Enemy Stats
          </h3>
          <div className="space-y-1 font-body text-brown-800">
            <div className="flex justify-between">
              <span>HP:</span>
              <span className="font-bold">{enemy.stats.hp} / {enemy.stats.maxHp}</span>
            </div>
            {/* Enemy HP Bar */}
            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden border-2 border-red-700 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                style={{ width: `${(enemy.stats.hp / enemy.stats.maxHp) * 100}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span>Attack:</span>
              <span>{enemy.stats.attack}</span>
            </div>
            <div className="flex justify-between">
              <span>Defense:</span>
              <span>{enemy.stats.defense}</span>
            </div>
          </div>
        </div>
        
        {/* Player Stats */}
        <div className="bg-parchment-200 p-4 rounded border-2 border-gold">
          <h3 className="font-medieval text-xl text-center text-gold mb-2">
            Your Stats
          </h3>
          <div className="space-y-1 font-body text-brown-800">
            <div className="flex justify-between">
              <span>HP:</span>
              <span className="font-bold">{stats.hp} / {stats.maxHp}</span>
            </div>
            {/* Player HP Bar */}
            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden border-2 border-emerald-700 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span>Attack:</span>
              <span className={weaponBonus > 0 ? 'font-bold text-emerald-700' : ''}>
                {stats.attack}{weaponBonus > 0 && ` +${weaponBonus}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Defense:</span>
              <span className={armorBonus > 0 ? 'font-bold text-emerald-700' : ''}>
                {stats.defense}{armorBonus > 0 && ` +${armorBonus}`}
              </span>
            </div>
            {critChance > 0 && (
              <div className="flex justify-between border-t border-brown-400 pt-1 mt-1">
                <span>💥 Crit Chance:</span>
                <span className="font-bold text-orange-600">
                  {Math.round(critChance * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Combat Log */}
      <div className="bg-brown-900 p-4 rounded mb-4 h-32 overflow-y-auto">
        {combatLog.map((log, idx) => (
          <div key={idx} className="text-parchment font-body text-sm">
            {log}
          </div>
        ))}
      </div>
      
      {/* Consumables Section */}
      {(() => {
        const consumables = inventory.filter(slot => {
          const item = itemsData.find(i => i.id === slot.itemId);
          return item?.category === 'consumable';
        });
        
        if (consumables.length === 0) return null;
        
        return (
          <div className="bg-parchment-200 p-4 rounded border-2 border-emerald-600 mb-4">
            <h3 className="font-medieval text-lg text-emerald-800 mb-2">
              🧪 Consumables
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {consumables.map(slot => {
                const item = itemsData.find(i => i.id === slot.itemId);
                if (!item) return null;
                
                const isAtFullHP = stats.hp >= stats.maxHp;
                const isHealPotion = item.effect?.type === 'heal';
                const canUse = !isAtFullHP || !isHealPotion;
                
                return (
                  <button
                    key={slot.itemId}
                    onClick={() => {
                      const success = useItem(slot.itemId);
                      if (success) {
                        const healValue = item.effect?.value || 0;
                        addCombatLog(`Used ${item.name}! Restored ${healValue} HP.`);
                      } else if (isAtFullHP && isHealPotion) {
                        addCombatLog(`Already at full HP!`);
                      }
                    }}
                    disabled={!canUse || stats.hp <= 0}
                    className={`p-2 rounded border-2 text-left transition-all ${
                      canUse && stats.hp > 0
                        ? 'bg-white border-emerald-600 hover:bg-emerald-50 hover:border-gold cursor-pointer'
                        : 'bg-gray-200 border-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="font-body">
                      <div className="font-bold text-sm text-brown-900">{item.name}</div>
                      <div className="text-xs text-brown-700">
                        {item.effect?.type === 'heal' && `+${item.effect.value} HP`}
                        {item.effect?.type === 'damage' && `${item.effect.value} DMG`}
                      </div>
                      <div className="text-xs text-emerald-700 font-bold">
                        x{slot.quantity}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}
      
      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleAttack}
          className="btn-primary"
          disabled={stats.hp <= 0}
        >
          ⚔️ Attack
        </button>
        <button
          onClick={handleFlee}
          className="btn-secondary"
          disabled={stats.hp <= 0}
        >
          🏃 Flee
        </button>
      </div>
    </div>
  );
};
