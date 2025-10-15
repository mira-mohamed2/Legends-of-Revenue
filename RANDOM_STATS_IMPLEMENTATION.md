# Random Enemy Stats Implementation

## Overview
Implemented dynamic enemy stat generation system where each encounter generates random stats within defined ranges, adding variety to combat and scaling rewards based on enemy strength.

## Changes Made

### 1. New Type Definitions (`src/types/combat.ts`)
- Added `StatRange` interface with `min` and `max` properties
- Added `EnemyStatRanges` interface for HP, attack, and defense ranges
- Updated `Enemy` interface to include optional `statRanges` field
- Updated `EncounterState` to include optional `rewardMultiplier` field

### 2. New Utility Functions (`src/utils/enemyStats.ts`)
Created three utility functions:
- **`randomInRange(min, max)`**: Generates random integer between min and max (inclusive)
- **`generateEnemyStats(statRanges)`**: Creates random stats from stat ranges
- **`calculateRewardMultiplier(stats, ranges)`**: Calculates reward bonus (0.8-1.3x) based on how strong the generated enemy is

### 3. Enemy Data Updates (`src/data/enemies.json`)
Converted all 4 enemies from fixed stats to stat ranges:

- **Tax Dodger Rat**: HP 12-18, Attack 3-5, Defense 0-2
- **Petty Tax Evader**: HP 20-30, Attack 5-8, Defense 2-4
- **Offshore Accountant**: HP 16-24, Attack 6-9, Defense 1-3
- **Corrupted Businessman**: HP 30-40, Attack 7-10, Defense 4-6

Removed old fixed `stats` field, keeping only `statRanges`.

### 4. World Store Updates (`src/state/worldStore.ts`)
Updated `startEncounter()` function to:
- Generate random stats from enemy stat ranges
- Calculate reward multiplier based on generated stats
- Store both randomized stats and stat ranges in encounter state
- Store reward multiplier for use in combat rewards

### 5. Combat View Updates (`src/features/combat/CombatView.tsx`)
**UI Changes:**
- Added "(Randomized)" indicator to Enemy Stats header
- Display stat ranges next to current values (e.g., "15 (12-18)")
- Shows ranges for HP, Attack, and Defense

**Rewards Changes:**
- Apply reward multiplier to XP and gold rewards
- Display bonus message when multiplier > 1.15 (e.g., "+25% bonus rewards")
- Stronger randomly-generated enemies give better rewards

### 6. Home View Updates (`src/features/home/HomeView.tsx`)
Updated enemy codex modal to:
- Display stat ranges instead of fixed stats
- Show "HP Range", "Attack Range", "Defense Range"
- Added note: "⚠️ Stats are randomized within the ranges shown above for each encounter"

## How It Works

1. **Encounter Starts**: When player encounters an enemy, `worldStore.startEncounter()` is called
2. **Stats Generated**: Random stats are generated within the defined ranges using `generateEnemyStats()`
3. **Multiplier Calculated**: Reward multiplier (0.8-1.3x) is calculated based on how strong the stats are
4. **Combat Proceeds**: Player fights the enemy with its randomized stats
5. **Rewards Scaled**: Upon victory, XP and gold rewards are multiplied by the strength multiplier
6. **UI Displays**: Combat view shows both current stats and possible ranges

## Example

A **Petty Tax Evader** has these ranges:
- HP: 20-30
- Attack: 5-8
- Defense: 2-4

**Weak Roll (HP: 20, Attack: 5, Defense: 2)**
- Multiplier: ~0.8x
- Rewards: 24 XP, 16 gold (80% of base)

**Average Roll (HP: 25, Attack: 6, Defense: 3)**
- Multiplier: ~1.0x
- Rewards: 30 XP, 20 gold (100% of base)

**Strong Roll (HP: 30, Attack: 8, Defense: 4)**
- Multiplier: ~1.3x
- Rewards: 39 XP, 26 gold (130% of base)
- Bonus message: "💰 This was a tough one! (+30% bonus rewards)"

## Benefits

1. **Combat Variety**: No two encounters are exactly the same
2. **Replay Value**: Same enemy types provide different challenges
3. **Fair Rewards**: Harder fights give better rewards
4. **Player Engagement**: Visual feedback shows stat variability
5. **Strategic Depth**: Players can see potential stat ranges before engaging
