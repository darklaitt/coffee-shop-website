# Inventory Service (Микросервис управления инвентарем)

## Описание
Микросервис для управления инвентарем кофейни. Отслеживает наличие товаров, их количество и цены. Предоставляет API для проверки наличия товаров и обновления количества.

## Функциональность
- Просмотр всего инвентаря
- Получение информации о конкретном товаре
- Проверка наличия товаров
- Уменьшение количества товаров (при заказе)
- Добавление новых товаров или пополнение существующих
- Статистика инвентаря

## Начальный инвентарь
- Espresso (50 шт.) - $3.99
- Latte (45 шт.) - $4.99
- Cappuccino (40 шт.) - $4.49
- Americano (60 шт.) - $3.49
- Mocha (30 шт.) - $5.49
- Macchiato (25 шт.) - $4.29

## API Endpoints

### GET /
Главная страница с описанием сервиса и доступных endpoints

### GET /health
Проверка работоспособности сервиса

### GET /inventory
Получить весь инвентарь
```json
{
  "total": 6,
  "totalQuantity": 250,
  "items": [...]
}
```

### GET /inventory/:item
Получить информацию о конкретном товаре
```bash
GET /inventory/latte
```

Ответ:
```json
{
  "id": "latte",
  "name": "Latte",
  "quantity": 45,
  "price": 4.99
}
```

### GET /inventory/check?items=latte,espresso
Проверить наличие товаров
```json
{
  "available": true,
  "unavailable": [],
  "checked": ["latte", "espresso"]
}
```

### POST /inventory/use
Использовать товары (уменьшить количество)
```json
{
  "items": ["latte", "espresso"]
}
```

### POST /inventory/add
Добавить новый товар или пополнить существующий
```json
{
  "item": "latte",
  "quantity": 10
}
```

Для нового товара:
```json
{
  "item": "frappe",
  "name": "Frappe",
  "quantity": 20,
  "price": 5.99
}
```

### GET /inventory/stats
Получить статистику инвентаря
```json
{
  "totalItems": 6,
  "totalQuantity": 250,
  "totalValue": "1234.50",
  "lowStock": [...],
  "mostStocked": {...},
  "leastStocked": {...}
}
```

## Переменные окружения
- `PORT` - порт сервера (по умолчанию 3002)

## Запуск

### Локально
```bash
npm install
npm start
```

### С помощью Docker
```bash
docker build -t inventory-service .
docker run -p 3002:3002 inventory-service
```

### С помощью Docker Compose (рекомендуется)
```bash
docker-compose up inventory-service
```

## Примеры использования

### Просмотр инвентаря
```bash
curl http://localhost:3002/inventory
```

### Проверка наличия товаров
```bash
curl "http://localhost:3002/inventory/check?items=latte,espresso"
```

### Добавление товара
```bash
curl -X POST http://localhost:3002/inventory/add \
  -H "Content-Type: application/json" \
  -d '{"item": "latte", "quantity": 10}'
```

### Получение статистики
```bash
curl http://localhost:3002/inventory/stats
```
