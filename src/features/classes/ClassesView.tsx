import React from 'react';

export const ClassesView: React.FC = () => {
  // Future class system design
  const futureClasses = [
    {
      id: 'tax-rogue',
      name: 'Tax Rogue',
      icon: '🗡️',
      description: 'Masters of evasion and quick strikes. High critical chance and agility.',
      abilities: [
        { name: 'Shadow Audit', description: 'Turn invisible for 3 turns, evading all attacks' },
        { name: 'Loophole Strike', description: 'Critical hit with 3x damage' },
        { name: 'Receipt Shred', description: 'Reduce enemy defense by 50%' },
      ],
      stats: { hp: 80, attack: 12, defense: 6, critChance: 25 },
    },
    {
      id: 'revenue-warrior',
      name: 'Revenue Warrior',
      icon: '⚔️',
      description: 'Tank class with high HP and defense. Protects allies and deals consistent damage.',
      abilities: [
        { name: 'Tax Shield', description: 'Block all damage for 2 turns' },
        { name: 'Audit Slam', description: 'Heavy attack dealing 2x damage and stunning enemy' },
        { name: 'Collection Rage', description: 'Increase attack by 50% for 3 turns' },
      ],
      stats: { hp: 120, attack: 10, defense: 12, critChance: 5 },
    },
    {
      id: 'offshore-mage',
      name: 'Offshore Mage',
      icon: '🔮',
      description: 'Harness the power of hidden assets. Deals massive magic damage from afar.',
      abilities: [
        { name: 'Account Freeze', description: 'Freeze enemy for 2 turns, preventing actions' },
        { name: 'Asset Blast', description: 'Magic attack dealing 2.5x damage' },
        { name: 'Money Laundering', description: 'Heal for 50% of damage dealt next turn' },
      ],
      stats: { hp: 70, attack: 15, defense: 4, critChance: 15 },
    },
    {
      id: 'healer',
      name: 'Healer',
      icon: '✨',
      description: 'Support class with healing and buffs. Keeps the party alive through tax season.',
      abilities: [
        { name: 'Write-Off Heal', description: 'Restore 50 HP to self or ally' },
        { name: 'Charitable Blessing', description: 'Increase all ally stats by 25%' },
        { name: 'Exemption Shield', description: 'Grant immunity to one attack' },
      ],
      stats: { hp: 90, attack: 8, defense: 8, critChance: 10 },
    },
  ];
  
  return (
    <div className="p-6 space-y-6">
      <div className="panel">
        <h1 className="font-medieval text-4xl text-gold mb-4">⚔️ Character Classes</h1>
        
        <div className="bg-purple-100 border-2 border-purple-600 rounded p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-6xl mb-3">🎭</div>
            <h2 className="font-medieval text-3xl text-purple-900 mb-2">Class System Coming Soon!</h2>
            <p className="font-body text-purple-800">
              Choose your path and unlock powerful abilities!
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="font-medieval text-2xl text-brown mb-4">Planned Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futureClasses.map((classData) => (
              <div
                key={classData.id}
                className="bg-parchment-100 border-2 border-brown rounded p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-5xl">{classData.icon}</span>
                  <div>
                    <h3 className="font-medieval text-2xl text-gold">{classData.name}</h3>
                    <p className="font-body text-sm text-brown-600">{classData.description}</p>
                  </div>
                </div>
                
                {/* Base Stats */}
                <div className="bg-parchment-200 rounded p-3 mb-3">
                  <h4 className="font-medieval text-sm text-brown mb-2">Base Stats:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm font-body">
                    <div>❤️ HP: {classData.stats.hp}</div>
                    <div>⚔️ ATK: {classData.stats.attack}</div>
                    <div>🛡️ DEF: {classData.stats.defense}</div>
                    <div>💥 Crit: {classData.stats.critChance}%</div>
                  </div>
                </div>
                
                {/* Abilities */}
                <div>
                  <h4 className="font-medieval text-sm text-brown mb-2">Class Abilities:</h4>
                  <div className="space-y-2">
                    {classData.abilities.map((ability, index) => (
                      <div key={index} className="bg-emerald-100 rounded p-2">
                        <div className="font-medieval text-sm text-emerald-900">{ability.name}</div>
                        <div className="font-body text-xs text-emerald-800">{ability.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Feature Overview */}
        <div className="bg-blue-100 border-2 border-blue-600 rounded p-6">
          <h3 className="font-medieval text-2xl text-blue-900 mb-4">Class System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-body text-blue-800">
            <div>
              <h4 className="font-bold mb-2">🎯 Choose Your Class</h4>
              <p className="text-sm">
                Select a class at level 5 to unlock unique abilities and playstyle
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">⚡ Unlock Abilities</h4>
              <p className="text-sm">
                Gain new abilities as you level up, with ultimate ability at level 10
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">🔄 Respec Option</h4>
              <p className="text-sm">
                Change your class for a gold fee, allowing you to experiment with different builds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
