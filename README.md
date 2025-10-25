# Coffee Shop Microservices Project

## О проекте

Проект демонстрирует реализацию микросервисной архитектуры для управления кофейней. Система состоит из двух взаимодействующих микросервисов, развернутых в Docker контейнерах.

### Основные компоненты:

1. **Order Service** - Сервис управления заказами
2. **Inventory Service** - Сервис управления инвентарем

### Взаимодействие сервисов

- Order Service проверяет наличие товаров через API Inventory Service
- При создании заказа автоматически обновляется количество товаров
- Каждый сервис может работать независимо (graceful degradation)
- Взаимодействие происходит через HTTP REST API

## Функциональность

### Order Service
- ✅ Создание новых заказов
- ✅ Просмотр всех заказов
- ✅ Получение деталей заказа
- ✅ Обновление статуса заказа
- ✅ Удаление заказов
- ✅ Автоматическая проверка наличия товаров

### Inventory Service
- ✅ Просмотр всего инвентаря
- ✅ Информация о конкретном товаре
- ✅ Проверка наличия товаров
- ✅ Использование товаров (уменьшение количества)
- ✅ Добавление/пополнение товаров
- ✅ Статистика инвентаря

## Установка и запуск

### Предварительные требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) установлен и запущен
- Git (для клонирования репозитория)

### Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/darklaitt/coffee-shop-website.git
cd coffee-shop-website

# Запуск всех сервисов
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f

# Проверка работоспособности
curl http://localhost:3001/health
curl http://localhost:3002/health
```

### Доступ к сервисам

После запуска сервисы будут доступны по адресам:
- **Order Service**: http://localhost:3001
- **Inventory Service**: http://localhost:3002

### Остановка сервисов

```bash
docker-compose down
```

## API Документация

### Order Service (Port 3001)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/` | Главная страница сервиса |
| GET | `/health` | Health check |
| GET | `/orders` | Получить все заказы |
| GET | `/orders/:id` | Получить заказ по ID |
| POST | `/orders` | Создать новый заказ |
| PATCH | `/orders/:id/status` | Обновить статус заказа |
| DELETE | `/orders/:id` | Удалить заказ |

#### Пример создания заказа:

**PowerShell:**
```powershell
$order = @{
    customerName = "Иван Иванов"
    items = @("latte", "espresso")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/orders" -Method POST -Body $order -ContentType "application/json"
```

**Bash:**
```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName": "Иван Иванов", "items": ["latte", "espresso"]}'
```

### Inventory Service (Port 3002)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/` | Главная страница сервиса |
| GET | `/health` | Health check |
| GET | `/inventory` | Получить весь инвентарь |
| GET | `/inventory/:item` | Получить информацию о товаре |
| GET | `/inventory/check` | Проверить наличие товаров |
| POST | `/inventory/use` | Использовать товары |
| POST | `/inventory/add` | Добавить товары |
| GET | `/inventory/stats` | Получить статистику |

#### Доступные товары:

| Название | Количество | Цена |
|----------|------------|------|
| Espresso | 50 | $3.99 |
| Latte | 45 | $4.99 |
| Cappuccino | 40 | $4.49 |
| Americano | 60 | $3.49 |
| Mocha | 30 | $5.49 |
| Macchiato | 25 | $4.29 |

## 🛠️ Технологии

### Backend
- **Node.js** - Среда выполнения JavaScript
- **Express.js** - Веб-фреймворк
- **Axios** - HTTP клиент для межсервисного взаимодействия
- **CORS** - Поддержка кросс-доменных запросов

### DevOps
- **Docker** - Контейнеризация приложений
- **Docker Compose** - Оркестрация контейнеров
- **Docker Networks** - Изолированная сеть для микросервисов

### Инфраструктура
- **RESTful API** - Архитектурный стиль для взаимодействия
- **Microservices Architecture** - Паттерн проектирования
- **Health Checks** - Мониторинг работоспособности
