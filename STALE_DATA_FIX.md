# Critical Fix: Stale Data Loading Issue

## Problem Identified
The `current_user` localStorage contains a snapshot of `characterData` from login time, which becomes **stale** during gameplay. When the page refreshes, App.tsx loads this stale data instead of the live data from individual storage keys.

## Root Cause
1. `current_user` is saved once at login with a snapshot of `characterData`
2. During gameplay, data is updated in separate keys:
   - `player:${username}`
   - `world:${username}`
   - `quests:${username}`
   - `questionHistory:${username}`
   - `achievements:${username}`
3. `current_user` is **NEVER UPDATED** with the new data
4. On page refresh, App.tsx loads from stale `current_user.characterData`

## Files Affected
- `src/App.tsx` (lines 44-107) - initializeApp function
- `src/App.tsx` (lines 217-245) - onSuccess login handler  
- `src/features/combat/CombatView.tsx` (line 170) - Already fixed to NOT load from user.characterData

## Solution
**ALWAYS** load from the individual live storage keys, NEVER from `user.characterData`:

### App.tsx - initializeApp (replace lines 44-107)
```typescript
// Set global username for auto-save functionality
(window as any).__currentUsername = user.username;
console.log('🔑 Restored current username for auto-save');

// ⚠️ CRITICAL: Load from LIVE storage keys, NOT from stale user.characterData
console.log(`🔄 Loading LIVE data for ${user.username}...`);

// Load player data from live storage
const playerLoaded = usePlayerStore.getState().loadPlayer(user.username);
console.log(playerLoaded ? `✅ Loaded player data` : `🆕 New character`);

// Load world state from live storage
const worldLoaded = useWorldStore.getState().loadWorld(user.username);
if (!worldLoaded) {
  useWorldStore.getState().resetWorld();
}
console.log(worldLoaded ? `✅ Loaded world state` : `🗺️ New world`);

// Load quest state from live storage
const questLoaded = useQuestStore.getState().loadQuests(user.username);
console.log(questLoaded ? `✅ Loaded quests` : `📜 New quests`);

// Load achievements from live storage
useAchievementStore.getState().loadAchievements(user.username);
console.log(`✅ Loaded achievements`);

// Question history loaded in CombatView from questionHistory:${username}
console.log(`✅ All data loaded from LIVE storage keys`);
```

### App.tsx - Login Handler (replace lines 217-245)
```typescript
// Set global username for auto-save
(window as any).__currentUsername = user.username;

// ⚠️ CRITICAL: Load from LIVE storage keys, NOT from stale user.characterData
console.log(`🔄 Loading character data for ${user.username}...`);

// Load player data
const playerLoaded = usePlayerStore.getState().loadPlayer(user.username);
if (!playerLoaded) {
  console.log('🆕 New character, setting defaults...');
  // Set default character if no data found
  usePlayerStore.setState({
    stats: {
      level: 1,
      xp: 0,
      xpToNext: 100,
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      gold: 1000
    },
    equipment: { weapon: null, armor: null, accessory: null },
    inventory: [],
    location: 'guild-hall',
    enemiesKilled: 0,
    avatar: '/images/avatars/male-ta-default.jpg',
    customAvatar: null
  });
}

// Load world state
const worldLoaded = useWorldStore.getState().loadWorld(user.username);
if (!worldLoaded) {
  useWorldStore.getState().resetWorld();
}

// Load quest state
useQuestStore.getState().loadQuests(user.username);

// Load achievements
useAchievementStore.getState().loadAchievements(user.username);

console.log(`✅ All data loaded for ${user.username}`);
```

## Impact
This fix ensures:
1. **Question tracking**: No more repeated questions from stale data
2. **World progress**: Exploration progress loads correctly
3. **Quest progress**: Quest states load correctly
4. **Achievements**: Unlocked achievements load correctly
5. **All other data**: Everything loads from the latest saved state

## Testing
After applying this fix:
1. Login and answer some questions correctly
2. Visit different map locations
3. Complete some quests
4. Refresh the page (F5)
5. Verify all progress is retained (questions answered, locations visited, quests completed)
