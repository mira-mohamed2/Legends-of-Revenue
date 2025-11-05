# EXPO STAFF QUICK GUIDE - Login/Registration System

## 🎯 What Changed?

### OLD WAY (Before):
- Players only registered once
- No way to return and continue playing
- Only tracked final score (when defeating ARIM)

### NEW WAY (Now):
- Players can **LOGIN** if they played before
- Players **REGISTER** if first time
- Tracks **every game session** (not just ARIM victories)
- Records: games played, highest score, total score, last played

---

## 📱 For Expo Visitors

### **First-Time Players**
1. App opens → Shows Login/Register screen
2. Click **"Register"** tab (green button)
3. Fill in form:
   - **Username**: Unique name (minimum 3 characters)
   - **Full Name**: Real name for prize distribution
   - **Phone Number**: 7XXXXXX or 9XXXXXX format (Maldives)
   - **Email**: Valid email address
4. Click **"Register"** → Success!
5. Now can play the game

### **Returning Players**
1. App opens → Shows Login/Register screen
2. **"Login"** tab is already selected (purple button)
3. Enter:
   - **Username**: Same username from registration
   - **Phone Number**: Same phone from registration
4. Click **"Login"** → Welcome back!
5. Continue playing (stats saved)

### **Error Messages (Common)**

**"This username is already taken"**
→ Someone else has that username. Try a different one.

**"This phone number is already registered to username: 'X'"**
→ You already registered! Use username 'X' to login.

**"Invalid phone number format"**
→ Use 7XXXXXX or 9XXXXXX (7 digits starting with 7 or 9).

**"Account not found"**
→ Username or phone number is wrong. Check spelling or register new account.

---

## 🎮 Playing the Game

### Session Tracking:
- **Every combat victory** counts as a session
- Stats updated automatically:
  - Games played += 1
  - Score calculated and recorded
  - Highest score tracked
  - Last played timestamp updated

### Defeating ARIM (Final Boss):
- **Prize Flag**: Marked as prize winner
- **High Score**: Final score = Gold + (Level × 1000) + XP
- **Winner Status**: Shows 🏆 in Admin Panel

### Score Calculation:
```
ARIM Victory:
  Score = Gold + (Level × 1000) + XP
  Example: 500 gold + (5 × 1000) + 200 XP = 5,700 points

Regular Combat:
  Score = Gold + (Level × 100) + (XP / 10)
  Example: 500 gold + (5 × 100) + (200 / 10) = 1,020 points
```

---

## 🔄 Switching Players

### When Someone Finishes:
1. They click **"New Player"** button (top-right corner)
2. Confirmation message appears:
   ```
   Start a new game? This will:
   
   ✅ Save your current score to CSV
   ✅ Allow new player to register or login
   
   Continue?
   ```
3. Click **OK**
4. CSV file auto-downloads (check Downloads folder)
5. App resets → Next person can login or register

### Auto-Backup Feature:
- **Silent CSV Download**: Happens automatically when clicking "New Player"
- **No Alerts**: Smooth experience for users
- **Filename**: `MIRA_Expo_Backup_YYYY-MM-DD_HH-MM-SS.csv`
- **Location**: Downloads folder (or user-chosen location in Chrome/Edge)

---

## 🔐 Admin Panel (For Staff Only)

### Access:
1. Click **"🔐 Admin"** button (bottom-right of screen)
2. Enter password: **`MIRA2024`**
3. Admin panel opens

### Statistics Displayed:
- **Total Players**: Number of registered players
- **Prize Winners**: How many defeated ARIM (🏆 winners)
- **Games Played**: Total combat sessions across all players
- **Highest Score**: Best score achieved by any player

### Player List:
- Shows last 10 registrations (newest first)
- For each player:
  - Name, username, phone, email
  - **Best Score** (green): Their highest score
  - **Games** (blue): How many times they played
  - **Last Played** (purple): Most recent game date
  - **🏆 WINNER** badge if they defeated ARIM

### Actions:

**📥 Export CSV**
- Click **"📥 Export CSV"** button
- **Chrome/Edge**: Choose where to save (USB recommended)
- **Other Browsers**: Auto-downloads to Downloads folder
- CSV contains all player data + session statistics

