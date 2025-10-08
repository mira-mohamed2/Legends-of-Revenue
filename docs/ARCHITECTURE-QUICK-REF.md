# 🏗️ Architecture Quick Reference

Quick lookup for key architectural patterns and decisions.

---

## 📦 State Management Pattern (Zustand)

### Store Structure
```typescript
import { create } from 'zustand';

interface StoreState {
  // Data
  value: string;
  items: Item[];
  
  // Actions (always use set/get)
  setValue: (val: string) => void;
  addItem: (item: Item) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  value: '',
  items: [],
  
  // Actions
  setValue: (val) => set({ value: val }),
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
}));
```

### Using Stores in Components
```typescript
import { useStore } from '../state/store';

function Component() {
  // Subscribe to specific values
  const value = useStore((state) => state.value);
  const setValue = useStore((state) => state.setValue);
  
  // Or get all
  const { items, addItem } = useStore();
  
  return <button onClick={() => setValue('new')}>Update</button>;
}
```

### Persistence Pattern
```typescript
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set) => ({
      stats: defaultStats,
      updateStats: (newStats) => set({ stats: newStats }),
    }),
    {
      name: 'tribute-player-storage',
      getStorage: () => localStorage,
    }
  )
);
```

---

## 🗂️ Data Flow Architecture

```
User Action
    ↓
Component Event Handler
    ↓
Store Action
    ↓
Update State (via set)
    ↓
Component Re-renders
    ↓
LocalStorage Update (middleware)
```

**Example:**
```typescript
// 1. User clicks "Gain XP" button
<button onClick={() => gainXP(50)}>Fight</button>

// 2. Component calls store action
const gainXP = usePlayerStore((state) => state.gainXP);

// 3. Store updates state
gainXP: (amount) => set((state) => {
  const newXP = state.stats.xp + amount;
  const leveledUp = newXP >= state.stats.xpToNext;
  
  if (leveledUp) {
    // Level up logic
    return { stats: { ...state.stats, level: level + 1, xp: 0 } };
  }
  
  return { stats: { ...state.stats, xp: newXP } };
})

// 4. Component re-renders with new state
// 5. Middleware persists to LocalStorage
```

---

## 🎨 Component Patterns

