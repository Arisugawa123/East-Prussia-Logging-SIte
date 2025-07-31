@echo off
echo ========================================
echo STARTING YOUR EAST PRUSSIA WEBSITE
echo ========================================
echo.

echo Checking if Node.js is available...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo SOLUTIONS:
    echo 1. Install Node.js from https://nodejs.org/
    echo 2. OR just check your deployed website at:
    echo    https://east-prussia-logging-site.vercel.app
    echo.
    echo Your website is already LIVE on Vercel!
    echo The image path fixes have been applied.
    echo.
    pause
    exit /b 1
)

echo Node.js found! Starting development server...
echo.
echo Opening your website at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause