$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Docker Engine chua chay. Mo Docker Desktop roi chay lai." -ForegroundColor Red
  Write-Host "Xem DOCKER-FIX.txt" -ForegroundColor Yellow
  exit 1
}

docker compose up -d
Write-Host "RabbitMQ UI: http://localhost:15672 (guest/guest)" -ForegroundColor Green
