@echo off
echo ========================================
echo       PRUSSIA DASHBOARD GIT PUSH
echo ========================================
echo.

echo [1/3] Checking git status...
git status
echo.

echo [2/3] Adding all changes to git...
git add .
echo ✅ All files added to staging area!
echo.

echo [3/3] Committing and pushing changes...
set /p commit_message="Enter commit message: "
if "%commit_message%"=="" (
    echo ERROR: Commit message is required!
    pause
    exit /b 1
)

git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo WARNING: No changes to commit or commit failed!
    echo Trying to push anyway...
)

echo.
echo Pushing to remote repository...
git push origin main
if %errorlevel% neq 0 (
    echo Trying 'master' branch...
    git push origin master
    if %errorlevel% neq 0 (
        echo ERROR: Push failed!
        echo Please check your git configuration.
        pause
        exit /b 1
    )
)

echo.
echo ✅ Successfully pushed to remote repository!
echo.
echo ========================================
echo         PUSH COMPLETED!
echo ========================================
echo.
pause