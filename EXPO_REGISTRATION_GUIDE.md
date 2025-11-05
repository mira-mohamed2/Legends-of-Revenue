# MIRA Expo Registration & Prize System Guide

## 📋 Overview

The game now includes a complete registration and prize tracking system for the MIRA job expo. All player data is stored locally and can be exported to Excel.

---

## 🎮 Player Experience

### 1. Registration (First Time)
When a player opens the game, they see a registration form:

**Required Fields:**
- **Username**: Unique identifier (min 3 characters)
- **Full Name**: For prize distribution
- **Phone Number**: Maldives format (7XXXXXX or 9XXXXXX)
- **Email**: Contact email

**Validation:**
- No duplicate usernames
- No duplicate phone numbers (one entry per person)
- Valid email format
- Valid Maldives phone number

### 2. Playing the Game
- Player completes the registration
- Plays the game normally
- If they defeat ARIM boss → **Automatically marked as prize winner!**

### 3. Score Calculation (When ARIM Defeated)
```
Final Score = Gold + (Level × 1000) + XP
```

---

## 👨‍💼 Admin Panel Features

### Accessing Admin Panel

1. Click the **🔐 Admin** button (bottom-right corner of any screen)
2. Enter password: `MIRA2024` (change this before expo!)
3. Admin panel opens

### Statistics Dashboard

Shows real-time stats:
- **Total Players**: Number of registered players
- **Prize Winners**: Number of players who defeated ARIM
- **Average Score**: Average final score across all players

### Export to CSV

**Button:** 📥 Export to Excel (CSV)

**What it does:**
- Downloads a CSV file to your **Downloads folder**
- Filename: `MIRA_Expo_Registrations_YYYY-MM-DD.csv`
- Opens directly in Microsoft Excel

**CSV Contains:**
```
Registration ID, Username, Full Name, Phone Number, Email, Registration Time, Final Score, Won Prize
```

### Recent Registrations View

- Shows last 10 registrations
- Displays:
  - Full name and username
  - Phone and email
  - Final score (if game completed)
  - 🏆 WINNER badge (if ARIM defeated)
  - Registration timestamp

### Clear Data (Danger!)

**Button:** 🗑️ Clear All Data

- **WARNING**: Deletes ALL registrations
- Double confirmation required
- **EXPORT CSV FIRST** before using this!
- Use at end of expo day

---

## 📊 CSV File Details

### File Location
The CSV is downloaded to your browser's **Downloads** folder.

### File Format
```csv
Registration ID,Username,Full Name,Phone Number,Email,Registration Time,Final Score,Won Prize
REG-1730812345-ABC123,player1,Ahmed Mohamed,7123456,ahmed@email.com,2024-11-05T10:30:00Z,8500,YES
REG-1730812456-DEF456,player2,Fathimath Ali,9234567,fathimath@email.com,2024-11-05T10:35:00Z,3200,NO
```

### Opening in Excel

1. Locate file in Downloads folder
2. Double-click to open in Excel
3. Data is automatically formatted in columns
4. Use Excel's sort/filter features

### Filtering Winners

**In Excel:**
1. Click "Data" tab
2. Click "Filter"
3. Click dropdown on "Won Prize" column
4. Select "YES"
5. You now see only prize winners!

### Sorting by Score

**In Excel:**
1. Click any cell in "Final Score" column
2. Click "Data" → "Sort"
3. Choose "Sort Largest to Smallest"
4. Winners sorted by highest score first!

---

## 🏆 Prize Distribution Workflow

### During Expo

1. Players register and play
2. Data automatically saved locally
3. Admin can check live stats anytime

### End of Day

1. Open Admin Panel
2. Click **"Export to Excel (CSV)"**
3. File downloads to Downloads folder
4. Open in Excel

### After Expo

1. Sort by "Won Prize" column (YES = winners)
2. Sort by "Final Score" (highest first)
3. Contact winners using:
   - **Phone Number** (call/SMS)
   - **Email** (send confirmation)
4. Use **Registration ID** for verification

### Prize Verification

Each winner has a unique **Registration ID**:
```
Format: REG-TIMESTAMP-RANDOM
Example: REG-1730812345-ABC123
```

Ask winner for their Registration ID when claiming prize.

---

## 🔒 Security Notes

### Password Protection

**Default Password:** `MIRA2024`

