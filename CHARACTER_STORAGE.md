# Character Storage System

## Overview

The Legends of Revenue now stores all player character data in a persistent storage system that mimics the structure of `Documents/Legends of Revenue/Characters/`. This allows for easy backup, sharing, and management of character profiles.

## Storage Location

**Conceptual Path:** `Documents/Legends of Revenue/Characters/`

**Actual Storage:** 
- Browser: LocalStorage with prefix `character_`
- Future Desktop App: Actual file system in Documents folder

## Features

### 1. Automatic Saving
- Every game action automatically saves to the character file
- Includes stats, inventory, equipment, location, achievements
- Timestamp tracked for each save
- Version control for future compatibility

### 2. Import/Export

#### Export Current Character
```typescript
exportCharacter(username: string): void
```
- Downloads character as `.json` file
- Includes all progress and achievements
- Filename format: `{username}_{date}.json`
- Can be shared with other players

#### Export All Characters
```typescript
exportAllCharacters(): void
```
- Creates backup of ALL saved characters
- Single file with all character data
- Perfect for migrating to a new device
- Filename format: `legends_of_revenue_backup_{date}.json`

#### Import Character
```typescript
importCharacter(file: File): Promise<CharacterData | null>
```
- Load character from `.json` file
- Warns if character already exists
- Asks permission to overwrite
- Can import characters from other players

### 3. Character Management UI

Access via the **💾 Characters** button in the top-right corner of the screen.

**Features:**
- View all saved characters
- See character stats (level, gold, location)
- Load different characters
- Export individual characters
- Delete characters (with confirmation)
- Import new characters

## Character Data Structure

```typescript
interface CharacterData {
  version: string;              // Format version (currently "1.0.0")
  username: string;             // Character name
  lastSaved: string;            // ISO timestamp
  stats: PlayerStats;           // Level, HP, gold, etc.
  equipment: PlayerEquipment;   // Weapon, armor, accessory
  inventory: InventorySlot[];   // All items
  location: string;             // Current map location
  enemiesKilled: number;        // Total enemies defeated
  locationsVisited: string[];   // All discovered locations
  avatar: string;               // Avatar image path
  customAvatar: string | null;  // Custom uploaded avatar
  achievements: string[];       // Unlocked achievement IDs
}
```

## Usage Examples

### Export Your Character
1. Click the **💾 Characters** button
2. Click **📥 Export Current**
3. Save the `.json` file to your computer
4. Share with friends or keep as backup

### Import a Character
1. Click the **💾 Characters** button
2. Click **📤 Import Character**
3. Select a `.json` file
4. Confirm if you want to overwrite existing character
5. Optionally switch to the imported character

### Switch Characters
1. Click the **💾 Characters** button
2. Find the character you want in the list
3. Click **Load** button
4. Confirm the switch
5. Game reloads with new character

### Backup All Progress
1. Click the **💾 Characters** button
2. Click **📦 Export All Characters**
3. Save the backup file
4. Store somewhere safe (cloud storage, USB drive, etc.)

## Migration & Compatibility

### Version 1.0.0
- Initial release
- All fields required
- Achievements stored as ID array

### Future Versions
- Migration system will handle old character files
- Backward compatibility guaranteed
- Automatic format upgrades when loading old characters

## Technical Details

### Storage Keys
- Format: `character_{safe_username}`
- Safe username: lowercase, alphanumeric + underscores
- Example: `character_agent_smith`

### File Format
- Standard JSON
- Pretty-printed (2-space indentation)
- Human-readable
- Can be manually edited (advanced users)

### Security Considerations
- All data stored client-side
- No server validation
- Players can manually edit character files
- Single-player game, so no anti-cheat needed
- Trust-based system for sharing characters

## Troubleshooting

### Character Not Found
- Check character name spelling
- Look in Character Manager list
- Try importing from backup

### Import Failed
- Verify file is valid JSON
- Check version compatibility
- Ensure all required fields present
- Look for file corruption

### Lost Progress
- Check last saved timestamp
- Verify character is in list
- Try exporting and re-importing
- Check browser localStorage limits

### Cannot Delete Character
- Cannot delete currently active character
- Switch to different character first
- Then delete from Character Manager

## Best Practices

1. **Regular Backups**
   - Export all characters weekly
   - Store backups in cloud storage
   - Keep multiple backup versions

2. **Character Sharing**
   - Export before sharing
   - Include character details in filename
   - Test imported characters in fresh profile

3. **Storage Management**
   - Delete unused characters
   - Export before deleting
   - Keep character count reasonable

4. **Version Updates**
   - Export all characters before game updates
   - Test new version with backup character
   - Verify achievements transferred correctly

## Future Enhancements

- [ ] Cloud sync (Google Drive, Dropbox)
- [ ] Character comparison tool
- [ ] Automated backups
- [ ] Character templates/presets
- [ ] Multiplayer profile support
- [ ] Character merge tool
- [ ] Achievement transfer between characters
- [ ] Character stats history/timeline
- [ ] Leaderboards (based on exported characters)
- [ ] Character builds sharing (Reddit integration)

## API Reference

### Core Functions

```typescript
// Save character
saveCharacter(data: Omit<CharacterData, 'version' | 'lastSaved'>): boolean

// Load character
loadCharacter(username: string): CharacterData | null

// Delete character
deleteCharacter(username: string): boolean

// List all characters
listCharacters(): string[]

// Get character summary
getCharacterInfo(username: string): CharacterInfo | null

// Export to file
exportCharacter(username: string): void

// Import from file
importCharacter(file: File): Promise<CharacterData | null>

// Backup all
exportAllCharacters(): void
```

### Integration with Game

The character storage integrates seamlessly with the game's state management:

- **playerStore.savePlayer()** - Automatically calls `saveCharacter()`
- **playerStore.loadPlayer()** - Automatically calls `loadCharacter()`
- **All game actions** - Trigger auto-save via store updates

## Console Commands (Advanced)

For debugging and advanced users, these commands work in browser console:

```javascript
// List all saved characters
localStorage.getItem('character_*')

// View specific character
JSON.parse(localStorage.getItem('character_agent_name'))

// Delete specific character (careful!)
localStorage.removeItem('character_agent_name')

// Clear all characters (VERY dangerous!)
Object.keys(localStorage)
  .filter(k => k.startsWith('character_'))
  .forEach(k => localStorage.removeItem(k))
```

## Support

For issues or questions about character storage:
1. Check this documentation
2. Try export/import cycle
3. Check browser console for errors
4. Open GitHub issue with character file (remove sensitive data)
