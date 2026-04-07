@echo off
echo Starting Zeerostock Part 2 (Database API) Server...

cd /d "C:\Users\agrep\.gemini\antigravity\scratch\zeerostock\inventory-database-project"
echo Installing Part 2 packages...
call npm install

echo Starting Part B (Database Server) on Port 4000...
start cmd /k "npm start"

echo Loading Browser to check Inventory API...
start "" "http://localhost:4000/inventory"

echo All done! You can minimize this window.
pause
