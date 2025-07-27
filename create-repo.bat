@echo off
echo ========================================
echo    Hadirs Cafe POS - GitHub Setup
echo ========================================
echo.
echo Step 1: Creating GitHub Repository...
echo Opening GitHub repository creation page...
start https://github.com/new
echo.
echo Please follow these steps:
echo 1. Repository name: hadirs-cafe-pos
echo 2. Description: Modern POS system for Hadirs Cafe
echo 3. Make it Public
echo 4. DO NOT check any boxes
echo 5. Click "Create repository"
echo.
echo After creating the repository, come back here and press any key...
pause
echo.
echo Step 2: Enter the repository URL (e.g., https://github.com/username/hadirs-cafe-pos.git)
set /p repoUrl="Repository URL: "
echo.
echo Step 3: Adding remote and pushing code...
git remote add origin %repoUrl%
git push -u origin main
echo.
echo Step 4: Success! Your code has been pushed to GitHub.
echo Repository URL: %repoUrl%
echo.
pause 