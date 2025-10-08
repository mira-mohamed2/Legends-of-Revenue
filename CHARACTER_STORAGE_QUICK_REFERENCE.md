# Character Storage System - Quick Reference

## 📂 Storage Structure

```
Documents/Legends of Revenue/
└── Characters/
    ├── character_agent007.json
    ├── character_tax_hunter.json
    ├── character_revenue_king.json
    └── ...
```

*(Conceptual path - actually uses browser localStorage)*

---

## 🎮 User Interface

### Character Manager Button
```
┌────────────────────────────────────────────┐
│  💰 Legends of Revenue          💾 Characters │  ← Click here!
├────────────────────────────────────────────┤
│  Map | Character | Market | Players | ...   │
└────────────────────────────────────────────┘
```

### Character Manager Panel
```
┌─────────────────────────────────────────────────┐
│ Character Manager                           ✕   │
├─────────────────────────────────────────────────┤
│ Current Character                               │
│ ┌─────────────────────────────────────────────┐ │
│ │ Agent007                                    │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌──────────────┐  ┌──────────────────────────┐ │
│ │ 📥 Export    │  │ 📤 Import Character      │ │
│ │   Current    │  │                          │ │
│ └──────────────┘  └──────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 📦 Export All Characters                    │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Saved Characters (3)                            │
│ ┌─────────────────────────────────────────────┐ │
│ │ Agent007 ● Active                           │ │
│ │ ⭐ Level 5 | 💰 500 gold                     │ │
│ │ 📍 business-district                        │ │
│ │ Last saved: Oct 8, 2025, 12:34 PM           │ │
│ │              [Export] [Delete]              │ │
│ ├─────────────────────────────────────────────┤ │
│ │ TaxHunter                                   │ │
│ │ ⭐ Level 3 | 💰 200 gold                     │ │
│ │ 📍 guild-hall                               │ │
│ │ Last saved: Oct 7, 2025, 3:45 PM            │ │
│ │ [Load]     [Export] [Delete]                │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ 💾 Characters saved to:                         │
│    Documents/Legends of Revenue/Characters/     │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Import/Export Flow

### Export Character
```
Click 💾 Button
    ↓
Click "📥 Export Current"
    ↓
File downloads: agent007_2025-10-08.json
    ↓
✅ Character saved!
```

### Import Character
```
Click 💾 Button
    ↓
Click "📤 Import Character"
    ↓
Select .json file
    ↓
Conflict check
    ├─ New character → Import directly
    └─ Existing → Ask to overwrite
        ├─ Yes → Replace old data
        └─ No → Cancel import
    ↓
✅ Character imported!
    ↓
"Switch to this character?" 
    ├─ Yes → Load character, reload game
    └─ No → Keep current character
```

### Backup All
```
Click 💾 Button
    ↓
Click "📦 Export All Characters"
    ↓
File downloads: legends_of_revenue_backup_2025-10-08.json
    ↓
✅ All characters backed up!
```

---

## 📊 Character Data Breakdown

```
CharacterData
├─ version: "1.0.0"
├─ username: "Agent007"
├─ lastSaved: "2025-10-08T12:34:56.789Z"
│
├─ stats
│  ├─ level: 5
│  ├─ xp: 250
│  ├─ xpToNext: 500
│  ├─ hp: 100
│  ├─ maxHp: 100
│  ├─ attack: 15
│  ├─ defense: 10
│  └─ gold: 500
│
├─ equipment
│  ├─ weapon: "iron-sword"
│  ├─ armor: "leather-armor"
│  └─ accessory: null
│
├─ inventory: [
│    { itemId: "health-potion", quantity: 3 },
│    { itemId: "iron-sword", quantity: 1 }
│  ]
│
├─ location: "business-district"
├─ enemiesKilled: 12
├─ locationsVisited: ["guild-hall", "business-district", ...]
│
├─ avatar: "/images/avatars/warrior.svg"
├─ customAvatar: null
│
└─ achievements: ["first-blood", "tax-rebel", ...]
```

---

## 🚀 Quick Actions

| Action | Steps |
|--------|-------|
| **Backup Current Character** | 💾 → 📥 Export Current |
| **Backup All Characters** | 💾 → 📦 Export All |
| **Load Different Character** | 💾 → Find character → Load |
| **Import Character** | 💾 → 📤 Import → Select file |
| **Delete Character** | 💾 → Find character → Delete |
| **View All Characters** | 💾 → See list |

---

## 💾 Storage Locations

| Platform | Location |
|----------|----------|
| **Browser (Current)** | localStorage with `character_` prefix |
| **Future Desktop App** | `%USERPROFILE%\Documents\Legends of Revenue\Characters\` |
| **Future Cloud Sync** | Google Drive / Dropbox integration |

---

## 🎯 Use Cases

### Scenario 1: Testing New Build
```
1. Export current character (backup)
2. Create new character
3. Test new playstyle
4. If you don't like it:
   - Delete new character
   - Load original character
```

### Scenario 2: Share with Friend
```
1. Export your character
2. Send .json file to friend
3. Friend clicks Import
4. Friend can see your exact build!
```

### Scenario 3: Move to New Computer
```
1. On old computer: Export All Characters
2. Transfer file to new computer
3. On new computer: Import each character
4. Continue playing with all progress!
```

### Scenario 4: Weekly Backup
```
Every Sunday:
1. Click 💾 Characters
2. Click 📦 Export All
3. Save to Cloud (Google Drive, OneDrive, etc.)
4. ✅ Progress protected!
```

---

## ⚠️ Important Notes

1. **Cannot Delete Active Character**
   - Switch to another character first
   - Then delete from Character Manager

2. **Import Overwrites**
   - Importing same character replaces old data
   - Always export before importing if unsure

3. **Browser Limits**
   - LocalStorage has size limits (~5-10MB)
   - Export to files for long-term storage

4. **No Auto-Sync**
   - Manual export required for backups
   - Cloud sync coming in future update

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| Character not showing | Refresh Character Manager |
| Import failed | Check file is valid JSON |
| Lost character | Check exports/backups |
| Cannot delete | Switch to different character first |
| Storage full | Delete unused characters, export first |

---

## 📝 File Format Example

**agent007_2025-10-08.json:**
```json
{
  "version": "1.0.0",
  "username": "Agent007",
  "lastSaved": "2025-10-08T12:34:56.789Z",
  "stats": {
    "level": 5,
    "xp": 250,
    "xpToNext": 500,
    "hp": 100,
    "maxHp": 100,
    "attack": 15,
    "defense": 10,
    "gold": 500
  },
  "equipment": {
    "weapon": "iron-sword",
    "armor": "leather-armor",
    "accessory": null
  },
  "inventory": [
    { "itemId": "health-potion", "quantity": 3 }
  ],
  "location": "business-district",
  "enemiesKilled": 12,
  "locationsVisited": [
    "guild-hall",
    "business-district"
  ],
  "avatar": "/images/avatars/warrior.svg",
  "customAvatar": null,
  "achievements": [
    "first-blood",
    "tax-rebel"
  ]
}
```

---

## ✅ Features Summary

✅ **Export** individual characters  
✅ **Export** all characters at once  
✅ **Import** characters from files  
✅ **Switch** between characters  
✅ **Delete** unused characters  
✅ **View** all character stats  
✅ **Auto-save** on every action  
✅ **Restore** achievements  
✅ **Backward compatible** with old saves  
✅ **Human-readable** JSON format  
✅ **Version control** for future updates  

---

For complete documentation, see:
- `CHARACTER_STORAGE.md` - Full documentation
- `CHARACTER_STORAGE_IMPLEMENTATION.md` - Implementation details
