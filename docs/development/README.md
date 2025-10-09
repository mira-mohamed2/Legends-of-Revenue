# 🔧 Development Documentation

> Technical documentation for Legends of Revenue developers

## 📋 Development Documents

| Document | Description | Audience |
|----------|-------------|----------|
| [Architecture](architecture.md) | Complete system architecture | All Developers |
| [Quick Reference](quick-reference.md) | Fast lookup guide | All Developers |
| [Roadmap](roadmap.md) | Future features and plans | Everyone |

---

## 🏗️ System Architecture

**Full documentation**: [architecture.md](architecture.md)

### Key Systems

**Player System**
- Character stats and progression
- Inventory and equipment management
- Character storage (import/export)
- Avatar customization

**Combat System**
- Turn-based battle mechanics
- Enemy AI and encounters
- Consumable items in combat
- XP and loot rewards

**World System**
- Map exploration
- Location-based encounters
- Step-by-step progression
- Danger levels and encounter rates

**Quest System**
- NPC dialogues
- Quest tracking
- Branching choices
- Rewards and progression

**Achievement System**
- Milestone tracking
- Unlock conditions
- Notifications
- Progress saving

---

## 🚀 Quick Reference

**Full guide**: [quick-reference.md](quick-reference.md)

### Common Tasks

**Add New Enemy**
```
1. Edit src/data/enemies.json
2. Add image to public/images/enemies/
3. Update loot tables
```

**Add New Item**
```
1. Edit src/data/items.json
2. Add to enemy loot or shop
3. Update documentation
```

**Add New Feature**
```
1. Create in src/features/
2. Add route in App.tsx
3. Update MenuBar navigation
```

### Key Files
- `src/state/playerStore.ts` - Player data
- `src/state/worldStore.ts` - Map and exploration
- `src/utils/characterStorage.ts` - Import/Export
- `src/data/*.json` - Game content

---

## 🗺️ Project Roadmap

**Full roadmap**: [roadmap.md](roadmap.md)

### ✅ Completed (October 2025)
- Character storage system
- Avatar customization
- Combat consumables
- UI redesign (compact layouts)
- Persistent player stats header

### 🚧 In Progress
- Class system foundation
- Crafting system data structure

### 📋 Planned
- Multiplayer features
- Cloud save sync
- Mobile optimization
- Sound and music
- More quests and content

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite 4.5
- **Styling**: Tailwind CSS
- **State**: Zustand

### Storage
- **Local**: localStorage
- **Export**: JSON files
- **Future**: Cloud sync planned

### Development
- **Language**: TypeScript (strict mode)
- **Linting**: ESLint
- **Formatting**: Prettier (planned)
- **Testing**: Vitest (planned)

---

## 📦 Project Structure

```
src/
├── components/       # Reusable UI
│   ├── MenuBar.tsx
│   ├── CharacterManager.tsx
│   └── AvatarSelector.tsx
│
├── features/         # Feature modules
│   ├── auth/
│   ├── map/
│   ├── combat/
│   ├── character/
│   ├── market/
│   └── achievements/
│
├── state/            # Zustand stores
│   ├── playerStore.ts
│   ├── worldStore.ts
│   ├── sessionStore.ts
│   ├── achievementStore.ts
│   └── uiStore.ts
│
├── data/             # Game content (JSON)
│   ├── enemies.json
│   ├── items.json
│   ├── maps.json
│   └── quests.json
│
└── utils/            # Utilities
    ├── characterStorage.ts
    └── storage.ts
```

---

## 🎯 Development Workflow

### Setup
```bash
git clone https://github.com/mira-mohamed2/Legends-of-Revenue.git
cd Legends-of-Revenue
npm install
npm run dev
```

### Development
```bash
npm run dev        # Start dev server
# Make changes
# Test in browser (http://localhost:5173)
```

### Build & Deploy
```bash
npm run build      # Build for production
npm run preview    # Preview build locally
# Deploy dist/ folder
```

### Version Control
```bash
git add .
git commit -m "Description"
git push
```

---

## 🧪 Testing

### Manual Testing
- Test all features after changes
- Check character storage (export/import)
- Verify combat mechanics
- Test on different browsers

### Automated Testing (Coming Soon)
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests (planned)

---

## 📝 Code Standards

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` type
- Use type inference where possible

### React
- Functional components only
- Use hooks appropriately
- Keep components focused and small
- Extract reusable logic to custom hooks

### State Management
- Use Zustand stores for global state
- Local state for component-specific data
- Actions for state mutations
- Derive computed values when possible

### Styling
- Use Tailwind utility classes
- Follow medieval theme (parchment, gold, brown)
- Responsive design (mobile-first)
- Consistent spacing and sizing

---

## 🐛 Debugging

### Common Issues

**Storage not persisting?**
- Check localStorage quotas
- Verify storage keys
- Check console for errors

**State not updating?**
- Use Zustand DevTools
- Check action calls
- Verify set() calls in stores

**Build failing?**
- Check TypeScript errors
- Verify all imports
- Update dependencies

---

## 📚 Learning Resources

### React + TypeScript
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Zustand
- [Zustand Guide](https://github.com/pmndrs/zustand)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)

### Vite
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Make changes**
4. **Test thoroughly**
5. **Commit with clear message**
6. **Push to your fork**
7. **Create pull request**

### Pull Request Guidelines

- Clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Update documentation
- Follow code standards

### What We Need

- 🐛 Bug fixes
- ✨ New features from roadmap
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Tests and testing infrastructure

---

## 🔗 Related Documentation

- [Main README](../../README.md) - Project overview
- [Features](../features/) - Feature documentation
- [Lore](../lore/) - Game narrative
- [GitHub Setup](../../GITHUB_SETUP.md) - Repository setup

---

## 📞 Support

### Get Help

- 📖 Read documentation first
- 🔍 Search GitHub issues
- 💬 Ask in discussions
- 🐛 Report bugs via issues

### Contact

- GitHub Issues: Bug reports and features
- GitHub Discussions: Questions and ideas
- Pull Requests: Code contributions

---

## 📌 Quick Links

| Resource | Link |
|----------|------|
| GitHub Repo | [Legends-of-Revenue](https://github.com/mira-mohamed2/Legends-of-Revenue) |
| Live Demo | Coming soon |
| Documentation | You are here! |
| Issues | [GitHub Issues](https://github.com/mira-mohamed2/Legends-of-Revenue/issues) |

---

**Last Updated**: October 9, 2025  
**Documentation Version**: 2.0.0  
**Game Version**: Beta 1.0
