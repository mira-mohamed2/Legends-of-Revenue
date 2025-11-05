# Dexie + CSV Hybrid Storage System

## Overview

The game now uses a **hybrid storage approach** combining:
- **Dexie (IndexedDB)** for fast runtime operations
- **CSV files** for portable data backup/restore

## How It Works

### Flow Diagram
```
App Start
   ↓
Load /dist/expo_data.csv → Import to Dexie (IndexedDB)
   ↓
Gameplay → All operations use Dexie (fast, automatic saves)
   ↓
Logout/Export → Export Dexie → Save as CSV file
```

### Benefits

✅ **Fast Performance** - IndexedDB queries are instant  
✅ **Automatic Saves** - No user interaction needed during gameplay  
✅ **Portable Data** - CSV file travels with dist folder  
✅ **Easy Backup** - Export to CSV anytime  
✅ **Survives Refresh** - IndexedDB persists across browser refreshes  
✅ **Human Readable** - CSV can be opened in Excel  

## Architecture

### 1. Dexie Database (Runtime)

**File**: `src/utils/database.ts`

**Schema**:
```typescript
interface Player {
  id?: number; // Auto-increment
  registrationId: string;
  username: string; // Unique
  phoneNumber: string; // Unique
  email: string;
  timestamp: string;
  lastPlayed?: string;
  totalGamesPlayed: number;
  highestScore?: number;
  totalScore: number;
  wonPrize: boolean;
  characterData?: {
    stats, equipment, inventory, location, avatar...
  };
}
```

**Indexes**:
- `username` - For login queries
- `phoneNumber` - For duplicate checks
- `registrationId` - For unique player ID
- `wonPrize` - For filtering winners
- `highestScore` - For leaderboards

### 2. CSV File (Portable Backup)

**Location**: `/dist/expo_data.csv`

**Format**: 12 columns including Character Data as JSON

**Purpose**:
- Backup/restore data
- Transfer between computers
- Manual inspection in Excel

## Core Functions

### Startup - Load CSV to Dexie

```typescript
import { loadFromCSV } from './utils/database';

// In App.tsx useEffect
await loadFromCSV();
```

**What happens**:
1. Fetches `/dist/expo_data.csv`
2. Parses CSV to Player objects
3. Clears existing Dexie data
4. Bulk imports all players to IndexedDB
5. Ready for fast queries!

### Runtime - Use Dexie

```typescript
// All async operations
const user = await findPlayer(username, phone);
await addPlayer(newPlayer);
await updatePlayer(username, updates);
await updateCharacterData(username, characterData);
await recordSession(username, score, wonPrize);
const players = await getAllPlayers();
const stats = await getStatistics();
```

**Why it's fast**:
- IndexedDB is browser-native
- Indexed queries (O(log n))
- Bulk operations supported
- Async but instant (< 1ms)

### Logout - Export Dexie to CSV

```typescript
import { exportToCSV } from './utils/database';

// On logout
await exportToCSV();
```

**What happens**:
1. Fetches all players from Dexie
2. Generates CSV content
3. Uses File System Access API (Chrome/Edge) OR downloads to Downloads folder
4. User saves to `/dist/expo_data.csv`

## Usage Scenarios

### Scenario 1: Fresh Installation

1. User downloads game files
2. Opens `index.html`
3. No CSV exists → Dexie starts empty
4. First player registers → Saved to Dexie
5. On logout → Export CSV to `/dist` folder
6. ✅ Data ready for next session

### Scenario 2: Existing Installation

1. User opens game
2. CSV exists in `/dist` folder
3. App loads CSV → Imports to Dexie
4. All existing players available
5. New players added to Dexie
6. On logout → Export updated CSV

### Scenario 3: Transfer to New PC

1. Copy entire `/dist` folder to USB drive
2. Copy to new PC
3. Open `index.html`
4. CSV loads → All data restored to Dexie
5. ✅ All players available on new PC

### Scenario 4: Backup Strategy

**During Expo**:
- Let Dexie handle all operations (automatic)
- No manual saves needed during gameplay

**End of Session**:
- Admin clicks "Export to CSV"
- Saves to `/dist/expo_data.csv`
- Copy CSV to USB drive (backup)

