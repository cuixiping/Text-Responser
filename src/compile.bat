REM *** Compile js with ClosureCompiler on windows platform.

COPY /Y logo-128.png ..\bin\
COPY /Y manifest.json ..\bin\
COPY /Y options.html ..\bin\
java -jar D:\DevTools\ClosureCompiler.jar --compilation_level=ADVANCED_OPTIMIZATIONS --externs externs-gcc.js --js=options.js --js_output_file=../bin/options.js
java -jar D:\DevTools\ClosureCompiler.jar --compilation_level=ADVANCED_OPTIMIZATIONS --externs externs-gcc.js --js=background-block.js --js_output_file=../bin/background-block.js
PAUSE
