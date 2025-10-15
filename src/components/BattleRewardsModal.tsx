import React from 'react';
import itemsData from '../data/items.json';

interface BattleReward {
  itemId: string;
  quantity: number;
}

interface BattleRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpGained: number;
  goldGained: number;
  itemsGained: BattleReward[];
  enemyName: string;
}

export const BattleRewardsModal: React.FC<BattleRewardsModalProps> = ({
  isOpen,
  onClose,
  xpGained,
  goldGained,
  itemsGained,
  enemyName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-gold rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🏆</div>
          <h2 className="font-medieval text-3xl bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent mb-2">
            Victory!
          </h2>
          <p className="font-body text-brown-800">
            You defeated <strong>{enemyName}</strong>!
          </p>
        </div>

        {/* Rewards Section */}
        <div className="space-y-4">
          {/* XP Reward */}
          {xpGained > 0 && (
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-600 rounded-lg p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                <div>
                  <div className="font-medieval text-purple-900">Experience</div>
                  <div className="text-xs text-purple-700">Level up your skills!</div>
                </div>
              </div>
              <div className="font-bold text-2xl text-purple-900">+{xpGained}</div>
            </div>
          )}

          {/* Gold Reward */}
          <div className="bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-orange-600 rounded-lg p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div>
                <div className="font-medieval text-orange-900">Gold</div>
                <div className="text-xs text-orange-700">Buy items at the market!</div>
              </div>
            </div>
            <div className="font-bold text-2xl text-orange-900">+{goldGained}</div>
          </div>

          {/* Items Reward */}
          {itemsGained.length > 0 && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 border-2 border-teal-600 rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎁</span>
                <div className="font-medieval text-teal-900">Items Looted</div>
              </div>
              <div className="space-y-2">
                {itemsGained.map((reward, index) => {
                  const item = itemsData.find(i => i.id === reward.itemId);
                  const rarityColors = {
                    common: 'text-gray-700 border-gray-400 bg-gray-50',
                    uncommon: 'text-green-700 border-green-500 bg-green-50',
                    rare: 'text-blue-700 border-blue-500 bg-blue-50',
                    epic: 'text-purple-700 border-purple-500 bg-purple-50',
                    legendary: 'text-orange-700 border-orange-500 bg-orange-50',
                  };
                  const rarityClass = item?.rarity 
                    ? rarityColors[item.rarity as keyof typeof rarityColors] 
                    : rarityColors.common;

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded border-2 ${rarityClass} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {item?.category === 'consumable' ? '🧪' : 
                           item?.category === 'weapon' ? '⚔️' : 
                           item?.category === 'armor' ? '🛡️' : '📦'}
                        </span>
                        <div>
                          <div className="font-bold text-sm">
                            {item?.name || reward.itemId}
                          </div>
                          {item?.rarity && (
                            <div className="text-xs capitalize">
                              {item.rarity}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-lg">
                        x{reward.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {itemsGained.length === 0 && (
            <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 text-center">
              <p className="text-gray-600 font-body text-sm">No items dropped this time</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl border-2 border-teal-700"
        >
          Continue Adventure
        </button>
      </div>
    </div>
  );
};
