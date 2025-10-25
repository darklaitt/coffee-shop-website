# Docker Swarm Commands for Coffee Shop Microservices

# Initialize Docker Swarm
docker swarm init

# Build images before deploying to swarm
docker-compose -f docker-compose.yml build

# Deploy stack to swarm
docker stack deploy -c docker-stack.yml coffee-shop

# List all services in the stack
docker stack services coffee-shop

# List all tasks (containers) in the stack
docker stack ps coffee-shop

# Check service logs
docker service logs coffee-shop_order-service
docker service logs coffee-shop_inventory-service
docker service logs coffee-shop_nginx

# Scale services
docker service scale coffee-shop_order-service=3
docker service scale coffee-shop_inventory-service=3

# Update service
docker service update --image coffee-shop-order-service:latest coffee-shop_order-service

# Remove stack
docker stack rm coffee-shop

# Leave swarm (if needed)
docker swarm leave --force

# Inspect service
docker service inspect coffee-shop_order-service

# List nodes in swarm
docker node ls
