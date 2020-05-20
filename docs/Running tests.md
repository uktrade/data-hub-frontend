# Running tests

## Creating Docker container for CircleCI

```bash
export VERSION=3.5.0 # Increment this version each time when you edit Dockerfile.

docker login # Ask webops for Docker Hub access to the ukti group.
docker build -f test/Dockerfile -t data-hub-frontend-test .

docker tag data-hub-frontend-test:latest ukti/data-hub-frontend-test:${VERSION}
docker tag data-hub-frontend-test:latest ukti/data-hub-frontend-test:latest

docker push ukti/data-hub-frontend-test:${VERSION}
docker push ukti/data-hub-frontend-test:latest
```

You image should be now listed at [Docker Hub](https://cloud.docker.com/u/ukti/repository/docker/ukti/data-hub-frontend-test/tags).

## Executing CircleCI jobs locally

Not all the jobs currently can be executed locally.

```bash
curl -fLSs https://circle.ci/cli | bash
circleci local execute --job unit_tests
circleci local execute --job unit_client_tests
```

## Coding standards

Prettier and Sass linter will run as part of the build, assure you run the command below before committing:

`$ yarn test:lint`

## Functional Tests

The aim of this test suite is perform functional tests of frontend components in isolation.

### Setup

You will need to run the sandbox api to run functional tests.

Sandbox is as a light replacement for API backend and it's used only by functional tests.

### Using sandbox within docker (preferred method)

1. cd into `data-hub-frontend` and run `docker-compose up`. This will start up the sandbox api in conjunction with the frontend, mock-sso, webpack and redis. You don't need to rebuild the image when you make changes.

### Using sandbox within docker with local frontend

1. cd into `test/sandbox` and run `docker run --rm --name data-hub-sandbox -it -p 8001:8001 data-hub-sandbox`.

2. Change your `API_ROOT` in your env file to point to `http://mock-backend:8001` and then run the frontend locally with `yarn develop`.

3. If you make changes to sandbox rebuild docker with `docker build -t data-hub-sandbox`.

### Using sandbox on host machine

1. Install sandbox, for more info see [instructions](https://github.com/getsandbox/sandbox)

```bash
wget https://github.com/getsandbox/sandbox/releases/download/1.1.0/sandbox-runtime.tar \
  && tar -C /usr/local/bin -xzvf sandbox-runtime.tar \
  && mv /usr/local/bin/sandbox-runtime /usr/local/bin/sandbox \
  && rm sandbox-runtime.tar
```

2. Start sandbox on port `8001`:

   ```bash
   sandbox run --port="8001" --watch=true
   ```

`$ yarn`

### Running the tests

Notice that before running the tests the application should be up and running.

By default cypress will run on electron headlessly, you can read more about it [here](https://docs.cypress.io/guides/core-concepts/launching-browsers.html#Electron-Browser)

If you are not running the sandbox through docker using the preferred method and want to run against your native implementation you will need to pass an additional argument to the below commands:

`--config baseUrl=http://localhost:3000`

Execute all the tests on `specs` in chrome browser:

`$ yarn test:functional -- --browser chrome`

### Running the tests manually in cypress interface

`$ yarn test:functional:watch`

### Running a specific spec

`$ yarn test:functional -- --spec test/functional/cypress/specs/nav-spec.js`

## E2E Tests

The aim of this test suite is perform end to end tests, simulating a user flow.

### Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v10 installed then install dependencies:

`$ yarn`

### Running the tests

Notice that before running the tests the application should be up and running.

You will also need data hub api application started with the initial fixutres loaded. This can be done
by running `start-uat.sh` located on the root of the api repository.

The main e2e test suite is triggered by running the following command:

`$ yarn test:e2e:dit -- --browser chrome`

### Setting up users with different permissions

On CircleCi we run E2E tests against users with different permissions. We do this via the environment variable `OAUTH2_DEV_TOKEN`.
Essentially we have users with different permissions setup in a job via `OAUTH2_DEV_TOKEN` and then we run tests with the specified permissions tag.
So for setting up a test for a user of type `LEP` you need to:

- add a token to the backend with a token associated to the permissions type. e.g `lepStaffToken`
- add this token to the environment variable `OAUTH2_DEV_TOKEN` in the circleCi job
- specify which suite to use when running `cypress`. e.g `npm run yarn test:e2e:lep -- --browser chrome`

### Permission tags

There are also 3 other test suites, which run permission specs against users that have particular
permissions for their roles, you can trigger these tests by running either of the commands below:

`$ yarn test:e2e:lep -- --browser chrome`

or

`$ yarn test:e2e:da -- --browser chrome`

or

`$ yarn test:e2e:dit -- --browser chrome`

### Running the tests manually in cypress interface

`$ yarn test:e2e:watch`

### Running a specific spec

`$ yarn test:e2e:dit -- --spec test/end-to-end/cypress/specs/DIT/local-nav-spec.js`

## Visual Tests

The aim of this suite is taking screenshots from pages and comparing to baselines
to ensure consistency between builds.

### Folder structure

Screenshots will be stored in the root of the project. We commit the baselines and ignore the comparison diff images. If we need to update the baseline screenshot we need to delete the old baseline and rerun the test (it will then copy the new screenshot saved in comparison folder into the baseline folder)

```
- visual-screenshots
  - baseline
  - comparison
  - diff
```

### Browserstack environment variables

Before attempting to run the tests, copy `.bin.sample/visual` into `.bin/` folder
and update the browserstack username and key environment variables.

Also, copy `visual-stack.sample.env` to `visual-stack.env` and add the correct environment variables.

### Running the tests

Execute the command below:

`$ ./.bin/visual`

### Updating the baseline image

Updating the baseline consists in 2 steps:

- 1:. Run the visual tests on your machine, if the baseline is no longer the correct representation of the page in test then execute step #2:

- 2:. Run `$ yarn test:visual:update` to update the failed tests with updated images of how the page in test should look like.

### Creating Docker container for CircleCI

Docker image will be automatically rebuilt on each push.

However, you can still do this manually.

```bash
docker login # Ask webops for Docker Hub access to the ukti group.
docker build -f Dockerfile -t data-hub-sandbox .

docker tag data-hub-sandbox:latest ukti/data-hub-sandbox:latest

docker push ukti/data-hub-sandbox:latest
```

You image should be now listed at [Docker Hub](https://cloud.docker.com/u/ukti/repository/docker/ukti/data-hub-sandbox/tags).

## Cypress code coverage

As part of cypress test suites (functional and e2e), code coverage reports can be generated.

### Code coverage locally

Steps:
- Ensure you NODE_ENV is either `test` or `development` in order for client side code to be instrumented.
- Start the application by running `$ yarn start:coverage`, this will ensure server side code is instrumented.
- Execute a spec or suite and look for `cypress-coverage` folder output in the root of the folder.

### Code coverage in CI

CI is configured to capture and save all code coverage reports as an artifact.
