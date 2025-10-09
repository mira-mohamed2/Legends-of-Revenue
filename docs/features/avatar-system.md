# Avatar System - Implementation Complete ✅

## Overview
The avatar system allows players to customize their character appearance with default avatars or custom uploaded images. Avatars are displayed during combat encounters alongside enemy images.

## Features Implemented

### 1. Enemy Images (4 SVG Files)
Location: `/public/images/enemies/`

- **tax-collector.svg** - Business suit, briefcase, papers, TAX badge
- **audit-phantom.svg** - Purple ghost with animated glow and floating papers
- **revenue-enforcer.svg** - Armored warrior with $ shield and sword
- **mira-dragon.svg** - Green dragon with MIRA text on belly

All enemies in `enemies.json` now have an `"image"` field pointing to their respective SVG.

### 2. Player Avatar Images (4 SVG Files)
Location: `/public/images/avatars/`

- **rogue.svg** - Hooded assassin with mask and dagger (default)
- **warrior.svg** - Knight with helmet, shield, and sword
- **mage.svg** - Wizard with pointed hat and glowing staff
- **priest.svg** - Holy figure with animated halo and cross

### 3. Avatar System in PlayerStore
New fields added to PlayerState:
```typescript
avatar: string                 // Path to selected default avatar
customAvatar: string | null    // Base64 data URL of uploaded image
```

New actions:
```typescript
setAvatar(avatarPath: string)           // Select a default avatar
setCustomAvatar(imageUrl: string | null) // Set/clear custom avatar
```

Persistence:
- Both fields are saved to localStorage
- Automatically loaded on game start
- Default fallback to rogue avatar if missing

### 4. Combat View Integration
- Displays enemy image (48x48 with brown border)
- Displays player avatar (48x48 with gold border)
- Shows customAvatar if uploaded, otherwise shows selected default avatar
- Names displayed below avatars
- Stat panels renamed for clarity

### 5. AvatarSelector Component
Location: `/src/components/AvatarSelector.tsx`

Features:
- **Current Avatar Preview** - Shows active avatar (32x32)
- **Default Avatars Grid** - Choose from 4 pre-made avatars
- **Custom Upload** - Upload your own image (max 2MB)
  - Validates image type
  - Converts to base64 for localStorage compatibility
  - Instant preview
- **Reset Button** - Remove custom avatar and return to default
- **Modal Interface** - Clean popup for avatar selection

Integrated into CharacterView at the top of the character sheet.

## How to Use

### For Players:
1. Click "Character" in the menu
2. Click "Change Avatar" button
3. Either:
   - Click one of the 4 default avatars to select it
   - Click "Choose File" to upload a custom image (PNG, JPG, GIF, WebP)
   - Click "Reset to Default" to remove custom avatar
4. Your avatar will appear in combat when fighting enemies

### Technical Details:
- **Image Storage**: Custom avatars stored as base64 data URLs in localStorage
- **Size Limit**: 2MB maximum for uploaded images
- **Supported Formats**: PNG, JPG, JPEG, GIF, WebP
- **Persistence**: Avatars survive browser refresh and logout
- **Default**: New players start with rogue avatar

## File Changes Summary

### Created Files:
- `/public/images/enemies/tax-collector.svg`
- `/public/images/enemies/audit-phantom.svg`
- `/public/images/enemies/revenue-enforcer.svg`
- `/public/images/enemies/mira-dragon.svg`
- `/public/images/avatars/rogue.svg`
- `/public/images/avatars/warrior.svg`
- `/public/images/avatars/mage.svg`
- `/public/images/avatars/priest.svg`
- `/src/components/AvatarSelector.tsx`

### Modified Files:
- `/src/data/enemies.json` - Added `image` field to all enemies
- `/src/state/playerStore.ts` - Added avatar fields, actions, persistence
- `/src/features/combat/CombatView.tsx` - Added avatar display section
- `/src/features/character/CharacterView.tsx` - Integrated AvatarSelector

## Testing Checklist
- [x] Enemy images display in combat
- [ ] Default avatar selection works
- [ ] Custom avatar upload works (test with <2MB image)
- [ ] Avatar displays in combat after selection
- [ ] Avatar persists after page refresh
- [ ] Reset to default button works
- [ ] File size validation prevents >2MB uploads
- [ ] Image type validation prevents non-image uploads

## Future Enhancements
- Add more default avatars for each class
- Implement avatar cropping/resizing UI
- Add avatar frames/borders as unlockable achievements
- Display avatars in Players view (multiplayer)
- Animated avatars for premium users
