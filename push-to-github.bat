@echo off
set "PATH=C:\Users\Shree\AppData\Local\Programs\Git\cmd;C:\Users\Shree\AppData\Local\Programs\gh\bin;%PATH%"
cd /d "%~dp0"

echo ========================================================
echo   AgroCare AI - Push to GitHub (shravanbabu565-create)
echo ========================================================
echo.

echo Checking GitHub CLI login status...
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo You need to log in to GitHub once. Opening browser login...
    gh auth login --web --git-protocol https
)

echo.
echo Ensuring remote repository exists and pushing code...
gh repo view shravanbabu565-create/agrocare-ai >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Creating repository 'agrocare-ai' on GitHub...
    gh repo create agrocare-ai --public --source=. --push
) else (
    echo Pushing commits to https://github.com/shravanbabu565-create/agrocare-ai...
    git push -u origin main
)

echo.
echo ========================================================
echo   Done! Check your repository at:
echo   https://github.com/shravanbabu565-create/agrocare-ai
echo ========================================================
pause
