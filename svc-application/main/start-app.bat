@ECCO OFF

TASKKILL /IM "node.exe" /F
START cmd /c "node app.js | bunyan -o short && EXIT"