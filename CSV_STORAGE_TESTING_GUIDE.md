# CSV Storage Testing Guide

## Pre-Testing Setup

1. **Ensure build is successful**:
   ```powershell
   npm run build:expo
   ```

2. **Verify CSV file exists**:
   ```powershell
   ls dist/expo_data.csv
   ```
   Should show the file with headers only.

3. **Start the development server**:
   ```powershell
   npm run serve:expo
   # OR
   .\START_EXPO_GAME.bat
   ```

4. **Open browser** (Chrome or Edge recommended):
   - Navigate to `http://localhost:5000` (or whatever port is shown)
   - Open DevTools (F12)
   - Go to Console tab to see logs

## Test Cases

### Test 1: Initial Load (Empty CSV)

**Steps**:
1. Ensure `/dist/expo_data.csv` has headers only (no player data)
2. Refresh the app
3. Check console logs

**Expected Results**:
- ✅ "Loading expo data..." screen appears briefly
- ✅ Console shows: `Loaded 0 players from CSV`
- ✅ Login/Register form appears
- ✅ No errors in console

**If Fails**:
- Check `/dist/expo_data.csv` exists
- Check file has correct headers
- Check network tab for 404 errors

---

### Test 2: New Player Registration

**Steps**:
1. Click "Register" tab
2. Fill in all fields:
   - Full Name: `Test Player`
   - Phone: `+1234567890`
   - Email: `test@example.com`
   - Username: `testuser`
3. Click "Register"

**Expected Results**:
- ✅ Registration successful
- ✅ Game loads with character selection
- ✅ Console shows: `Player added: testuser`
- ✅ No errors

**If Fails**:
- Check validation errors
- Check console for errors
- Verify all fields filled

---

### Test 3: Character Creation

**Steps**:
1. After registration, choose character class (e.g., Warrior)
2. Click "Start Your Journey"
3. Check character stats

**Expected Results**:
- ✅ Character created with default stats
- ✅ Gold: 1000
- ✅ Level: 1
- ✅ Health: 100
- ✅ Location: Elaria

**If Fails**:
- Check character data in playerStore
- Check console for errors

---

### Test 4: Gameplay (Combat Session)

**Steps**:
1. Navigate to Map
2. Choose Elaria (Starting Village)
3. Click "Enter Combat"
4. Play through one combat
5. Win the combat

**Expected Results**:
- ✅ Combat works normally
- ✅ Gold increases after victory
- ✅ XP increases
- ✅ Items may be looted
- ✅ Console shows: `🏆 Combat victory...`

**If Fails**:
- Check combat system errors
- Check inventory updates
- Check gold/XP calculations

---

### Test 5: Logout and Save CSV

**Steps**:
1. Click "New Player" or logout button
2. If prompted, choose save location

**Expected Results**:
- ✅ **Chrome/Edge**: File picker dialog appears
  - Navigate to `/dist` folder
  - Save as `expo_data.csv`
  - Dialog shows "Save" confirmation
- ✅ **Firefox/Safari**: File downloads to Downloads folder
- ✅ Console shows: `CSV saved successfully` or `CSV download started`
- ✅ No errors

**If Fails**:
- Check browser console for File System Access API errors
- Check browser compatibility
- Try fallback download method

---

### Test 6: Verify CSV File

**Steps**:
1. Open `/dist/expo_data.csv` in text editor (NOT Excel yet)
2. Check file contents

**Expected Results**:
```csv
Registration ID,Username,Full Name,Phone Number,Email,Registration Time,Last Played,Games Played,Highest Score,Total Score,Won Prize,Character Data (JSON)
EXPO-1234567890,testuser,Test Player,+1234567890,test@example.com,2024-01-16T12:00:00.000Z,2024-01-16T12:05:00.000Z,1,1050,1050,false,"{\"stats\":{\"level\":1,\"xp\":50,\"gold\":1050,...},\"equipment\":{...},\"inventory\":[...]}"
```

- ✅ Headers present
- ✅ One data row
- ✅ All 12 columns filled
- ✅ Character data is valid JSON (column 11)
- ✅ No syntax errors

**If Fails**:
- Check CSV file location
- Check if save actually happened
- Check if file is corrupted

---

### Test 7: CSV Load on Restart

**Steps**:
1. Ensure CSV file saved from Test 5
2. Refresh the app (F5)
3. Check console logs

