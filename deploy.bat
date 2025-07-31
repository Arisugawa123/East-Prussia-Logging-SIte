@echo off
echo ========================================
echo    PRUSSIA DASHBOARD DEPLOYMENT
echo ========================================
echo.

echo [1/4] Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✅ Build completed successfully!
echo.

echo [2/4] Adding all changes to git...
git add .
echo ✅ Files added to git staging area!
echo.

echo [3/4] Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update Prussia Dashboard - %date% %time%
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo WARNING: No changes to commit or commit failed!
)
echo ✅ Changes committed!
echo.

echo [4/4] Pushing to remote repository...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Push failed! Trying 'master' branch...
    git push origin master
    if %errorlevel% neq 0 (
        echo ERROR: Push failed on both main and master branches!
        echo Please check your git configuration and try manually.
        pause
        exit /b 1
    )
)
echo ✅ Successfully pushed to remote repository!
echo.

echo ========================================
echo    DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your Prussia Dashboard has been:
echo ✅ Built for production
echo ✅ Committed to git
echo ✅ Pushed to remote repository
echo.
echo You can now deploy the 'dist' folder to your web server.
echo.
pause