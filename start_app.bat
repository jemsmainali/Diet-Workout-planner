@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "BACKEND_PY=%BACKEND_DIR%\venv\Scripts\python.exe"

echo ==========================================
echo Starting Gym Diet Planner Locally
echo ==========================================

if not exist "%BACKEND_PY%" (
    echo Backend virtual environment was not found at:
    echo %BACKEND_PY%
    echo.
    echo Create it first, then install backend dependencies:
    echo cd /d "%BACKEND_DIR%"
    echo py -m venv venv
    echo venv\Scripts\python -m pip install -r requirements.txt
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%\node_modules" (
    echo Frontend dependencies were not found at:
    echo %FRONTEND_DIR%\node_modules
    echo.
    echo Install them first:
    echo cd /d "%FRONTEND_DIR%"
    echo npm install
    pause
    exit /b 1
)

echo [1/2] Starting Django Backend Server...
start "Backend Server" /D "%BACKEND_DIR%" cmd /k ""%BACKEND_PY%" manage.py runserver 127.0.0.1:8000"

echo [2/2] Starting React Frontend Server...
start "Frontend Server" /D "%FRONTEND_DIR%" cmd /k "set BROWSER=none&& npm start"

echo.
echo Both servers have been launched in separate terminal windows.
echo Frontend will run on http://localhost:3000
echo Backend will run on http://localhost:8000
echo API docs will run on http://localhost:8000/swagger/
echo.
pause
