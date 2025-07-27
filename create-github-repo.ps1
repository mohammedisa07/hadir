# GitHub Repository Creation Script for Hadirs Cafe POS
Write-Host "=== Hadirs Cafe POS - GitHub Repository Setup ===" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Creating GitHub Repository..." -ForegroundColor Yellow
Write-Host "Please follow these steps:" -ForegroundColor White
Write-Host "1. Open your browser and go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Repository name: hadirs-cafe-pos" -ForegroundColor Cyan
Write-Host "3. Description: Modern POS system for Hadirs Cafe with React frontend and Node.js backend" -ForegroundColor Cyan
Write-Host "4. Make it Public" -ForegroundColor Cyan
Write-Host "5. DO NOT check any boxes (README, .gitignore, license)" -ForegroundColor Cyan
Write-Host "6. Click 'Create repository'" -ForegroundColor Cyan
Write-Host ""

$repoUrl = Read-Host "Step 2: Enter the new repository URL (e.g., https://github.com/username/hadirs-cafe-pos.git)"

if ($repoUrl -match "https://github\.com/.*/.*\.git") {
    Write-Host "Step 3: Adding remote and pushing code..." -ForegroundColor Yellow
    
    # Add the new remote
    git remote add origin $repoUrl
    
    # Push to the new repository
    git push -u origin main
    
    Write-Host "Step 4: Success! Your code has been pushed to GitHub." -ForegroundColor Green
    Write-Host "Repository URL: $repoUrl" -ForegroundColor Cyan
} else {
    Write-Host "Error: Please enter a valid GitHub repository URL" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 