**Next Day**:
- CSV in `/dist` folder loads automatically
- Continue from where you left off

## Admin Panel Features

### Password
**MIRA2024**

### CSV Data Source Display
Shows:
- CSV File: `/dist/expo_data.csv`
- Status: ✅ Loaded
- In-Memory Database: X players (Dexie count)

### Data Table
Full view of all players with:
- Username, Full Name, Phone, Email
- Games Played, Best Score
- Gold, Level (from character data)
- Prize Winner status (🏆)

### Export Button
- "📥 Save to CSV File - X Records"
- Exports Dexie → CSV
- File System Access API or download

### Clear Button
- "🗑️ Clear All Data (Danger!)"
- Clears Dexie database
- Requires confirmation

## File System Access API

### Supported Browsers
| Browser | Behavior |
|---------|----------|
| Chrome  | ✅ File picker dialog |
| Edge    | ✅ File picker dialog |
| Firefox | ⚠️ Downloads to Downloads folder |
| Safari  | ⚠️ Downloads to Downloads folder |

### Chrome/Edge Workflow
1. Click "Export to CSV"
2. File picker appears
3. Navigate to `/dist` folder
4. Save as `expo_data.csv`
5. ✅ Overwrites existing file

### Firefox/Safari Workflow
1. Click "Export to CSV"
2. File downloads to Downloads folder
3. User manually moves to `/dist/expo_data.csv`
4. Refresh app to load new CSV

## Best Practices

### ✅ DO

- **Auto-load on startup** - Always call `loadFromCSV()` in App.tsx
- **Export on logout** - Always call `exportToCSV()` when logging out
- **Save to /dist folder** - CSV must be in `/dist` for auto-load
- **Backup regularly** - Copy CSV to USB during expo
- **Use Admin Panel** - Easy way to export and view data

### ❌ DON'T

- **Don't manually edit Dexie** - Use the provided functions
- **Don't rename CSV** - Must be `expo_data.csv`
- **Don't move CSV** - Must stay in `/dist` folder
- **Don't delete IndexedDB** - Let the app manage it
- **Don't skip exports** - Always export before closing

## Troubleshooting

### Problem: No players after refresh

**Cause**: CSV not in `/dist` folder

**Solution**:
```bash
# Check if CSV exists
ls dist/expo_data.csv

# If missing, export from Admin Panel
```

### Problem: Login fails but player exists

**Cause**: Dexie not loaded yet

**Solution**: Check console for "Loaded X players from CSV"

### Problem: Data not saving

**Cause**: Export not called or cancelled

**Solution**:
- Use Admin Panel → "Save to CSV"
- Don't cancel the save dialog
- Check Downloads folder if using Firefox

### Problem: CSV has old data

**Cause**: Export wasn't saved to `/dist` folder

**Solution**:
- Re-export from Admin Panel
- Make sure to save to `/dist/expo_data.csv`
- Refresh app to verify

## Performance

### Operation Times (approximate)

| Operation | Time | Database |
|-----------|------|----------|
| Load CSV (100 players) | ~50ms | One-time |
| Find player | <1ms | Dexie |
| Add player | <1ms | Dexie |
| Update player | <1ms | Dexie |
| Get all players | <5ms | Dexie |
| Export to CSV (100 players) | ~100ms | One-time |

### Storage Limits

- **IndexedDB**: ~50MB - 1GB+ (browser dependent)
- **CSV File**: ~1KB per player
  - 100 players ≈ 100KB
  - 1000 players ≈ 1MB

## Migration from Old System

If you have old localStorage data:

```typescript
// This is automatic - old data in localStorage is not used
// Just export from Admin Panel to create first CSV
```

## Summary

**Runtime**: Dexie (IndexedDB) - Fast, automatic, browser-native  
**Backup**: CSV - Portable, human-readable, Excel-compatible  
**Best of Both**: Speed + Portability  

Perfect for offline expo with multiple computers! 🎉

---

**Last Updated**: 2024-01-16  
**Version**: 2.0 (Hybrid System)  
**Module**: `src/utils/database.ts`
