# Tribute of Grafton 🏰⚔️

A browser-based RPG demo inspired by Fallen Sword, themed around taxation lore. Features map exploration, turn-based combat, quests, inventory management, and character progression.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Node](https://img.shields.io/badge/node-16.10.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎮 Features

- **Player System**: Registration, login, stats, leveling with XP thresholds
- **Map Exploration**: Grid-based movement, Guild Hall hub, Village of Grafton
- **Turn-Based Combat**: Attack, use items, flee; enemy special abilities
- **Quest System**: NPC dialogues, branching choices, quest tracking
- **Inventory**: Equipment (weapon/armor/accessory), consumables, quest items
- **Medieval UI**: Parchment textures, gold/emerald theming, immersive design

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom medieval theme)
- **State Management**: Zustand
- **Routing**: React Router v7
- **Persistence**: LocalStorage (upgradeable to backend)
- **Testing**: Vitest + React Testing Library

## 📁 Project Structure

```
tribute-of-grafton/
├── src/
│   ├── app/              # Routing and global providers
│   ├── state/            # Zustand stores
│   ├── data/             # JSON configs (enemies, items, quests, maps)
│   ├── components/ui/    # Reusable UI components
│   ├── features/
│   │   ├── auth/         # Authentication
│   │   ├── map/          # Map exploration
│   │   ├── combat/       # Combat system
│   │   ├── inventory/    # Inventory management
│   │   ├── quests/       # Quests & dialogue
│   │   ├── character/    # Character stats
│   │   └── end/          # End screen
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript definitions
│   └── hooks/            # Custom React hooks
├── public/assets/        # Static assets (sprites, icons)
├── TASK_BREAKDOWN.md     # Detailed development checklist
└── tribute-of-grafton-plan.md  # Full implementation plan
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16.10+ (18+ recommended)
- npm 7+

### Installation

```powershell
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```powershell
npm run build
npm run preview
```

## 🎯 Game Controls

- **Map Navigation**: Click adjacent tiles to move
- **Combat**: Use action buttons (Attack, Item, Flee)
- **Inventory**: Click items to view details, equip/use
- **Quests**: Track active quests in the quest log
- **Keyboard Shortcuts**: 
  - `1` - Attack
  - `2` - Use Item
  - `3` - Flee
  - `ESC` - Close modals

## 📖 Questline: The Tribute of Grafton

1. **Travel to Grafton**: Speak with Guildmaster Ardin and journey to the village
2. **Talk to Elder Marra**: Learn about the Debt Wraith menace
3. **Defeat Debt Wraith**: Battle the boss in the Sanctum
4. **Deliver Tribute**: Return the tribute to the Guildmaster

Complete all quests to see "To Be Continued…"

## 🧪 Testing

```powershell
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📋 Development Progress

See the **[docs/](./docs/)** folder for comprehensive development documentation:

- **[Setup Guide](./docs/SETUP-GUIDE.md)** - Current setup status & next steps
- **[Development Workflow](./docs/DEVELOPMENT-WORKFLOW.md)** - Daily development process
- **[Task Breakdown](./docs/02-TASK-BREAKDOWN.md)** - 277 tasks with checkboxes (coming soon)
- **[Implementation Plan](./docs/01-IMPLEMENTATION-PLAN.md)** - Full architecture (coming soon)
- **[Quick Reference](./docs/03-QUICK-REFERENCE.md)** - Developer guide (coming soon)
- **[Progress Tracker](./docs/04-PROGRESS-TRACKER.md)** - Visual milestones (coming soon)

**Current Phase**: Project Setup & Foundation (Phase 1 - 40% complete)

## 🎨 Theme

- **Colors**: Parchment (#fdf2d0), Emerald (#1f5d3b), Gold (#c99a2e)
- **Fonts**: Uncial Antiqua (headers), Crimson Text (body)
- **Style**: Medieval fantasy with taxation lore

## 🔮 Future Roadmap

- [ ] Backend API (Express + MongoDB)
- [ ] Multi-device save sync
- [ ] Expanded world map and quests
- [ ] Crafting system
- [ ] Multiplayer co-op
- [ ] Mobile app (PWA)

## 📝 License

MIT License - feel free to use this project for learning or inspiration!

## 🙏 Credits

Inspired by **Fallen Sword** and classic browser-based RPGs.

---

**To Be Continued…** ✨