### Presentational Component
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
}) => {
  return (
    <button
      className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Container Component (with state)
```typescript
// src/features/combat/CombatView.tsx
import { useCombat } from './useCombat';
import { Button } from '../../components/ui/Button';

export const CombatView: React.FC = () => {
  const { enemy, playerTurn, attack, flee } = useCombat();
  
  return (
    <div className="panel">
      <h2>{enemy.name}</h2>
      {playerTurn && (
        <>
          <Button onClick={attack}>Attack</Button>
          <Button variant="secondary" onClick={flee}>Flee</Button>
        </>
      )}
    </div>
  );
};
```

### Custom Hook Pattern
```typescript
// src/features/combat/useCombat.ts
import { useWorldStore } from '../../state/worldStore';
import { usePlayerStore } from '../../state/playerStore';

export const useCombat = () => {
  const encounterState = useWorldStore((state) => state.encounterState);
  const gainXP = usePlayerStore((state) => state.gainXP);
  
  const attack = () => {
    // Combat logic
    const damage = calculateDamage();
    // Update encounter state
  };
  
  return {
    enemy: encounterState?.enemy,
    playerTurn: encounterState?.playerTurn,
    attack,
    flee: () => {},
  };
};
```

---

## 📄 File Organization

### Feature Module Structure
```
src/features/combat/
├── CombatView.tsx         # Main component
├── CombatLog.tsx          # Sub-component
├── useCombat.ts           # Business logic hook
├── combatUtils.ts         # Pure functions
└── index.ts               # Public exports
```

### Exports Pattern
```typescript
// src/features/combat/index.ts
export { CombatView } from './CombatView';
export { useCombat } from './useCombat';
// Don't export CombatLog (internal only)
```

---

## 🔄 Game State Machine

```typescript
type GameMode = 'explore' | 'combat' | 'dialogue' | 'end';

// In worldStore
gameMode: 'explore',

setGameMode: (mode: GameMode) => set({ gameMode: mode }),

// Transitions
explore → combat    // Encounter triggered
combat → explore    // Combat ends
explore → dialogue  // NPC interaction
dialogue → explore  // Dialogue complete
explore → end       // Quest complete
```

---

## 💾 LocalStorage Strategy

### Keys
```typescript
const KEYS = {
  SESSION: 'tribute-session',          // Current user
  PLAYER_PREFIX: 'tribute-player:',    // Player data
  SETTINGS: 'tribute-settings',        // UI preferences
};
```

### Data Structure
```json
{
  "version": 1,
  "username": "player1",
  "stats": { ... },
  "inventory": [ ... ],
  "quests": [ ... ],
  "timestamp": "2025-10-07T..."
}
```

### Migration Pattern
```typescript
function loadWithMigration(key: string) {
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  const parsed = JSON.parse(data);
  
  if (parsed.version < CURRENT_VERSION) {
    return migrate(parsed);
  }
  
  return parsed;
}
```

---

## 🎯 Error Handling

### Store Actions
```typescript
addItem: async (itemId: string) => {
  try {
    const item = await fetchItem(itemId);
    set((state) => ({
      inventory: [...state.inventory, item],
    }));
  } catch (error) {
    console.error('Failed to add item:', error);
    // Show user-friendly error
    useUIStore.getState().showNotification({
      type: 'error',
      message: 'Could not add item to inventory',
    });
  }
}
```

### Component Error Boundaries
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}
```

---

## 🧮 Calculation Patterns

### Combat Damage
```typescript
function calculateDamage(
  attack: number,
  defense: number,
  variance = 0.1
): number {
  const baseDamage = Math.max(1, attack - defense / 3);
  const randomFactor = 1 + (Math.random() * variance * 2 - variance);
  return Math.round(baseDamage * randomFactor);
}
```

### Derived Stats
```typescript
// In playerStore
const usePlayerStore = create((set, get) => ({
  stats: baseStats,
  equipment: {},
  
  // Selector for total attack
  getTotalAttack: () => {
    const { stats, equipment } = get();
    const weaponBonus = equipment.weapon?.stats.attack || 0;
    return stats.attack + weaponBonus;
  },
}));
```

---

## 🎨 Styling Patterns

### Tailwind Component Classes
```typescript
// Use className for Tailwind
<div className="panel">
  <h2 className="font-medieval text-2xl text-gold">Title</h2>
  <p className="font-body text-brown">Content</p>
</div>
```

### Conditional Classes
```typescript
import clsx from 'clsx'; // or use cn() helper

<button
  className={clsx(
    'btn-primary',
    isDisabled && 'opacity-50 cursor-not-allowed',
    isActive && 'ring-2 ring-gold'
  )}
>
  Click
</button>
```

---

## 🧪 Testing Approach

### Manual Testing Checklist
```typescript
// For each feature:
// 1. Visual test - does it render correctly?
// 2. Interaction test - do buttons work?
// 3. State test - does state update correctly?
// 4. Persistence test - does it survive refresh?
// 5. Edge case test - what if inventory is empty?
```

### Console Testing
```typescript
// In browser console
import { usePlayerStore } from './state/playerStore';

// Test actions
usePlayerStore.getState().gainXP(100);
usePlayerStore.getState().addItem('rusty-sword', 1);

// Check state
console.log(usePlayerStore.getState().stats);
console.log(usePlayerStore.getState().inventory);
```

---

## 📋 Code Review Checklist

Before committing:
- [ ] TypeScript compiles without errors
- [ ] No console.error in browser
- [ ] Component renders correctly
- [ ] State updates as expected
- [ ] LocalStorage persists correctly
- [ ] No hardcoded values (use constants)
- [ ] Meaningful variable names
- [ ] JSDoc comments on complex functions
- [ ] Follows existing patterns

---

**Quick reference for common patterns!** Keep this open while coding. 🚀
