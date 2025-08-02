@echo off
echo Installing dependencies...
npm install

echo Starting Prussian Auth Server...
node auth.js

pause