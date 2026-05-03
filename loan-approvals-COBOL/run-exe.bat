@echo off
setlocal

set "PROJECT_DIR=%~dp0"
set "PATH=C:\msys64\ucrt64\bin;%PATH%"
set "COB_CONFIG_DIR=C:\msys64\ucrt64\share\gnucobol\config"

cd /d "%PROJECT_DIR%"
loan-approval.exe

echo.
pause
