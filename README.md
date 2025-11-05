# 💰 Legends of Revenue

> A medieval-themed RPG where you play as a MIRA (Maldives Inland Revenue Authority) agent fighting tax evasion!

![Status](https://img.shields.io/badge/status-playable%20beta-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-4.5-646CFF)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎮 About

**Legends of Revenue** is a browser-based RPG with a unique twist: instead of being a rebel fighting the system, you're a heroic MIRA (Maldives Inland Revenue Authority) agent bringing tax evaders to justice! Explore dangerous territories, battle corrupt businessmen and offshore accountants, collect epic loot, and restore revenue to the Maldives.

### 🎯 Key Features

✅ **Character Storage System** - Import/Export characters, backup progress  
✅ **Combat System** - Turn-based battles with consumable items  
✅ **Avatar System** - Choose from 4 default avatars or upload custom  
✅ **Map Exploration** - 12 unique locations to discover  
✅ **Quest System** - Complete MIRA missions  
✅ **Inventory Management** - Collect weapons, armor, and consumables  
✅ **Achievement System** - Unlock achievements for milestones  
✅ **Progression** - Level up to 10, gain stats, unlock content  
✅ **Compact UI** - Optimized medieval-themed interface  

## 🚀 Quick Start

### Prerequisites
- Node.js 16.10.0 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/legends-of-revenue.git
cd legends-of-revenue

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser!

### Build for Production

```bash
npm run build
npm run preview
```

## 🎲 How to Play

1. **Create Your Agent** - Register with a username and password
2. **Choose Your Avatar** - Select from 4 default avatars or upload your own
3. **Explore the World** - Navigate through 12 locations (MIRA HQ, Business District, Black Market, etc.)
4. **Battle Tax Evaders** - Fight enemies in turn-based combat
5. **Use Consumables** - Heal during battle with health potions
6. **Complete Quests** - Accept missions from NPCs
7. **Level Up** - Gain XP, increase stats, unlock achievements
8. **Manage Characters** - Export/Import characters, switch between profiles

## 🗺️ Game World

### Locations
- 🏛️ **MIRA Headquarters** - Your home base
- 🏢 **Business District** - Hunt down petty evaders
- 🌑 **Black Market Alley** - Shady dealings and illegal trades
- 🛂 **Border Checkpoint** - Catch smugglers
- 🏝️ **Offshore Haven** - Face the most corrupt criminals
- 🐉 **Dragon's Lair** - Final boss: Arim the Dragon

### Enemies
- � **Tax Dodger Cat** - Vermin hoarding coins (Level 1)
- 🏃 **Petty Tax Evader** - Small-time criminals (Level 2-3)
- 💼 **Offshore Accountant** - Shady financial advisors (Level 4-5)
- 🤵 **Corrupted Businessman** - Wealthy fraudsters (Level 6-8)

## 📦 Character Management

### Export/Import Characters
- Click **💾 Characters** button (top-right)
- Export current character or all characters
- Import characters from `.json` files
- Share characters with friends!

### Character Data Includes:
- Stats (Level, XP, HP, Gold, Attack, Defense)
- Equipment (Weapon, Armor, Accessory)
- Full inventory
- Current location
- Enemies killed
- All unlocked achievements
- Custom avatar

See [CHARACTER_STORAGE.md](CHARACTER_STORAGE.md) for full documentation.

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 4.5 |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **Storage** | LocalStorage |
| **Testing** | Vitest (coming soon) |

## 📁 Project Structure

```
legends-of-revenue/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── MenuBar.tsx      # Navigation + player stats
│   │   ├── CharacterManager.tsx  # Import/Export UI
│   │   └── AvatarSelector.tsx    # Avatar selection
│   ├── features/            # Feature modules
│   │   ├── auth/           # Login/Register
│   │   ├── map/            # Map exploration
│   │   ├── combat/         # Battle system
│   │   ├── character/      # Character sheet
│   │   ├── market/         # Shop system
│   │   └── achievements/   # Achievement notifications
│   ├── state/              # Zustand stores
│   │   ├── playerStore.ts  # Player data & actions
│   │   ├── worldStore.ts   # Map & exploration
│   │   ├── achievementStore.ts  # Achievements
│   │   └── sessionStore.ts # Auth & users
│   ├── data/               # Game data (JSON)
│   │   ├── enemies.json
│   │   ├── items.json
│   │   ├── maps.json
│   │   └── quests.json
│   ├── utils/              # Utilities
│   │   ├── characterStorage.ts  # Import/Export
│   │   └── storage.ts      # LocalStorage wrapper
│   └── types/              # TypeScript definitions
├── public/
│   └── images/
│       ├── avatars/        # Player avatars
│       └── enemies/        # Enemy images
└── docs/                   # Documentation
```

## 📚 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Full system architecture
- [CHARACTER_STORAGE.md](CHARACTER_STORAGE.md) - Character import/export guide
- [LORE.md](LORE.md) - Complete game lore and narrative
- [CONSUMABLES_FEATURE.md](CONSUMABLES_FEATURE.md) - Combat consumables system
- [AVATAR_SYSTEM.md](AVATAR_SYSTEM.md) - Avatar customization guide
- [CHARACTER_REDESIGN.md](CHARACTER_REDESIGN.md) - UI optimization details

## 🎨 Features in Detail

### Character Storage System
Store characters in `Documents/Legends of Revenue/Characters/` with full import/export capabilities. Share your character builds or backup your progress!

### Combat System
Turn-based combat with:
- Attack enemies
- Use consumable items (health potions)
- Combat log showing all actions
- Flee option
- XP and gold rewards

### Avatar System
- 4 default avatars (Warrior, Mage, Rogue, Priest)
- Custom avatar upload
- Displayed in combat and character screen

### UI Design
- Medieval parchment theme
- Compact layout for maximum information density
- Persistent header with player stats (Name, Level, Gold, HP)
- Responsive design

## 🚧 Roadmap

### Coming Soon
- [ ] Class system (Warrior, Mage, Rogue, Priest)
- [ ] Crafting system
- [ ] More quests and storylines
- [ ] Sound effects and music
- [ ] Mobile optimization
- [ ] Multiplayer features

### Future Enhancements
- [ ] Cloud save sync
- [ ] Character leaderboards
- [ ] PvP battles
- [ ] Guild system
- [ ] Daily quests
- [ ] Seasonal events

See [WHATS-REMAINING.md](WHATS-REMAINING.md) for detailed roadmap.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Zustand for state management
- Tailwind CSS for styling

## 🐛 Known Issues

- Character import/export uses browser localStorage (5-10MB limit)
- No server-side validation (single-player game)
- Some TypeScript definitions need refinement

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic browser RPGs
- Medieval-themed UI design
- MIRA (Maldives Inland Revenue Authority) for the unique theme
- Community feedback and testing

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/legends-of-revenue/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/legends-of-revenue/discussions)

## ⭐ Star This Repository!

If you enjoy this game, please give it a star! It helps others discover the project.

---

**Made with ⚔️ by [Your Name]**

*Fight tax evasion, one battle at a time!* 💰
