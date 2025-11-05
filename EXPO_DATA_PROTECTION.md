# Expo Data Protection Strategy
## Zero Data Loss Without Manual Backups

### ✅ What's Already Working:
1. **Automatic localStorage saves** - Every action saves immediately
2. **Per-player character data** - Each player's progress isolated
3. **Registration data persistence** - All logins/sessions tracked
4. **Auto-backup on logout** - CSV exported when clicking "New Player"

---

## 🛡️ Protection Layers

### Layer 1: Browser Settings (MOST IMPORTANT)
**Setup Once Before Expo:**

1. **Use Chrome or Edge** (best localStorage support)
2. **Disable auto-clear settings:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Uncheck "Cookies and other site data"
   - Uncheck "Cached images and files"
   - Set "Time range" to "Last hour" (not "All time")
3. **Pin the tab** - Right-click tab → "Pin tab" (prevents accidental close)
4. **Bookmark the URL** - Bookmark http://localhost:7766 for quick access

### Layer 2: System Settings
1. **Disable browser auto-updates during expo**
   - Chrome: Settings → About Chrome → Turn off auto-update (temp)
2. **Disable computer sleep/hibernation**
   - Windows: Settings → Power → "Never" sleep when plugged in
3. **Keep computer plugged in** - Power outage protection

### Layer 3: Software Safeguards
1. **Don't clear browser data** during expo
2. **Don't use incognito/private mode**
3. **Don't switch browsers** mid-expo
4. **Don't close browser** between sessions (just minimize)

### Layer 4: Optional CSV Safety Net
**Current auto-backup triggers:**
- ✅ Every "New Player" button click
- ✅ Manual export from Admin Panel

**CSV files location:** Downloads folder
- File format: `MIRA_Expo_Backup_YYYY-MM-DD_HH-MM-SS.csv`
- Contains: Registration data + session stats
- Does NOT contain: Gold, items, inventory (by design)

---

## 📋 Expo Setup Checklist

### **Day Before Expo:**
- [ ] Open Chrome/Edge browser
- [ ] Navigate to http://localhost:7766
- [ ] Test login/registration (create dummy account)
- [ ] Verify data persists (close browser, reopen, login again)
- [ ] Delete dummy account (Admin Panel)
- [ ] Pin the tab
- [ ] Bookmark the URL
- [ ] Disable browser auto-clear settings
- [ ] Set computer to never sleep

### **During Expo:**
- [ ] Keep browser open (minimize, don't close)
- [ ] Don't clear browser data
- [ ] Don't restart computer (unless necessary)
- [ ] Monitor localStorage usage (Admin Panel shows player count)
- [ ] Optional: Export CSV every few hours (extra safety)

### **End of Day (Multi-day Expo):**
- [ ] Leave browser open OR
- [ ] Export CSV before closing
- [ ] Next day: Verify data still there before expo starts

### **End of Expo:**
- [ ] Export final CSV (Admin Panel)
- [ ] Verify CSV has all players
- [ ] Save CSV to multiple locations (USB, cloud)
- [ ] Only then clear data if needed

---

## 🔧 Additional Protection (Optional)

### Option 1: Browser Extension for Auto-Backup
Install a localStorage backup extension (search Chrome Web Store):
- "Local Storage Manager"
- "Storage Area Explorer"
These can auto-export localStorage periodically.

### Option 2: Keep Browser Open 24/7
- Leave the expo computer running
- Browser stays open with tab pinned
- No risk of data loss from closing
- Data persists indefinitely

### Option 3: Periodic Manual Exports
If you're paranoid (totally fine for expo!):
- Every 2-3 hours: Click Admin Panel → Export CSV
- Takes 5 seconds
- Gives you timestamped backups
- Peace of mind

---

## 🚨 Emergency Recovery

### "Oh no, browser crashed! Is data lost?"
**NO!** localStorage survives browser crashes.

**Steps:**
1. Reopen browser
2. Navigate to http://localhost:7766
3. All data should be there
4. If somehow not: Check Downloads folder for latest CSV backup

### "Computer restarted unexpectedly!"
**Data is safe** - localStorage persists across restarts.

**Steps:**
1. Restart computer
2. Open browser
3. Navigate to http://localhost:7766
4. Data intact

### "Someone cleared browser cache!"
**This is the ONLY real danger.**

**Prevention:**
- Make browser settings off-limits to others
- Put note on computer: "DO NOT CLEAR BROWSER DATA"
- Use latest CSV backup from Downloads folder
- Players may need to re-register (but CSV has their info)

---

## 💾 Storage Capacity

### localStorage Limits:
- **Chrome/Edge**: 10MB per domain
- **Your data usage**: ~50-100 bytes per player
- **Capacity**: Can store 100,000+ players (way more than needed)

### Estimate for Your Expo:
- 100 players = ~10 KB
- 500 players = ~50 KB
- 1000 players = ~100 KB
- **No risk of running out of space**

---

## 🎯 Recommended Setup for Zero Data Loss

### **Simplest Approach (Recommended):**
1. Use Chrome browser
2. Pin tab with http://localhost:7766
3. Disable auto-clear browsing data
4. Keep browser open entire expo
5. Let auto-backup handle CSV exports

### **Paranoid Approach (Maximum Safety):**
1. Everything from Simplest Approach +
2. Export CSV every 2 hours (manual)
3. Save CSV to USB drive immediately
4. Keep 2 USB drives (redundancy)
5. Test restore before expo (verify CSV can be read)

### **Minimal Approach (Not Recommended):**
1. Just run the app
2. Hope for the best
3. Risk data loss if something goes wrong

**We recommend: Simplest Approach**

---

## ✨ Bottom Line

**Your current setup is perfect for local expo:**
- ✅ Automatic saves (no manual intervention)
- ✅ Real-time persistence
- ✅ Zero file management
- ✅ Auto CSV backups on player switch
- ✅ Can handle thousands of players

**Just follow these 3 rules:**
1. **Don't clear browser data** during expo
2. **Keep browser open** (or export CSV before closing)
3. **Use same browser** throughout expo

**That's it!** No manual backups needed for seamless operation.
