@echo off
chcp 65001 >nul
echo ========================================
echo   PUSH TO EAST PRUSSIA LOGGING SITE
echo ========================================
echo.

echo [1/6] Checking if git repository exists...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Initializing new git repository...
    git init
    echo ✅ Git repository initialized!
) else (
    echo ✅ Git repository found!
)
echo.

echo [2/6] Setting up .gitignore to exclude files...
echo sdsc/ > .gitignore
echo acli.exe >> .gitignore
echo ✅ .gitignore updated to exclude sdsc folder and acli.exe
echo.

echo [3/6] Removing excluded files from git tracking (if previously tracked)...
git rm -r --cached sdsc/ >nul 2>&1
git rm --cached acli.exe >nul 2>&1
echo ✅ Excluded files removed from tracking
echo.

echo [4/6] Adding all changes to git (excluding ignored files)...
git add .
echo ✅ Files added to staging area!
echo.

echo [5/6] Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update East Prussia Dashboard - %date% %time%
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo WARNING: No changes to commit or commit failed!
)
echo ✅ Changes committed!
echo.

echo [6/6] Pushing to GitHub repository...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Arisugawa123/East-Prussia-Logging-SIte.git
git branch -M main
git push -u origin main
if %errorlevel% neq 0 (
    echo ERROR: Push failed!
    echo.
    echo This might be because:
    echo 1. You need to authenticate with GitHub
    echo 2. The repository doesn't exist
    echo 3. You don't have push permissions
    echo.
    echo Please run this command manually:
    echo git push -u origin main
    pause
    exit /b 1
)
echo ✅ Successfully pushed to GitHub!
echo.

echo ========================================
echo    PUSH COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your East Prussia Dashboard has been pushed to:
echo https://github.com/Arisugawa123/East-Prussia-Logging-SIte.git
echo.
echo Excluded files:
echo ❌ sdsc/ folder
echo ❌ acli.exe file
echo.
pause