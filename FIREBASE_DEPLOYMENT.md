# 🔥 Firebase Deployment Guide - Legends of Revenue

## Prerequisites

1. **Install Firebase CLI** (if not already installed):
```powershell
npm install -g firebase-tools
```

2. **Login to Firebase**:
```powershell
firebase login
```

## Initial Setup (First Time Only)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter project name: `legends-of-revenue` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create Project"

### Step 2: Initialize Firebase in Your Project

```powershell
cd D:/DevProjects
firebase init hosting
```

When prompted:
- **Select Firebase project**: Choose "legends-of-revenue" (or create new)
- **Public directory**: Enter `dist`
- **Configure as single-page app**: YES
- **Set up automatic builds with GitHub**: NO (optional)
- **Overwrite index.html**: NO

## Deployment Commands

### Build & Deploy (Every Time)

```powershell
# 1. Build the production version
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting
```

### Preview Before Deploy (Optional)

```powershell
# Test locally before deploying
firebase serve
```

## Quick Deploy Script

Create a deploy script by running:

```powershell
npm run build && firebase deploy --only hosting
```

## Deployment Checklist

✅ **Before Deploying:**
- [ ] Test the app locally (`npm run dev`)
- [ ] Build successfully (`npm run build`)
- [ ] Check `dist` folder exists
- [ ] Review changes in git
- [ ] Update version number (optional)

✅ **After Deploying:**
- [ ] Visit the Firebase Hosting URL
- [ ] Test all major features
- [ ] Check mobile responsiveness
- [ ] Verify data persistence (localStorage)
- [ ] Test combat system
- [ ] Verify enemy codex

## Firebase Hosting URLs

After deployment, your app will be available at:
- **Production**: `https://legends-of-revenue.web.app`
- **Alternative**: `https://legends-of-revenue.firebaseapp.com`

## Useful Firebase Commands

```powershell
# View deployment history
firebase hosting:channel:list

# Deploy to preview channel (for testing)
firebase hosting:channel:deploy preview

# View hosting info
firebase hosting:sites:list

# Open Firebase console
firebase open hosting
```

## Troubleshooting

### Build Fails
```powershell
# Clear cache and rebuild
rm -r node_modules dist
npm install
npm run build
```

### Deploy Fails
```powershell
# Re-login to Firebase
firebase logout
firebase login

# Re-initialize
firebase init hosting
```

### Wrong Project
```powershell
# Switch project
firebase use legends-of-revenue

# Or list available projects
firebase projects:list
```

## Environment Variables (If Needed)

If you need to add API keys or environment variables:

1. Create `.env.production`:
```env
VITE_FIREBASE_API_KEY=your-key-here
VITE_APP_NAME=Legends of Revenue
```

2. Access in code:
```typescript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

## Custom Domain (Optional)

To add a custom domain:

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS setup instructions
4. Wait for SSL certificate provisioning

## Performance Optimization

Current build output:
- **HTML**: 0.74 kB (gzip: 0.42 kB)
- **CSS**: 53.99 kB (gzip: 9.02 kB)
- **JS**: 250.86 kB (gzip: 72.64 kB)

Total: ~82 kB gzipped ✅ Excellent performance!

## Monitoring

View hosting metrics:
```powershell
firebase open hosting:url
```

Check analytics in Firebase Console:
- Page views
- Bandwidth usage
- Request count
- Error rates

---

## 🚀 Quick Start Deployment

**Run these commands in PowerShell:**

```powershell
# 1. Install Firebase CLI (first time only)
npm install -g firebase-tools

# 2. Login to Firebase (first time only)
firebase login

# 3. Build the app
npm run build

# 4. Deploy to Firebase
firebase deploy --only hosting
```

**Done! Your game is now live! 🎉**

---

## Support

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
