@echo off
echo ========================================
echo Triggering Netlify Redeploy
echo ========================================
echo.
echo Step 1: Adding all changes to Git...
git add .
echo ✓ Changes added to Git

echo.
echo Step 2: Committing changes...
git commit -m "Update site title and trigger Netlify redeploy with logo"
echo ✓ Changes committed

echo.
echo Step 3: Pushing to GitHub...
git push
echo ✓ Changes pushed to GitHub

echo.
echo ========================================
echo ✓ Netlify redeploy triggered!
echo The logo should now appear in your live site.
echo ========================================
echo.
echo Note: It may take 2-5 minutes for Netlify to complete the deployment.
pause 