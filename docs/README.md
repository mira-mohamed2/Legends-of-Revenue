# 📚 Legends of Revenue - Documentation Index# Tribute of Grafton 🏰⚔️



> Complete documentation for the Legends of Revenue game projectA browser-based RPG demo inspired by Fallen Sword, themed around taxation lore. Features map exploration, turn-based combat, quests, inventory management, and character progression.



## 📖 Quick Navigation![Status](https://img.shields.io/badge/status-in%20development-yellow)

![Node](https://img.shields.io/badge/node-16.10.0-green)

### 🎮 For Players![License](https://img.shields.io/badge/license-MIT-blue)

- **[Main README](../README.md)** - Project overview and quick start guide

- **[Game Lore](lore/story.md)** - Complete narrative and world building## 🎮 Features

- **[Feature Guides](features/)** - How to use game features

- **Player System**: Registration, login, stats, leveling with XP thresholds

### 👨‍💻 For Developers- **Map Exploration**: Grid-based movement, Guild Hall hub, Village of Grafton

- **[Architecture](development/architecture.md)** - Technical documentation and system design- **Turn-Based Combat**: Attack, use items, flee; enemy special abilities

- **[GitHub Setup](../GITHUB_SETUP.md)** - Repository and version control- **Quest System**: NPC dialogues, branching choices, quest tracking

- **[Roadmap](development/roadmap.md)** - Future features and plans- **Inventory**: Equipment (weapon/armor/accessory), consumables, quest items

- **Medieval UI**: Parchment textures, gold/emerald theming, immersive design

---

## 🛠️ Tech Stack

## 📂 Documentation Structure

- **Frontend**: React 18 + TypeScript + Vite

```- **Styling**: Tailwind CSS (custom medieval theme)

docs/- **State Management**: Zustand

├── README.md (you are here)       # Documentation index- **Routing**: React Router v7

│- **Persistence**: LocalStorage (upgradeable to backend)

├── features/                       # Feature-specific guides- **Testing**: Vitest + React Testing Library

│   ├── character-storage.md       # Import/Export characters

│   ├── avatar-system.md           # Avatar customization## 📁 Project Structure

│   ├── combat-consumables.md      # Using items in combat

│   └── ui-redesign.md             # UI improvements```

│tribute-of-grafton/

├── lore/                          # Game world and narrative├── src/

│   ├── story.md                   # Complete game narrative│   ├── app/              # Routing and global providers

│   └── changelog.md               # Lore update history│   ├── state/            # Zustand stores

││   ├── data/             # JSON configs (enemies, items, quests, maps)

└── development/                   # Technical documentation│   ├── components/ui/    # Reusable UI components

    ├── architecture.md            # System architecture│   ├── features/

    ├── quick-reference.md         # Developer quick ref│   │   ├── auth/         # Authentication

    └── roadmap.md                 # Future features│   │   ├── map/          # Map exploration

```│   │   ├── combat/       # Combat system

│   │   ├── inventory/    # Inventory management

---│   │   ├── quests/       # Quests & dialogue

│   │   ├── character/    # Character stats

## 📋 All Documentation Files│   │   └── end/          # End screen

│   ├── utils/            # Utility functions

### 🚀 Getting Started│   ├── types/            # TypeScript definitions

| Document | Description | Audience |│   └── hooks/            # Custom React hooks

|----------|-------------|----------|├── public/assets/        # Static assets (sprites, icons)

| [README.md](../README.md) | Main project overview, installation, quick start | Everyone |├── TASK_BREAKDOWN.md     # Detailed development checklist

| [GITHUB_SETUP.md](../GITHUB_SETUP.md) | GitHub repository setup guide | Developers |└── tribute-of-grafton-plan.md  # Full implementation plan

```

### 🎮 Feature Documentation

| Document | Description | Status |## 🚀 Quick Start

|----------|-------------|--------|

| [Character Storage](features/character-storage.md) | Complete guide to import/export system | ✅ Complete |### Prerequisites

| [Avatar System](features/avatar-system.md) | Avatar customization and upload | ✅ Complete |

| [Combat Consumables](features/combat-consumables.md) | Using potions and items in battle | ✅ Complete |- Node.js 16.10+ (18+ recommended)

| [UI Redesign](features/ui-redesign.md) | Compact layout improvements | ✅ Complete |- npm 7+



### 🏰 Lore & Story### Installation

| Document | Description | Status |

|----------|-------------|--------|```powershell

| [Game Story](lore/story.md) | Complete narrative: MIRA vs Tax Evaders | ✅ Complete |# Install dependencies

| [Lore Changelog](lore/changelog.md) | History of narrative changes | ✅ Complete |npm install



### 🔧 Development Docs# Run development server

| Document | Description | Status |npm run dev

|----------|-------------|--------|```

| [Architecture](development/architecture.md) | Complete system architecture | ✅ Complete |

| [Quick Reference](development/quick-reference.md) | Developer cheat sheet | ✅ Complete |The app will be available at `http://localhost:5173`

| [Roadmap](development/roadmap.md) | Future features and plans | ✅ Complete |

### Build for Production

---

```powershell

## 🎯 Find What You Neednpm run build

npm run preview

### "I want to play the game"```

1. **Start here**: [README.md](../README.md) - Installation and setup

2. **Learn the story**: [Game Story](lore/story.md) - Understand the world## 🎯 Game Controls

3. **Manage characters**: [Character Storage](features/character-storage.md) - Backup and share

- **Map Navigation**: Click adjacent tiles to move

### "I want to understand the code"- **Combat**: Use action buttons (Attack, Item, Flee)

1. **System overview**: [Architecture](development/architecture.md) - How it all works- **Inventory**: Click items to view details, equip/use

2. **Quick lookups**: [Quick Reference](development/quick-reference.md) - Find things fast- **Quests**: Track active quests in the quest log

3. **Specific features**: [Feature Docs](features/) - Implementation details- **Keyboard Shortcuts**: 

  - `1` - Attack

### "I want to contribute"  - `2` - Use Item

1. **Setup project**: [README.md](../README.md) - Get it running  - `3` - Flee

2. **Learn structure**: [Architecture](development/architecture.md) - Understand the code  - `ESC` - Close modals

3. **Pick a task**: [Roadmap](development/roadmap.md) - See what's needed

## 📖 Questline: The Tribute of Grafton

---

1. **Travel to Grafton**: Speak with Guildmaster Ardin and journey to the village

## 🔍 Search by Topic2. **Talk to Elder Marra**: Learn about the Debt Wraith menace

3. **Defeat Debt Wraith**: Battle the boss in the Sanctum

### Core Systems4. **Deliver Tribute**: Return the tribute to the Guildmaster

- **Player Management**: [Architecture](development/architecture.md#player-system), [Character Storage](features/character-storage.md)

- **Combat System**: [Combat Consumables](features/combat-consumables.md), [Architecture](development/architecture.md#combat-system)Complete all quests to see "To Be Continued…"

- **Map & Exploration**: [Architecture](development/architecture.md#world-system)

- **State Management**: [Quick Reference](development/quick-reference.md#state-stores)## 🧪 Testing



### Features```powershell

- **Avatars**: [Avatar System](features/avatar-system.md)# Run unit tests

- **Consumables**: [Combat Consumables](features/combat-consumables.md)npm run test

- **Import/Export**: [Character Storage](features/character-storage.md)

- **UI Design**: [UI Redesign](features/ui-redesign.md)# Run tests with coverage

npm run test:coverage

### Game Content```

- **Narrative**: [Game Story](lore/story.md)

- **Lore Changes**: [Lore Changelog](lore/changelog.md)## 📋 Development Progress

- **Future Content**: [Roadmap](development/roadmap.md)

See the **[docs/](./docs/)** folder for comprehensive development documentation:

---

- **[Setup Guide](./docs/SETUP-GUIDE.md)** - Current setup status & next steps

## 📝 Documentation Standards- **[Development Workflow](./docs/DEVELOPMENT-WORKFLOW.md)** - Daily development process

- **[Task Breakdown](./docs/02-TASK-BREAKDOWN.md)** - 277 tasks with checkboxes (coming soon)

### Quality Guidelines- **[Implementation Plan](./docs/01-IMPLEMENTATION-PLAN.md)** - Full architecture (coming soon)

- ✅ Clear and concise writing- **[Quick Reference](./docs/03-QUICK-REFERENCE.md)** - Developer guide (coming soon)

- ✅ Include code examples where relevant- **[Progress Tracker](./docs/04-PROGRESS-TRACKER.md)** - Visual milestones (coming soon)

- ✅ Add screenshots for UI features

- ✅ Keep up to date with code changes**Current Phase**: Project Setup & Foundation (Phase 1 - 40% complete)

- ✅ Link to related documentation

## 🎨 Theme

### File Organization

- **Root level**: Main README, setup guides- **Colors**: Parchment (#fdf2d0), Emerald (#1f5d3b), Gold (#c99a2e)

- **features/**: User-facing feature documentation- **Fonts**: Uncial Antiqua (headers), Crimson Text (body)

- **lore/**: Game narrative and world- **Style**: Medieval fantasy with taxation lore

- **development/**: Technical and architecture docs

## 🔮 Future Roadmap

---

- [ ] Backend API (Express + MongoDB)

## 🔄 Recent Updates- [ ] Multi-device save sync

- [ ] Expanded world map and quests

### October 9, 2025- [ ] Crafting system

- 📂 Reorganized all documentation into logical folders- [ ] Multiplayer co-op

- 📝 Created comprehensive documentation index- [ ] Mobile app (PWA)

- 🔗 Improved cross-referencing between docs

- ✨ Updated all documentation links## 📝 License



### October 8, 2025MIT License - feel free to use this project for learning or inspiration!

- ✅ Character storage system documentation

- ✅ Avatar system guide## 🙏 Credits

- ✅ Combat consumables guide

- ✅ UI redesign documentationInspired by **Fallen Sword** and classic browser-based RPGs.



------



## 🤝 Contributing to Docs**To Be Continued…** ✨


Documentation improvements are always welcome!

### How to Help
1. Find typos or unclear sections? Open an issue
2. Want to improve a doc? Submit a pull request
3. Missing documentation? Suggest it in discussions
4. Found broken links? Report them

### Documentation TODO
- [ ] API reference documentation
- [ ] Testing guide
- [ ] Deployment guide (detailed)
- [ ] Contributing guidelines
- [ ] Code style guide

---

## 📌 Metadata

| Property | Value |
|----------|-------|
| Documentation Version | 2.0.0 |
| Game Version | Beta 1.0 |
| Last Major Update | October 9, 2025 |
| Total Documents | 10+ files |
| Languages | English |

---

## 💡 Tips

- 📖 **New to the project?** Start with the [Main README](../README.md)
- 🔧 **Want to code?** Check [Architecture](development/architecture.md) first
- 🎮 **Just playing?** Read the [Game Story](lore/story.md)
- 🐛 **Found a bug?** See [GitHub Issues](https://github.com/mira-mohamed2/Legends-of-Revenue/issues)

---

**Made with 💰 for MIRA**  
*Fight tax evasion, one document at a time!*
