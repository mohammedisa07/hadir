@echo off
echo ========================================
echo Fixing All Logo References
echo ========================================
echo.
echo Step 1: Adding all logo fixes to Git...
git add .
echo ✓ Logo fixes added to Git

echo.
echo Step 2: Committing logo fixes...
git commit -m "Fix logo references in Navbar, KotPopup, DashboardHeader, and favicon"
echo ✓ Logo fixes committed

echo.
echo Step 3: Pushing to GitHub...
git push
echo ✓ Logo fixes pushed to GitHub

echo.
echo ========================================
echo ✓ All logo references fixed!
echo The logo should now appear on:
echo - Home page (Navbar)
echo - Kitchen Order Tickets (KotPopup)
echo - Admin Dashboard (DashboardHeader)
echo - Browser favicon
echo ========================================
echo.
echo Note: Netlify will automatically redeploy with the logo fixes.
pause 