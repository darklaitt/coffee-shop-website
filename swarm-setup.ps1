# Docker Swarm Setup and Management - PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Coffee Shop - Docker Swarm Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Initialize Docker Swarm
Write-Host "Step 1: Initializing Docker Swarm..." -ForegroundColor Yellow
docker swarm init
Write-Host ""

# Step 2: Build Docker images
Write-Host "Step 2: Building Docker images..." -ForegroundColor Yellow
docker-compose -f docker-compose.yml build
Write-Host ""

# Step 3: Deploy stack
Write-Host "Step 3: Deploying stack to Docker Swarm..." -ForegroundColor Yellow
docker stack deploy -c docker-stack.yml coffee-shop
Write-Host ""

# Step 4: Wait for services to start
Write-Host "Waiting for services to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30
Write-Host ""

# Step 5: Show services
Write-Host "Step 4: Listing services..." -ForegroundColor Yellow
docker stack services coffee-shop
Write-Host ""

# Step 6: Show tasks
Write-Host "Step 5: Listing tasks..." -ForegroundColor Yellow
docker stack ps coffee-shop
Write-Host ""

# Step 7: Show nodes
Write-Host "Step 6: Listing nodes..." -ForegroundColor Yellow
docker node ls
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access your services at:" -ForegroundColor Yellow
Write-Host "  NGINX Gateway: http://localhost" -ForegroundColor Green
Write-Host "  Order Service: http://localhost/orders" -ForegroundColor Green
Write-Host "  Inventory Service: http://localhost/inventory" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs: docker service logs coffee-shop_nginx" -ForegroundColor White
Write-Host "  Scale service: docker service scale coffee-shop_order-service=3" -ForegroundColor White
Write-Host "  Remove stack: docker stack rm coffee-shop" -ForegroundColor White
