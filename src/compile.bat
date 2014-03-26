@echo off
REM *** Compile js with ClosureCompiler on windows platform.

SET output=..\bin\Text-Responser\

echo Copying images and html ......
COPY /Y logo-128.png %output%
COPY /Y manifest.json %output%
COPY /Y options.html %output%
COPY /Y background.html %output%

echo Compiling background.js ......
java -jar D:\DevTools\ClosureCompiler.jar --compilation_level=ADVANCED_OPTIMIZATIONS --js=background.js --js_output_file=%output%background.js

echo Compiling options.js ......
java -jar D:\DevTools\ClosureCompiler.jar --compilation_level=ADVANCED_OPTIMIZATIONS --js=options.js --js_output_file=%output%options.js

echo Completed
PAUSE