**🗑️ Clear All Data** (Use with caution!)
- Click **"🗑️ Clear All Data"** button
- **First Warning**: "This will delete ALL registrations!"
- Click OK
- **Second Warning**: "This action cannot be undone! Export CSV first if needed."
- Click OK again → All data deleted
- **IMPORTANT**: Export CSV before clearing!

**Close Admin Panel**
- Click **"Close"** button at bottom
- Panel closes, password required next time

---

## 💾 Data Management

### CSV Files:

**Where Are They Saved?**
- **Default**: Downloads folder
- **Chrome/Edge**: Can choose location (e.g., USB drive)
- **Filename**: `MIRA_Expo_Registrations_YYYY-MM-DD.csv` (manual export)
- **Auto-backup**: `MIRA_Expo_Backup_YYYY-MM-DD_HH-MM-SS.csv`

**What's in the CSV?**
```csv
Registration ID,Username,Full Name,Phone Number,Email,Registration Time,Last Played,Games Played,Highest Score,Total Score,Won Prize
```

**Example Data:**
```csv
REG-1234567890-ABC,john123,John Doe,7123456,john@example.com,12/19/2024 2:30 PM,12/19/2024 3:45 PM,5,1250,3420,YES
```

### Best Practices:

**During Expo:**
- Export CSV every 2-3 hours (backup)
- Save to USB drive (portable)
- Don't clear data until expo ends!

**End of Day:**
- Export CSV (final backup)
- Save to multiple locations (USB + cloud)
- Clear data only after confirming CSV is safe

**Multi-Day Event:**
- Keep data between days (players can return)
- Daily CSV backups recommended
- Clear data only at end of entire event

---

## 🚨 Troubleshooting

