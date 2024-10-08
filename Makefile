SHELL = /bin/sh

CURRENT_UID := $(shell id -u)
CURRENT_GID := $(shell id -g)

export CURRENT_UID
export CURRENT_GID

docker-base = docker-compose -p dh -f docker-compose.base.yml
docker-mock = docker-compose -p dh -f docker-compose.base.yml -f docker-compose.mock.yml
docker-e2e = docker-compose -p dh -f docker-compose.base.yml -f docker-compose.e2e.frontend.yml -f docker-compose.e2e.backend.yml -f docker-compose.services.yml
docker-dev = COMPOSE_HTTP_TIMEOUT=300 docker-compose -p dh -f docker-compose.base.yml -f docker-compose.frontend.dev.yml

wait-for-frontend = dockerize -wait tcp://localhost:3000/pingdom -timeout 5m -wait-retry-interval 5s
wait-for-redis = dockerize -wait tcp://redis:6379 -timeout 5m


ifdef CI
	start-command = up --build --force-recreate -d
	cypress-args = -- --parallel --record --key $(CYPRESS_DASHBOARD_KEY) --ci-build-id $(CIRCLE_BUILD_NUM)
	log-command = logs --follow
else
	start-command = up --build --force-recreate
	cypress-args =
	log-command = version
endif

ifdef CI
	start-command = up --build --force-recreate -d
	cypress-spec-args = -- --spec $(SPEC_FILES)
	log-command = logs --follow
else
	start-command = up --build --force-recreate
	cypress-spec-args =
	log-command = version
endif

# Helper commands to execute docker-compose for a specific setup
# e.g. "`make base` logs"
base:
	@echo $(docker-base)
mock:
	@echo $(docker-mock)
e2e:
	@echo $(docker-e2e)
dev:
	@echo $(docker-dev)

start-base:
	@echo "*** To stop this stack run 'make stop-base' ***"
	$(docker-base) $(start-command)
	$(docker-base) $(log-command) &
start-mock:
	@echo "*** To stop this stack run 'make stop-mock' ***"
	$(docker-mock) $(start-command)
	$(docker-mock) $(log-command) &
start-e2e-lep:
	@echo "*** To stop this stack run 'make stop-e2e' ***"
	OAUTH2_DEV_TOKEN=lepStaffToken $(docker-e2e) $(start-command)
	$(docker-e2e) $(log-command) &
start-e2e-da:
	@echo "*** To stop this stack run 'make stop-e2e' ***"
	OAUTH2_DEV_TOKEN=daStaffToken $(docker-e2e) $(start-command)
	$(docker-e2e) $(log-command) &
start-e2e-dit:
	@echo "*** To stop this stack run 'make stop-e2e' ***"
	OAUTH2_DEV_TOKEN=ditStaffToken $(docker-e2e) $(start-command)
	$(docker-e2e) $(log-command) &
start-dev:
	@echo "*** To stop this stack run 'make stop-dev' ***"
	@echo "*** IMPORTANT This will now use ../data-hub-api/.env for 'api' and 'rq' services ***"
	$(MAKE) -C ../data-hub-api start-dev
	$(docker-dev) $(start-command)

stop-base:
	$(docker-base) down -v --remove-orphans
stop-mock:
	$(docker-mock) down -v --remove-orphans
stop-e2e:
	$(docker-e2e) down -v --remove-orphans
stop-dev:
	$(MAKE) -C ../data-hub-api stop-dev
	$(docker-dev) down -v --remove-orphans

lint:
ifdef CI
	$(docker-base) build frontend
endif
	$(docker-base) run --no-deps --rm frontend bash -c 'mkdir -p reports && npm run lint:js -- --format junit --output-file reports/eslint.xml'

unit-tests:
ifdef CI
	$(docker-base) build frontend
	$(docker-base) run --rm frontend bash -c '$(wait-for-redis) && npx nyc --reporter=lcov --reporter=json --report-dir=coverage npm run test:unit -- --reporter mocha-junit-reporter'
else
	$(docker-base) run --rm frontend bash -c '$(wait-for-redis) && npm run test:unit'
endif

unit-client-tests:
ifdef CI
	$(docker-base) build frontend
endif
	$(docker-base) run --no-deps --rm frontend bash -c 'npm run test:unit-client -- --reporter mocha-junit-reporter'

functional-tests:
	@echo "*** Requires the mock stack, it can be started with 'make start-mock' ***"
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) && npm run test:functional $(cypress-spec-args)'

a11y-tests:
	@echo "*** Requires the mock stack, it can be started with 'make start-mock' ***"
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) && npm run test:a11y'
	
e2e-tests-lep:
	@echo "*** Requires the e2e stack with the LEP role, it can be started with 'make start-e2e-lep' ***"
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:lep $(cypress-args)'

e2e-tests-da:
	@echo "*** Requires the e2e stack with the DA role, it can be started with 'make start-e2e-da' ***"
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:da $(cypress-args)'

e2e-tests-dit:
	@echo "*** Requires the e2e stack with the DBT role, it can be started with 'make start-e2e-dit' ***"
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:dit $(cypress-args)'

component-tests:
ifdef CI
	$(docker-base) build frontend
endif
	$(docker-base) run --no-deps --rm frontend bash -c 'npm run test:component'

clean:
	make stop-base
	make stop-mock
	make stop-e2e
	make stop-dev
