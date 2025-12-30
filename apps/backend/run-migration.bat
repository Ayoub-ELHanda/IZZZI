@echo off
cd /d c:\IZZZI\apps\backend
call npx prisma migrate deploy
echo.
echo Migration completed. Press any key to continue...
pause
