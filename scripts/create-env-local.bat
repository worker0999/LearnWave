@echo off
REM Create .env.local in project root with GEMINI_API_KEY and GEMINI_MODEL
REM WARNING: Do NOT commit .env.local to git or share it publicly.

echo This will create a .env.local file in the current directory.
echo Make sure you are in the project root: %CD%
set /p key=Enter GEMINI_API_KEY (input will be visible): 
if "%key%"=="" (
  echo No key provided. Exiting.
  exit /b 1
)
set model=gemini-2.0-flash
(
  echo GEMINI_API_KEY=%key%
  echo GEMINI_MODEL=%model%
) > .env.local

echo .env.local created in %CD% with GEMINI_API_KEY and GEMINI_MODEL.
echo Remember: do NOT commit .env.local to your repository.
