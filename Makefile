.PHONY: help build up down restart logs status

help:
	@echo "make up       Start ByteBench in the background"
	@echo "make build    Build the Docker image"
	@echo "make down     Stop the ByteBench container"
	@echo "make restart  Restart the ByteBench container"
	@echo "make logs     Follow container logs"
	@echo "make status   Show container status"

build:
	docker compose build

up:
	docker compose up --build -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up --build -d

logs:
	docker compose logs -f

status:
	docker compose ps

