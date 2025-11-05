# GitHub Pages Deployment Guide

## ✅ Changes Made for GitHub Pages Compatibility

### 1. **Vite Configuration** (`vite.config.ts`)
- Added `base: '/Legends-of-Revenue/'` for GitHub Pages URL structure
- Configured build output directory
- Disabled sourcemaps for production

### 2. **Avatar Upload Protection** (`src/components/AvatarSelector.tsx`)
- Reduced max file size from 2MB to 500KB
- Added LocalStorage quota checking
- Added error handling for storage overflow
- Added base64 size validation

### 3. **Package.json Updates**
- Added `deploy` script: `npm run build && gh-pages -d dist`
- Added `gh-pages` to devDependencies

### 4. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
- Auto-deploys on push to main branch
- Uses Node 22.x (matches your project)
- Builds and deploys to GitHub Pages automatically

### 5. **Storage Utilities** (`src/utils/storageUtils.ts`)
- Added storage quota management functions
- Safe localStorage operations
- Automatic cleanup when quota exceeded

### 6. **Public Assets**
- Added `.nojekyll` file to prevent Jekyll processing

---

## 🚀 Deployment Steps

### Method 1: Manual Deployment (Quick)

1. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Build and deploy:**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (root)
   - Save

4. **Your game will be live at:**
   ```
   https://mira-mohamed2.github.io/Legends-of-Revenue/
   ```

---

### Method 2: Automatic Deployment (Recommended)

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: **GitHub Actions** (select this option)
   - The workflow will automatically deploy on every push

3. **Monitor deployment:**
   - Go to Actions tab
   - Watch the "Deploy to GitHub Pages" workflow
   - Once complete (green checkmark), your site is live!

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- ✅ `vite.config.ts` has correct `base` path
- ✅ All images are in `public/images/` folder
- ✅ Avatar upload limit is 500KB
- ✅ No hardcoded localhost URLs
- ✅ Build succeeds locally: `npm run build`
- ✅ Preview works: `npm run preview`

---

## 🔧 Testing Locally Before Deployment

```bash
# Build the production version
npm run build

# Preview the production build
npm run preview
```

Then open: `http://localhost:4173/Legends-of-Revenue/`

**Important:** The `/Legends-of-Revenue/` path must work locally to work on GitHub Pages!

---

## ⚠️ Common Issues & Solutions

### Issue 1: Assets Not Loading (404 errors)

**Problem:** Images, CSS, or JS files return 404

**Solution:**
- Check that `base: '/Legends-of-Revenue/'` is in `vite.config.ts`
- All assets should be in `public/` folder
- Don't use absolute paths like `/images/...` in your code

### Issue 2: "Page Not Found" after deployment

**Problem:** GitHub Pages shows 404 page

**Solution:**
- Make sure GitHub Pages is enabled in repository settings
- Check that `gh-pages` branch exists
- Wait 2-3 minutes after deployment for DNS propagation

### Issue 3: Custom Avatar Upload Fails

**Problem:** "Storage quota exceeded" error

**Solution:**
- User's image is too large (> 500KB)
- Ask them to:
  1. Resize the image
  2. Use a default avatar instead
  3. Clear browser data

### Issue 4: Build Fails

**Problem:** `npm run build` shows TypeScript errors

**Solution:**
```bash
# Check for errors
npm run lint

# Fix and rebuild
npm run build
```

---

## 📊 GitHub Pages Limits

- **Bandwidth:** 100GB/month (soft limit)
- **Storage:** 1GB recommended
- **Build time:** 10 minutes max
- **File size:** 100MB per file

**Your game usage:**
- Estimated page load: ~2MB
- 500 expo visitors × 3 plays = 3GB bandwidth
- ✅ Well within limits!

---

## 🎯 For Job Expo Success

### Before the Expo:

1. **Deploy at least 24 hours early**
   - Test on mobile devices
   - Test on different browsers
   - Verify quiz questions work
   - Test ARIM boss fight

2. **Prepare backup plan:**
   - Keep laptop with local version running
   - Have QR code ready for site URL
   - Print site URL on handouts

3. **Monitor during expo:**
   - Keep GitHub Actions tab open
   - Check for any errors
   - Have GitHub mobile app ready

### At the Expo:

1. **Share the URL:**
   ```
   https://mira-mohamed2.github.io/Legends-of-Revenue/
   ```

2. **QR Code for easy access:**
   - Generate QR code pointing to your game
   - Print and display at booth

3. **Recommended browsers:**
   - ✅ Chrome (best compatibility)
   - ✅ Edge (good)
   - ✅ Firefox (good)
   - ⚠️ Safari (more strict storage limits)

---

## 🔄 Updating After Deployment

To update your game after it's live:

```bash
# Make changes to your code
# ...

# Commit and push
git add .
git commit -m "Update game feature"
git push origin main

# With GitHub Actions: Automatic deployment!
# OR manual: npm run deploy
```

Changes will be live in 2-5 minutes!

---

## 📞 Troubleshooting Commands

```bash
# Check if build works
npm run build

# Preview production build
npm run preview

# Check TypeScript errors
npm run lint

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

---

## ✅ Success Indicators

Your deployment is successful when:

1. ✅ GitHub Actions workflow shows green checkmark
2. ✅ Site loads at `https://mira-mohamed2.github.io/Legends-of-Revenue/`
3. ✅ All images and avatars display correctly
4. ✅ Quiz questions work
5. ✅ Combat system functions
6. ✅ LocalStorage saves/loads game data
7. ✅ Manual defense system works

---

## 🎮 Final Notes

- **No backend needed** - Everything runs in browser
- **Data saves locally** - Each player's progress is in their browser
- **No user database** - Username/password is local only
- **Perfect for expo** - Fast, reliable, free hosting
- **Easy updates** - Just push to GitHub!

**You're all set for the job expo! 🚀**
