# Основные переменные
IMAGE_NAME := nodeapp
DOCKER_COMPOSE := docker-compose

# Команды по умолчанию
.PHONY: all build run down clean test

all: build run

# Сборка Docker образа для Node.js приложения
build:
	@echo "Создание Docker образа для Node.js приложения..."
	@$(DOCKER_COMPOSE) build --no-cache nodeapp

# Запуск всего стека сервисов
run:
	@echo "Запуск всех Docker контейнеров..."
	@$(DOCKER_COMPOSE) up -d

# Остановка и удаление контейнеров
down:
	@echo "Остановка всех Docker контейнеров..."
	@$(DOCKER_COMPOSE) down

# Очистка: Удаление созданных контейнеров, сетей, томов и образов
clean:
	@echo "Очистка всех созданных ресурсов..."
	@$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans

# Запуск тестов в Docker контейнере
test:
	@echo "Тестирование приложения..."
	@$(DOCKER_COMPOSE) run --rm nodeapp npm test
