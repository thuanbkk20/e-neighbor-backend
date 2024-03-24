alias = e-neighbor

ifeq (create-migrate,$(firstword $(MAKECMDGOALS)))
  # use the rest as arguments for "run"
  MIGRATION_NAME := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(MIGRATION_NAME):;@:)
endif

default: up

bootstrap:

	echo "Create .env file..."
	cp .env.example .env

	npm install
	make up
	make up-migrate
	npm run start:dev

up:
	docker-compose up -d --remove-orphans --build

up-watch:
	docker-compose up --build --remove-orphans

dev-up:
	docker-compose up -d --remove-orphans
	npm run start:dev

down:
	docker-compose down

ps:
	docker-compose ps

up-migrate:
	npm run migration:run

down-migrate:
	npm run migration:revert

create-migrate:
	npm run migration:create ./src/database/migrations/${MIGRATION_NAME}

generate-migrate:
	npm run migration:generate -- ./src/database/migrations/${MIGRATION_NAME}

generate-seed-container:
	docker-compose exec e-neighbor-api npm run seed:run

fork-kill-dev:
	lsof -t -i tcp:3000 | xargs kill
