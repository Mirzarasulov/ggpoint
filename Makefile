# GGPoint — shortcuts.
# Usage: `make <target>`, или `make help` чтобы увидеть весь список.

SHELL := /bin/bash
.DEFAULT_GOAL := help

# ---------- Helpers ----------

.PHONY: help
help: ## Показать этот список команд
	@awk 'BEGIN {FS = ":.*##"; printf "\nAvailable targets:\n\n"} /^[a-zA-Z0-9_.-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ---------- Setup ----------

.PHONY: install
install: ## Установить npm-зависимости
	npm install

.PHONY: setup
setup: install db.generate db.migrate db.seed ## Первичная настройка после клона репо (install + generate + migrate + seed)
	@echo "✓ Setup complete. Run \`make dev\` to start."

# ---------- Dev / build ----------

.PHONY: dev
dev: ## Запустить Next.js dev-сервер (localhost:3000)
	npm run dev

.PHONY: build
build: ## Production build
	npm run build

.PHONY: start
start: ## Запустить production-сервер (после build)
	npm run start

.PHONY: typecheck
typecheck: ## Прогнать TypeScript без эмита
	npx tsc --noEmit

# ---------- Prisma ----------

.PHONY: db.generate
db.generate: ## Сгенерировать Prisma Client из schema.prisma
	npx prisma generate

.PHONY: db.migrate
db.migrate: ## Создать и применить миграцию dev (`make db.migrate NAME=add_field`)
	npx prisma migrate dev $(if $(NAME),--name $(NAME),)

.PHONY: db.migrate.create
db.migrate.create: ## Создать миграцию без применения, для ручного редактирования SQL (`make db.migrate.create NAME=...`)
	npx prisma migrate dev --create-only $(if $(NAME),--name $(NAME),)

.PHONY: db.diff
db.diff: ## Сгенерировать SQL миграции из schema.prisma → stdout (для review)
	npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script 2>/dev/null

.PHONY: db.deploy
db.deploy: ## Применить все pending миграции (для prod / CI)
	npx prisma migrate deploy

.PHONY: db.seed
db.seed: ## Заполнить БД начальными данными (валюты, категории, товары)
	npm run db:seed

.PHONY: db.studio
db.studio: ## Открыть Prisma Studio (web-интерфейс для БД)
	npx prisma studio

.PHONY: db.psql
db.psql: ## Открыть psql к Neon (требуется установленный psql)
	@psql "$$(grep '^DATABASE_URL' .env.local | cut -d= -f2- | tr -d '"')"

# ---------- Cleanup ----------

.PHONY: clean.cache
clean.cache: ## Очистить .next кэш (безопасно — восстанавливается при make dev)
	rm -rf .next
