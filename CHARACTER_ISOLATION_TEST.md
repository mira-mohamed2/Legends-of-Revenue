# Character Data Isolation - Test Plan

## 🎯 Bug Fixed
**Issue**: When logging in as different players, world exploration data (map progress, unlocked locations, items) was persisting across characters instead of being isolated per player.

**Root Cause**: World state was stored in localStorage separately from the database, causing data to leak between character sessions.

**Solution**: Extended the Player database schema to include `worldState` and `questState` in `characterData`, and updated login/logout logic to properly save and restore these states per character.

## ✅ What Was Changed

### 1. Database Schema (src/utils/database.ts)
Added to `Player.characterData`:
```typescript
worldState?: {
  currentTile: string;
  locationProgress: Record<string, number>;
  unlockedLocations: string[];
};
questState?: {
  quests: any[];
  activeQuest: string | null;
};
```

### 2. App.tsx - Character Restoration
**On Login** (LoginRegistrationForm onSuccess + initializeApp):
- Restores player stats, equipment, inventory, location, avatar
- **NEW**: Restores `worldState` (map progress) from database
- **NEW**: Restores `questState` (active quests) from database
- **NEW**: If no worldState exists (first login), calls `resetWorld()` for clean start

**On Logout** (handleNewPlayer):
- Saves player stats, equipment, inventory, location, avatar
- **NEW**: Saves current `worldState` to database
- **NEW**: Saves current `questState` to database
- **NEW**: Resets worldStore and playerStore to defaults
- Exports all data to CSV

### 3. Expected Behavior
- Each character has completely isolated:
  - Map exploration progress
  - Unlocked locations
  - Quest progress
  - Inventory and equipment
  - Stats (gold, level, XP)
- Switching characters properly resets and restores the correct data
- CSV export includes worldState and questState for portability

## 🧪 Test Scenarios

### Test 1: New Character Isolation
1. **Register Player A** (e.g., "TestWarrior")
2. **Explore the map**:
   - Visit 3-4 different locations
   - Unlock new areas
   - Note which locations are unlocked
3. **Collect items** (from combat or market)
4. **Note stats**: Gold, Level, XP
5. **Logout** (click "New Player")
6. **Register Player B** (e.g., "TestMage")
7. **Verify**:
   - ✅ Starting location is "Elaria (Starting Village)" or default
   - ✅ NO locations unlocked from Player A
   - ✅ Starting gold (1000), Level 1, XP 0
   - ✅ Empty inventory (or starting items only)
   - ✅ World map shows no progress

**Expected**: Player B starts completely fresh with no data from Player A.

### Test 2: Character Data Persistence
1. **Login as Player A** again (same username/password)
2. **Verify**:
   - ✅ Location is where Player A was before logout
   - ✅ Same unlocked locations as before
   - ✅ Same gold/level/XP as before
   - ✅ Same inventory items
   - ✅ Map progress restored

**Expected**: Player A's data is exactly as it was before logout.

### Test 3: Multiple Character Switching
1. **Logout from Player A**
2. **Login as Player B**
3. **Explore a DIFFERENT area** (not visited by Player A)
4. **Collect different items**
5. **Note Player B stats**
6. **Logout from Player B**
7. **Login as Player A**
8. **Verify**:
   - ✅ Player A's original exploration (NOT Player B's)
   - ✅ Player A's items (NOT Player B's)
   - ✅ NO cross-contamination
9. **Logout and login as Player B**
10. **Verify**:
    - ✅ Player B's exploration restored
    - ✅ Player B's items intact

**Expected**: Each character maintains completely separate world states.

### Test 4: Quest Progress Isolation
1. **Login as Player A**
2. **Accept a quest** (if quest system is active)
3. **Complete some quest objectives**
4. **Logout**
5. **Login as Player B**
6. **Verify**:
   - ✅ Player B has no active quest from Player A
   - ✅ Quest state is fresh/default
7. **Login as Player A again**
8. **Verify**:
   - ✅ Quest progress restored
   - ✅ Active quest still active

**Expected**: Quest states are per-character.

