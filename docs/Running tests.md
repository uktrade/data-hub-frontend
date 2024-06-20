# Running tests

## Coding standards

Prettier and Sass linter will run as part of the build, assure you run the command below before committing:

`$ npm run test:lint`

## Unit Tests

To run the whole suite:

`npm run test:unit`

To run one file:

`npm run test:unit:files relative_path_to_test/example.test.js`

## Functional Tests

The aim of this test suite is perform functional tests of frontend components in isolation.

### Setup

You will need to run the sandbox api to run functional tests.

#### Sandbox

Sandbox is as a light replacement for API backend and it's used only by functional tests.

It allows us to run a mock of the API locally and lives in the `test/sandbox` folder. Any API requests made in the app when running tests on Cypress will hit the Sandbox environment instead. The folder structure reflects the API endpoints (e.g. `/v4/activity-feed`) and the [server is set up here](https://github.com/uktrade/data-hub-frontend/blob/main/test/sandbox/server.js)

If you have any logic you want to test based on what's returned by the API you can add it to the endpoints, e.g. conditionals like if a page number param is included then it returns a different fixture.

##### Running sandbox locally

In your .env file:
Set `API_ROOT=http://localhost:8000`
Set `REDIS_HOST=localhost`
(you might want to create a `.sandbox.env` file to copy to .env when you need it)

If you want to run the frontend and sandbox locally, one way is to have 4 terminal tabs open and run the following commands:

1. `redis-server`
1. `cd test/sandbox && npm install && npx nodemon .`
1. `npm run develop`
1. `npm run test:functional:watch`

##### Using sandbox within docker

From the project root directory run `make start-mock`.

This will start up the sandbox api in conjunction with the frontend, mock-sso, webpack and redis. You don't need to rebuild the image when you make changes.

##### Using sandbox within docker and with local frontend

1. Build Sandbox image `docker build -t data-hub-sandbox ./test/sandbox`

2. Start the container with `docker run -it -p 8000:8000 data-hub-sandbox`

3. Change your `API_ROOT` in your env file to point to `http://localhost:8000` and then run the frontend locally with `npm run develop`.

#### Running the tests

Notice that before running the tests the application should be up and running.

By default cypress will run on electron headlessly, you can read more about it [here](https://docs.cypress.io/guides/core-concepts/launching-browsers.html#Electron-Browser)

If you are not running the sandbox through docker using the preferred method and want to run against your native implementation you will need to pass an additional argument to the below commands:

`--config baseUrl=http://localhost:3000`

Execute all the tests on `specs` in chrome browser:

`$ npm run test:functional -- --browser chrome`

##### Running the tests manually in cypress interface

`$ npm run test:functional:watch`

##### Running a specific spec

`$ npm run test:functional -- --spec test/functional/cypress/specs/nav-spec.js`

## E2E Tests

The aim of this test suite is perform end to end tests, simulating a user flow.

### Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v10 installed then install dependencies:

`$ npm install`

### Setting up E2E tests within docker (preferred method)

1. In `test/cypress/support/commands.js`, find the `loadFixture` Cypress command and change `${backend_url}` to `http://localhost:8000`.

2. In `docker-compose.e2e.frontend.yml`, change the environment variable `OAUTH2_AUTH_URL` to point to `http://localhost:8080/o/authorize`.

3. Run the relevant make command, for example `make start-e2e-dit`.

### Setting up E2E tests within docker and with local frontend

1. Add `ALLOW_TEST_FIXTURE_SETUP=True` to `.env` in Data Hub API.

### Activity feed

Events displayed inside Datahub are provided via the [activity stream API](https://github.com/uktrade/activity-stream), which wraps an OpenSearch cluster. Events created as part of any test runs need to be visible to the activity stream so they can be viewed in the events page. The activity stream polls the Datahub API to ingest any new events created, so the `docker-compose.yml` file uses environment variables to setup the access keys to allow the communication between these 2 systems:

#### The API environment variables that define the access keys that need to be used when activity stream call the events endpoint

```
ACTIVITY_STREAM_ACCESS_KEY_ID: some-id
ACTIVITY_STREAM_INCOMING_ACCESS_KEY_ID: some-id
ACTIVITY_STREAM_SECRET_ACCESS_KEY: some-secret
ACTIVITY_STREAM_INCOMING_SECRET_ACCESS_KEY: some-secret
```

#### The activity stream environment variables that set the API as a feed to call to ingest data from. The FEEDS**1**ACCESS_KEY_ID and FEEDS**1**SECRET_ACCESS_KEY values match the values defined in the API environment variables

```
FEEDS__1__UNIQUE_ID=verification_feed_app
FEEDS__1__SEED=http://api:8000/v3/activity-stream/event
FEEDS__1__ACCESS_KEY_ID=some-id
FEEDS__1__SECRET_ACCESS_KEY=some-secret
FEEDS__1__TYPE=activity_stream
```

The activity stream has a 2 way relationship with datahub - in addition to polling the Datahub API for any new events that can be ingested into the OpenSearch DB, it also provides an API that allows searching of the events it holds. Environment varaibles are again used to control access between these 2 systems

#### The activity stream environment variables that define the access keys that need to be provided when any queries are made

```
INCOMING_ACCESS_KEY_PAIRS__1__KEY_ID=incoming-some-id-1
INCOMING_ACCESS_KEY_PAIRS__1__SECRET_KEY=incoming-some-secret-1
```

#### The API environment variables that set the activity stream endpoint to use to get a list of events

Please see for [here](#ngnix-reverse-proxy) more detail about the reason for a reverse proxy

```
ACTIVITY_STREAM_OUTGOING_URL: http://activity-feed-reverseproxy:8081/v2/activities
ACTIVITY_STREAM_OUTGOING_ACCESS_KEY_ID: incoming-some-id-1
ACTIVITY_STREAM_OUTGOING_SECRET_ACCESS_KEY: incoming-some-secret-1
```

#### Ngnix reverse proxy

The E2E tests make use of an ngnix container to replicate the GOV PAAS functionality. The activity stream requires specific HTTP Headers to be included that are provided by GOV PAAS, nginx is used here to attach those headers to all requests to the activity stream without requiring any code changes

### Running the tests

Notice that before running the tests the application should be up and running.

You will also need data hub api application started with the initial fixutres loaded. This can be done
by running `start-uat.sh` located on the root of the api repository.

The main e2e test suite is triggered by running the following command:

`$ npm run test:e2e:dit -- --browser chrome`

### Setting up users with different permissions

On CircleCi we run E2E tests against users with different permissions. We do this via the environment variable `OAUTH2_DEV_TOKEN`.
Essentially we have users with different permissions setup in a job via `OAUTH2_DEV_TOKEN` and then we run tests with the specified permissions tag.
So for setting up a test for a user of type `LEP` you need to:

- add a token to the backend with a token associated to the permissions type. e.g `lepStaffToken`
- add this token to the environment variable `OAUTH2_DEV_TOKEN` in the circleCi job
- specify which suite to use when running `cypress`. e.g `npm run test:e2e:lep -- --browser chrome`

### Permission tags

There are also 3 other test suites, which run permission specs against users that have particular
permissions for their roles, you can trigger these tests by running either of the commands below:

`$ npm run test:e2e:lep -- --browser chrome`

or

`$ npm run test:e2e:da -- --browser chrome`

or

`$ npm run test:e2e:dit -- --browser chrome`

### Running the tests manually in cypress interface

`$ npm run test:e2e:watch`

### Running a specific spec

`$ npm run test:e2e:dit -- --spec test/end-to-end/cypress/specs/DIT/local-nav-spec.js`

## Accessibility tests

The aim of this suite is to ensure our HTML pages are usable by as many people as possible.

Details for running and configuring these test can be found here - [Running accessibility tests](../test/a11y/cypress/config/readme.md)

## Component tests

The aim of this suite is to run tests directly against our React components without having to start the frontend.

To start these tests, run `npm run test:component`. To run these using the Cypress component testing interface, run `npm run test:component:watch`.

## Cypress code coverage

As part of cypress test suites (functional and e2e), code coverage reports can be generated.

### Code coverage locally

Steps:

- Ensure you NODE_ENV is either `test` or `development` in order for client side code to be instrumented.
- Start the application by running `$ npm run start:coverage`, this will ensure server side code is instrumented.
- Execute a spec or suite and look for `cypress-coverage` folder output in the root of the folder.

### Code coverage in CI

CI is configured to capture and save all code coverage reports as an artifact.
