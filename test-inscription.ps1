# Test rapide d'inscription

Write-Host "Test d'inscription..." -ForegroundColor Yellow

$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$body = @{
    establishmentName = "Test Ecole"
    email = "test-$timestamp@izzzi.com"
    firstName = "Test"
    lastName = "User"
    password = "TestPassword123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/register/admin" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Inscription reussie!" -ForegroundColor Green
    Write-Host "Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "Role: $($response.user.role)" -ForegroundColor Gray
} catch {
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Details: $responseBody" -ForegroundColor Red
    }
}

