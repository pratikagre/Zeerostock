@echo off
echo Starting Zeerostock Servers...

cd /d "C:\Users\agrep\.gemini\antigravity\scratch\zeerostock\inventory-search-project\backend"
echo Installing Backend packages...
call npm install

echo Starting Part A Server on Port 3000...
start cmd /k "node server.js"

echo Loading Browser...
start "" "http://localhost:3000"

echo All done! You can minimize this window.
pause
