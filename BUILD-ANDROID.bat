@echo off
chcp 65001 >nul
cd /d %~dp0
where node >nul 2>nul || (echo يجب تثبيت Node.js اولا & pause & exit /b 1)
call npm install || goto :err
if not exist android call npx cap add android || goto :err
call npx cap sync android || goto :err
cd android
call gradlew.bat assembleDebug || goto :err
copy /Y app\build\outputs\apk\debug\app-debug.apk ..\Ghars-Wa-Zilal.apk >nul
echo.
echo تم إنشاء Ghars-Wa-Zilal.apk داخل مجلد المشروع.
pause
exit /b 0
:err
echo حدث خطأ أثناء البناء. تأكد من تثبيت Android Studio و Android SDK.
pause
exit /b 1
