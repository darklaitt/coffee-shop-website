# Test Coffee Shop Microservices via NGINX

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Coffee Shop via NGINX Gateway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$NGINX_URL = "http://localhost"

function Print-Result {
    param (
        [string]$Title,
        [string]$Response
    )
    Write-Host "`n--- $Title ---" -ForegroundColor Yellow
    try {
        $Response | ConvertFrom-Json | ConvertTo-Json -Depth 10
    } catch {
        Write-Host $Response
    }
    Write-Host ""
}

# Test 1: NGINX Health Check
Write-Host "Test 1: NGINX Health Check" -ForegroundColor Green
try {
    $health = Invoke-RestMethod -Uri "$NGINX_URL/health" -Method GET
    Print-Result "NGINX Health" $health
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 2: Get Inventory via NGINX
Write-Host "Test 2: Get Inventory via NGINX" -ForegroundColor Green
try {
    $inventory = Invoke-RestMethod -Uri "$NGINX_URL/inventory" -Method GET
    Print-Result "Inventory via NGINX" ($inventory | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 3: Create Order via NGINX
Write-Host "Test 3: Create Order via NGINX" -ForegroundColor Green
try {
    $order = @{
        customerName = "Test User"
        items = @("latte", "espresso")
    } | ConvertTo-Json

    $createOrder = Invoke-RestMethod -Uri "$NGINX_URL/orders" -Method POST -Body $order -ContentType "application/json"
    Print-Result "Created Order via NGINX" ($createOrder | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

# Test 4: Get Orders via NGINX
Write-Host "Test 4: Get Orders via NGINX" -ForegroundColor Green
try {
    $orders = Invoke-RestMethod -Uri "$NGINX_URL/orders" -Method GET
    Print-Result "Orders via NGINX" ($orders | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
