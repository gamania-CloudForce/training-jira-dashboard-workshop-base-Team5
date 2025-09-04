# Jira Dashboard Workshop - Docker 快速指令

.PHONY: help build up down restart logs clean install test

# 預設目標
help: ## 顯示說明
	@echo "🐳 Jira Dashboard Workshop - Docker 指令"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# 基本操作
build: ## 建構所有容器
	docker compose build

up: ## 啟動所有服務
	docker compose up

up-d: ## 在背景啟動所有服務
	docker compose up -d

down: ## 停止所有服務
	docker compose down

restart: ## 重啟所有服務
	docker compose restart

# 開發指令
dev: ## 開發模式啟動 (with build)
	docker compose up --build

logs: ## 查看所有服務 logs
	docker compose logs -f

logs-frontend: ## 查看前端 logs
	docker compose logs -f frontend

logs-backend: ## 查看 .NET 後端 logs
	docker compose logs -f backend-dotnet

# 進入容器
shell-frontend: ## 進入前端容器
	docker compose exec frontend sh

shell-backend: ## 進入 .NET 後端容器
	docker compose exec backend-dotnet bash

# 測試和檢查
ps: ## 查看服務狀態
	docker compose ps

test-frontend: ## 執行前端測試
	docker compose exec frontend npm test

test-backend: ## 執行 .NET 後端測試
	docker compose exec backend-dotnet dotnet test

test: ## 執行所有測試
	@echo "🧪 執行前端測試..."
	@docker compose exec frontend npm test
	@echo "🧪 執行 .NET 後端測試..."
	@docker compose exec backend-dotnet dotnet test

health: ## 檢查服務健康狀態
	@echo "🔍 檢查前端服務..."
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ 前端正常" || echo "❌ 前端異常"
	@echo "🔍 檢查 .NET 後端服務..."
	@curl -f http://localhost:8001/api/table/summary > /dev/null 2>&1 && echo "✅ .NET 後端正常" || echo "❌ .NET 後端異常"

# 清理操作
clean: ## 清理容器和 images
	docker compose down --rmi all

clean-all: ## 完全清理 (包含 volumes)
	docker compose down --rmi all -v
	docker system prune -f

# 安裝和設定
install: ## 安裝專案依賴 (在容器內)
	docker compose exec frontend npm install
	docker compose exec backend-dotnet dotnet restore

# 課程專用指令
workshop-start: ## 🎯 課程開始 - 啟動所有服務
	@echo "🚀 啟動 Jira Dashboard Workshop 環境..."
	docker compose up --build -d
	@echo "⏳ 等待服務啟動..."
	@sleep 10
	@make health
	@echo ""
	@echo "🎉 環境已就緒！"
	@echo "📱 前端: http://localhost:3000"
	@echo "🔧 .NET 後端: http://localhost:8001"

workshop-stop: ## 🛑 課程結束 - 停止所有服務
	@echo "🛑 停止 Workshop 環境..."
	docker compose down
	@echo "✅ 環境已停止"

workshop-reset: ## 🔄 重置環境 (故障排除用)
	@echo "🔄 重置 Workshop 環境..."
	docker compose down --rmi all -v
	docker compose up --build -d
	@sleep 10
	@make health
	@echo "✅ 環境已重置"

# 快速指令別名
start: workshop-start ## 別名: 啟動環境
stop: workshop-stop ## 別名: 停止環境
reset: workshop-reset ## 別名: 重置環境