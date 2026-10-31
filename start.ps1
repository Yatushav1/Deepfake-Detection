$ErrorActionPreference = "Stop"

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"
$apiUrl = "http://127.0.0.1:8000"
$frontendUrl = "http://127.0.0.1:5173"
$apiWindow = Join-Path $PSHOME "powershell.exe"

if (-not (Get-Command py.exe -ErrorAction SilentlyContinue)) {
    throw "Python 3.12 launcher was not found. Install Python 3.12 and enable the py launcher."
}
if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw "npm was not found. Install Node.js, then reopen PowerShell."
}
if (-not (Test-Path (Join-Path $frontendPath "node_modules\vite"))) {
    throw "Frontend dependencies are missing. Run 'npm install' from the frontend folder first."
}

$apiAlreadyRunning = $false
try {
    $health = Invoke-RestMethod -Uri "$apiUrl/health" -TimeoutSec 2
    $apiAlreadyRunning = $health.status -eq "healthy"
} catch {
    $apiAlreadyRunning = $false
}

if (-not $apiAlreadyRunning) {
    $apiListener = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
    if ($apiListener) {
        throw "Port 8000 is already in use by another process. Close it or configure AuthPulse to use another port."
    }

    $secret = (& py -3.12 -c "import secrets; print(secrets.token_urlsafe(32))").Trim()
    if (-not $secret) {
        throw "Could not generate the local authentication secret."
    }

    $backendCommand = "Set-Location -LiteralPath '$backendPath'; `$env:AUTHPULSE_SECRET_KEY = '$secret'; py -3.12 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
    Start-Process -FilePath $apiWindow -ArgumentList @("-NoExit", "-Command", $backendCommand) | Out-Null

    $apiReady = $false
    $lastApiError = $null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        try {
            $health = Invoke-RestMethod -Uri "$apiUrl/health" -TimeoutSec 2
            if ($health.status -eq "healthy") {
                $apiReady = $true
                break
            }
        } catch {
            $lastApiError = $_.Exception.Message
        }
        Start-Sleep -Seconds 1
    }
    if (-not $apiReady) {
        throw "AuthPulse backend did not become healthy. Check the backend PowerShell window. Last check: $lastApiError"
    }
}

$frontendAlreadyRunning = $false
try {
    $response = Invoke-WebRequest -Uri $frontendUrl -TimeoutSec 2 -UseBasicParsing
    $frontendAlreadyRunning = $response.StatusCode -eq 200
} catch {
    $frontendAlreadyRunning = $false
}

if (-not $frontendAlreadyRunning) {
    $frontendListener = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
    if ($frontendListener) {
        throw "Port 5173 is already in use by another process. Close it or configure Vite to use another port."
    }

    $frontendCommand = "Set-Location -LiteralPath '$frontendPath'; npm run dev -- --host 127.0.0.1"
    Start-Process -FilePath $apiWindow -ArgumentList @("-NoExit", "-Command", $frontendCommand) | Out-Null

    $frontendReady = $false
    $lastFrontendError = $null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $frontendUrl -TimeoutSec 2 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                $frontendReady = $true
                break
            }
        } catch {
            $lastFrontendError = $_.Exception.Message
        }
        Start-Sleep -Seconds 1
    }
    if (-not $frontendReady) {
        throw "AuthPulse frontend did not become available. Check the frontend PowerShell window. Last check: $lastFrontendError"
    }
}

Write-Host "AuthPulse is ready."
Write-Host "Backend:  $apiUrl"
Write-Host "Frontend: $frontendUrl"
Start-Process $frontendUrl
