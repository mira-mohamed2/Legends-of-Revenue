# Registration System Implementation Summary

## ✅ What Was Implemented

### 1. Registration Form (`src/components/RegistrationForm.tsx`)
- Collects: Username, Full Name, Phone Number, Email
- Validation:
  - Username: Unique, min 3 characters
  - Phone: Maldives format (7XXXXXX or 9XXXXXX), no duplicates
  - Email: Valid format
  - Full Name: Required, min 2 characters
- Shows BEFORE game starts
- Generates unique Registration ID for each player

### 2. Admin Panel (`src/components/AdminPanel.tsx`)
- Password protected (default: MIRA2024)
- Features:
  - Real-time statistics dashboard
  - Export to CSV button
  - View recent registrations
  - Clear all data (with double confirmation)
- Accessible from bottom-right corner (🔐 Admin button)

### 3. Registration Utils (`src/utils/registrationUtils.ts`)
- Data storage in localStorage
- CSV export functionality
- Validation functions
- Score tracking
- Duplicate prevention

### 4. Score Tracking Integration
- When player defeats ARIM boss:
  - Score = Gold + (Level × 1000) + XP
  - Automatically marked as prize winner
  - Registration updated with final score

### 5. App Integration (`src/App.tsx`)
- Shows registration form on first visit
- Admin panel available on all screens
- Checks for existing registration

---

## 📁 Files Created

```
src/
├── components/
│   ├── RegistrationForm.tsx       [NEW - Player registration UI]
│   └── AdminPanel.tsx              [NEW - Admin dashboard]
└── utils/
    └── registrationUtils.ts        [NEW - Registration logic]

Docs:
└── EXPO_REGISTRATION_GUIDE.md     [NEW - Complete guide for expo staff]
```

---

## 📊 CSV Export Details

### File Location
Downloads to browser's **Downloads folder** (NOT dist folder - browser security restriction)

### Why Not Dist Folder?
- **Browser Security**: Web apps can't write to filesystem directly
- **Solution**: Browser download dialog saves to Downloads
- **After Download**: Staff can move CSV to any folder

### File Format
```csv
Registration ID,Username,Full Name,Phone Number,Email,Registration Time,Final Score,Won Prize
REG-TIMESTAMP-ID,username,Name,Phone,Email,ISO-Date,Score,YES/NO
```

### Opening the CSV
1. Downloads folder → `MIRA_Expo_Registrations_YYYY-MM-DD.csv`
2. Double-click → Opens in Excel
3. All columns auto-formatted
4. Ready to sort/filter

---

## 🎮 User Flow

```
1. Open Game
   ↓
2. Registration Form
   - Enter details
   - System validates
   - Saves to localStorage
   ↓
3. Play Game
   - Normal gameplay
   - Answer quiz questions
   - Battle enemies
   ↓
4. Defeat ARIM Boss (Optional)
   - Score calculated
   - Marked as WINNER
   - Prize eligible
   ↓
5. Admin Export CSV
   - Click Export button
   - CSV downloads
   - Open in Excel
   - Contact winners
```

---

## 🏆 Prize Distribution Workflow

### During Expo
1. Players self-register
2. Play game
3. Data auto-saved

### After Expo
1. Admin → Export CSV
2. Open in Excel
3. Filter: Won Prize = YES
4. Sort by Final Score (descending)
5. Contact via phone/email
6. Verify using Registration ID

---

## 🔒 Security Features

- Password-protected admin panel
- Local storage only (no cloud)
- No external data transmission
- Works 100% offline
- Manual CSV export (admin-controlled)
- Double confirmation for data deletion

---

## 📱 Expo Setup Steps

```bash
# 1. Build expo package
npm run build:expo

# 2. Create portable package
SETUP_EXPO.bat

# 3. Copy to USB
Copy expo-portable folder

# 4. At expo booth
Double-click START_GAME.bat

# 5. Players register & play

# 6. End of day
Admin Panel → Export CSV
```

---

## 🎯 Testing Checklist

### Before Expo
- [ ] Test registration form (all validations)
- [ ] Test duplicate prevention (username/phone)
- [ ] Play game and defeat ARIM
- [ ] Check score is recorded
- [ ] Export CSV and verify in Excel
- [ ] Test admin panel password
- [ ] Test clear data function
- [ ] Verify port 7766 works on expo laptop

### Sample Test Data
```
Username: testuser1
Name: Test Player One
Phone: 7123456
Email: test1@test.com

Username: testuser2
Name: Test Player Two
Phone: 9234567
Email: test2@test.com
```

---

## 🐛 Known Limitations

### CSV File Location
- **Can't** save directly to dist folder (browser security)
- **Must** download to Downloads folder first
- **Workaround**: Manually move CSV after download

### Data Persistence
- Stored in browser localStorage
- **Must** use same browser throughout expo
- **Don't** use Incognito/Private mode
- **Backup**: Export CSV periodically

### Storage Limits
- LocalStorage: ~5-10MB per domain
- Enough for ~1000+ registrations
- Export and clear if approaching limit

---

## 💡 Tips for Expo Staff

### Registration Issues
- **"Username taken"**: Player already registered
- **"Phone registered"**: One entry per person
- **Invalid phone**: Must be 7XXXXXX or 9XXXXXX

### Admin Panel
- **Password**: MIRA2024 (change before expo!)
- **Export often**: Backup data every hour
- **Check stats**: Monitor participation live

### Prize Distribution
- Use Registration ID for verification
- Sort by score to rank winners
- Contact using phone first, email backup

---

## 📞 Quick Commands

### Export CSV (Button Click)
```
Admin Panel → 📥 Export to Excel (CSV)
```

### View Stats (Console)
```javascript
// Press F12, then paste:
const data = JSON.parse(localStorage.getItem('expo_registrations'));
console.log('Total:', data.length);
console.log('Winners:', data.filter(r => r.wonPrize).length);
console.log('Avg Score:', data.reduce((s,r) => s + (r.finalScore||0), 0) / data.length);
```

### Emergency Backup (Console)
```javascript
// Press F12, then paste:
copy(localStorage.getItem('expo_registrations'));
// Paste into text file and save
```

---

## ✅ Success!

The registration system is now fully integrated and ready for the expo!

**Next Steps:**
1. Test the system at http://localhost:7766
2. Try registering a test player
3. Play and defeat ARIM
4. Export CSV from admin panel
5. Verify data in Excel

**For Full Details:** See `EXPO_REGISTRATION_GUIDE.md`
