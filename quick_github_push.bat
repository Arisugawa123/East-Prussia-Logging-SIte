@echo off
chcp 65001 >nul
echo ========================================
echo     QUICK GITHUB PUSH
echo ========================================
echo.

echo Checking git repository...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Initializing git repository...
    git init
)

echo Updating .gitignore...
echo sdsc/ > .gitignore
echo acli.exe >> .gitignore

echo Removing excluded files from tracking...
git rm -r --cached sdsc/ >nul 2>&1
git rm --cached acli.exe >nul 2>&1

echo Adding changes...
git add .

echo Committing with timestamp...
git commit -m "East Prussia Dashboard Update - %date% %time%"

echo Setting remote and pushing...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Arisugawa123/East-Prussia-Logging-SIte.git
git branch -M main
git push -u origin main
if %errorlevel% neq 0 (
    echo ERROR: Push failed! You may need to authenticate with GitHub.
)

echo.
echo ✅ Quick push to GitHub completed!
echo Repository: https://github.com/Arisugawa123/East-Prussia-Logging-SIte.git
pause