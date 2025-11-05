# Migration Guide: localStorage to CSV Storage

## Overview

This guide helps you migrate existing player data from the old localStorage-based system to the new CSV-based storage system.

## When to Use This

- You have existing player data in localStorage
- You want to preserve registration and character progress
- You're switching from the old system to CSV storage

## Important Notes

⚠️ **Backup First**: Before migration, export your current localStorage data using the old Admin Panel "Export to CSV" button.

⚠️ **One-Time Process**: This migration only needs to be done once.

✅ **Safe**: The migration script reads localStorage but doesn't delete it. You can verify CSV data before clearing localStorage.

## Migration Steps

### Option 1: Automatic Migration (Recommended)

1. **Open Browser Console** (F12 → Console tab)

2. **Paste and run this migration script**:

```javascript
// Migration script: localStorage → CSV
(async function migrateToCsv() {
  console.log('🔄 Starting migration...');
  
  // Import CSV storage functions
  const { addPlayer, saveCSVData, getAllPlayers, clearAllData } = await import('./src/utils/csvStorage.ts');
  
  // Clear CSV database first (start fresh)
  clearAllData();
  
  // Get localStorage data
  const oldRegistrations = JSON.parse(localStorage.getItem('expo_registrations') || '[]');
  console.log(`Found ${oldRegistrations.length} players in localStorage`);
  
  if (oldRegistrations.length === 0) {
    console.log('❌ No data to migrate!');
    return;
  }
  
  // Migrate each player
  let migratedCount = 0;
  for (const reg of oldRegistrations) {
    try {
      // Get character data
      const characterKey = `character_${reg.username}`;
      const characterDataStr = localStorage.getItem(characterKey);
      const characterData = characterDataStr ? JSON.parse(characterDataStr) : undefined;
      
      // Create new player object
      const newPlayer = {
        ...reg,
        characterData: characterData,
      };
      
      // Add to CSV database
      addPlayer(newPlayer);
      migratedCount++;
      console.log(`✅ Migrated: ${reg.username}`);
    } catch (error) {
      console.error(`❌ Failed to migrate ${reg.username}:`, error);
    }
  }
  
  console.log(`✅ Migration complete! ${migratedCount}/${oldRegistrations.length} players migrated.`);
  
  // Save to CSV file
  console.log('💾 Saving to CSV...');
  await saveCSVData();
  console.log('✅ CSV saved! Check your Downloads folder or save dialog.');
  console.log('📋 Next step: Move CSV file to /dist/expo_data.csv and refresh the app.');
})();
```

3. **Save the CSV file**:
   - Chrome/Edge: Save dialog appears → Navigate to `/dist` folder → Save as `expo_data.csv`
   - Firefox/Safari: File downloads to Downloads → Move to `/dist/expo_data.csv`

4. **Verify the migration**:
   - Refresh the app
   - Open Admin Panel
   - Check that all players are shown
   - Check player counts match

5. **Test a player**:
   - Login as an existing player
   - Verify gold, items, and inventory are correct
   - Play a combat session
   - Logout (save CSV again)
   - Login again (verify data persisted)

### Option 2: Manual Export/Import

1. **Export from old system**:
   - Open Admin Panel (old system)
   - Click "Export to Excel (CSV)"
   - Save file as `expo_backup.csv`

2. **Format conversion** (if needed):
   - Open `expo_backup.csv` in Excel
   - Add column 12: "Character Data (JSON)"
   - For each player, manually add character data:
     ```json
     {"stats":{"level":1,"xp":0,"gold":1000,...},"equipment":{...},"inventory":[...],"location":"Elaria","avatar":"warrior","customAvatar":null}
     ```
   - Save as `expo_data.csv`

3. **Import to new system**:
   - Copy `expo_data.csv` to `/dist` folder
   - Refresh the app
   - Verify data loaded

### Option 3: Start Fresh (No Migration)

If you don't need to preserve old data:

1. **Clear localStorage** (optional):
   ```javascript
   localStorage.clear();
   ```

2. **App will use fresh CSV**:
   - `/dist/expo_data.csv` already exists with headers only
   - New registrations will populate it

## Verification Checklist

After migration, verify:

- [ ] CSV file exists at `/dist/expo_data.csv`
- [ ] CSV file has 12 columns with correct headers
- [ ] All player usernames present
- [ ] Player counts match (old vs new)
- [ ] Can login as existing player
- [ ] Character data restored (gold, items, inventory)
- [ ] New registrations work
- [ ] Logout saves CSV correctly
- [ ] App restart loads CSV correctly

## Character Data Structure

For manual migration, character data should look like this:

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

**Note**: All JSON must be on a single line in the CSV (no line breaks).

## Troubleshooting

### Problem: Migration script doesn't work

**Solution**: Make sure you're running the script in the browser console (F12) while the app is open.

### Problem: Character data not migrating

**Cause**: localStorage key format different than expected

**Solution**: Check localStorage keys:
```javascript
Object.keys(localStorage).forEach(key => console.log(key));
```

Look for keys like `character_username`. If different, adjust migration script.

### Problem: CSV has wrong format

**Cause**: Manual editing or Excel formatting issues

**Solution**: Open CSV in text editor (Notepad++, VS Code), verify format matches guide.

### Problem: "Duplicate username" error

**Cause**: Player already exists in CSV database

**Solution**: Run `clearAllData()` before migration, or skip duplicates in migration script.

## Post-Migration Cleanup

Once migration is verified and working:

1. **Optional: Clear localStorage**:
   ```javascript
   localStorage.clear();
   ```

2. **Keep old CSV backup**:
   - Save old CSV export as `expo_backup_YYYYMMDD.csv`
   - Store safely in case of issues

3. **Update expo staff**:
   - Show them new CSV save workflow
   - Explain CSV location (`/dist/expo_data.csv`)
   - Demonstrate logout save process

## Important Reminders

- ✅ CSV file MUST be in `/dist` folder
- ✅ CSV file MUST be named `expo_data.csv`
- ✅ Always save CSV when logging out
- ✅ Back up CSV regularly during expo
- ❌ Don't delete `/dist/expo_data.csv`
- ❌ Don't rename CSV file

---

**Next Steps After Migration**:
1. Read `CSV_STORAGE_GUIDE.md` for complete system documentation
2. Read `EXPO_STAFF_LOGIN_GUIDE.md` for admin panel usage
3. Test the new system thoroughly before expo event

**Support**: If migration fails, keep the old localStorage backup and contact developer.
