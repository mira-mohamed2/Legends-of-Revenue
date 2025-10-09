# 🚀 Developer Quick Reference

> Fast lookup guide for Legends of Revenue developers

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MenuBar.tsx          # Navigation + persistent stats
│   ├── CharacterManager.tsx # Import/Export UI
│   └── AvatarSelector.tsx   # Avatar selection modal
│
├── features/            # Feature modules
│   ├── auth/               # Authentication (login/register)
│   ├── map/                # Map exploration
│   ├── combat/             # Battle system
│   ├── character/          # Character sheet
│   ├── market/             # Shop
│   ├── achievements/       # Achievement notifications
│   ├── classes/            # Class system (coming soon)
│   └── players/            # Multiplayer (coming soon)
│
├── state/              # Zustand stores
│   ├── playerStore.ts      # Player data, inventory, equipment
│   ├── worldStore.ts       # Map, exploration, encounters
│   ├── sessionStore.ts     # Auth, user management
│   ├── achievementStore.ts # Achievement tracking
│   ├── questStore.ts       # Quest system
│   └── uiStore.ts          # UI state (combat, dialogs)
│
├── data/               # Game data (JSON)
│   ├── enemies.json        # Enemy definitions
│   ├── items.json          # Items and equipment
│   ├── maps.json           # Map locations
│   ├── quests.json         # Quest definitions
│   ├── classes.json        # Class system data
│   └── crafting.json       # Crafting recipes
│
├── utils/              # Utilities
│   ├── characterStorage.ts # Import/Export system
│   └── storage.ts          # LocalStorage wrapper
│
└── types/              # TypeScript definitions
    ├── player.ts           # PlayerStats, PlayerEquipment
    └── inventory.ts        # InventorySlot
```

---

## 🗃️ State Stores Reference

### playerStore.ts
**Purpose**: Player data, inventory, equipment, progression

**Key State**:
```typescript
stats: PlayerStats           // Level, XP, HP, gold, attack, defense
equipment: PlayerEquipment   // Weapon, armor, accessory
inventory: InventorySlot[]   // Items with quantities
location: string             // Current map tile ID
enemiesKilled: number        // Total defeats
locationsVisited: Set        // All discovered locations
avatar: string               // Avatar image path
customAvatar: string | null  // Custom uploaded avatar
```

**Key Actions**:
```typescript
updateStats(newStats)        // Update player stats
gainXP(amount)               // Add XP, handle leveling
takeDamage(amount)           // Reduce HP
heal(amount)                 // Restore HP
addItem(itemId, quantity)    // Add to inventory
removeItem(itemId, quantity) // Remove from inventory
useItem(itemId)              // Use consumable
equipItem(itemId, slot)      // Equip weapon/armor
savePlayer()                 // Save to characterStorage
loadPlayer(username)         // Load from characterStorage
```

### worldStore.ts
**Purpose**: Map system, exploration, encounters

**Key State**:
```typescript
currentTileId: string        // Current location
visitedTiles: Set            // All visited locations
exploration: number          // Steps in current location (0-10)
encounterRate: number        // Chance of combat (0-1)
activeEncounter: Enemy | null // Current enemy
currentPath: PathProgress    // Path navigation data
```

**Key Actions**:
```typescript
setLocation(tileId)          // Move to new location
takeStep()                   // Explore current location
startCombat(enemy)           // Trigger battle
endCombat(victory, xp, gold, loot) // Finish battle
```

### sessionStore.ts
**Purpose**: User authentication and session management

**Key State**:
```typescript
currentUser: string | null   // Logged-in username
isAuthenticated: boolean     // Login status
users: Map                   // Username -> password
```

**Key Actions**:
```typescript
register(username, password) // Create new user
login(username, password)    // Authenticate user
logout()                     // Clear session
```

### achievementStore.ts
**Purpose**: Achievement tracking and notifications

**Key State**:
```typescript
achievements: Achievement[]   // All achievements with unlock status
recentUnlock: Achievement    // Last unlocked (for notification)
```

**Key Actions**:
```typescript
checkAchievements(stats, inventory, kills, locations, equipment)
unlockAchievement(id)
clearRecentUnlock()
```

### uiStore.ts
**Purpose**: UI state for dialogs, combat, etc.

**Key State**:
```typescript
combatLog: string[]          // Battle messages
isInCombat: boolean          // Combat screen active
```

**Key Actions**:
```typescript
addCombatLog(message)
clearCombatLog()
setInCombat(value)
```

---

## 📦 Data Files Reference

### enemies.json
```json
{
  "id": "tax-dodger-rat",
  "name": "Tax Dodger Rat",
  "level": 1,
  "hp": 20,
  "attack": 3,
  "defense": 1,
  "xpReward": 10,
  "goldReward": 5,
  "loot": [...]
}
```

### items.json
```json
{
  "id": "health-potion",
  "name": "Health Potion",
  "description": "Restores 20 HP",
  "category": "consumable",
  "rarity": "common",
  "value": 12,
  "stackable": true,
  "maxStack": 5,
  "effect": { "type": "heal", "value": 20 }
}
```

### maps.json
```json
{
  "id": "guild-hall",
  "name": "MIRA Headquarters",
  "description": "...",
  "type": "safe",
  "dangerLevel": 0,
  "neighbors": ["business-district"],
  "encounterRate": 0.0
}
```

---

## 🎨 UI Components

### MenuBar.tsx
**Purpose**: Persistent header with navigation and player stats

**Displays**:
- Logo
- Player name, level, gold, HP
- Navigation menu
- Logout button
- Character Manager button (💾)

### CharacterManager.tsx
**Purpose**: Import/Export character management

**Features**:
- Export current character
- Import character from file
- Export all characters
- List all saved characters
- Load different character
- Delete character

### AvatarSelector.tsx
**Purpose**: Avatar selection and custom upload

**Features**:
- 4 default avatars (Warrior, Mage, Rogue, Priest)
- Custom avatar upload
- Preview before selection

---

## 🛠️ Utility Functions

### characterStorage.ts

```typescript
// Save character to storage
saveCharacter(data: CharacterData): boolean

