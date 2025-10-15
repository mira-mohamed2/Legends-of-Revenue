# Combat Animations Implementation

## Overview
Added dynamic combat animations to make battles more engaging and visually exciting. The system includes character attack movements, damage shake effects, floating damage numbers, and **sword clash effects in the center**.

## Features Implemented

### 1. **Attack Animations**
Characters move/lunge when attacking:
- **Player Attack**: Character lunges left toward enemy with scale increase
- **Enemy Attack**: Character lunges right toward player with scaling
- Duration: 600ms with smooth ease-out timing
- Triggered automatically when attack action is performed

### 2. **⚔️ Sword Clash Effects (NEW!)**
Epic sword clash animation in the center between characters:
- **Two Swords**: One from each character, clashing in the middle
- **Collision Spark**: 💥 explosion effect at impact point
- **Timing**: Appears at peak of attack animation (250ms delay)
- **Duration**: 400ms complete sword clash sequence
- **Visual Effect**: Swords fly in from sides, collide, spark, then fade
- **Positioning**: Dynamically centered between player and enemy avatars

### 3. **Hit/Damage Shake Effect**
Shake animation when receiving damage:
- Rapid horizontal shake motion
- Brightness/saturation increase on hit for visual feedback
- Duration: 500ms
- Applied to both player and enemy when taking damage

### 3. **Floating Damage Numbers**
Animated damage values that float upward:
- **Position**: Spawns near the character's avatar
- **Movement**: Floats upward and fades out over 1 second
- **Critical Hits**: Yellow/gold color with 💥 emojis
- **Normal Hits**: Red color
- **Randomized Position**: Slight horizontal offset for variety
- Auto-cleanup after animation completes

### 4. **Smooth HP Bar Transitions**
- HP bars smoothly animate when health changes (already existed)
- 500ms transition duration for visual clarity

## Animation Details

### CSS Keyframes Added (`src/index.css`)

#### Attack Animations
```css
@keyframes attackPlayer
- 0%: Rest position
- 30-50%: Lunge forward with scale 1.05-1.1
- 100%: Return to rest

@keyframes attackEnemy
- Same as player but opposite direction (right)
```

#### Hit Shake
```css
@keyframes hitShake
- Alternating left/right shake (-5px to +5px)
- 5 shake cycles in 500ms
- Brightness filter applied for flash effect
```

#### Damage Float
```css
@keyframes damageFloat
- 0%: Scale 0.5, opacity 0 (hidden)
- 10%: Scale 1.2, full opacity (pop in)
- 50%: Scale 1.0, floating up
- 100%: Scale 0.8, opacity 0, 80px above start
```

#### Sword Clash (NEW!)
```css
@keyframes swordLeft
- 0%: Off-screen left, small scale
- 50%: Swings to center-left, full size
- 100%: Slight retreat, fade out

@keyframes swordRight
- 0%: Off-screen right, small scale
- 50%: Swings to center-right, full size
- 100%: Slight retreat, fade out

@keyframes clashSpark
- 0%: Hidden, scale 0
- 30%: Burst at full brightness, scale 1.5
- 100%: Fade and expand, scale 2.5
```

## Implementation Code Changes

### State Management (`CombatView.tsx`)
Added animation states:
```typescript
const [playerAttacking, setPlayerAttacking] = useState(false);
const [enemyAttacking, setEnemyAttacking] = useState(false);
const [playerHit, setPlayerHit] = useState(false);
const [enemyHit, setEnemyHit] = useState(false);
const [showSwordClash, setShowSwordClash] = useState(false); // NEW!
const [damageNumbers, setDamageNumbers] = useState<Array<DamageNumber>>([]);
```

### Helper Function
```typescript
showDamageNumber(damage, isCrit, isPlayer)
- Creates floating damage number
- Randomizes horizontal position
- Auto-removes after 1 second
```

### Attack Flow Timing
1. **Player attacks** (0ms):
   - Trigger `playerAttacking` animation (600ms)
   
2. **Sword clash appears** (250ms):
   - Trigger `showSwordClash` (400ms)
   - Swords fly from sides, collide with 💥 spark
   
3. **Damage calculation** (300ms delay):
   - Calculate damage
   - Trigger `enemyHit` shake (500ms)
   - Show damage number (1000ms float)
   - Log combat message
   
4. **Enemy attacks** (800ms delay from player attack):
   - Trigger `enemyAttacking` animation (600ms)
   
5. **Enemy's sword clash** (1050ms):
   - Trigger `showSwordClash` again (400ms)
   - Swords fly and clash
   
6. **Enemy damage** (300ms after enemy attack starts):
   - Calculate damage
   - Trigger `playerHit` shake (500ms)
   - Show damage number
   - Log combat message

**Total Round Time**: ~2.2 seconds for complete player → enemy cycle with sword effects

## Visual Effects

### Combat Center (NEW!)
- **Sword Clash**: Two ⚔️ emojis flying from sides
- **Collision Point**: Centered between avatars
- **Spark Effect**: 💥 explosion on impact
- **Fade Out**: Swords retreat and disappear

### Player Character
- **Attacking**: Lunges left, grows slightly
- **Hit**: Shakes, brightens, shows red damage number

### Enemy Character  
- **Attacking**: Lunges right, grows slightly
- **Hit**: Shakes, brightens, shows damage number
- **Critical Hit on Enemy**: Yellow damage numbers with 💥

### Damage Numbers
- **Normal**: `-15` in red
- **Critical**: `💥 30 💥` in yellow/gold
- **Position**: Random horizontal spread for variety
- **Animation**: Scale pop → float up → fade out

## Accessibility
- Respects `prefers-reduced-motion` media query
- Animations automatically disabled for users with motion sensitivity
- All timing can be adjusted in CSS without code changes

## Performance Optimizations
- Damage numbers auto-cleanup to prevent memory leaks
- Transform-based animations for GPU acceleration
- Minimal reflows/repaints
- State changes batched where possible

## Future Enhancement Ideas
- ⚔️ Different attack animations for different weapon types
- 🛡️ Block/parry animations with shield effects
- ✨ Particle effects for magic abilities
- 💀 Death/defeat animations
- 🎊 Victory celebration animation
- ⚡ Status effect visual indicators (poison, buffs, etc.)
- 🔊 Sound effects synchronized with animations
- 🗡️ Different weapon clash effects (axes, bows, magic staffs)
- 🔥 Elemental effects on weapons (fire, ice, lightning)

## Usage
Animations trigger automatically during combat - no manual intervention required. Just attack or get attacked and watch the show!

## Testing
1. Start a combat encounter
2. Click "Attack" button
3. Observe:
   - Player lunges forward
   - **⚔️ Swords clash in the center with 💥 spark**
   - Enemy shakes when hit
   - Damage number floats up
   - Enemy attacks back with same effects including sword clash
   - HP bars smoothly decrease

Critical hits show special yellow numbers with emoji effects.

**The sword clash appears at the perfect moment** when the attack connects, making every hit feel impactful!
