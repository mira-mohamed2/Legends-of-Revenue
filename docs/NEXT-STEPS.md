# 🎯 Next Steps - Starting Development

**Current Phase:** 1 (Setup) → Moving to Phase 2 (Core Systems)  
**Priority:** Build foundational utilities and state management

---

## 🚀 Immediate Actions (This Week)

### 1. Create LocalStorage Utilities
**File:** `src/utils/storage.ts`

```typescript
// Purpose: Handle all LocalStorage operations with versioning
export const STORAGE_VERSION = 1;
export const STORAGE_KEY_PREFIX = 'tribute-of-grafton:';

// Functions to implement:
// - saveToStorage(key, data)
// - loadFromStorage(key)
// - clearStorage(key)
// - migrateStorage(oldVersion, newVersion)
```

**Acceptance Criteria:**
- [x] Can save JavaScript objects to LocalStorage
- [x] Can load and parse data from LocalStorage
- [x] Handles corrupted data gracefully
- [x] Schema versioning for future migrations
- [x] Clear error messages

**Test it:**
```typescript
// Manual test in browser console
import { saveToStorage, loadFromStorage } from './utils/storage';

const testData = { username: 'test', level: 1 };
saveToStorage('test-player', testData);
const loaded = loadFromStorage('test-player');
console.log(loaded); // Should match testData
```

---

### 2. Build Session Store (Authentication)
**File:** `src/state/sessionStore.ts`

```typescript
import { create } from 'zustand';

interface SessionState {
  currentUser: string | null;
  isAuthenticated: boolean;
  
  // Actions
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  
  register: async (username, password) => {
    // TODO: Implement registration logic
  },
  
  login: async (username, password) => {
    // TODO: Implement login logic
    return false;
  },
  
  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },
}));
```

**Acceptance Criteria:**
- [x] Register creates new user in LocalStorage
- [x] Login validates credentials
- [x] Prevents duplicate usernames
- [x] Simple password validation (SHA-256 for production)
- [x] Session persists across page refreshes

---

### 3. Build Player Store
**File:** `src/state/playerStore.ts`

```typescript
import { create } from 'zustand';
import type { PlayerStats, PlayerEquipment } from '../types/player';

interface PlayerState {
  stats: PlayerStats;
  inventory: InventorySlot[];
  equipment: PlayerEquipment;
  location: string;
  
  // Actions
  updateStats: (newStats: Partial<PlayerStats>) => void;
  addItem: (itemId: string, quantity: number) => void;
  equipItem: (itemId: string, slot: string) => void;
  gainXP: (amount: number) => void;
  // ... more actions
}
```

**Key Features:**
- [ ] Manage player stats (HP, attack, defense, etc.)
- [ ] Inventory management (add/remove items)
- [ ] Equipment system (equip/unequip)
- [ ] Auto level-up when XP threshold reached
- [ ] Derived selectors for total attack/defense

---

### 4. Build World Store
**File:** `src/state/worldStore.ts`

```typescript
interface WorldState {
  currentTile: string;
  mapData: MapTile[];
  encounterState: EncounterState | null;
  gameMode: GameMode;
  
  // Actions
  moveTo: (tileId: string) => void;
  rollEncounter: () => void;
  startEncounter: (enemyId: string) => void;
  endEncounter: (victory: boolean) => void;
}
```

**Features:**
- [ ] Track current map location
- [ ] Load map data from JSON
- [ ] Random encounter generation
- [ ] Game mode state machine

---

### 5. Create Initial Data Files
**Files to create in `src/data/`:**

**`items.json`** - Sample items
```json
[
  {
    "id": "rusty-sword",
    "name": "Rusty Sword",
    "category": "weapon",
    "stats": { "attack": 3 },
    "value": 10,
    "description": "A weathered blade that's seen better days."
  }
]
```

**`enemies.json`** - Sample enemies
```json
[
  {
    "id": "coin-rat",
    "name": "Coin Rat",
    "stats": { "hp": 15, "attack": 4, "defense": 1 },
    "rewards": { "xp": 15, "gold": 8 }
  }
]
```

**`maps.json`** - Map tiles
```json
[
  {
    "id": "guild-hall",
    "name": "Guild Hall",
    "type": "hub",
    "neighbors": ["merchants-row"],
    "encounterRate": 0
  }
]
```

---

## 📅 Week 1 Schedule

### Monday-Tuesday
- [x] Complete project setup
- [x] Organize documentation
- [x] Create `storage.ts` utility
- [x] Create `sessionStore.ts`

### Wednesday-Thursday
- [x] Create `playerStore.ts`
- [x] Create `worldStore.ts`
- [x] Create initial JSON data files
- [x] Test stores with sample data

### Friday
- [x] Create `questStore.ts`
- [x] Create `uiStore.ts`
- [x] Review and refactor
- [x] Document any issues

---

## 🧪 Testing Approach

For each store/utility:
1. **Create the file**
2. **Import in browser console** (via dev tools)
3. **Test basic operations** manually
4. **Verify LocalStorage** persistence
5. **Check for errors** in console

Example test sequence:
```typescript
// In browser console after creating playerStore
import { usePlayerStore } from './state/playerStore';

// Get current state
const state = usePlayerStore.getState();
console.log('Initial stats:', state.stats);

// Test action
state.gainXP(50);
console.log('After XP:', state.stats);

// Verify persistence
// Refresh page, re-import, check state is restored
```

---

## 📝 Documentation Tasks

As you build:
- [ ] Update `PROGRESS.md` with completed tasks
- [ ] Add code examples to this file
- [ ] Note any architecture decisions
- [ ] Document edge cases encountered

---

## 🎯 Definition of Done (Phase 2)

Phase 2 is complete when:
- [x] All 6 stores created and tested
- [ ] LocalStorage persistence working
- [ ] State hydration on page load works
- [ ] Sample data files created
- [ ] No console errors
- [ ] Basic integration test passes

**Integration Test:**
```typescript
// Can create user → login → gain XP → level up → refresh → still logged in
```

---

## 🔗 Reference Links

- **Type definitions:** `../src/types/`
- **Tailwind config:** `../tailwind.config.js`
- **Development workflow:** `./DEVELOPMENT-WORKFLOW.md`
- **Project status:** `./PROJECT-STATUS.md`

---

## 💡 Tips

1. **Start small:** Get one store working before moving to next
2. **Test frequently:** Use browser console for quick validation
3. **Commit often:** Small commits are easier to debug
4. **Ask for help:** Reference the implementation plan when stuck
5. **Stay organized:** Keep related files together

---

**Ready to code!** Start with `src/utils/storage.ts` 🚀
