# Multi-File Import with Smart Score Merging

## Overview
Implemented intelligent multi-file JSON import system to consolidate player data from multiple backup files (e.g., from different browsers/sessions at an expo booth).

## Problem Solved
When using the game on multiple devices/browsers, each creates separate timestamped backups on logout. Previously, there was no easy way to consolidate all this data while avoiding duplicates and keeping the highest scores.

## Implementation

### Core Features

1. **Multi-File Selection**
   - Admin can select multiple JSON files at once via file picker
   - File input now has `multiple` attribute enabled

2. **Smart Deduplication**
   - Unique key: `username.toLowerCase() + "|" + phoneNumber`
   - Players with same username+phone are considered duplicates
   - System keeps the version with highest `totalScore`

3. **Selective Database Updates**
   - Compares imported player score with existing database score
   - Only updates if imported score is higher
   - Skips updates for lower or equal scores

4. **Detailed Result Reporting**
   ```typescript
   {
     imported: number;   // New players added to database
     updated: number;    // Existing players updated (higher score)
     skipped: number;    // Lower/equal scores ignored
     errors: string[];   // Any import errors
   }
   ```

### Files Modified

#### 1. `src/utils/database.ts`

**New Function: `importFromJSONFiles()`**
```typescript
export async function importFromJSONFiles(files: FileList): Promise<{
  imported: number;
  updated: number;
  skipped: number;
  errors: string[];
}>
```

**Logic Flow:**
1. Read all selected JSON files
2. Parse and collect all player data
3. Group by `username|phone` key
4. For duplicates across files: keep highest score
5. For each unique player:
   - Check if exists in database (by username+phone)
   - If exists: update only if import score > current score
   - If new: add to database
6. Return detailed statistics

**Backward Compatibility:**
- `importFromJSONFile(file: File)` now wraps `importFromJSONFiles()`
- Single-file imports still work via wrapper
- Creates proper FileList from single File object

**Export Simplification:**
- `exportBothJSONFiles()` simplified to single timestamped file
- Old: Created `expo_data.json` + `expo_data_TIMESTAMP.json`
- New: Only creates `expo_data_YYYY-MM-DD_HH-MM-SS.json`

#### 2. `src/components/AdminPanel.tsx`

**Updated Handler:**
```typescript
const handleImportJSON = async () => {
  const input = document.createElement('input');
  input.multiple = true; // ← Key change
  
  const result = await importFromJSONFiles(files); // ← Now uses plural
  
  // Display detailed results
  alert(`
    📊 Processed ${files.length} file(s)
    ✅ ${result.imported} new players imported
    🔄 ${result.updated} players updated (higher scores)
    ⏭️ ${result.skipped} skipped (lower/same scores)
  `);
}
```

**Updated Info Box:**
- Removed references to `/public/` folder workflow
- Added multi-file import instructions
- Explained smart merge behavior
- Clarified deduplication and score merging

#### 3. `src/components/MenuBar.tsx`

**Logout Confirmation:**
- Simplified message to mention only timestamped backup
- Removed reference to dual files

## Usage Workflow

### Scenario: Multi-Device Expo Booth

**Problem:**
- 3 tablets running the game (Browser A, B, C)
- Each creates its own database in IndexedDB
- At end of day, need to consolidate all data

**Solution:**

1. **During Event:**
   - Each browser saves data locally
   - On logout, each creates timestamped backup:
     - Browser A: `expo_data_2025-11-06_14-30-00.json`
     - Browser B: `expo_data_2025-11-06_15-45-00.json`
     - Browser C: `expo_data_2025-11-06_16-20-00.json`

2. **After Event (Consolidation):**
   - Collect all 3 JSON files
   - Open Admin Panel on any device
   - Click "Import from JSON"
   - Select all 3 files at once
   - System automatically:
     - Finds duplicate players (same username+phone)
     - Keeps highest score from all 3 files
     - Updates database only with better scores
   
3. **Result:**
   - Single consolidated database
   - Best scores from all browsers
   - No manual deduplication needed

### Import Results Display

```
✅ Import Complete!

📊 Processed 3 file(s)
✅ 25 new players imported
🔄  8 players updated (higher scores)
⏭️ 12 skipped (lower/same scores)
```

**Interpretation:**
- 25 players only existed in one file → added
- 8 players existed in multiple files with different scores → updated with highest
- 12 players existed in DB with better scores → kept existing data

## Technical Details

### Deduplication Algorithm

```typescript
// Create unique key
const key = username.toLowerCase() + "|" + phoneNumber;

// Map to store best version of each player
const playerMap = new Map<string, Player>();

for (const player of allPlayers) {
  const existingPlayer = playerMap.get(key);
  
  if (!existingPlayer || player.totalScore > existingPlayer.totalScore) {
    playerMap.set(key, player); // Keep higher score
  }
}
```

### Database Merge Logic

```typescript
for (const [key, importedPlayer] of playerMap) {
  // Check if player exists in database
  const existing = await db.players
    .where('username').equalsIgnoreCase(importedPlayer.username)
    .and(p => p.phoneNumber === importedPlayer.phoneNumber)
    .first();
  
  if (existing) {
    // Only update if imported score is higher
    if (importedPlayer.totalScore > existing.totalScore) {
      await db.players.put(importedPlayer);
      updated++;
    } else {
      skipped++;
    }
  } else {
    // New player, add to database
    await db.players.add(importedPlayer);
    imported++;
  }
}
```

## Testing Recommendations

### Test Case 1: Multiple Files with Duplicates
1. Create 3 JSON files with overlapping players
2. Give same player different scores in each file
3. Import all 3 files
4. Verify highest score is kept

### Test Case 2: Database vs Import Conflict
1. Have player in database with score 100
2. Import file with same player, score 80
3. Verify database keeps score 100 (skipped)
4. Import file with same player, score 120
5. Verify database updates to score 120

### Test Case 3: Error Handling
1. Include malformed JSON file
2. Include file with missing required fields
3. Verify errors are reported in results
4. Verify valid players still import

## Benefits

1. **Time Savings:** No manual data consolidation
2. **Data Integrity:** Automatically keeps best scores
3. **User Friendly:** Single click to merge multiple backups
4. **Transparent:** Clear reporting of what was imported/updated/skipped
5. **Safe:** Never overwrites better data with worse data

## Future Enhancements

Potential improvements:
- [ ] Add conflict resolution UI (let admin choose which version to keep)
- [ ] Support merging other fields beyond score (inventory, achievements, etc.)
- [ ] Add dry-run mode to preview changes before committing
- [ ] Export merge report as CSV for audit trail
- [ ] Implement automatic conflict resolution rules (configurable)

## Version Info

- **Implementation Date:** November 6, 2025
- **Files Changed:** 3 (database.ts, AdminPanel.tsx, MenuBar.tsx)
- **Lines Added:** ~150 lines
- **Breaking Changes:** None (backward compatible)
