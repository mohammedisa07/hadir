@echo off
echo ========================================
echo Fixing Missing Logo Issue
echo ========================================
echo.
echo Step 1: Checking if logo.jpg exists...
if exist "public\logo.jpg" (
    echo ✓ Logo file found
) else (
    echo ✗ Logo file not found in public directory
    pause
    exit /b 1
)

echo.
echo Step 2: Adding logo.jpg to Git...
git add public/logo.jpg
if %errorlevel% neq 0 (
    echo ✗ Failed to add logo to Git
    pause
    exit /b 1
)
echo ✓ Logo added to Git

echo.
echo Step 3: Committing logo file...
git commit -m "Add logo.jpg for receipt and cart display"
if %errorlevel% neq 0 (
    echo ✗ Failed to commit logo
    pause
    exit /b 1
)
echo ✓ Logo committed

echo.
echo Step 4: Pushing to GitHub...
git push
if %errorlevel% neq 0 (
    echo ✗ Failed to push to GitHub
    pause
    exit /b 1
)
echo ✓ Logo pushed to GitHub

echo.
echo ========================================
echo ✓ Logo successfully added to GitHub!
echo The logo should now display in your app.
echo ========================================
pause 