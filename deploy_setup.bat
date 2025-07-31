@echo off
setlocal enabledelayedexpansion

echo ========================================
echo East Prussia Regiment - Deployment Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo Node.js found: !NODE_VERSION!
)

REM Check if npm is available
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available
    echo Please reinstall Node.js with npm included
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo npm found: !NPM_VERSION!
)

echo.
echo Installing dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Building project...
npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Testing build...
if exist dist (
    echo ✓ Build successful - dist folder created
) else (
    echo ERROR: Build folder not found
    pause
    exit /b 1
)

echo.
echo Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/download/win
    echo.
    echo Manual steps after installing Git:
    echo 1. git init
    echo 2. git add .
    echo 3. git commit -m "Initial commit"
    echo 4. git remote add origin https://github.com/Arisugawa123/EAST-PRUSSIA-REGIMENT.git
    echo 5. git branch -M main
    echo 6. git push -u origin main
    echo.
    goto :vercel_instructions
) else (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo Git found: !GIT_VERSION!
)

echo.
echo Setting up Git repository...

REM Initialize git repository if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    if errorlevel 1 (
        echo ERROR: Failed to initialize Git repository
        pause
        exit /b 1
    )
) else (
    echo Git repository already exists
)

echo Adding files to Git...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files to Git
    pause
    exit /b 1
)

echo Committing files...
git commit -m "Initial commit - East Prussia Regiment React App"
if errorlevel 1 (
    echo Note: No changes to commit or commit failed
)

echo Adding remote repository...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Arisugawa123/EAST-PRUSSIA-REGIMENT.git
if errorlevel 1 (
    echo ERROR: Failed to add remote repository
    pause
    exit /b 1
)

echo Pushing to GitHub...
git branch -M main
git push -u origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    echo This might be due to authentication issues
    echo Please check your GitHub credentials and try again
    pause
    exit /b 1
)

:vercel_instructions
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your React app is ready for Vercel deployment!
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Sign in with your GitHub account
echo 3. Click "New Project"
echo 4. Import your repository: EAST-PRUSSIA-REGIMENT
echo 5. Vercel will automatically detect it's a Vite React app
echo 6. Click "Deploy"
echo.
echo Your app will be deployed to a URL like:
echo https://east-prussia-regiment.vercel.app
echo.
echo Build output is in the 'dist' folder
echo Project is configured with vercel.json for optimal deployment
echo.
pause