Write-Host "🚀 Starting logo push process..." -ForegroundColor Green
Write-Host ""

# Check if logo file exists
if (Test-Path "public\logo.jpg") {
    Write-Host "✅ Logo file found" -ForegroundColor Green
} else {
    Write-Host "❌ Logo file not found in public directory" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add logo to Git
Write-Host "📝 Adding logo to Git..." -ForegroundColor Yellow
try {
    git add public/logo.jpg
    Write-Host "✅ Logo added to Git" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add logo to Git" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Commit the logo
Write-Host "💾 Committing logo..." -ForegroundColor Yellow
try {
    git commit -m "Add logo.jpg for receipt and cart display"
    Write-Host "✅ Logo committed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to commit logo" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push
    Write-Host "✅ Logo pushed to GitHub successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🎉 Logo has been successfully added to your repository!" -ForegroundColor Green
Write-Host "The logo should now display in your Hadir's Cafe app." -ForegroundColor Green
Read-Host "Press Enter to continue" 