**To Change:**
1. Open: `src/components/AdminPanel.tsx`
2. Find line: `const ADMIN_PASSWORD = 'MIRA2024';`
3. Change to your password
4. Rebuild: `npm run build:expo`

### Data Storage

- **LocalStorage**: All data stored in browser
- **No Cloud**: Works 100% offline
- **No External Access**: Data never leaves the laptop
- **Persistent**: Survives browser refresh
- **Portable**: Stays with the game folder

### Data Privacy

- Phone numbers and emails stored locally only
- CSV export is manual (admin-controlled)
- No automatic sending of data
- Delete data with "Clear All" after expo

---

## 📱 Expo Booth Setup

### Before Event

1. Run `SETUP_EXPO.bat` to create portable package
2. Copy `expo-portable` folder to USB drive
3. Transfer to expo laptop
4. **Change admin password** if needed
5. Test registration flow

### During Event

1. Start game: Double-click `START_GAME.bat`
2. Players register themselves
3. Monitor progress via Admin Panel
4. Export CSV periodically for backup

### After Event

1. Export final CSV
2. Save to secure location
3. Clear data from laptop (optional)
4. Process winners from CSV file

---

## 🐛 Troubleshooting

### CSV Not Downloading

**Cause**: Browser blocking downloads

**Solution**:
- Allow popups/downloads for localhost
- Check browser's Downloads folder
- Try different browser (Chrome recommended)

### Registration Not Saving

**Cause**: LocalStorage full (unlikely)

**Solution**:
- Export existing data
- Clear old data
- Browser allows 5-10MB storage

### Duplicate Registrations

**Prevention**: System blocks duplicate username/phone

**If it happens**:
- Use Excel to remove duplicates
- Filter by phone number
- Keep earliest registration

### Lost Data After Closing Browser

**Cause**: Different browser or incognito mode used

**Solution**:
- Always use same browser
- **Do NOT use Incognito/Private mode**
- Export CSV frequently as backup

---

## 📞 Support Commands

### View Raw Data
```javascript
// Open browser console (F12)
console.log(JSON.parse(localStorage.getItem('expo_registrations')))
```

### Manual Export
```javascript
// In browser console
const { exportToCSV } = require('./utils/registrationUtils');
exportToCSV();
```

### Count Registrations
```javascript
// In browser console
const data = JSON.parse(localStorage.getItem('expo_registrations'));
console.log('Total:', data.length);
console.log('Winners:', data.filter(r => r.wonPrize).length);
```

---

## ✅ Pre-Expo Checklist

- [ ] Change admin password
- [ ] Test full registration flow
- [ ] Test CSV export (verify Excel opens it)
- [ ] Prepare USB drive with portable package
- [ ] Test on actual expo laptop
- [ ] Print this guide for booth staff
- [ ] Prepare prize redemption form (with Registration ID field)
- [ ] Test player can defeat ARIM (or adjust difficulty)

---

## 🎯 Success Metrics

After expo, you'll have:

✅ Complete list of all participants
✅ Contact details (phone + email)
✅ Play statistics (scores, completion rate)
✅ Prize winners list
✅ Excel-compatible format for further analysis
✅ Unique IDs for prize verification

---

## 📄 Sample CSV Output

```csv
Registration ID,Username,Full Name,Phone Number,Email,Registration Time,Final Score,Won Prize
REG-1730812345-ABC123,ali_123,Ali Hassan,7123456,ali@email.mv,2024-11-05T09:30:00Z,12500,YES
REG-1730813456-DEF456,fathmath,Fathimath Ibrahim,9234567,fathi@email.mv,2024-11-05T09:45:00Z,N/A,NO
REG-1730814567-GHI789,ahmed99,Ahmed Mohamed,7345678,ahmed@email.mv,2024-11-05T10:00:00Z,8200,YES
REG-1730815678-JKL012,mariyam,Mariyam Ali,9456789,mari@email.mv,2024-11-05T10:15:00Z,N/A,NO
REG-1730816789-MNO345,hassan_x,Hassan Ibrahim,7567890,hassan@email.mv,2024-11-05T10:30:00Z,15300,YES
```

**Winner Count**: 3 out of 5 (60% completion rate)
**Average Score**: 12,000 points
**Contact**: Use phone/email columns

---

## 🎉 End of Guide

For technical support during expo, contact:
- Developer: [Your contact]
- Tech Support: [IT contact]

**Good luck with the expo! 🚀**
