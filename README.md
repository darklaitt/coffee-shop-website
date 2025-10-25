# ☕ Coffee Shop Microservices Project

> Проект микросервисной архитектуры для управления кофейней с использованием Docker и Node.js

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

## 📋 Содержание

- [О проекте](#о-проекте)
- [Архитектура](#архитектура)
- [Функциональность](#функциональность)
- [Установка и запуск](#установка-и-запуск)
- [API Документация](#api-документация)
- [Тестирование](#тестирование)
- [Структура проекта](#структура-проекта)
- [Технологии](#технологии)

## 🎯 О проекте

Проект демонстрирует реализацию микросервисной архитектуры для управления кофейней. Система состоит из двух взаимодействующих микросервисов, развернутых в Docker контейнерах.

### Основные компоненты:

1. **Order Service** - Сервис управления заказами
2. **Inventory Service** - Сервис управления инвентарем

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                          │
│  ┌─────────────────┐           ┌─────────────────────┐    │
│  │  Order Service  │──────────▶│ Inventory Service   │    │
│  │   (port 3001)   │           │    (port 3002)      │    │
│  │                 │◀──────────│                     │    │
│  │  - Создание     │  HTTP API │  - Проверка наличия │    │
│  │    заказов      │           │  - Обновление       │    │
│  │  - Управление   │           │    количества       │    │
│  │    статусами    │           │  - Статистика       │    │
│  └─────────────────┘           └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Взаимодействие сервисов

- Order Service проверяет наличие товаров через API Inventory Service
- При создании заказа автоматически обновляется количество товаров
- Каждый сервис может работать независимо (graceful degradation)
- Взаимодействие происходит через HTTP REST API

## ✨ Функциональность

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

## 🚀 Установка и запуск

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

## 📚 API Документация

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

## 🧪 Тестирование

### Автоматическое тестирование

**Windows (PowerShell):**
```powershell
.\test-microservices.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x test-microservices.sh
./test-microservices.sh
```

Тестовый скрипт выполняет:
1. Проверку работоспособности сервисов
2. Тестирование всех API endpoints
3. Проверку взаимодействия между микросервисами
4. Создание тестовых заказов и обновление инвентаря

### Ручное тестирование

**Проверка инвентаря:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3002/inventory"
```

**Создание заказа:**
```powershell
$order = @{
    customerName = "Тестовый пользователь"
    items = @("latte", "cappuccino")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/orders" -Method POST -Body $order -ContentType "application/json"
```

**Просмотр заказов:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/orders"
```

## 📁 Структура проекта

```
coffee-shop/
├── microservice1/              # Order Service
│   ├── server.js              # Основной сервер
│   ├── package.json           # Зависимости Node.js
│   ├── Dockerfile             # Docker конфигурация
│   ├── .dockerignore          # Исключения Docker
│   └── README.md              # Документация сервиса
│
├── microservice2/              # Inventory Service
│   ├── server.js              # Основной сервер
│   ├── package.json           # Зависимости Node.js
│   ├── Dockerfile             # Docker конфигурация
│   ├── .dockerignore          # Исключения Docker
│   └── README.md              # Документация сервиса
│
├── docker-compose.yml          # Оркестрация Docker
├── test-microservices.ps1      # Тестовый скрипт (PowerShell)
├── test-microservices.sh       # Тестовый скрипт (Bash)
├── MICROSERVICES.md            # Подробная документация
├── INSTALLATION.md             # Инструкция по установке
├── .gitignore                  # Git исключения
└── README.md                   # Этот файл
```

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

## 📖 Дополнительная документация

- [MICROSERVICES.md](MICROSERVICES.md) - Подробная документация по архитектуре
- [INSTALLATION.md](INSTALLATION.md) - Детальная инструкция по установке
- [microservice1/README.md](microservice1/README.md) - Документация Order Service
- [microservice2/README.md](microservice2/README.md) - Документация Inventory Service

## 🔧 Полезные команды

### Docker Compose
```bash
# Запуск сервисов
docker-compose up -d

# Пересборка образов
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f

# Просмотр запущенных контейнеров
docker-compose ps

# Остановка сервисов
docker-compose down

# Полная очистка (включая образы)
docker-compose down --rmi all -v
```

### Docker
```bash
# Просмотр контейнеров
docker ps

# Вход в контейнер
docker exec -it coffee-shop-order-service sh

# Просмотр логов
docker logs coffee-shop-order-service

# Просмотр использования ресурсов
docker stats
```

## 🚨 Устранение неполадок

### Docker не запускается
1. Убедитесь, что Docker Desktop установлен
2. Запустите Docker Desktop вручную
3. Проверьте, что виртуализация включена в BIOS

### Порт уже занят
```powershell
# Windows PowerShell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Контейнеры не взаимодействуют
```bash
# Пересоздание контейнеров
docker-compose down
docker-compose up -d --build

# Проверка логов
docker-compose logs
```

## 📝 Лицензия

ISC

## 👥 Авторы

DevOps Project - МИРЭА 2025

## 🤝 Вклад в проект

Пул-реквесты приветствуются! Для крупных изменений сначала откройте issue для обсуждения предлагаемых изменений.

## 📞 Контакты

При возникновении вопросов создавайте Issue в репозитории GitHub.

---

⭐ Если вам понравился проект, поставьте звезду на GitHub!
