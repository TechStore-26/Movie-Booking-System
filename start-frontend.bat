@echo off
echo Starting Movie Booking System Frontend...
echo =========================================
cd frontend
echo Installing dependencies if needed...
call npm install
echo.
echo Starting frontend development server on http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
call npm run dev