@echo off
set "PATH=C:\Users\Shree\AppData\Local\Programs\Git\cmd;C:\Users\Shree\AppData\Local\Programs\gh\bin;%PATH%"
cd /d "%~dp0"

echo ========================================================
echo   AgroCare AI - Push to GitHub (Suhasegowda/Agrocare-AI)
echo ========================================================
echo.

echo Checking GitHub login status...
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ACTION NEEDED] Please log in to GitHub once in the browser window that opens.
    echo.
    gh auth login --web --git-protocol https
)

echo.
echo Pushing commits to https://github.com/Suhasegowda/Agrocare-AI ...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! All code is pushed to:
    echo   https://github.com/Suhasegowda/Agrocare-AI
    echo ========================================================
) else (
    echo.
    echo [NOTICE] If prompted for credentials, you can use a GitHub Personal Access Token
    echo or sign in via browser with GitHub CLI.
)

pause