**Expected Results**:
- ✅ "Loading expo data..." screen appears
- ✅ Console shows: `Loaded 1 players from CSV`
- ✅ Login form appears
- ✅ No errors

**If Fails**:
- Check CSV file in `/dist` folder
- Check file format (valid CSV)
- Check character data JSON is valid

---

### Test 8: Login with Existing Player

**Steps**:
1. After CSV loads, go to "Login" tab
2. Enter:
   - Username: `testuser`
   - Phone: `+1234567890`
3. Click "Login"

**Expected Results**:
- ✅ Login successful
- ✅ Character data restored:
  - Gold matches previous session
  - Level matches
  - XP matches
  - Inventory matches
- ✅ Console shows: `Character data restored for testuser`
- ✅ No errors

**If Fails**:
- Check login credentials
- Check CSV character data field
- Check character data parsing

---

### Test 9: Character Data Persistence

**Steps**:
1. Login as `testuser`
2. Note current gold (e.g., 1050)
3. Play another combat session
4. Win combat (gold increases, e.g., to 1200)
5. Logout (save CSV)
6. Refresh app
7. Login again

**Expected Results**:
- ✅ Gold is 1200 (new amount, not 1050)
- ✅ All changes persisted:
  - Level changes
  - XP changes
  - Inventory changes
  - Equipment changes
- ✅ No data loss

**If Fails**:
- Check if CSV was saved after logout
- Check character data update function
- Check CSV file has latest data

---

### Test 10: Multiple Players

**Steps**:
1. Logout current player
2. Register 2nd player: `testuser2`
3. Play combat, logout
4. Register 3rd player: `testuser3`
5. Play combat, logout
6. Check CSV file

**Expected Results**:
- ✅ CSV has 3 data rows (plus header)
- ✅ All 3 players in CSV
- ✅ Each has unique registration ID
- ✅ Each has character data

**If Fails**:
- Check CSV save includes all players
- Check playerDatabase array
- Check generateCSVContent function

---

### Test 11: Admin Panel Statistics

**Steps**:
1. Click "🔐 Admin" button (bottom-right)
2. Enter password: `MIRA2024`
3. Check statistics

**Expected Results**:
- ✅ Total Players: 3
- ✅ Prize Winners: 0 (or 1 if ARIM defeated)
- ✅ Games Played: 3+ (total sessions)
- ✅ Highest Score: (highest among all players)
- ✅ Recent registrations list shows all 3 players

**If Fails**:
- Check getStatistics function
- Check getAllPlayers function
- Check playerDatabase population

---

### Test 12: Admin CSV Export

**Steps**:
1. In Admin Panel, click "📥 Save to CSV File"
2. Choose save location

**Expected Results**:
- ✅ File picker appears (Chrome/Edge) or file downloads
- ✅ Can save to any location
- ✅ CSV file exported successfully
- ✅ Alert shows: "✅ CSV file saved successfully!"

**If Fails**:
- Check saveCSVData function
- Check browser console
- Check file system permissions

---

### Test 13: Admin Clear Data

**Steps**:
1. In Admin Panel, click "🗑️ Clear All Data"
2. Confirm the dialog

**Expected Results**:
- ✅ Confirmation dialog appears
- ✅ After confirm: Alert shows "✅ All data cleared successfully!"
- ✅ Admin panel closes
- ✅ Refresh app → CSV loads as empty (headers only)
- ✅ No players in system

**If Fails**:
- Check clearAllData function
- Check playerDatabase reset
- Check CSV save after clear

---

### Test 14: CSV File in Excel

**Steps**:
1. Open `/dist/expo_data.csv` in Microsoft Excel or Google Sheets
2. Check data formatting

**Expected Results**:
- ✅ All columns visible
- ✅ Headers in row 1
- ✅ Player data in rows 2+
- ✅ Character data column shows JSON (may be truncated in view)
- ✅ Can sort/filter by columns
- ✅ No formatting errors

**If Fails**:
- Excel may have encoding issues (UTF-8)
- Character data JSON may be too long (normal)
- Try Google Sheets instead

---

### Test 15: Large Dataset (100+ Players)

