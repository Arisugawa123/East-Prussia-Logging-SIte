@echo off
echo ========================================
echo       QUICK GIT PUSH
echo ========================================
echo.

echo Adding all changes...
git add .

echo.
echo Committing with timestamp...
git commit -m "Prussia Dashboard Update - %date% %time%"

echo.
echo Pushing to remote...
git push origin main
if %errorlevel% neq 0 (
    git push origin master
)

echo.
echo ✅ Quick push completed!
pause