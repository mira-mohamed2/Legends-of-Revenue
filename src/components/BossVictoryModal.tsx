import React from 'react';

interface BossVictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bossName: string;
  xpGained: number;
  goldGained: number;
  itemsGained: Array<{ itemId: string; quantity: number }>;
}

export const BossVictoryModal: React.FC<BossVictoryModalProps> = ({
  isOpen,
  onClose,
  bossName,
  xpGained,
  goldGained,
  itemsGained,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-4 border-yellow-600 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Epic Header */}
        <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-6 text-center border-b-4 border-yellow-700">
          <div className="text-6xl mb-3 animate-bounce-slow">🐉</div>
          <h2 className="font-medieval text-3xl sm:text-4xl text-white drop-shadow-lg mb-2">
            LEGENDARY VICTORY!
          </h2>
          <div className="text-5xl mb-2">⚔️ 💀 ⚔️</div>
          <p className="font-medieval text-xl sm:text-2xl text-yellow-100">
            {bossName} has been defeated!
          </p>
        </div>

        {/* Epic Story Section */}
        <div className="p-6 space-y-6">
          {/* The Triumph */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-3 border-amber-600 rounded-xl p-5 shadow-lg">
            <h3 className="font-medieval text-2xl text-center text-amber-900 mb-3 flex items-center justify-center gap-2">
              <span className="text-3xl">⚡</span>
              The Curse is Broken
              <span className="text-3xl">⚡</span>
            </h3>
            <p className="font-body text-base text-brown-800 leading-relaxed text-center italic mb-4">
              With a final, thunderous blow, the ancient dragon ARIM falls. The mountains of hoarded gold 
              begin to crumble, freed from the curse of evasion that held them. The very air seems lighter 
              as the shadow of greed lifts from the Maldives.
            </p>
            <p className="font-body text-base text-brown-800 leading-relaxed text-center font-bold">
              You have done what was thought impossible. You have defeated the embodiment of tax evasion 
              itself. The wealth will be returned to the people. Justice has prevailed.
            </p>
          </div>

          {/* MIRA's Recognition */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-3 border-teal-600 rounded-xl p-5 shadow-lg">
            <h3 className="font-medieval text-xl text-center text-teal-900 mb-3">
              🏆 MIRA's Highest Honor 🏆
            </h3>
            <p className="font-body text-sm text-brown-800 text-center italic">
              "Agent, you have achieved what legends speak of. The dragon that gave its name to our organization 
              has been vanquished. You are now recognized as the <span className="font-bold text-teal-700">Grand Revenue Master</span>, 
              protector of the Maldives, and the greatest tax enforcement officer in history."
            </p>
            <p className="font-body text-sm text-brown-800 text-center mt-3 font-bold">
              — Director of MIRA
            </p>
          </div>

          {/* Legendary Rewards */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-3 border-purple-600 rounded-xl p-5 shadow-lg">
            <h3 className="font-medieval text-xl text-center text-purple-900 mb-4">
              ✨ Legendary Rewards ✨
            </h3>
            
            <div className="space-y-3">
              {/* XP */}
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-purple-400">
                <span className="font-medieval text-purple-900">Experience Gained</span>
                <span className="font-bold text-2xl text-purple-700">+{xpGained} XP</span>
              </div>
              
              {/* Gold */}
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-yellow-400">
                <span className="font-medieval text-yellow-900">Recovered Assets</span>
                <span className="font-bold text-2xl text-yellow-700">💰 {goldGained} Gold</span>
              </div>
              
              {/* Items */}
              {itemsGained.length > 0 && (
                <div className="bg-white p-4 rounded-lg border-2 border-pink-400">
                  <h4 className="font-medieval text-center text-pink-900 mb-3 text-lg">
                    🎁 Legendary Loot
                  </h4>
                  <div className="space-y-2">
                    {itemsGained.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex justify-between items-center bg-gradient-to-r from-yellow-50 to-orange-50 p-2 rounded border-2 border-yellow-500"
                      >
                        <span className="font-body text-brown-900 font-bold">
                          {item.itemId === 'legendary-sword' && '⚔️ Legendary Sword'}
                          {item.itemId === 'dragon-scale-armor' && '🛡️ Dragon Scale Armor'}
                          {item.itemId === 'mega-health-potion' && '🧪 Mega Health Potion'}
                          {item.itemId === 'greater-health-potion' && '🧪 Greater Health Potion'}
                          {item.itemId === 'gold-coins' && '💰 Gold Coins'}
                          {!['legendary-sword', 'dragon-scale-armor', 'mega-health-potion', 'greater-health-potion', 'gold-coins'].includes(item.itemId) && `📦 ${item.itemId}`}
                        </span>
                        <span className="font-bold text-yellow-700">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* The Legacy */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-3 border-green-600 rounded-xl p-5 shadow-lg">
            <h3 className="font-medieval text-xl text-center text-green-900 mb-3">
              📜 Your Legacy 📜
            </h3>
            <p className="font-body text-sm text-brown-800 text-center italic">
              Songs will be sung of this day. The people of the Maldives will remember the agent who 
              defeated the dragon of greed and brought justice to the land. Schools and hospitals will 
              be built with the recovered wealth. A new era of prosperity begins.
            </p>
            <p className="font-body text-sm text-brown-800 text-center mt-3 font-bold text-green-700">
              The balance has been restored. Justice prevails. 
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medieval text-2xl py-4 px-6 rounded-xl border-3 border-teal-800 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            ⚔️ Continue Your Legend ⚔️
          </button>
        </div>
      </div>
    </div>
  );
};
