@echo off
title CareerLens Platform
echo =========================================================
echo   Launching CareerLens (Frontend UI + Backend API)
echo =========================================================
echo.

cd /d "%~dp0"

.\.venv\Scripts\python.exe run_backend.py

