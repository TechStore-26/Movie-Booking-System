@echo off
echo Starting Movie Booking System Backend...
echo =====================================
cd backend
echo Installing dependencies if needed...
call npm install
echo.
echo Starting backend server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
call npm run dev