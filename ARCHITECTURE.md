# Legends of Revenue - Scalability Architecture

## Overview
This document outlines the architecture designed to support future multiplayer, class systems, and crafting features.

---

## 🏗️ Current Architecture

### State Management (Zustand)
- **sessionStore.ts** - Authentication and user sessions
- **playerStore.ts** - Character stats, inventory, equipment
- **worldStore.ts** - Map exploration, encounters, location progress
- **achievementStore.ts** - Achievement tracking and unlocks
- **uiStore.ts** - UI state and modals
- **questStore.ts** - Quest progress (placeholder)

### Data Files (JSON)
- **items.json** - All game items with stats and rarities
- **enemies.json** - Enemy types and encounter tables
- **maps.json** - Map tiles with connections and encounter rates
- **quests.json** - Quest definitions (placeholder)
- **crafting.json** - Crafting recipes (NEW - for future)
- **classes.json** - Class definitions and abilities (NEW - for future)

### Features (React Components)
- **auth/** - Login/Registration
- **map/** - World exploration
- **combat/** - Turn-based combat
- **character/** - Character sheet, inventory, equipment, achievements
- **market/** - Shop, sell, crafting (NEW)
- **players/** - Multiplayer features (placeholder)
- **classes/** - Class selection and abilities (placeholder)

---

## 🎯 Planned Features

### 1. Class & Ability System

#### Architecture
```typescript
// Add to playerStore.ts
interface PlayerState {
  selectedClass: string | null;
  unlockedAbilities: string[];
  abilitySlots: [string?, string?, string?]; // Equipped abilities
  abilityCooldowns: Record<string, number>; // Ability ID -> turns remaining
}
```

#### Implementation Steps
1. **Class Selection** (Level 5)
   - Add `selectClass(classId: string)` action to playerStore
   - Apply class stat modifiers to base stats
   - Unlock first ability

2. **Ability System**
   - Create `abilityStore.ts` for ability state management
   - Add ability UI to combat view
   - Implement ability effects (buffs, debuffs, status effects)
   - Add cooldown tracking per battle

3. **Ability Unlocks**
   - Unlock abilities at levels 5, 7, 10
   - Allow 3 equipped abilities at once
   - Add ability respec option (gold cost)

#### Data Structure (classes.json)
```json
{
  "id": "tax-rogue",
  "baseStats": { "hpModifier": -20, "attackModifier": 2 },
  "abilities": [
    {
      "id": "shadow-audit",
      "unlockLevel": 5,
      "cooldown": 5,
      "effects": [{ "type": "evade", "duration": 3 }]
    }
  ]
}
```

---

### 2. Item Crafting System

#### Architecture
```typescript
// Add to playerStore.ts
interface PlayerState {
  craftingMaterials: InventorySlot[]; // Separate from regular inventory
  craftingLevel: number;
  unlockedRecipes: string[];
}
```

#### Implementation Steps
1. **Material Collection**
   - Add materials to enemy loot tables
   - Create material category in items.json
   - Separate crafting materials from consumables

2. **Crafting UI** (MarketView.tsx - Craft Tab)
   - Display available recipes
   - Show required materials and gold
   - Preview result item stats
   - Craft button with material validation

3. **Recipe System**
   - Load recipes from crafting.json
   - Check material availability
   - Consume materials on craft
   - Add result to inventory

4. **Advanced Features**
   - Enchantment system (add bonuses to existing items)
   - Upgrade system (improve item tier)
   - Dismantle items for materials

#### Data Structure (crafting.json)
```json
{
  "id": "iron-sword-craft",
  "materials": [
    { "itemId": "iron-ore", "quantity": 3 },
    { "itemId": "wood-plank", "quantity": 1 }
  ],
  "resultItemId": "rusty-sword",
  "goldCost": 50
}
```

---

### 3. Multiplayer System

#### Backend Requirements
- **Database**: PostgreSQL or MongoDB
  - User accounts (secure auth)
  - Player data (synced from localStorage)
  - Trading history
  - Leaderboards
  - Guild data

- **WebSocket Server**: Socket.io or native WebSockets
  - Real-time player presence
  - Live chat
  - PvP combat sessions
  - Trading interface

- **REST API**: Express.js or NestJS
  - Player profiles
  - Leaderboard queries
  - Guild management
  - Trading requests

#### Frontend Changes

**1. Create Multiplayer Store**
```typescript
// multiplayerStore.ts
interface MultiplayerState {
  onlinePlayers: Player[];
  guilds: Guild[];
  tradeRequests: TradeRequest[];
  pvpChallenges: PvPChallenge[];
  
  connectToServer: () => void;
  fetchOnlinePlayers: () => void;
  sendTradeRequest: (targetId: string, items: Item[]) => void;
  challengeToPvP: (targetId: string) => void;
}
```

**2. PlayersView.tsx Implementation**
- Display online players with levels and equipment
- Show player profiles on click
- Add friend system
- Display leaderboards (Level, Gold, Achievements, PvP Rank)

**3. PvP Combat**
- Extend CombatView for player-vs-player
- Turn-based with timer (30 seconds per turn)
- Betting system (gold wager)
- PvP-specific rewards and rankings

**4. Guild System**
- Create/join guilds (gold fee)
- Guild chat and announcements
- Guild quests (cooperative goals)
- Guild hall upgrades
- Guild vs Guild wars

**5. Trading System**
- Direct player-to-player item trading
- Auction house for async trading
- Trade history and fraud protection
- Gold and item exchange

---

## 🔧 Technical Implementation Guide

### Phase 1: Class System (No Backend)
**Time Estimate**: 1-2 weeks
1. Add class selection UI at level 5
2. Implement ability data loading from classes.json
3. Create ability buttons in CombatView
4. Add cooldown tracking system
5. Implement ability effects (damage multipliers, buffs, debuffs)
6. Add visual indicators for active buffs/debuffs
7. Test all 4 classes and 12 abilities

### Phase 2: Crafting System (No Backend)
**Time Estimate**: 1-2 weeks
1. Add crafting materials to items.json
2. Update enemy loot tables with materials
3. Create crafting UI in MarketView
4. Implement recipe validation logic
5. Add crafting level progression
6. Create enchantment and upgrade systems
7. Add crafting achievements

### Phase 3: Backend Infrastructure
**Time Estimate**: 3-4 weeks
1. Set up Node.js backend (Express + Socket.io)
2. Create PostgreSQL database schema
3. Implement user authentication (JWT)
4. Create data sync endpoints (save/load)
5. Build WebSocket connection manager
6. Deploy to cloud (Heroku, DigitalOcean, or AWS)

### Phase 4: Multiplayer Features
**Time Estimate**: 4-6 weeks
1. Player list and profiles
2. Real-time chat system
3. Trading system (direct trade)
4. PvP combat system
5. Leaderboards
6. Guild system
7. Auction house

---

## 📊 Database Schema (Planned)

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### Players Table
```sql
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  level INTEGER DEFAULT 1,
  hp INTEGER DEFAULT 100,
  max_hp INTEGER DEFAULT 100,
  attack INTEGER DEFAULT 10,
  defense INTEGER DEFAULT 5,
  gold INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  selected_class VARCHAR(50),
  current_location VARCHAR(50),
  enemies_killed INTEGER DEFAULT 0
);
```

### Inventory Table
```sql
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  item_id VARCHAR(50) NOT NULL,
  quantity INTEGER DEFAULT 1
);
```

### Trades Table
```sql
CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  status VARCHAR(20), -- pending, accepted, rejected, completed
  sender_items JSONB,
  receiver_items JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Guilds Table
```sql
CREATE TABLE guilds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  leader_id INTEGER REFERENCES users(id),
  level INTEGER DEFAULT 1,
  gold INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login and get JWT
- `POST /api/auth/logout` - Invalidate session

### Player Data
- `GET /api/player/:id` - Get player profile
- `PUT /api/player/:id` - Update player data
- `GET /api/player/:id/inventory` - Get inventory
- `POST /api/player/:id/sync` - Sync local save to server

### Multiplayer
- `GET /api/players/online` - Get online players
- `GET /api/leaderboard/:type` - Get rankings (level, gold, pvp)
- `POST /api/trade/request` - Send trade request
- `PUT /api/trade/:id/accept` - Accept trade
- `GET /api/guilds` - List all guilds
- `POST /api/guilds` - Create new guild
- `POST /api/guilds/:id/join` - Join guild

### WebSocket Events
- `player:connect` - Player comes online
- `player:disconnect` - Player goes offline
- `chat:message` - Send/receive messages
- `trade:request` - Incoming trade request
- `pvp:challenge` - PvP challenge received
- `guild:notification` - Guild announcements

---

## 🎨 UI/UX Considerations

### Class Selection Screen
- Appears at level 5
- Shows all 4 classes side-by-side
- Displays class stats, abilities, and playstyle
- Confirmation dialog (class is permanent until respec)

### Ability UI in Combat
- 3 ability slots below Attack button
- Show cooldown counters
- Disable if on cooldown
- Tooltip with ability description on hover
- Visual effects for buffs/debuffs (status icons)

### Crafting Interface
- Recipe list on left, crafting preview on right
- Highlight recipes you can craft (have materials)
- Show missing materials in red
- Crafting animation on success
- Notification for rare crafts

### Multiplayer UI
- Player list sidebar (avatars, levels, status)
- Chat window (toggleable)
- Trade request popup
- PvP challenge popup with accept/decline
- Guild panel (members, chat, quests)

---

## 🔐 Security Considerations

### Authentication
- Use bcrypt for password hashing
- JWT tokens with expiration
- HTTPS only in production
- Rate limiting on API endpoints

### Trading
- Server-side validation of all trades
- Lock items during trade (prevent duping)
- Trade history audit log
- Report system for suspicious trades

### Anti-Cheat
- Server-side stat validation
- Impossible action detection
- Regular save backups
- Ban system for cheaters

---

## 📈 Scalability Plan

### Horizontal Scaling
- Load balancer for multiple backend instances
- Redis for session management
- Database read replicas
- CDN for static assets

### Performance Optimization
- Lazy loading for game views
- Virtual scrolling for long lists
- Debounce frequent API calls
- WebSocket message batching
- Database query optimization (indexes)

---

## 🧪 Testing Strategy

### Unit Tests
- Store actions (Zustand)
- Utility functions
- Combat calculations
- Ability effects

### Integration Tests
- API endpoints
- WebSocket connections
- Database operations
- Trade workflows

### E2E Tests
- User registration and login
- Character creation and progression
- Combat scenarios
- Crafting recipes
- Multiplayer interactions

---

## 📝 Development Roadmap

### ✅ Phase 0: Demo (Current)
- Basic gameplay loop
- Combat, exploration, inventory
- Achievements
- Local save/load

### 🚧 Phase 1: Single-Player Enhancement (1-2 months)
- Class and ability system
- Crafting system
- More enemies and locations
- Boss encounters
- Quest system activation

### 🔮 Phase 2: Backend Infrastructure (1 month)
- Set up server and database
- User authentication
- Cloud save system
- API development

### 🌐 Phase 3: Multiplayer (2-3 months)
- Player profiles and leaderboards
- Real-time chat
- Trading system
- PvP combat
- Guild system

### 🎯 Phase 4: Advanced Features (Ongoing)
- Mobile app (React Native)
- Seasonal events
- Battle pass system
- Cosmetic shop
- Endgame content (raids, tournaments)

---

## 🛠️ Technology Stack (Current + Planned)

### Frontend (Current)
- React 18
- TypeScript
- Zustand (state management)
- Tailwind CSS
- Vite

### Backend (Planned)
- Node.js + Express
- TypeScript
- Socket.io (WebSockets)
- PostgreSQL (database)
- Redis (caching/sessions)
- JWT (authentication)

### DevOps (Planned)
- Docker (containerization)
- GitHub Actions (CI/CD)
- DigitalOcean/AWS (hosting)
- Nginx (reverse proxy)

---

## 📞 Future Considerations

### Monetization (Optional)
- Cosmetic items (skins, emotes)
- Battle pass (seasonal content)
- Premium account (faster progression)
- No pay-to-win mechanics

### Community Features
- Forums integration
- Discord bot
- Wiki/guide system
- Content creator tools

### Localization
- Multi-language support
- Currency localization
- Regional servers

---

**Last Updated**: October 8, 2025
**Version**: 1.0 (Demo)
**Author**: Development Team
