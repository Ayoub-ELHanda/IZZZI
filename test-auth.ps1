# Script de test pour l'authentification IZZZI

Write-Host "Test d'Authentification IZZZI" -ForegroundColor Cyan
Write-Host ""

# Test 1: Verifier que les services sont en cours d'execution
Write-Host "1. Verification des services..." -ForegroundColor Yellow
$services = docker-compose ps --format json | ConvertFrom-Json
$running = $services | Where-Object { $_.State -eq "running" }
Write-Host "   Services en cours d'execution: $($running.Count)/$($services.Count)" -ForegroundColor Green
Write-Host ""

# Test 2: Verifier que le frontend repond
Write-Host "2. Test du frontend (http://localhost:3000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "   Frontend accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Verifier que le backend repond
Write-Host "3. Test du backend (http://localhost:4000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "   Backend accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   Backend peut avoir des erreurs: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   (C'est normal si le backend n'a pas de route GET /)" -ForegroundColor Gray
}
Write-Host ""

# Test 4: Test d'inscription Admin
Write-Host "4. Test d'inscription Admin..." -ForegroundColor Yellow
$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$registerBody = @{
    establishmentName = "Ecole Test IZZZI"
    email = "test-admin-$timestamp@izzzi.com"
    firstName = "John"
    lastName = "Doe"
    password = "TestPassword123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/register/admin" -Method POST -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   Inscription reussie!" -ForegroundColor Green
    Write-Host "   Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "   Role: $($response.user.role)" -ForegroundColor Gray
    $testEmail = ($registerBody | ConvertFrom-Json).email
    $testPassword = "TestPassword123!"
} catch {
    Write-Host "   Erreur d'inscription: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Details: $responseBody" -ForegroundColor Red
    }
    $testEmail = $null
    $testPassword = $null
}
Write-Host ""

# Test 5: Test de connexion (si l'inscription a reussi)
if ($testEmail) {
    Write-Host "5. Test de connexion..." -ForegroundColor Yellow
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
        Write-Host "   Connexion reussie!" -ForegroundColor Green
        Write-Host "   Token recu: $($response.accessToken.Substring(0, 20))..." -ForegroundColor Gray
    } catch {
        Write-Host "   Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Details: $responseBody" -ForegroundColor Red
        }
    }
    Write-Host ""
}

# Resume
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Resume des Tests" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs a tester manuellement:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000/auth/register" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000/auth/login" -ForegroundColor White
Write-Host "   Mailhog:  http://localhost:8025" -ForegroundColor White
Write-Host ""
Write-Host "Tests termines!" -ForegroundColor Green
