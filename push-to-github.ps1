# Push to GitHub - Quick Script
# Run this after creating your GitHub repository

# Replace YOUR_USERNAME with your actual GitHub username
$username = "YOUR_USERNAME"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Legends of Revenue - GitHub Push Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if username is still default
if ($username -eq "YOUR_USERNAME") {
    Write-Host "⚠️  IMPORTANT: Edit this file first!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Open push-to-github.ps1 in a text editor" -ForegroundColor White
    Write-Host "2. Change line 4:" -ForegroundColor White
    Write-Host '   $username = "YOUR_USERNAME"' -ForegroundColor Gray
    Write-Host "   to your actual GitHub username, like:" -ForegroundColor White
    Write-Host '   $username = "john_doe"' -ForegroundColor Green
    Write-Host "3. Save and run this script again" -ForegroundColor White
    Write-Host ""
    exit
}

Write-Host "GitHub Username: $username" -ForegroundColor Green
Write-Host "Repository Name: legends-of-revenue" -ForegroundColor Green
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Have you created the repository on GitHub? (y/n)"
if ($confirm -ne "y") {
    Write-Host ""
    Write-Host "📝 Please create the repository first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: legends-of-revenue" -ForegroundColor White
    Write-Host "3. Description: A medieval-themed RPG about tax enforcement" -ForegroundColor White
    Write-Host "4. Choose Public or Private" -ForegroundColor White
    Write-Host "5. DO NOT check any boxes (no README, .gitignore, or license)" -ForegroundColor Red
    Write-Host "6. Click 'Create repository'" -ForegroundColor White
    Write-Host "7. Run this script again" -ForegroundColor White
    Write-Host ""
    exit
}

Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Add remote
Write-Host "Adding remote origin..." -ForegroundColor Yellow
git remote add origin "https://github.com/$username/legends-of-revenue.git" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Remote already exists, updating..." -ForegroundColor Yellow
    git remote set-url origin "https://github.com/$username/legends-of-revenue.git"
}

# Ensure we're on main branch
Write-Host "Setting branch to main..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS! Repository pushed to GitHub!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 View your repository at:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/legends-of-revenue" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Visit your repository" -ForegroundColor White
    Write-Host "2. Add topics/tags (rpg, game, react, typescript)" -ForegroundColor White
    Write-Host "3. Star your own repository ⭐" -ForegroundColor White
    Write-Host "4. Share the link!" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 To update in the future:" -ForegroundColor Cyan
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m ""Your update message""" -ForegroundColor Gray
    Write-Host "   git push" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Repository doesn't exist on GitHub yet" -ForegroundColor White
    Write-Host "2. Wrong username in this script" -ForegroundColor White
    Write-Host "3. Need to authenticate with GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "For authentication issues:" -ForegroundColor Yellow
    Write-Host "1. Use GitHub Desktop (easier)" -ForegroundColor White
    Write-Host "2. Or create a Personal Access Token:" -ForegroundColor White
    Write-Host "   - Go to https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "   - Generate new token (classic)" -ForegroundColor White
    Write-Host "   - Select 'repo' scope" -ForegroundColor White
    Write-Host "   - Use token as password when prompted" -ForegroundColor White
    Write-Host ""
}
