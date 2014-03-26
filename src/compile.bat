@echo off
REM *** Compile js with ClosureCompiler on windows platform.

SET output=..\bin\Text-Responser\
SET ccpath=D:\DevTools\ClosureCompiler.jar
SET ccopts=--compilation_level=ADVANCED_OPTIMIZATIONS

echo Copying images and html ......
COPY /Y logo-16.png %output%
COPY /Y logo-48.png %output%
COPY /Y logo-128.png %output%
COPY /Y manifest.json %output%
COPY /Y options.html %output%

echo Compiling background.js ......
java -jar %ccpath% %ccopts% --js=background.js --js_output_file=%output%background.js

echo Compiling options.js ......
java -jar %ccpath% %ccopts% --js=options.js --js_output_file=%output%options.js

echo Completed
PAUSE
