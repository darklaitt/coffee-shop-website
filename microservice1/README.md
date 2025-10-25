# Order Service (Микросервис управления заказами)

## Описание
Микросервис для управления заказами в кофейне. Обрабатывает создание, получение и обновление заказов, а также взаимодействует с Inventory Service для проверки наличия товаров.

## Функциональность
- Создание новых заказов
- Просмотр всех заказов
- Получение информации о конкретном заказе
- Обновление статуса заказа
- Удаление заказов
- Проверка наличия товаров через Inventory Service

## API Endpoints

### GET /
Главная страница с описанием сервиса и доступных endpoints

### GET /health
Проверка работоспособности сервиса
```json
{
  "status": "OK",
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

### GET /orders
Получить все заказы
```json
{
  "total": 2,
  "orders": [...]
}
```

### GET /orders/:id
Получить заказ по ID

### POST /orders
Создать новый заказ
```json
{
  "customerName": "Иван Иванов",
  "items": ["latte", "espresso"]
}
```

Ответ:
```json
{
  "message": "Заказ успешно создан",
  "order": {
    "id": 1,
    "customerName": "Иван Иванов",
    "items": ["latte", "espresso"],
    "status": "pending",
    "total": 11.98,
    "createdAt": "2025-10-25T12:00:00.000Z"
  }
}
```

### PATCH /orders/:id/status
Обновить статус заказа
```json
{
  "status": "completed"
}
```

### DELETE /orders/:id
Удалить заказ

## Переменные окружения
- `PORT` - порт сервера (по умолчанию 3001)
- `INVENTORY_SERVICE_URL` - URL Inventory Service (по умолчанию http://microservice2:3002)

## Запуск

### Локально
```bash
npm install
npm start
```

### С помощью Docker
```bash
docker build -t order-service .
docker run -p 3001:3001 order-service
```

### С помощью Docker Compose (рекомендуется)
```bash
docker-compose up order-service
```

## Примеры использования

### Создание заказа
```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName": "Иван", "items": ["latte", "cappuccino"]}'
```

### Получение всех заказов
```bash
curl http://localhost:3001/orders
```

### Обновление статуса заказа
```bash
curl -X PATCH http://localhost:3001/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```
