# CareerLens Complete Application Launcher for PowerShell
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting CareerLens (Frontend UI + Backend API)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

& ".\.venv\Scripts\python.exe" run_backend.py
