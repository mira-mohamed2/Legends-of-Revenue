import React, { useState } from 'react';
import { usePlayerStore } from '../../state/playerStore';
import { useWorldStore } from '../../state/worldStore';
import { BattleRewardsModal } from '../../components/BattleRewardsModal';
import { BattleDefeatModal } from '../../components/BattleDefeatModal';
import itemsData from '../../data/items.json';

export const CombatView: React.FC = () => {
  const { stats, equipment, inventory, gainXP, takeDamage, addGold, addItem, heal, handleDeath, incrementEnemiesKilled, recordEnemyDefeated, useItem } = usePlayerStore();
  const { encounterState, combatLog, addCombatLog, endEncounter } = useWorldStore();
  
  // Animation states
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [enemyHit, setEnemyHit] = useState(false);
  const [showSwordClash, setShowSwordClash] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<Array<{
    id: number;
    damage: number;
    isCrit: boolean;
    isPlayer: boolean;
    x: number;
    y: number;
  }>>([]);
  
  // Battle rewards modal state
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [battleRewards, setBattleRewards] = useState<{
    xp: number;
    gold: number;
    items: Array<{ itemId: string; quantity: number }>;
    enemyName: string;
  }>({
    xp: 0,
    gold: 0,
    items: [],
    enemyName: '',
  });
  
  // Battle defeat modal state
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [defeatPenalty, setDefeatPenalty] = useState<{
    xpLost: number;
    enemyName: string;
  }>({
    xpLost: 0,
    enemyName: '',
  });
  
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
  
  // Helper function to show damage numbers
  const showDamageNumber = (damage: number, isCrit: boolean, isPlayer: boolean) => {
    const id = Date.now() + Math.random();
    const newDamage = {
      id,
      damage,
      isCrit,
      isPlayer,
      x: Math.random() * 60 - 30, // Random horizontal offset
      y: 0,
    };
    
    setDamageNumbers(prev => [...prev, newDamage]);
    
    // Remove after animation completes
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1000);
  };
  
  const handleAttack = () => {
    // Trigger player attack animation
    setPlayerAttacking(true);
    setTimeout(() => setPlayerAttacking(false), 600);
    
    // Show sword clash in the middle
    setTimeout(() => {
      setShowSwordClash(true);
      setTimeout(() => setShowSwordClash(false), 400);
    }, 250);
    
    // Slight delay before damage
    setTimeout(() => {
      // Check for critical hit
      const isCritical = Math.random() < critChance;
      const critMultiplier = isCritical ? 2.0 : 1.0;
      
      // Player attacks with equipment bonuses
      const playerDamage = Math.max(1, totalAttack - enemy.stats.defense);
      const variance = 0.9 + Math.random() * 0.2;
      const actualDamage = Math.floor(playerDamage * variance * critMultiplier);
      
      enemy.stats.hp -= actualDamage;
      
      // Trigger enemy hit animation and damage number
      setEnemyHit(true);
      showDamageNumber(actualDamage, isCritical, false);
      setTimeout(() => setEnemyHit(false), 500);
      
      if (isCritical) {
        addCombatLog(`🎯 CRITICAL HIT! You deal ${actualDamage} damage to ${enemy.name}!`);
      } else {
        addCombatLog(`You deal ${actualDamage} damage to ${enemy.name}!`);
      }
    }, 300);
    
    // Check if enemy defeated
    setTimeout(() => {
      if (enemy.stats.hp <= 0) {
        addCombatLog(`${enemy.name} defeated!`);
      
        // Increment enemies killed for achievements
        incrementEnemiesKilled();
        
        // Record this enemy type as defeated (for lore codex)
        recordEnemyDefeated(enemy.id);
        
        // Apply reward multiplier based on enemy's randomized strength
        const rewardMultiplier = encounterState.rewardMultiplier || 1.0;
        
        // Collect XP and Gold rewards with multiplier
        const baseXp = enemy.rewards.xp;
        const baseGold = enemy.rewards.gold;
        const xpReward = stats.level >= 10 ? 0 : Math.floor(baseXp * rewardMultiplier);
        const goldReward = Math.floor(baseGold * rewardMultiplier);
        
        // Check if at max level before gaining XP
        if (stats.level >= 10) {
          addCombatLog(`You are at MAX LEVEL (10)! No more XP can be gained.`);
          addCombatLog(`You gained ${goldReward} gold!`);
        } else {
          addCombatLog(`You gained ${xpReward} XP and ${goldReward} gold!`);
        }
        
        // Show bonus message if multiplier is significant
        if (rewardMultiplier > 1.15) {
          addCombatLog(`💰 This was a tough one! (+${Math.round((rewardMultiplier - 1) * 100)}% bonus rewards)`);
        }
        
        gainXP(xpReward);
        addGold(goldReward);
      
      // Full heal after victory
      const healAmount = stats.maxHp - stats.hp;
      if (healAmount > 0) {
        heal(healAmount);
        addCombatLog(`You recovered ${healAmount} HP!`);
      }
      
      // Collect looted items
      const lootedItems: Array<{ itemId: string; quantity: number }> = [];
      
      // Loot items
      enemy.rewards.items.forEach((loot: any) => {
        if (Math.random() < (loot.chance || 1)) {
          const itemData = itemsData.find(i => i.id === loot.id);
          const itemName = itemData?.name || loot.id;
          const rarity = itemData?.rarity;
          
          addItem(loot.id, 1);
          lootedItems.push({ itemId: loot.id, quantity: 1 });
          
          // Special messages for rare items
          if (rarity === 'legendary') {
            addCombatLog(`⭐ LEGENDARY! You received ${itemName}! ⭐`);
          } else if (rarity === 'epic') {
            addCombatLog(`💜 EPIC! You received ${itemName}!`);
          } else if (rarity === 'rare') {
            addCombatLog(`💎 RARE! You received ${itemName}!`);
          } else {
            addCombatLog(`You received ${itemName}!`);
          }
        }
      });
      
      // Show rewards modal immediately
      setBattleRewards({
        xp: xpReward,
        gold: goldReward,
        items: lootedItems,
        enemyName: enemy.name,
      });
      setShowRewardsModal(true);
      
      // Don't call endEncounter here - let the modal's "Continue" button handle it
        return;
      }
    
      // Enemy attacks
      setTimeout(() => {
        // Trigger enemy attack animation
        setEnemyAttacking(true);
        setTimeout(() => setEnemyAttacking(false), 600);
        
        // Show sword clash in the middle
        setTimeout(() => {
          setShowSwordClash(true);
          setTimeout(() => setShowSwordClash(false), 400);
        }, 250);
        
        setTimeout(() => {
          const enemyDamage = Math.max(1, enemy.stats.attack - totalDefense);
          const actualEnemyDamage = Math.floor(enemyDamage * (0.9 + Math.random() * 0.2));
          
          takeDamage(actualEnemyDamage);
          
          // Trigger player hit animation and damage number
          setPlayerHit(true);
          showDamageNumber(actualEnemyDamage, false, true);
          setTimeout(() => setPlayerHit(false), 500);
          
          addCombatLog(`${enemy.name} deals ${actualEnemyDamage} damage to you!`);
          
          // Check if player defeated
          if (stats.hp - actualEnemyDamage <= 0) {
            addCombatLog('💀 You have been defeated!');
            
            const xpLoss = Math.floor(stats.xpToNext * 0.1 * stats.level);
            addCombatLog(`You lost ${xpLoss} XP and were returned to the Guild Hall.`);
            
            // Show defeat modal immediately
            setDefeatPenalty({
              xpLost: xpLoss,
              enemyName: enemy.name,
            });
            setShowDefeatModal(true);
          }
        }, 300);
      }, 800);
    }, 500);
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
          
          // Show defeat modal immediately
          setDefeatPenalty({
            xpLost: xpLoss,
            enemyName: enemy.name,
          });
          setShowDefeatModal(true);
        }
      }, 500);
    }
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-1 sm:p-2">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-600 rounded-lg shadow-xl p-1.5 sm:p-2 md:p-3 flex flex-col">
            <h2 className="font-medieval text-base sm:text-xl md:text-2xl text-center bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent mb-1 sm:mb-2">
              ⚔️ Combat!
            </h2>
            
            {/* Main Combat Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 relative mb-1">
        {/* SWORD CLASH IN CENTER */}
        {showSwordClash && (
          <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="relative animate-sword-clash">
              {/* Left Sword (Player's) */}
              <div className="absolute left-0 transform -rotate-45 animate-sword-left">
                <div className="text-4xl sm:text-5xl md:text-6xl filter drop-shadow-lg">⚔️</div>
              </div>
              
              {/* Right Sword (Enemy's) */}
              <div className="absolute right-0 transform rotate-45 animate-sword-right">
                <div className="text-4xl sm:text-5xl md:text-6xl filter drop-shadow-lg">⚔️</div>
              </div>
              
              {/* Clash Spark Effect */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-clash-spark">
                <div className="text-3xl sm:text-4xl">💥</div>
              </div>
            </div>
          </div>
        )}
        
        {/* LEFT COLUMN - Enemy */}
        <div className="space-y-1 flex flex-col">
          {/* Enemy Avatar */}
          <div className="flex flex-col items-center relative flex-shrink-0">
            <div 
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-600 rounded-lg overflow-hidden shadow-xl mb-0.5 transition-all duration-300 ${
                enemyAttacking ? 'animate-attack-enemy' : ''
              } ${
                enemyHit ? 'animate-hit-shake' : ''
              }`}
            >
              <img 
                src={(enemy as any).image || '/images/enemies/tax-collector.svg'} 
                alt={enemy.name}
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            
            {/* Damage Numbers for Enemy */}
            {[...damageNumbers].reverse().filter(d => !d.isPlayer).map(dmg => (
              <div
                key={dmg.id}
                className={`absolute pointer-events-none font-medieval text-xl sm:text-2xl font-bold animate-damage-float ${
                  dmg.isCrit ? 'text-yellow-400' : 'text-red-600'
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(${dmg.x}px, ${dmg.y}px)`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {dmg.isCrit ? '💥 ' : ''}{dmg.damage}{dmg.isCrit ? ' 💥' : ''}
              </div>
            ))}
            
            <h3 className="font-medieval text-xs sm:text-sm md:text-base text-orange-800 text-center">
              {enemy.name}
            </h3>
          </div>
          
          {/* Enemy Stats */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-1.5 sm:p-2 rounded-lg border-2 border-orange-600 shadow-lg flex-shrink-0">
            <h3 className="font-medieval text-xs sm:text-sm text-center text-orange-800 mb-0.5">
              Enemy Stats
              {enemy.statRanges && (
                <span className="text-xs text-orange-600 block font-body italic hidden sm:block">
                  (Randomized)
                </span>
              )}
            </h3>
            <div className="space-y-1 font-body text-brown-800 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>HP:</span>
                <span className="font-bold">
                  {enemy.stats.hp} / {enemy.stats.maxHp}
                  {enemy.statRanges && (
                    <span className="text-xs text-gray-600 ml-1 hidden sm:inline">
                      ({enemy.statRanges.hp.min}-{enemy.statRanges.hp.max})
                    </span>
                  )}
                </span>
              </div>
              {/* Enemy HP Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden border-2 border-orange-500 mb-2 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500 shadow-lg"
                  style={{ width: `${(enemy.stats.hp / enemy.stats.maxHp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>Attack:</span>
                <span>
                  {enemy.stats.attack}
                  {enemy.statRanges && (
                    <span className="text-xs text-gray-600 ml-1 hidden sm:inline">
                      ({enemy.statRanges.attack.min}-{enemy.statRanges.attack.max})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Defense:</span>
                <span>
                  {enemy.stats.defense}
                  {enemy.statRanges && (
                    <span className="text-xs text-gray-600 ml-1 hidden sm:inline">
                      ({enemy.statRanges.defense.min}-{enemy.statRanges.defense.max})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {/* Enemy Lore - Hidden on small screens to save space */}
          {(enemy as any).lore && (
            <div className="hidden md:block bg-gradient-to-br from-amber-50 to-yellow-50 p-2 rounded-lg border-2 border-amber-600 shadow-lg flex-shrink-0 overflow-y-auto max-h-20">
              <h3 className="font-medieval text-xs text-center text-amber-900 mb-1 flex items-center justify-center gap-1">
                📜 Lore
              </h3>
              <p className="font-body text-xs text-brown-800 leading-tight italic text-center">
                {(enemy as any).lore}
              </p>
            </div>
          )}
        </div>
        
        {/* RIGHT COLUMN - Player */}
        <div className="space-y-1 flex flex-col">
          {/* Player Avatar */}
          <div className="flex flex-col items-center relative flex-shrink-0">
            <div 
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-600 rounded-lg overflow-hidden shadow-xl mb-0.5 transition-all duration-300 ${
                playerAttacking ? 'animate-attack-player' : ''
              } ${
                playerHit ? 'animate-hit-shake' : ''
              }`}
            >
              <img 
                src={(usePlayerStore.getState().customAvatar || usePlayerStore.getState().avatar)}
                alt="Your Character"
                className="w-full h-full object-contain p-1 sm:p-2"
              />
            </div>
            
            {/* Damage Numbers for Player */}
            {[...damageNumbers].reverse().filter(d => d.isPlayer).map(dmg => (
              <div
                key={dmg.id}
                className="absolute pointer-events-none font-medieval text-xl sm:text-2xl font-bold animate-damage-float text-red-600"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(${dmg.x}px, ${dmg.y}px)`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {dmg.damage}
              </div>
            ))}
            
            <h3 className="font-medieval text-xs sm:text-sm md:text-base text-teal-800 text-center">
              You
            </h3>
          </div>
          
          {/* Player Stats */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-1.5 sm:p-2 rounded-lg border-2 border-teal-600 shadow-lg flex-shrink-0">
            <h3 className="font-medieval text-xs sm:text-sm text-center text-teal-800 mb-0.5">
              Your Stats
            </h3>
            <div className="space-y-1 font-body text-brown-800 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>HP:</span>
                <span className="font-bold">{stats.hp} / {stats.maxHp}</span>
              </div>
              {/* Player HP Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden border-2 border-teal-500 mb-2 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all duration-500 shadow-lg"
                  style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>Attack:</span>
                <span className={weaponBonus > 0 ? 'font-bold text-teal-700' : ''}>
                  {stats.attack}{weaponBonus > 0 && ` +${weaponBonus}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Defense:</span>
                <span className={armorBonus > 0 ? 'font-bold text-teal-700' : ''}>
                  {stats.defense}{armorBonus > 0 && ` +${armorBonus}`}
                </span>
              </div>
              {critChance > 0 && (
                <div className="flex justify-between border-t border-brown-400 pt-1 mt-1">
                  <span>💥 Crit:</span>
                  <span className="font-bold text-orange-600">
                    {Math.round(critChance * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons - Centered between columns */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-1 flex-shrink-0">
        <button
          onClick={handleAttack}
          className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2"
          disabled={stats.hp <= 0}
        >
          ⚔️ Attack
        </button>
        <button
          onClick={handleFlee}
          className="btn-secondary text-xs sm:text-sm py-1.5 sm:py-2"
          disabled={stats.hp <= 0}
        >
          🏃 Flee
        </button>
      </div>
      
      {/* Consumables Section - Compact */}
      {(() => {
        const consumables = inventory.filter(slot => {
          const item = itemsData.find(i => i.id === slot.itemId);
          return item?.category === 'consumable';
        });
        
        if (consumables.length === 0) return null;
        
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-1.5 sm:p-2 rounded-lg border-2 border-purple-600 mb-1 shadow-lg flex-shrink-0">
            <h3 className="font-medieval text-xs text-purple-800 mb-0.5">
              🧪 Consumables
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                    className={`p-1.5 rounded-lg border-2 text-left transition-all ${
                      canUse && stats.hp > 0
                        ? 'bg-white border-purple-600 hover:bg-purple-50 hover:border-teal-600 cursor-pointer shadow-md hover:shadow-lg'
                        : 'bg-gray-200 border-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="font-body">
                      <div className="font-bold text-xs text-brown-900">{item.name}</div>
                      <div className="text-xs text-brown-700">
                        {item.effect?.type === 'heal' && `+${item.effect.value} HP`}
                        {item.effect?.type === 'damage' && `${item.effect.value} DMG`}
                      </div>
                      <div className="text-xs text-purple-700 font-bold">
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
      
      {/* Combat Log - Compact */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-1.5 sm:p-2 rounded-lg h-12 sm:h-16 overflow-y-auto border-2 border-teal-600 shadow-inner flex-shrink-0">
        <div className="text-teal-50 font-body text-xs leading-tight">
          {[...combatLog].reverse().map((log, idx) => (
            <div key={idx}>
              {log}
            </div>
          ))}
        </div>
      </div>
      
      {/* Battle Rewards Modal */}
      <BattleRewardsModal
        isOpen={showRewardsModal}
        onClose={() => {
          setShowRewardsModal(false);
          endEncounter(true); // Exit combat after viewing rewards
        }}
        xpGained={battleRewards.xp}
        goldGained={battleRewards.gold}
        itemsGained={battleRewards.items}
        enemyName={battleRewards.enemyName}
      />
      
      {/* Battle Defeat Modal */}
      <BattleDefeatModal
        isOpen={showDefeatModal}
        onClose={() => {
          setShowDefeatModal(false);
          handleDeath(); // Apply death penalties
          endEncounter(false); // Exit combat, return to Guild Hall
        }}
        xpLost={defeatPenalty.xpLost}
        enemyName={defeatPenalty.enemyName}
      />
          </div>
        </div>
      </div>
    </div>
  );
};
