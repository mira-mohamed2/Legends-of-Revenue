# CSV Storage System Guide

## Overview

The game now uses a **CSV-based storage system** for all player data, including registration information and character progress (gold, items, inventory, equipment, stats, etc.). This replaces the previous localStorage-only approach and provides better data persistence and portability.

## Architecture

### Data Flow

```
App Startup → Load CSV from /dist/expo_data.csv → Parse to in-memory database
    ↓
Player plays → All changes kept in memory (fast performance)
    ↓
Player logs out → Save in-memory database back to CSV file
```

### Storage Components

1. **CSV File**: `/dist/expo_data.csv`
   - Single source of truth for all player data
   - Accessible via HTTP when serving the app
   - Can be opened in Excel, Google Sheets, or any CSV editor

2. **In-Memory Database**: JavaScript array in `csvStorage.ts`
   - Fast runtime performance
   - All game changes happen here
   - Saved to CSV on logout

3. **CSV Storage Module**: `src/utils/csvStorage.ts`
   - Core functions for load/save/update operations
   - Exports player data interface and utility functions

## CSV File Format

### Structure (12 Columns)

```csv
Registration ID,Username,Full Name,Phone Number,Email,Registration Time,Last Played,Games Played,Highest Score,Total Score,Won Prize,Character Data (JSON)
```

### Column Details

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| Registration ID | string | Unique player ID | `EXPO-1234567890` |
| Username | string | Player's username | `warrior123` |
| Full Name | string | Player's real name | `John Doe` |
| Phone Number | string | Contact number | `+1234567890` |
| Email | string | Email address | `john@example.com` |
| Registration Time | ISO date | When registered | `2024-01-15T10:30:00.000Z` |
| Last Played | ISO date | Last session | `2024-01-16T14:20:00.000Z` |
| Games Played | number | Total sessions | `5` |
| Highest Score | number | Best score | `12500` |
| Total Score | number | Cumulative score | `45000` |
| Won Prize | boolean | Prize winner? | `true` or `false` |
| Character Data (JSON) | JSON string | All game progress | See below |

### Character Data JSON Format

```json
{
  "stats": {
    "level": 5,
    "xp": 1200,
    "gold": 5000,
    "health": 100,
    "maxHealth": 120,
    "attack": 25,
    "defense": 18,
    "speed": 12,
    "enemiesKilled": 15
  },
  "equipment": {
    "weapon": "Iron Sword",
    "armor": "Leather Armor",
    "accessory": null
  },
  "inventory": [
    {
      "id": "potion-001",
      "name": "Health Potion",
      "type": "consumable",
      "quantity": 3,
      "description": "Restores 50 HP",
      "value": 100
    }
  ],
  "location": "Elaria (Starting Village)",
  "avatar": "warrior",
  "customAvatar": null
}
```

## Core Functions

### Loading Data

```typescript
import { loadCSVData } from './utils/csvStorage';

// Load CSV file on app startup
await loadCSVData();
```

**What it does:**
- Fetches `/dist/expo_data.csv` via HTTP
- Parses each line into `ExpoPlayerData` objects
- Populates the in-memory `playerDatabase` array
- Handles missing file (creates empty database)
- Parses JSON character data from column 11

### Saving Data

```typescript
import { saveCSVData } from './utils/csvStorage';

// Save all player data to CSV file
await saveCSVData();
```

**What it does:**
- Converts in-memory `playerDatabase` to CSV format
- Stringifies character data to JSON
- Uses File System Access API (Chrome/Edge) to let user choose save location
- Falls back to automatic download if API unavailable
- **User must manually place file in `/dist` folder**

### Finding Players

```typescript
import { findPlayer, findPlayerByPhone } from './utils/csvStorage';

// Login authentication
const user = findPlayer(username, phoneNumber);

// Check if phone is registered
const existingUser = findPlayerByPhone(phoneNumber);
```

### Adding/Updating Players

```typescript
import { addPlayer, updatePlayer, updateCharacterData } from './utils/csvStorage';

// Register new player
const newPlayer: ExpoPlayerData = {
  registrationId: `EXPO-${Date.now()}`,
  username: 'warrior123',
  fullName: 'John Doe',
  phoneNumber: '+1234567890',
  email: 'john@example.com',
  timestamp: new Date().toISOString(),
  wonPrize: false,
};
addPlayer(newPlayer);

// Update player info
updatePlayer(username, { email: 'newemail@example.com' });

// Save character progress
const characterData = {
  stats: playerStore.stats,
  equipment: playerStore.equipment,
  inventory: playerStore.inventory,
  location: worldStore.currentLocation,
  enemiesKilled: playerStore.stats.enemiesKilled,
  avatar: playerStore.avatar,
  customAvatar: playerStore.customAvatar,
};
updateCharacterData(username, characterData);
```

### Recording Game Sessions

```typescript
import { recordSession } from './utils/csvStorage';

// Track game session (ARIM victory)
recordSession(username, finalScore, true);

// Track regular combat
recordSession(username, score, false);
```

### Admin Functions

```typescript
import { getAllPlayers, getStatistics, clearAllData } from './utils/csvStorage';

// Get all players
const players = getAllPlayers();

// Get statistics
const stats = getStatistics();
console.log(stats.totalPlayers, stats.winners, stats.highestScore);

// Clear all data (admin only)
clearAllData();
```

## File System Access API

### Browser Support

| Browser | Supported | Behavior |
|---------|-----------|----------|
| Chrome | ✅ Yes | File picker dialog |
| Edge | ✅ Yes | File picker dialog |
| Firefox | ❌ No | Auto-download |
| Safari | ❌ No | Auto-download |

