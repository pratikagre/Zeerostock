@echo off
echo Git par code upload (push) shuru kiya ja raha hai...
echo.

cd /d "C:\Users\agrep\.gemini\antigravity\scratch\zeerostock"

echo 1. Git Initialize kiya ja raha hai...
git init

echo.
echo 2. Saari files Git mein add ki ja rahi hain...
git add .

echo.
echo 3. Changes Save (Commit) kiye ja rahe hain...
git commit -m "Initial complete submission for Zeerostock Assignment"

echo.
echo 4. Main branch set ki ja rahi hai...
git branch -M main

echo.
echo 5. Aapke GitHub link se attach kiya ja raha hai...
git remote add origin https://github.com/pratikagre/Zeerostock.git
REM In case origin already exists (to prevent errors)
git remote set-url origin https://github.com/pratikagre/Zeerostock.git

echo.
echo 6. Final Push to GitHub... (Yahan GitHub aapse Browser me Login ya permission maang sakta hai, usko allow karein)
git push -u origin main

echo.
echo ====== DONE! CHECK YOUR GITHUB =======
pause
