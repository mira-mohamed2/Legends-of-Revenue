import React, { useState } from 'react';
import { usePlayerStore } from '../../state/playerStore';
import itemsData from '../../data/items.json';

type MarketTab = 'shop' | 'sell' | 'craft';

export const MarketView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MarketTab>('shop');
  const { stats, inventory, addItem, removeItem, spendGold, addGold } = usePlayerStore();
  
  // Shop items available for purchase
  const shopItems = itemsData.filter(item => 
    item.category === 'weapon' || 
    item.category === 'armor' || 
    item.category === 'consumable'
  );
  
  // Get rarity color
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
  
  // Get rarity icon
  const getRarityIcon = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return '✨';
      case 'epic': return '⭐';
      case 'rare': return '💎';
      default: return '';
    }
  };
  
  // Calculate item price based on rarity and stats
  const getItemPrice = (item: any): number => {
    let basePrice = 50;
    
    // Price based on rarity
    switch (item.rarity) {
      case 'legendary': basePrice = 1000; break;
      case 'epic': basePrice = 500; break;
      case 'rare': basePrice = 250; break;
      case 'uncommon': basePrice = 100; break;
      case 'common': basePrice = 50; break;
    }
    
    // Adjust for stats
    if (item.stats?.attack) basePrice += item.stats.attack * 20;
    if (item.stats?.defense) basePrice += item.stats.defense * 20;
    if (item.stats?.critChance) basePrice += item.stats.critChance * 10;
    
    return basePrice;
  };
  
  const handleBuy = (itemId: string) => {
    const item = itemsData.find(i => i.id === itemId);
    if (!item) return;
    
    const price = getItemPrice(item);
    
    if (stats.gold < price) {
      alert(`Not enough gold! You need ${price} gold but only have ${stats.gold}.`);
      return;
    }
    
    const success = spendGold(price);
    if (success) {
      addItem(itemId, 1);
      alert(`Purchased ${item.name} for ${price} gold!`);
    }
  };
  
  const handleSell = (itemId: string) => {
    const item = itemsData.find(i => i.id === itemId);
    if (!item) return;
    
    const sellPrice = Math.floor(getItemPrice(item) * 0.5); // Sell for 50% of buy price
    
    removeItem(itemId, 1);
    addGold(sellPrice);
    alert(`Sold ${item.name} for ${sellPrice} gold!`);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="panel">
        <h1 className="font-medieval text-4xl text-gold mb-2">🏪 Black Market</h1>
        <p className="font-body text-brown-700 mb-4">
          Trade tax-free goods and services • No questions asked
        </p>
        
        {/* Player Gold Display */}
        <div className="bg-gold-light border-2 border-gold rounded p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medieval text-xl text-brown">Your Gold:</span>
            <span className="font-medieval text-2xl text-gold">💰 {stats.gold}</span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-2 px-4 font-medieval rounded transition-colors ${
              activeTab === 'shop'
                ? 'bg-emerald text-parchment'
                : 'bg-parchment-200 text-brown hover:bg-parchment-300'
            }`}
          >
            🛒 Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-2 px-4 font-medieval rounded transition-colors ${
              activeTab === 'sell'
                ? 'bg-emerald text-parchment'
                : 'bg-parchment-200 text-brown hover:bg-parchment-300'
            }`}
          >
            💵 Sell
          </button>
          <button
            onClick={() => setActiveTab('craft')}
            className={`flex-1 py-2 px-4 font-medieval rounded transition-colors ${
              activeTab === 'craft'
                ? 'bg-emerald text-parchment'
                : 'bg-parchment-200 text-brown hover:bg-parchment-300'
            }`}
          >
            🔨 Craft (Coming Soon)
          </button>
        </div>
        
        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-3">
            <h2 className="font-medieval text-2xl text-brown mb-3">Available Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shopItems.map((item) => {
                const price = getItemPrice(item);
                const canAfford = stats.gold >= price;
                
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded border-2 ${
                      canAfford 
                        ? 'bg-parchment-100 border-brown' 
                        : 'bg-gray-200 border-gray-400 opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`font-medieval text-lg ${getRarityColor(item.rarity)}`}>
                          {getRarityIcon(item.rarity)} {item.name}
                        </h3>
                        <p className="text-sm text-brown-600 font-body">{item.description}</p>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    {item.stats && (
                      <div className="text-sm text-brown-700 mb-2 font-body">
                        {item.stats.attack && <div>⚔️ Attack: +{item.stats.attack}</div>}
                        {item.stats.defense && <div>🛡️ Defense: +{item.stats.defense}</div>}
                        {item.stats.critChance && <div>💥 Crit Chance: +{item.stats.critChance}%</div>}
                        {(item.stats as any).healing && <div>❤️ Healing: +{(item.stats as any).healing} HP</div>}
                      </div>
                    )}
                    
                    {/* Price and Buy Button */}
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-medieval text-xl text-gold">💰 {price}</span>
                      <button
                        onClick={() => handleBuy(item.id)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded font-body font-semibold ${
                          canAfford
                            ? 'bg-emerald text-parchment hover:bg-emerald-light cursor-pointer'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Buy' : 'Too Expensive'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Sell Tab */}
        {activeTab === 'sell' && (
          <div className="space-y-3">
            <h2 className="font-medieval text-2xl text-brown mb-3">Sell Your Items</h2>
            {inventory.length === 0 ? (
              <div className="text-center py-8 text-brown-600 font-body">
                Your inventory is empty. Defeat enemies to get loot!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {inventory.map((slot) => {
                  const item = itemsData.find(i => i.id === slot.itemId);
                  if (!item) return null;
                  
                  const sellPrice = Math.floor(getItemPrice(item) * 0.5);
                  
                  return (
                    <div
                      key={slot.itemId}
                      className="p-4 bg-parchment-100 rounded border-2 border-brown"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`font-medieval text-lg ${getRarityColor(item.rarity)}`}>
                            {getRarityIcon(item.rarity)} {item.name}
                          </h3>
                          <p className="text-sm text-brown-600 font-body">{item.description}</p>
                          <p className="text-xs text-gray-600 mt-1">Quantity: {slot.quantity}</p>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      {item.stats && (
                        <div className="text-sm text-brown-700 mb-2 font-body">
                          {item.stats.attack && <div>⚔️ Attack: +{item.stats.attack}</div>}
                          {item.stats.defense && <div>🛡️ Defense: +{item.stats.defense}</div>}
                          {item.stats.critChance && <div>💥 Crit Chance: +{item.stats.critChance}%</div>}
                          {(item.stats as any).healing && <div>❤️ Healing: +{(item.stats as any).healing} HP</div>}
                        </div>
                      )}
                      
                      {/* Price and Sell Button */}
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-medieval text-xl text-gold">💰 {sellPrice}</span>
                        <button
                          onClick={() => handleSell(slot.itemId)}
                          className="px-4 py-2 rounded font-body font-semibold bg-gold text-brown hover:bg-gold-light cursor-pointer"
                        >
                          Sell One
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Craft Tab (Placeholder for future) */}
        {activeTab === 'craft' && (
          <div className="space-y-3">
            <h2 className="font-medieval text-2xl text-brown mb-3">Item Crafting</h2>
            <div className="bg-emerald-100 border-2 border-emerald-600 rounded p-6 text-center">
              <div className="text-6xl mb-4">🔨</div>
              <h3 className="font-medieval text-2xl text-emerald-900 mb-2">Coming Soon!</h3>
              <p className="font-body text-emerald-800 mb-4">
                The crafting system is under development. Soon you'll be able to:
              </p>
              <ul className="font-body text-left text-emerald-800 max-w-md mx-auto space-y-2">
                <li>✨ Combine materials to create powerful items</li>
                <li>⚒️ Upgrade existing equipment</li>
                <li>🧪 Brew potions and elixirs</li>
                <li>💎 Enchant weapons with special abilities</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