### **Player Can't Login**
**Symptoms**: "Account not found" error
**Solutions**:
1. Check username spelling (case doesn't matter)
2. Check phone number (no spaces, 7 digits)
3. Verify they registered before (check Admin Panel)
4. If wrong username, error message will show correct one

### **Duplicate Phone Number**
**Symptoms**: "This phone is already registered to username: 'X'"
**Solutions**:
1. They already registered! Tell them to use username 'X' to login
2. If they forgot username, check Admin Panel player list
3. If they want new account, use different phone number

### **CSV Not Downloading**
**Symptoms**: Click "Export CSV" but nothing happens
**Solutions**:
1. Check browser's download settings (must allow downloads)
2. Check Downloads folder (might be there already)
3. Try different browser (Chrome recommended)
4. Check disk space (ensure enough free space)

### **Data Disappeared**
**Symptoms**: All players gone after reopening browser
**Possible Causes**:
1. Browser history/cache cleared (deletes LocalStorage)
2. Incognito/Private mode used (doesn't save data)
3. Different browser opened (data is per-browser)
**Prevention**: Regular CSV backups! Always export before closing.

### **Wrong Score Displayed**
**Symptoms**: Score doesn't match what player expected
**Explanation**:
- **ARIM Victory**: Gold + (Level × 1000) + XP
- **Regular Combat**: Gold + (Level × 100) + (XP / 10)
- Only ARIM victory gives prize eligibility
- All combat victories count toward "Games Played"

---

## 📋 Daily Checklist

### **Before Expo Opens:**
- [ ] Open app on expo computer
- [ ] Test login/registration (dummy account)
- [ ] Verify Admin Panel access (password: MIRA2024)
- [ ] Clear dummy data
- [ ] Ensure Downloads folder has space

### **During Expo:**
- [ ] Help visitors register/login
- [ ] Monitor player count in Admin Panel
- [ ] Export CSV every 2-3 hours (backup)
- [ ] Save backups to USB drive

### **End of Day:**
- [ ] Export final CSV
- [ ] Save to USB + cloud storage
- [ ] Note highest score/winner count
- [ ] **Keep data** if multi-day event
- [ ] **Clear data** only if last day

### **Multi-Day Event:**
- [ ] Leave data intact overnight
- [ ] Morning: Verify data still there
- [ ] Players can return and login
- [ ] Daily CSV backups continue

---

## 🎁 Prize Distribution

### Finding Winners:
1. Open Admin Panel (password: MIRA2024)
2. Look for **🏆 WINNER** badges in player list
3. Or export CSV, filter by "Won Prize = YES"

### Winner Information:
- **Full Name**: For ID verification
- **Phone Number**: Contact information
- **Email**: Alternate contact
- **Highest Score**: For tiebreakers (if multiple winners)
- **Registration Time**: First participation timestamp

### Verifying Winners:
1. Ask for phone number
2. Admin Panel → Search for phone in list
3. Check for 🏆 WINNER badge
4. Verify name matches ID
5. Mark as claimed (manual process, not in app)

---

## 💡 Pro Tips

### **For Smooth Operation:**
- Keep Admin Panel password visible (sticky note on monitor)
- Have USB drive ready for CSV exports
- Test login/register before expo starts
- Bookmark http://localhost:7766/ for quick access
- Keep phone charger nearby (for staff phone lookups)

### **For Helping Visitors:**
- Explain username can be anything (but unique)
- Remind them to remember username (for returning)
- Phone number must be real (for prize claims)
- Email optional but recommended
- Case doesn't matter for username login

### **For Data Safety:**
- Export CSV frequently (can't be stressed enough!)
- Save to multiple locations (USB + cloud)
- Don't clear data until event completely ends
- Test data persistence (close/reopen browser)
- Keep at least 2 backup copies

---

## 🆘 Emergency Contacts

### **Technical Issues:**
- Browser crashes: Reopen, data should persist
- Can't access Admin Panel: Check password (MIRA2024)
- CSV not downloading: Try Chrome browser
- Data lost: Restore from latest CSV backup (manual re-entry required)

### **Data Recovery:**
- **No Auto-Import**: CSV cannot be re-imported automatically
- **Manual Process**: Read CSV, manually re-register players
- **Prevention**: Regular CSV backups prevent need for recovery
- **Future Feature**: CSV import planned for next version

---

## 📞 Support Information

### **App Details:**
- **Port**: 7766
- **URL**: http://localhost:7766/
- **Admin Password**: MIRA2024
- **CSV Location**: Downloads folder (default)

### **Technical Specs:**
- React + TypeScript application
- LocalStorage for data (5-10MB limit)
- CSV export for backups
- Chrome/Edge recommended (Firefox/Safari work but limited CSV features)

### **File Locations:**
- **App Folder**: D:\DevProjects\
- **Build Output**: D:\DevProjects\dist\
- **CSV Backups**: User's Downloads folder
- **Server Script**: D:\DevProjects\serve-portable.js

---

**Last Updated**: December 19, 2024
**Version**: 1.0 - Login/Registration System
**Status**: ✅ Ready for Expo

---

## 🎯 Quick Reference Card (Print This!)

```
╔══════════════════════════════════════════════════════╗
║     EXPO STAFF QUICK REFERENCE - MIRA 2024          ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  📱 VISITOR HELP:                                    ║
║  • First time? → Click "Register" tab               ║
║  • Returning? → Enter username + phone (Login tab)  ║
║  • Phone format: 7XXXXXX or 9XXXXXX (7 digits)      ║
║                                                      ║
║  🔐 ADMIN ACCESS:                                    ║
║  • Click "🔐 Admin" button (bottom-right)           ║
║  • Password: MIRA2024                               ║
║                                                      ║
║  💾 DATA BACKUP:                                     ║
║  • Export CSV every 2-3 hours                       ║
║  • Save to USB drive                                ║
║  • DON'T clear data until expo ends!                ║
║                                                      ║
║  🏆 PRIZE WINNERS:                                   ║
║  • Look for 🏆 WINNER badge in Admin Panel          ║
║  • Verify phone number + name                       ║
║  • Check CSV for full list                          ║
║                                                      ║
║  🚨 EMERGENCY:                                       ║
║  • Data lost? → Use latest CSV backup               ║
║  • App not loading? → Restart browser               ║
║  • CSV not saving? → Try Chrome browser             ║
║                                                      ║
║  ⚙️ SETTINGS:                                        ║
║  • URL: http://localhost:7766/                      ║
║  • Port: 7766                                       ║
║  • Browser: Chrome recommended                      ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

**Remember**: Export CSV often, keep backups safe, and help visitors have fun! 🎮🏆
