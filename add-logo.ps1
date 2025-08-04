Write-Host "Adding logo.jpg to Git..." -ForegroundColor Green
git add public/logo.jpg
Write-Host "Committing logo file..." -ForegroundColor Green
git commit -m "Add logo.jpg for receipt and cart display"
Write-Host "Pushing to remote repository..." -ForegroundColor Green
git push
Write-Host "Logo file has been successfully added and pushed to Git!" -ForegroundColor Green
Read-Host "Press Enter to continue" 