**Steps**:
1. Create test script to generate 100 players:
   ```javascript
   for (let i = 0; i < 100; i++) {
     const player = {
       registrationId: `EXPO-${Date.now()}-${i}`,
       username: `player${i}`,
       fullName: `Test Player ${i}`,
       phoneNumber: `+123456${i.toString().padStart(4, '0')}`,
       email: `player${i}@test.com`,
       timestamp: new Date().toISOString(),
       wonPrize: i % 10 === 0, // Every 10th player wins
     };
     addPlayer(player);
   }
   await saveCSVData();
   ```
2. Run script in console
3. Refresh app

**Expected Results**:
- ✅ CSV loads all 100 players
- ✅ Load time: <100ms
- ✅ Admin panel shows 100 players
- ✅ Can login as any player
- ✅ No performance issues

**If Fails**:
- Check load performance in console
- Check CSV file size (~100KB)
- Check browser memory usage

---

## Performance Benchmarks

Test with different player counts:

| Players | CSV Load Time | CSV Save Time | File Size |
|---------|---------------|---------------|-----------|
| 10      | <10ms         | <50ms         | ~10KB     |
| 50      | <25ms         | <100ms        | ~50KB     |
| 100     | <50ms         | <200ms        | ~100KB    |
| 500     | <200ms        | <500ms        | ~500KB    |

## Browser Compatibility Testing

Test on each browser:

### Chrome
- [ ] CSV load works
- [ ] CSV save uses File System Access API
- [ ] File picker dialog appears
- [ ] Can save to /dist folder
- [ ] No errors

### Edge
- [ ] CSV load works
- [ ] CSV save uses File System Access API
- [ ] File picker dialog appears
- [ ] Can save to /dist folder
- [ ] No errors

### Firefox
- [ ] CSV load works
- [ ] CSV save falls back to download
- [ ] File downloads to Downloads folder
- [ ] Manual move to /dist works
- [ ] App loads moved CSV correctly

### Safari
- [ ] CSV load works
- [ ] CSV save falls back to download
- [ ] File downloads correctly
- [ ] Manual move to /dist works
- [ ] App loads moved CSV correctly

## Common Issues and Solutions

### Issue: "CSV file not found"
**Solution**: 
- Check `/dist/expo_data.csv` exists
- Check file permissions
- Check file path in code

### Issue: "Failed to parse CSV"
**Solution**:
- Open CSV in text editor
- Check for syntax errors
- Verify 12 columns
- Check character data JSON is valid (no line breaks)

### Issue: "Character data not restored"
**Solution**:
- Check CSV column 11 has JSON
- Check JSON is valid (use JSONLint.com)
- Check character data structure matches interface
- Check console for parsing errors

### Issue: "CSV save dialog doesn't appear"
**Solution**:
- Browser doesn't support File System Access API
- File should download to Downloads folder
- Move file to /dist manually
- Refresh app

### Issue: "Data lost after refresh"
**Solution**:
- CSV file not in /dist folder
- CSV file renamed
- CSV file corrupted
- Restore from backup

## Test Report Template

```
Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

Test Results:
[ ] Test 1: Initial Load
[ ] Test 2: New Player Registration
[ ] Test 3: Character Creation
[ ] Test 4: Gameplay (Combat)
[ ] Test 5: Logout and Save CSV
[ ] Test 6: Verify CSV File
[ ] Test 7: CSV Load on Restart
[ ] Test 8: Login with Existing Player
[ ] Test 9: Character Data Persistence
[ ] Test 10: Multiple Players
[ ] Test 11: Admin Panel Statistics
[ ] Test 12: Admin CSV Export
[ ] Test 13: Admin Clear Data
[ ] Test 14: CSV File in Excel
[ ] Test 15: Large Dataset (100+ players)

Issues Found:
_________________________________
_________________________________

Notes:
_________________________________
_________________________________

Overall Status: [ ] PASS  [ ] FAIL
```

---

## Next Steps After Testing

1. **If all tests pass**:
   - ✅ System ready for production
   - Brief expo staff on CSV workflow
   - Set up backup strategy
   - Deploy to expo machines

2. **If tests fail**:
   - Document failures
   - Check console errors
   - Review code changes
   - Fix bugs and re-test

3. **Before expo event**:
   - Run full test suite on expo machines
   - Verify network setup
   - Test with expo staff
   - Create backup plan

---

**Last Updated**: 2024-01-16  
**Version**: 1.0