### Test 5: CSV Export/Import Isolation
1. **With both Player A and Player B created**
2. **Logout** (triggers CSV export)
3. **Check `/dist/expo_data.csv`**:
   - ✅ File exists
   - ✅ Contains both players
   - ✅ Each player row has separate characterData
4. **Close browser** (clear IndexedDB)
5. **Reopen game**
6. **Verify**:
   - ✅ CSV automatically loads
   - ✅ Both players available for login
7. **Login as Player A**
8. **Verify**:
   - ✅ All Player A data restored from CSV

**Expected**: CSV correctly stores and restores per-character data.

### Test 6: Portability Test (USB/Pendrive)
1. **Create 2+ characters with different progress**
2. **Logout** (export CSV)
3. **Copy entire `/dist` folder** to USB drive
4. **Open on DIFFERENT computer**
5. **Verify**:
   - ✅ All characters load
   - ✅ Each character has correct isolated data
   - ✅ No data mixing

**Expected**: Full portability with data isolation maintained.

## 🔍 Key Things to Check

### World State Isolation
- [ ] `currentTile` - different per character
- [ ] `locationProgress` - separate progress records
- [ ] `unlockedLocations` - different unlocked areas

### Player Data Isolation
- [ ] `stats.gold` - different amounts
- [ ] `stats.level` - different levels
- [ ] `stats.xp` - different experience
- [ ] `inventory` - different items
- [ ] `equipment` - different gear

### Quest State Isolation
- [ ] `quests` array - different quest lists
- [ ] `activeQuest` - different active quests

### Console Logs to Watch For
On Login:
```
🎮 Login successful, loading character...
📦 Restoring character data...
🗺️ Restored world state
📜 Restored quest state
✅ Restored character data for [username]
```

On First Login (new character):
```
🆕 New character, setting defaults...
🗺️ New world state (new character)
```

On Logout:
```
💾 Saving character data before logout...
📤 Exporting to CSV...
✅ Character data saved and exported successfully
✅ Logged out successfully
```

## 🐛 Common Issues to Watch For

1. **Map progress leaking**: 
   - Symptom: New character sees unlocked locations from other characters
   - Check: worldState restoration in App.tsx

2. **Inventory mixing**: 
   - Symptom: Items from one character appear in another
   - Check: characterData.inventory save/restore

3. **Quest contamination**: 
   - Symptom: Quest progress carries over
   - Check: questState save/restore

4. **CSV not exporting**: 
   - Symptom: Data lost after closing browser
   - Check: Browser File System Access API permission
   - Check: /dist folder write permissions

5. **Store not resetting**: 
   - Symptom: Old character data visible briefly after login
   - Check: resetWorld() and resetPlayer() calls

## 📊 Success Criteria

- ✅ **100% Data Isolation**: No character data visible to other characters
- ✅ **Full Persistence**: All character data (stats, inventory, world, quests) saves and restores correctly
- ✅ **CSV Portability**: Can copy `/dist` folder and all characters work on different PC
- ✅ **Clean Logout**: Logging out fully clears current session
- ✅ **Clean Login**: Logging in restores ONLY that character's data
- ✅ **No Errors**: No console errors during login/logout/switching

## 🚀 Testing Commands

```bash
# Build production version
npm run build:expo

# Run local server
npm run preview:expo

# Open in browser
http://localhost:7766
```

## 📝 Notes

- **Browser**: Test in Chrome/Edge (File System Access API support)
- **CSV Location**: `/dist/expo_data.csv`
- **Database**: IndexedDB (visible in DevTools > Application > IndexedDB)
- **Character Data Fields**: Check database.ts `Player` interface for complete schema
- **Backward Compatibility**: Old CSV files without worldState/questState will work (defaults to reset)

## ✍️ Test Results

| Test | Date | Pass/Fail | Notes |
|------|------|-----------|-------|
| New Character Isolation | | | |
| Character Data Persistence | | | |
| Multiple Character Switching | | | |
| Quest Progress Isolation | | | |
| CSV Export/Import | | | |
| Portability Test | | | |

---

**Last Updated**: 2024
**Fixed By**: Per-character worldState and questState storage in database
**Files Modified**: `src/utils/database.ts`, `src/App.tsx`
