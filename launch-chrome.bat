@echo off
REM Launch Chrome with remote debugging for Carfax Website
REM This script launches Chrome with the necessary flags for the automation to work

echo 🚀 Launching Chrome with remote debugging on port 9223...

REM Kill any existing Chrome processes using port 9223
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Closing existing Chrome processes...
    taskkill /F /IM chrome.exe /T >NUL 2>&1
    timeout /t 2 >NUL
)

REM Launch Chrome with remote debugging
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9223 --user-data-dir="C:\Users\%USERNAME%\AppData\Local\Google\Chrome\User Data\Profile 1" --disable-web-security --disable-features=VizDisplayCompositor

echo ✅ Chrome launched successfully!
echo 📍 Remote debugging available at: http://localhost:9223
echo 🌐 You can now start the application with 'npm start'
echo.
echo To stop Chrome debugging, close all Chrome windows or run: taskkill /F /IM chrome.exe
pause 