### User Workflow (Chrome/Edge)

1. Player logs out or switches players
2. File picker dialog appears
3. User navigates to `/dist` folder
4. User saves as `expo_data.csv` (overwrites existing)
5. Data persisted ✅

### User Workflow (Firefox/Safari)

1. Player logs out or switches players
2. File downloads to `Downloads` folder
3. **User must manually move file to `/dist` folder**
4. **User must refresh the app**
5. Data persisted ✅

## Setup Instructions

### For Expo Staff

1. **Initial Setup** (already done):
   - CSV file exists at `/dist/expo_data.csv`
   - Contains header row only (no player data yet)

2. **First Player Registration**:
   - Player registers normally
   - Data saved to in-memory database
   - On logout, CSV save dialog appears
   - Save to `/dist/expo_data.csv`

3. **Subsequent Players**:
   - App loads existing CSV on startup
   - New registrations added to in-memory database
   - On logout, all data saved back to CSV

4. **Important Notes**:
   - ⚠️ If CSV is not in `/dist` folder, app starts with empty database
   - ⚠️ Always save CSV to `/dist` folder when prompted
   - ⚠️ CSV file must be named exactly `expo_data.csv`
   - ✅ CSV file persists across app restarts
   - ✅ Can open in Excel to view/edit player data

### For Developers

1. **Build the app**:
   ```bash
   npm run build:expo
   ```

2. **Verify CSV file exists**:
   ```bash
   ls dist/expo_data.csv
   ```

3. **Start the server**:
   ```bash
   npm run serve:expo
   # OR
   START_EXPO_GAME.bat
   ```

4. **Test the flow**:
   - Open app → CSV loads (empty initially)
   - Register player → Data in memory
   - Logout → Save CSV to `/dist`
   - Refresh app → Data restored ✅

## Data Migration

### From localStorage to CSV

If you have existing data in localStorage, run this migration:

```typescript
import { getAllPlayers, saveCSVData } from './utils/csvStorage';
import { type ExpoPlayerData } from './utils/csvStorage';

// Get localStorage data
const oldRegistrations = JSON.parse(localStorage.getItem('expo_registrations') || '[]');

// Convert to new format
const migratedPlayers: ExpoPlayerData[] = oldRegistrations.map((reg: any) => {
  const characterKey = `character_${reg.username}`;
  const characterData = localStorage.getItem(characterKey);
  
  return {
    ...reg,
    characterData: characterData ? JSON.parse(characterData) : undefined,
  };
});

// Add to database and save
migratedPlayers.forEach(player => addPlayer(player));
await saveCSVData();
```

## Best Practices

### ✅ DO

- **Always save CSV to `/dist` folder** when prompted
- **Keep CSV file in `/dist` folder** at all times
- **Back up CSV file regularly** (copy to USB drive, cloud storage, etc.)
- **Open CSV in Excel** to verify data integrity
- **Use Admin Panel** to export CSV backups
- **Test CSV load/save** before expo event

### ❌ DON'T

- **Don't move CSV out of `/dist` folder** (app won't find it)
- **Don't rename CSV file** (must be `expo_data.csv`)
- **Don't edit CSV while app is running** (changes will be overwritten)
- **Don't delete CSV file** (all player data lost)
- **Don't rely on browser cache** (CSV is the source of truth)

## Troubleshooting

### Problem: App shows "no players" after restart

**Solution**: CSV file is not in `/dist` folder. Check:
```bash
ls dist/expo_data.csv
```

If missing, use Admin Panel to export fresh CSV or restore from backup.

### Problem: CSV save dialog doesn't appear

**Cause**: Browser doesn't support File System Access API

**Solution**: 
1. File downloads to `Downloads` folder automatically
2. Move file to `/dist/expo_data.csv` manually
3. Refresh the app

### Problem: CSV data looks corrupted

**Cause**: Manual editing or character data JSON malformed

**Solution**:
1. Open CSV in text editor (not Excel)
2. Check column 11 (Character Data) has valid JSON
3. Fix JSON syntax errors
4. Save and refresh app

### Problem: Player data not saving

**Cause**: User canceled save dialog or saved to wrong location

**Solution**:
1. Use Admin Panel → "Save to CSV File" button
2. When dialog appears, navigate to `/dist` folder
3. Save as `expo_data.csv`
4. Refresh app to verify

## Performance Notes

- **CSV Load**: ~10-50ms for 100 players (negligible)
- **In-Memory Operations**: Instant (no disk I/O during gameplay)
- **CSV Save**: ~100-500ms for 100 players (only on logout)
- **File Size**: ~1KB per player (100 players = ~100KB)

## Security Notes

- CSV file is **publicly accessible** via HTTP (anyone can download `/dist/expo_data.csv`)
- **Don't store sensitive data** like passwords or credit cards
- Phone numbers and emails are visible in CSV
- For expo environment (local network), this is acceptable
- For public deployment, implement server-side storage instead

## Future Improvements

- [ ] Server-side CSV storage (upload via API)
- [ ] Automatic CSV backup to cloud storage
- [ ] CSV encryption for sensitive data
- [ ] Real-time sync across multiple devices
- [ ] CSV version control and conflict resolution
- [ ] Admin dashboard for CSV management
- [ ] CSV import/export to other formats (JSON, XML, SQLite)

## Support

For issues or questions, check:
- This guide
- `EXPO_STAFF_LOGIN_GUIDE.md` for admin panel usage
- `EXPO_GUIDE.md` for general expo setup
- Console logs (F12 → Console tab)

---

**Last Updated**: 2024-01-16  
**CSV Storage Version**: 1.0  
**Module**: `src/utils/csvStorage.ts`
