@echo off
REM Windows batch script to start StayFinder development environment

echo.
echo 🚀 Starting StayFinder Development Environment
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ❌ Node.js is not installed or not in PATH
  pause
  exit /b 1
)

REM Check if MongoDB is running (optional)
echo.
echo 📦 Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
  echo ✅ MongoDB is running
) else (
  echo ⚠️  MongoDB is not running
  echo    Start it manually if needed
)

REM Start backend server in new terminal
echo.
echo 📦 Starting backend server on http://localhost:5000...
start "StayFinder Backend" cmd /k cd /d %CD%\server ^& npm run dev

REM Wait a bit for server to start
timeout /t 3 /nobreak

REM Start frontend client in new terminal
echo.
echo 🎨 Starting frontend client on http://localhost:3000...
start "StayFinder Frontend" cmd /k cd /d %CD%\client ^& npm start

echo.
echo ✅ Development environment started!
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo 💡 Tip: Keep both terminal windows open while developing
echo.
