import React from 'react';

interface BattleDefeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpLost: number;
  enemyName: string;
}

export const BattleDefeatModal: React.FC<BattleDefeatModalProps> = ({
  isOpen,
  onClose,
  xpLost,
  enemyName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-4 border-red-600 rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">💀</div>
          <h2 className="font-medieval text-3xl text-red-800 mb-2">
            Defeated!
          </h2>
          <p className="font-body text-red-700 text-lg">
            You were defeated by <span className="font-bold">{enemyName}</span>
          </p>
        </div>

        {/* Penalties */}
        <div className="space-y-4 mb-6">
          {/* XP Lost */}
          <div className="bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-500 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📉</span>
                <div>
                  <div className="font-medieval text-sm text-red-900">Experience Lost</div>
                  <div className="font-body text-xs text-red-700">10% XP Penalty</div>
                </div>
              </div>
              <div className="font-bold text-2xl text-red-800">
                -{xpLost} XP
              </div>
            </div>
          </div>

          {/* Respawn Info */}
          <div className="bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-500 rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏰</span>
              <div>
                <div className="font-medieval text-sm text-amber-900">Respawn Location</div>
                <div className="font-body text-xs text-amber-700">
                  You have been returned to the Guild Hall
                </div>
              </div>
            </div>
          </div>

          {/* HP Restored */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-500 rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">❤️</span>
              <div>
                <div className="font-medieval text-sm text-green-900">Health Restored</div>
                <div className="font-body text-xs text-green-700">
                  Your HP has been fully restored
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400 rounded-lg p-3 mb-6">
          <p className="font-body text-sm text-purple-900 text-center italic">
            "Every defeat is a lesson. Train harder and return stronger!"
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl border-2 border-red-700"
        >
          Return to Guild Hall
        </button>
      </div>
    </div>
  );
};