// Load character from storage
loadCharacter(username: string): CharacterData | null

// Export to downloadable file
exportCharacter(username: string): void

// Import from file
importCharacter(file: File): Promise<CharacterData | null>

// List all saved characters
listCharacters(): string[]

// Delete character
deleteCharacter(username: string): boolean

// Backup all characters
exportAllCharacters(): void

// Get character summary
getCharacterInfo(username: string): CharacterInfo | null
```

---

## 🎮 Game Flow

### 1. Authentication
```
AuthView → sessionStore.register/login() 
  → playerStore.loadPlayer() or initializePlayer()
  → Navigate to Map
```

### 2. Map Exploration
```
MapView → worldStore.setLocation(tileId)
  → worldStore.takeStep()
  → Random encounter check
  → If encounter: worldStore.startCombat()
```

### 3. Combat
```
CombatView → Display enemy
  → Player action (attack/use item/flee)
  → Enemy turn
  → Repeat until victory/defeat/flee
  → worldStore.endCombat()
  → playerStore.gainXP(), addGold(), addItems()
```

### 4. Character Management
```
CharacterView → Display stats, equipment, inventory
  → playerStore.equipItem()/unequipItem()
  → AvatarSelector for avatar changes
  → CharacterManager for import/export
```

---

## 💾 Storage Keys

### localStorage Keys
```
character_{username}     # Character data (new format)
player:{username}        # Character data (old format, fallback)
session                  # Current session
users                    # User credentials
achievements:{username}  # Achievement data
```

---

## 🔧 Common Tasks

### Add a New Enemy
1. Edit `src/data/enemies.json`
2. Add image to `public/images/enemies/`
3. Update encounter rates in `maps.json`

### Add a New Item
1. Edit `src/data/items.json`
2. Add to enemy loot tables
3. Optionally add to shop

### Add a New Location
1. Edit `src/data/maps.json`
2. Add `neighbors` connections
3. Set `encounterRate` and `dangerLevel`

### Add an Achievement
1. Edit `achievementStore.ts` ACHIEVEMENT_LIST
2. Add check logic in `checkAchievements()`

### Add a Feature
1. Create folder in `src/features/`
2. Create view component
3. Add route in `App.tsx`
4. Add menu item in `MenuBar.tsx`

---

## 🎯 Key Constants

### Level System
```typescript
MAX_LEVEL = 10
XP_TO_NEXT = level * 100
STAT_GAIN_PER_LEVEL = { attack: 2, defense: 1, maxHp: 10 }
```

### Combat
```typescript
FLEE_SUCCESS_RATE = 0.5
DEATH_XP_LOSS = 10% of current level requirement
DEATH_RESPAWN = "guild-hall"
```

### Exploration
```typescript
STEPS_TO_COMPLETE = 10
ENCOUNTER_RATES = 0.0 (safe) to 0.7 (dangerous)
```

---

## 🐛 Debugging Tips

### Common Issues

**Character not saving?**
- Check browser localStorage limits
- Verify `(window as any).__currentUsername` is set
- Check console for characterStorage errors

**Combat not working?**
- Verify enemy data in `enemies.json`
- Check `uiStore.setInCombat(true)`
- Ensure combat log is updating

**Achievements not unlocking?**
- Call `playerStore.checkAchievements()` after actions
- Verify achievement conditions in achievementStore

**Items not working?**
- Check item exists in `items.json`
- Verify `category: "consumable"` for usable items
- Check `effect.type` and `effect.value`

---

## 📝 Code Patterns

### Adding State to Store
```typescript
// In store definition
set((state) => ({
  newProperty: newValue,
}));

// Access in component
const { newProperty } = useStoreName();
```

### Calling Actions
```typescript
// Get action from store
const { actionName } = useStoreName();

// Call with parameters
actionName(param1, param2);
```

### TypeScript Interfaces
```typescript
// Define interface
interface MyType {
  prop1: string;
  prop2: number;
}

// Use in function
function myFunc(data: MyType): void {
  // ...
}
```

---

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Build
npm run build            # Production build to dist/
npm run preview          # Preview production build

# Git
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to GitHub

# Character Export (in browser console)
localStorage.getItem('character_username')  # View character data
```

---

## 🔗 Useful Links

- [Main Architecture](architecture.md) - Full system documentation
- [Character Storage](../features/character-storage.md) - Import/Export guide
- [Roadmap](roadmap.md) - Future features
- [GitHub Repo](https://github.com/mira-mohamed2/Legends-of-Revenue)

---

**Last Updated**: October 9, 2025  
**Version**: 2.0.0
