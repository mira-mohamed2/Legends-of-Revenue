# 🎮 MIRA Legends of Revenue - Expo Deployment Guide

## 📋 Overview

This guide explains how to set up the game for:
1. **Local Expo Booth** - Offline, one-click launch
2. **Online Version** - GitHub Pages hosting

---

## 🎯 Quick Setup for Expo (For You - Developer)

### One Command Setup:

```bash
# Windows
SETUP_EXPO.bat

# This will:
# 1. Install dependencies
# 2. Build local version
# 3. Create portable 'expo-portable' folder
# 4. Generate launcher and instructions
```

### Manual Setup:

```bash
# 1. Build local version
npm run build:expo

# 2. Copy 'dist' folder to USB drive
# 3. Copy START_PORTABLE.bat to USB drive
# 4. Give to expo team
```

---

## 👥 For Expo/Marketing Team (Simple Instructions)

### 🚀 How to Start the Game at Expo Booth:

**Option 1: Using Project Folder**
1. Double-click `START_EXPO_GAME.bat`
2. Wait for browser to open (10-15 seconds)
3. Game is ready!

**Option 2: Using Portable Package**
1. Open the `expo-portable` folder
2. Double-click `START_GAME.bat`
3. Game opens in browser automatically

**To Stop:**
- Close the browser
- Press `Ctrl+C` in the command window
- Close the command window

### ✅ Requirements:
- Windows 10/11 laptop
- Python (usually pre-installed)
- Web browser (Chrome, Edge, Firefox)
- **NO INTERNET REQUIRED**

---

## 🌐 Online Version (GitHub Pages)

### For Visitors to Play at Home:

**URL:** https://mira-mohamed2.github.io/Legends-of-Revenue/

**QR Code:** [Generate at https://www.qr-code-generator.com/]

### Deploy Online Version:

```bash
# Deploy to GitHub Pages
npm run deploy

# Or use automatic deployment (GitHub Actions)
git add .
git commit -m "Update game"
git push origin main
# Automatically deploys in 2-3 minutes
```

---

## 🔧 Troubleshooting

### Problem: "Python is not recognized"

**Solution:**
1. Install Python: https://www.python.org/downloads/
2. During installation, check ✅ "Add Python to PATH"
3. Restart computer
4. Try again

### Problem: Browser doesn't open automatically

**Solution:**
1. Look for "Game will open at: http://localhost:XXXX" in the command window
2. Copy that URL
3. Open any browser manually
4. Paste the URL

### Problem: Game shows broken images or white screen

**Solution:**
1. Make sure you're running the correct .bat file
2. For portable version, .bat must be INSIDE the 'dist' folder
3. Don't move files out of the dist folder
4. Clear browser cache (Ctrl+Shift+Delete)

### Problem: "Port already in use"

**Solution:**
1. Another server is running
2. Close all command windows
3. Restart computer
4. Try again

---

## 📦 What's in the Expo Package?

```
expo-portable/
├── START_GAME.bat          ← Double-click this!
├── README.txt              ← Quick instructions
└── game/                   ← All game files
    ├── index.html
    ├── assets/
    │   ├── images/
    │   └── ...
    └── ...
```

---

## 🎯 Best Practices for Expo

### Before the Expo:

1. **Test the portable version:**
   ```bash
   npm run build:expo
   npm run preview:expo
   ```

2. **Test on the actual expo laptop:**
   - Copy expo-portable folder
   - Run START_GAME.bat
   - Verify everything works

3. **Create backup:**
   - Copy expo-portable to multiple USB drives
   - Have online version as fallback

### At the Expo:

1. **Start game before visitors arrive**
   - Leave it running in kiosk mode
   - Refresh if needed (F5)

2. **Have online URL ready**
   - For visitors who want to play at home
   - Create QR code for easy scanning

3. **Quick restart if needed:**
   - Ctrl+C to stop
   - Double-click START_GAME.bat again
   - Takes 5-10 seconds

---

## 📊 Comparison: Local vs Online

| Feature | Local (Expo) | Online (GitHub Pages) |
|---------|-------------|---------------------|
| **Internet** | ❌ Not required | ✅ Required |
| **Speed** | ⚡ Instant load | ⚡ Fast (CDN) |
| **Reliability** | ✅ Always works | ⚠️ Depends on internet |
| **Updates** | Manual rebuild | Auto-deploy |
| **Best for** | Expo booth | Visitors at home |
| **Setup** | One-click | Just share URL |

---

## 🚀 Developer Commands Reference

```bash
# Development
npm run dev                  # Start dev server (localhost:5173)

# Building
npm run build                # Build for GitHub Pages
npm run build:expo           # Build for local/expo use

# Testing
npm run preview              # Preview GitHub Pages build
npm run preview:expo         # Preview expo build

# Deployment
npm run deploy               # Deploy to GitHub Pages
SETUP_EXPO.bat              # Create expo package

# Expo Setup
START_EXPO_GAME.bat         # Launch game (needs Node.js)
START_PORTABLE.bat          # Launch portable version (Python)
```

---

## 📞 Support Contacts

**Developer:** [Your name/email]
**IT Support:** [IT contact]
**Expo Coordinator:** [Expo contact]

---

## ✅ Pre-Expo Checklist

**One Day Before:**
- [ ] Run `SETUP_EXPO.bat`
- [ ] Test expo-portable package
- [ ] Deploy online version (`npm run deploy`)
- [ ] Test online version in browser
- [ ] Create QR code for online version
- [ ] Copy expo-portable to 2-3 USB drives
- [ ] Test on actual expo laptop

**On Expo Day:**
- [ ] Start game before booth opens
- [ ] Test that both male/female avatars load
- [ ] Test combat and quiz questions
- [ ] Test manual defense system
- [ ] Verify ARIM boss fight works
- [ ] Have backup USB drives ready
- [ ] Have online URL and QR code printed

---

## 🎉 You're All Set!

The game is now ready for both:
- ✅ **Offline expo booth** (expo-portable folder)
- ✅ **Online sharing** (GitHub Pages)

Good luck at the expo! 🚀
