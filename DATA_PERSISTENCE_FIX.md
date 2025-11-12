# Data Persistence Critical Fixes

## Issues Identified & Resolved

### 🔴 **CRITICAL ISSUE #1: Question History Being Wiped**
**Problem**: Already-answered questions would reappear, scores would reset
**Root Cause**: 
- App startup read stale `current_user` from localStorage
- Overwrote fresh `questionHistory:${username}` with outdated data
- Combat loaded the wiped history → questions re-appeared

**Fix Applied**:
```typescript
// BEFORE (App.tsx - WRONG!)
if (user.characterData.questionHistory) {
  localStorage.setItem(
    `questionHistory:${user.username}`,
    JSON.stringify(user.characterData.questionHistory) // ❌ STALE DATA!
  );
}

// AFTER (App.tsx - CORRECT!)
// DON'T restore question history from current_user - it may be stale!
// CombatView will load from the dedicated questionHistory:${username} localStorage key
// which is updated in real-time during gameplay
console.log(`⚠️ Skipping questionHistory restore from current_user (may be stale)`);
```

**Result**: Question history now persists correctly between sessions. Once answered, questions stay answered.

---

### 🔴 **CRITICAL ISSUE #2: Auto-Save Not Working**
**Problem**: Player progress, world state, achievements not saving during gameplay
**Root Cause**:
- All auto-save functions check `(window as any).__currentUsername`
- Login/registration never set this global
- Auto-saves silently failed (early return)

**Fix Applied**:
```typescript
// LoginRegistrationForm.tsx - ADDED after successful login/registration
(window as any).__currentUsername = user.username;
console.log('🔑 Set current username for auto-save');

// App.tsx - ADDED when restoring session
(window as any).__currentUsername = user.username;
console.log('🔑 Restored current username for auto-save');
```

**Result**: 
- ✅ `playerStore.savePlayer()` now works
- ✅ `worldStore.saveWorld()` now works  
- ✅ `achievementStore.saveAchievements()` now works
- Progress saves after every action!

---

### 🔴 **CRITICAL ISSUE #3: Startup Wiping Dexie Database**
**Problem**: JSON backup file would overwrite all live Dexie progress on app refresh
**Root Cause**:
- `loadFromJSON()` called `db.players.clear()` unconditionally
- Intended as a backup system, but acted as primary data source
- Any unsaved progress lost on refresh

**Fix Applied**:
```typescript
// BEFORE (database.ts - WRONG!)
export async function loadFromJSON(): Promise<boolean> {
  // ...
  await db.players.clear(); // ❌ WIPES EVERYTHING!
  await db.players.bulkAdd(data.players);
  // ...
}

// AFTER (database.ts - CORRECT!)
export async function loadFromJSON(): Promise<boolean> {
  // Just check if backup exists, don't auto-import
  console.log(`ℹ️ Found backup JSON with ${data.players.length} players (not auto-importing)`);
  console.log('💡 Use Admin Panel Import to restore from backup if needed');
  return true;
}
```

**Result**: 
- ✅ Dexie database persists across page refreshes
- ✅ JSON files are backups only (manual import via Admin Panel)
- ✅ No more data loss!

---

## New Data Flow (CORRECT)

### **During Gameplay:**
```
User Action
  ↓
Update Zustand Store
  ↓
store.save() called (e.g., savePlayer, saveWorld)
  ↓
Check (window).__currentUsername ✅ NOW SET!
  ↓
Update Dexie Database (immediate persistence)
  ↓
Update localStorage backup (current_user, questionHistory:username)
```

### **On Logout:**
```
Logout Button
  ↓
Save all current state to Dexie
  ↓
Export Dexie → timestamped JSON file (expo_data_YYYY-MM-DD.json)
  ↓
Clear session (localStorage current_user)
  ↓
Reset stores to defaults
```

### **On App Startup:**
```
Load App
  ↓
Check for backup JSON (info only, don't import)
  ↓
Check localStorage for current_user
  ↓
If logged in:
  ├─ Set __currentUsername ✅ NOW SET!
  ├─ Load characterData from Dexie
  ├─ Restore Zustand stores
  └─ Load questionHistory from dedicated localStorage key
      (NOT from current_user - may be stale!) ✅ FIX!
```

### **On Data Loss / Recovery:**
```
Admin Panel → Import JSON
  ↓
Select multiple backup files
  ↓
Smart merge:
  ├─ Deduplicate by username + phone
  ├─ Keep highest score
  └─ Only update if import > current
  ↓
Merge into Dexie (doesn't wipe existing data)
```

---

## Testing Checklist

### ✅ **Question Persistence Test**
1. Login as user
2. Answer 3 questions correctly
3. Refresh browser (F5)
4. Login again
5. **Expected**: Those 3 questions should NOT appear again
6. **Expected**: Score should be preserved

### ✅ **Auto-Save Test**
1. Login as user
2. Answer 1 question (gains points)
3. Navigate to different locations
4. Kill an enemy
5. Refresh browser BEFORE logout
6. Login again
7. **Expected**: All progress preserved (score, location, kills)

### ✅ **Database Persistence Test**
1. Login as User A
2. Answer 5 questions
3. Logout
4. Login as User B
5. Answer 3 questions
6. Refresh browser
7. Login as User A
8. **Expected**: User A still has 5 questions answered
9. Login as User B
10. **Expected**: User B still has 3 questions answered

### ✅ **Backup/Recovery Test**
1. Login as user, make progress
2. Logout (creates timestamped JSON)
3. Clear browser data (simulate data wipe)
4. Admin Panel → Import the timestamped JSON
5. Login
6. **Expected**: All progress restored from backup

---

## Files Modified

1. **src/utils/database.ts**
   - Changed `loadFromJSON()` to NOT clear Dexie
   - JSON backups are manual-import only

2. **src/components/LoginRegistrationForm.tsx**
   - Set `__currentUsername` after successful login
   - Set `__currentUsername` after successful registration

3. **src/App.tsx**
   - Set `__currentUsername` when restoring session
   - Skip questionHistory restore from current_user (stale data)
   - CombatView loads from fresh `questionHistory:${username}` key

---

## Migration Notes

**If you have existing players with stale data:**

1. **Clear stale question history**:
   - Each user should logout once
   - This exports their current Dexie state to JSON
   - On next login, fresh questionHistory will be loaded

2. **Or manually fix in browser console**:
   ```javascript
   // Find the user's current questions in Dexie
   const user = await db.players.where('username').equals('USERNAME').first();
   const liveHistory = user.characterData.questionHistory;
   
   // Update localStorage to match
   localStorage.setItem(
     'questionHistory:USERNAME',
     JSON.stringify(liveHistory)
   );
   ```

---

## Summary

### What Was Broken:
- ❌ Questions re-appearing after being answered
- ❌ Scores resetting on refresh
- ❌ Progress not saving during gameplay
- ❌ Database wiped on every app start

### What's Fixed:
- ✅ Questions stay answered permanently
- ✅ Scores persist correctly
- ✅ All progress auto-saves in real-time
- ✅ Dexie database is primary source (JSON is backup only)
- ✅ Multi-file import works for data recovery

### Data Architecture:
- **Primary**: Dexie IndexedDB (persistent, fast, queryable)
- **Backup**: Timestamped JSON files (recovery, multi-device sync)
- **Session**: localStorage current_user (logged-in state)
- **Live Data**: questionHistory:${username} (real-time question tracking)
